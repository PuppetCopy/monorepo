import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import { ADDRESS_ZERO, CROSS_CHAIN_TOKEN_MAP } from '@puppet/sdk/const'
import { groupList } from '@puppet/sdk/core'
import { type RhinestoneAccount, RhinestoneSDK, walletClientToAccount } from '@rhinestone/sdk'
import { porto, walletConnect } from '@wagmi/connectors'
import {
  type Config,
  type ConnectReturnType,
  connect,
  createConfig,
  createStorage,
  type GetConnectionReturnType,
  getConnection,
  getConnections,
  getWalletClient,
  type ReadContractParameters,
  readContract,
  reconnect,
  disconnect as wagmiDisconnect,
  watchConnection
} from '@wagmi/core'
import { erc20Abi } from 'abitype/abis'
import type { IStream } from 'aelea/stream'
import { fromCallback } from 'aelea/stream-extended'
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
  toBytes,
  toHex,
  type WalletClient
} from 'viem'
import { type Address, privateKeyToAccount } from 'viem/accounts'
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains'

export type ChainBalance = { chainId: number; balance: bigint }

const chainList = [arbitrum, base, optimism, polygon] as const
const chainMap = groupList(chainList, 'id')

const CHAIN_NETWORK: Record<number, string> = {
  [mainnet.id]: 'ethereum',
  [arbitrum.id]: 'arbitrum',
  [optimism.id]: 'optimism',
  [base.id]: 'base',
  [polygon.id]: 'polygon'
}

