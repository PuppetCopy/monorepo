import type { IGmxPositionDecrease, IGmxPositionIncrease } from '@puppet/database/schema'
import type { IntervalTime } from '@puppet/sdk/const'
import type * as router from 'aelea/router'
import type { IStream } from 'aelea/stream'
import type { Address, Hex } from 'viem'
import type { ValueOf } from '../utils/types.js'

export interface IComponentPageParams {}

export interface IPageParams extends IComponentPageParams {
  route: router.Route
}

export interface IPageFilterParams {
  activityTimeframe: IStream<IntervalTime>
  collateralTokenList: IStream<Address[]>
  indexTokenList: IStream<Address[]>
}

export interface IEarningsPlan {
  compoundMode: boolean
  compoundLockRewards: boolean
  compoundVestedRewards: boolean
  // claimLockRewards: boolean
  // claimVestedRewards: boolean
  scheduleFactor: number
}

export const TRADE_FOCUS_MODE = {
  COLLATERAL: 'collateral',
  SIZE: 'size'
} as const
export type ITradeFocusMode = ValueOf<typeof TRADE_FOCUS_MODE>

export const WALLET_TAB = {
  TRADER: 'Master',
  PUPPET: 'Puppet',
  EARN: 'Earn'
} as const
export type IWalletTab = ValueOf<typeof WALLET_TAB>

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
  increaseList: IGmxPositionIncrease[]
  decreaseList: IGmxPositionDecrease[]

  collateralList: IGmxPositionDecrease[]

  lastUpdate: IGmxPositionIncrease | IGmxPositionDecrease
}

export type IRoute = {
  account: string
}

export interface IMasterMetricSummary {
  account: Address
  realisedPnl: bigint
  allocatedVolume: bigint
  winCount: number
  lossCount: number
  pnlTimeline: { time: number; value: bigint; master: Hex }[]
  matchedPuppetList: Address[]
}
