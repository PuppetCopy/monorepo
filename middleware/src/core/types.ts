//
// import type { ILogTxType, ILogTypeId } from '../gmx/types.js'

// // type PositionFeesCollected {
// //   id: Bytes!
// //   positionKey: Bytes!

// //   referralCode: Bytes!
// //   affiliate: Bytes!

// //   collateralTokenPriceMin: BigInt!
// //   collateralTokenPriceMax: BigInt!
// //   tradeSizeUsd: BigInt!
// //   fundingFeeAmount: BigInt!
// //   claimableLongTokenAmount: BigInt!
// //   claimableShortTokenAmount: BigInt!
// //   latestFundingFeeAmountPerSize: BigInt!
// //   latestLongTokenClaimableFundingAmountPerSize: BigInt!
// //   latestShortTokenClaimableFundingAmountPerSize: BigInt!
// //   borrowingFeeUsd: BigInt!
// //   borrowingFeeAmount: BigInt!
// //   borrowingFeeReceiverFactor: BigInt!
// //   borrowingFeeAmountForFeeReceiver: BigInt!
// //   positionFeeFactor: BigInt!
// //   protocolFeeAmount: BigInt!
// //   positionFeeReceiverFactor: BigInt!
// //   feeReceiverAmount: BigInt!
// //   feeAmountForPool: BigInt!
// //   positionFeeAmountForPool: BigInt!
// //   positionFeeAmount: BigInt!
// //   totalCostAmount: BigInt!
// //   uiFeeReceiverFactor: BigInt!
// //   uiFeeAmount: BigInt!

// // }

// export interface IPositionFeesCollected extends ILogTxType<'PositionFeesCollected'> {
//   affiliate: Address
//   referralCode: Address
//   positionKey: Address

//   collateralTokenPriceMin: bigint
//   collateralTokenPriceMax: bigint
//   tradeSizeUsd: bigint
//   fundingFeeAmount: bigint
//   claimableLongTokenAmount: bigint
//   claimableShortTokenAmount: bigint
//   latestFundingFeeAmountPerSize: bigint
//   latestLongTokenClaimableFundingAmountPerSize: bigint
//   latestShortTokenClaimableFundingAmountPerSize: bigint
//   borrowingFeeUsd: bigint
//   borrowingFeeAmount: bigint
//   borrowingFeeReceiverFactor: bigint
//   borrowingFeeAmountForFeeReceiver: bigint
//   positionFeeFactor: bigint
//   protocolFeeAmount: bigint
//   positionFeeReceiverFactor: bigint
//   feeReceiverAmount: bigint
//   feeAmountForPool: bigint
//   positionFeeAmountForPool: bigint
//   positionFeeAmount: bigint
//   totalCostAmount: bigint
//   uiFeeReceiverFactor: bigint
//   uiFeeAmount: bigint
// }

// export interface IVested {
//   amount: bigint
//   remainingDuration: bigint
//   lastAccruedTime: bigint
//   accrued: bigint
// }

// export interface IOrderCreated extends ILogTypeId<'OrderCreated'> {
//   key: Hex

//   account: Address
//   receiver: Address
//   callbackContract: Address
//   uiFeeReceiver: Address
//   market: Address
//   initialCollateralToken: Address

//   swapPath: Address[]

//   orderType: bigint
//   decreasePositionSwapType: bigint
//   sizeDeltaUsd: bigint
//   initialCollateralDeltaAmount: bigint
//   triggerPrice: bigint
//   acceptablePrice: bigint
//   executionFee: bigint
//   callbackGasLimit: bigint
//   minOutputAmount: bigint
//   updatedAtBlock: bigint

//   isLong: boolean
//   shouldUnwrapNativeToken: boolean
//   isFrozen: boolean
// }

// export interface IOrderStatus extends ILogTxType<'OrderStatus'> {
//   order: IOrderCreated
//   orderType: bigint
//   statusType: bigint
//   message: string
// }

// export interface IPositionIncrease extends ILogTxType<'PositionIncrease'> {
//   order: IOrderStatus
//   positionKey: Hex
//   account: Address

//   market: Address
//   collateralToken: Address

