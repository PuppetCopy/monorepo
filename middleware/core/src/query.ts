import { replayLatest } from '@aelea/core'
import { map, multicast } from '@most/core'
import { Stream } from '@most/types'
import { type Client } from '@urql/core'
import { combineState, getClosestNumber, graph, groupArrayMany, IRequestSortApi, periodicRun, StateParams, unixTimestampNow } from 'common-utils'
import { IPriceCandle, IPricefeedMap, IPriceOracleMap, querySignedPrices } from 'gmx-middleware'
import * as viem from "viem"
import { IMatchRoute, IMatchRouteStats, IPositionDecrease, IPositionIncrease } from './types.js'
import { aggregatePositionList } from './utils.js'
import { IntervalTime, PRICEFEED_INTERVAL } from 'puppet-const'
import { schema } from './schema'


export interface IQueryPositionParams {
  account?: viem.Address
  selectedCollateralTokenList?: viem.Address[]
  isLong?: boolean
  activityTimeframe?: IntervalTime
}

export interface IQueryMatchRouteParams {
  account?: viem.Address
  selectedCollateralTokenList?: viem.Address[]
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
    const filter: graph.IQueryFilter<IPositionIncrease | IPositionDecrease> = {}

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


    const queryIncreaseList = graph.querySubgraph(subgraphClient, {
      schema: schema.positionIncrease,
      filter: filter,
      sortBy: {
        blockTimestamp: 'desc'
      }
    })

    const queryDecreaseList = graph.querySubgraph(subgraphClient, {
      schema: schema.positionDecrease,
      filter: filter,
    })

    return aggregatePositionList([...await queryIncreaseList, ...await queryDecreaseList]).sort((a, b) => b.openTimestamp - a.openTimestamp)
  },
    combineState(queryParams)
  )
}

export function queryMatchRoute<TStateParams extends StateParams<IQueryMatchRouteParams>>(
  subgraphClient: Client,
  queryParams: TStateParams
) {
  return map(async filterParams => {
    const filter: graph.IQueryFilter<IPositionIncrease | IPositionDecrease> = {}

    if (filterParams.account) {
      filter.account = {
        _eq: `"${filterParams.account}"`
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

    const queryIncreaseList = graph.querySubgraph(subgraphClient, {
      schema: schema.positionIncrease,
      filter: filter,
      sortBy: {
        blockTimestamp: 'desc'
      }
    })

    const queryDecreaseList = graph.querySubgraph(subgraphClient, {
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
  sortBy?: IRequestSortApi
  collateralTokenList?: viem.Address[]
}
export function queryMatchRouteStats(
  subgraphClient: Client,
  queryParams: StateParams<IQueryLeaderboardParams>
) {
  return map(async filterParams => {
    const filter: graph.IQueryFilter<IMatchRouteStats> = {}

    if (filterParams.account) {
      filter.account = {
        _eq: `"${filterParams.account}"`
      }
    }


    const orFilters: any[] = []

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
      filter.interval = {
        _eq: filterParams.activityTimeframe
      }

      filter.blockTimestamp = {
        _gte: timestampFilter
      }

      filter.matchRoute = {
        increaseList: { blockTimestamp: { _gte: timestampFilter } },
        decreaseList: { blockTimestamp: { _gte: timestampFilter } }
      } as any
    }


    if (orFilters.length) {
      filter._or = orFilters
    }

    const sortBy = filterParams.sortBy
      ? { [filterParams.sortBy.selector]: filterParams.sortBy.direction, }
      : undefined
    // filter.account_id = {
    //   _eq: '"0x1B4E44f70D1D023784210a9c2F8b84eBD613c29C"'
    // }


    const list = await graph.querySubgraph(subgraphClient, {
      schema: schema.routeMatchStats,
      limit: 20,
      filter,
      sortBy,
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
    const filter: graph.IQueryFilter<IPriceCandle> = {

      interval: {
        _eq: getClosestNumber(PRICEFEED_INTERVAL, params.activityTimeframe / estTickAmout)
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


    const candleListQuery = graph.querySubgraph(subgraphClient, {
      schema: schema.priceCandle,
      filter,
      sortBy: {
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

const chainMetadataSchema: graph.ISchema<ISubgraphStatus> = {
  first_event_block_number: 'bigint',
  latest_processed_block: 'bigint',
  num_events_processed: 'bigint',
  timestamp_caught_up_to_head_or_endblock: 'string',
  __typename: 'chain_metadata',
}

export const getSubgraphStatus = async (subgraphClient: Client): Promise<ISubgraphStatus> => {
  const query = await graph.querySubgraph(subgraphClient, {
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

