/* TypeScript file generated from Entities.res by genType. */

/* eslint-disable */
/* tslint:disable */

export type id = string;

export type whereOperations<entity, fieldType> = { readonly eq: (_1: fieldType) => Promise<entity[]> };

export type AccountBalance_t = {
  readonly account: string;
  readonly id: string;
  readonly token: string;
  readonly value: bigint
};

export type AccountBalance_indexedFieldOperations = {};

export type Allocation_t = {
  readonly blockNumber: number;
  readonly blockTimestamp: number;
  readonly collateralToken: string;
  readonly id: string;
  readonly matchKey: string;
  readonly matchRoute_id: id;
  readonly originRequestKey: string;
  readonly puppetListHash: string;
  readonly totalAllocated: bigint;
  readonly transactionCost: bigint;
  readonly transactionHash: string
};

export type Allocation_indexedFieldOperations = { readonly blockTimestamp: whereOperations<Allocation_t, number>; readonly matchRoute_id: whereOperations<Allocation_t, id> };

export type GbcToken_t = { readonly id: string; readonly profile_id: id };

export type GbcToken_indexedFieldOperations = { readonly profile_id: whereOperations<GbcToken_t, id> };

export type MatchRoute_t = { readonly id: string; readonly profile_id: id };

export type MatchRoute_indexedFieldOperations = {};

export type MatchRouteStats_t = {
  readonly account: string;
  readonly blockTimestamp: number;
  readonly cumulativeCollateralToken: bigint;
  readonly cumulativeCollateralUsd: bigint;
  readonly cumulativeSizeToken: bigint;
  readonly cumulativeSizeUsd: bigint;
  readonly id: string;
  readonly interval: number;
  readonly matchRoute_id: id;
  readonly maxCollateralInTokens: bigint;
  readonly maxCollateralInUsd: bigint;
  readonly maxSizeInTokens: bigint;
  readonly maxSizeInUsd: bigint;
  readonly openPnl: bigint;
  readonly pnl: bigint;
  readonly realisedPnl: bigint;
  readonly roi: bigint
};

export type MatchRouteStats_indexedFieldOperations = {
  readonly blockTimestamp: whereOperations<MatchRouteStats_t, number>;
  readonly matchRoute_id: whereOperations<MatchRouteStats_t, id>;
  readonly pnl: whereOperations<MatchRouteStats_t, bigint>;
  readonly roi: whereOperations<MatchRouteStats_t, bigint>
};

export type MatchRouteStatsOpenPnl_t = {
  readonly account: string;
  readonly id: string;
  readonly pnl: bigint
};

export type MatchRouteStatsOpenPnl_indexedFieldOperations = {};

export type MatchRule_t = {
  readonly allowanceRate: bigint;
  readonly expiry: bigint;
  readonly id: string;
  readonly matchKey: string;
  readonly matchRoute_id: id;
  readonly puppet: string;
  readonly throttleActivity: bigint
};

export type MatchRule_indexedFieldOperations = { readonly matchRoute_id: whereOperations<MatchRule_t, id> };

export type MirrorDecrease_t = {
  readonly account: string;
  readonly basePnlUsd: bigint;
  readonly blockNumber: number;
  readonly blockTimestamp: number;
  readonly borrowingFactor: bigint;
  readonly collateralAmount: bigint;
  readonly collateralDeltaAmount: bigint;
  readonly collateralToken: string;
  readonly collateralTokenPriceMax: bigint;
  readonly collateralTokenPriceMin: bigint;
  readonly decrease_id: id;
  readonly executionPrice: bigint;
  readonly fundingFeeAmountPerSize: bigint;
  readonly id: string;
  readonly indexTokenPriceMax: bigint;
  readonly indexTokenPriceMin: bigint;
  readonly isLong: boolean;
  readonly longTokenClaimableFundingAmountPerSize: bigint;
  readonly market: string;
  readonly matchKey: string;
  readonly matchRoute_id: id;
  readonly orderKey: string;
  readonly orderType: bigint;
  readonly positionKey: string;
  readonly priceImpactUsd: bigint;
  readonly request_id: id;
  readonly shortTokenClaimableFundingAmountPerSize: bigint;
  readonly sizeDeltaInTokens: bigint;
  readonly sizeDeltaUsd: bigint;
  readonly sizeInTokens: bigint;
  readonly sizeInUsd: bigint;
  readonly trader: string;
  readonly transactionHash: string;
  readonly uncappedBasePnlUsd: bigint;
  readonly valuesPriceImpactDiffUsd: bigint
};

