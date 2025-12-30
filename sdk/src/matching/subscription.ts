import * as sql from '@puppet/database/client'
import * as schema from '@puppet/database/schema'
import type { Address, Hex } from 'viem'
import { getAddress } from 'viem'
import { getUnixTimestamp } from '../core/utils.js'
import { deriveSpecificKey, deriveWildcardKey } from './keys.js'
import type { Subscription } from './types.js'

export interface SubscriptionClient {
  db: ReturnType<typeof sql.createClient>
  policyVersion: number
}

/** Query subscriptions for a specific master and token from the indexer */
export async function getSubscriptionsForMaster(
  client: SubscriptionClient,
  master: Address,
  token: Address,
  nowSeconds?: bigint
): Promise<Subscription[]> {
  const now = nowSeconds ?? BigInt(getUnixTimestamp())
  const masterAddr = getAddress(master)
  const tokenAddr = getAddress(token)

  const specificKey = deriveSpecificKey(client.policyVersion, tokenAddr, masterAddr)
  const wildcardKey = deriveWildcardKey(client.policyVersion, tokenAddr)

  const subscriptions = await client.db
    .select()
    .from(schema.subscriptionPolicy__Subscribe)
    .where(
      sql.filter.and(
        sql.filter.gt(schema.subscriptionPolicy__Subscribe.expiry, now),
        sql.filter.inArray(schema.subscriptionPolicy__Subscribe.key, [specificKey, wildcardKey])
      )
    )

  const result: Subscription[] = []
  const seenPuppets = new Set<Address>()

  // Process specific subscriptions first (they take priority)
  for (const sub of subscriptions) {
    if (sub.key !== specificKey) continue
    const puppet = getAddress(sub.account)
    if (seenPuppets.has(puppet)) continue
    seenPuppets.add(puppet)

    result.push({
      configId: sub.configId as Hex,
      puppet,
      key: sub.key as Hex,
      allowanceRate: sub.allowanceRate,
      throttlePeriod: sub.throttlePeriod,
      expiry: sub.expiry,
      blockTimestamp: sub.blockTimestamp
    })
  }

  // Then add wildcard subscriptions for puppets not already matched
  for (const sub of subscriptions) {
    if (sub.key !== wildcardKey) continue
    const puppet = getAddress(sub.account)
    if (seenPuppets.has(puppet)) continue
    seenPuppets.add(puppet)

    result.push({
      configId: sub.configId as Hex,
      puppet,
      key: sub.key as Hex,
      allowanceRate: sub.allowanceRate,
      throttlePeriod: sub.throttlePeriod,
      expiry: sub.expiry,
      blockTimestamp: sub.blockTimestamp
    })
  }

  return result
}

/** Query all subscriptions for a token (any master) */
export async function getSubscriptionsForToken(
  client: SubscriptionClient,
  token: Address,
  nowSeconds?: bigint
): Promise<Subscription[]> {
  const now = nowSeconds ?? BigInt(getUnixTimestamp())
  const tokenAddr = getAddress(token)
  const wildcardKey = deriveWildcardKey(client.policyVersion, tokenAddr)

  const subscriptions = await client.db
    .select()
    .from(schema.subscriptionPolicy__Subscribe)
    .where(
      sql.filter.and(
        sql.filter.gt(schema.subscriptionPolicy__Subscribe.expiry, now),
        sql.filter.eq(schema.subscriptionPolicy__Subscribe.key, wildcardKey)
      )
    )

  return subscriptions.map(sub => ({
    configId: sub.configId as Hex,
    puppet: getAddress(sub.account),
    key: sub.key as Hex,
    allowanceRate: sub.allowanceRate,
    throttlePeriod: sub.throttlePeriod,
    expiry: sub.expiry,
    blockTimestamp: sub.blockTimestamp
  }))
}
