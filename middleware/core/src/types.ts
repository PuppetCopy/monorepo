import { ILogTxType, ILogTypeId } from "gmx-middleware-utils"
import * as viem from "viem"


export interface IPositionFeesCollected extends ILogTxType<'PositionFeesCollected'> {
  affiliate: viem.Address
  positionKey: viem.Address

  totalRebateFactor: bigint
  traderDiscountFactor: bigint
  totalRebateAmount: bigint
  traderDiscountAmount: bigint
  affiliateRewardAmount: bigint
  fundingFeeAmount: bigint
  claimableLongTokenAmount: bigint
  claimableShortTokenAmount: bigint
  latestFundingFeeAmountPerSize: bigint
  latestLongTokenClaimableFundingAmountPerSize: bigint
  latestShortTokenClaimableFundingAmountPerSize: bigint
  borrowingFeeUsd: bigint
  borrowingFeeAmount: bigint
  borrowingFeeReceiverFactor: bigint
  borrowingFeeAmountForFeeReceiver: bigint
  positionFeeFactor: bigint
  protocolFeeAmount: bigint
  positionFeeReceiverFactor: bigint
  feeReceiverAmount: bigint
  feeAmountForPool: bigint
  positionFeeAmountForPool: bigint
  positionFeeAmount: bigint
  totalCostAmount: bigint
  uiFeeReceiverFactor: bigint
  uiFeeAmount: bigint
}


export interface IOrderCreated extends ILogTypeId<'OrderCreated'> {
  key: viem.Hex

  account: viem.Address
  receiver: viem.Address
  callbackContract: viem.Address
  uiFeeReceiver: viem.Address
  market: viem.Address
  initialCollateralToken: viem.Address

  swapPath: viem.Address[]

  orderType: bigint
  decreasePositionSwapType: bigint
  sizeDeltaUsd: bigint
  initialCollateralDeltaAmount: bigint
  triggerPrice: bigint
  acceptablePrice: bigint
  executionFee: bigint
  callbackGasLimit: bigint
  minOutputAmount: bigint
  updatedAtBlock: bigint

  isLong: boolean
  shouldUnwrapNativeToken: boolean
  isFrozen: boolean
}

export interface IOrderStatus extends ILogTxType<'OrderStatus'> {
  order: IOrderCreated
  orderType: bigint
  statusType: bigint
  message: string
}

export interface IPositionIncrease extends ILogTxType<'PositionIncrease'> {
  order: IOrderStatus
  positionKey: viem.Hex
  account: viem.Address

  market: viem.Address
  collateralToken: viem.Address

  sizeInUsd: bigint
  sizeInTokens: bigint
  collateralAmount: bigint
  borrowingFactor: bigint
  fundingFeeAmountPerSize: bigint
  longTokenClaimableFundingAmountPerSize: bigint
  shortTokenClaimableFundingAmountPerSize: bigint

  executionPrice: bigint
  indexTokenPriceMax: bigint
  indexTokenPriceMin: bigint
  collateralTokenPriceMax: bigint
  collateralTokenPriceMin: bigint
  sizeDeltaUsd: bigint
  sizeDeltaInTokens: bigint
  orderType: bigint

  collateralDeltaAmount: bigint
  priceImpactUsd: bigint
  priceImpactAmount: bigint

  isLong: boolean

  feeCollected: IPositionFeesCollected
}

export interface IPositionDecrease extends ILogTxType<'PositionDecrease'> {
  collateralToken: viem.Address
  market: viem.Address
  account: viem.Address

  order: IOrderStatus
  positionKey: viem.Hex

  sizeInUsd: bigint
  sizeInTokens: bigint
  collateralAmount: bigint
  borrowingFactor: bigint
  fundingFeeAmountPerSize: bigint
  longTokenClaimableFundingAmountPerSize: bigint
  shortTokenClaimableFundingAmountPerSize: bigint

  executionPrice: bigint
  indexTokenPriceMax: bigint
  indexTokenPriceMin: bigint
  collateralTokenPriceMax: bigint
  collateralTokenPriceMin: bigint
  sizeDeltaUsd: bigint
  sizeDeltaInTokens: bigint
  collateralDeltaAmount: bigint
  valuesPriceImpactDiffUsd: bigint
  orderType: bigint

