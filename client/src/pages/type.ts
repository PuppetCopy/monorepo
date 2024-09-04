import * as router from '@aelea/router'
import { Stream } from '@most/types'
import { IntervalTime } from 'common-utils'
import { IPricefeedMap } from 'gmx-middleware-utils'
import { IMirrorPosition } from 'puppet-middleware-utils'
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
  collateralTokenList: Stream<viem.Address[]>
  activityTimeframe: Stream<IntervalTime>
  pricefeedMapQuery: Stream<Promise<IPricefeedMap>>
}

export interface IUserActivityPageParams extends IPageParams, IUserActivityParams {
}

export interface IPositionActivityParams {
  positionListQuery: Stream<Promise<IMirrorPosition[]>>
}

export interface IUserPositionPageParams extends IPageParams, IPositionActivityParams, IUserActivityParams { }



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
