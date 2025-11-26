import { type RhinestoneAccount, RhinestoneSDK, type TransactionResult, walletClientToAccount } from '@rhinestone/sdk'
import {
  type Config,
  createConfig,
  type GetConnectionReturnType,
  getConnection,
  connect as wagmiConnect,
  disconnect as wagmiDisconnect,
  watchConnection
} from '@wagmi/core'
import { erc20Abi } from 'abitype/abis'
import { awaitPromises, type IStream, map, op, switchMap } from 'aelea/stream'
import { fromCallback, state } from 'aelea/stream-extended'
import { Dialog, Mode } from 'porto'
import {
  type Abi,
  type Call,
  type Chain,
  type ContractFunctionArgs,
  type ContractFunctionName,
  createPublicClient,
  createWalletClient,
  custom,
  fallback,
  formatUnits,
  http,
  type PublicClient,
  type ReadContractParameters,
  type ReadContractReturnType,
  type Transport,
  type WalletClient,
  type WriteContractParameters,
  webSocket
} from 'viem'
import type { Address } from 'viem/accounts'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { arbitrum } from 'viem/chains'
import { porto as portoConnector, walletConnect as walletConnectConnector } from 'wagmi/connectors'

if (!import.meta.env.VITE__WC_PROJECT_ID) {
  throw new Error('Missing WalletConnect Project ID in environment variables')
}

export type IAccountState = {
  publicClient: PublicClient<Transport, Chain>
  client: WalletClient
  address: Address
  account: RhinestoneAccount
  chainId: number
}

export type DepositPlan = {
  companionAddress: Address
  fundTransfer: {
    token: Address
    amount: bigint
    to: Address
  }
  intentRequest: {
    targetChain: number
    tokenAddress: Address
    amount: bigint
    recipient: Address
  }
  signerPrivateKey: `0x${string}`
}

export type DepositQuoteParams = {
  destinationChainId: number
  tokenAddress: Address
  amount: bigint
  userAddress: Address
  apiKey?: string
  baseUrl?: string
  sponsorSettings?: {
    gasSponsored?: boolean
    bridgeFeesSponsored?: boolean
    swapFeesSponsored?: boolean
  }
  accountAccessList?: {
    chainIds?: number[]
    tokens?: (Address | string)[]
    chainTokens?: Record<number, (Address | string)[]>
  }
}

export type DepositQuoteResponse = {
  intentOp: unknown
  intentCost?: unknown
  tokenRequirements?: Record<string, any>
  [key: string]: unknown
}

const rhinestoneSDK = new RhinestoneSDK({
  apiKey: 'proxy',
  endpointUrl: `${window.location.origin}/api/orchestrator`
})

const protoConnector = portoConnector({
  mode: Mode.dialog({
    renderer: Dialog.popup()
  })
})

export const wagmiConfig: Config = createConfig({
  chains: [arbitrum],
  connectors: [
    protoConnector,

    walletConnectConnector({
      projectId: import.meta.env.VITE__WC_PROJECT_ID,
      metadata: {
        name: 'Puppet',
        description: 'Puppet copy trading',
        url: 'https://puppet.tech',
        icons: ['https://puppet.tech/favicon.png']
      },
      showQrModal: true
    })
  ],
  transports: {
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc')
  }
})
// Transport configuration for reading blockchain data
const transport = fallback([
  webSocket(import.meta.env.VITE__WC_RPC_URL_42161_1, {}),
  webSocket(import.meta.env.VITE__WC_RPC_URL_42161_2, {}),
  http('https://arb1.arbitrum.io/rpc')
])

const connection: IStream<GetConnectionReturnType<typeof wagmiConfig>> = fromCallback(cb => {
  const initial = getConnection(wagmiConfig)
  if (initial) {
    cb(initial)
  }

  const unsubscribe = watchConnection(wagmiConfig, {
    onChange(conn) {
      cb(conn)
    }
  })

  return unsubscribe
})

