import { ILogTxType, ILogTypeId, IPositionListSummary, IPosition as IGmxPosition, ILogType } from "gmx-middleware-utils"
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

export interface ILeaderboardPosition extends ILogType<'Position'> {
  account: viem.Address
  realisedPnlUsd: bigint
  maxSizeInUsd: bigint
  maxSizeInTokens: bigint
  maxCollateralInUsd: bigint

  market: viem.Address
  sizeInTokens: bigint
  sizeInUsd: bigint
  isLong: boolean

  // settledTimestamp: number
  openTimestamp: number
}


export type IPosition = IMirrorPosition | IGmxPosition



export interface IMirrorListSummary extends IPositionListSummary {
  puppets: viem.Address[]
}

export interface ILeaderboardSummary {
  account: viem.Address
  cumulativeSize: bigint
  cumulativeCollateral: bigint
  maxSize: bigint
  maxCollateral: bigint
  leverage: bigint
  lossCount: number
  winCount: number
  pnl: bigint

  puppets: viem.Address[]
  positionList: ILeaderboardPosition[]
}

export interface ISetRouteType extends ILogTypeId<'SetRouteType'> {
  routeTypeKey: viem.Hex
  collateralToken: viem.Address
  indexToken: viem.Address
  isLong: boolean
  // data: viem.Hex
}


