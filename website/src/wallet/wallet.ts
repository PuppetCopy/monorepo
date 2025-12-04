import { ADDRESS_ZERO, CROSS_CHAIN_TOKEN_MAP } from '@puppet-copy/middleware/const'
import { groupList } from '@puppet-copy/middleware/core'
import { type RhinestoneAccount, RhinestoneSDK } from '@rhinestone/sdk'
import { porto } from '@wagmi/connectors'
import {
  type Config,
  createConfig,
  type GetConnectionReturnType,
  getConnection,
  getPublicClient,
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
  type Chain,
  type ContractFunctionArgs,
  type ContractFunctionName,
  createPublicClient,
  fallback,
  formatUnits,
  type Hex,
  http,
  keccak256,
  type ReadContractReturnType,
  type Transport,
  type WalletClient
} from 'viem'
import { type Address, type PrivateKeyAccount, privateKeyToAccount, toAccount } from 'viem/accounts'
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains'

type ChainBalance = { chainId: number; balance: bigint }

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
  walletClient: WalletClient<Transport, Chain>
  address: Address
  companionSigner: PrivateKeyAccount
  subAccount: RhinestoneAccount
  portfolio: RhinestonePortfolioToken[]
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

const COMPANION_SIGNER_STORAGE_PREFIX = 'rhinestone:companion:signer:'

const portoConnector = porto({
  chains: chainList,
  mode: Mode.dialog({
    renderer: Dialog.popup()
  })
})

const wagmi: Config = createConfig({
  chains: chainList,
  connectors: [portoConnector],
  transports: {
    [arbitrum.id]: fallback([http('/api/rpc?network=arbitrum'), http(arbitrum.rpcUrls.default.http[0])]),
    [mainnet.id]: fallback([http('/api/rpc?network=ethereum'), http(mainnet.rpcUrls.default.http[0])]),
    [base.id]: fallback([http('/api/rpc?network=base'), http(base.rpcUrls.default.http[0])]),
    [optimism.id]: fallback([http('/api/rpc?network=optimism'), http(optimism.rpcUrls.default.http[0])]),
    [polygon.id]: fallback([http('/api/rpc?network=polygon'), http(polygon.rpcUrls.default.http[0])])
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
    try {
      if (connection.status !== 'connected') {
        return null
      }

      const walletClient = await wagmiGetWalletClient(wagmi, { chainId: connection.chainId })
      const address = walletClient.account.address
      const ownerAccount = toAccount({
        address,
        signMessage: async ({ message }) => {
          throw new Error('User signer is not available in the companion account flow')
        },
        signTransaction: async transaction => {
          throw new Error('User signer is not available in the companion account flow')
        },
        signTypedData: async params => {
          throw new Error('User signer is not available in the companion account flow')
        }
      })
      const storageKey = `${COMPANION_SIGNER_STORAGE_PREFIX}${address.toLowerCase()}`

      // 1. Try to load from storage first
      let privateKey: Hex | null = null
      try {
        privateKey = localStorage.getItem(storageKey) as Hex | null
      } catch (error) {
        console.warn('Unable to read stored companion signer:', error)
      }

      // 2. If not in storage, derive from signature (will prompt once)
      if (!privateKey) {
        try {
          const message = `ephemeral-signer:${address}:one-click-deposit:v1`
          const signature = await walletClient.signMessage({
            account: walletClient.account,
            message
          })
          privateKey = keccak256(signature) as Hex

          try {
            localStorage.setItem(storageKey, privateKey)
          } catch (error) {
            console.warn('Unable to persist companion signer:', error)
          }
        } catch (error: any) {
          const msg = error?.message ?? ''
          if (msg.includes('user rejected') || msg.includes('User rejected')) {
            console.log('User cancelled companion signer setup')
          } else {
            console.error('Failed to setup companion signer:', error)
          }
          return null
        }
      }

      // 3. Create the actual signer account
      let companionSigner: PrivateKeyAccount | null = null
      try {
        companionSigner = privateKeyToAccount(privateKey as Hex)
      } catch (error) {
        console.warn('Stored companion signer was invalid; clearing cached key.', error)
        try {
          localStorage.removeItem(storageKey)
        } catch (clearError) {
          console.warn('Unable to clear invalid companion signer:', clearError)
        }
        return null
      }

      const subAccount = await rhinestoneSDK.createAccount({
        owners: {
          type: 'ecdsa',
          accounts: [ownerAccount, companionSigner]
        }
      })

      console.log(companionSigner.address)
      console.log(address)
      console.log(subAccount.getAddress())

      const portfolio = await fetchRhinestonePortfolio(subAccount)

      const accountState: IAccountState = {
        address,
        walletClient,
        companionSigner,
        subAccount,
        portfolio
      }

      console.info('Account state updated:', {
        address: accountState.address,
        companionSignerAddress: accountState.companionSigner.address,
        subAccount,
        subAccountAddress: subAccount.getAddress(),
        portfolio: accountState.portfolio
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

  const rpcUrl = (() => {
    const url = new URL('/api/rpc', window.location.origin)
    url.searchParams.set('network', network)
    // service worker expects refresh=true to bypass API cache
    if (refresh) {
      url.searchParams.set('refresh', 'true')
    }
    return url.toString()
  })()

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

export function getMainnetPublicClient() {
  return getPublicClient(wagmi, { chainId: mainnet.id })
}

export type { IAccountState, ChainBalance }
export default wallet
