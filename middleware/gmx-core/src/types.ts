import { ExtractAbiEvent } from "abitype"
import { IntervalTime } from "common-utils"
import * as GMX from "gmx-middleware-const"
import { TOKEN_DESCRIPTION_MAP } from "gmx-middleware-const"
import * as viem from "viem"

export type ITokenSymbol = keyof typeof TOKEN_DESCRIPTION_MAP

export interface IIdentifiableEntity {
  id: string
}

export interface ILogIndex<TQuantity = bigint, TIndex = number> {
  blockNumber: TQuantity
  // transactionIndex: TIndex
  logIndex: TIndex
}

export interface ILogOrdered {
  orderId: number
}

export type ILogType<T extends string> = {
  __typename: T
}

export type ILogTypeId<T extends string> = ILogType<T> & {
  id: string
}

export type ILogTxType<T extends string> = ILogTypeId<T> & {
  blockTimestamp: number
  transactionHash: viem.Hex
}


export type ILogArgs<TAbi extends viem.Abi = viem.Abi, TEventName extends string = string> = viem.GetEventArgs<TAbi, TEventName, { Required: true }>
export type ILogEvent<TAbi extends viem.Abi = viem.Abi, TEventName extends string = string> = viem.Log<bigint, number, false, ExtractAbiEvent<TAbi, TEventName>, true, TAbi, TEventName> // ILogIndex & ILogOrdered & viem.GetEventArgs<TAbi, TEventName, { Required: true }>
export type ILogOrderedEvent<TAbi extends viem.Abi = viem.Abi, TEventName extends string = string> = ILogOrdered & Omit<ILogEvent<TAbi, TEventName>, 'data'>
export type ILog<TAbi extends viem.Abi = viem.Abi, TEventName extends string = string> = ILogTxType<TEventName> & ILogArgs<TAbi, TEventName>



export interface IPriceCandle extends ILogTypeId<'PriceCandle'> {
  token: viem.Address
  interval: IntervalTime
  slotTime: number
  o: bigint // open
  h: bigint // high
  l: bigint // low
  c: bigint // close
}

export interface IPricetick {
  price: bigint
  timestamp: number
}

export type IPriceTickListMap = Record<viem.Address, IPricetick[]>
export type IPricefeedMap = Record<viem.Address, IPriceCandle[]>
export type IPriceOracleMap = Record<viem.Address, IOraclePrice>


export type ILatestPriceMap = Record<viem.Address, IPricetick>



export interface IChainParamApi {
  chain: number
}


export interface IRequestTimerangeApi {
  from: number
  to: number
}


export type IRequestAccountApi = IChainParamApi & { account: viem.Address }

export type IRequestPriceTimelineApi = IChainParamApi & IRequestTimerangeApi & { tokenAddress: viem.Address }
export type IRequestAccountHistoricalDataApi = IChainParamApi & IRequestAccountApi & IRequestTimerangeApi
export type IRequestPricefeedApi = IChainParamApi & IRequestTimerangeApi & { interval: IntervalTime, tokenAddress: viem.Address }


export interface IRequestGraphEntityApi extends IChainParamApi, IIdentifiableEntity { }


export type IPositionNumbers = {
  sizeInUsd: bigint
  sizeInTokens: bigint
  collateralAmount: bigint
  borrowingFactor: bigint
  fundingFeeAmountPerSize: bigint
  longTokenClaimableFundingAmountPerSize: bigint
  shortTokenClaimableFundingAmountPerSize: bigint
}

export const OrderType = {
  // the order will be cancelled if the minOutputAmount cannot be fulfilled
  MarketSwap: 0n,
  // @dev LimitSwap: swap token A to token B if the minOutputAmount can be fulfilled
  LimitSwap: 1n,
  // @dev MarketIncrease: increase position at the current market price
  // the order will be cancelled if the position cannot be increased at the acceptablePrice
  MarketIncrease: 2n,
  // @dev LimitIncrease: increase position if the triggerPrice is reached and the acceptablePrice can be fulfilled
  LimitIncrease: 3n,
  // @dev MarketDecrease: decrease position at the curent market price
  // the order will be cancelled if the position cannot be decreased at the acceptablePrice
  MarketDecrease: 4n,
  // @dev LimitDecrease: decrease position if the triggerPrice is reached and the acceptablePrice can be fulfilled
  LimitDecrease: 5n,
  // @dev StopLossDecrease: decrease position if the triggerPrice is reached and the acceptablePrice can be fulfilled
  StopLossDecrease: 6n,
  // @dev Liquidation: allows liquidation of positions if the criteria for liquidation are met
  Liquidation: 7n,
} as const


export type IEventEmitterAbi = typeof GMX.CONTRACT['42161']['EventEmitter']['abi']

export type IEventLog1Args = ILogOrderedEvent<IEventEmitterAbi, 'EventLog1'>


export interface PositionReferralFees {
  referralCode: viem.Hex
  affiliate: viem.Address
  trader: viem.Address

