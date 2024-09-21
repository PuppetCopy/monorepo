import * as router from '@aelea/router'
import { Stream } from '@most/types'
import { IntervalTime } from 'common-utils'
import { IPricefeedMap } from 'gmx-middleware-utils'
import { IPosition } from 'puppet-middleware-utils'
import * as viem from 'viem'
import * as walletLink from "wallet"


export interface IWalletPageParams {
  walletClientQuery: Stream<Promise<walletLink.IWalletClient | null>>
}

export interface IComponentPageParams extends IWalletPageParams {
  providerClientQuery: Stream<Promise<walletLink.IPublicProvider>>
}

export interface IPageParams extends IComponentPageParams {
  route: router.Route
}

export interface IUserActivityParams {
  selectedCollateralTokenList: Stream<viem.Address[]>
  activityTimeframe: Stream<IntervalTime>
  pricefeedMapQuery: Stream<Promise<IPricefeedMap>>
}

export interface IUserActivityPageParams extends IPageParams, IUserActivityParams {
}

export interface IPositionActivityParams {
  positionListQuery: Stream<Promise<IPosition[]>>
}

export interface IUserPositionPageParams extends IPageParams, IPositionActivityParams, IUserActivityParams { }



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