// Rhinestone SDK for smart account creation
const rhinestoneSDK = new RhinestoneSDK({
  apiKey: 'proxy',
  endpointUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/api/orchestrator`
})

const WALLETCONNECT_PROJECT_ID = 'b81521b9a6d17b1d070aa5899c2fdcfe'

const walletConnectConnector = walletConnect({
  projectId: WALLETCONNECT_PROJECT_ID
})

const portoConnector = porto({
  chains: chainList,
  mode: Mode.dialog({ renderer: Dialog.popup() })
})

const wagmi: Config = createConfig({
  chains: chainList,
  connectors: [walletConnectConnector, portoConnector],
  storage: createStorage({ storage: localStorage }),
  transports: Object.fromEntries(
    chainList.map(chain => [
      chain.id,
      fallback([http(`/api/rpc?network=${CHAIN_NETWORK[chain.id]}`), http(chain.rpcUrls.default.http[0])])
    ])
  ) as any
})

export type SubaccountSigner = ReturnType<typeof privateKeyToAccount>

export type IAccountState = {
  connection: GetConnectionReturnType<typeof wagmi>
  walletClient: WalletClient<Transport, Chain>
  address: Address
  subaccountAddress?: Address
  subaccount?: RhinestoneAccount
  signer?: SubaccountSigner
  isSynced: boolean
}

const connection: IStream<GetConnectionReturnType<typeof wagmi>> = fromCallback(cb => {
  const storedConnections = getConnections(wagmi)
  const hasPortoConnection = storedConnections.some(conn => conn.connector.id === 'xyz.ithaca.porto')

  if (hasPortoConnection) {
    reconnect(wagmi, { connectors: [portoConnector] }).catch(console.warn)
  } else {
    cb(getConnection(wagmi))
  }

  return watchConnection(wagmi, {
    onChange(connection) {
      // if (connection.isReconnecting) return

      cb(connection)
    }
  })
})

// LocalStorage helpers for subaccount address (enables view-mode without extension)
const SUBACCOUNT_STORAGE_KEY = 'puppet:subaccounts'

function getStoredSubaccountAddress(ownerAddress: Address): Address | null {
  try {
    const stored = localStorage.getItem(SUBACCOUNT_STORAGE_KEY)
    if (!stored) return null
    const map = JSON.parse(stored) as Record<string, Address>
    return map[ownerAddress.toLowerCase()] ?? null
  } catch {
    return null
  }
}

function setStoredSubaccountAddress(ownerAddress: Address, subaccountAddress: Address): void {
  try {
    const stored = localStorage.getItem(SUBACCOUNT_STORAGE_KEY)
    const map = stored ? (JSON.parse(stored) as Record<string, Address>) : {}
    map[ownerAddress.toLowerCase()] = subaccountAddress
    localStorage.setItem(SUBACCOUNT_STORAGE_KEY, JSON.stringify(map))
  } catch {
    // Ignore storage errors
  }
}

const SIGNER_DERIVATION_MESSAGE = `Puppet Protocol Session Authorization

Sign this message to authorize your trading session.

This signature will not cost any gas and does not grant access to your funds.`

export async function signAndEnableSession(account: IAccountState): Promise<IAccountState | null> {
  const message = await account.walletClient.signMessage({
    message: SIGNER_DERIVATION_MESSAGE,
    account: account.address
  })

  const privateKey = keccak256(toBytes(message))

  // Initialize account to get rhinestone smart wallet address
  const nextAccountState = await initializeAccountState(account.connection, privateKey)

  // Store complete wallet entry in extension
  if (nextAccountState?.subaccount) {
    const smartWalletAddress = nextAccountState.subaccount.getAddress()
    const subaccountName = toHex('default', { size: 32 })
    await setExtensionWalletState(account.address, {
      smartWalletAddress,
      subaccountName,
      privateKey
    })
  }

  return nextAccountState
}

export async function initializeAccountState(
  connection: GetConnectionReturnType,
  subaccountPrivateKey?: Hex | null
): Promise<IAccountState | null> {
  const conn = connection
  if (conn.status !== 'connected' || !conn.connector || !conn.chainId) return null
  if (typeof conn.connector.getChainId !== 'function') return null

  const walletClient = await getWalletClient(wallet.wagmi, { chainId: conn.chainId })
  const address = walletClient.account.address

  // Check localStorage for cached subaccountAddress (enables view-mode)
  const cachedSubaccountAddress = getStoredSubaccountAddress(address)

  // Try to sync with extension - isSynced only if extension has wallet state for this address
  let isSynced = false
  let privateKey = subaccountPrivateKey ?? null

  try {
    // Verify extension has wallet state matching connected address
    console.log('[Wallet] Checking extension for wallet:', address)
    const walletState = await getExtensionWalletState(address)
    console.log('[Wallet] Extension state:', walletState ? 'found' : 'not found')
    if (walletState) {
      isSynced = true
      privateKey = privateKey ?? walletState.privateKey
      setActiveWallet(address)
    }
  } catch (err) {
    console.log('[Wallet] Extension check failed:', err)
    isSynced = false // Timeout - extension not available
  }

  if (!privateKey) {
    // View-mode: no private key, but may have cached subaccountAddress
    return { walletClient, address, subaccountAddress: cachedSubaccountAddress ?? undefined, connection, isSynced }
  }

  const account = walletClientToAccount(walletClient)
  const signer = privateKeyToAccount(privateKey)
  const subaccount = await rhinestoneSDK.createAccount({
    owners: {
      type: 'ecdsa',
      accounts: [account, signer],
      threshold: 1 // Either owner can sign alone
    },
    experimental_sessions: {
      enabled: true
    },
    modules: [
      {
        type: 'executor',
        address: PUPPET_CONTRACT_MAP.Allocation.address,
        initData: '0x'
      }
    ]
  })

  // debugger

  const subaccountAddress = subaccount.getAddress()

  // Cache subaccountAddress for view-mode
  setStoredSubaccountAddress(address, subaccountAddress)

  return { walletClient, address, subaccountAddress, subaccount, signer, connection, isSynced: true }
}

export async function connectWallet(preferredConnectorId?: string): Promise<ConnectReturnType<typeof wagmi>> {
  const currentConnection = getConnection(wagmi)

  if (currentConnection.status === 'connected') throw new Error('Wallet already connected')

  if (currentConnection.status === 'connecting') await new Promise(() => {})

  const targetConnector = wagmi.connectors.find(c => c.id === preferredConnectorId) ?? wagmi.connectors[0]

  if (!targetConnector) throw new Error('No compatible wallet found. Please install a supported wallet.')

  if (currentConnection.connector?.id === targetConnector.id) throw new Error('Wallet already connected')

  return connect(wagmi, { connector: targetConnector })
}

// Extension communication helpers
let extensionRequestId = 0
const pendingExtensionRequests = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>()

// Listen for extension responses
if (typeof window !== 'undefined') {
  window.addEventListener('message', event => {
    if (event.source !== window || event.data?.target !== 'puppet-website') return

    const { id, response } = event.data
    if (id !== undefined && pendingExtensionRequests.has(id)) {
      const { resolve, reject } = pendingExtensionRequests.get(id)!
      pendingExtensionRequests.delete(id)
      if (response?.success === false) {
        reject(new Error(response.error || 'Extension request failed'))
      } else {
        resolve(response?.result)
      }
    }
  })
}

async function sendExtensionMessage<T = unknown>(type: string, payload?: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = extensionRequestId++
    const timeout = setTimeout(() => {
      pendingExtensionRequests.delete(id)
      reject(new Error('Extension request timeout'))
    }, 50)

    pendingExtensionRequests.set(id, {
      resolve: (v: unknown) => {
        clearTimeout(timeout)
        resolve(v as T)
      },
      reject: (e: Error) => {
        clearTimeout(timeout)
        reject(e)
      }
    })

    window.postMessage({ target: 'puppet-extension', id, type, payload }, '*')
  })
}

// Get stored wallet state for a specific owner address (includes privateKey)
export async function getExtensionWalletState(
  ownerAddress: Address
): Promise<{ smartWalletAddress: string; subaccountName: string; privateKey: Hex } | null> {
  return sendExtensionMessage('PUPPET_GET_WALLET_STATE', { ownerAddress })
}

// Set wallet state for a specific owner address (requires all fields)
export async function setExtensionWalletState(
  ownerAddress: Address,
  data: { smartWalletAddress: string; subaccountName: string; privateKey: Hex }
): Promise<void> {
  await sendExtensionMessage('PUPPET_SET_WALLET_STATE', { ownerAddress, ...data })
}

// Set the active wallet in the extension (synced with website connection)
export async function setActiveWallet(ownerAddress: Address | null): Promise<void> {
  try {
    await sendExtensionMessage('PUPPET_SET_ACTIVE_WALLET', { ownerAddress })
  } catch {
    // Extension not installed, ignore
  }
}

// Clear wallet state for a specific owner
export async function clearExtensionWalletState(ownerAddress: Address): Promise<void> {
  await sendExtensionMessage('PUPPET_CLEAR_WALLET_STATE', { ownerAddress })
}

// Clear all extension storage (full reset)
export async function clearAllExtensionStorage(): Promise<void> {
  await sendExtensionMessage('PUPPET_CLEAR_ALL')
}
  // await sendExtensionMessage('PUPPET_CLEAR_ALL')

async function disconnect() {
  // clearSigner()
  const current = getConnection(wagmi)
  if (current.connector) {
    await wagmiDisconnect(wagmi, { connector: current.connector })
  }
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

const publicClient = wagmi.getClient({ chainId: arbitrum.id })

const wallet = {
  read,
  getTokenBalance,
  getMultichainBalances,
  connection,
  disconnect,
  publicClient,
  wagmi,
  chainList,
  chainMap,
  walletConnectProjectId: WALLETCONNECT_PROJECT_ID
}

export default wallet
