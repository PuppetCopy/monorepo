// import { empty, map, mergeArray, multicast, now, scan, skip } from '@most/core'
// import type { Stream } from '@most/types'
// import * as PUPPET from '@puppet-copy/middleware/const'
// import { hashData, resolveAddress } from '@puppet-copy/middleware/gmx'
// import {
//   filterNull,
//   getDenominator,
//   getMappedValue,
//   type ITokenDescription,
//   parseFixed,
//   periodicRun
// } from '@puppet-copy/middleware/utils'
// import * as walletLink from '@puppet-copy/middleware/wallet'
// import { wagmiConfig } from '@puppet-copy/middleware/wallet'
// import { readContract } from '@wagmi/core'
// import { erc20Abi } from 'abitype/abis'
// import { replayLatest } from 'aelea/core'
// import { fromWebsocket, observer } from 'aelea/ui-components'
// import { Address } from 'viem/accounts'

// import { getBalance } from 'viem/actions'

// export interface ITokenPoolInfo {
//   cumulativeRate: bigint
//   reservedAmount: bigint
//   poolAmounts: bigint
//   usdgAmounts: bigint
//   maxUsdgAmounts: bigint
//   tokenWeights: bigint
// }

// export interface ITokenInfo {
//   availableLongLiquidityUsd: bigint
//   availableShortLiquidityUsd: bigint
//   weight: bigint
//   bufferAmounts: bigint
//   usdgAmounts: bigint
//   poolAmounts: bigint
//   reservedAmounts: bigint
//   guaranteedUsd: bigint
//   globalShortSizes: bigint
//   maxGlobalShortSizes: bigint
//   maxGlobalLongSizes: bigint
// }

// const _gmxIoPricefeedIntervalLabel = {
//   [PUPPET.IntervalTime.MIN5]: '5m',
//   [PUPPET.IntervalTime.MIN15]: '15m',
//   [PUPPET.IntervalTime.HR]: '1h',
//   [PUPPET.IntervalTime.HR4]: '4h',
//   [PUPPET.IntervalTime.DAY]: '1d'
// }

// const gmxIOPriceMapSource = replayLatest(multicast(observer.duringWindowActivity(periodicRun({
//     interval: 2000,
//     actionOp: map(async time => getGmxIOPriceMap(GMX_URL_CHAIN[GMX.CHAIN.ARBITRUM] + '/prices'))
//   }))))

// export async function readAddressTokenBalance(
//   token: Address | typeof PUPPET.ADDRESS_ZERO,
//   address: Address
// ): Promise<bigint> {
//   if (token === PUPPET.ADDRESS_ZERO) {
//     return getBalance(provider, { address })
//   }

//   const contractMapping = getMappedValue(PUPPET.TRADE_CONTRACT_MAPPING, provider.chain.id)

//   if (!contractMapping) {
//     return 0n
//   }

//   const tokenAddress = resolveAddress(provider.chain, token)

//   const erc20 = await walletLink
//     .readContract({
//       address: tokenAddress,
//       abi: erc20Abi,
//       functionName: 'balanceOf',
//       args: [address]
//     })
//     .catch(() => 0n)

//   return erc20
// }

// export const exchangesWebsocketPriceSource = (token: Address) => {
//   const existingToken = getMappedValue(PUPPET.TOKEN_ADDRESS_DESCRIPTION_MAP, token)

//   // return latestPriceFromExchanges(existingToken)
//   const source = gmxIOPriceMapSource[chain.id]

//   // if (!source) {
//   //   throw new Error(`no price mapping exists for chain ${chain} ${chain}`)
//   // }

//   // return map(pmap => {
//   //   const val = pmap[token as keyof typeof pmap]

//   //   return BigInt(val)
//   // }, source)
// }

// export async function getGmxIOPriceMap(url: string): Promise<{ [key in Address]: bigint }> {
//   const res = await fetch(url)
//   const json = await res.json()

//   return Object.keys(json).reduce(
//     (seed, key) => {
//       seed[key as Address] = BigInt(json[key])
//       return seed
//     },
//     {} as { [key in Address]: bigint }
//   )
// }

// // export const getGmxIoPricefeed = async (queryParams: IRequestPricefeedApi): Promise<IPriceLatest[]> => {
// //   const tokenDesc = TOKEN_ADDRESS_DESCRIPTION_MAP[queryParams.tokenAddress)
// //   const intervalLabel = getMappedValue(gmxIoPricefeedIntervalLabel, queryParams.interval)
// //   const symbol = derievedSymbolMapping[tokenDesc.symbol] || tokenDesc.symbol
// //   const res = fetch(`https://stats.gmx.io/api/candles/${symbol}?preferableChainId=${queryParams.chain}&period=${intervalLabel}&from=${queryParams.from}&preferableSource=fast`)
// //     .then(async res => {
// //       const parsed = await res.json()
// //       return parsed.prices.map((json: any) => ({ o: parseFixed(json.o, 30), h: parseFixed(json.h, 30), l: parseFixed(json.l, 30), c: parseFixed(json.c, 30), timestamp: json.t }))
// //     })
// //   return res
// // }

// export async function readMinExecutionFee(): Promise<bigint> {
//   const puppetContractMap = PUPPET.CONTRACT
//   const minExecutionFeeKey = hashData(['string'], ['MIN_EXECUTION_FEE'])

//   return readContract(wagmiConfig, {
//     ...puppetContractMap.Datastore,
//     functionName: 'getUint',
//     args: [minExecutionFeeKey]
//   })
// }