//   sizeInUsd: bigint
//   sizeInTokens: bigint
//   collateralAmount: bigint
//   borrowingFactor: bigint
//   fundingFeeAmountPerSize: bigint
//   longTokenClaimableFundingAmountPerSize: bigint
//   shortTokenClaimableFundingAmountPerSize: bigint

//   executionPrice: bigint
//   indexTokenPriceMax: bigint
//   indexTokenPriceMin: bigint
//   collateralTokenPriceMax: bigint
//   collateralTokenPriceMin: bigint
//   sizeDeltaUsd: bigint
//   sizeDeltaInTokens: bigint
//   orderType: bigint

//   collateralDeltaAmount: bigint
//   priceImpactUsd: bigint
//   priceImpactAmount: bigint

//   isLong: boolean

//   feeCollected: IPositionFeesCollected
//   // matchRoute: IMatchRoute
// }

// export interface IPositionDecrease extends ILogTxType<'PositionDecrease'> {
//   collateralToken: Address
//   market: Address
//   account: Address

//   order: IOrderStatus
//   positionKey: Hex

//   sizeInUsd: bigint
//   sizeInTokens: bigint
//   collateralAmount: bigint
//   borrowingFactor: bigint
//   fundingFeeAmountPerSize: bigint
//   longTokenClaimableFundingAmountPerSize: bigint
//   shortTokenClaimableFundingAmountPerSize: bigint

//   executionPrice: bigint
//   indexTokenPriceMax: bigint
//   indexTokenPriceMin: bigint
//   collateralTokenPriceMax: bigint
//   collateralTokenPriceMin: bigint
//   sizeDeltaUsd: bigint
//   sizeDeltaInTokens: bigint
//   collateralDeltaAmount: bigint
//   valuesPriceImpactDiffUsd: bigint
//   orderType: bigint

//   priceImpactUsd: bigint
//   basePnlUsd: bigint
//   uncappedBasePnlUsd: bigint

//   isLong: boolean

//   feeCollected: IPositionFeesCollected
//   // matchRoute: IMatchRoute
// }

// export interface IMirrorRequest {
//   puppets: readonly Address[]
//   trader: Address
//   subaccount: Address
//   positionKey: Hex
//   isIncrease: boolean
//   requestKey: Hex
// }

// export interface IPuppetPosition extends ILogTxType<'PuppetPosition'> {
//   key: Hex
//   positionKey: Hex

//   account: Address
//   market: Address
//   collateralToken: Address

//   collateral: bigint

//   position: IPosition
// }

// export interface IPosition {
//   key: Hex
//   account: Address
//   market: Address
//   collateralToken: Address

//   sizeInUsd: bigint
//   sizeInTokens: bigint
//   collateralInTokens: bigint
//   collateralInUsd: bigint
//   realisedPnlUsd: bigint

//   // cumulativeCollateralToken: bigint
//   // cumulativeCollateralUsd: bigint
//   // cumulativeSizeToken: bigint
//   // cumulativeSizeUsd: bigint

//   maxSizeInTokens: bigint
//   maxSizeInUsd: bigint
//   maxCollateralInTokens: bigint
//   maxCollateralInUsd: bigint

//   avgEntryPrice: bigint

//   isLong: boolean

//   increaseList: IPositionIncrease[]
//   decreaseList: IPositionDecrease[]

//   openTimestamp: number
//   settledTimestamp: number

//   puppetList: IPuppetPosition[]
//   collateralList: bigint[]

//   lastUpdate: IPositionIncrease | IPositionDecrease
// }

// export interface IGbcToken extends ILogTypeId<'GbcToken'> {
//   id: Address
//   profile: IProfile
// }

// export interface IProfile extends ILogTypeId<'Profile'> {
//   id: Address
//   gbcTokenList: number[]
// }

// // type DepositBalance {
// //   id: Bytes!
// //   token: Bytes!
// //   value: BigInt!

// //   account: PuppetAccount!
// // }

// export interface IDepositBalance extends ILogTypeId<'DepositBalance'> {
//   id: Address
//   token: Address
//   value: bigint

//   account: Address
// }

// export interface IAccountBalance extends ILogTypeId<'AccountBalance'> {
//   id: Address
//   account: Address
//   token: Address
//   value: bigint
// }

