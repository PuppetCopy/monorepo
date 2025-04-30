import * as router from '@aelea/router'
import { Stream } from '@most/types'
import { IntervalTime } from '@puppet/middleware/const'
import { IPriceCandle } from "schema"
import * as viem from 'viem'
import * as walletLink from "@puppet/middleware/wallet"
import { IDepositEditorChange } from '../components/portfolio/$DepositEditor'
import { IMatchRuleEditorChange } from '../components/portfolio/$TraderMatchRouteEditor'


export interface IWalletPageParams {
}

export interface IComponentPageParams extends IWalletPageParams {
}

export interface IPageParams extends IComponentPageParams {
  route: router.Route
}


export interface IUserActivityPageParams extends IPageParams {
  selectedCollateralTokenList: Stream<viem.Address[]>
  activityTimeframe: Stream<IntervalTime>
  pricefeedMapQuery: Stream<Promise<Record<viem.Address, IPriceCandle[]>>>
  depositTokenList: Stream<IDepositEditorChange[]>
  matchRuleList: Stream<IMatchRuleEditorChange[]>
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
  size,
}


export enum IWalletTab {
  TRADER = 'Trader',
  PUPPET = 'Puppet',
  EARN = "Earn"
}