  priceImpactUsd: bigint
  basePnlUsd: bigint
  uncappedBasePnlUsd: bigint

  isLong: boolean

  feeCollected: IPositionFeesCollected
}


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

export interface IGbcToken extends ILogTypeId<'GbcToken'> {
  id: viem.Address
  profile: IProfile
}

export interface IProfile extends ILogTypeId<'Profile'> {
  id: viem.Address
  gbcTokenList: number[]
}

// type DepositBalance {
//   id: Bytes!
//   token: Bytes!
//   value: BigInt!

//   account: PuppetAccount!
// }

export interface IDepositBalance extends ILogTypeId<'DepositBalance'> {
  id: viem.Address
  token: viem.Address
  value: bigint

  account: viem.Address
}

export interface IAllocate extends ILogTypeId<'Allocate'> {
  id: viem.Address
  puppet: viem.Address
}

export interface IAccountBalance extends ILogTypeId<'AccountBalance'> {
  id: viem.Address
  account: viem.Address
  token: viem.Address
  value: bigint
}

export interface IAllocation extends ILogTypeId<'Allocation'> {
  id: viem.Address
  collateralToken: viem.Address
  matchKey: viem.Address
  originRequestKey: viem.Address

  amount: bigint

  puppet: viem.Address
  allocate: IAllocate
  matchRoute: IMatchRoute
}



export interface IMatchRule extends ILogTypeId<'MatchRule'> {
  id: viem.Address
  puppet: viem.Address
  matchKey: viem.Address

  allowanceRate: bigint
  throttleActivity: bigint
  expiry: bigint

  routeMatch: IMatchRoute
}
// matchRuleList: [MatchRule!]! @derivedFrom(field: "matchRoute")
// allocationList: [Allocation!]! @derivedFrom(field: "matchRoute")
// settlementList: [Settlement!]! @derivedFrom(field: "matchRoute")

export interface IMatchRoute extends ILogTypeId<'MatchRoute'> {
  id: viem.Address
  profile: IProfile
  collateralToken: viem.Address

  increaseList: IPositionIncrease[]
  decreaseList: IPositionDecrease[]

  mirrorIncreaseList: IMirrorRequest[]
  mirrorDecreaseList: IMirrorRequest[]

  matchRuleList: IMatchRule[]
  allocationList: IAllocation[]
  settlementList: ISettlement[]

  activity: IMatchRouteStats[]
}


export interface ISettlement extends ILogTypeId<'Settlement'> {
  id: viem.Address
  collateralToken: viem.Address
  matchKey: viem.Address

  contribution: bigint
  amount: bigint

  puppet: viem.Address
  allocate: IAllocate
}

export interface ISettle extends ILogTypeId<'Settle'> {
  id: viem.Address
  collateralToken: viem.Address
  matchKey: viem.Address

  allocated: bigint
  settled: bigint
  puppetContribution: bigint
  traderPerformanceContribution: bigint
  transactionCost: bigint
  profit: bigint

  puppet: viem.Address
  allocate: IAllocate

  blockNumber: number
  blockTimestamp: number
  transactionHash: viem.Address
}


export type IPerformanceTimelineTick = {
  value: number;
  openPnl: bigint;
  realisedPnl: bigint;
  pnl: bigint;
  time: number;
}

export interface IMatchRouteStats extends ILogTypeId<'MatchRouteStats'> {
  account: viem.Address

  cumulativeCollateralToken: bigint
  cumulativeCollateralUsd: bigint
  cumulativeSizeToken: bigint
  cumulativeSizeUsd: bigint

  maxSizeInTokens: bigint
  maxSizeInUsd: bigint
  maxCollateralInTokens: bigint
  maxCollateralInUsd: bigint

  openPnl: bigint
  realisedPnl: bigint
  pnl: bigint
  roi: bigint

  interval: number
  blockTimestamp: number

  matchRoute: IMatchRoute
}

export interface IRouteMatchActivityTimeline extends IMatchRouteStats {
  timeline: IPerformanceTimelineTick[]
}



export interface IPositionListSummary {
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






