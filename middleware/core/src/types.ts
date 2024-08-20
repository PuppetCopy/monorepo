import { ILogTxType, ILogTypeId, IPositionOpen, IPositionAbstract, IPositionListSummary } from "gmx-middleware-utils"
import * as viem from "viem"



export interface IMirrorRequest {
  puppets: readonly viem.Address[]
  trader: viem.Address
  subaccount: viem.Address
  positionKey: viem.Hex
  isIncrease: boolean;
  requestKey: viem.Hex
}


// export interface MirrorReduceSize extends ILogTxType<'MirrorReduceSize'> {
//   id: string
//   sizeDelta: bigint
// }



// export interface IMirrorLink extends ILogTxType<'MirrorLink'> {
//   id: string
//   reduceSizeList: MirrorReduceSize[]
// }



// export interface IMirrorAbstract extends ILogTxType<'Mirror'> {
//   key: viem.Hex
//   account: viem.Address

//   trader: viem.Address
//   subaccount: viem.Address
//   positionKey: viem.Hex

//   cumulativeTransactionCost: bigint
//   amountOut: bigint
//   profit: bigint
//   totalPerformanceFee: bigint
//   traderPerformanceCutoffFee: bigint

//   requestList: IMirrorRequest[]
//   puppetPositionList: IPuppetPosition[]

//   position: IPositionAbstract
// }

export interface IPuppetPosition extends ILogTxType<'PuppetPosition'> {
  account: viem.Address

  trader: viem.Address
  collateralToken: viem.Address

  subaccount: viem.Address
  positionKey: viem.Hex

  collateral: bigint

  position: IPositionAbstract
  // mirror: IMirror
}


// export interface IMirrorSeed extends IMirrorAbstract { }
export interface IMirror extends IPositionAbstract {
  puppetPositionList: IPuppetPosition[]
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

