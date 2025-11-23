import {
  type Connector,
  createConfig,
  getAccount,
  connect as wagmiConnect,
  disconnect as wagmiDisconnect,
  watchAccount
} from '@wagmi/core'
import type { IStream } from 'aelea/stream'
import { fromCallback, state } from 'aelea/stream-extended'
import type { Porto, Provider } from 'porto'
import { Dialog, Mode } from 'porto'
import {
  type Abi,
  type Call,
  type ContractEventName,
  type ContractFunctionArgs,
  type ContractFunctionName,
  createPublicClient,
  createWalletClient,
  custom,
  decodeFunctionData,
  fallback,
  http,
  type ParseEventLogsReturnType,
  parseEventLogs,
  type ReadContractParameters,
  type ReadContractReturnType,
  type SendCallsReturnType,
  type TransactionReceipt,
  type WalletClient,
  type WriteContractParameters,
  webSocket
} from 'viem'
import type { Address } from 'viem/accounts'
import { arbitrum } from 'viem/chains'
import { porto as portoConnector } from 'wagmi/connectors'

// Simple wallet state - either connected with an address or not
export type IWalletState = {
  address: Address | undefined
  isConnecting: boolean
}

// Wagmi configuration with Porto connector
const portoConnectorFn = portoConnector({
  mode: Mode.dialog({
    renderer: Dialog.popup()
  })
})

const wagmiConfig = createConfig({
  chains: [arbitrum],
  connectors: [portoConnectorFn],
  transports: {
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc')
  }
})

type PortoConnector = Connector & { getPortoInstance: () => Promise<Porto.Porto> }

function isPortoConnector(connector: Connector): connector is PortoConnector {
  return 'getPortoInstance' in connector
}

const portoConnectorInstance = wagmiConfig.connectors.find(isPortoConnector)

if (!portoConnectorInstance) {
  throw new Error('Porto connector is not configured')
}

function getPortoInstance() {
  return portoConnectorInstance!.getPortoInstance()
}

async function getPortoProvider() {
  const porto = await getPortoInstance()
  return porto.provider
}

// Transport configuration for reading blockchain data
const transport = fallback([
  webSocket(import.meta.env.VITE__WC_RPC_URL_42161_1, {}),
  webSocket(import.meta.env.VITE__WC_RPC_URL_42161_2, {}),
  http('https://arb1.arbitrum.io/rpc')
])

// Create public client for reading blockchain data
const publicClient = createPublicClient({
  chain: arbitrum,
  transport
})

// Create wallet client that will be updated when connected
let walletClient: WalletClient | null = null
let portoProviderPromise: Promise<Provider> | null = null

async function resolvePortoProvider() {
  portoProviderPromise ??= getPortoProvider()
  return portoProviderPromise
}

async function syncWalletClient(account: Address | undefined) {
  if (!account) {
    walletClient = null
    return
  }

  const provider = await resolvePortoProvider()
  walletClient = createWalletClient({
    account,
    chain: arbitrum,
    transport: custom(provider)
  })
}

// Simple account state
let currentAccount: Address | undefined
let isConnecting = false

// Store callback for updating the stream
let updateAccountStream: ((state: IWalletState) => void) | null = null

