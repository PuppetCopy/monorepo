import { empty, mergeArray, now } from '@most/core'
import type { Stream } from '@most/types'
import { type Connector, createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'


import {
  createConfig,
  type GetAccountReturnType,
  getAccount,
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  watchAccount,
  watchBlockNumber,
  writeContract
} from '@wagmi/core'
import { fromCallback } from 'aelea/core'
import {
  type Abi,
  type Address,
  type ContractEventName,
  type ContractFunctionArgs,
  type ContractFunctionName,
  fallback,
  http,
  type ParseEventLogsReturnType,
  parseEventLogs,
  type ReadContractParameters,
  type ReadContractReturnType,
  type TransactionReceipt,
  type WriteContractParameters,
  webSocket
} from 'viem'
import { arbitrum } from 'viem/chains'

type IWalletClient = GetAccountReturnType
type IWalletConnected = {
  address: Address
  addresses: readonly [Address, ...Address[]]
  chain: number
  chainId: number
  connector: Connector
  isConnected: true
  isConnecting: false
  isDisconnected: false
  isReconnecting: false
  status: 'connected'
}

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

const wagmiConfig = wagmiAdapter.wagmiConfig

const connectAppkit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [arbitrum],
  // showWallets: false,
  // allWallets: 'HIDE',
  projectId,
  // features: {
  //   connectMethodsOrder: ['wallet', 'social'],
  //   collapseWallets: false,
  //   swaps: false,
  //   email: false,
  //   send: false,
  //   history: false,
  //   onramp: false,
  //   analytics: true
  // },
  metadata: {
    name: '__APP_NAME__',
    description: '__APP_DESC_SHORT__',
    url: window.location.origin,
    icons: ['https://imagedelivery.net/_aTEfDRm7z3tKgu9JhfeKA/5a7df101-00dc-4856-60a9-921b2879e200/lg']
  }
})

const blockChange: Stream<bigint> = fromCallback((cb) => {
  return watchBlockNumber(wagmiConfig, { onBlockNumber: (res) => cb(res) })
})

const accountStatus = getAccount(wagmiConfig)

const account: Stream<GetAccountReturnType> = mergeArray([
  accountStatus.connector === undefined ? now(accountStatus) : empty(),
  fromCallback((cb) => {
    return watchAccount(wagmiConfig, { onChange: (res) => cb(res) })
  })
])

async function read<
  TAbi extends Abi,
  TFunctionName extends ContractFunctionName<TAbi, 'view'>,
  TArgs extends ContractFunctionArgs<TAbi, 'view', TFunctionName>
>(
  parameters: ReadContractParameters<TAbi, TFunctionName, TArgs>
): Promise<ReadContractReturnType<TAbi, TFunctionName, TArgs>> {
  return readContract(wagmiConfig, parameters as any)
}

type IWriteContractReturn<
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
    const sim = await simulateContract(wagmiConfig, {
      ...writeParams
    } as any)
    const hash = await writeContract(wagmiConfig, sim.request)
    const transactionReceipt = await waitForTransactionReceipt(wagmiConfig, { hash })
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

export const wallet = {
  read,
  write,
  connectAppkit,
  blockChange,
  account,
  wagmiConfig,
  transport,
}

export type { IWalletClient, IWalletConnected, IWriteContractReturn }
