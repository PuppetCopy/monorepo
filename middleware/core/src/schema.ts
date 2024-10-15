import { IPriceCandle, ISchema } from "gmx-middleware-utils"
import { IMatchRouteStats, IGbcToken, IOrderCreated, IPositionDecrease, IPositionFeesCollected, IPositionIncrease, IProfile, IMatchRoute, IMatchRule } from "./types.js"


const gbcToken: ISchema<IGbcToken> = {
  id: 'number',
  __typename: 'GbcToken',
}

const profile: ISchema<IProfile> = {
  id: 'address',
  gbcTokenList: gbcToken,
  __typename: 'Profile',
}

const orderCreated: ISchema<IOrderCreated> = {
  id: 'string',
  key: 'string',

  account: 'address',
  receiver: 'address',
  callbackContract: 'address',
  uiFeeReceiver: 'address',
  market: 'address',
  initialCollateralToken: 'address',

  swapPath: 'address[]',

  orderType: 'bigint',
  decreasePositionSwapType: 'bigint',
  sizeDeltaUsd: 'bigint',
  initialCollateralDeltaAmount: 'bigint',
  triggerPrice: 'bigint',
  acceptablePrice: 'bigint',
  executionFee: 'bigint',
  callbackGasLimit: 'bigint',
  minOutputAmount: 'bigint',
  updatedAtBlock: 'bigint',

  isLong: 'bool',
  shouldUnwrapNativeToken: 'bool',
  isFrozen: 'bool',

  __typename: 'OrderCreated',
}

const positionCollectedUpdate: ISchema<IPositionFeesCollected> = {
  id: 'string',
  positionKey: 'string',
  affiliate: 'address',

  totalRebateFactor: 'bigint',
  traderDiscountFactor: 'bigint',
  totalRebateAmount: 'bigint',
  traderDiscountAmount: 'bigint',
  affiliateRewardAmount: 'bigint',
  fundingFeeAmount: 'bigint',
  claimableLongTokenAmount: 'bigint',
  claimableShortTokenAmount: 'bigint',
  latestFundingFeeAmountPerSize: 'bigint',
  latestLongTokenClaimableFundingAmountPerSize: 'bigint',
  latestShortTokenClaimableFundingAmountPerSize: 'bigint',
  borrowingFeeUsd: 'bigint',
  borrowingFeeAmount: 'bigint',
  borrowingFeeReceiverFactor: 'bigint',
  borrowingFeeAmountForFeeReceiver: 'bigint',
  positionFeeFactor: 'bigint',
  protocolFeeAmount: 'bigint',
  positionFeeReceiverFactor: 'bigint',
  feeReceiverAmount: 'bigint',
  feeAmountForPool: 'bigint',
  positionFeeAmountForPool: 'bigint',
  positionFeeAmount: 'bigint',
  totalCostAmount: 'bigint',
  uiFeeReceiverFactor: 'bigint',
  uiFeeAmount: 'bigint',

  blockTimestamp: 'number',
  transactionHash: 'string',
  __typename: 'PositionFeesCollected',
}

const positionIncrease: ISchema<IPositionIncrease> = {
  id: 'string',
  market: 'address',
  collateralToken: 'address',
  account: "address",

  sizeInTokens: 'bigint',
  sizeInUsd: 'bigint',
  collateralAmount: 'bigint',
  borrowingFactor: 'bigint',
  fundingFeeAmountPerSize: 'bigint',
  longTokenClaimableFundingAmountPerSize: 'bigint',
  shortTokenClaimableFundingAmountPerSize: 'bigint',
  executionPrice: 'bigint',
  indexTokenPriceMax: 'bigint',
  indexTokenPriceMin: 'bigint',
  collateralTokenPriceMax: 'bigint',
  collateralTokenPriceMin: 'bigint',
  sizeDeltaUsd: 'bigint',
  sizeDeltaInTokens: 'bigint',
  orderType: 'bigint',

  collateralDeltaAmount: 'bigint',
  priceImpactUsd: 'bigint',
  priceImpactAmount: 'bigint',

  isLong: 'bool',

  positionKey: 'string',

  blockTimestamp: 'number',
  transactionHash: 'string',
  feeCollected: positionCollectedUpdate,

  __typename: 'PositionIncrease',
}

