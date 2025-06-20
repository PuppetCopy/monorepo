import { MARKETS } from '@gmx-io/sdk/configs/markets'
import { groupArrayByKey } from '@puppet-copy/middleware/utils'
import type { Address } from 'viem'
import { arbitrum } from 'viem/chains'
import type { IMarket } from './types.js'

export const MARKET_DESCRIPTION_LIST: IMarket[] = Object.entries(MARKETS[arbitrum.id]).map(([token, config]) => ({
  indexToken: config.indexTokenAddress as Address,
  longToken: config.longTokenAddress as Address,
  marketToken: token as Address,
  shortToken: config.shortTokenAddress as Address
}))

export const MARKET_ADDRESS_DESCRIPTION_MAP: Record<Address, IMarket> = groupArrayByKey(
  MARKET_DESCRIPTION_LIST,
  (market) => market.marketToken
)
