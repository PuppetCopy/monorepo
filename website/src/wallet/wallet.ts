import { type RhinestoneAccount, RhinestoneSDK, type TransactionResult, walletClientToAccount } from '@rhinestone/sdk'
import {
  type Config,
  createConfig,
  type GetConnectionReturnType,
  connect as wagmiConnect,
  disconnect as wagmiDisconnect,
  watchConnection
} from '@wagmi/core'
import { awaitPromises, type IStream, map, op, switchMap } from 'aelea/stream'
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
  type PublicClient,
  parseEventLogs,
  type ReadContractParameters,
  type ReadContractReturnType,
  type SendCallsReturnType,
  type TransactionReceipt,
  type WalletClient,
  type WriteContractParameters,
  webSocket,
  type Transport,
  type Chain
} from 'viem'
import type { Address } from 'viem/accounts'
import { arbitrum } from 'viem/chains'
import { porto as portoConnector, walletConnect as walletConnectConnector } from 'wagmi/connectors'

if (!import.meta.env.VITE__WC_PROJECT_ID) {
  throw new Error('Missing WalletConnect Project ID in environment variables')
}

export type IAccountState = {
  publicClient: PublicClient<Transport, Chain>
  client: WalletClient
  address: Address
  account: RhinestoneAccount
}

const rhinestoneSDK = new RhinestoneSDK({
  apiKey: 'proxy',
  endpointUrl: `${window.location.origin}/api/orchestrator`
})

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

const account: IStream<Promise<IAccountState | null>> = op(
  connection,
  map(async connection => {
    const connector = connection.connector

    if (connection.status === 'connecting') {
      return 'connecting' as const
    }

    if (!connector || !connection.address) {
      return null
    }

    // Create public client for reading blockchain data
    const publicClient = createPublicClient({
      chain: arbitrum,
      transport
    })

    const provider = await connector.getProvider()

    const client = createWalletClient({
      account: connection.address,
      chain: arbitrum,
      transport: custom(provider)
    })

    const accountOwner = walletClientToAccount(client)
    const rhAccount = await rhinestoneSDK.createAccount({
      owners: {
        type: 'ecdsa',
        accounts: [accountOwner]
      }
    })

    const accountState: IAccountState = {
      client,
      publicClient,
      address: connection.address,
      account: rhAccount
    }

    return accountState
  }),
  state
)

// Block change listener
const blockChange: IStream<bigint> = op(
  account,
  awaitPromises,
  switchMap(accountState => {
    if (!accountState) {
      throw new Error('No account connected')
    }

    return fromCallback(cb => {
      const unwatch = accountState.publicClient.watchBlockNumber({
        onBlockNumber: blockNumber => cb(blockNumber)
      })
      return unwatch
    })
  })
)

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
  accountState: IAccountState,
  parameters: ReadContractParameters<TAbi, TFunctionName, TArgs>
): Promise<ReadContractReturnType<TAbi, TFunctionName, TArgs>> {
  return accountState.publicClient.readContract(parameters as any)
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
    const { request } = await accountState.publicClient.simulateContract({
      ...writeParams,
      account: accountState.address,
      chain: arbitrum
    } as any)

    // Execute the transaction
    const hash = await accountState.client.writeContract(request as any)

    // Wait for the transaction receipt
    const transactionReceipt = await accountState.publicClient.waitForTransactionReceipt({ hash })

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
async function writeMany(accountState: IAccountState, callList: IBatchCall[]): Promise<TransactionResult> {
  const client = accountState.publicClient
  const address = accountState.address

  if (callList.length === 0) {
    throw new Error('No valid calls to send')
  }

  // Strip ABI from calls for sendCalls (it doesn't need it)
  const callsForSending = callList.map(({ to, data, value }) => ({
    to,
    data,
    value
  }))

  // Send the batch of calls
  const result = await accountState.account.sendTransaction({
    chain: accountState.publicClient.chain,
    calls: callsForSending,
    targetChain: arbitrum
  })

  return result
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
  rhinestoneSDK,
  connectors: wagmiConfig.connectors.map(connector => ({ id: connector.id, name: connector.name }))
}
