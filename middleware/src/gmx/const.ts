import { MARKETS } from '@gmx-io/sdk/configs/markets'
import { getAddress } from 'viem'
import { arbitrum } from 'viem/chains'
import { groupArrayByKey } from '../core/utils.js'

export const MARKET_DESCRIPTION_LIST = Object.entries(MARKETS[arbitrum.id]).map(([token, config]) => ({
  indexToken: getAddress(config.indexTokenAddress),
  longToken: getAddress(config.longTokenAddress),
  marketToken: getAddress(token),
  shortToken: getAddress(config.shortTokenAddress)
}))

export const MARKET_ADDRESS_DESCRIPTION_MAP = groupArrayByKey(MARKET_DESCRIPTION_LIST, (market) =>
  getAddress(market.marketToken)
)
