import { ADDRESS_ZERO, CROSS_CHAIN_TOKEN_MAP } from '@puppet-copy/middleware/const'
import { groupList } from '@puppet-copy/middleware/core'
import { type RhinestoneAccount, RhinestoneSDK, walletClientToAccount } from '@rhinestone/sdk'
import { porto } from '@wagmi/connectors'
import {
  type Config,
  createConfig,
  type GetConnectionReturnType,
  getConnection,
  type ReadContractParameters,
  readContract,
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
  type ContractFunctionArgs,
  type ContractFunctionName,
  fallback,
  formatUnits,
  http,
  type ReadContractReturnType,
  type WalletClient,
  webSocket
} from 'viem'
import type { Address } from 'viem/accounts'
import { getBalance } from 'viem/actions'
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains'

type ChainBalance = { chainId: number; balance: bigint }

type WalletPortfolio = {
  ETH: ChainBalance[]
  USDC: ChainBalance[]
}

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

type RhinestonePortfolioToken = {
  symbol: string
  totalBalance: string
  lockedBalance: string
  unlockedBalance: string
  decimals: number
  chains: RhinestonePortfolioChain[]
}

type IAccountState = {
  walletClient: WalletClient
  address: Address
  subAccount: RhinestoneAccount
  portfolio: RhinestonePortfolioToken[]
  walletPortfolio: WalletPortfolio
}

// Transport configuration for reading blockchain data
const rhinestoneSDK = new RhinestoneSDK({
  apiKey: 'proxy',
  endpointUrl: `${window.location.origin}/api/orchestrator`,
  provider: {
    type: 'custom',
    urls: {
      [arbitrum.id]: import.meta.env.VITE__WC_RPC_URL_42161_1
    }
  }
})

const chainList = [mainnet, base, optimism, arbitrum, polygon] as const
const chainMap = groupList(chainList, 'id')

const wagmi: Config = createConfig({
  chains: chainList,
  connectors: [
    porto({
      mode: Mode.dialog({
        renderer: Dialog.popup()
      })
    })
  ],
  transports: {
    [arbitrum.id]: fallback([
      webSocket(import.meta.env.VITE__WC_RPC_URL_42161_1, {}),
      webSocket(import.meta.env.VITE__WC_RPC_URL_42161_2, {}),
      http('https://arb1.arbitrum.io/rpc')
    ]),
    [mainnet.id]: http(mainnet.rpcUrls.default.http[0]),
    [base.id]: http(base.rpcUrls.default.http[0]),
    [optimism.id]: http(optimism.rpcUrls.default.http[0]),
    [polygon.id]: http(polygon.rpcUrls.default.http[0])
  }
})

const connection: IStream<GetConnectionReturnType<typeof wagmi>> = fromCallback(cb => {
  const currentConnection = getConnection(wagmi)
  cb(currentConnection)

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
    if (connection.status === 'connecting') {
      // wait until connected
      await new Promise<void>(resolve => {})
    }

    try {
      if (connection.status !== 'connected') {
        return null
      }

      const walletClient = await wagmiGetWalletClient(wagmi, { chainId: connection.chainId })

      const address = walletClient.account.address
      const accountOwner = walletClientToAccount(walletClient)
      const subAccount = await rhinestoneSDK.createAccount({
        owners: {
          type: 'ecdsa',
          accounts: [accountOwner]
        }
      })
      const [portfolio, ethBalances, usdcBalances] = await Promise.all([
        fetchRhinestonePortfolio(subAccount),
        getMultichainBalances('ETH', address),
        getMultichainBalances('USDC', address)
      ])

      const accountState: IAccountState = {
        address,
        walletClient,
        subAccount,
        portfolio,
        walletPortfolio: {
          ETH: ethBalances,
          USDC: usdcBalances
        }
      }

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
    const targetConnector =
      wagmi.connectors.find(connector => connector.id === preferredConnectorId) ?? wagmi.connectors[0]

    if (!targetConnector) {
      throw new Error('No wallet connector is configured')
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

async function getTokenBalance(tokenAddress: Address, owner: Address, chainId: number): Promise<bigint> {
  if (tokenAddress === ADDRESS_ZERO) {
    return getBalance(wagmi.getClient({ chainId }), { address: owner })
  }
  return read({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [owner],
    chainId
  })
}

async function getMultichainBalances(
  symbol: keyof (typeof CROSS_CHAIN_TOKEN_MAP)[keyof typeof CROSS_CHAIN_TOKEN_MAP],
  owner: Address
): Promise<ChainBalance[]> {
  const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T | null> =>
    Promise.race([promise, new Promise<null>(resolve => setTimeout(() => resolve(null), ms))])

  const results = await Promise.all(
    chainList.map(async chain => {
      const tokenMap = CROSS_CHAIN_TOKEN_MAP[chain.id as keyof typeof CROSS_CHAIN_TOKEN_MAP]
      const tokenAddress = tokenMap?.[symbol]
      if (!tokenAddress) return { chainId: chain.id, balance: 0n }

      try {
        const balance = await withTimeout(getTokenBalance(tokenAddress, owner, chain.id), 5000)
        return { chainId: chain.id, balance: balance ?? 0n }
      } catch {
        return { chainId: chain.id, balance: 0n }
      }
    })
  )
  return results.filter(r => r.balance > 0n)
}

const fetchRhinestonePortfolio = async (
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
  connectors: wagmi.connectors.map(connector => ({ id: connector.id, name: connector.name }))
}

export type { IAccountState, ChainBalance }
export default wallet
