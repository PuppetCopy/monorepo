import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  type GetAccountReturnType,
  getAccount,
  getConnectorClient,
  getWalletClient,
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  watchAccount,
  watchBlockNumber,
  writeContract
} from '@wagmi/core'
import { fromCallback, type IStream, skipRepeatsWith } from 'aelea/stream'
import { replayState } from 'aelea/stream-extended'
import {
  type Abi,
  type Chain,
  type ContractEventName,
  type ContractFunctionArgs,
  type ContractFunctionName,
  fallback,
  type Hex,
  http,
  type ParseEventLogsReturnType,
  type Prettify,
  parseEventLogs,
  type ReadContractParameters,
  type ReadContractReturnType,
  type SendCallsReturnType,
  type TransactionReceipt,
  type WriteContractParameters,
  webSocket
} from 'viem'
import type { Address } from 'viem/accounts'
import { sendCalls } from 'viem/actions'
import { arbitrum } from 'viem/chains'

export type IWalletConnected = {
  address: Address
  addresses: readonly [Address, ...Address[]]
  chain: Chain
  chainId: number
  isConnected: true
  isConnecting: false
  isDisconnected: false
  isReconnecting: false
  status: 'connected'
}

export type IGetWalletStatus = Prettify<GetAccountReturnType>

const projectId = import.meta.env.VITE__WC_PROJECT_ID

if (!projectId) {
  throw new Error('Missing VITE_WC_PROJECT_ID')
}

const networks = [arbitrum]

const transport = fallback([
  webSocket(import.meta.env.VITE__WC_RPC_URL_42161_1, {}),
  webSocket(import.meta.env.VITE__WC_RPC_URL_42161_2, {}),
  http('https://arb1.arbitrum.io/rpc')
])

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

const appkit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [arbitrum],
  showWallets: false,
  defaultNetwork: arbitrum,
  allWallets: 'ONLY_MOBILE',
  projectId,
  features: {
    connectMethodsOrder: ['wallet', 'social'],
    collapseWallets: false,
    swaps: false,
    email: false,
    send: false,
    history: false,
    onramp: false,
    analytics: true
  },
  metadata: {
    name: '__APP_NAME__',
    description: '__APP_DESC_SHORT__',
    url: window.location.origin,
    icons: ['https://imagedelivery.net/_aTEfDRm7z3tKgu9JhfeKA/5a7df101-00dc-4856-60a9-921b2879e200/lg']
  }
})

const blockChange: IStream<bigint> = fromCallback(cb => {
  return watchBlockNumber(wagmiAdapter.wagmiConfig, { onBlockNumber: res => cb(res) })
})

const appkitAccountEvent: IStream<GetAccountReturnType> = skipRepeatsWith(
  (prev, next) => prev.isConnected === next.isConnected && prev.address === next.address,
  fromCallback(cb => {
    watchAccount(wagmiAdapter.wagmiConfig, {
      onChange(account, _prevAccount) {
        cb(account)
      }
    })

    cb(getAccount(wagmiAdapter.wagmiConfig))
  }) as IStream<GetAccountReturnType>
)
const account: IStream<IGetWalletStatus> = replayState(appkitAccountEvent)

async function read<
  TAbi extends Abi,
  TFunctionName extends ContractFunctionName<TAbi, 'view'>,
  TArgs extends ContractFunctionArgs<TAbi, 'view', TFunctionName>
>(
  parameters: ReadContractParameters<TAbi, TFunctionName, TArgs>
): Promise<ReadContractReturnType<TAbi, TFunctionName, TArgs>> {
  return readContract(wagmiAdapter.wagmiConfig, parameters as any)
}

export type IWriteContractReturn<
  TAbi extends Abi = Abi,
  TEventName extends ContractEventName<TAbi> | ContractEventName<TAbi>[] | undefined = undefined
> = Promise<{
  transactionReceipt: TransactionReceipt
  events: ParseEventLogsReturnType<TAbi, TEventName, true>
}>

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
    // const hash = await viemWriteContract(writeParams.walletClient, { ...writeParams, account: walletClient.account } as any)
    const sim = await simulateContract(wagmiAdapter.wagmiConfig, {
      ...writeParams
    } as any)
    const hash = await writeContract(wagmiAdapter.wagmiConfig, sim.request)
    const transactionReceipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash })
    const events = parseEventLogs({
      eventName: writeParams.eventName,
      abi: writeParams.abi,
      logs: transactionReceipt.logs as any
    })

    return { events, transactionReceipt }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export type IBatchCall = {
  to: Address
  data: Hex
  value?: bigint | undefined
}

async function writeMany(callList: IBatchCall[]): Promise<SendCallsReturnType> {
  const client = await getConnectorClient(wagmiAdapter.wagmiConfig)
  const wallet = await getWalletClient(wagmiAdapter.wagmiConfig)
  const address = client.account.address

  if (!address) {
    throw new Error('No connected account found')
  }

  // /  const callList = dataList.filter((data) => data !== undefined).map((data): Call => ({ to: address, data }))

  if (callList.length === 0) {
    throw new Error('No valid calls to send')
  }

  // const result = await simulateCalls(client, {
  //   account: client.account,
  //   calls: callList
  //   // validation: true,
  //   // traceTransfers: true,
  //   // forceAtomic: true
  // })

  // const capabilities = await getCapabilities(wagmiAdapter.wagmiConfig).catch((error) => {
  //   console.error('Error getting capabilities:', error)
  //   return null
  // })

  // if (capabilities === null) {
  //   for (const call of callList) {
  //     if (!call) {
  //       throw new Error('Invalid call: "to" and "data" are required')
  //     }

  //     await sendTransaction(client, {
  //       account: client.account,
  //       chain: client.chain,
  //       data: call.data,
  //       to: call.to,
  //       value: call.value
  //     })

  //     return { id: '' } as SendCallsReturnType
  //   }
  // }

  const call = await sendCalls(client, {
    account: client.account,
    calls: callList,
    experimental_fallbackDelay: 1000, // Delay in ms before falling back to legacy transaction
    version: 'v1',
    experimental_fallback: true
    // forceAtomic: true
  })

  const result = await wallet.getCallsStatus({
    id: '0x1234567890abcdef'
  })

  return call
}

export const wallet = {
  read,
  write,
  writeMany,
  wagmiAdapter,
  appkit,
  blockChange,
  account,
  transport
}