export type MirrorDecrease_indexedFieldOperations = { readonly blockTimestamp: whereOperations<MirrorDecrease_t, number>; readonly matchRoute_id: whereOperations<MirrorDecrease_t, id> };

export type MirrorIncrease_t = {
  readonly account: string;
  readonly blockNumber: number;
  readonly blockTimestamp: number;
  readonly borrowingFactor: bigint;
  readonly collateralAmount: bigint;
  readonly collateralDeltaAmount: bigint;
  readonly collateralToken: string;
  readonly collateralTokenPriceMax: bigint;
  readonly collateralTokenPriceMin: bigint;
  readonly executionPrice: bigint;
  readonly fundingFeeAmountPerSize: bigint;
  readonly id: string;
  readonly increase_id: id;
  readonly indexTokenPriceMax: bigint;
  readonly indexTokenPriceMin: bigint;
  readonly isLong: boolean;
  readonly longTokenClaimableFundingAmountPerSize: bigint;
  readonly market: string;
  readonly matchKey: string;
  readonly matchRoute_id: id;
  readonly orderKey: string;
  readonly orderType: bigint;
  readonly positionKey: string;
  readonly priceImpactAmount: bigint;
  readonly priceImpactUsd: bigint;
  readonly request_id: id;
  readonly shortTokenClaimableFundingAmountPerSize: bigint;
  readonly sizeDeltaInTokens: bigint;
  readonly sizeDeltaUsd: bigint;
  readonly sizeInTokens: bigint;
  readonly sizeInUsd: bigint;
  readonly trader: string;
  readonly transactionHash: string
};

export type MirrorIncrease_indexedFieldOperations = { readonly blockTimestamp: whereOperations<MirrorIncrease_t, number>; readonly matchRoute_id: whereOperations<MirrorIncrease_t, id> };

export type PlatofrmPositionStats_t = {
  readonly cumulativeCollateralUsd: bigint;
  readonly cumulativeSizeUsd: bigint;
  readonly id: string;
  readonly interval: number;
  readonly lossCount: bigint;
  readonly maxCollateralInUsd: bigint;
  readonly maxSizeInUsd: bigint;
  readonly pnl: bigint;
  readonly puppets: bigint;
  readonly roi: bigint;
  readonly successRate: bigint;
  readonly timestamp: bigint;
  readonly winCount: bigint
};

export type PlatofrmPositionStats_indexedFieldOperations = {};

export type PositionDecrease_t = {
  readonly account: string;
  readonly basePnlUsd: bigint;
  readonly blockNumber: number;
  readonly blockTimestamp: number;
  readonly borrowingFactor: bigint;
  readonly collateralAmount: bigint;
  readonly collateralDeltaAmount: bigint;
  readonly collateralToken: string;
  readonly collateralTokenPriceMax: bigint;
  readonly collateralTokenPriceMin: bigint;
  readonly executionPrice: bigint;
  readonly feeCollected_id: id;
  readonly fundingFeeAmountPerSize: bigint;
  readonly id: string;
  readonly indexTokenPriceMax: bigint;
  readonly indexTokenPriceMin: bigint;
  readonly isLong: boolean;
  readonly longTokenClaimableFundingAmountPerSize: bigint;
  readonly market: string;
  readonly matchRoute_id: id;
  readonly mirror_id: (undefined | id);
  readonly orderKey: string;
  readonly orderType: bigint;
  readonly positionKey: string;
  readonly priceImpactUsd: bigint;
  readonly shortTokenClaimableFundingAmountPerSize: bigint;
  readonly sizeDeltaInTokens: bigint;
  readonly sizeDeltaUsd: bigint;
  readonly sizeInTokens: bigint;
  readonly sizeInUsd: bigint;
  readonly transactionHash: string;
  readonly uncappedBasePnlUsd: bigint;
  readonly valuesPriceImpactDiffUsd: bigint
};