const account: IStream<Promise<IAccountState | null>> = op(
  connection,
  map(async connection => {
    const connector = connection.connector

    if (connection.status === 'connecting') {
      return 'connecting' as const
    }

    if (!connector || !connection.address) {
      return null
    }

    const provider = (await connector.getProvider()) as any

    const client = createWalletClient({
      account: connection.address,
      chain: arbitrum,
      transport: custom(provider)
    })

    const accountOwner = walletClientToAccount(client)
    const rhAccount = await rhinestoneSDK.createAccount({
      owners: {
        type: 'ecdsa',
        accounts: [accountOwner]
      }
    })

    const accountState: IAccountState = {
      client,
      publicClient: createPublicClient({
        chain: arbitrum,
        transport
      }),
      address: connection.address,
      account: rhAccount,
      chainId: arbitrum.id
    }

    return accountState
  }),
  state
)

// Block change listener
const blockChange: IStream<bigint> = op(
  account,
  awaitPromises,
  switchMap(accountState => {
    if (!accountState) {
      throw new Error('No account connected')
    }

    return fromCallback(cb => {
      const unwatch = accountState.publicClient.watchBlockNumber({
        onBlockNumber: blockNumber => cb(blockNumber)
      })
      return unwatch
    })
  })
)

async function connect(preferredConnectorId?: string) {
  try {
    const targetConnector =
      wagmiConfig.connectors.find(connector => connector.id === preferredConnectorId) ?? wagmiConfig.connectors[0]

    if (!targetConnector) {
      throw new Error('No wallet connector is configured')
    }

    const result = await wagmiConnect(wagmiConfig, {
      connector: targetConnector
    })

    return result.accounts ?? []
  } catch (error: any) {
    console.log('Connection error:', error)

    // Check if user rejected the request (this is normal, not an error)
    if (error?.message?.includes('user rejected') || error?.message?.includes('User rejected')) {
      console.log('User cancelled wallet connection')
      return []
    }

    // Log other errors but don't throw them
    console.error('Failed to connect wallet:', error)
    return []
  }
}

// Disconnect wallet function using Wagmi
async function disconnect() {
  await wagmiDisconnect(wagmiConfig)
}

// Read contract function
async function read<
  TAbi extends Abi,
  TFunctionName extends ContractFunctionName<TAbi, 'view'>,
  TArgs extends ContractFunctionArgs<TAbi, 'view', TFunctionName>
>(
  accountState: IAccountState,
  parameters: ReadContractParameters<TAbi, TFunctionName, TArgs>
): Promise<ReadContractReturnType<TAbi, TFunctionName, TArgs>> {
  return accountState.publicClient.readContract(parameters as any)
}

export type IWriteContractReturn = Promise<TransactionResult>

// Write contract function
async function write<
  const TAbi extends Abi,
  TFunctionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>,
  TArgs extends ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', TFunctionName>
>(
  accountState: IAccountState,
  writeParams: Omit<WriteContractParameters<TAbi, TFunctionName, TArgs>, 'account' | 'chain'>
): IWriteContractReturn {
  try {
    const { request } = await accountState.publicClient.simulateContract({
      ...writeParams,
      account: accountState.address,
      chain: accountState.publicClient.chain
    } as any)

    const req = request as any
    const calls = [
      {
        to: req.to as Address,
        data: req.data,
        value: req.value
      }
    ]

    const result = await accountState.account.sendTransaction({
      targetChain: (accountState.publicClient.chain as any)?.id ?? arbitrum.id,
      calls
    })

    return result as TransactionResult
  } catch (error) {
    console.error('Write contract error:', error)
    throw error
  }
}

export interface IBatchCall extends Call<any, any> {}

type RhinestonePortfolioChain = {
  chainId: number
  chainName: string
  balance: string
  formattedBalance: string
  lockedBalance: string
  unlockedBalance: string
  formattedLockedBalance: string
  formattedUnlockedBalance: string
}

export type RhinestonePortfolioToken = {
  symbol: string
  totalBalance: string
  lockedBalance: string
  unlockedBalance: string
  decimals: number
  chains: RhinestonePortfolioChain[]
}

