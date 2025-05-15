import type { Stream } from '@most/types'
import type { IntervalTime } from '@puppet/middleware/const'
import type * as router from 'aelea/router'
import type { Address, Hex } from 'viem'
import type {
  IMatchingRule,
  IPositionDecrease,
  IPositionFeesCollected,
  IPositionIncrease,
  ITraderRouteLatestMetric,
  ITraderRouteMetric
} from '../__generated__/ponder.types'
import type { IDepositEditorChange } from '../components/portfolio/$DepositEditor'

export interface IComponentPageParams {}

export interface IPageParams extends IComponentPageParams {
  route: router.Route
}

export interface IPageFilterParams {
  activityTimeframe: Stream<IntervalTime>
  collateralTokenList: Stream<Address[]>
}

export interface IUserActivityPageParams {
  depositTokenList: Stream<IDepositEditorChange[]>
  matchingRuleQuery: Stream<Promise<IMatchingRule[]>>
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
    ITraderRouteLatestMetric & Pick<ITraderRouteMetric, 'marketList'>,
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
