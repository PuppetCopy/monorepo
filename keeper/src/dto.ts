import { getAddressItem, getAddressItemList, getBoolItem, getBytes32Item, getIntItem, getUintItem } from "./utils/gmx"
import { GMX_Event1 } from "./type"


export function createOraclePriceUpdate(event: GMX_Event1) {
    return {
        token: getAddressItem(event, 0),
        price: getUintItem(event, 1),
        timestamp: getUintItem(event, 2)
    }
}

export function createOrder(event: GMX_Event1) {
    return {
        account: getAddressItem(event, 0),
        receiver: getAddressItem(event, 1),
        callbackContract: getAddressItem(event, 2),
        uiFeeReceiver: getAddressItem(event, 3),
        market: getAddressItem(event, 4),
        initialCollateralToken: getAddressItem(event, 5),

        swapPath: getAddressItemList(event, 0),

        orderType: getUintItem(event, 0),
        decreasePositionSwapType: getUintItem(event, 1),
        sizeDeltaUsd: getUintItem(event, 2),
        initialCollateralDeltaAmount: getUintItem(event, 3),
        triggerPrice: getUintItem(event, 4),
        acceptablePrice: getUintItem(event, 5),
        executionFee: getUintItem(event, 6),
        callbackGasLimit: getUintItem(event, 7),
        minOutputAmount: getUintItem(event, 8),
        updatedAtBlock: getUintItem(event, 9),

        isLong: getBoolItem(event, 0),
        shouldUnwrapNativeToken: getBoolItem(event, 1),
        isFrozen: getBoolItem(event, 2),
        key: getBytes32Item(event, 0),
        id: getBytes32Item(event, 0)
    }
}

export function createOrderFrozen(event: GMX_Event1) {
    return {
        key: getBytes32Item(event, 0),
        account: getAddressItem(event, 0),
        reason: getBytes32Item(event, 0),
        reasonBytes: getBytes32Item(event, 0)
    }
}

export function createOrderCancelled(event: GMX_Event1) {

    return {
        key: getBytes32Item(event, 0),
        account: getAddressItem(event, 0),
        reason: getBytes32Item(event, 0),
        reasonBytes: getBytes32Item(event, 0)
    }
}

export function createPositionFeesCollected(event: GMX_Event1) {
    return {
        referralCode: getBytes32Item(event, 2),
        id: getBytes32Item(event, 0),
        positionKey: getBytes32Item(event, 1),
        affiliate: getAddressItem(event, 3),

        totalRebateFactor: getUintItem(event, 3),
        traderDiscountFactor: getUintItem(event, 4),
        totalRebateAmount: getUintItem(event, 5),
        traderDiscountAmount: getUintItem(event, 6),
        affiliateRewardAmount: getUintItem(event, 7),
        fundingFeeAmount: getUintItem(event, 8),
        claimableLongTokenAmount: getUintItem(event, 9),
        claimableShortTokenAmount: getUintItem(event, 10),
        latestFundingFeeAmountPerSize: getUintItem(event, 11),
        latestLongTokenClaimableFundingAmountPerSize: getUintItem(event, 12),
        latestShortTokenClaimableFundingAmountPerSize: getUintItem(event, 13),
        borrowingFeeUsd: getUintItem(event, 14),
        borrowingFeeAmount: getUintItem(event, 15),
        borrowingFeeReceiverFactor: getUintItem(event, 16),
        borrowingFeeAmountForFeeReceiver: getUintItem(event, 17),
        positionFeeFactor: getUintItem(event, 18),
        protocolFeeAmount: getUintItem(event, 19),
        positionFeeReceiverFactor: getUintItem(event, 20),
        feeReceiverAmount: getUintItem(event, 21),
        feeAmountForPool: getUintItem(event, 22),
        positionFeeAmountForPool: getUintItem(event, 23),
        positionFeeAmount: getUintItem(event, 24),
        totalCostAmount: getUintItem(event, 25),
        uiFeeReceiverFactor: getUintItem(event, 26),
        uiFeeAmount: getUintItem(event, 27),
    }
}

export function createPositionIncrease(event: GMX_Event1) {
    return {
        id: getBytes32Item(event, 0),
        positionKey: getBytes32Item(event, 1),
        account: getAddressItem(event, 0),
        market: getAddressItem(event, 1),
        collateralToken: getAddressItem(event, 2),

        sizeInUsd: getUintItem(event, 0),
        sizeInTokens: getUintItem(event, 1),
        collateralAmount: getUintItem(event, 2),
        borrowingFactor: getUintItem(event, 3),
        fundingFeeAmountPerSize: getUintItem(event, 4),
        longTokenClaimableFundingAmountPerSize: getUintItem(event, 5),
        shortTokenClaimableFundingAmountPerSize: getUintItem(event, 6),
        executionPrice: getUintItem(event, 7),
        indexTokenPriceMax: getUintItem(event, 8),
        indexTokenPriceMin: getUintItem(event, 9),
        collateralTokenPriceMax: getUintItem(event, 10),
        collateralTokenPriceMin: getUintItem(event, 11),
        sizeDeltaInUsd: getUintItem(event, 12),
        sizeDeltaInTokens: getUintItem(event, 13),
        orderType: getUintItem(event, 14),
        increasedAtTime: getUintItem(event, 15),

        collateralDeltaAmount: getIntItem(event, 0),
        priceImpactUsd: getIntItem(event, 1),
        priceImpactAmount: getIntItem(event, 2),

        isLong: getBoolItem(event, 0),
    }
}

export function createPositionDecrease(event: GMX_Event1) {
    return {
        id: getBytes32Item(event, 0),
        account: getAddressItem(event, 0),
        market: getAddressItem(event, 1),
        collateralToken: getAddressItem(event, 2),
        positionKey: getBytes32Item(event, 1),

        sizeInUsd: getUintItem(event, 0),
        sizeInTokens: getUintItem(event, 1),
        collateralAmount: getUintItem(event, 2),
        borrowingFactor: getUintItem(event, 3),
        fundingFeeAmountPerSize: getUintItem(event, 4),
        longTokenClaimableFundingAmountPerSize: getUintItem(event, 5),
        shortTokenClaimableFundingAmountPerSize: getUintItem(event, 6),
        executionPrice: getUintItem(event, 7),
        indexTokenPriceMax: getUintItem(event, 8),
        indexTokenPriceMin: getUintItem(event, 9),
        collateralTokenPriceMax: getUintItem(event, 10),
        collateralTokenPriceMin: getUintItem(event, 11),
        sizeDeltaUsd: getUintItem(event, 12),
        sizeDeltaInTokens: getUintItem(event, 13),
        collateralDeltaAmount: getUintItem(event, 14),
        valuesPriceImpactDiffUsd: getUintItem(event, 15),
        orderType: getUintItem(event, 16),
        decreasedAtTime: getUintItem(event, 17),

        priceImpactUsd: getIntItem(event, 0),
        basePnlUsd: getIntItem(event, 1),
        uncappedBasePnlUsd: getIntItem(event, 2),

        isLong: getBoolItem(event, 0)
    }
}