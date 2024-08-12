import { IntervalTime, getTokenDenominatedAmount } from "common-utils"
import { TOKEN_SYMBOL } from "gmx-middleware-const"

export const PUPPET_TOKEN_DESCRIPTION = {
  name: "PUPPET",
  symbol: TOKEN_SYMBOL.PUPPET,
  decimals: 18,
  denominator: 10n ** 18n,
  isUsd: false,
}


export const DAO_SUPPLY =  getTokenDenominatedAmount(PUPPET_TOKEN_DESCRIPTION, 2_000_000)
export const CORE_SUPPLY = getTokenDenominatedAmount(PUPPET_TOKEN_DESCRIPTION, 1_000_000)
export const ESCROWED_SUPPLY = DAO_SUPPLY + CORE_SUPPLY
export const LP_BOOTSTRAP = getTokenDenominatedAmount(PUPPET_TOKEN_DESCRIPTION, 100_000)
export const INITIAL_SUPPLY = ESCROWED_SUPPLY + LP_BOOTSTRAP

export const MAX_LOCKUP_SCHEDULE = IntervalTime.YEAR * 2

export const LOCK_REWARD_RATE = 6000n
export const EXIT_REWARD_RATE = 3000n


