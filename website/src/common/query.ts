import { type IntervalTime, PRICEFEED_INTERVAL_LIST } from '@puppet-copy/middleware/const'
import { getClosestNumber, groupManyList, periodicRun, unixTimestampNow } from '@puppet-copy/middleware/core'
import type { ISetMatchingRule } from '@puppet-copy/sql/schema'
import { combine, type IStream, map } from 'aelea/stream'
import type { Address } from 'viem/accounts'
import { getStatus, sqlClient } from './sqlClient'

export const subgraphStatus = periodicRun({
  startImmediate: true,
  interval: 2500,
  actionOp: map(getStatus)
})

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
      where: (t, f) =>
        f.and(
          f.eq(t.puppet, address)
          // filterParams.account ? f.ilike(t.account, filterParams.account) : undefined,
          // // filterParams.collateralTokenList.length > 0 ? arrayContains(t.marketList, filterParams.collateralTokenList) : undefined,
          // f.gte(t.lastUpdatedTimestamp, startActivityTimeframeTimeSlot)
        )
      // limit: filterParams.paging.pageSize,
      // offset: filterParams.paging.offset,
      // orderBy: filterParams.sortBy
      //   ? filterParams.sortBy.direction === 'asc'
      //     ? asc(schema.traderRouteMetric[filterParams.sortBy.selector])
      //     : desc(schema.traderRouteMetric[filterParams.sortBy.selector])
      //   : undefined,
      // columns: {
      //   allowanceRate: true,
      //   collateralToken: true,
      //   expiry: true,
      //   id: true,
      //   traderMatchingKey: true,
      //   puppet: true,
      //   trader: true,
      //   throttleActivity: true
      // }
    })

    return metrictList
  }, combine(queryParams))
}