// Create account stream for reactive updates
const accountEvent: IStream<IWalletState> = fromCallback(cb => {
  // Store the callback so we can use it in connect/disconnect functions
  updateAccountStream = cb

  // Watch Wagmi account changes
  const unsubscribe = watchAccount(wagmiConfig, {
    onChange(account) {
      console.log('Wagmi account changed:', account)
      currentAccount = account.address
      void syncWalletClient(account.address)
      cb({ address: currentAccount, isConnecting: account.isConnecting ?? false })
    }
  })

  // Get initial account state from Wagmi
  const initialAccount = getAccount(wagmiConfig)
  currentAccount = initialAccount.address
  isConnecting = initialAccount.isConnecting ?? false

  // Initial state
  cb({ address: currentAccount, isConnecting })

  // Check for existing connection on load via Wagmi
  if (currentAccount) {
    void syncWalletClient(currentAccount).then(() => {
      console.log('Restored wallet connection:', currentAccount)
    })
  }

  let removePortoListeners: (() => void) | undefined

  void (async () => {
    const provider = await resolvePortoProvider()

    const handleAccountsChanged = (accounts: readonly Address[]) => {
      console.log('Accounts changed:', accounts)

      if (accounts.length > 0) {
        currentAccount = accounts[0]
        void syncWalletClient(accounts[0])
      } else {
        currentAccount = undefined
        walletClient = null
      }

      cb({ address: currentAccount, isConnecting: false })
    }

    const handleChainChanged = (chainId: string) => {
      console.log('Chain changed:', chainId)
      // Could handle chain switching here if needed
    }

    const handleDisconnect = () => {
      console.log('Wallet disconnected')
      currentAccount = undefined
      walletClient = null
      cb({ address: currentAccount, isConnecting: false })
    }

    const handleConnect = (info: any) => {
      console.log('Wallet connected event:', info)
    }

    provider.on?.('accountsChanged', handleAccountsChanged as any)
    provider.on?.('chainChanged', handleChainChanged as any)
    provider.on?.('disconnect', handleDisconnect as any)
    provider.on?.('connect', handleConnect as any)

    removePortoListeners = () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged as any)
      provider.removeListener?.('chainChanged', handleChainChanged as any)
      provider.removeListener?.('disconnect', handleDisconnect as any)
      provider.removeListener?.('connect', handleConnect as any)
    }
  })()

  return () => {
    // Cleanup listeners if needed
    updateAccountStream = null
    unsubscribe()
    removePortoListeners?.()
  }
})

// Create state stream
const account: IStream<IWalletState> = state(accountEvent)

// Block change listener
const blockChange: IStream<bigint> = fromCallback(cb => {
  const unwatch = publicClient.watchBlockNumber({
    onBlockNumber: blockNumber => cb(blockNumber)
  })
  return unwatch
})

