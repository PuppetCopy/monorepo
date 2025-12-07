import { ADDRESS_ZERO, CROSS_CHAIN_TOKEN_MAP } from '@puppet-copy/middleware/const'
import { groupList } from '@puppet-copy/middleware/core'
import {
  type IntentCost,
  type IntentInput,
  type RhinestoneAccount,
  RhinestoneSDK,
  walletClientToAccount
} from '@rhinestone/sdk'
import { porto } from '@wagmi/connectors'
import {
  type Config,
  createConfig,
  createStorage,
  type GetConnectionReturnType,
  getConnection,
  getConnections,
  type ReadContractParameters,
  readContract,
  reconnect,
  connect as wagmiConnect,
  disconnect as wagmiDisconnect,
  getWalletClient as wagmiGetWalletClient,
  watchConnection
} from '@wagmi/core'
import { erc20Abi } from 'abitype/abis'
import { type IStream, map, op } from 'aelea/stream'
import { fromCallback, state } from 'aelea/stream-extended'
import { Dialog, Mode } from 'porto'
import {
  type Abi,
  type Chain,
  type ContractFunctionArgs,
  type ContractFunctionName,
  createPublicClient,
  fallback,
  getAddress,
  http,
  type ReadContractReturnType,
  type Transport,
  type WalletClient
} from 'viem'
import type { Address } from 'viem/accounts'
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains'

type ChainBalance = { chainId: number; balance: bigint }

type PortfolioTokenBalance = {
  tokenAddress: Address
  chainId: number
  balance: { locked: bigint; unlocked: bigint }
}

type PortfolioItem = {
  tokenName: string
  tokenDecimals: number
  balance: { locked: bigint; unlocked: bigint }
  tokenChainBalance: PortfolioTokenBalance[]
}

type IAccountState = {
  walletClient: WalletClient<Transport, Chain>
  address: Address
  subAccount: RhinestoneAccount
  subaccountAddress: Address
}

const rhinestoneSDK = new RhinestoneSDK({
  apiKey: 'proxy',
  endpointUrl: `${window.location.origin}/api/orchestrator`
})

const chainList = [mainnet, base, optimism, arbitrum, polygon] as const
type SupportedChainId = (typeof chainList)[number]['id']
const chainMap = groupList(chainList, 'id')

const CHAIN_NETWORK: Record<number, string> = {
  [mainnet.id]: 'ethereum',
  [arbitrum.id]: 'arbitrum',
  [optimism.id]: 'optimism',
  [base.id]: 'base',
  [polygon.id]: 'polygon'
}

const portoConnector = porto({
  chains: chainList,
  mode: Mode.dialog({ renderer: Dialog.popup() })
})

const wagmi: Config = createConfig({
  chains: chainList,
  connectors: [portoConnector],
  storage: createStorage({ storage: localStorage }),
  transports: {
    [arbitrum.id]: fallback([http('/api/rpc?network=arbitrum'), http(arbitrum.rpcUrls.default.http[0])]),
    [mainnet.id]: fallback([http('/api/rpc?network=ethereum'), http(mainnet.rpcUrls.default.http[0])]),
    [base.id]: fallback([http('/api/rpc?network=base'), http(base.rpcUrls.default.http[0])]),
    [optimism.id]: fallback([http('/api/rpc?network=optimism'), http(optimism.rpcUrls.default.http[0])]),
    [polygon.id]: fallback([http('/api/rpc?network=polygon'), http(polygon.rpcUrls.default.http[0])])
  }
})

const connection: IStream<GetConnectionReturnType<typeof wagmi>> = fromCallback(cb => {
  const storedConnections = getConnections(wagmi)
  const hasPortoConnection = storedConnections.some(conn => conn.connector.id === 'xyz.ithaca.porto')

  const init = async () => {
    if (hasPortoConnection) {
      await reconnect(wagmi, { connectors: [portoConnector] })
    }
    cb(getConnection(wagmi))
  }

  init()
  return watchConnection(wagmi, {
    onChange: conn => {
      try {
        cb(conn)
      } catch (error) {
        // Porto connector can throw during disconnect state transitions
        console.warn('Connection change error (likely Porto disconnect):', error)
        cb(getConnection(wagmi))
      }
    }
  })
})

const account: IStream<Promise<IAccountState | null>> = op(
  connection,
  map(async connection => {
    if (connection.status !== 'connected' || !connection.connector) return null

    const walletClient = await wagmiGetWalletClient(wagmi, { chainId: connection.chainId })
    const address = walletClient.account.address

    const subAccount = await rhinestoneSDK.createAccount({
      owners: {
        type: 'ecdsa',
        accounts: [walletClientToAccount(walletClient)]
      }
    })

    const subaccountAddress = subAccount.getAddress()

    // Preload portfolio (cached by API)
    getPortfolio(subaccountAddress).catch(() => {})

    console.info('Account ready:', { address, subaccountAddress })

    return { walletClient, address, subAccount, subaccountAddress }
  }),
  state
)

