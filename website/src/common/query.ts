import { replayLatest } from "aelea/core"
import { map, multicast } from "@most/core"
import { IntervalTime, PRICEFEED_INTERVAL } from "@puppet/middleware/const"
import { combineState, getClosestNumber, groupArrayMany, periodicRun, StateParams, unixTimestampNow } from "@puppet/middleware/utils"
import * as viem from "viem"
import { getStatus, queryDb } from "./sqlClient"



export const subgraphStatus = replayLatest(multicast(periodicRun({
  startImmediate: true,
  interval: 2500,
  actionOp: map(() => getStatus()),
})))


export function queryPricefeed(
  queryParams: StateParams<{
    tokenList?: viem.Address[]
    activityTimeframe: IntervalTime
  }>,
  estTickAmout = 10
) {
  return map(async params => {
    const priceList = await queryDb.query.priceCandle.findMany({
      columns: {
        c: true,
        slotTime: true,
        token: true
      },
      where: (t, f) => f.and(
        f.eq(t.interval, getClosestNumber(PRICEFEED_INTERVAL, params.activityTimeframe / estTickAmout)),
        f.gte(t.slotTime, unixTimestampNow() - params.activityTimeframe),
        params.tokenList ? f.inArray(t.token, params.tokenList) : undefined
      ),
    })
    return groupArrayMany(priceList, c => c.token)

    // map results by token

  }, combineState(queryParams))
}

// export function queryMatchRouteStats(
//   subgraphClient: Client,
//   queryParams: StateParams<{
//     account?: viem.Address
//     activityTimeframe?: IntervalTime
//     sortBy?: IRequestSortApi
//     collateralTokenList?: viem.Address[]
//   }>
// ) {
//   return map(async filterParams => {
//     // const filter: graph.IQueryFilter<IMatchRouteStats> = {}

//     // if (filterParams.account) {
//     //   filter.account = {
//     //     _eq: `"${filterParams.account}"`
//     //   }
//     // }


//     // const orFilters: any[] = []

//     // if (filterParams.collateralTokenList) {
//     //   orFilters.push(
//     //     ...filterParams.collateralTokenList.map(token => ({
//     //       collateralToken: {
//     //         _eq: `"${token}"`
//     //       }
//     //     }))
//     //   )
//     // }

//     // if (filterParams.activityTimeframe) {
//     //   const timestampFilter = unixTimestampNow() - filterParams.activityTimeframe

//     //   // filter.settledTimestamp = {
//     //   //   _gte: timestampFilter
//     //   // }
//     //   filter.interval = {
//     //     _eq: filterParams.activityTimeframe
//     //   }

//     //   filter.blockTimestamp = {
//     //     _gte: timestampFilter
//     //   }

//     //   filter.matchRoute = {
//     //     increaseList: { blockTimestamp: { _gte: timestampFilter } },
//     //     decreaseList: { blockTimestamp: { _gte: timestampFilter } }
//     //   } as any
//     // }


//     // if (orFilters.length) {
//     //   filter._or = orFilters
//     // }

//     // const sortBy = filterParams.sortBy
//     //   ? { [filterParams.sortBy.selector]: filterParams.sortBy.direction, }
//     //   : undefined
//     // // filter.account_id = {
//     // //   _eq: '"0x1B4E44f70D1D023784210a9c2F8b84eBD613c29C"'
//     // // }


//     // const list = await graph.querySubgraph(subgraphClient, {
//     //   schema: schema.routeMatchStats,
//     //   limit: 20,
//     //   filter,
//     //   sortBy,
//     // })

//     return query.db.select().from(schema.traderRouteMetric)
//       .where(
//         and(
//           ...(filterParams.account ? [eq(schema.traderRouteMetric.account, filterParams.account)] : []),
//           ...(filterParams.activityTimeframe ? [gte(schema.traderRouteMetric.blockTimestamp, unixTimestampNow() - filterParams.activityTimeframe)] : []),
//           ...(filterParams.collateralTokenList ? [
//             or(
//               ...(filterParams.collateralTokenList.map(token => (
//                 eq(schema.traderRouteMetric.collateralToken, token)
//               ))),
//             )
//           ] : []),
//           ...(filterParams.sortBy ? [
//             eq(schema.traderRouteMetric[filterParams.sortBy.selector], filterParams.sortBy.direction)
//           ] : []),
//         )
//       )
//       .orderBy(
//         ...(filterParams.sortBy ? [
//           desc(schema.traderRouteMetric[filterParams.sortBy.selector])
//         ] : [])
//       )
//   }, combineState(queryParams))
// }
