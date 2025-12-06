import { type IntervalTime, PRICEFEED_INTERVAL_LIST } from '@puppet-copy/middleware/const'
import { getClosestNumber, groupManyList, unixTimestampNow } from '@puppet-copy/middleware/core'
import type { ISetMatchingRule } from '@puppet-copy/sql/schema'
import { combine, type IStream, map } from 'aelea/stream'
import type { Address } from 'viem/accounts'
import { sqlClient } from './sqlClient'

export type StateParams<T> = {
  [P in keyof T]: IStream<T[P]>
}

export function queryPricefeed(
  queryParams: StateParams<{
    tokenList?: Address[]
    activityTimeframe: IntervalTime
  }>,
  estTickAmout = 10
) {
  return map(async params => {
    const priceList = await sqlClient.query.priceCandle.findMany({
      columns: {
        c: true,
        slotTime: true,
        token: true
      },
      where: (t, f) =>
        f.and(
          f.eq(t.interval, getClosestNumber(PRICEFEED_INTERVAL_LIST, params.activityTimeframe / estTickAmout)),
          f.gte(t.slotTime, unixTimestampNow() - params.activityTimeframe),
          params.tokenList ? f.inArray(t.token, params.tokenList) : undefined
        )
    })
    return groupManyList(priceList, 'token')

    // map results by token
  }, combine(queryParams))
}

export function queryUserMatchingRuleList(
  queryParams: StateParams<{
    address: Address | undefined
  }>
): IStream<Promise<ISetMatchingRule[]>> {
  return map(async params => {
    const address = params.address
    if (address === undefined) {
      return []
    }

    const metrictList = await sqlClient.query.setMatchingRule.findMany({
      where: (t, f) => f.eq(t.puppet, address)
    })

    return metrictList
  }, combine(queryParams))
}
