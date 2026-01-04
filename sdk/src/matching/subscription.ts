import * as sql from '@puppet/database/client'
import * as schema from '@puppet/database/schema'
import type { Address } from 'viem'
import { getAddress } from 'viem'
import { getUnixTimestamp } from '../core/utils.js'
import type { Policy } from './types.js'

export interface PolicyClient {
  db: ReturnType<typeof sql.createClient>
}

/** Query policies for a specific trader from the indexer */
export async function getPoliciesForTrader(
  client: PolicyClient,
  trader: Address,
  nowSeconds?: bigint
): Promise<Policy[]> {
  const now = nowSeconds ?? BigInt(getUnixTimestamp())
  const traderAddr = getAddress(trader)

  const policies = await client.db
    .select()
    .from(schema.match__SetPolicy)
    .where(
      sql.filter.and(
        sql.filter.gt(schema.match__SetPolicy.expiry, now),
        sql.filter.eq(schema.match__SetPolicy.trader, traderAddr)
      )
    )

  return policies.map(policy => ({
    puppet: getAddress(policy.puppet),
    trader: getAddress(policy.trader),
    allowanceRate: Number(policy.allowanceRate),
    throttlePeriod: Number(policy.throttlePeriod),
    expiry: policy.expiry,
    blockTimestamp: policy.blockTimestamp
  }))
}
