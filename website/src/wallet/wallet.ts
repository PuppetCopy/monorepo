import { ADDRESS_ZERO, BYTES32_ONE, CROSS_CHAIN_TOKEN_MAP } from '@puppet/sdk/const'
import { groupList } from '@puppet/sdk/core'
import { type RhinestoneAccount, RhinestoneSDK } from '@rhinestone/sdk'
import { porto, walletConnect } from '@wagmi/connectors'
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
  http,
  type ReadContractReturnType,
  type Transport,
  type WalletClient
} from 'viem'
import { type Address, privateKeyToAccount, toAccount } from 'viem/accounts'
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains'

type ChainBalance = { chainId: number; balance: bigint }

type IAccountState = {
  walletClient: WalletClient<Transport, Chain>
  address: Address
}

const chainList = [arbitrum] as const

const chainMap = groupList(chainList, 'id')

// Rhinestone SDK for smart account creation
const rhinestoneSDK = new RhinestoneSDK({
  apiKey: 'proxy',
  endpointUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/api/orchestrator`
})

// Subaccount storage
const SUBACCOUNT_STORAGE_KEY = 'subaccounts'

function getStoredSubaccount(address: Address): Address | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(SUBACCOUNT_STORAGE_KEY)
  if (!stored) return null
  const data = JSON.parse(stored)
  return data[address]?.subaccountAddress ?? null
}

function storeSubaccount(ownerAddress: Address, subaccountAddress: Address): void {
  if (typeof window === 'undefined') return
  const existingData = localStorage.getItem(SUBACCOUNT_STORAGE_KEY)
  const data = existingData ? JSON.parse(existingData) : {}
  data[ownerAddress] = { subaccountAddress }
  localStorage.setItem(SUBACCOUNT_STORAGE_KEY, JSON.stringify(data))
}

// Extension messaging
let extensionMessageId = 0
const pendingExtensionMessages = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>()

if (typeof window !== 'undefined') {
  window.addEventListener('message', event => {
    if (event.source !== window || event.data?.target !== 'puppet-website') return
    const { id, response } = event.data
    const pending = pendingExtensionMessages.get(id)
    if (pending) {
      pendingExtensionMessages.delete(id)
      response?.success === false ? pending.reject(new Error(response.error)) : pending.resolve(response)
    }
  })
}

function sendToExtension(type: string, payload: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const id = extensionMessageId++
    const timeout = setTimeout(() => {
      pendingExtensionMessages.delete(id)
      reject(new Error('Extension timeout'))
    }, 5000)

    pendingExtensionMessages.set(id, {
      resolve: v => {
        clearTimeout(timeout)
        resolve(v)
      },
      reject: e => {
        clearTimeout(timeout)
        reject(e)
      }
    })

    window.postMessage({ target: 'puppet-extension', id, type, payload }, '*')
  })
}

const extensionDetected =
  typeof window !== 'undefined'
    ? sendToExtension('PUPPET_GET_WALLET_STATE', {})
        .then(() => true)
        .catch(() => false)
    : Promise.resolve(false)

const CHAIN_NETWORK: Record<number, string> = {
  [mainnet.id]: 'ethereum',
  [arbitrum.id]: 'arbitrum',
  [optimism.id]: 'optimism',
  [base.id]: 'base',
  [polygon.id]: 'polygon'
}

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

const connection: IStream<GetConnectionReturnType<typeof wagmi>> = fromCallback(cb => {
  const storedConnections = getConnections(wagmi)
  const hasPortoConnection = storedConnections.some(conn => conn.connector.id === 'xyz.ithaca.porto')

  if (hasPortoConnection) {
    reconnect(wagmi, { connectors: [portoConnector] }).catch(console.warn)
  } else {
    cb(getConnection(wagmi))
  }

  return watchConnection(wagmi, { onChange: cb })
})

const account: IStream<Promise<IAccountState | null>> = op(
  connection,
  map(async connection => {
    if (connection.status !== 'connected' || !connection.connector) return null

    try {
      const walletClient = await wagmiGetWalletClient(wagmi, { chainId: connection.chainId })
      return { walletClient, address: walletClient.account.address }
    } catch (error) {
      console.warn('Failed to get wallet client:', error)
      return null
    }
  }),
  state
)

// Subaccount stream - initializes in background when account connects
type ISubaccountState = {
  ownerAddress: Address
  subaccountAddress: Address
  rhinestoneAccount: RhinestoneAccount
} | null

const subaccount: IStream<Promise<ISubaccountState>> = op(
  account,
  map(async accountPromise => {
    const acc = await accountPromise
    if (!acc) return null

    // Create the Rhinestone account (deterministic - same owners = same address)
    const ownerAccount = toAccount({
      address: acc.address,
      signMessage: async ({ message }) => acc.walletClient.signMessage({ message, account: acc.address }),
      signTransaction: async () => {
        throw new Error('Use sendTransaction instead')
      },
      signTypedData: async params => acc.walletClient.signTypedData({ ...params, account: acc.address } as any)
    })

    const rhinestoneAccount = await rhinestoneSDK.createAccount({
      owners: {
        type: 'ecdsa',
        accounts: [ownerAccount, privateKeyToAccount(BYTES32_ONE)]
      }
    })

    const subaccountAddress = rhinestoneAccount.getAddress()

    // Store address for quick lookup on reload
    const storedAddress = getStoredSubaccount(acc.address)
    if (!storedAddress) {
      storeSubaccount(acc.address, subaccountAddress)
    }

    // Sync to extension if available
    const hasExtension = await extensionDetected
    if (hasExtension) {
      sendToExtension('PUPPET_SET_WALLET_STATE', {
        ownerAddress: acc.address,
        smartWalletAddress: subaccountAddress
      }).catch(console.warn)
    }

    return { ownerAddress: acc.address, subaccountAddress, rhinestoneAccount }
  }),
  state
)

async function connect(preferredConnectorId?: string): Promise<Address[]> {
  try {
    const current = getConnection(wagmi)
    const targetConnector = wagmi.connectors.find(c => c.id === preferredConnectorId) ?? wagmi.connectors[0]

    if (!targetConnector) throw new Error('No wallet connector configured')

    if (current.status === 'connected' && current.connector?.id === targetConnector.id) {
      const addresses = (current as any).addresses ?? ((current as any).address ? [(current as any).address] : [])
      return addresses as Address[]
    }

    const result = await wagmiConnect(wagmi, { connector: targetConnector })
    return [...(result.accounts ?? [])]
  } catch (error: any) {
    if (error?.message?.includes('rejected') || error?.message?.includes('User rejected')) {
      console.log('User cancelled wallet connection')
      return []
    }
    console.error('Failed to connect:', error)
    return []
  }
}

async function disconnect() {
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
  account,
  subaccount,
  connect,
  disconnect,
  publicClient,
  wagmi,
  chainList,
  chainMap,
  walletConnectProjectId: WALLETCONNECT_PROJECT_ID
}

export type { IAccountState, ISubaccountState, ChainBalance }
export default wallet
