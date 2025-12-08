import { ADDRESS_ZERO, CROSS_CHAIN_TOKEN_MAP } from '@puppet-copy/middleware/const'
import { groupList } from '@puppet-copy/middleware/core'
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
import type { Address } from 'viem/accounts'
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains'

type ChainBalance = { chainId: number; balance: bigint }

type IAccountState = {
  client: WalletClient<Transport, Chain>
  address: Address
}

const chainList = [
  // mainnet, //
  // base,
  // optimism,
  arbitrum
  // polygon
] as const
type SupportedChainId = (typeof chainList)[number]['id']
const chainMap = groupList(chainList, 'id')

const CHAIN_NETWORK: Record<number, string> = {
  [mainnet.id]: 'ethereum',
  [arbitrum.id]: 'arbitrum',
  [optimism.id]: 'optimism',
  [base.id]: 'base',
  [polygon.id]: 'polygon'
}

const walletConnectConnector = walletConnect({
  projectId: 'b81521b9a6d17b1d070aa5899c2fdcfe'
})

const portoConnector = porto({
  chains: chainList,
  mode: Mode.dialog({ renderer: Dialog.popup() })
})

const transports = Object.fromEntries(
  chainList.map(chain => [
    chain.id,
    fallback([http(`/api/rpc?network=${CHAIN_NETWORK[chain.id]}`), http(chain.rpcUrls.default.http[0])])
  ])
) as Record<SupportedChainId, Transport>

const wagmi: Config = createConfig({
  chains: chainList,
  connectors: [
    // injected()
    walletConnectConnector, //
    portoConnector
  ],
  storage: createStorage({ storage: localStorage }),
  transports
})

const connection: IStream<GetConnectionReturnType<typeof wagmi>> = fromCallback(cb => {
  const storedConnections = getConnections(wagmi)
  const hasPortoConnection = storedConnections.some(conn => conn.connector.id === 'xyz.ithaca.porto')

  if (hasPortoConnection) {
    // Porto reconnect triggers watchConnection.onChange, no need to call cb manually
    reconnect(wagmi, { connectors: [portoConnector] }).catch(console.warn)
  } else {
    // For other wallets, emit initial connection state
    cb(getConnection(wagmi))
  }

  return watchConnection(wagmi, { onChange: cb })
})

const account: IStream<Promise<IAccountState | null>> = op(
  connection,
  map(async connection => {
    if (connection.status !== 'connected' || !connection.connector) return null

    try {
      const client = await wagmiGetWalletClient(wagmi, { chainId: connection.chainId })
      const address = client.account.address

      console.info('Account ready:', { address })

      return { client, address }
    } catch (error) {
      // Connector may be in transitional state during disconnect
      console.warn('Failed to get wallet client:', error)
      return null
    }
  }),
  state
)

async function connect(preferredConnectorId?: string): Promise<IAccountState | null> {
  const current = getConnection(wagmi)
  const targetConnector = wagmi.connectors.find(c => c.id === preferredConnectorId) ?? wagmi.connectors[0]

  if (!targetConnector) throw new Error('No wallet connector configured')

  // Already connected with same connector - return current wallet client
  if (current.status === 'connected' && current.connector?.id === targetConnector.id) {
    const client = await wagmiGetWalletClient(wagmi, { chainId: current.chainId })
    return { client, address: client.account.address }
  }

  try {
    const result = await wagmiConnect(wagmi, { connector: targetConnector })
    if (!result.accounts?.length) return null

    const client = await wagmiGetWalletClient(wagmi, { chainId: result.chainId })
    return { client, address: client.account.address }
  } catch (error: any) {
    if (error?.message?.includes('rejected')) {
      console.log('User cancelled wallet connection')
      return null
    }
    console.error('Failed to connect:', error)
    return null
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
  connect,
  disconnect,
  publicClient,
  wagmi,
  chainList,
  chainMap,
  connectors: wagmi.connectors.map(c => ({ id: c.id, name: c.name }))
}

export type { IAccountState, ChainBalance, SupportedChainId }
export default wallet
