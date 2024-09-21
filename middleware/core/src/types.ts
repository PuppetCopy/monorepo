import { ILogTxType, ILogTypeId, IPositionDecrease, IPositionIncrease } from "gmx-middleware-utils"
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

export interface IPosition {
  key: viem.Hex
  account: viem.Address
  market: viem.Address
  collateralToken: viem.Address

  sizeInUsd: bigint
  sizeInTokens: bigint
  collateralInTokens: bigint
  collateralInUsd: bigint
  realisedPnlUsd: bigint

  cumulativeSizeToken: bigint
  cumulativeSizeUsd: bigint
  cumulativeCollateralToken: bigint
  cumulativeCollateralUsd: bigint

  maxSizeInUsd: bigint
  maxSizeInTokens: bigint
  maxCollateralInUsd: bigint
  maxCollateralInTokens: bigint

  avgEntryPrice: bigint

  isLong: boolean

  increaseList: IPositionIncrease[]
  decreaseList: IPositionDecrease[]

  openTimestamp: number
  settledTimestamp: number

  puppetList: IPuppetPosition[]
  collateralList: bigint[]

  lastUpdate: IPositionIncrease | IPositionDecrease
}


export interface ITraderAccount extends ILogTypeId<'AccountLastAggregatedStats'> {
  id: viem.Address

  gbcId: number
  puppets: number

  increaseList: IPositionIncrease[]
  decreaseList: IPositionDecrease[]
  stats: IAccountLastAggregatedStats[]
}

export interface IAccountLastAggregatedStats extends ILogTypeId<'AccountLastAggregatedStats'> {
  account: viem.Address
  cumulativeSizeUsd: bigint
  cumulativeCollateralUsd: bigint
  maxSizeInUsd: bigint
  maxCollateralInUsd: bigint
  openPnl: bigint
  realisedPnl: bigint
  pnl: bigint
  roi: bigint

  interval: number
  blockTimestamp: number

  trader: ITraderAccount
}





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






