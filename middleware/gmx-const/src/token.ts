import { arbitrum, avalanche } from "viem/chains"
import { ARBITRUM_ADDRESS } from "./chain/arbitrum.js"
import { AVALANCHE_ADDRESS } from "./chain/avalanche.js"
import { TOKEN_SYMBOL } from "./symbol.js"
import { mapArrayBy } from "./utils.js"


export const TOKEN_DESCRIPTION_LIST = [
  {
    name: "Puppet",
    symbol: TOKEN_SYMBOL.PUPPET,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "vePuppet",
    symbol: TOKEN_SYMBOL.VEPUPPET,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "GMX",
    symbol: TOKEN_SYMBOL.GMX,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Avalanche",
    symbol: TOKEN_SYMBOL.AVAX,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Wrapped AVAX",
    symbol: TOKEN_SYMBOL.WAVAX,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Chainlink",
    symbol: TOKEN_SYMBOL.LINK,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Bitcoin (WBTC.e)",
    symbol: TOKEN_SYMBOL.WBTCE,
    decimals: 8,
    denominator: 10n ** 8n
  },
  {
    name: "Wrapped Bitcoin",
    symbol: TOKEN_SYMBOL.WBTC,
    decimals: 8,
    denominator: 10n ** 8n
  },
  {
    name: "Bitcoin (BTC.b)",
    symbol: TOKEN_SYMBOL.BTCB,
    decimals: 8,
    denominator: 10n ** 8n
  },
  {
    name: "Ethereum",
    symbol: TOKEN_SYMBOL.ETH,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Wrapped Ethereum",
    symbol: TOKEN_SYMBOL.WETH,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Uniswap",
    symbol: TOKEN_SYMBOL.UNI,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "USD Coin",
    symbol: TOKEN_SYMBOL.USDC,
    decimals: 6,
    denominator: 10n ** 6n
  },
  {
    name: "USD Coin (USDC.e)",
    symbol: TOKEN_SYMBOL.USDCE,
    decimals: 6,
    denominator: 10n ** 6n
  },
  {
    name: "Tether",
    symbol: TOKEN_SYMBOL.USDT,
    decimals: 6,
    denominator: 10n ** 6n
  },
  {
    name: "Dai",
    symbol: TOKEN_SYMBOL.DAI,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Frax",
    symbol: TOKEN_SYMBOL.FRAX,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Magic Internet Money",
    symbol: TOKEN_SYMBOL.MIM,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Arbitrum",
    symbol: TOKEN_SYMBOL.ARB,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Wrapped Solana",
    symbol: TOKEN_SYMBOL.SOL,
    decimals: 9,
    denominator: 10n ** 9n
  },
  {
    name: "Synthetic Dogecoin",
    symbol: TOKEN_SYMBOL.SynDOGE,
    decimals: 8,
    denominator: 10n ** 8n
  },
  {
    name: "Synthetic Bitcoin",
    symbol: TOKEN_SYMBOL.SynBTC,
    decimals: 8,
    denominator: 10n ** 8n
  },
  {
    name: "Synthetic Litecoin",
    symbol: TOKEN_SYMBOL.SynLTC,
    decimals: 8,
    denominator: 10n ** 8n
  },
  {
    name: "Synthetic XRP",
    symbol: TOKEN_SYMBOL.SynXRP,
    decimals: 6,
    denominator: 10n ** 6n
  },
  {
    name: "NEAR",
    symbol: TOKEN_SYMBOL.NEAR,
    decimals: 24,
    denominator: 10n ** 24n
  },
  {
    name: "Dogwifhat",
    symbol: TOKEN_SYMBOL.WIF,
    decimals: 6,
    denominator: 10n ** 6n
  },
  {
    name: "Polygon",
    symbol: TOKEN_SYMBOL.MATIC,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "TRON",
    symbol: TOKEN_SYMBOL.TRX,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Cardano",
    symbol: TOKEN_SYMBOL.ADA,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Pepe",
    symbol: "PEPE",
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Optimism",
    symbol: TOKEN_SYMBOL.OP,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "ORDI",
    symbol: TOKEN_SYMBOL.ORDI,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Cosmos",
    symbol: TOKEN_SYMBOL.ATOM,
    decimals: 6,
    denominator: 10n ** 6n
  },
  {
    name: "Shiba Inu",
    symbol: TOKEN_SYMBOL.SHIB,
    assetSymbol: "SHIB",
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Aave",
    symbol: TOKEN_SYMBOL.AAVE,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "BNB",
    symbol: TOKEN_SYMBOL.BNB,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Polkadot",
    symbol: TOKEN_SYMBOL.DOT,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "Stacks",
    symbol: TOKEN_SYMBOL.STX,
    decimals: 6,
    denominator: 10n ** 6n
  },
  {
    name: "USDe",
    symbol: TOKEN_SYMBOL.USDe,
    decimals: 18,
    denominator: 10n ** 18n
  },
  {
    name: "USDe",
    symbol: TOKEN_SYMBOL.tBTC,
    decimals: 18,
    denominator: 10n ** 18n
  }

] as const

export const TOKEN_DESCRIPTION_MAP = mapArrayBy(TOKEN_DESCRIPTION_LIST, token => token.symbol, x => x)

export const CHAIN_ADDRESS_MAP = {
  [avalanche.id]: AVALANCHE_ADDRESS,
  [arbitrum.id]: ARBITRUM_ADDRESS,
}