  totalRebateFactor: bigint
  traderDiscountFactor: bigint
  totalRebateAmount: bigint
  traderDiscountAmount: bigint
  affiliateRewardAmount: bigint

}


export interface IPositionFundingFees {
  fundingFeeAmount: bigint
  claimableLongTokenAmount: bigint
  claimableShortTokenAmount: bigint
  latestFundingFeeAmountPerSize: bigint
  latestLongTokenClaimableFundingAmountPerSize: bigint
  latestShortTokenClaimableFundingAmountPerSize: bigint
}


export interface PositionBorrowingFees {
  borrowingFeeUsd: bigint
  borrowingFeeAmount: bigint
  borrowingFeeReceiverFactor: bigint
  borrowingFeeAmountForFeeReceiver: bigint
}

export interface IPositionUiFees {
  uiFeeReceiver: viem.Address
  uiFeeReceiverFactor: bigint
  uiFeeAmount: bigint
}

export interface IPriceMinMax {
  min: bigint
  max: bigint
}



export interface IPositionFees {
  referral: PositionReferralFees
  funding: IPositionFundingFees
  borrowing: PositionBorrowingFees
  ui: IPositionUiFees
  collateralTokenPrice: IPriceMinMax

  positionFeeFactor: bigint
  protocolFeeAmount: bigint
  positionFeeReceiverFactor: bigint
  feeReceiverAmount: bigint
  feeAmountForPool: bigint
  positionFeeAmountForPool: bigint
  positionFeeAmount: bigint
  totalCostAmountExcludingFunding: bigint
  totalCostAmount: bigint
}


export interface IExecutionPriceResult {
  priceImpactUsd: bigint
  priceImpactDiffUsd: bigint
  executionPrice: bigint
}

export type IOraclePrice = IPriceMinMax & {
  priceSourceType: bigint
  timestamp: number
  token: viem.Address
}


export type IInsolventClose = {
  orderKey: viem.Hex
  positionCollateralAmount: bigint
  remainingCostUsd: bigint
  basePnlUsd: bigint
}



export interface IMarketPrice {
  indexTokenPrice: IPriceMinMax,
  longTokenPrice: IPriceMinMax,
  shortTokenPrice: IPriceMinMax
}

export type IMarket = {
  indexToken: viem.Address
  longToken: viem.Address
  shortToken: viem.Address
  marketToken: viem.Address
}

export interface IMarketPool {
  poolValue: bigint
  longPnl: bigint
  shortPnl: bigint
  netPnl: bigint

  longTokenAmount: bigint
  shortTokenAmount: bigint
  longTokenUsd: bigint
  shortTokenUsd: bigint

  borrowingFeePoolFactor: bigint
  totalBorrowingFees: bigint

  impactPoolAmount: bigint
}

export interface IMarketFees {
  borrowingFactorPerSecondForLongs: bigint
  borrowingFactorPerSecondForShorts: bigint
  baseFunding: IBaseFundingValues
  nextFunding: IGetNextFundingAmountPerSizeResult
  virtualInventory: IVirtualInventory
  isDisabled: boolean
}

export interface IMarketUsageInfo {
  longInterestInTokens: bigint
  shortInterestInTokens: bigint

  longInterestUsd: bigint
  shortInterestUsd: bigint

  longInterestInTokensUsingLongToken: bigint
  longInterestInTokensUsingShortToken: bigint
  shortInterestInTokensUsingLongToken: bigint
  shortInterestInTokensUsingShortToken: bigint

  positionImpactPoolAmount: bigint
}

export interface IMarketConfig {
  reserveFactorLong: bigint
  reserveFactorShort: bigint

  maxPnlFactorForTradersLong: bigint
  maxPnlFactorForTradersShort: bigint

  openInterestReserveFactorLong: bigint
  openInterestReserveFactorShort: bigint

  positionFeeFactorForPositiveImpact: bigint
  positionFeeFactorForNegativeImpact: bigint
  minCollateralFactor: bigint

  positionImpactFactorPositive: bigint
  positionImpactFactorNegative: bigint
  positionImpactExponentFactor: bigint

  maxPositionImpactFactorForLiquidations: bigint
  maxPositionImpactFactorPositive: bigint
}

export interface IMarketInfo {
  market: IMarket
  price: IMarketPrice
  fees: IMarketFees
  pool: IMarketPool
  config: IMarketConfig
  usage: IMarketUsageInfo
}



interface ICollateralType {
  longToken: bigint
  shortToken: bigint
}

export type IPositionType = {
  long: ICollateralType
  short: ICollateralType
}


export interface IBaseFundingValues {
  fundingFeeAmountPerSize: IPositionType
  claimableFundingAmountPerSize: IPositionType
}

export interface IGetNextFundingAmountPerSizeResult {
  longsPayShorts: boolean
  fundingFactorPerSecond: bigint

  fundingFeeAmountPerSizeDelta: IPositionType
  claimableFundingAmountPerSizeDelta: IPositionType
}

export interface IVirtualInventory {
  virtualPoolAmountForLongToken: bigint
  virtualPoolAmountForShortToken: bigint
  virtualInventoryForPositions: bigint
}

