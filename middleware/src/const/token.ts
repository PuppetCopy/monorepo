import { ARBITRUM_TOKEN_LIST } from '@puppet/contracts/gmx'
import type { Address } from 'viem/accounts'
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains'
import { groupList } from '../core/utils.js'
import { ARBITRUM_ADDRESS, BASE_ADDRESS, ETHEREUM_ADDRESS, OPTIMISM_ADDRESS, POLYGON_ADDRESS } from './address.js'
import { ADDRESS_ZERO } from './common.js'
import { CONTRACT } from './contract.js'

export const TOKEN_DESCRIPTION_LIST = [
  ...ARBITRUM_TOKEN_LIST,
  // Address Zero
  {
    address: ADDRESS_ZERO,
    decimals: 0,
    name: '-',
    symbol: '-'
  },

  {
    address: CONTRACT.GMX.address,
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
] as const

export const TOKEN_ADDRESS_DESCRIPTION_MAP = groupList(TOKEN_DESCRIPTION_LIST, 'address')
export const TOKEN_SYMBOL_DESCRIPTION_MAP = groupList(TOKEN_DESCRIPTION_LIST, 'symbol')

// Cross-chain token mapping: maps tokens between chains by symbol
export const CROSS_CHAIN_TOKEN_MAP = {
  [mainnet.id]: {
    ETH: ADDRESS_ZERO,
    USDC: ETHEREUM_ADDRESS.USDC,
    WETH: ETHEREUM_ADDRESS.WETH
  },
  [arbitrum.id]: {
    ETH: ADDRESS_ZERO,
    USDC: ARBITRUM_ADDRESS.USDC,
    WETH: ARBITRUM_ADDRESS.WETH
  },
  [base.id]: {
    ETH: ADDRESS_ZERO,
    USDC: BASE_ADDRESS.USDC,
    WETH: BASE_ADDRESS.WETH
  },
  [optimism.id]: {
    ETH: ADDRESS_ZERO,
    USDC: OPTIMISM_ADDRESS.USDC,
    WETH: OPTIMISM_ADDRESS.WETH
  },
  [polygon.id]: {
    ETH: ADDRESS_ZERO,
    USDC: POLYGON_ADDRESS.USDC,
    WETH: POLYGON_ADDRESS.WETH
  }
} as const

export const PUPPET_COLLATERAL_LIST = [ARBITRUM_ADDRESS.USDC, ARBITRUM_ADDRESS.WETH] as Address[]
