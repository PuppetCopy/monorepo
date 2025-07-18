import { MARKETS } from '@gmx-io/sdk/configs/markets'
import type { Address } from 'viem'
import { arbitrum } from 'viem/chains'
import { groupArrayByKey } from '../core/utils.js'

export const MARKET_DESCRIPTION_LIST = Object.entries(MARKETS[arbitrum.id]).map(([token, config]) => ({
  indexToken: config.indexTokenAddress as Address,
  longToken: config.longTokenAddress as Address,
  marketToken: token as Address,
  shortToken: config.shortTokenAddress as Address
}))

export const MARKET_ADDRESS_DESCRIPTION_MAP = groupArrayByKey(MARKET_DESCRIPTION_LIST, (market) => market.marketToken)
