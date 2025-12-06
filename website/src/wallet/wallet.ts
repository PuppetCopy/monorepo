import { ADDRESS_ZERO, CROSS_CHAIN_TOKEN_MAP } from '@puppet-copy/middleware/const'
import { groupList, readableAddress } from '@puppet-copy/middleware/core'
import { type RhinestoneAccount, RhinestoneSDK } from '@rhinestone/sdk'
import { porto } from '@wagmi/connectors'
import {
  type Config,
  createConfig,
  createStorage,
  type GetConnectionReturnType,
  getConnection,
  getConnections,
  getPublicClient,
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
  type Hex,
  http,
  keccak256,
  type ReadContractReturnType,
  type Transport,
  type WalletClient
} from 'viem'
import { type Address, type LocalAccount, privateKeyToAccount, toAccount } from 'viem/accounts'
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains'

type ChainBalance = { chainId: number; balance: bigint }

// Storage key for persisted addresses
const ACCOUNT_ADDRESSES_KEY = 'accountAddresses:'

// Helper to create owner account wrapper (user's main wallet address)
// This account throws errors on signing - only the companion signer should sign
function createOwnerAccount(address: Address): LocalAccount {
  return toAccount({
    address,
    signMessage: async () => {
      throw new Error('User signer is not available in the companion account flow')
    },
    signTransaction: async () => {
      throw new Error('User signer is not available in the companion account flow')
    },
    signTypedData: async () => {
      throw new Error('User signer is not available in the companion account flow')
    }
  })
}

// Derive companion signer from wallet signature (deterministic)
// This is called on-demand when user performs an action (deposit/withdraw/trade)
// The companion signer is NEVER stored - it exists only in memory during the action
async function signAndDeriveCompanionSigner(
  walletClient: WalletClient<Transport, Chain>
): Promise<{ signature: Hex; companionSigner: LocalAccount }> {
  if (!walletClient.account) {
    throw new Error('Wallet client has no account')
  }

  const address = walletClient.account.address

  // Prompt user to sign message
  const message = `Approve action for ${readableAddress(address)}\n\nBy signing, I approve the terms and conditions.`
  const signature = await walletClient.signMessage({
    account: walletClient.account,
    message
  })

  // Derive companion signer private key from signature (deterministic)
  const privateKey = keccak256(signature) as Hex
  const companionSigner = privateKeyToAccount(privateKey)

  return { signature, companionSigner }
}

// Restore keys when user needs to perform an action
// Re-requests signature and derives companion signer
async function restoreAccountKeys(account: IAccountState): Promise<IAccountState> {
  // Already have keys in memory
  if (account.companionSigner && account.subAccount) {
    return account
  }

  // Request signature and derive companion signer
  const { companionSigner } = await signAndDeriveCompanionSigner(account.walletClient)

  // Recreate subaccount with owner + companion signer
  const subAccount = await rhinestoneSDK.createAccount({
    owners: {
      type: 'ecdsa',
      accounts: [createOwnerAccount(account.address), companionSigner]
    }
  })

  console.info('Keys restored to memory:', {
    companionSignerAddress: companionSigner.address,
    subaccountAddress: subAccount.getAddress()
  })

  // Return updated account state with keys in memory
  return {
    ...account,
    companionSigner,
    subAccount
  }
}

// Account state - supports view mode and action mode
// View mode: has addresses but no keys - can query data but not execute transactions
// Action mode: has keys in memory - can execute transactions
// Note: Addresses are ALWAYS present (required for queries). If user hasn't completed
// initial setup, we return null instead of an incomplete account state.
type IAccountState = {
  walletClient: WalletClient<Transport, Chain>
  address: Address
  companionSigner: LocalAccount | null // Keys in memory during session
  companionSignerAddress: Address // Always present - needed for queries
  subAccount: RhinestoneAccount | null
  subaccountAddress: Address // Always present - needed for queries
  portfolio: Awaited<ReturnType<RhinestoneAccount['getPortfolio']>> | null
  supportsSendCalls: boolean // Can use batch transactions for efficiency
}

// Transport configuration for reading blockchain data
const rhinestoneSDK = new RhinestoneSDK({
  apiKey: 'proxy',
  endpointUrl: `${window.location.origin}/api/orchestrator`
})
const chainList = [mainnet, base, optimism, arbitrum, polygon] as const
const chainMap = groupList(chainList, 'id')

