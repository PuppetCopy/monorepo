
import { http } from "@aelea/ui-components"
import { empty, map, mergeArray, now, scan, skip } from "@most/core"
import { Stream } from "@most/types"
import { erc20Abi } from "abitype/abis"
import { ADDRESS_ZERO, ITokenDescription, IntervalTime, USD_DECIMALS, filterNull, getDenominator, getMappedValue, parseFixed } from "common-utils"
import * as GMX from "gmx-middleware-const"
import { TOKEN_DESCRIPTION_MAP } from "gmx-middleware-const"
import { hashData, resolveAddress } from "gmx-middleware-utils"
import * as PUPPET from "puppet-middleware-const"
import { } from "puppet-middleware-utils"
import * as viem from "viem"
import { getBalance } from "viem/actions"
import * as walletLink from "wallet"



export interface ITokenPoolInfo {
  cumulativeRate: bigint
  reservedAmount: bigint
  poolAmounts: bigint
  usdgAmounts: bigint
  maxUsdgAmounts: bigint
  tokenWeights: bigint
}

export interface ITokenInfo {
  availableLongLiquidityUsd: bigint
  availableShortLiquidityUsd: bigint
  weight: bigint
  bufferAmounts: bigint
  usdgAmounts: bigint
  poolAmounts: bigint
  reservedAmounts: bigint
  guaranteedUsd: bigint
  globalShortSizes: bigint
  maxGlobalShortSizes: bigint
  maxGlobalLongSizes: bigint
}


const derievedSymbolMapping = {
  [TOKEN_DESCRIPTION_MAP.WETH.symbol]: 'ETH',
  [TOKEN_DESCRIPTION_MAP.WBTC.symbol]: 'BTC',
  [TOKEN_DESCRIPTION_MAP.BTCB.symbol]: 'BTC',
  [TOKEN_DESCRIPTION_MAP.WBTCE.symbol]: 'BTC',
  [TOKEN_DESCRIPTION_MAP.WAVAX.symbol]: 'AVAX',
  [TOKEN_DESCRIPTION_MAP.SOL.symbol]: 'SOL',
} as const

const gmxIoPricefeedIntervalLabel = {
  [IntervalTime.MIN5]: '5m',
  [IntervalTime.MIN15]: '15m',
  [IntervalTime.HR]: '1h',
  [IntervalTime.HR4]: '4h',
  [IntervalTime.DAY]: '1d',
}


// const GMX_URL_CHAIN = {
//   [GMX.CHAIN.ARBITRUM]: 'https://gmx-server-mainnet.uw.r.appspot.com',
//   [GMX.CHAIN.AVALANCHE]: 'https://gmx-avax-server.uc.r.appspot.com',
// }

// const gmxIOPriceMapSource = {
//   [GMX.CHAIN.ARBITRUM]: replayLatest(multicast(observer.duringWindowActivity(periodicRun({
//     interval: 2000,
//     actionOp: map(async time => getGmxIOPriceMap(GMX_URL_CHAIN[GMX.CHAIN.ARBITRUM] + '/prices'))
//   })))),
//   [GMX.CHAIN.AVALANCHE]: replayLatest(multicast(observer.duringWindowActivity(periodicRun({
//     interval: 2000,
//     actionOp: map(async time => getGmxIOPriceMap(GMX_URL_CHAIN[GMX.CHAIN.AVALANCHE] + '/prices'))
//   })))),
// }

