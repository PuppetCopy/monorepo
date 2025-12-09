import { ARBITRUM_MARKET_LIST } from '@puppet/contracts/gmx'
import { groupList } from '../core/utils.js'

// Convert generated market list to the expected map format
export const MARKET_ADDRESS_DESCRIPTION_MAP = groupList(ARBITRUM_MARKET_LIST, 'marketToken')
