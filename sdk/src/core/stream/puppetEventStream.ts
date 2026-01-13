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

export function createCreateMasterStream(client: PublicClient) {
  return createFilteredStream(
    client,
    CONTRACT_EVENT_MAP.Registry.CreateMaster.hash,
    CONTRACT_EVENT_MAP.Registry.CreateMaster.args
  )
}

export function createAllocateStream(client: PublicClient) {
  return createFilteredStream(
    client,
    CONTRACT_EVENT_MAP.Allocate.Allocate.hash,
    CONTRACT_EVENT_MAP.Allocate.Allocate.args
  )
}

export function createWithdrawStream(client: PublicClient) {
  return createFilteredStream(
    client,
    CONTRACT_EVENT_MAP.Withdraw.Withdraw.hash,
    CONTRACT_EVENT_MAP.Withdraw.Withdraw.args
  )
}

export function createMasterPostCallStream(client: PublicClient) {
  return createFilteredStream(
    client,
    CONTRACT_EVENT_MAP.Call.MasterPostCall.hash,
    CONTRACT_EVENT_MAP.Call.MasterPostCall.args
  )
}
