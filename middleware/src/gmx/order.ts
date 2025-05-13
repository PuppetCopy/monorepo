import type { Address } from 'viem/accounts'
import type { Chain } from 'viem/chains'
import { ADDRESS_ZERO, TOKEN_ADDRESS_DESCRIPTION_MAP } from '../const/index.js'
import { getDenominator, getSafeMappedValue } from '../utils/utils.js'
import { getNativeTokenAddress } from './gmxUtils.js'

export function resolveAddress<TChain extends Chain>(chain: TChain, indexToken: Address): Address {
  if (indexToken === ADDRESS_ZERO) {
    return getNativeTokenAddress(chain)
  }

  const contractAddressMap = getSafeMappedValue(TOKEN_ADDRESS_DESCRIPTION_MAP, indexToken, indexToken as any)

  if (contractAddressMap === null) {
    throw new Error(`Token ${indexToken} does not exist`)
  }

  return indexToken
}

export function adjustForDecimals(amount: bigint, divDecimals: number, mulDecimals: number) {
  return (amount * getDenominator(mulDecimals)) / getDenominator(divDecimals)
}

// export function getAmountByRatio(
//   chain: Chain,
//   fromToken: Address,
//   toToken: Address,
//   fromTokenAmount: bigint,
//   ratio: bigint,
//   shouldInvertRatio?: boolean,
// ) {
//   if (resolveAddress(chain, fromToken) === toToken || fromTokenAmount === 0n) return fromTokenAmount

//   const _ratio = shouldInvertRatio ? GMX.PERCISION * GMX.PERCISION / ratio : ratio
//   const adjustedDecimalsRatio = adjustForDecimals(_ratio, fromToken.decimals, toToken.decimals)

//   return fromTokenAmount * adjustedDecimalsRatio / GMX.PERCISION
// }
