import { ILogTxType, ILogTypeId, IPositionListSummary, IPosition as IGmxPosition } from "gmx-middleware-utils"
import * as viem from "viem"


export interface IMirrorRequest {
  puppets: readonly viem.Address[]
  trader: viem.Address
  subaccount: viem.Address
  positionKey: viem.Hex
  isIncrease: boolean;
  requestKey: viem.Hex
}

export interface IPuppetPosition extends ILogTxType<'PuppetPosition'> {
  key: viem.Hex
  positionKey: viem.Hex

  account: viem.Address
  market: viem.Address
  collateralToken: viem.Address

  collateral: bigint

  position: IPosition
}

export interface IMirror extends ILogTypeId<'MirrorPosition'> {
  key: viem.Hex
  positionKey: viem.Hex

  trader: viem.Address

  cumulativeTransactionCost: bigint
  amountOut: bigint
  profit: bigint
  totalPerformanceFee: bigint
  traderPerformanceCutoffFee: bigint

  puppetList: IPuppetPosition[]
}

export interface IMirrorPosition extends IGmxPosition {
  mirror: IMirror
}


export type IPosition = IMirrorPosition | IGmxPosition



export interface IMirrorListSummary extends IPositionListSummary {
  account: viem.Address
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