// Connect wallet function using Wagmi with Porto connector
async function connect() {
  try {
    console.log('Starting wallet connection via Wagmi...')
    isConnecting = true

    // Update UI to show connecting state
    if (updateAccountStream) {
      updateAccountStream({ address: currentAccount, isConnecting: true })
    }

    if (!portoConnectorInstance) {
      throw new Error('Porto connector is not configured')
    }

    // Use Wagmi connect with Porto connector
    const result = await wagmiConnect(wagmiConfig, {
      connector: portoConnectorInstance
    })

    console.log('Wagmi connection result:', result)

    if (result.accounts && result.accounts.length > 0) {
      currentAccount = result.accounts[0]

      // Create wallet client with Porto provider
      await syncWalletClient(currentAccount)

      // Update UI to show connected state
      isConnecting = false
      if (updateAccountStream) {
        updateAccountStream({ address: currentAccount, isConnecting: false })
      }

      console.log('Wallet connected successfully via Wagmi:', currentAccount)
      return result.accounts
    }

    // If no accounts returned, reset state
    isConnecting = false
    if (updateAccountStream) {
      updateAccountStream({ address: currentAccount, isConnecting: false })
    }

    return []
  } catch (error: any) {
    console.log('Connection error:', error)

    isConnecting = false

    // Update UI to show disconnected state
    if (updateAccountStream) {
      updateAccountStream({ address: currentAccount, isConnecting: false })
    }

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
  try {
    // Use Wagmi disconnect
    await wagmiDisconnect(wagmiConfig)

    // Clear the state
    currentAccount = undefined
    walletClient = null

    // Update UI to show disconnected state
    if (updateAccountStream) {
      updateAccountStream({ address: undefined, isConnecting: false })
    }

    console.log('Wallet disconnected')
  } catch (error) {
    console.error('Failed to disconnect wallet:', error)
  }
}

// Read contract function
async function read<
  TAbi extends Abi,
  TFunctionName extends ContractFunctionName<TAbi, 'view'>,
  TArgs extends ContractFunctionArgs<TAbi, 'view', TFunctionName>
>(
  parameters: ReadContractParameters<TAbi, TFunctionName, TArgs>
): Promise<ReadContractReturnType<TAbi, TFunctionName, TArgs>> {
  return publicClient.readContract(parameters as any)
}

export type IWriteContractReturn<
  TAbi extends Abi = Abi,
  TEventName extends ContractEventName<TAbi> | ContractEventName<TAbi>[] | undefined = undefined
> = Promise<{
  transactionReceipt: TransactionReceipt
  events: ParseEventLogsReturnType<TAbi, TEventName, true>
}>

// Write contract function
async function write<
  const TAbi extends Abi,
  TFunctionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>,
  TArgs extends ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', TFunctionName>,
  TEventName extends ContractEventName<TAbi> | ContractEventName<TAbi>[] | undefined = undefined
>(
  writeParams: Omit<WriteContractParameters<TAbi, TFunctionName, TArgs>, 'account' | 'chain'> & {
    eventName?: TEventName
  }
): IWriteContractReturn<TAbi, TEventName> {
  try {
    if (!walletClient) {
      throw new Error('Wallet not connected')
    }

    // Simulate the transaction first
    const { request } = await publicClient.simulateContract({
      ...writeParams,
      account: walletClient.account,
      chain: arbitrum
    } as any)

    // Execute the transaction
    const hash = await walletClient.writeContract(request as any)

    // Wait for the transaction receipt
    const transactionReceipt = await publicClient.waitForTransactionReceipt({ hash })

    // Parse events if eventName is provided
    const events = parseEventLogs({
      eventName: writeParams.eventName,
      abi: writeParams.abi,
      logs: transactionReceipt.logs as any
    })

    return { events, transactionReceipt }
  } catch (error) {
    console.error('Write contract error:', error)
    throw error
  }
}

export interface IBatchCall extends Call<any, any> {}

// Write many transactions (batch calls)
async function writeMany(callList: IBatchCall[]): Promise<SendCallsReturnType> {
  if (!walletClient) {
    throw new Error('Wallet not connected')
  }

  const address = walletClient.account?.address

  if (!address) {
    throw new Error('No connected account found')
  }

  if (callList.length === 0) {
    throw new Error('No valid calls to send')
  }

  // Simulate each call before attempting to send
  for (let i = 0; i < callList.length; i++) {
    const callParams = callList[i]
    try {
      // If ABI is provided, use simulateContract for better error messages
      if (callParams.abi) {
        const { functionName, args } = decodeFunctionData({
          abi: callParams.abi,
          data: callParams.data
        })

        await publicClient.simulateContract({
          abi: callParams.abi,
          address: callParams.to,
          functionName,
          args: args || [],
          account: address,
          value: callParams.value
        } as any)
      } else {
        // Fallback to estimateGas for calls without ABI
        await publicClient.estimateGas({
          account: address,
          to: callParams.to,
          data: callParams.data,
          value: callParams.value
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Transaction ${i + 1} of ${callList.length} would fail: ${errorMessage}`)
    }
  }

  // Strip ABI from calls for sendCalls (it doesn't need it)
  const callsForSending = callList.map(({ to, data, value }) => ({
    to,
    data,
    value
  }))

  // Send the batch of calls
  const result = await walletClient.sendCalls({
    account: walletClient.account,
    calls: callsForSending,
    experimental_fallbackDelay: 1000,
    experimental_fallback: true
  } as any)

  return result as SendCallsReturnType
}

export const wallet = {
  read,
  write,
  writeMany,
  connect,
  disconnect,
  blockChange,
  account,
  transport,
  publicClient
}