// export interface IPuppetAllocation extends ILogTypeId<'PuppetAllocation'> {
//   id: Address
//   puppet: Address
//   collateralToken: Address
//   matchKey: Address
//   originRequestKey: Address

//   activityThrottle: bigint
//   amount: bigint
// }

// export interface IAllocation extends ILogTypeId<'Allocation'> {
//   id: Address
//   collateralToken: Address
//   originRequestKey: Address
//   matchKey: Address
//   puppetListHash: Address

//   matchSequenceId: bigint
//   transactionCost: bigint
//   totalAllocated: bigint

//   allocationList: IPuppetAllocation[]
//   matchRoute: IMatchRoute
// }

// export interface IPuppetSettlement extends ILogTypeId<'PuppetSettlement'> {
//   id: Address
//   puppet: Address
//   collateralToken: Address
//   matchKey: Address

//   contribution: bigint
//   amount: bigint
// }

// export interface ISettlement extends ILogTypeId<'Settlement'> {
//   id: Address
//   puppet: Address
//   collateralToken: Address
//   matchKey: Address

//   allocated: bigint
//   settled: bigint
//   puppetContribution: bigint
//   traderPerformanceContribution: bigint
//   transactionCost: bigint
//   profit: bigint

//   allocate: IAllocation

//   settlementList: IPuppetSettlement[]

//   blockNumber: number
//   blockTimestamp: number
//   transactionHash: Address
// }

// export interface IMatchRule extends ILogTypeId<'MatchRule'> {
//   id: Address
//   puppet: Address
//   matchKey: Address

//   allowanceRate: bigint
//   throttleActivity: bigint
//   expiry: bigint

//   routeMatch: IMatchRoute
// }

// export interface IMatchRoute extends ILogTypeId<'MatchRoute'> {
//   id: Address
//   collateralToken: Address

//   profile: IProfile

//   increaseList: IPositionIncrease[]
//   decreaseList: IPositionDecrease[]

//   // increaseList: {
//   //   market: Address
//   //   positionKey: Hex
//   //   collateralAmount: bigint
//   //   collateralInUsd: bigint
//   //   sizeInTokens: bigint
//   //   sizeInUsd: bigint
//   //   indexTokenPriceMax: bigint
//   //   isLong: boolean
//   //   blockTimestamp: number,
//   //   __typename: 'PositionIncrease'
//   // },
//   // decreaseList: {
//   //   market: Address
//   //   positionKey: Hex
//   //   collateralAmount: bigint
//   //   collateralInUsd: bigint
//   //   sizeInTokens: bigint
//   //   sizeInUsd: bigint
//   //   indexTokenPriceMax: bigint
//   //   basePnlUsd: bigint
//   //   isLong: boolean
//   //   blockTimestamp: number
//   //   __typename: 'PositionDecrease'
//   // },

//   matchRuleList: IMatchRule[]
//   allocationList: IAllocation[]
//   settlementList: ISettlement[]

//   stats: IMatchRouteStats[]
// }

// export interface ISettle extends ILogTypeId<'Settle'> {
//   id: Address
//   collateralToken: Address
//   matchKey: Address

//   allocated: bigint
//   settled: bigint
//   puppetContribution: bigint
//   traderPerformanceContribution: bigint
//   transactionCost: bigint
//   profit: bigint

//   puppet: Address
//   allocate: IAllocation

//   blockNumber: number
//   blockTimestamp: number
//   transactionHash: Address
// }

// export interface IMatchRouteStats extends ILogTypeId<'MatchRouteStats'> {
//   account: Address
//   collateralToken: Address

//   cumulativeCollateralToken: bigint
//   cumulativeCollateralUsd: bigint
//   cumulativeSizeToken: bigint
//   cumulativeSizeUsd: bigint

//   maxSizeInTokens: bigint
//   maxSizeInUsd: bigint
//   maxCollateralInTokens: bigint
//   maxCollateralInUsd: bigint

//   openPnl: bigint
//   realisedPnl: bigint
//   pnl: bigint
//   roi: bigint

//   interval: number
//   blockTimestamp: number

//   matchRoute: IMatchRoute
// }

