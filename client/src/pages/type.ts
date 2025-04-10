import * as router from '@aelea/router'
import { Stream } from '@most/types'
import { IPricefeedMap } from 'gmx-middleware'
import * as viem from 'viem'
import * as walletLink from "wallet"
import { IDepositEditorChange } from '../components/portfolio/$DepositEditor'
import { IMatchRuleEditorChange } from '../components/portfolio/$MatchRuleEditor'
import { IntervalTime } from 'puppet-const'
import { type Event } from "ponder:registry";
import { type priceCandle } from "../ponder.schema";


export interface IWalletPageParams {
  walletClientQuery: Stream<Promise<walletLink.IWalletClient | null>>
}

export interface IComponentPageParams extends IWalletPageParams {
  providerClientQuery: Stream<Promise<walletLink.IPublicProvider>>
}

export interface IPageParams extends IComponentPageParams {
  route: router.Route
}


export interface IUserActivityPageParams extends IPageParams {
  selectedCollateralTokenList: Stream<viem.Address[]>
  activityTimeframe: Stream<IntervalTime>
  pricefeedMapQuery: Stream<Promise<typeof priceCandle.$inferSelect[]>>
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