export const CHAIN_NATIVE_DESCRIPTION = {
  [avalanche.id]: TOKEN_DESCRIPTION_MAP.AVAX,
  [arbitrum.id]: TOKEN_DESCRIPTION_MAP.ETH,
} as const

export const TOKEN_ADDRESS_DESCRIPTION_MAP = {
  // [ARBITRUM_ADDRESS.PUPPET]: TOKEN_DESCRIPTION_MAP.PUPPET,

  [ARBITRUM_ADDRESS.NATIVE_TOKEN]: TOKEN_DESCRIPTION_MAP.WETH,

  [ARBITRUM_ADDRESS.GMX]: TOKEN_DESCRIPTION_MAP.GMX,
  [ARBITRUM_ADDRESS.LINK]: TOKEN_DESCRIPTION_MAP.LINK,
  [ARBITRUM_ADDRESS.UNI]: TOKEN_DESCRIPTION_MAP.UNI,
  [ARBITRUM_ADDRESS.WBTC]: TOKEN_DESCRIPTION_MAP.WBTC,
  [ARBITRUM_ADDRESS.ARB]: TOKEN_DESCRIPTION_MAP.ARB,
  [ARBITRUM_ADDRESS.SOL]: TOKEN_DESCRIPTION_MAP.SOL,
  [ARBITRUM_ADDRESS.WAVAX]: TOKEN_DESCRIPTION_MAP.WAVAX,
  [ARBITRUM_ADDRESS.NEAR]: TOKEN_DESCRIPTION_MAP.NEAR,
  [ARBITRUM_ADDRESS.OP]: TOKEN_DESCRIPTION_MAP.OP,
  [ARBITRUM_ADDRESS.AAVE]: TOKEN_DESCRIPTION_MAP.AAVE,
  [ARBITRUM_ADDRESS.BNB]: TOKEN_DESCRIPTION_MAP.BNB,
  [ARBITRUM_ADDRESS.PEPE]: TOKEN_DESCRIPTION_MAP.PEPE,
  [ARBITRUM_ADDRESS.ADA]: TOKEN_DESCRIPTION_MAP.ADA,
  [ARBITRUM_ADDRESS.TRON]: TOKEN_DESCRIPTION_MAP.TRON,
  [ARBITRUM_ADDRESS.MATIC]: TOKEN_DESCRIPTION_MAP.MATIC,
  [ARBITRUM_ADDRESS.DOT]: TOKEN_DESCRIPTION_MAP.DOT,
  [ARBITRUM_ADDRESS.WIF]: TOKEN_DESCRIPTION_MAP.WIF,
  [ARBITRUM_ADDRESS.ORDI]: TOKEN_DESCRIPTION_MAP.ORDI,
  [ARBITRUM_ADDRESS.SHIB]: TOKEN_DESCRIPTION_MAP.SHIB,
  [ARBITRUM_ADDRESS.ATOM]: TOKEN_DESCRIPTION_MAP.ATOM,
  [ARBITRUM_ADDRESS.STX]: TOKEN_DESCRIPTION_MAP.STX,
  [ARBITRUM_ADDRESS.USDe]: TOKEN_DESCRIPTION_MAP.USDe,
  [ARBITRUM_ADDRESS.tBTC]: TOKEN_DESCRIPTION_MAP.tBTC,
  

  [ARBITRUM_ADDRESS.SynDOGE]: TOKEN_DESCRIPTION_MAP.SynDOGE,
  [ARBITRUM_ADDRESS.SynBTC]: TOKEN_DESCRIPTION_MAP.SynBTC,
  [ARBITRUM_ADDRESS.SynLTC]: TOKEN_DESCRIPTION_MAP.SynLTC,
  [ARBITRUM_ADDRESS.SynXRP]: TOKEN_DESCRIPTION_MAP.SynXRP,


  [ARBITRUM_ADDRESS.DAI]: TOKEN_DESCRIPTION_MAP.DAI,
  [ARBITRUM_ADDRESS.FRAX]: TOKEN_DESCRIPTION_MAP.FRAX,
  [ARBITRUM_ADDRESS.MIM]: TOKEN_DESCRIPTION_MAP.MIM,
  [ARBITRUM_ADDRESS.USDCE]: TOKEN_DESCRIPTION_MAP.USDC,
  [ARBITRUM_ADDRESS.USDC]: TOKEN_DESCRIPTION_MAP.USDC,
  [ARBITRUM_ADDRESS.USDT]: TOKEN_DESCRIPTION_MAP.USDT,


  [AVALANCHE_ADDRESS.NATIVE_TOKEN]: TOKEN_DESCRIPTION_MAP.AVAX,

  [AVALANCHE_ADDRESS.WBTCE]: TOKEN_DESCRIPTION_MAP.WBTC,
  [AVALANCHE_ADDRESS.BTCB]: TOKEN_DESCRIPTION_MAP.BTCB,
  [AVALANCHE_ADDRESS.WETHE]: TOKEN_DESCRIPTION_MAP.ETH,
  [AVALANCHE_ADDRESS.MIM]: TOKEN_DESCRIPTION_MAP.MIM,
  [AVALANCHE_ADDRESS.USDC]: TOKEN_DESCRIPTION_MAP.USDC,
  [AVALANCHE_ADDRESS.USDCE]: TOKEN_DESCRIPTION_MAP.USDCE,
} as const





