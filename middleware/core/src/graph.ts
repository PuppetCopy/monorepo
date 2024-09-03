import { replayLatest } from '@aelea/core'
import { map, multicast } from '@most/core'
import { Stream } from '@most/types'
import { type Client } from '@urql/core'
import { IntervalTime, StateParams, combineState, getClosestNumber, groupArrayManyMap, periodicRun, unixTimestampNow } from 'common-utils'
import * as GMX from "gmx-middleware-const"
import { IPriceOracleMap, IPriceTickListMap, ISchema, isPositionSettled, querySignedPrices, querySubgraph } from "gmx-middleware-utils"
import * as viem from "viem"
import __tempTradeRouteDoc from './__temp_tradeRouteDoc.js'
import { schema } from './schema.js'


export interface IQueryPositionParams {
  account?: viem.Address
  collateralTokenList?: viem.Address[]
  isLong?: boolean
  activityTimeframe?: IntervalTime
}

export function queryPosition<TStateParams extends StateParams<IQueryPositionParams>>(
  subgraphClient: Client,
  queryParams: TStateParams
) {
  return map(async filter => {
    const response = await querySubgraph(subgraphClient, {
      schema: schema.mirrorPosition,
      filter: {
        isLong: { _eq: filter.isLong },
        account: {
          _eq: filter.account ? `"${filter.account}"` : undefined
        },
        _or: filter.collateralTokenList?.map(token => ({
          collateralToken: {
            _eq: `"${token}"`
          }
        })),
      },
    })

    const activityTimeframe = filter.activityTimeframe
    const list = activityTimeframe ? response.filter(x => isPositionSettled(x) ? x.increaseList[0].blockTimestamp > unixTimestampNow() - activityTimeframe : true) : response

    return { list, filter }
  }, combineState(queryParams))
}



export function queryLatestPriceTick(
  subgraphClient: Client,
  queryParams: StateParams<{
    collateralTokenList: viem.Address[]
    activityTimeframe: IntervalTime
  }>,
  estTickAmout = 20
) {
  return map(async params => {
    const candleListQuery = querySubgraph(subgraphClient, {
      schema: schema.priceCandle,
      filter: {
        _or: params.collateralTokenList.map(token => ({
          token: {
            _eq: `"${token}"`
          }
        })),
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

    const candleList = [
      ...await candleListQuery,
      // ...Object.values(await querySignedPrices()).map(x => ({ timestamp: Number(x.timestamp), c: x.max, token: x.token }))
    ]
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

