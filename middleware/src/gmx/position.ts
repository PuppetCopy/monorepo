import { BASIS_POINTS_DIVISOR } from '../const/index.js'

export function getPositionPnlUsd(isLong: boolean, sizeInUsd: bigint, sizeInTokens: bigint, markPrice: bigint) {
  const positionValueUsd = markPrice * sizeInTokens
  const totalPnl = isLong ? positionValueUsd - sizeInUsd : sizeInUsd - positionValueUsd

  return totalPnl
}

// export function getCappedPositionPnlUsd(
//   marketPrice: IMarketPrice,
//   marketInfo: IMarketInfo,
//   isLong: boolean,
//   sizeInUsd: bigint,
//   sizeInTokens: bigint,
//   markPrice: bigint
// ) {
//   const totalPnl = getPositionPnlUsd(isLong, sizeInUsd, sizeInTokens, markPrice)

//   if (totalPnl <= 0n) return totalPnl

//   const poolPnl = isLong ? marketInfo.pool.longPnl : marketInfo.pool.shortPnl
//   const poolUsd = getPoolUsdWithoutPnl(marketPrice, marketInfo, isLong, false)
//   const cappedPnl = getCappedPoolPnl(marketInfo, poolUsd, isLong)

//   if (cappedPnl !== poolPnl && cappedPnl > 0n && poolPnl > 0n) {
//     return (totalPnl * (cappedPnl / WEI_PRECISION)) / (poolPnl / WEI_PRECISION)
//   }

//   return totalPnl
// }

// export function getCappedPoolPnl(marketInfo: IMarketInfo, poolUsd: bigint, isLong: boolean) {
//   // maximize: boolean
//   const poolPnl = isLong ? marketInfo.pool.longPnl : marketInfo.pool.shortPnl

//   if (poolPnl <= 0n) return poolPnl

//   const maxPnlFactor = isLong
//     ? marketInfo.config.maxPnlFactorForTradersLong
//     : marketInfo.config.maxPnlFactorForTradersShort

//   const maxPnl = applyFactor(poolUsd, maxPnlFactor)

//   return poolPnl > maxPnl ? maxPnl : poolPnl
// }

// const FLOAT_PRECISION_SQRT = 10n ** 15n

// export function getFundingAmount(
//   latestFundingAmountPerSize: bigint,
//   positionFundingAmountPerSize: bigint,
//   positionSizeInUsd: bigint
// ): bigint {
//   // a user could avoid paying funding fees by continually updating the position
//   // before the funding fee becomes large enough to be chargeable
//   // to avoid this, funding fee amounts should be rounded up
//   //
//   // this could lead to large additional charges if the token has a low number of decimals
//   // or if the token's value is very high, so care should be taken to inform users of this
//   //
//   // if the calculation is for the claimable amount, the amount should be rounded down instead

//   // divide the result by Precision.FLOAT_PRECISION * Precision.FLOAT_PRECISION_SQRT as the fundingAmountPerSize values
//   // are stored based on FLOAT_PRECISION_SQRT values

//   const fundingDiffFactor = latestFundingAmountPerSize - positionFundingAmountPerSize

//   const denominator = FLOAT_PRECISION * FLOAT_PRECISION_SQRT
//   return (positionSizeInUsd * fundingDiffFactor) / denominator
// }

// export function getPositionFundingFees(positionFees: IPositionFees, position: IPositionNumbers) {
//   const fundingFeeAmount = getFundingAmount(
//     positionFees.funding.latestFundingFeeAmountPerSize,
//     position.fundingFeeAmountPerSize,
//     position.sizeInUsd
//   )

//   const claimableLongTokenAmount = getFundingAmount(
//     positionFees.funding.latestLongTokenClaimableFundingAmountPerSize,
//     position.longTokenClaimableFundingAmountPerSize,
//     position.sizeInUsd
//   )

//   const claimableShortTokenAmount = getFundingAmount(
//     positionFees.funding.latestShortTokenClaimableFundingAmountPerSize,
//     position.shortTokenClaimableFundingAmountPerSize,
//     position.sizeInUsd
//   )

//   return { fundingFeeAmount, claimableLongTokenAmount, claimableShortTokenAmount }
// }

// export function getMarginFee(marketInfo: IMarketInfo, forPositiveImpact: boolean, sizeDeltaUsd: bigint) {
//   if (sizeDeltaUsd <= 0n) return 0n

//   const factor = forPositiveImpact
//     ? marketInfo.config.positionFeeFactorForPositiveImpact
//     : marketInfo.config.positionFeeFactorForNegativeImpact

//   return -applyFactor(sizeDeltaUsd, factor)
// }

// export function getRebateRewardUsd(marginFeeUsd: bigint, referralInfo?: PositionReferralFees) {
//   if (referralInfo === undefined) {
//     return 0n
//   }

//   const totalRebateUsd = applyFactor(marginFeeUsd, referralInfo.totalRebateFactor)
//   const discountUsd = applyFactor(totalRebateUsd, referralInfo.traderDiscountFactor)

