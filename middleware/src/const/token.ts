import { getAddress } from 'viem'
import { groupArrayByKey } from '../core/utils.js'
import { ARBITRUM_TOKEN_LIST } from '../generated/tokenList.js'
import { CONTRACT } from './contract.js'

export const TOKEN_DESCRIPTION_LIST = [
  ...ARBITRUM_TOKEN_LIST,
  // GMX token
  {
    address: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
    decimals: 18,
    name: 'GMX',
    symbol: 'GMX'
  },
  // Puppet token
  {
    address: CONTRACT.PuppetToken.address,
    decimals: 18,
    name: 'Puppet',
    symbol: 'PUPPET'
  }
]

export const TOKEN_ADDRESS_DESCRIPTION_MAP = groupArrayByKey(TOKEN_DESCRIPTION_LIST, token => {
  return getAddress(token.address)
})

export const TOKEN_SYMBOL_DESCRIPTION_MAP = groupArrayByKey(TOKEN_DESCRIPTION_LIST, token => token.symbol.toUpperCase())
