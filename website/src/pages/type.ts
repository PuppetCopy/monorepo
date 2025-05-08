import type { Stream } from '@most/types'
import type { IntervalTime } from '@puppet/middleware/const'
import type * as router from 'aelea/router'
import type * as viem from 'viem'
import type { IMatchingRule, IPriceCandle } from '../__generated__/ponder.types'
import type { IDepositEditorChange } from '../components/portfolio/$DepositEditor'
import type { IMatchRuleEditorChange } from '../components/portfolio/$TraderMatchRouteEditor'
import * as walletLink from '../wallet'

export interface IComponentPageParams {}

export interface IPageParams extends IComponentPageParams {
  route: router.Route
}

export interface IUserActivityPageParams extends IPageParams {
  selectedCollateralTokenList: Stream<viem.Address[]>
  activityTimeframe: Stream<IntervalTime>
  depositTokenList: Stream<IDepositEditorChange[]>
  pricefeedMapQuery: Stream<Promise<Record<viem.Address, IPriceCandle[]>>>
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