//   return discountUsd
// }

export function getPositionNetValue(
  collateralUsd: bigint,
  pendingFundingFeesUsd: bigint,
  pendingBorrowingFeesUsd: bigint,
  pnl: bigint,
  closingFeeUsd: bigint
) {
  const pendingFeesUsd = pendingFundingFeesUsd + pendingBorrowingFeesUsd

  return collateralUsd - pendingFeesUsd - closingFeeUsd + pnl
}

// export function getLiquidationPrice(
//   marketInfo: IMarketInfo,
//   isLong: boolean,
//   collateralToken: Address,
//   indexToken: Address,

//   sizeInTokens: bigint,
//   sizeInUsd: bigint,

//   collateralAmount: bigint,
//   collateralUsd: bigint,

//   pendingFundingFeesUsd = 0n,
//   pendingBorrowingFeesUsd = 0n,
//   // minCollateralUsd: bigint,
//   useMaxPriceImpact = true
// ) {
//   if (sizeInUsd <= 0n) return 0n

//   const closingFeeUsd = getMarginFee(marketInfo, false, sizeInUsd)
//   const totalPendingFeesUsd = pendingFundingFeesUsd + pendingBorrowingFeesUsd
//   const totalFeesUsd = totalPendingFeesUsd + closingFeeUsd

//   const maxNegativePriceImpactUsd = -applyFactor(sizeInUsd, marketInfo.config.maxPositionImpactFactorForLiquidations)

//   let priceImpactDeltaUsd = 0n

//   if (useMaxPriceImpact) {
//     priceImpactDeltaUsd = maxNegativePriceImpactUsd
//   } else {
//     priceImpactDeltaUsd = getPriceImpactForPosition(marketInfo, -sizeInUsd, isLong)

//     if (priceImpactDeltaUsd < maxNegativePriceImpactUsd) {
//       priceImpactDeltaUsd = maxNegativePriceImpactUsd
//     }

//     // Ignore positive price impact
//     if (priceImpactDeltaUsd > 0n) {
//       priceImpactDeltaUsd = 0n
//     }
//   }

//   const liquidationCollateralUsd = applyFactor(sizeInUsd, marketInfo.config.minCollateralFactor)
//   // if (liquidationCollateralUsd < minCollateralUsd) {
//   //   liquidationCollateralUsd = minCollateralUsd
//   // }

//   let liquidationPrice = 0n

//   const indexTokenDescription = getTokenDescription(indexToken)
//   const indexTokenDenominator = getDenominator(indexTokenDescription.decimals)

//   if (collateralToken === indexToken) {
//     if (isLong) {
//       const denominator = sizeInTokens + collateralAmount
//       if (denominator === 0n) return 0n

//       liquidationPrice =
//         ((sizeInUsd + liquidationCollateralUsd - priceImpactDeltaUsd + totalFeesUsd) / denominator) *
//         indexTokenDenominator
//     } else {
//       const denominator = sizeInTokens - collateralAmount
//       if (denominator === 0n) return 0n

//       liquidationPrice =
//         ((sizeInUsd - liquidationCollateralUsd + priceImpactDeltaUsd - totalFeesUsd) / denominator) *
//         indexTokenDenominator
//     }
//   } else {
//     if (sizeInTokens === 0n) return 0n
//     const remainingCollateralUsd = collateralUsd + priceImpactDeltaUsd - totalPendingFeesUsd - closingFeeUsd

//     if (isLong) {
//       liquidationPrice =
//         ((liquidationCollateralUsd - remainingCollateralUsd + sizeInUsd) / sizeInTokens) * indexTokenDenominator
//     } else {
//       liquidationPrice =
//         ((liquidationCollateralUsd - remainingCollateralUsd - sizeInUsd) / -sizeInTokens) * indexTokenDenominator
//     }
//   }

//   if (liquidationPrice <= 0n) return 0n

//   return liquidationPrice
// }

export function getRoughLiquidationPrice(
  isLong: boolean,
  sizeInUsd: bigint,
  sizeInTokens: bigint,
  collateralUsd: bigint,
  collateralAmount: bigint
) {
  return isLong
    ? (sizeInUsd + collateralUsd) / (sizeInTokens + collateralAmount)
    : (sizeInUsd - collateralUsd) / (sizeInTokens - collateralAmount)
}

export function getLeverageFactor(
  sizeInUsd: bigint,
  collateralUsd: bigint,
  pnl: bigint,
  pendingFundingFeesUsd: bigint,
  pendingBorrowingFeesUsd: bigint
) {
  const totalPendingFeesUsd = pendingFundingFeesUsd + pendingBorrowingFeesUsd
  const remainingCollateralUsd = collateralUsd + pnl - totalPendingFeesUsd

  return (sizeInUsd * BASIS_POINTS_DIVISOR) / remainingCollateralUsd
}
