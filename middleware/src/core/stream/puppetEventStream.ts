import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import { CONTRACT_EVENT_MAP } from '@puppet/contracts/events'
import { filterNull, map, op } from 'aelea/stream'
import { multicast, spreadArray } from 'aelea/stream-extended'
import { decodeAbiParameters, type PublicClient } from 'viem'
import { watchContractEvent } from './web3.js'

export function createPuppetEventLog(publicClient: PublicClient) {
  return op(
    watchContractEvent(publicClient, {
      ...PUPPET_CONTRACT_MAP.Dictatorship,
      eventName: 'PuppetEventLog'
    }),
    spreadArray,
    multicast
  )
}

type PuppetEventLogStream = ReturnType<typeof createPuppetEventLog>

export function createSubscribeRuleStream(puppetEventLog: PuppetEventLogStream) {
  return op(
    puppetEventLog,
    map(log => {
      if (log.args.method !== CONTRACT_EVENT_MAP.Subscribe.Rule.hash) {
        return null
      }
      return decodeAbiParameters(CONTRACT_EVENT_MAP.Subscribe.Rule.args, log.args.data)
    }),
    filterNull,
    multicast
  )
}

export function createDepositStream(puppetEventLog: PuppetEventLogStream) {
  return op(
    puppetEventLog,
    map(log => {
      if (log.args.method !== CONTRACT_EVENT_MAP.Account.Deposit.hash) {
        return null
      }
      return decodeAbiParameters(CONTRACT_EVENT_MAP.Account.Deposit.args, log.args.data)
    }),
    filterNull,
    multicast
  )
}

export function createWithdrawStream(puppetEventLog: PuppetEventLogStream) {
  return op(
    puppetEventLog,
    map(log => {
      if (log.args.method !== CONTRACT_EVENT_MAP.Account.Withdraw.hash) {
        return null
      }
      return decodeAbiParameters(CONTRACT_EVENT_MAP.Account.Withdraw.args, log.args.data)
    }),
    filterNull,
    multicast
  )
}

export function createSettleStream(puppetEventLog: PuppetEventLogStream) {
  return op(
    puppetEventLog,
    map(log => {
      if (log.args.method !== CONTRACT_EVENT_MAP.Settle.Settle.hash) {
        return null
      }
      return decodeAbiParameters(CONTRACT_EVENT_MAP.Settle.Settle.args, log.args.data)
    }),
    filterNull,
    multicast
  )
}

export function createRequestMatchStream(puppetEventLog: PuppetEventLogStream) {
  return op(
    puppetEventLog,
    map(log => {
      if (log.args.method !== CONTRACT_EVENT_MAP.Mirror.Match.hash) {
        return null
      }
      return decodeAbiParameters(CONTRACT_EVENT_MAP.Mirror.Match.args, log.args.data)
    }),
    filterNull,
    multicast
  )
}

export function createRequestAdjustStream(puppetEventLog: PuppetEventLogStream) {
  return op(
    puppetEventLog,
    map(log => {
      if (log.args.method !== CONTRACT_EVENT_MAP.Mirror.Adjust.hash) {
        return null
      }
      return decodeAbiParameters(CONTRACT_EVENT_MAP.Mirror.Adjust.args, log.args.data)
    }),
    filterNull,
    multicast
  )
}

export function createRequestCloseStream(puppetEventLog: PuppetEventLogStream) {
  return op(
    puppetEventLog,
    map(log => {
      if (log.args.method !== CONTRACT_EVENT_MAP.Mirror.Close.hash) {
        return null
      }
      return decodeAbiParameters(CONTRACT_EVENT_MAP.Mirror.Close.args, log.args.data)
    }),
    filterNull,
    multicast
  )
}

export function createPuppetEventStreams(publicClient: PublicClient) {
  const puppetEventLog = createPuppetEventLog(publicClient)

  return {
    puppetEventLog,
    subscribeRule: createSubscribeRuleStream(puppetEventLog),
    deposit: createDepositStream(puppetEventLog),
    withdraw: createWithdrawStream(puppetEventLog),
    settle: createSettleStream(puppetEventLog),
    requestMatch: createRequestMatchStream(puppetEventLog),
    requestAdjust: createRequestAdjustStream(puppetEventLog),
    requestClose: createRequestCloseStream(puppetEventLog)
  }
}
