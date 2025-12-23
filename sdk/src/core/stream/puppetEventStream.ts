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

export function createSubscribeRuleStream(client: PublicClient) {
  return createFilteredStream(client, CONTRACT_EVENT_MAP.Subscribe.Rule.hash, CONTRACT_EVENT_MAP.Subscribe.Rule.args)
}

export function createDepositStream(client: PublicClient) {
  return createFilteredStream(client, CONTRACT_EVENT_MAP.Account.Deposit.hash, CONTRACT_EVENT_MAP.Account.Deposit.args)
}

export function createWithdrawStream(client: PublicClient) {
  return createFilteredStream(
    client,
    CONTRACT_EVENT_MAP.Account.Withdraw.hash,
    CONTRACT_EVENT_MAP.Account.Withdraw.args
  )
}

export function createAllocateStream(client: PublicClient) {
  return createFilteredStream(client, CONTRACT_EVENT_MAP.Allocation.Allocate.hash, CONTRACT_EVENT_MAP.Allocation.Allocate.args)
}

export function createUtilizeStream(client: PublicClient) {
  return createFilteredStream(client, CONTRACT_EVENT_MAP.Allocation.Utilize.hash, CONTRACT_EVENT_MAP.Allocation.Utilize.args)
}

export function createSettleStream(client: PublicClient) {
  return createFilteredStream(client, CONTRACT_EVENT_MAP.Allocation.Settle.hash, CONTRACT_EVENT_MAP.Allocation.Settle.args)
}

export function createRealizeStream(client: PublicClient) {
  return createFilteredStream(client, CONTRACT_EVENT_MAP.Allocation.Realize.hash, CONTRACT_EVENT_MAP.Allocation.Realize.args)
}

export function createAllocationWithdrawStream(client: PublicClient) {
  return createFilteredStream(client, CONTRACT_EVENT_MAP.Allocation.Withdraw.hash, CONTRACT_EVENT_MAP.Allocation.Withdraw.args)
}
