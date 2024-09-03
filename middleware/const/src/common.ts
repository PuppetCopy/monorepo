import { IntervalTime, getTokenDenominatedAmount } from "common-utils"
import { TOKEN_DESCRIPTION_MAP } from "gmx-middleware-const"



export const DAO_SUPPLY = getTokenDenominatedAmount(TOKEN_DESCRIPTION_MAP.PUPPET, 2_000_000)
export const CORE_SUPPLY = getTokenDenominatedAmount(TOKEN_DESCRIPTION_MAP.PUPPET, 1_000_000)
export const ESCROWED_SUPPLY = DAO_SUPPLY + CORE_SUPPLY
export const LP_BOOTSTRAP = getTokenDenominatedAmount(TOKEN_DESCRIPTION_MAP.PUPPET, 100_000)
export const INITIAL_SUPPLY = ESCROWED_SUPPLY + LP_BOOTSTRAP

export const MAX_LOCKUP_SCHEDULE = IntervalTime.YEAR * 2

export const LOCK_REWARD_RATE = 6000n
export const EXIT_REWARD_RATE = 3000n


