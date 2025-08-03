import { map, op, replayState } from 'aelea/stream'
import type { Address } from 'viem/accounts'
import { FLOAT_PRECISION } from '../const/common.js'
import { abs, delta } from '../core/math.js'
import { getDenominator } from '../core/parse.js'
import { periodicRun } from '../core/stream/recover.js'
import { groupArrayByKeyMap } from '../core/utils.js'
import { getTokenDescription } from './gmxUtils.js'
import type { IMinMax, IOraclePrice, ISimpleOraclePrice } from './types.js'

export function getPriceImpactUsd(
  currentLongUsd: bigint,
  currentShortUsd: bigint,
  nextLongUsd: bigint,
  nextShortUsd: bigint,
  factorPositive: bigint,
  factorNegative: bigint,
  exponentFactor: bigint
) {
  if (nextLongUsd < 0n || nextShortUsd < 0n) {
    return 0n
  }

  const currentDiff = delta(currentLongUsd, currentShortUsd)
  const nextDiff = delta(nextLongUsd, nextShortUsd)

  const isSameSideRebalance = currentLongUsd < currentShortUsd === nextLongUsd < nextShortUsd

  if (isSameSideRebalance) {
    const hasPositiveImpact = nextDiff < currentDiff
    const factor = hasPositiveImpact ? factorPositive : factorNegative

    return calculateImpactForSameSideRebalance(currentDiff, nextDiff, hasPositiveImpact, factor, exponentFactor)
  }

  return calculateImpactForCrossoverRebalance(currentDiff, nextDiff, factorPositive, factorNegative, exponentFactor)
}

export function calculateImpactForSameSideRebalance(
  currentDiff: bigint,
  nextDiff: bigint,
  hasPositiveImpact: boolean,
  factor: bigint,
  exponentFactor: bigint
) {
  const currentImpact = applyImpactFactor(currentDiff, factor, exponentFactor)
  const nextImpact = applyImpactFactor(nextDiff, factor, exponentFactor)

  const deltaDiff = abs(currentImpact - nextImpact)

  return hasPositiveImpact ? deltaDiff : 0n - deltaDiff
}

export function calculateImpactForCrossoverRebalance(
  currentDiff: bigint,
  nextDiff: bigint,
  factorPositive: bigint,
  factorNegative: bigint,
  exponentFactor: bigint
) {
  const positiveImpact = applyImpactFactor(currentDiff, factorPositive, exponentFactor)
  const negativeImpactUsd = applyImpactFactor(nextDiff, factorNegative, exponentFactor)

  const deltaDiffUsd = abs(positiveImpact - negativeImpactUsd)

  return positiveImpact > negativeImpactUsd ? deltaDiffUsd : 0n - deltaDiffUsd
}

// export function getCappedPositionImpactUsd(
//   marketPrice: IMarketPrice,
//   marketPoolInfo: IMarketInfo,
//   sizeDeltaUsd: bigint,
//   isLong: boolean
// ) {
//   const priceImpactDeltaUsd = getPriceImpactForPosition(marketPoolInfo, sizeDeltaUsd, isLong)

//   if (priceImpactDeltaUsd < 0n) return priceImpactDeltaUsd

//   const impactPoolAmount = marketPoolInfo.usage.positionImpactPoolAmount

//   const maxPriceImpactUsdBasedOnImpactPool = getTokenUsd(marketPrice.indexTokenPrice.min, impactPoolAmount)

//   let cappedImpactUsd = priceImpactDeltaUsd

//   if (cappedImpactUsd > maxPriceImpactUsdBasedOnImpactPool) {
//     cappedImpactUsd = maxPriceImpactUsdBasedOnImpactPool
//   }

//   const maxPriceImpactFactor = marketPoolInfo.config.maxPositionImpactFactorPositive
//   const maxPriceImpactUsdBasedOnMaxPriceImpactFactor = applyFactor(abs(sizeDeltaUsd), maxPriceImpactFactor)

//   if (cappedImpactUsd > maxPriceImpactUsdBasedOnMaxPriceImpactFactor) {
//     cappedImpactUsd = maxPriceImpactUsdBasedOnMaxPriceImpactFactor
//   }

