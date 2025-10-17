import { createAppKit } from '@reown/appkit'
import { type AppKitNetwork, arbitrum, base } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  type GetAccountReturnType,
  getAccount,
  getConnectorClient,
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  watchAccount,
  watchBlockNumber,
  writeContract
} from '@wagmi/core'
import { type IStream, skipRepeatsWith } from 'aelea/stream'
import { fromCallback, state } from 'aelea/stream-extended'
import {
  type Abi,
  type Call,
  type Chain,
  type ContractEventName,
  type ContractFunctionArgs,
  type ContractFunctionName,
  decodeFunctionData,
  fallback,
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
import { estimateGas, sendCalls } from 'viem/actions'

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

const networks = [arbitrum, base] as [AppKitNetwork, AppKitNetwork]

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
  networks: networks,
  showWallets: false,
  enableNetworkSwitch: true,
  allowUnsupportedChain: true,
  defaultNetwork: arbitrum,
  allWallets: 'ONLY_MOBILE',
  projectId,
  features: {
    connectMethodsOrder: ['wallet', 'social'],
    collapseWallets: false,
    swaps: true,
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
const account: IStream<IGetWalletStatus> = state(appkitAccountEvent)

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

export interface IBatchCall extends Call<any, any> {}

async function writeMany(callList: IBatchCall[]): Promise<SendCallsReturnType> {
  const client = await getConnectorClient(wagmiAdapter.wagmiConfig)
  const address = client.account.address

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

        await simulateContract(wagmiAdapter.wagmiConfig, {
          abi: callParams.abi,
          address: callParams.to,
          functionName,
          args: args || [],
          account: address,
          value: callParams.value
        } as any)
      } else {
        // Fallback to estimateGas for calls without ABI
        await estimateGas(client, {
          account: client.account,
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

  const result = await sendCalls(client, {
    account: client.account,
    calls: callsForSending,
    experimental_fallbackDelay: 1000,
    experimental_fallback: true
  })

  return result
}

export const wallet = {
  wagmiConfig: wagmiAdapter.wagmiConfig,
  read,
  write,
  writeMany,
  wagmiAdapter,
  appkit,
  blockChange,
  account,
  transport
}
