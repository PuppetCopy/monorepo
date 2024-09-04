import { replayLatest } from '@aelea/core'
import { map, multicast } from '@most/core'
import { Stream } from '@most/types'
import { type Client } from '@urql/core'
import { IntervalTime, StateParams, combineState, getClosestNumber, groupArrayMany, groupArrayManyMap, periodicRun, unixTimestampNow } from 'common-utils'
import * as GMX from "gmx-middleware-const"
import { IPriceCandle, IPricefeedMap, IPriceOracleMap, IPriceTickListMap, IQueryFilter, ISchema, isPositionSettled, querySignedPrices, querySubgraph } from "gmx-middleware-utils"
import * as viem from "viem"
import { schema } from './schema.js'
import { ILeaderboardPosition, IMirrorPosition } from './types'


export interface IQueryPositionParams {
  account?: viem.Address
  collateralTokenList?: viem.Address[]
  isLong?: boolean
  activityTimeframe?: IntervalTime
}

export type IQueryRquest<T> = Stream<Promise<{
  list: T[]
  filter: IQueryPositionParams
}>>

export function getPositionFilters(filter: IQueryPositionParams): IQueryFilter<IMirrorPosition> {

  const filters: IQueryFilter<IMirrorPosition> = {}

  if (filter.account) {
    filters.account = {
      _eq: `"${filter.account}"`
    }
  }

  if (filter.isLong !== undefined) {
    filters.isLong = {
      _eq: filter.isLong
    }
  }


  const orFilters = []

  if (filter.collateralTokenList) {
    orFilters.push(
      ...filter.collateralTokenList.map(token => ({
        collateralToken: {
          _eq: `"${token}"`
        }
      }))
    )
  }

  if (filter.activityTimeframe) {
    const timestampFilter = unixTimestampNow() - filter.activityTimeframe

    orFilters.push({
      settledTimestamp: {
        _gte: timestampFilter
      }
    })
    orFilters.push({
      openTimestamp: {
        _gte: timestampFilter
      }
    })
  }


  if (orFilters.length) {
    filters._or = orFilters
  }


  return filters
}

export function queryPosition<TStateParams extends StateParams<IQueryPositionParams>>(
  subgraphClient: Client,
  queryParams: TStateParams
) {
  return map(
    filter => querySubgraph(subgraphClient, {
      schema: schema.mirrorPosition,
      filter: getPositionFilters(filter),
    }),
    combineState(queryParams)
  )
}

export function queryLeaderboardPosition<TStateParams extends StateParams<IQueryPositionParams>>(
  subgraphClient: Client,
  queryParams: TStateParams
) {
  return map(async (filter) => {
    const list = await querySubgraph(subgraphClient, {
      schema: schema.leaderboardPosition,
      filter: getPositionFilters(filter)
    })

    return list
  }, combineState(queryParams))
}



export function queryPricefeed(
  subgraphClient: Client,
  queryParams: StateParams<{
    tokenList?: viem.Address[]
    activityTimeframe: IntervalTime
  }>,
  estTickAmout = 20
) {
  return map(async params => {
    const filter: IQueryFilter<IPriceCandle> = {
      // _or: params.tokenList.map(token => ({
      //   token: {
      //     _eq: `"${token}"`
      //   }
      // })),
      interval: {
        _eq: getClosestNumber(GMX.PRICEFEED_INTERVAL, params.activityTimeframe / estTickAmout)
      },
      timestamp: {
        _gte: unixTimestampNow() - params.activityTimeframe
      },
    }

    if (params?.tokenList?.length) {
      filter._or = params.tokenList.map(token => ({
        token: {
          _eq: `"${token}"`
        }
      }))
    }




    const candleListQuery = querySubgraph(subgraphClient, {
      schema: schema.priceCandle,
      filter,
      orderBy: {
        timestamp: 'desc',
      },
    })


    const mapped: IPricefeedMap = groupArrayMany(await candleListQuery, x => viem.getAddress(x.token))

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


export type { Client }