export type PositionDecrease_indexedFieldOperations = {
  readonly account: whereOperations<PositionDecrease_t, string>;
  readonly blockTimestamp: whereOperations<PositionDecrease_t, number>;
  readonly matchRoute_id: whereOperations<PositionDecrease_t, id>
};

export type PositionFeesCollected_t = {
  readonly affiliate: string;
  readonly affiliateRewardAmount: bigint;
  readonly blockNumber: number;
  readonly blockTimestamp: number;
  readonly borrowingFeeAmount: bigint;
  readonly borrowingFeeAmountForFeeReceiver: bigint;
  readonly borrowingFeeReceiverFactor: bigint;
  readonly borrowingFeeUsd: bigint;
  readonly claimableLongTokenAmount: bigint;
  readonly claimableShortTokenAmount: bigint;
  readonly feeAmountForPool: bigint;
  readonly feeReceiverAmount: bigint;
  readonly fundingFeeAmount: bigint;
  readonly id: string;
  readonly latestFundingFeeAmountPerSize: bigint;
  readonly latestLongTokenClaimableFundingAmountPerSize: bigint;
  readonly latestShortTokenClaimableFundingAmountPerSize: bigint;
  readonly positionFeeAmount: bigint;
  readonly positionFeeAmountForPool: bigint;
  readonly positionFeeFactor: bigint;
  readonly positionFeeReceiverFactor: bigint;
  readonly positionKey: string;
  readonly protocolFeeAmount: bigint;
  readonly referralCode: string;
  readonly totalCostAmount: bigint;
  readonly totalRebateAmount: bigint;
  readonly totalRebateFactor: bigint;
  readonly traderDiscountAmount: bigint;
  readonly traderDiscountFactor: bigint;
  readonly transactionHash: string;
  readonly uiFeeAmount: bigint;
  readonly uiFeeReceiverFactor: bigint
};

export type PositionFeesCollected_indexedFieldOperations = { readonly blockTimestamp: whereOperations<PositionFeesCollected_t, number> };

export type PositionIncrease_t = {
  readonly account: string;
  readonly blockNumber: number;
  readonly blockTimestamp: number;
  readonly borrowingFactor: bigint;
  readonly collateralAmount: bigint;
  readonly collateralDeltaAmount: bigint;
  readonly collateralToken: string;
  readonly collateralTokenPriceMax: bigint;
  readonly collateralTokenPriceMin: bigint;
  readonly executionPrice: bigint;
  readonly feeCollected_id: id;
  readonly fundingFeeAmountPerSize: bigint;
  readonly id: string;
  readonly indexTokenPriceMax: bigint;
  readonly indexTokenPriceMin: bigint;
  readonly isLong: boolean;
  readonly longTokenClaimableFundingAmountPerSize: bigint;
  readonly market: string;
  readonly matchRoute_id: id;
  readonly mirror_id: (undefined | id);
  readonly orderKey: string;
  readonly orderType: bigint;
  readonly positionKey: string;
  readonly priceImpactAmount: bigint;
  readonly priceImpactUsd: bigint;
  readonly shortTokenClaimableFundingAmountPerSize: bigint;
  readonly sizeDeltaInTokens: bigint;
  readonly sizeDeltaUsd: bigint;
  readonly sizeInTokens: bigint;
  readonly sizeInUsd: bigint;
  readonly transactionHash: string
};

export type PositionIncrease_indexedFieldOperations = {
  readonly account: whereOperations<PositionIncrease_t, string>;
  readonly blockTimestamp: whereOperations<PositionIncrease_t, number>;
  readonly matchRoute_id: whereOperations<PositionIncrease_t, id>
};

export type PriceCandle_t = {
  readonly c: bigint;
  readonly h: bigint;
  readonly id: id;
  readonly interval: number;
  readonly l: bigint;
  readonly o: bigint;
  readonly slotTime: number;
  readonly token: string
};

