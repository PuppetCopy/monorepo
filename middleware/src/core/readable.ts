import { curry2 } from 'aelea/stream'
import { BASIS_POINTS_DIVISOR } from '../const/common.js'
import { formatFixed } from './parse.js'
import type { ITokenDescription } from './types.js'
import { getTokenAmount } from './utils.js'

export const readableAccountingNumber: Intl.NumberFormatOptions = { maximumFractionDigits: 2, minimumFractionDigits: 2 }
export const readableLargeNumber: Intl.NumberFormatOptions = { maximumFractionDigits: 0 }
export const readableTinyNumber: Intl.NumberFormatOptions = { maximumSignificantDigits: 2, minimumSignificantDigits: 2 }

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options
export const readableNumber = curry2((formatOptions: Intl.NumberFormatOptions, ammount: number | bigint) => {
  const absAmount = Math.abs(Number(ammount))
  const digitOptions =
    absAmount >= 1000 ? readableLargeNumber : absAmount >= 1 ? readableAccountingNumber : readableTinyNumber

  return Intl.NumberFormat('en-US', { ...digitOptions, ...formatOptions }).format(ammount)
})

export const readableUnitAmount = readableNumber({})
export const readableAccountingAmount = readableNumber(readableAccountingNumber)
export const readableUSD = readableNumber({})
export const readablePercentage = (amount: bigint) => `${readableUnitAmount(formatFixed(2, amount))}%`
export const readableFactorPercentage = (amount: bigint) => `${readableUnitAmount(formatFixed(30, amount) * 100)}%`
export const readableLeverage = (a: bigint, b: bigint) =>
  `${b ? readableUnitAmount(formatFixed(4, (a * BASIS_POINTS_DIVISOR) / b)) : 0n}x`
export const readableUsd = (ammount: bigint) => readableUSD(formatFixed(30, ammount))
export const readablePnl = (ammount: bigint, decimals = 30) =>
  readableNumber({ signDisplay: 'exceptZero' })(formatFixed(decimals, ammount))
export const readableTokenAmountFromUsdAmount = (decimals: number, price: bigint, amount: bigint) =>
  readableUnitAmount(formatFixed(decimals, getTokenAmount(price, amount)))
export const readableTokenUsd = (price: bigint, amount: bigint) => readableUsd(price * amount)
export const readableTokenAmount = (tokenDesc: ITokenDescription, amount: bigint) =>
  readableUnitAmount(formatFixed(tokenDesc.decimals, amount))
export const readableTokenAmountLabel = (tokenDesc: ITokenDescription, amount: bigint) =>
  `${readableTokenAmount(tokenDesc, amount)} ${tokenDesc.symbol}`
export const readableTokenPrice = (decimals: number, amount: bigint) =>
  readableAccountingAmount(formatFixed(30 - decimals, amount))

const UNITS = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte']
const BYTES_PER_KB = 1000

export function readableFileSize(sizeBytes: number | bigint): string {
  let size = Math.abs(Number(sizeBytes))

  let u = 0
  while (size >= BYTES_PER_KB && u < UNITS.length - 1) {
    size /= BYTES_PER_KB
    ++u
  }

  return new Intl.NumberFormat([], {
    style: 'unit',
    unit: UNITS[u],
    unitDisplay: 'short',
    maximumFractionDigits: 1
  }).format(size)
}

export function parseReadableNumber(stringNumber: string, locale?: Intl.NumberFormatOptions) {
  const thousandSeparator = Intl.NumberFormat('en-US', locale)
    .format(11111)
    .replace(/\p{Number}/gu, '')
  const decimalSeparator = Intl.NumberFormat('en-US', locale)
    .format(1.1)
    .replace(/\p{Number}/gu, '')

  const parsed = Number.parseFloat(
    stringNumber
      .replace(new RegExp(`\\${thousandSeparator}`, 'g'), '')
      .replace(new RegExp(`\\${decimalSeparator}`), '.')
  )
  return parsed
}