export const fetchRhinestonePortfolio = async (
  rhinestoneAccount?: RhinestoneAccount | null
): Promise<RhinestonePortfolioToken[]> => {
  if (!rhinestoneAccount) return []

  const portfolio = await rhinestoneAccount.getPortfolio()

  return portfolio
    .map(token => {
      const totalLocked = BigInt(token.balances?.locked || 0)
      const totalUnlocked = BigInt(token.balances?.unlocked || 0)

      const formattedAvailable = formatUnits(totalUnlocked, token.decimals)
      const formattedLocked = formatUnits(totalLocked, token.decimals)
      const formattedUnlocked = formatUnits(totalUnlocked, token.decimals)

      const chains: RhinestonePortfolioChain[] = (token.chains || [])
        .map(chain => {
          const locked = BigInt((chain as any).locked || 0)
          const unlocked = BigInt((chain as any).unlocked || 0)
          const chainId = Number((chain as any).chain ?? (chain as any).chainId ?? 0)

          return {
            chainId,
            chainName: String((chain as any).chainName ?? `Chain ${chainId || 'Unknown'}`),
            balance: unlocked.toString(),
            formattedBalance: formatUnits(unlocked, token.decimals),
            lockedBalance: locked.toString(),
            unlockedBalance: unlocked.toString(),
            formattedLockedBalance: formatUnits(locked, token.decimals),
            formattedUnlockedBalance: formatUnits(unlocked, token.decimals)
          }
        })
        .filter(
          chain => BigInt(chain.balance) > 0n || BigInt(chain.lockedBalance) > 0n || BigInt(chain.unlockedBalance) > 0n
        )

      const hasBalance = totalUnlocked > 0n || totalLocked > 0n || chains.length > 0

      if (!hasBalance) {
        return null
      }

      return {
        symbol: token.symbol,
        totalBalance: formattedAvailable,
        lockedBalance: formattedLocked,
        unlockedBalance: formattedUnlocked,
        decimals: token.decimals,
        chains
      }
    })
    .filter((token): token is RhinestonePortfolioToken => Boolean(token))
}