const CHAIN_NETWORK: Record<number, string> = {
  [mainnet.id]: 'ethereum',
  [arbitrum.id]: 'arbitrum',
  [optimism.id]: 'optimism',
  [base.id]: 'base',
  [polygon.id]: 'polygon'
}

function createApiUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(path, window.location.origin)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value)
    }
  }
  return url.toString()
}

const portoConnector = porto({
  chains: chainList,
  mode: Mode.dialog({
    renderer: Dialog.popup()
  })
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
  // Restore Porto connection on page load (injected wallets handle reconnection automatically)
  const storedConnections = getConnections(wagmi)
  const hasPortoConnection = storedConnections.some(conn => conn.connector.id === 'xyz.ithaca.porto')

  const init = async () => {
    if (hasPortoConnection) {
      await reconnect(wagmi, { connectors: [portoConnector] })
    }

    const currentConnection = getConnection(wagmi)
    cb(currentConnection)
  }

  init()

  const unsubscribe = watchConnection(wagmi, {
    onChange(conn) {
      cb(conn)
    }
  })

  return unsubscribe
})

const account: IStream<Promise<IAccountState | null>> = op(
  connection,
  map(async connection => {
    if (connection.status !== 'connected' || !connection.connector) {
      return null
    }

    const walletClient = await wagmiGetWalletClient(wagmi, { chainId: connection.chainId })
    const address = walletClient.account.address

    // Check if wallet supports EIP-5792 sendCalls for efficiency optimization
    let supportsSendCalls = false
    try {
      if (typeof walletClient.getCapabilities === 'function') {
        const capabilities = await walletClient.getCapabilities({ account: address })
        supportsSendCalls = Object.values(capabilities).some(chainCaps => chainCaps?.atomicBatch?.supported === true)
      }
    } catch (error) {
      console.warn('Failed to check wallet capabilities, assuming no sendCalls support:', error)
    }

    // Check for stored addresses (addresses only, not keys!)
    const storedData = localStorage.getItem(ACCOUNT_ADDRESSES_KEY + address)
    const savedAccount = storedData ? JSON.parse(storedData) : null

    return { walletClient, address, supportsSendCalls, savedAccount }
  }),
  map(async prepDataPromise => {
    const prepData = await prepDataPromise
    if (!prepData) return null

    const { walletClient, address, supportsSendCalls, savedAccount } = prepData

    try {
      if (savedAccount) {
        // View mode with stored addresses - can query but not execute
        // Portfolio is fetched on-demand when needed (not on connect)
        const accountState: IAccountState = {
          address,
          walletClient,
          companionSigner: null, // Keys not in memory yet
          companionSignerAddress: savedAccount.companionSignerAddress as Address,
          subAccount: null, // Will be recreated when needed
          subaccountAddress: savedAccount.subaccountAddress as Address,
          portfolio: null, // Lazy-loaded when needed
          supportsSendCalls
        }

        console.info('Account connected (view mode with stored addresses):', {
          address: accountState.address,
          companionSignerAddress: accountState.companionSignerAddress,
          subaccountAddress: accountState.subaccountAddress,
          supportsSendCalls: accountState.supportsSendCalls
        })

        return accountState
      }

      // First time - request signature to create companion + subaccount
      // If user rejects, we cannot proceed (need addresses for view mode)
      let companionSigner: LocalAccount
      try {
        const result = await signAndDeriveCompanionSigner(walletClient)
        companionSigner = result.companionSigner
      } catch (error: any) {
        const msg = error?.message ?? ''
        if (msg.includes('user rejected') || msg.includes('User rejected')) {
          console.log('User cancelled initial setup - cannot proceed without addresses')
        } else {
          console.error('Failed to get signature for initial setup:', error)
        }
        return null
      }

      // Create subaccount with owner + companion signer
      const subAccount = await rhinestoneSDK.createAccount({
        owners: {
          type: 'ecdsa',
          accounts: [createOwnerAccount(address), companionSigner]
        }
      })

      const subaccountAddress = subAccount.getAddress()

      // Store addresses (not keys!) to localStorage
      localStorage.setItem(
        ACCOUNT_ADDRESSES_KEY + address,
        JSON.stringify({
          companionSignerAddress: companionSigner.address,
          subaccountAddress
        })
      )

      const accountState: IAccountState = {
        address,
        walletClient,
        companionSigner, // Keys in memory for this session
        companionSignerAddress: companionSigner.address,
        subAccount,
        subaccountAddress,
        portfolio: null, // Lazy-loaded when needed (empty for new accounts anyway)
        supportsSendCalls
      }

      console.info('Account created (action mode):', {
        address: accountState.address,
        companionSignerAddress: accountState.companionSignerAddress,
        subaccountAddress: accountState.subaccountAddress,
        supportsSendCalls: accountState.supportsSendCalls
      })

      return accountState
    } catch (error) {
      console.error('Failed to get account state:', error)
      return null
    }
  }),
  state
)