//   return cappedImpactUsd
// }

// export function getPriceImpactForPosition(marketInfo: IMarketInfo, sizeDeltaUsd: bigint, isLong: boolean) {
//   const longInterestInUsd = marketInfo.usage.longInterestUsd
//   const shortInterestInUsd = marketInfo.usage.shortInterestUsd

//   const nextLongUsd = longInterestInUsd + (isLong ? sizeDeltaUsd : 0n)
//   const nextShortUsd = shortInterestInUsd + (isLong ? 0n : sizeDeltaUsd)

//   const priceImpactUsd = getPriceImpactUsd(
//     longInterestInUsd,
//     shortInterestInUsd,
//     nextLongUsd,
//     nextShortUsd,
//     marketInfo.config.positionImpactFactorPositive,
//     marketInfo.config.positionImpactFactorNegative,
//     marketInfo.config.positionImpactExponentFactor
//   )

//   if (priceImpactUsd > 0n) {
//     return priceImpactUsd
//   }

//   if (!(abs(marketInfo.fees.virtualInventory.virtualInventoryForPositions) > 0n)) {
//     return priceImpactUsd
//   }

//   const virtualInventoryParams = getNextOpenInterestForVirtualInventory(
//     marketInfo.fees.virtualInventory.virtualInventoryForPositions,
//     sizeDeltaUsd,
//     isLong
//   )

//   const priceImpactUsdForVirtualInventory = getPriceImpactUsd(
//     longInterestInUsd,
//     shortInterestInUsd,
//     virtualInventoryParams.nextLongUsd,
//     virtualInventoryParams.nextShortUsd,
//     marketInfo.config.positionImpactFactorPositive,
//     marketInfo.config.positionImpactFactorNegative,
//     marketInfo.config.positionImpactExponentFactor
//   )

//   return priceImpactUsdForVirtualInventory < priceImpactUsd ? priceImpactUsdForVirtualInventory : priceImpactUsd
// }

export function getMarkPrice(price: IMinMax, isIncrease: boolean, isLong: boolean) {
  const shouldUseMaxPrice = getShouldUseMaxPrice(isIncrease, isLong)

  return shouldUseMaxPrice ? price.max : price.min
}

function getNextOpenInterestForVirtualInventory(virtualInventory: bigint, deltaUsd: bigint, isLong: boolean) {
  let currentLongUsd = 0n
  let currentShortUsd = 0n

  if (virtualInventory > 0n) {
    currentShortUsd = virtualInventory
  } else {
    currentLongUsd = virtualInventory * -1n
  }

  if (deltaUsd < 0n) {
    const offset = abs(deltaUsd)
    currentLongUsd = currentLongUsd + offset
    currentShortUsd = currentShortUsd + offset
  }

  return getNextOpenInterestParams(currentLongUsd, currentShortUsd, deltaUsd, isLong)
}

function getNextOpenInterestParams(currentLongUsd: bigint, currentShortUsd: bigint, usdDelta: bigint, isLong: boolean) {
  let nextLongUsd = currentLongUsd
  let nextShortUsd = currentShortUsd

  if (isLong) {
    nextLongUsd = currentLongUsd + usdDelta
  } else {
    nextShortUsd = currentShortUsd + usdDelta
  }

  return {
    currentLongUsd,
    currentShortUsd,
    nextLongUsd,
    nextShortUsd
  }
}

export function getOraclePriceUsd(price: IOraclePrice, isLong: boolean, maximize = false) {
  const pickedPrice = pickPriceForPnl(price, isLong, maximize)
  const desc = getTokenDescription(price.token)

  return pickedPrice * getDenominator(desc.decimals)
}

export function getPriceUsd(price: IOraclePrice, isLong: boolean, maximize = false) {
  const pickedPrice = pickPriceForPnl(price, isLong, maximize)
  const desc = getTokenDescription(price.token)

  return pickedPrice * getDenominator(desc.decimals)
}