export const requestDepositQuote = async (params: DepositQuoteParams): Promise<DepositQuoteResponse> => {
  const baseUrl = params.baseUrl ?? `${window.location.origin}/api/orchestrator`
  const endpoint = `${baseUrl}/intents/route`

  const body: Record<string, any> = {
    destinationChainId: params.destinationChainId,
    tokenRequests: [
      {
        tokenAddress: params.tokenAddress,
        amount: params.amount.toString()
      }
    ],
    account: {
      address: params.userAddress,
      accountType: 'EOA'
    }
  }

  if (params.sponsorSettings) {
    body.options = { sponsorSettings: params.sponsorSettings }
  }

  if (params.accountAccessList) {
    const { chainIds, tokens, chainTokens } = params.accountAccessList
    const access: Record<string, any> = {}
    if (chainIds?.length) access.chainIds = chainIds
    if (tokens?.length) access.tokens = tokens
    if (chainTokens && Object.keys(chainTokens).length) access.chainTokens = chainTokens
    if (Object.keys(access).length) {
      body.accountAccessList = access
    }
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(params.apiKey ? { 'x-api-key': params.apiKey } : {})
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch deposit quote: ${response.statusText}`)
  }

  return (await response.json()) as DepositQuoteResponse
}

export const getDepositQuote = (args: {
  destinationChainId: number
  tokenAddress: Address
  amount: bigint
  userAddress: Address
  apiKey?: string
  baseUrl?: string
}) =>
  requestDepositQuote({
    destinationChainId: args.destinationChainId,
    tokenAddress: args.tokenAddress,
    amount: args.amount,
    userAddress: args.userAddress,
    apiKey: args.apiKey,
    baseUrl: args.baseUrl
  })

export const createCompanionAccount = async (
  ownerAddress: Address,
  signerPrivateKey?: `0x${string}`
): Promise<{ account: RhinestoneAccount; signerPrivateKey: `0x${string}` }> => {
  const signerPk = signerPrivateKey ?? generatePrivateKey()
  const signerAccount = privateKeyToAccount(signerPk)

  const ownerAccount = {
    address: ownerAddress,
    type: 'json-rpc',
    async signMessage() {
      throw new Error('Read-only owner account')
    },
    async signTransaction() {
      throw new Error('Read-only owner account')
    },
    async signTypedData() {
      throw new Error('Read-only owner account')
    }
  } as any

  const account = await rhinestoneSDK.createAccount({
    owners: {
      type: 'ecdsa',
      accounts: [ownerAccount, signerAccount]
    }
  })

  return { account, signerPrivateKey: signerPk }
}

export const buildDepositPlan = async (params: {
  destinationChainId: number
  tokenAddress: Address
  amount: bigint
  recipient: Address
  ownerAddress: Address
}): Promise<DepositPlan> => {
  const { account, signerPrivateKey } = await createCompanionAccount(params.ownerAddress)

  return {
    companionAddress: account.getAddress() as Address,
    fundTransfer: {
      token: params.tokenAddress,
      amount: params.amount,
      to: account.getAddress() as Address
    },
    intentRequest: {
      targetChain: params.destinationChainId,
      tokenAddress: params.tokenAddress,
      amount: params.amount,
      recipient: params.recipient
    },
    signerPrivateKey
  }
}

export const waitForFunding = async (
  accountState: IAccountState,
  token: Address,
  minAmount: bigint,
  options?: { pollMs?: number; maxAttempts?: number }
): Promise<boolean> => {
  const pollMs = options?.pollMs ?? 4000
  const maxAttempts = options?.maxAttempts ?? 120
  const accountAddress = accountState.account.getAddress() as Address

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const balance = await accountState.publicClient.readContract({
        address: token,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [accountAddress]
      })

      if (balance >= minAmount) {
        return true
      }
    } catch (error) {
      console.error('Funding check failed', error)
    }

    await new Promise(resolve => setTimeout(resolve, pollMs))
  }

  return false
}

export const executeIntentAfterFunding = async (
  accountState: IAccountState,
  params: {
    fundingToken: Address
    fundingAmount: bigint
    calls?: IBatchCall[]
    tokenRequests?: { address: Address; amount: bigint }[]
    recipient?: Address
  }
): Promise<TransactionResult> => {
  const funded = await waitForFunding(accountState, params.fundingToken, params.fundingAmount)
  if (!funded) {
    throw new Error('Funding not detected within time window')
  }

  const calls = (params.calls ?? []).map(call => ({
    to: (call as any).to,
    data: (call as any).data,
    value: (call as any).value
  }))

  const result = await accountState.account.sendTransaction({
    targetChain: arbitrum,
    calls,
    tokenRequests: params.tokenRequests,
    recipient: params.recipient
  })

  return result as TransactionResult
}

// Write many transactions (batch calls)
async function writeMany(accountState: IAccountState, callList: IBatchCall[]): Promise<TransactionResult> {
  const client = accountState.publicClient
  const address = accountState.address

  if (callList.length === 0) {
    throw new Error('No valid calls to send')
  }

  // Strip ABI from calls for sendCalls (it doesn't need it)
  const callsForSending = callList.map(({ to, data, value }) => ({
    to,
    data,
    value
  }))

  // Send the batch of calls
  const result = await accountState.account.sendTransaction({
    chain: accountState.publicClient.chain,
    calls: callsForSending,
    targetChain: arbitrum
  })

  return result
}

export const wallet = {
  read,
  write,
  writeMany,
  blockChange,
  account,
  connect,
  disconnect,
  transport,
  rhinestoneSDK,
  fetchRhinestonePortfolio,
  requestDepositQuote,
  buildDepositPlan,
  waitForFunding,
  executeIntentAfterFunding,
  connectors: wagmiConfig.connectors.map(connector => ({ id: connector.id, name: connector.name }))
}