async function connect(preferredConnectorId?: string) {
  try {
    const current = getConnection(wagmi)
    const targetConnector =
      wagmi.connectors.find(connector => connector.id === preferredConnectorId) ?? wagmi.connectors[0]

    if (!targetConnector) {
      throw new Error('No wallet connector is configured')
    }

    if (current.status === 'connected') {
      const addresses = (current as any).addresses ?? ((current as any).address ? [(current as any).address] : [])
      return addresses as Address[]
    }

    const result = await wagmiConnect(wagmi, {
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
  await wagmiDisconnect(wagmi)
}

// Read contract function
async function read<
  const abi extends Abi,
  functionName extends ContractFunctionName<abi, 'pure' | 'view'>,
  args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName>
>(
  parameters: ReadContractParameters<abi, functionName, args>
): Promise<ReadContractReturnType<abi, functionName, args>> {
  return readContract(wagmi, parameters)
}

async function getTokenBalanceFromClient(
  tokenAddress: Address,
  owner: Address,
  client: { getBalance: (args: { address: Address }) => Promise<bigint>; readContract: (args: any) => Promise<any> }
): Promise<bigint> {
  if (tokenAddress === ADDRESS_ZERO) {
    return client.getBalance({ address: owner })
  }
  return client.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [owner]
  })
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

  const rpcUrl = createApiUrl('/api/rpc', {
    network,
    ...(refresh && { refresh: 'true' })
  })

  const client = createPublicClient({
    chain,
    transport: http(rpcUrl)
  })

  return getTokenBalanceFromClient(tokenAddress, owner, client)
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

async function getPortfolio(subAccountAddress: Address, refresh = false) {
  const url = createApiUrl(`/api/orchestrator/accounts/${subAccountAddress}/portfolio`, {
    ...(refresh && { refresh: 'true' })
  })

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch portfolio: ${response.statusText}`)
  }

  const data = await response.json()
  return data.portfolio as Awaited<ReturnType<RhinestoneAccount['getPortfolio']>>
}

type IntentCostParams = {
  destinationChainId: number
  tokenRequests: Array<{ address: Address; amount: bigint }>
  account: { address: Address }
  destinationExecutions?: Array<{ to: Address; data: Hex; value?: bigint }>
  destinationGasUnits?: number
  accountAccessList?: any
  recipient?: { address: Address }
  options?: {
    topupCompact?: boolean
    settlementLayers?: number[]
    sponsorSettings?: any
    feeToken?: Address
  }
}

type IntentCostResponse = {
  hasFulfilledAll: boolean
  tokensSpent?: {
    locked: string
    unlocked: string
  }
  tokensReceived?: Array<{
    targetAmount: string
    fee: string
    fulfilled: boolean
  }>
  sponsorFee?: {
    relayerFee: string
    rhinestoneFee: string
  }
  tokenShortfall?: Array<{
    symbol: string
    decimals: number
    amount: string
  }>
  totalTokenShortfallInUSD?: number
}

async function getIntentCost(params: IntentCostParams, refresh = false): Promise<IntentCostResponse> {
  const url = createApiUrl('/api/orchestrator/intents/cost', {
    ...(refresh && { refresh: 'true' })
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch intent cost: ${response.statusText}`)
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
  connectors: wagmi.connectors.map(connector => ({ id: connector.id, name: connector.name }))
}

export function getMainnetPublicClient() {
  return getPublicClient(wagmi, { chainId: mainnet.id })
}

export type { IAccountState, ChainBalance }
export { signAndDeriveCompanionSigner, restoreAccountKeys }
export default wallet
