import * as sql from '@puppet/database/client'
import * as schema from '@puppet/database/schema'
import type { Address } from 'viem'
import { getAddress } from 'viem'
import { getUnixTimestamp } from '../core/utils.js'
import type { Policy } from './types.js'

export interface PolicyClient {
  db: ReturnType<typeof sql.createClient>
}

/** Query policies for a specific master from the indexer */
export async function getPoliciesForTrader(
  client: PolicyClient,
  master: Address,
  nowSeconds?: bigint
): Promise<Policy[]> {
  const now = nowSeconds ?? BigInt(getUnixTimestamp())
  const masterAddr = getAddress(master)

  const policies = await client.db
    .select()
    .from(schema.match__SetPolicy)
    .where(
      sql.filter.and(
        sql.filter.gt(schema.match__SetPolicy.expiry, now),
        sql.filter.eq(schema.match__SetPolicy.master, masterAddr)
      )
    )

  return policies.map(policy => ({
    puppet: getAddress(policy.puppet),
    master: getAddress(policy.master),
    allowanceRate: Number(policy.allowanceRate),
    throttlePeriod: Number(policy.throttlePeriod),
    expiry: policy.expiry,
    blockTimestamp: policy.blockTimestamp
  }))
}
