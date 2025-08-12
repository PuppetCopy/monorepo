import { groupList } from '../core/utils.js'
import { ARBITRUM_MARKET_LIST } from '../generated/marketList.js'

// Convert generated market list to the expected map format
export const MARKET_ADDRESS_DESCRIPTION_MAP = groupList(ARBITRUM_MARKET_LIST, 'marketToken')
