import type { Connector } from '@wagmi/core'
import {
  type GetAccountReturnType,
  simulateContract,
  readContract as viemReadContract,
  writeContract as viemWriteContract,
  type WriteContractParameters,
  waitForTransactionReceipt
} from '@wagmi/core/actions'
import type * as abitype from 'abitype'
import {
  type Abi,
  type Address,
  type ContractEventName,
  type ContractFunctionArgs,
  type ContractFunctionName,
  type ParseEventLogsReturnType,
  parseEventLogs,
  type ReadContractParameters,
  type ReadContractReturnType,
  type TransactionReceipt
} from 'viem'
import type { Chain } from 'viem/chains'
import { wagmiConfig } from './walletConnect.js'

export type IWriteContractReturn<
  TAbi extends abitype.Abi = Abi,
  TEventName extends ContractEventName<TAbi> | ContractEventName<TAbi>[] | undefined = undefined
> = Promise<{
  transactionReceipt: TransactionReceipt
  events: ParseEventLogsReturnType<TAbi, TEventName, true>
}>

export async function writeContract<
  const TAbi extends abitype.Abi,
  TFunctionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>,
  TArgs extends ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', TFunctionName>,
  TEventName extends ContractEventName<TAbi> | ContractEventName<TAbi>[] | undefined = undefined
>(
  writeParams: Omit<WriteContractParameters<TAbi, TFunctionName, TArgs>, 'account'> & {
    eventName?: TEventName
  }
): IWriteContractReturn<TAbi, TEventName> {
  try {
    // const hash = await viemWriteContract(writeParams.walletClient, { ...writeParams, account: walletClient.account } as any)
    const sim = await simulateContract(wagmiConfig, {
      ...writeParams
    } as any)
    const hash = await viemWriteContract(wagmiConfig, sim.request)
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

export async function readContract<
  TAbi extends abitype.Abi,
  TFunctionName extends ContractFunctionName<TAbi, 'view'>,
  TArgs extends ContractFunctionArgs<TAbi, 'view', TFunctionName>
>(
  parameters: ReadContractParameters<TAbi, TFunctionName, TArgs>
): Promise<ReadContractReturnType<TAbi, TFunctionName, TArgs>> {
  return viemReadContract(wagmiConfig, parameters as any)
}

export type IWalletClient = GetAccountReturnType
export type IWalletConnected = {
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
