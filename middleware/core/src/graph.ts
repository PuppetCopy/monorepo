import { replayLatest } from '@aelea/core'
import { map, multicast } from '@most/core'
import { Stream } from '@most/types'
import { type Client } from '@urql/core'
import { combineState, getClosestNumber, groupArrayMany, IntervalTime, IRequestSortApi, periodicRun, StateParams, unixTimestampNow } from 'common-utils'
import * as GMX from "gmx-middleware-const"
import { IPositionDecrease, IPositionIncrease, IPriceCandle, IPricefeedMap, IPriceOracleMap, IQueryFilter, ISchema, querySignedPrices, querySubgraph } from "gmx-middleware-utils"
import * as viem from "viem"
import { schema } from './schema.js'
import { IAccountLastAggregatedStats, IPosition } from './types'
import { aggregatePositionList } from './utils'


export interface IQueryPositionParams {
  account?: viem.Address
  selectedCollateralTokenList?: viem.Address[]
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
  return map(async filterParams => {
    const filter: IQueryFilter<IPositionIncrease | IPositionDecrease> = {}

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

    if (filterParams.selectedCollateralTokenList) {
      orFilters.push(
        ...filterParams.selectedCollateralTokenList.map(token => ({
          collateralToken: {
            _eq: `"${token}"`
          }
        }))
      )
    }

    if (filterParams.activityTimeframe) {
      const timestampFilter = unixTimestampNow() - filterParams.activityTimeframe
      orFilters.push({
        blockTimestamp: {
          _gte: timestampFilter
        }
      })
    }


    if (orFilters.length) {
      filter._or = orFilters
    }

    const queryIncreaseList = querySubgraph(subgraphClient, {
      schema: schema.positionIncrease,
      filter: filter,
      orderBy: {
        blockTimestamp: 'desc'
      }
    })

    const queryDecreaseList = querySubgraph(subgraphClient, {
      schema: schema.positionDecrease,
      filter: filter,
    })

    return aggregatePositionList([...await queryIncreaseList, ...await queryDecreaseList]).sort((a, b) => b.openTimestamp - a.openTimestamp)
  },
    combineState(queryParams)
  )
}

export interface IQueryLeaderboardParams {
  account?: viem.Address
  activityTimeframe?: IntervalTime
  sortBy: IRequestSortApi
}
export function queryAccountLastAggregatedStats(
  subgraphClient: Client,
  queryParams: StateParams<IQueryLeaderboardParams>
) {
  return map(async filterParams => {
    const filter: IQueryFilter<IAccountLastAggregatedStats> = {}

    if (filterParams.account) {
      filter.account = {
        _eq: `"${filterParams.account}"`
      }
    }


    const orFilters: any[] = []

    // if (filterParams.selectedCollateralTokenList) {
    //   orFilters.push(
    //     ...filterParams.selectedCollateralTokenList.map(token => ({
    //       collateralToken: {
    //         _eq: `"${token}"`
    //       }
    //     }))
    //   )
    // }

    if (filterParams.activityTimeframe) {
      const timestampFilter = unixTimestampNow() - filterParams.activityTimeframe

      // filter.settledTimestamp = {
      //   _gte: timestampFilter
      // }
      filter.interval = {
        _eq: filterParams.activityTimeframe
      }

      filter.blockTimestamp = {
        _gte: timestampFilter
      }
    }


    if (orFilters.length) {
      filter._or = orFilters
    }

    // filter.account = {
    //   _eq: '"0x66925739dE62F4411aA31f49b20C5Bd46565C342"'
    // }


    const list = await querySubgraph(subgraphClient, {
      schema: schema.accountLastAggregatedStats,
      filter,
      orderBy: {
        [filterParams.sortBy.selector]: filterParams.sortBy.direction,
      },
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
      slotTime: {
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
        slotTime: 'desc',
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