const positionDecrease: ISchema<IPositionDecrease> = {
  id: 'string',
  positionKey: 'string',
  market: 'address',
  collateralToken: 'address',
  account: "address",

  sizeInTokens: 'bigint',
  sizeInUsd: 'bigint',
  collateralAmount: 'bigint',
  borrowingFactor: 'bigint',
  fundingFeeAmountPerSize: 'bigint',
  longTokenClaimableFundingAmountPerSize: 'bigint',
  shortTokenClaimableFundingAmountPerSize: 'bigint',
  executionPrice: 'bigint',
  indexTokenPriceMax: 'bigint',
  indexTokenPriceMin: 'bigint',
  collateralTokenPriceMax: 'bigint',
  collateralTokenPriceMin: 'bigint',
  sizeDeltaUsd: 'bigint',
  sizeDeltaInTokens: 'bigint',
  collateralDeltaAmount: 'bigint',
  valuesPriceImpactDiffUsd: 'bigint',
  orderType: 'bigint',

  priceImpactUsd: 'bigint',
  basePnlUsd: 'bigint',
  uncappedBasePnlUsd: 'bigint',

  isLong: 'bool',

  blockTimestamp: 'number',
  transactionHash: 'string',
  feeCollected: positionCollectedUpdate,

  __typename: 'PositionDecrease',
}

const priceCandle: ISchema<IPriceCandle> = {
  id: 'string',
  token: 'address',
  interval: 'string',
  slotTime: 'number',

  o: 'bigint',
  h: 'bigint',
  l: 'bigint',
  c: 'bigint',

  __typename: 'PriceCandle',
}

const matchRule: ISchema<IMatchRule> = {
  id: 'string',
  puppet: 'address',
  matchKey: 'string',

  allowanceRate: 'bigint',
  throttleActivity: 'bigint',
  expiry: 'bigint',

  routeMatch: {
    id: 'string',
    profile: profile,

    increaseList: positionIncrease,
    decreaseList: positionDecrease,

    __typename: 'MatchRoute',
  },

  __typename: 'MatchRule',
}

const matchRoute: ISchema<IMatchRoute> = {
  id: 'string',
  profile: profile,
  collateralToken: 'address',
  

  increaseList: {
    market: 'address',
    positionKey: 'bytes',
    sizeInUsd: 'bigint',
    sizeInTokens: 'bigint',
    indexTokenPriceMax: 'bigint',
    isLong: 'bool',
    blockTimestamp: 'number',
    __typename: 'PositionIncrease',
  },
  decreaseList: {
    market: 'address',
    positionKey: 'bytes',
    sizeInUsd: 'bigint',
    sizeInTokens: 'bigint',
    indexTokenPriceMax: 'bigint',
    basePnlUsd: 'bigint',
    isLong: 'bool',
    blockTimestamp: 'number',
    __typename: 'PositionIncrease',
  },
  matchRuleList: {
    id: 'string',
    puppet: 'address',
    matchKey: 'string',
    allowanceRate: 'bigint',
    throttleActivity: 'bigint',
    expiry: 'bigint',

    __typename: 'MatchRule',
  },

  __typename: 'MatchRoute',
}

const routeMatchStats: ISchema<IMatchRouteStats> = {
  id: 'string',
  account: 'address',

  cumulativeCollateralToken: 'bigint',
  cumulativeCollateralUsd: 'bigint',
  cumulativeSizeToken: 'bigint',
  cumulativeSizeUsd: 'bigint',

  maxSizeInTokens: 'bigint',
  maxSizeInUsd: 'bigint',
  maxCollateralInTokens: 'bigint',
  maxCollateralInUsd: 'bigint',

  openPnl: 'bigint',
  realisedPnl: 'bigint',
  pnl: 'bigint',
  roi: 'bigint',

  interval: 'number',
  blockTimestamp: 'number',

  matchRoute: matchRoute,

  __typename: 'MatchRouteStats',
}


export const schema = {
  priceCandle, routeMatchStats, matchRule, positionIncrease, positionDecrease, orderCreated, positionCollectedUpdate
}
