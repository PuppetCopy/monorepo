import { TOKENS } from '@gmx-io/sdk/configs/tokens'
import type { Token } from '@gmx-io/sdk/types/tokens'
import type { Address } from 'abitype'
import { arbitrum } from 'viem/chains'
import type { ITokenDescription } from '../utils/types.js'
import { getDenominator, groupArrayByKey } from '../utils/utils.js'
import { CONTRACT } from './contract.js'

export const TOKEN_DESCRIPTION_LIST: ITokenDescription[] = [
  ...TOKENS[arbitrum.id].map((token: Token) => ({
    address: token.address as Address,
    decimals: token.decimals,
    denominator: getDenominator(token.decimals),
    name: token.name,
    symbol: token.symbol
  })),

  // Puppet token
  {
    address: CONTRACT[42161].PuppetToken.address,
    decimals: 18,
    denominator: getDenominator(18),
    name: 'Puppet',
    symbol: 'PUPPET'
  }
]

export const TOKEN_ADDRESS_DESCRIPTION_MAP: Record<Address, ITokenDescription> = groupArrayByKey(
  TOKEN_DESCRIPTION_LIST,
  (token) => token.address
)

export const TOKEN_SYMBOL_DESCRIPTION_MAP = groupArrayByKey(TOKEN_DESCRIPTION_LIST, (token) =>
  token.symbol.toUpperCase()
)