// @dev pick the min or max price depending on whether it is for a long or short position
// and whether the pending pnl should be maximized or not
function pickPriceForPnl(price: IOraclePrice, isLong: boolean, maximize: boolean) {
  // for long positions, pick the larger price to maximize pnl
  // for short positions, pick the smaller price to maximize pnl
  if (isLong) {
    return maximize ? price.max : price.min
  }

  return maximize ? price.min : price.max
}

export function getPriceImpactByAcceptablePrice(
  sizeDeltaUsd: bigint,
  acceptablePrice: bigint,
  indexPrice: bigint,
  isLong: boolean,
  isIncrease: boolean
) {
  const shouldFlipPriceDiff = isIncrease ? !isLong : isLong
  const priceDiff = (indexPrice - acceptablePrice) * (shouldFlipPriceDiff ? -1n : 1n)
  const priceImpactDeltaUsd = (sizeDeltaUsd * priceDiff) / acceptablePrice
  const priceImpactDeltaAmount = priceImpactDeltaUsd / indexPrice

  return {
    priceImpactDeltaUsd,
    priceImpactDeltaAmount
  }
}

export function getShouldUseMaxPrice(isIncrease: boolean, isLong: boolean) {
  return isIncrease ? isLong : !isLong
}

function applyImpactFactor(diff: bigint, factor: bigint, exponent: bigint): bigint {
  const _diff = Number(diff) / 10 ** 30
  const _exponent = Number(exponent) / 10 ** 30

  // Pow and convert back to BigNumber with 30 decimals
  const result = BigInt(Math.round(_diff ** _exponent * 10 ** 30))

  return (result * factor) / FLOAT_PRECISION
}

// Signed Prices from GMX API
// Arbitrum URL: https://arbitrum-api.gmxinfra.io/signed_prices/latest
// Avalanche URL: https://avalanche-api.gmxinfra.io/signed_prices/latest
export interface IGmxSignedPriceData {
  id: string // "4003688959"
  minBlockNumber: number // null
  minBlockHash: string | null // null
  oracleDecimals: number | null // null
  tokenSymbol: string // "ETH"
  tokenAddress: Address // "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
  minPrice: number | null // null
  maxPrice: number | null // null
  signer: string | null // null
  signature: string | null // null
  signatureWithoutBlockHash: string | null // null
  createdAt: string // "2025-07-28T19:30:24.419Z"
  minBlockTimestamp: number | null // 1753731023 (seconds - Unix timestamp)
  oracleKeeperKey: string // "realtimeFeed"
  maxBlockTimestamp: number // 1753731023 (seconds - Unix timestamp)
  maxBlockNumber: number // null
  maxBlockHash: string // null
  maxPriceFull: string // "3791200513446191" (price with full precision)
  minPriceFull: string // "3791014710710536" (price with full precision)
  oracleKeeperRecordId: string | null // null
  oracleKeeperFetchType: string // "ws"
  oracleType: string // "realtimeFeed2"
  blob: string // "0x00094baebfda9b87..." (binary data)
}

export async function querySignedPrices(): Promise<IGmxSignedPriceData[]> {
  try {
    const response = await fetch('https://arbitrum-api.gmxinfra.io/signed_prices/latest')

    if (!response.ok) {
      throw new Error(`GMX signed prices API error! status: ${response.status}`)
    }

    const data = (await response.json()) as { signedPrices: IGmxSignedPriceData[] }
    return data.signedPrices || []
  } catch (error) {
    console.error('Error fetching GMX signed prices:', error)
    return []
  }
}

export const latestPriceMap = op(
  periodicRun({
    startImmediate: true,
    interval: 2500,
    actionOp: map(async () => {
      const newLocal = await querySignedPrices()
      return groupArrayByKeyMap(
        newLocal,
        (item) => item.tokenAddress,
        (item): ISimpleOraclePrice => {
          const timestampMs = (item.minBlockTimestamp || item.maxBlockTimestamp) * 1000
          return {
            source: 'GMX API',
            token: item.tokenAddress,
            min: BigInt(item.minPriceFull),
            max: BigInt(item.maxPriceFull),
            timestamp: timestampMs
          }
        }
      )
    })
  }),
  replayState
)
