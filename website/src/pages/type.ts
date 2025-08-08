import type { IntervalTime } from '@puppet-copy/middleware/const'
import type { IPositionDecrease, IPositionIncrease, ITraderRouteLatestMetric } from '@puppet-copy/sql/schema'
import type * as router from 'aelea/router'
import type { IStream } from 'aelea/stream'
import type { Address, Hex } from 'viem'

export interface IComponentPageParams {}

export interface IPageParams extends IComponentPageParams {
  route: router.Route
}

export interface IPageFilterParams {
  activityTimeframe: IStream<IntervalTime>
  collateralTokenList: IStream<Address[]>
}

export interface IEarningsPlan {
  compoundMode: boolean
  compoundLockRewards: boolean
  compoundVestedRewards: boolean
  // claimLockRewards: boolean
  // claimVestedRewards: boolean
  scheduleFactor: number
}

export enum ITradeFocusMode {
  collateral,
  size
}

export enum IWalletTab {
  TRADER = 'Trader',
  PUPPET = 'Puppet',
  EARN = 'Earn'
}

export type IPosition = {
  key: Hex
  account: Hex
  market: Hex
  collateralToken: Hex
  indexToken: Hex

  sizeInUsd: bigint
  sizeInTokens: bigint
  collateralInTokens: bigint
  collateralInUsd: bigint
  realisedPnlUsd: bigint

  maxSizeInUsd: bigint
  maxSizeInTokens: bigint
  maxCollateralInTokens: bigint
  maxCollateralInUsd: bigint

  avgEntryPrice: bigint

  isLong: boolean

  lastUpdateTimestamp: number
  settledTimestamp: number

  puppetList: Address[]
  increaseList: IPositionIncrease[]
  decreaseList: IPositionDecrease[]

  collateralList: IPositionDecrease[]

  lastUpdate: IPositionIncrease | IPositionDecrease
}

export type IRoute = {
  account: string
}

export interface ITraderRouteMetricSummary
  extends Omit<
    ITraderRouteLatestMetric,
    | 'collateralToken'
    | 'traderMatchingKey'
    | 'id'
    | 'pnlList'
    | 'pnlTimestampList'
    | 'traderRouteMetric'
    | 'lastUpdatedTimestamp'
    | 'interval'
  > {
  winCount: number
  lossCount: number
  pnlTimeline: { time: number; value: bigint; traderMatchingKey: Hex }[]
  marketList: Address[]
}
