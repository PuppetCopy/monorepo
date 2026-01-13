import { ADDRESS_ZERO, CROSS_CHAIN_TOKEN_MAP } from '@puppet/sdk/const'
import { groupList } from '@puppet/sdk/core'
import type { IntentCost, IntentInput } from '@rhinestone/sdk'
import { walletConnect } from '@wagmi/connectors'
import {
  type Config,
  type ConnectReturnType,
  connect,
  createConfig,
  createStorage,
  type GetConnectionReturnType,
  getConnection,
  type ReadContractParameters,
  readContract,
  disconnect as wagmiDisconnect,
  watchConnection
} from '@wagmi/core'
import { erc20Abi } from 'abitype/abis'
import type { IStream } from 'aelea/stream'
import { fromCallback } from 'aelea/stream-extended'
import {
  type Abi,
  type ContractFunctionArgs,
  type ContractFunctionName,
  createPublicClient,
  fallback,
  http,
  type ReadContractReturnType
} from 'viem'
import type { Address } from 'viem/accounts'
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains'

// Re-export extension client functions
export {
  clearAllExtensionStorage,
  clearExtensionWalletState,
  getExtensionWalletState,
  MessageType,
  sendExtensionMessage,
  setActiveWallet,
  setExtensionWalletState,
  type WalletState
} from '@puppet/wallet/client'
// Re-export smart account types and functions for backwards compatibility
export {
  createMasterAccount,
  getPortfolio,
  type IAccountState,
  type IConnectedAccountState,
  type IMasterAccountState,
  type IPuppetAccountState,
  type ISignerAccountBase,
  type ISmartAccountState,
  initializeAccountState,
  initializeMasterAccount,
  initializePuppetAccount,
  initializeSmartAccount,
  type MasterAccountParams,
  type PortfolioItem,
  type PortfolioTokenBalance,
  rhinestoneSDK,
  type SessionSigner,
  signSession,
  TOKEN_ID
} from './smartAccount.js'

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

const WALLETCONNECT_PROJECT_ID = 'b81521b9a6d17b1d070aa5899c2fdcfe'

const walletConnectConnector = walletConnect({
  projectId: WALLETCONNECT_PROJECT_ID
})

const wagmi: Config = createConfig({
  chains: chainList,
  connectors: [walletConnectConnector],
  storage: createStorage({ storage: localStorage }),
  transports: Object.fromEntries(
    chainList.map(chain => [
      chain.id,
      fallback([http(`/api/rpc?network=${CHAIN_NETWORK[chain.id]}`), http(chain.rpcUrls.default.http[0])])
    ])
  ) as any
})

const connection: IStream<GetConnectionReturnType<typeof wagmi>> = fromCallback(cb => {
  cb(getConnection(wagmi))

  return watchConnection(wagmi, {
    onChange(connection) {
      cb(connection)
    }
  })
})

export async function connectWallet(preferredConnectorId?: string): Promise<ConnectReturnType<typeof wagmi>> {
  const currentConnection = getConnection(wagmi)

  if (currentConnection.status === 'connected') throw new Error('Wallet already connected')

  if (currentConnection.status === 'connecting') await new Promise(() => {})

  const targetConnector = wagmi.connectors.find(c => c.id === preferredConnectorId) ?? wagmi.connectors[0]

  if (!targetConnector) throw new Error('No compatible wallet found. Please install a supported wallet.')

  if (currentConnection.connector?.id === targetConnector.id) throw new Error('Wallet already connected')

  return connect(wagmi, { connector: targetConnector })
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

const wallet = {
  read,
  getTokenBalance,
  getMultichainBalances,
  getIntentCost,
  connection,
  disconnect,
  publicClient,
  wagmi,
  chainList,
  chainMap,
  walletConnectProjectId: WALLETCONNECT_PROJECT_ID
}

export default wallet
