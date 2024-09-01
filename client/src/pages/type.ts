import * as router from '@aelea/router'
import { Stream } from '@most/types'
import { IntervalTime } from 'common-utils'
import { IPriceTickListMap } from 'gmx-middleware-utils'
import { IMirror, ISetRouteType } from 'puppet-middleware-utils'
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

export interface IUserActivityPageParams extends IPageParams, IUserActivityParams {
}

export interface IUserPositionPageParams extends IPageParams, IPositionActivityParams, IUserActivityParams { }


export interface IUserActivityParams {
  selectedTradeRouteList: Stream<ISetRouteType[]>
  activityTimeframe: Stream<IntervalTime>
  priceTickMapQuery: Stream<Promise<IPriceTickListMap>>
}

export interface IPositionActivityParams {
  settledPositionListQuery: Stream<Promise<IMirror[]>>
  openPositionListQuery: Stream<Promise<IMirror[]>>
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

export enum VestingLockMode {
  NONE = 'None',
  CONTINUOUS = 'Auto Lock',
  SHORT_TERM = 'Short Term',
}

export enum SelectedOption {
  LOCK = 'Lock',
  EXIT = 'Exit',
}
