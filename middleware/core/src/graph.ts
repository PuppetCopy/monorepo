import { replayLatest } from '@aelea/core'
import { map, multicast } from '@most/core'
import { Stream } from '@most/types'
import { type Client } from '@urql/core'
import { combineState, getClosestNumber, groupArrayMany, IntervalTime, periodicRun, StateParams, unixTimestampNow } from 'common-utils'
import * as GMX from "gmx-middleware-const"
import { IPriceCandle, IPricefeedMap, IPriceOracleMap, IQueryFilter, ISchema, querySignedPrices, querySubgraph } from "gmx-middleware-utils"
import * as viem from "viem"
import { schema } from './schema.js'
import { IMirrorPosition } from './types'


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



export function queryPosition<TStateParams extends StateParams<IQueryPositionParams>>(
  subgraphClient: Client,
  queryParams: TStateParams
) {
  return map(
    filterParams => {

      const filter: IQueryFilter<IMirrorPosition> = {}

      if (filterParams.account) {
        filter.account = {
          _eq: `"${filterParams.account}"`
        }
      }

      if (filterParams.isLong !== undefined) {
        filter.isLong = {
          _eq: filterParams.isLong
        }
      }


      const orFilters = []

      if (filterParams.collateralTokenList) {
        orFilters.push(
          ...filterParams.collateralTokenList.map(token => ({
            collateralToken: {
              _eq: `"${token}"`
            }
          }))
        )
      }

      if (filterParams.activityTimeframe) {
        const timestampFilter = unixTimestampNow() - filterParams.activityTimeframe

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
        filter._or = orFilters
      }

      return querySubgraph(subgraphClient, {

        schema: schema.mirrorPosition,
        filter: filter,
      })
    },
    combineState(queryParams)
  )
}

export function queryLeaderboardPosition<TStateParams extends StateParams<IQueryPositionParams>>(
  subgraphClient: Client,
  queryParams: TStateParams
) {
  return map(async filterParams => {
    const filter: IQueryFilter<IMirrorPosition> = {}

    if (filterParams.account) {
      filter.account = {
        _eq: `"${filterParams.account}"`
      }
    }

    if (filterParams.isLong !== undefined) {
      filter.isLong = {
        _eq: filterParams.isLong
      }
    }


    const orFilters = []

    if (filterParams.collateralTokenList) {
      orFilters.push(
        ...filterParams.collateralTokenList.map(token => ({
          collateralToken: {
            _eq: `"${token}"`
          }
        }))
      )
    }

    if (filterParams.activityTimeframe) {
      const timestampFilter = unixTimestampNow() - filterParams.activityTimeframe

      // filter.settledTimestamp = {
      //   _gte: timestampFilter
      // }

      filter.openTimestamp = {
        _gte: timestampFilter
      }
    }


    if (orFilters.length) {
      filter._or = orFilters
    }

    // filter.account = {
    //   _eq: '"0xae932cE716b1450D35261672c97c30afa832F3C1"'
    // }

    const list = await querySubgraph(subgraphClient, {
      schema: schema.leaderboardPosition,
      filter
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

