import { MARKETS } from '@gmx-io/sdk/configs/markets'
import { V2_TOKENS } from '@gmx-io/sdk/configs/tokens'
import { groupArrayByKey } from '@puppet-copy/middleware/utils'
import type { Address } from 'viem'

const TOKEN_LIST = V2_TOKENS[42161]
const marketTokenMap = MARKETS[42161]

if (!TOKEN_LIST || !marketTokenMap) {
  throw new Error('Token list or market list not found for chain ID 42161')
}

export const TOKEN_MAP = groupArrayByKey(TOKEN_LIST, (token) => token.address as Address)

export const MARKET_INDEX_TOKEN_MAP = Object.entries(marketTokenMap).reduce(
  (acc, [marketToken, market]) => {
    const indexToken = market.indexTokenAddress as Address
    const longToken = market.longTokenAddress as Address
    const shortToken = market.shortTokenAddress as Address
    acc[marketToken as Address] = {
      marketToken,
      indexToken,
      longToken,
      shortToken
    }
    return acc
  },
  {} as Record<
    Address,
    {
      marketToken: string
      indexToken: Address
      longToken: Address
      shortToken: Address
    }
  >
)
