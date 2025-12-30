import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import type { Address, ContractFunctionArgs, Hex } from 'viem'
import { arbitrum } from 'viem/chains'

const subscriptionPolicy = PUPPET_CONTRACT_MAP.SubscriptionPolicy
const allocation = PUPPET_CONTRACT_MAP.Allocation

export type ExecuteAllocateArgs = ContractFunctionArgs<typeof allocation.abi, 'nonpayable', 'executeAllocate'>
export type CallIntent = ExecuteAllocateArgs[0]

const executeAllocateAbi = allocation.abi.find(
  (item): item is Extract<typeof item, { name: 'executeAllocate' }> => 'name' in item && item.name === 'executeAllocate'
)!

export const CALL_INTENT = {
  domain: {
    name: 'Puppet Allocation',
    version: '1',
    chainId: arbitrum.id,
    verifyingContract: allocation.address
  },
  types: {
    CallIntent: executeAllocateAbi.inputs[0].components.map(({ name, type }) => ({ name, type }))
  },
  primaryType: 'CallIntent'
} as const

/** Subscription record from the indexer */
export interface Subscription {
  configId: Hex
  puppet: Address
  key: Hex
  allowanceRate: number
  throttlePeriod: number
  expiry: bigint
  blockTimestamp: number
}

/** Puppet allocation in a match preview */
export interface PuppetAllocation {
  address: Address
  balance: bigint
  allocation: bigint
  allowanceRate: number
}

/** Match simulation result for UI display */
export interface MatchSimulation {
  puppets: PuppetAllocation[]
  totalAllocation: bigint
  puppetCount: number
}

/** Combined match result - allocations for tx + simulation for UI */
export interface MatchResult {
  allocations: { puppet: Address; amount: bigint }[]
  simulation: MatchSimulation
}

/** Subscription query parameters */
export interface SubscriptionQuery {
  token: Address
  master?: Address // if omitted, returns all subscriptions for token
  nowSeconds?: bigint // current timestamp, defaults to now
}

/** Key derivation version from SubscriptionPolicy contract */
export type KeyVersion =
  ContractFunctionArgs<typeof subscriptionPolicy.abi, 'view', 'config'> extends infer R ? R : number