async function connect(preferredConnectorId?: string) {
  const current = getConnection(wagmi)
  const targetConnector = wagmi.connectors.find(c => c.id === preferredConnectorId) ?? wagmi.connectors[0]

  if (!targetConnector) throw new Error('No wallet connector configured')
  if (current.status === 'connected') return [...current.addresses]

  try {
    const result = await wagmiConnect(wagmi, { connector: targetConnector })
    return result.accounts ?? []
  } catch (error: any) {
    if (error?.message?.includes('rejected')) {
      console.log('User cancelled wallet connection')
      return []
    }
    console.error('Failed to connect:', error)
    return []
  }
}

async function disconnect() {
  await wagmiDisconnect(wagmi)
}

async function read<
  const abi extends Abi,
  functionName extends ContractFunctionName<abi, 'pure' | 'view'>,
  args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName>
>(
  parameters: ReadContractParameters<abi, functionName, args>
): Promise<ReadContractReturnType<abi, functionName, args>> {
  return readContract(wagmi, parameters)
}

async function getTokenBalance(
  tokenAddress: Address,
  owner: Address,
  chainId: number,
  refresh = true
): Promise<bigint> {
  const chain = chainList.find(c => c.id === chainId)
  if (!chain) throw new Error(`Unsupported chain: ${chainId}`)

  const network = CHAIN_NETWORK[chainId]
  if (!network) throw new Error(`Unsupported network: ${chainId}`)

  const url = new URL('/api/rpc', window.location.origin)
  url.searchParams.set('network', network)
  if (refresh) url.searchParams.set('refresh', 'true')

  const client = createPublicClient({ chain, transport: http(url.toString()) })

  if (tokenAddress === ADDRESS_ZERO) {
    return client.getBalance({ address: owner })
  }
  return client.readContract({ address: tokenAddress, abi: erc20Abi, functionName: 'balanceOf', args: [owner] })
}

async function getMultichainBalances(
  symbol: keyof (typeof CROSS_CHAIN_TOKEN_MAP)[keyof typeof CROSS_CHAIN_TOKEN_MAP],
  owner: Address
): Promise<ChainBalance[]> {
  const results = await Promise.all(
    chainList.map(async chain => {
      const tokenMap = CROSS_CHAIN_TOKEN_MAP[chain.id as keyof typeof CROSS_CHAIN_TOKEN_MAP]
      const tokenAddress = tokenMap?.[symbol]
      if (!tokenAddress) return { chainId: chain.id, balance: 0n }

      try {
        const balance = await getTokenBalance(tokenAddress, owner, chain.id)
        return { chainId: chain.id, balance }
      } catch {
        return { chainId: chain.id, balance: 0n }
      }
    })
  )
  return results.filter(r => r.balance > 0n)
}

async function getPortfolio(subAccountAddress: Address, refresh = false): Promise<PortfolioItem[]> {
  const url = new URL(`/api/orchestrator/accounts/${subAccountAddress}/portfolio`, window.location.origin)
  if (refresh) url.searchParams.set('refresh', 'true')

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch portfolio: ${response.statusText}`)

  const data = await response.json()
  const rawPortfolio = data.portfolio as Array<{
    tokenName: string
    tokenDecimals: number
    balance: { locked: string; unlocked: string }
    tokenChainBalance: Array<{
      tokenAddress: string
      chainId: number
      balance: { locked: string; unlocked: string }
    }>
  }>

  // Parse string balances to bigints
  const parseBalance = (bal: { locked: string; unlocked: string }) => ({
    locked: bal?.locked ? BigInt(bal.locked) : 0n,
    unlocked: bal?.unlocked ? BigInt(bal.unlocked) : 0n
  })

  return rawPortfolio.map(item => ({
    tokenName: item.tokenName,
    tokenDecimals: item.tokenDecimals,
    balance: parseBalance(item.balance),
    tokenChainBalance: item.tokenChainBalance.map(tcb => ({
      tokenAddress: getAddress(tcb.tokenAddress),
      chainId: tcb.chainId,
      balance: parseBalance(tcb.balance)
    }))
  }))
}

type IntentCostResponse = IntentCost & {
  totalTokenShortfallInUSD?: number
  tokenShortfall?: Array<{
    tokenAddress: Address
    destinationAmount: string
    amountSpent: string
    fee: string
    tokenSymbol: string
    tokenDecimals: number
  }>
}

async function getIntentCost(params: IntentInput, refresh = false): Promise<IntentCostResponse> {
  const url = new URL('/api/orchestrator/intents/cost', window.location.origin)
  if (refresh) url.searchParams.set('refresh', 'true')

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new Error(`Failed to fetch intent cost: ${response.statusText}${errorBody ? ` - ${errorBody}` : ''}`)
  }

  return response.json()
}

const publicClient = wagmi.getClient({ chainId: arbitrum.id })

const wallet = {
  read,
  getTokenBalance,
  getMultichainBalances,
  getPortfolio,
  getIntentCost,
  account,
  connect,
  disconnect,
  publicClient,
  wagmi,
  chainList,
  chainMap,
  rhinestoneSDK,
  connectors: wagmi.connectors.map(c => ({ id: c.id, name: c.name }))
}

export type { IAccountState, ChainBalance, SupportedChainId, PortfolioItem }
export default wallet
