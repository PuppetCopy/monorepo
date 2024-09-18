import { IPosition as IGmxPosition, ILogTxType, ILogType, ILogTypeId } from "gmx-middleware-utils"
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

export interface IMirrorPosition extends ILogTypeId<'MirrorPosition'>, Omit<IGmxPosition, '__typename'> {
  position: IGmxPosition

  puppetList: IPuppetPosition[]
  collateralList: bigint[]
}

export interface ILeaderboardPosition extends ILogType<'Position'> {
  account: viem.Address
  market: viem.Address

  realisedPnlUsd: bigint
  maxSizeInUsd: bigint
  maxSizeInTokens: bigint
  maxCollateralInUsd: bigint

  sizeInTokens: bigint
  sizeInUsd: bigint
  isLong: boolean

  // settledTimestamp: number
  openTimestamp: number
}


export type IPosition = IMirrorPosition | IGmxPosition



export interface IMirrorListSummary {
  puppets: viem.Address[]
  size: bigint
  collateral: bigint
  fee: bigint
  pnl: bigint
  cumulativeLeverage: bigint
  avgSize: bigint
  avgCollateral: bigint

  winCount: number
  lossCount: number
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

  indexTokenList: viem.Address[]
  puppets: viem.Address[]
  positionList: ILeaderboardPosition[]
}




