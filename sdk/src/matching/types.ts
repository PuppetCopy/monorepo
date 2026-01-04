import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import type { Address, ContractFunctionArgs } from 'viem'
import { arbitrum } from 'viem/chains'

const allocate = PUPPET_CONTRACT_MAP.Allocate

export type ExecuteAllocateArgs = ContractFunctionArgs<typeof allocate.abi, 'nonpayable', 'executeAllocate'>
export type CallIntent = ExecuteAllocateArgs[0]

export const CALL_INTENT = {
  domain: {
    name: 'Puppet Allocate',
    version: '1',
    chainId: arbitrum.id,
    verifyingContract: allocate.address
  },
  types: {
    CallIntent: [
      { name: 'account', type: 'address' },
      { name: 'subaccount', type: 'address' },
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'triggerNetValue', type: 'uint256' },
      { name: 'acceptableNetValue', type: 'uint256' },
      { name: 'positionParamsHash', type: 'bytes32' },
      { name: 'deadline', type: 'uint256' },
      { name: 'nonce', type: 'uint256' }
    ]
  },
  primaryType: 'CallIntent'
} as const

/** Policy record from the indexer */
export interface Policy {
  puppet: Address
  trader: Address
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
  trader: Address
  nowSeconds?: bigint // current timestamp, defaults to now
}
