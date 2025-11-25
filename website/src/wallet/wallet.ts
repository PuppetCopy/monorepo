import { RhinestoneSDK, walletClientToAccount } from '@rhinestone/sdk'
import {
  type Config,
  type Connector,
  createConfig,
  type GetConnectionReturnType,
  getConnection,
  connect as wagmiConnect,
  disconnect as wagmiDisconnect,
  watchConnection
} from '@wagmi/core'
import { type IStream, map, o, op, switchMap } from 'aelea/stream'
import { fromCallback, state } from 'aelea/stream-extended'
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
import { porto as portoConnector, walletConnect as walletConnectConnector } from 'wagmi/connectors'

if (!import.meta.env.VITE__WC_PROJECT_ID) {
  throw new Error('Missing WalletConnect Project ID in environment variables')
}

export type IAccountState = {
  client: WalletClient
  address: Address
  sdk: RhinestoneSDK
}

// Simple wallet state - either connected with an address or not
export type IConnectionState = IAccountState | null | 'connecting'

const protoConnector = portoConnector({
  mode: Mode.dialog({
    renderer: Dialog.popup()
  })
})

export const wagmiConfig: Config = createConfig({
  chains: [arbitrum],
  connectors: [
    protoConnector,

    walletConnectConnector({
      projectId: import.meta.env.VITE__WC_PROJECT_ID,
      metadata: {
        name: 'Puppet',
        description: 'Puppet copy trading',
        url: 'https://puppet.tech',
        icons: ['https://puppet.tech/favicon.png']
      },
      showQrModal: true
    })
  ],
  transports: {
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc')
  }
})
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

const connection: IStream<GetConnectionReturnType<typeof wagmiConfig>> = fromCallback(cb => {
  const unsubscribe = watchConnection(wagmiConfig, {
    onChange(conn) {
      cb(conn)
    }
  })

  // const initialConnection = getConnection(wagmiConfig)
  // currentConnection = {
  //   address: (initialConnection as any)?.accounts?.[0],
  //   connectorName: initialConnection?.connector?.name,
  //   status: initialConnection?.status ?? 'disconnected',
  //   connector: initialConnection?.connector ?? null
  // }
  // cb(currentConnection)

  return unsubscribe
})

const account: IStream<Promise<IConnectionState>> = op(
  connection,
  map(async connection => {
    const connector = connection.connector

    if (connection.status === 'connecting') {
      return 'connecting' as const
    }

    if (!connector || !connection.address) {
      return null
    }

    const provider = await connector.getProvider()

    const client = createWalletClient({
      account: connection.address,
      chain: arbitrum,
      transport: custom(provider)
    })

    const rhSdk = new RhinestoneSDK({
      apiKey: 'proxy',
      endpointUrl: `${window.location.origin}/api/orchestrator`
    })

    const accountOwner = walletClientToAccount(client)
    const rhAccount = await rhSdk.createAccount({
      owners: {
        type: 'ecdsa',
        accounts: [accountOwner]
      }
    })
    const addr = rhAccount.getAddress() as Address

    const accountState: IAccountState = {
      client,
      address: connection.address,
      sdk: rhSdk
    }

    return accountState
  }),
  state
)

// Block change listener
const blockChange: IStream<bigint> = fromCallback(cb => {
  const unwatch = publicClient.watchBlockNumber({
    onBlockNumber: blockNumber => cb(blockNumber)
  })
  return unwatch
})

async function connect(preferredConnectorId?: string) {
  try {
    const targetConnector =
      wagmiConfig.connectors.find(connector => connector.id === preferredConnectorId) ?? wagmiConfig.connectors[0]

    if (!targetConnector) {
      throw new Error('No wallet connector is configured')
    }

    const result = await wagmiConnect(wagmiConfig, {
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
  await wagmiDisconnect(wagmiConfig)
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
  accountState: IAccountState,
  writeParams: Omit<WriteContractParameters<TAbi, TFunctionName, TArgs>, 'account' | 'chain'> & {
    eventName?: TEventName
  }
): IWriteContractReturn<TAbi, TEventName> {
  try {
    // Simulate the transaction first
    const { request } = await publicClient.simulateContract({
      ...writeParams,
      account: accountState.address,
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
  const walletClient = await getWalletClient()
  const address = walletClient.account?.address

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
  blockChange,
  account,
  connect,
  disconnect,
  transport,
  publicClient,
  connectors: wagmiConfig.connectors.map(connector => ({ id: connector.id, name: connector.name }))
}
