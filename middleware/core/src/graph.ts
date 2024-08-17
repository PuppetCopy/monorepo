import { replayLatest } from '@aelea/core'
import { map, multicast } from '@most/core'
import { Stream } from '@most/types'
import { type Client } from '@urql/core'
import { ADDRESS_ZERO, IntervalTime, StateParams, combineState, getClosestNumber, groupArrayManyMap, periodicRun, unixTimestampNow } from 'common-utils'
import * as GMX from "gmx-middleware-const"
import { IPriceCandle, IPriceOracleMap, IPriceTickListMap, ISchema, schema as gmxSchema, parseQueryResults, querySignedPrices, querySubgraph } from "gmx-middleware-utils"
import * as viem from "viem"
import __tempTradeRouteDoc from './__temp_tradeRouteDoc.js'
import { schema } from './schema.js'
import { IPuppetTradeRoute, ISetRouteType } from './types.js'




// A simple in-memory cache object
// const cache = {}

// A utility function to hash queries for caching purposes
// const hashQuery = (operation: Operation<any, AnyVariables>) => {
//   // Implement a hashing function suitable for your queries
// }

// // Custom exchange
// const immutableCacheExchange: Exchange = ({ forward }) => (ops$) => {
//   return pipe(
//     ops$,
//     tap(operation => {
//       const { key, query, variables, kind, context, } = operation

//       const hashedQuery = hashQuery(query.kind)

//       if (!operation.context.skipCache && cache[hashedQuery]) {
//         // If there's a cached response and we're not skipping cache, use it
//         operation.data = cache[hashedQuery]
//       }
//     }),
//     forward,
//     tap(result => {
//       const { operation, data } = result
//       const { query, variables } = operation
//       const hashedQuery = hashQuery(query)

//       if (data && data.blockTimestamp) {
//         // If the latest blockTimestamp is newer than the cached one, update the cache
//         if (!cache[hashedQuery] || cache[hashedQuery].blockTimestamp < data.blockTimestamp) {
//           cache[hashedQuery] = data
//         }
//       }
//     }),
//     filter(result => {
//       // Filter out the operations that were served from the cache
//       const { operation } = result
//       const hashedQuery = hashQuery(operation.query)
//       return !operation.data || (cache[hashedQuery] && operation.data.blockTimestamp < cache[hashedQuery].blockTimestamp)
//     })
//   )
// }




type IQueryPosition = {
  address?: viem.Address
  selectedTradeRouteList?: ISetRouteType[]
}

type IQueryTraderPositionOpen = IQueryPosition
type IQueryPuppetTradeRoute = IQueryPosition & { activityTimeframe: IntervalTime }
type IQueryTraderPositionSettled = IQueryPosition & { activityTimeframe: IntervalTime }

export function queryTraderPositionOpen(subgraphClient: Client, queryParams: StateParams<IQueryTraderPositionOpen>) {
  return map(async params => {
    const list = await querySubgraph(subgraphClient, {
      schema: schema.mirrorPositionOpen,
      filter: {
        trader: {
          _eq: params.address
        }
      },
    }, { requestPolicy: 'network-only' })

    if (params.selectedTradeRouteList?.length) {
      const routeTypeKeyList = params.selectedTradeRouteList.map(route => route.routeTypeKey)

      return list.filter(position => position.position && routeTypeKeyList.indexOf(position.routeTypeKey) !== -1)
    }

    // TODO: remove this filter
    return list.filter(position => position.position)
  }, combineState(queryParams))
}

export function queryTraderPositionSettled(subgraphClient: Client, queryParams: StateParams<IQueryTraderPositionSettled>) {
  return map(async params => {

    const list = await querySubgraph(subgraphClient, {
      schema: schema.mirrorPositionSettled,
      filter: {
        trader: {
          _eq: params.address
        },
        blockTimestamp: {
          _gte: unixTimestampNow() - (params.activityTimeframe || 0)
        }
      },
    }, { requestPolicy: 'network-only' })

    if (params.selectedTradeRouteList && params.selectedTradeRouteList.length > 0) {
      const routeTypeKeyList = params.selectedTradeRouteList.map(route => route.routeTypeKey)

      return list.filter(position => routeTypeKeyList.indexOf(position.routeTypeKey) !== -1)
    }

    return list
  }, combineState(queryParams))
}