export type PriceCandle_indexedFieldOperations = { readonly slotTime: whereOperations<PriceCandle_t, number> };

export type Profile_t = { readonly id: string };

export type Profile_indexedFieldOperations = {};

export type PuppetAllocation_t = {
  readonly allocation_id: id;
  readonly amount: bigint;
  readonly collateralToken: string;
  readonly id: string;
  readonly matchKey: string;
  readonly originRequestKey: string;
  readonly puppet: string
};

export type PuppetAllocation_indexedFieldOperations = { readonly allocation_id: whereOperations<PuppetAllocation_t, id> };

export type PuppetSettlement_t = {
  readonly allocation_id: id;
  readonly amount: bigint;
  readonly collateralToken: string;
  readonly contribution: bigint;
  readonly id: string;
  readonly matchKey: string;
  readonly puppet: string;
  readonly settlement_id: id
};

export type PuppetSettlement_indexedFieldOperations = { readonly settlement_id: whereOperations<PuppetSettlement_t, id> };

export type RequestMirrorDecrease_t = {
  readonly allocation_id: id;
  readonly blockNumber: number;
  readonly blockTimestamp: number;
  readonly deltaLeverage: bigint;
  readonly id: string;
  readonly originRequestKey: string;
  readonly positionKey: string;
  readonly requestKey: string;
  readonly sizeDelta: bigint;
  readonly subaccount: string;
  readonly trader: string;
  readonly traderPositionKey: string;
  readonly transactionCost: bigint;
  readonly transactionHash: string
};

export type RequestMirrorDecrease_indexedFieldOperations = { readonly blockTimestamp: whereOperations<RequestMirrorDecrease_t, number> };

export type RequestMirrorIncrease_t = {
  readonly allocation_id: id;
  readonly blockNumber: number;
  readonly blockTimestamp: number;
  readonly deltaLeverage: bigint;
  readonly id: string;
  readonly originRequestKey: string;
  readonly positionKey: string;
  readonly requestKey: string;
  readonly sizeDelta: bigint;
  readonly subaccount: string;
  readonly trader: string;
  readonly traderPositionKey: string;
  readonly transactionCost: bigint;
  readonly transactionHash: string
};

export type RequestMirrorIncrease_indexedFieldOperations = { readonly blockTimestamp: whereOperations<RequestMirrorIncrease_t, number> };

export type RequestPosition_t = {
  readonly acceptablePrice: bigint;
  readonly account: string;
  readonly callbackContract: string;
  readonly callbackGasLimit: bigint;
  readonly decreasePositionSwapType: bigint;
  readonly executionFee: bigint;
  readonly id: string;
  readonly initialCollateralDeltaAmount: bigint;
  readonly initialCollateralToken: string;
  readonly isFrozen: boolean;
  readonly isLong: boolean;
  readonly market: string;
  readonly minOutputAmount: bigint;
  readonly orderType: number;
  readonly receiver: string;
  readonly shouldUnwrapNativeToken: boolean;
  readonly sizeDeltaUsd: bigint;
  readonly swapPath: string[];
  readonly triggerPrice: bigint;
  readonly uiFeeReceiver: string;
  readonly updatedAtBlock: bigint
};

export type RequestPosition_indexedFieldOperations = {};

export type Settlement_t = {
  readonly allocated: bigint;
  readonly allocation_id: id;
  readonly blockNumber: number;
  readonly blockTimestamp: number;
  readonly collateralToken: string;
  readonly id: string;
  readonly matchKey: string;
  readonly matchRoute_id: id;
  readonly profit: bigint;
  readonly puppet: string;
  readonly puppetContribution: bigint;
  readonly settled: bigint;
  readonly traderPerformanceContribution: bigint;
  readonly transactionCost: bigint;
  readonly transactionHash: string
};

export type Settlement_indexedFieldOperations = { readonly blockTimestamp: whereOperations<Settlement_t, number>; readonly matchRoute_id: whereOperations<Settlement_t, id> };
