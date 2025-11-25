import type { Hex } from 'viem'
import type { Address } from 'viem/accounts'
import { encodeAbiParameters, getAddress, keccak256, parseAbiParameters, toBytes } from 'viem/utils'
import { FUNDING_RATE_PRECISION } from '../const/common.js'
import { TOKEN_ADDRESS_DESCRIPTION_MAP } from '../const/token.js'
import { factor, toBasisPoints } from '../core/math.js'
import { formatFixed } from '../core/parse.js'
import type { IMarketDescription, ITokenDescription } from '../core/types.js'
import { easeInExpo, getMappedValue } from '../core/utils.js'
import { ARBITRUM_MARKET_LIST } from '../generated/marketList.js'
import { MARKET_ADDRESS_DESCRIPTION_MAP } from './market.js'

export function getPnL(isLong: boolean, entryPrice: bigint, priceChange: bigint, size: bigint) {
  if (size === 0n) {
    return 0n
  }

  const priceDelta = isLong ? priceChange - entryPrice : entryPrice - priceChange
  return (size * priceDelta) / entryPrice
}

export function getDeltaPercentage(delta: bigint, collateral: bigint) {
  return factor(delta, collateral)
}

export function getNextAveragePrice(islong: boolean, size: bigint, nextPrice: bigint, pnl: bigint, sizeDelta: bigint) {
  const nextSize = size + sizeDelta
  const divisor = islong ? nextSize + pnl : nextSize + -pnl

  return (nextPrice * nextSize) / divisor
}

export function getFundingFee(entryFundingRate: bigint, cumulativeFundingRate: bigint, size: bigint) {
  if (size === 0n) {
    return 0n
  }

  const fundingRate = cumulativeFundingRate - entryFundingRate
  return (size * fundingRate) / FUNDING_RATE_PRECISION
}

export function liquidationWeight(isLong: boolean, liquidationPrice: bigint, markPrice: bigint) {
  const weight = isLong ? toBasisPoints(liquidationPrice, markPrice) : toBasisPoints(markPrice, liquidationPrice)
  const value = easeInExpo(formatFixed(4, weight))
  return value > 1 ? 1 : value
}

export function validateIdentityName(name: string) {
  if (typeof name === 'string' && name.startsWith('@') && !/^@?(\w){1,15}$/.test(name)) {
    throw new Error('Invalid twitter handle')
  }

  if (typeof name !== 'string' || name.length > 15 || String(name).length < 4) {
    throw new Error('Invalid name')
  }
}

export function getTokenDescription(token: Address): ITokenDescription {
  const normalizedToken = getAddress(token)
  return getMappedValue(TOKEN_ADDRESS_DESCRIPTION_MAP, normalizedToken)
}

export function getMarketDescription(market: Address): IMarketDescription {
  const normalizedMarket = getAddress(market)
  return getMappedValue(
    MARKET_ADDRESS_DESCRIPTION_MAP,
    normalizedMarket as keyof typeof MARKET_ADDRESS_DESCRIPTION_MAP
  ) as IMarketDescription
}

export function getMarketDescriptionByToken(tokenAddress: Address): IMarketDescription[] {
  const normalizedAddress = getAddress(tokenAddress)

  return ARBITRUM_MARKET_LIST.filter(market => {
    const indexToken = market.indexToken ? getAddress(market.indexToken) : null
    const longToken = getAddress(market.longToken)
    const shortToken = getAddress(market.shortToken)

    return normalizedAddress === indexToken || normalizedAddress === longToken || normalizedAddress === shortToken
  })
}

export function getblockOrderIdentifier(blockNumber: bigint): number {
  return Number(blockNumber * 1000000n)
}

export function getPositionKey(account: Address, market: Address, collateralToken: Address, isLong: boolean) {
  return hashData(['address', 'address', 'address', 'bool'], [account, market, collateralToken, isLong])
}

export function getPositionSizeInUsdKey(positionKey: Hex) {
  return keccak256(encodeAbiParameters([{ type: 'bytes32' }, { type: 'string' }], [positionKey, 'SIZE_IN_USD']))
}
export function getPositionCollateralAmountKey(positionKey: Hex) {
  return keccak256(encodeAbiParameters([{ type: 'bytes32' }, { type: 'string' }], [positionKey, 'COLLATERAL_AMOUNT']))
}

export function hashData(types: string[], values: (string | number | bigint | boolean)[]) {
  const params = parseAbiParameters(types)
  const hex = encodeAbiParameters(params as any, values)
  const bytes = toBytes(hex)
  const hash = keccak256(bytes)
  return hash
}

export function hashString(string: string) {
  return hashData(['string'], [string])
}
