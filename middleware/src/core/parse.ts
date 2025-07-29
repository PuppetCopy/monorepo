import { BASIS_POINTS_DIVISOR } from '../const/common.js'
import type { ITokenDescription } from './types.js'

export const VALID_FRACTIONAL_NUMBER_REGEXP = /^-?(0|[1-9]\d*)(\.\d+)?$/

// Constant to pull zeros from for multipliers
let zeros = '0'
while (zeros.length < 256) {
  zeros += zeros
}

function getMultiplier(decimals: number): string {
  if (decimals >= 0 && decimals <= 256 && !(decimals % 1)) {
    return `1${zeros.substring(0, decimals)}`
  }

  throw new Error('invalid decimal size')
}

export function formatFixed(decimals: number, value: bigint): number {
  const multiplier = getMultiplier(decimals)
  const multiplierBn = BigInt(multiplier)
  let parsedValue = ''

  const negative = value < 0n
  if (negative) {
    value *= -1n
  }

  let fraction = (value % multiplierBn).toString()

  while (fraction.length < multiplier.length - 1) {
    fraction = `0${fraction}`
  }

  const matchFractions = fraction.match(/^([0-9]*[1-9]|0)(0*)/)

  if (matchFractions) {
    fraction = matchFractions[1]
  }

  const whole = (value / multiplierBn).toString()

  parsedValue = `${whole}.${fraction}`

  if (negative) {
    parsedValue = `-${parsedValue}`
  }

  return Number(parsedValue)
}

export function parseFixed(decimals: number, input: string | number) {
  let value = typeof input === 'number' ? String(input) : input

  const multiplier = getMultiplier(decimals)
  const multiplierLength = multiplier.length

  if (!VALID_FRACTIONAL_NUMBER_REGEXP.test(value)) {
    throw new Error('invalid fractional value')
  }

  if (multiplier.length - 1 === 0) {
    return BigInt(value)
  }

  const negative = value.substring(0, 1) === '-'
  if (negative) {
    value = value.substring(1)
  }
  const comps = value.split('.')

  let whole = comps[0]
  let fraction = comps[1]

  if (!whole) {
    whole = '0'
  }
  if (!fraction) {
    fraction = '0'
  }

  // Prevent underflow
  if (fraction.length > multiplierLength - 1) {
    throw new Error('fractional component exceeds decimals')
  }

  // Fully pad the string with zeros to get to wei
  while (fraction.length < multiplierLength - 1) {
    fraction += '0'
  }

  const wholeValue = BigInt(whole)
  const fractionValue = BigInt(fraction)

  const wei = wholeValue * BigInt(multiplier) + fractionValue

  return negative ? -wei : wei
}

export function parseBps(a: number | string): bigint {
  return parseFixed(4, a)
}

export function getDenominator(decimals: number) {
  return 10n ** BigInt(decimals)
}

export function expandDecimals(n: bigint, decimals: number) {
  return n * getDenominator(decimals)
}

export function getTokenDenominatedAmount(tokenDEsc: ITokenDescription, amount: number) {
  return getDenominator(tokenDEsc.decimals) * BigInt(amount)
}

export function formatDiv(a: bigint, b: bigint): number {
  return formatFixed(4, (a * BASIS_POINTS_DIVISOR) / b)
}
