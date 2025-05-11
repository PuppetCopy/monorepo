import type { Stream } from '@most/types'
import type { IntervalTime } from '@puppet/middleware/const'
import type * as router from 'aelea/router'
import type * as viem from 'viem'
import type { IDepositEditorChange } from '../components/portfolio/$DepositEditor'
import type { IMatchingRule } from '../ponder.types'

export interface IComponentPageParams {}

export interface IPageParams extends IComponentPageParams {
  route: router.Route
}

export interface IPageFilterParams extends IPageParams {
  activityTimeframe: Stream<IntervalTime>
  collateralTokenList: Stream<viem.Address[]>
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
