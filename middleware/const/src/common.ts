import { IntervalTime, getTokenDenominatedAmount } from "common-utils"
import { ARBITRUM_ADDRESS, TOKEN_DESCRIPTION_MAP } from "gmx-middleware-const"
import { Address } from "viem"



export const INITIAL_SUPPLY = getTokenDenominatedAmount(TOKEN_DESCRIPTION_MAP.PUPPET, 100_000)
export const MAX_LOCK_SCHEDULE = IntervalTime.WEEK * 105

export const PUPPET_COLLATERAL_LIST: Address[] = [
  ARBITRUM_ADDRESS.USDC,
  ARBITRUM_ADDRESS.NATIVE_TOKEN,
]

