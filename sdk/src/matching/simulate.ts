import type { Address, PublicClient } from 'viem'
import { applyBasisPoints, min } from '../core/math.js'
import { getPuppetBalances } from './balance.js'
import type { MatchResult, Policy, PuppetAllocation } from './types.js'

/**
 * Core matching algorithm - calculates puppet allocations (sync)
 * Returns both the allocation list for transactions and detailed simulation for UI
 */
export function calculateMatch(policies: Policy[], balances: Map<Address, bigint>, amount: bigint): MatchResult {
  const allocations: { puppet: Address; amount: bigint }[] = []
  const puppets: PuppetAllocation[] = []
  let totalAllocation = 0n

  for (const policy of policies) {
    const balance = balances.get(policy.puppet)
    if (!balance || balance === 0n) continue

    const maxAllowed = applyBasisPoints(BigInt(policy.allowanceRate), balance)
    const allocation = min(maxAllowed, amount)

    if (allocation > 0n) {
      totalAllocation += allocation
      allocations.push({ puppet: policy.puppet, amount: allocation })
      puppets.push({
        address: policy.puppet,
        balance,
        allocation,
        allowanceRate: policy.allowanceRate
      })
    }
  }

  return {
    allocations,
    simulation: {
      puppets,
      totalAllocation,
      puppetCount: puppets.length
    }
  }
}

/**
 * Async helper - fetches balances and simulates match
 */
export async function simulateMatch(
  rpc: PublicClient,
  policies: Policy[],
  token: Address,
  amount: bigint
): Promise<MatchResult> {
  if (policies.length === 0) {
    return {
      allocations: [],
      simulation: { puppets: [], totalAllocation: 0n, puppetCount: 0 }
    }
  }

  const puppetAddresses = policies.map(p => p.puppet)
  const balances = await getPuppetBalances(rpc, token, puppetAddresses)

  return calculateMatch(policies, balances, amount)
}
