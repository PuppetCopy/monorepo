import { type IntervalTime, PRICEFEED_INTERVAL_LIST } from '@puppet/sdk/const'
import { getClosestNumber, getUnixTimestamp, groupManyList } from '@puppet/sdk/core'
import type { ISubscribeRule } from '@puppet/sql/schema'
import { combine, type IStream, map } from 'aelea/stream'
import type { Address } from 'viem/accounts'
import type { IAccountState } from '../wallet/wallet.js'
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
    const priceList = await sqlClient.query.gmx__PriceCandle.findMany({
      columns: {
        c: true,
        slotTime: true,
        token: true
      },
      where: (t, f) =>
        f.and(
          f.eq(t.interval, getClosestNumber(PRICEFEED_INTERVAL_LIST, params.activityTimeframe / estTickAmout)),
          f.gte(t.slotTime, getUnixTimestamp() - params.activityTimeframe),
          params.tokenList ? f.inArray(t.token, params.tokenList) : undefined
        )
    })
    return groupManyList(priceList, 'token')

    // map results by token
  }, combine(queryParams))
}

export function queryUserSubscribeRuleList(
  accountQuery: IStream<Promise<IAccountState | null>>
): IStream<Promise<ISubscribeRule[]>> {
  return map(async query => {
    const account = await query
    if (!account) return []

    return sqlClient.query.subscribe__Rule.findMany({
      where: (t, f) => f.eq(t.user, account.address)
    })
  }, accountQuery)
}
