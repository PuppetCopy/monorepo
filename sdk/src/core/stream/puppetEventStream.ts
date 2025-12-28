import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import { CONTRACT_EVENT_MAP } from '@puppet/contracts/events'
import { filterNull, type IStream, map, op } from 'aelea/stream'
import { multicast, spreadArray } from 'aelea/stream-extended'
import { type AbiParameter, type DecodeAbiParametersReturnType, decodeAbiParameters, type PublicClient } from 'viem'
import { watchContractEvent } from './web3.js'

function createFilteredStream<const T extends readonly AbiParameter[]>(
  client: PublicClient,
  methodHash: `0x${string}`,
  args: T
): IStream<DecodeAbiParametersReturnType<T>> {
  return op(
    watchContractEvent(client, {
      abi: PUPPET_CONTRACT_MAP.Dictatorship.abi,
      address: PUPPET_CONTRACT_MAP.Dictatorship.address,
      eventName: 'PuppetEventLog'
    }),
    spreadArray,
    map(log => {
      if (log.args.method !== methodHash) return null
      return decodeAbiParameters(args, log.args.data)
    }),
    filterNull,
    multicast
  )
}

export function createCreateSubaccountStream(client: PublicClient) {
  return createFilteredStream(
    client,
    CONTRACT_EVENT_MAP.Allocation.CreateSubaccount.hash,
    CONTRACT_EVENT_MAP.Allocation.CreateSubaccount.args
  )
}

export function createExecuteMasterDepositStream(client: PublicClient) {
  return createFilteredStream(
    client,
    CONTRACT_EVENT_MAP.Allocation.ExecuteMasterDeposit.hash,
    CONTRACT_EVENT_MAP.Allocation.ExecuteMasterDeposit.args
  )
}

export function createExecuteAllocateStream(client: PublicClient) {
  return createFilteredStream(
    client,
    CONTRACT_EVENT_MAP.Allocation.ExecuteAllocate.hash,
    CONTRACT_EVENT_MAP.Allocation.ExecuteAllocate.args
  )
}

export function createExecuteWithdrawStream(client: PublicClient) {
  return createFilteredStream(
    client,
    CONTRACT_EVENT_MAP.Allocation.ExecuteWithdraw.hash,
    CONTRACT_EVENT_MAP.Allocation.ExecuteWithdraw.args
  )
}

export function createExecuteOrderStream(client: PublicClient) {
  return createFilteredStream(
    client,
    CONTRACT_EVENT_MAP.Allocation.ExecuteOrder.hash,
    CONTRACT_EVENT_MAP.Allocation.ExecuteOrder.args
  )
}
