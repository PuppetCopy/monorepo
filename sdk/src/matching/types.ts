import type { Address } from 'viem'

/** Policy record from the indexer */
export interface Policy {
  puppet: Address
  master: Address
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

/** Policy query parameters */
export interface PolicyQuery {
  master: Address
  nowSeconds?: bigint // current timestamp, defaults to now
}