export function latestPriceFromExchanges(tokendescription: ITokenDescription): Stream<bigint> {
  const symbol = derievedSymbolMapping[tokendescription.symbol]

  if (symbol === null) {
    console.warn(`no symbol ${symbol} found in mapping`)
    return empty()
  }

  const binance = http.fromWebsocket('wss://stream.binance.com:9443/ws', now({ params: [`${symbol}usdt@trade`.toLowerCase()], method: "SUBSCRIBE", id: 1 }))
  const bitfinex = http.fromWebsocket('wss://api-pub.bitfinex.com/ws/2', now({ symbol: `${symbol}USD`, event: "subscribe", channel: "ticker" }))
  const coinbase = http.fromWebsocket('wss://ws-feed.pro.coinbase.com', now({ product_ids: [`${symbol}-USD`], type: "subscribe", channels: ["ticker"] }))
  const kraken = http.fromWebsocket('wss://ws.kraken.com', now({ event: 'subscribe', pair: [`${symbol.toUpperCase()}/USD`], subscription: { name: 'ticker' } }))

  const allSources: Stream<number> = filterNull(mergeArray([
    map((ev: any) => {
      if ('p' in ev) {
        return Number(ev.p)
      }
      // console.warn(ev)
      return null
    }, binance),
    map((data: any) => {
      if (data[2] && data[2] === 'ticker') {
        return Number(data[1].c[0])

      }
      // console.warn(ev)

      return null
    }, kraken),
    map((ev: any) => {
      if (Array.isArray(ev) && ev.length === 2 && Array.isArray(ev[1]) && ev[1].length === 10) {
        // console.log(Number(ev[1][6]))
        return ev[1][6]
      }
      // console.warn(ev)
      return null
    }, bitfinex),
    map((ev: any) => {
      if ('price' in ev) {
        // console.log(Number(ev.price))

        return Number(ev.price)
      }
      // console.warn(ev)
      return null
    }, coinbase),
  ]))

  const avgPrice = skip(1, scan((prev, next) => {
    return prev === 0 ? next : (prev + next) / 2
  }, 0, allSources))

  return map(ev => parseFixed(USD_DECIMALS, ev) / getDenominator(tokendescription.decimals), avgPrice)
}


export async function readAddressTokenBalance(provider: walletLink.IClient, token: viem.Address | typeof ADDRESS_ZERO, address: viem.Address): Promise<bigint> {
  if (token === ADDRESS_ZERO) {
    return getBalance(provider, { address })
  }

  const contractMapping = getMappedValue(GMX.TRADE_CONTRACT_MAPPING, provider.chain.id)

  if (!contractMapping) {
    return 0n
  }

  const tokenAddress = resolveAddress(provider.chain, token)

  const erc20 = await walletLink.readContract({
    provider,
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address]
  }).catch(() => 0n)

  return erc20
}



export const exchangesWebsocketPriceSource = (token: viem.Address) => {
  const existingToken = getMappedValue(GMX.TOKEN_ADDRESS_DESCRIPTION_MAP, token)

  return latestPriceFromExchanges(existingToken)
  // const source = gmxIOPriceMapSource[chain.id]

  // if (!source) {
  //   throw new Error(`no price mapping exists for chain ${chain} ${chain}`)
  // }

  // return map(pmap => {
  //   const val = pmap[token as keyof typeof pmap]

  //   return BigInt(val)
  // }, source)
}


export async function getGmxIOPriceMap(url: string): Promise<{ [key in viem.Address]: bigint }> {
  const res = await fetch(url)
  const json = await res.json()

  // @ts-ignore
  return Object.keys(json).reduce((seed, key) => {
    // @ts-ignore
    seed[key] = json[key]
    return seed
  }, {})
}



// export const getGmxIoPricefeed = async (queryParams: IRequestPricefeedApi): Promise<IPriceLatest[]> => {
//   const tokenDesc = getTokenDescription(queryParams.tokenAddress)
//   const intervalLabel = getMappedValue(gmxIoPricefeedIntervalLabel, queryParams.interval)
//   const symbol = derievedSymbolMapping[tokenDesc.symbol] || tokenDesc.symbol
//   const res = fetch(`https://stats.gmx.io/api/candles/${symbol}?preferableChainId=${queryParams.chain}&period=${intervalLabel}&from=${queryParams.from}&preferableSource=fast`)
//     .then(async res => {
//       const parsed = await res.json()
//       return parsed.prices.map((json: any) => ({ o: parseFixed(json.o, 30), h: parseFixed(json.h, 30), l: parseFixed(json.l, 30), c: parseFixed(json.c, 30), timestamp: json.t }))
//     })
//   return res
// }



export async function readMinExecutionFee(wallet: walletLink.IClient): Promise<bigint> {
  const puppetContractMap = getMappedValue(PUPPET.CONTRACT, wallet.chain.id)
  const minExecutionFeeKey = hashData(["string"], ["MIN_EXECUTION_FEE"])

  return walletLink.readContract({
    ...puppetContractMap.Datastore,
    provider: wallet,
    functionName: 'getUint',
    args: [minExecutionFeeKey],
  })
}


