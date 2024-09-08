import { IntervalTime, getTokenDenominatedAmount } from "common-utils"
import { TOKEN_DESCRIPTION_MAP } from "gmx-middleware-const"



export const INITIAL_SUPPLY = getTokenDenominatedAmount(TOKEN_DESCRIPTION_MAP.PUPPET, 100_000)
export const MAX_LOCK_SCHEDULE = IntervalTime.WEEK * 105


