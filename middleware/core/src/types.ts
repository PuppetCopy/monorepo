import { ILogTxType, ILogTypeId, IPositionAbstract, IPositionListSummary } from "gmx-middleware-utils"
import * as viem from "viem"



export interface IMirrorRequest {
  puppets: readonly viem.Address[]
  trader: viem.Address
  subaccount: viem.Address
  positionKey: viem.Hex
  isIncrease: boolean;
  requestKey: viem.Hex
}


export interface MirrorReduceSize extends ILogTxType<'MirrorReduceSize'> {
  id: string
  sizeDelta: bigint
}



export interface IMirrorLink extends ILogTxType<'MirrorLink'> {
  id: string
  reduceSizeList: MirrorReduceSize[]
}

export interface IMirrorMatch extends ILogTxType<'Mirror'> {
  link: IMirrorLink

  trader: viem.Address

  puppetList: viem.Address[]
  collateralList: bigint[]
  cumulativeTransactionCost: bigint

  routeTypeKey: viem.Hex
}


export interface IMirrorAbstract<TypeName extends 'PositionOpen' | 'PositionSettled' = 'PositionOpen' | 'PositionSettled'> extends IPositionAbstract<TypeName> {
  mirror: IMirrorMatch
}

export interface IMirrorSeed extends IMirrorAbstract<'PositionOpen'> { }
export interface IMirror extends IMirrorAbstract<'PositionSettled'> { }


export interface ISubscribeTradeRoute extends ILogTxType<'SubscribeTradeRoute'> {
  allowance: bigint
  subscriptionExpiry: bigint
  trader: viem.Address
  puppet: viem.Address
  tradeRoute: viem.Address
  routeTypeKey: viem.Hex
}

export interface IPuppetPositionOpen extends ILogTxType<'PuppetPositionOpen'> {
  position: IMirrorSeed
  puppetTradeRoute: IPuppetTradeRoute
}

export interface IPuppetPositionSettled extends ILogTxType<'PuppetPositionSettled'> {
  position: IMirror
  puppetTradeRoute: IPuppetTradeRoute
}

export interface IPuppetTradeRoute extends ILogTypeId<'PuppetTradeRoute'> {
  routeTypeKey: viem.Hex
  puppet: viem.Address
  trader: viem.Address
  tradeRoute: viem.Address

  openList: IPuppetPositionOpen[]
  settledList: IPuppetPositionSettled[]
  subscribeList: ISubscribeTradeRoute[]
}

export interface IMirrorListSummary extends IPositionListSummary {
  puppets: viem.Address[]
}

export interface ISetRouteType extends ILogTypeId<'SetRouteType'> {
  routeTypeKey: viem.Hex
  collateralToken: viem.Address
  indexToken: viem.Address
  isLong: boolean
  // data: viem.Hex
}


export interface IAccountSummary extends ILogTypeId<'AccountSummary'> {
  account: viem.Address
  interval: bigint
  timestamp: bigint

  puppets: bigint

  cumulativeSizeUsd: bigint
  cumulativeCollateralUsd: bigint

  maxSizeUsd: bigint
  maxCollateralUsd: bigint

  pnl: bigint
  roi: bigint

  winCount: bigint
  lossCount: bigint
  successRate: bigint
}


export type IPuppetSubscritpionParams = {
  allowance: bigint
  subscriptionExpiry: bigint
  routeTypeKey: viem.Hex
  trader: viem.Address
}


export type IAccountToRouteMap<T> = Record<viem.Address, Record<viem.Hex, T>>


