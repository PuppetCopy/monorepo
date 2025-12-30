import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import { ADDRESS_ZERO, CROSS_CHAIN_TOKEN_MAP } from '@puppet/sdk/const'
import { groupList } from '@puppet/sdk/core'
import { type RhinestoneAccount, RhinestoneSDK, walletClientToAccount } from '@rhinestone/sdk'
import { porto, walletConnect } from '@wagmi/connectors'
import {
  type Config,
  createConfig,
  createStorage,
  type GetConnectionReturnType,
  getConnection,
  getConnections,
  getWalletClient,
  type ReadContractParameters,
  readContract,
  reconnect,
  connect as wagmiConnect,
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
  type ReadContractReturnType,
  type Transport,
  type WalletClient
} from 'viem'
import { type Address, privateKeyToAccount, type toAccount } from 'viem/accounts'
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains'

export type ChainBalance = { chainId: number; balance: bigint }

export type SubaccountSigner = ReturnType<typeof toAccount>

export type IAccountState = {
  connection: GetConnectionReturnType<typeof wallet.wagmi>
  walletClient: WalletClient<Transport, Chain>
  address: Address
  rhinestoneAccount?: RhinestoneAccount
  signer?: SubaccountSigner
}

const chainList = [arbitrum] as const
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

async function initializeAccountState(
  connection: GetConnectionReturnType,
  subaccountPrivateKey?: Hex | null
): Promise<IAccountState | null> {
  const conn = connection
  if (conn.status !== 'connected' || !conn.connector) return null

  const walletClient = await getWalletClient(wallet.wagmi, { chainId: conn.chainId })

  if (subaccountPrivateKey == null) {
    return { walletClient, address: walletClient.account.address, connection }
  }

  const account = walletClientToAccount(walletClient)
  const signer = privateKeyToAccount(subaccountPrivateKey)
  const rhinestoneAccount = await rhinestoneSDK.createAccount({
    owners: {
      type: 'ecdsa',
      accounts: [account, signer]
    },
    modules: [
      {
        type: 'executor',
        address: PUPPET_CONTRACT_MAP.Allocation.address,
        initData: '0x'
      }
    ]
  })

  return { walletClient, address: walletClient.account.address, rhinestoneAccount, connection }
}

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

function checkExtension(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  return sendToExtension('PUPPET_GET_WALLET_STATE', {})
    .then(() => true)
    .catch(() => false)
}

let extensionMessageId = 0

async function sendToExtension(type: string, payload: unknown = {}, timeoutMs = 1000): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const id = extensionMessageId++
    const timeout = setTimeout(() => {
      pendingExtensionMessages.delete(id)
      reject(new Error('Extension timeout'))
    }, timeoutMs)

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
  connect,
  initializeAccountState,
  sendToExtension,
  disconnect,
  publicClient,
  wagmi,
  chainList,
  chainMap,
  walletConnectProjectId: WALLETCONNECT_PROJECT_ID
}

export default wallet
