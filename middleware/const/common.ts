import { type Address, type Hex } from "viem"
import { arbitrum, avalanche } from "viem/chains"
import { ARBITRUM_ADDRESS } from "./chain/arbitrum.js"
import { AVALANCHE_ADDRESS } from "./chain/avalanche.js"

export enum IntervalTime {
  SEC = 1,
  MIN = 60,
  MIN5 = 300,
  MIN15 = 900,
  MIN30 = 1800,
  HR = 3600,
  HR2 = 7200,
  HR4 = 14400,
  HR6 = 21600,
  HR8 = 28800,
  DAY = 86400,
  WEEK = 604800,
  MONTH = 2628000,
  QUARTER = 7884000,
  YEAR = 31536000
}

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000" as Address
export const BYTES32_ZERO = "0x0000000000000000000000000000000000000000000000000000000000000000" as Hex

export const BASIS_POINTS_DIVISOR = 10000n

export const FLOAT_PRECISION = 10n ** 30n
export const USD_DECIMALS = 30
export const WEI_PRECISION = 10n ** BigInt(18)
export const MAX_UINT256 = 2n ** 256n - 1n
export const INITIAL_SUPPLY = 10n ** 100_000n
export const MAX_LOCK_SCHEDULE = IntervalTime.WEEK * 105

export const PUPPET_COLLATERAL_LIST: Address[] = [
  ARBITRUM_ADDRESS.USDC,
  ARBITRUM_ADDRESS.NATIVE_TOKEN,
]

export const MAX_LEVERAGE_FACTOR = 100n * BASIS_POINTS_DIVISOR
export const MIN_LEVERAGE_FACTOR = 11000n
export const DEDUCT_USD_FOR_GAS = 10n ** 30n * 2n

export const LIQUIDATION_FEE = 10n ** 5n

export const TAX_BASIS_POINTS = 50n
export const STABLE_TAX_BASIS_POINTS = 5n
export const MINT_BURN_FEE_BASIS_POINTS = 25n
export const SWAP_FEE_BASIS_POINTS = 30n
export const STABLE_SWAP_FEE_BASIS_POINTS = 1n
export const MARGIN_FEE_BASIS_POINTS = 10n

export const FUNDING_RATE_PRECISION = 1000000n

export const PRICEFEED_INTERVAL = [
  IntervalTime.MIN5,
  IntervalTime.MIN15,
  IntervalTime.HR,
  IntervalTime.HR6,
  IntervalTime.DAY,
  IntervalTime.WEEK,
  IntervalTime.MONTH,
] as const

export const TRADE_CONTRACT_MAPPING = {
  [arbitrum.id]: ARBITRUM_ADDRESS,
  [avalanche.id]: AVALANCHE_ADDRESS
} as const

export type ContractChain = keyof typeof TRADE_CONTRACT_MAPPING

export function mapArrayBy<A, B extends string | symbol | number, R>(list: readonly A[], mapKey: (v: A) => B, mapValue: (v: A) => R) {
  const gmap = {} as { [P in B]: R }

  for (const item of list) {
    const key = mapKey(item)
    gmap[key] = mapValue(item)
  }

  return gmap
}
