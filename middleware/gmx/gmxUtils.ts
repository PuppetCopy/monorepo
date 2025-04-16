import { easeInExpo, factor, formatFixed, getBasisPoints, getMappedValue, getPriceDelta, type ITokenDescription } from "../utils/index.js"
import * as viem from "viem"
import { MARKET_TOKEN_MAP } from "./marketMap.js"
import type { ILogEvent } from "./types.js"
import { BASIS_POINTS_DIVISOR, CHAIN_ADDRESS_MAP, CHAIN_NATIVE_DESCRIPTION, FUNDING_RATE_PRECISION, MARGIN_FEE_BASIS_POINTS, TOKEN_ADDRESS_DESCRIPTION_MAP } from "../const/index.js"


export function getPnL(isLong: boolean, entryPrice: bigint, priceChange: bigint, size: bigint) {
  if (size === 0n) {
    return 0n
  }

  const priceDelta = getPriceDelta(isLong, entryPrice, priceChange)
  return size * priceDelta / entryPrice
}


export function getDeltaPercentage(delta: bigint, collateral: bigint) {
  return factor(delta, collateral)
}

export function getNextAveragePrice(islong: boolean, size: bigint, nextPrice: bigint, pnl: bigint, sizeDelta: bigint) {
  const nextSize = size + sizeDelta
  const divisor = islong ? nextSize + pnl : nextSize + -pnl

  return nextPrice * nextSize / divisor
}


export function getMarginFees(size: bigint) {
  return size * MARGIN_FEE_BASIS_POINTS / BASIS_POINTS_DIVISOR
}




export function getFundingFee(entryFundingRate: bigint, cumulativeFundingRate: bigint, size: bigint) {
  if (size === 0n) {
    return 0n
  }

  const fundingRate = cumulativeFundingRate - entryFundingRate
  return size * fundingRate / FUNDING_RATE_PRECISION
}



export function liquidationWeight(isLong: boolean, liquidationPrice: bigint, markPrice: bigint) {
  const weight = isLong ? getBasisPoints(liquidationPrice, markPrice) : getBasisPoints(markPrice, liquidationPrice)
  const value = easeInExpo(formatFixed(4, weight))
  return value > 1 ? 1 : value
}


export function validateIdentityName(name: string) {
  if (typeof name === 'string' && name.startsWith('@') && !(/^@?(\w){1,15}$/.test(name))) {
    throw new Error('Invalid twitter handle')
  }

  if (typeof name !== 'string' || name.length > 15 || String(name).length < 4) {
    throw new Error('Invalid name')
  }

}

export function getMarketIndexToken(market: viem.Address) {
  return getMappedValue(MARKET_TOKEN_MAP, market)
}

export function getTokenDescription(token: viem.Address): ITokenDescription {
  return getMappedValue(TOKEN_ADDRESS_DESCRIPTION_MAP, token)
}


export function getNativeTokenDescription(chain: viem.Chain): ITokenDescription {
  return getMappedValue(CHAIN_NATIVE_DESCRIPTION, chain.id)
}

export function getNativeTokenAddress(chain: viem.Chain): viem.Address {
  return getMappedValue(CHAIN_ADDRESS_MAP, chain.id).NATIVE_TOKEN
}


export function orderEvents<T extends ILogEvent>(arr: T[]): T[] {
  return arr.sort((a, b) => {

    if (typeof b.blockNumber !== 'bigint') throw new Error('blockNumber is not a bigint')
    if (typeof b.transactionIndex !== 'number') throw new Error('transactionIndex is not a number')
    if (typeof b.logIndex !== 'number') throw new Error('logIndex is not a number')

    const order = a.blockNumber === b.blockNumber // same block?, compare transaction index
      ? a.transactionIndex === b.transactionIndex //same transaction?, compare log index
        ? a.logIndex - b.logIndex
        : a.transactionIndex - b.transactionIndex
      : Number(a.blockNumber - b.blockNumber) // compare block number

    return order
  }
  )
}


export function getEventOrderIdentifier<T extends ILogEvent>(idxObj: T): number {
  if (idxObj.blockNumber === null || idxObj.transactionIndex === null || idxObj.logIndex === null) throw new Error('blockNumber is null')
  return getblockOrderIdentifier(idxObj.blockNumber) + (idxObj.transactionIndex * 1000 + idxObj.logIndex)
}

export function getblockOrderIdentifier(blockNumber: bigint): number {
  return Number(blockNumber * 1000000n)
}

export function getPositionKey(account: viem.Address, market: viem.Address, collateralToken: viem.Address, isLong: boolean) {
  return hashData(
    ["address", "address", "address", "bool"],
    [account, market, collateralToken, isLong]
  )
}

export function getRuleKey(collateralToken: viem.Address, puppet: viem.Address, trader: viem.Address) {
  return hashData(
    ["address", "address", "address"],
    [collateralToken, puppet, trader]
  )
}

export function hashData(types: string[], values: any) {
  const params = viem.parseAbiParameters(types)
  const hex = viem.encodeAbiParameters(params as any, values)
  const bytes = viem.toBytes(hex)
  const hash = viem.keccak256(bytes)
  return hash
}


