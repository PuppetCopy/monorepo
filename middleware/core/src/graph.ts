import { replayLatest } from '@aelea/core'
import { map, multicast } from '@most/core'
import { Stream } from '@most/types'
import { type Client } from '@urql/core'
import { ADDRESS_ZERO, IntervalTime, StateParams, combineState, getClosestNumber, groupArrayManyMap, periodicRun, unixTimestampNow } from 'common-utils'
import * as GMX from "gmx-middleware-const"
import { GqlType, IPriceCandle, IPriceOracleMap, IPriceTickListMap, IQueryFilter, IQuerySubgraph, ISchema, schema as gmxSchema, parseQueryResults, querySignedPrices, querySubgraph } from "gmx-middleware-utils"
import * as viem from "viem"
import __tempTradeRouteDoc from './__temp_tradeRouteDoc.js'
import { schema } from './schema.js'
import { IAccountSummary, IPosition, ISetRouteType } from './types.js'



type IQueryPosition = {
  selectedTradeRouteList?: ISetRouteType[]
  address?: viem.Address
}

type IQueryTraderPositionOpen = IQueryPosition

export function queryPosition(subgraphClient: Client, queryParams: StateParams<IQueryFilter<IPosition>>) {
  return map(async filter => {
    const list = await querySubgraph(subgraphClient, {
      schema: schema.mirrorPosition,
      filter,
    }, { requestPolicy: 'network-only' })

    return list
  }, combineState(queryParams))
}

export const queryStream = <T extends GqlType<any>>(schema: ISchema<T>) => (subgraphClient: Client, filterParams: StateParams<IQueryFilter<IAccountSummary>>) => {
  return map(async filter => {
    const list = await querySubgraph(subgraphClient, {
      schema,
      filter,
    })

    return list
  }, combineState(filterParams))
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

const candleSchema: ISchema<IPriceCandle> = {
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
          _gte: unixTimestampNow() - params.activityTimeframe
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

export async function queryLatestTokenPriceFeed(subgraphClient: Client, filter: IQueryFilter<IPriceCandle> = { interval: { _eq: IntervalTime.MIN5 } }) {
  const queryFeed = querySubgraph(subgraphClient, {
    orderBy: {
      timestamp: 'desc',
    },
    schema: gmxSchema.priceCandle,
    filter,
  })


  const list = (await queryFeed).sort((a, b) => a.timestamp - b.timestamp)

  return list
}



export type { Client }

