import { groupList } from '../core/utils.js'
import { ARBITRUM_TOKEN_LIST } from '../generated/tokenList.js'
import { CONTRACT } from './contract.js'

export const TOKEN_DESCRIPTION_LIST = [
  ...ARBITRUM_TOKEN_LIST,
  // Puppet token
  {
    address: CONTRACT.PuppetToken.address,
    decimals: 18,
    name: 'Puppet',
    symbol: 'PUPPET'
  }
] as const

export const TOKEN_ADDRESS_DESCRIPTION_MAP = groupList(TOKEN_DESCRIPTION_LIST, 'address')
export const TOKEN_SYMBOL_DESCRIPTION_MAP = groupList(TOKEN_DESCRIPTION_LIST, 'symbol')