export function queryPuppetTradeRoute(subgraphClient: Client, queryParams: StateParams<IQueryPuppetTradeRoute>) {
  return map(async params => {
    if (params.address === ADDRESS_ZERO) {
      return []
    }

    const list = await subgraphClient.query(__tempTradeRouteDoc(params.address, params.activityTimeframe), {}).toPromise().then(res => {
      if (res.error) {
        throw res.error
      }

      const puppetTradeRoutes = res.data.puppetTradeRoutes as any[]
      return puppetTradeRoutes.map(item => parseQueryResults(item, schema.puppetTradeRoute))
    }) as IPuppetTradeRoute[]

    if (params.selectedTradeRouteList && params.selectedTradeRouteList.length > 0) {
      const routeTypeKeyList = params.selectedTradeRouteList.map(route => route.routeTypeKey)
      return list.filter(position => routeTypeKeyList.indexOf(position.routeTypeKey) !== -1)
    }

    return list
  }, combineState(queryParams))
}



interface IQueryPriceCandle {
  interval: IntervalTime
  token?: viem.Address
  timestamp_gte?: number
}



interface ISubgraphStatus {
  end_block?: number
  first_event_block_number: number
  latest_processed_block: bigint
  num_events_processed: number
  timestamp_caught_up_to_head_or_endblock: number
  __typename: 'chain_metadata',
}

const chainMetadataSchema: ISchema<ISubgraphStatus> = {
  first_event_block_number: 'int',
  latest_processed_block: 'int',
  num_events_processed: 'int',
  timestamp_caught_up_to_head_or_endblock: 'string',
  __typename: 'chain_metadata',
}

export const getSubgraphStatus = async (subgraphClient: Client): Promise<ISubgraphStatus> => {
  const query = await querySubgraph(subgraphClient, {
    schema: chainMetadataSchema,
  }, { requestPolicy: 'network-only' })

  return query[0]
}

export const subgraphStatus = (subgraphClient: Client): Stream<ISubgraphStatus> => replayLatest(multicast(periodicRun({
  startImmediate: true,
  interval: 2500,
  actionOp: map(() => getSubgraphStatus(subgraphClient)),
})))


type IQueryMarketHistory = {
  selectedTradeRouteList: ISetRouteType[]
  activityTimeframe: IntervalTime
}

const candleSchema: ISchema<{ id: string, timestamp: number; c: bigint; __typename: 'PriceCandle', token: viem.Address }> = {
  id: 'string',
  timestamp: 'int',
  token: 'address',
  c: 'int',
  __typename: 'PriceCandle',
}

export function queryLatestPriceTick(subgraphClient: Client, queryParams: StateParams<IQueryMarketHistory>, estTickAmout = 20) {
  return map(async params => {


    const signedPricesQuery = querySignedPrices()

    const candleListQuery = querySubgraph(subgraphClient, {
      schema: candleSchema,
      filter: {
        interval: {
          _eq: getClosestNumber(GMX.PRICEFEED_INTERVAL, params.activityTimeframe / estTickAmout)
        },
        timestamp: {
          _gte: String(unixTimestampNow() - params.activityTimeframe)
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    })

    const candleList = [...await candleListQuery, ...Object.values(await signedPricesQuery).map(x => ({ timestamp: Number(x.timestamp), c: x.max, token: x.token }))]
    const mapped: IPriceTickListMap = groupArrayManyMap(candleList, x => viem.getAddress(x.token), x => {
      return { timestamp: Number(x.timestamp), price: x.c }
    })

    return mapped
  }, combineState(queryParams))

}

export const latestPriceMap: Stream<IPriceOracleMap> = replayLatest(multicast(periodicRun({
  startImmediate: true,
  interval: 2500,
  actionOp: map(async count => {
    const newLocal = await querySignedPrices()
    return newLocal
  }),
})))

export async function queryLatestTokenPriceFeed(subgraphClient: Client, filter: IQueryPriceCandle = { interval: IntervalTime.MIN5 }) {
  const queryFeed = querySubgraph(subgraphClient, {
    orderBy: {
      timestamp: 'desc',
    },
    schema: gmxSchema.priceCandle,
    filter,
  })

  const queryLatest = querySubgraph(subgraphClient, {
    schema: gmxSchema.priceCandleSeed,
    filter: filter,
  })

  const [feed, latest] = await Promise.all([queryFeed, queryLatest])
  const list = [...feed, latest[0] as any as IPriceCandle].sort((a, b) => a.timestamp - b.timestamp)

  return list
}



export async function queryRouteTypeList(subgraphClient: Client) {
  const query = await querySubgraph(subgraphClient, {
    schema: schema.setRouteType,
  })

  return query.filter(x => x.collateralToken === GMX.ARBITRUM_ADDRESS.USDC)
}

export type { Client }

