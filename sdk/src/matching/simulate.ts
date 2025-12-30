import type { Address, PublicClient } from 'viem'
import { applyBasisPoints, min } from '../core/math.js'
import { getPuppetBalances } from './balance.js'
import type { MatchResult, PuppetAllocation, Subscription } from './types.js'

/**
 * Core matching algorithm - calculates puppet allocations (sync)
 * Returns both the allocation list for transactions and detailed simulation for UI
 */
export function calculateMatch(
  subscriptions: Subscription[],
  balances: Map<Address, bigint>,
  amount: bigint
): MatchResult {
  const allocations: { puppet: Address; amount: bigint }[] = []
  const puppets: PuppetAllocation[] = []
  let totalAllocation = 0n

  for (const sub of subscriptions) {
    const balance = balances.get(sub.puppet)
    if (!balance || balance === 0n) continue

    const maxAllowed = applyBasisPoints(BigInt(sub.allowanceRate), balance)
    const allocation = min(maxAllowed, amount)

    if (allocation > 0n) {
      totalAllocation += allocation
      allocations.push({ puppet: sub.puppet, amount: allocation })
      puppets.push({
        address: sub.puppet,
        balance,
        allocation,
        allowanceRate: sub.allowanceRate
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
  subscriptions: Subscription[],
  token: Address,
  amount: bigint
): Promise<MatchResult> {
  if (subscriptions.length === 0) {
    return {
      allocations: [],
      simulation: { puppets: [], totalAllocation: 0n, puppetCount: 0 }
    }
  }

  const puppetAddresses = subscriptions.map(s => s.puppet)
  const balances = await getPuppetBalances(rpc, token, puppetAddresses)

  return calculateMatch(subscriptions, balances, amount)
}
