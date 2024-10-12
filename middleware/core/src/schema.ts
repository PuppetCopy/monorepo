import { IPriceCandle, ISchema } from "gmx-middleware-utils"
import { IAccountLastAggregatedStats, IGbcToken, IOrderCreated, IPositionDecrease, IPositionFeesCollected, IPositionIncrease, IProfile, ITraderAccount } from "./types.js"


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

  orderType: 'uint256',
  decreasePositionSwapType: 'uint256',
  sizeDeltaUsd: 'uint256',
  initialCollateralDeltaAmount: 'uint256',
  triggerPrice: 'uint256',
  acceptablePrice: 'uint256',
  executionFee: 'uint256',
  callbackGasLimit: 'uint256',
  minOutputAmount: 'uint256',
  updatedAtBlock: 'uint256',

  isLong: 'bool',
  shouldUnwrapNativeToken: 'bool',
  isFrozen: 'bool',

  __typename: 'OrderCreated',
}

const positionCollectedUpdate: ISchema<IPositionFeesCollected> = {
  id: 'string',
  positionKey: 'string',
  affiliate: 'address',

  totalRebateFactor: 'uint256',
  traderDiscountFactor: 'uint256',
  totalRebateAmount: 'uint256',
  traderDiscountAmount: 'uint256',
  affiliateRewardAmount: 'uint256',
  fundingFeeAmount: 'uint256',
  claimableLongTokenAmount: 'uint256',
  claimableShortTokenAmount: 'uint256',
  latestFundingFeeAmountPerSize: 'uint256',
  latestLongTokenClaimableFundingAmountPerSize: 'uint256',
  latestShortTokenClaimableFundingAmountPerSize: 'uint256',
  borrowingFeeUsd: 'uint256',
  borrowingFeeAmount: 'uint256',
  borrowingFeeReceiverFactor: 'uint256',
  borrowingFeeAmountForFeeReceiver: 'uint256',
  positionFeeFactor: 'uint256',
  protocolFeeAmount: 'uint256',
  positionFeeReceiverFactor: 'uint256',
  feeReceiverAmount: 'uint256',
  feeAmountForPool: 'uint256',
  positionFeeAmountForPool: 'uint256',
  positionFeeAmount: 'uint256',
  totalCostAmount: 'uint256',
  uiFeeReceiverFactor: 'uint256',
  uiFeeAmount: 'uint256',

  blockTimestamp: 'number',
  transactionHash: 'string',
  __typename: 'PositionFeesCollected',
}

const positionIncrease: ISchema<IPositionIncrease> = {
  id: 'string',
  market: 'address',
  collateralToken: 'address',

  sizeInTokens: 'uint256',
  sizeInUsd: 'uint256',
  collateralAmount: 'uint256',
  borrowingFactor: 'uint256',
  fundingFeeAmountPerSize: 'uint256',
  longTokenClaimableFundingAmountPerSize: 'uint256',
  shortTokenClaimableFundingAmountPerSize: 'uint256',
  executionPrice: 'uint256',
  indexTokenPriceMax: 'uint256',
  indexTokenPriceMin: 'uint256',
  collateralTokenPriceMax: 'uint256',
  collateralTokenPriceMin: 'uint256',
  sizeDeltaUsd: 'uint256',
  sizeDeltaInTokens: 'uint256',
  orderType: 'uint256',

  collateralDeltaAmount: 'int256',
  priceImpactUsd: 'int256',
  priceImpactAmount: 'int256',

  isLong: 'bool',

  positionKey: 'string',

  blockTimestamp: 'number',
  transactionHash: 'string',
  feeCollected: positionCollectedUpdate,

  account: {
    id: 'string',
    __typename: 'TraderAccount',
  },

  __typename: 'PositionIncrease',
}

const positionDecrease: ISchema<IPositionDecrease> = {
  id: 'string',
  positionKey: 'string',
  market: 'address',
  collateralToken: 'address',

  sizeInTokens: 'uint256',
  sizeInUsd: 'uint256',
  collateralAmount: 'uint256',
  borrowingFactor: 'uint256',
  fundingFeeAmountPerSize: 'uint256',
  longTokenClaimableFundingAmountPerSize: 'uint256',
  shortTokenClaimableFundingAmountPerSize: 'uint256',
  executionPrice: 'uint256',
  indexTokenPriceMax: 'uint256',
  indexTokenPriceMin: 'uint256',
  collateralTokenPriceMax: 'uint256',
  collateralTokenPriceMin: 'uint256',
  sizeDeltaUsd: 'uint256',
  sizeDeltaInTokens: 'uint256',
  collateralDeltaAmount: 'uint256',
  valuesPriceImpactDiffUsd: 'uint256',
  orderType: 'uint256',

  priceImpactUsd: 'int256',
  basePnlUsd: 'int256',
  uncappedBasePnlUsd: 'int256',

  isLong: 'bool',


  blockTimestamp: 'number',
  transactionHash: 'string',
  feeCollected: positionCollectedUpdate,

  account: {
    id: 'string',
    __typename: 'TraderAccount',
  },


  __typename: 'PositionDecrease',
}

const priceCandle: ISchema<IPriceCandle> = {
  id: 'string',
  token: 'address',
  interval: 'string',
  slotTime: 'number',

  o: 'uint',
  h: 'uint',
  l: 'uint',
  c: 'uint',

  __typename: 'PriceCandle',
}

const traderAccount: ISchema<ITraderAccount> = {
  id: 'string',
  profile: profile,

  increaseList: positionIncrease,
  decreaseList: positionDecrease,

  __typename: 'TraderAccount',
}

const accountLastAggregatedStats: ISchema<IAccountLastAggregatedStats> = {
  id: 'string',

  cumulativeSizeUsd: 'uint',
  cumulativeCollateralUsd: 'uint',
  maxCollateralInUsd: 'uint',
  maxSizeInUsd: 'uint',
  openPnl: 'uint',
  realisedPnl: 'uint',
  pnl: 'uint',
  roi: 'uint',

  blockTimestamp: 'number',
  interval: 'number',
  account: traderAccount,

  __typename: 'AccountLastAggregatedStats',
}


export const schema = {
  priceCandle, accountLastAggregatedStats, traderAccount, positionIncrease, positionDecrease,
  orderCreated, positionCollectedUpdate
}
