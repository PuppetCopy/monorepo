import { factor, getMappedValue } from "common-utils"
import { getMarketIndexToken, getPositionPnlUsd, getTokenDescription, IPositionDecrease, IPositionIncrease, IPriceCandle, IPricefeedMap, isUpdateIncrease } from "gmx-middleware-utils"
import * as viem from "viem"
import { IMirrorListSummary, IPosition, IPuppetPosition } from "./types.js"


export function accountSettledPositionListSummary(
  positionList: IPosition[],
  puppet?: viem.Address,
): IMirrorListSummary {
  const seedAccountSummary: IMirrorListSummary = {
    size: 0n,
    collateral: 0n,
    cumulativeLeverage: 0n,
    puppets: [],

    avgCollateral: 0n,
    avgSize: 0n,

    fee: 0n,
    lossCount: 0,
    winCount: 0,
    pnl: 0n,
  }

  const summary = positionList.reduce((seed, next, idx): IMirrorListSummary => {
    const idxBn = BigInt(idx) + 1n

    const size = seed.size + getParticiapntPortion(next, next.maxSizeInUsd, puppet)
    const collateral = seed.collateral + getParticiapntPortion(next, next.maxCollateralInUsd, puppet)
    const cumulativeLeverage = seed.cumulativeLeverage + getParticiapntPortion(next, factor(next.maxSizeInUsd, next.maxCollateralInUsd), puppet)

    const avgSize = size / idxBn
    const avgCollateral = collateral / idxBn

    const fee = seed.fee + getParticiapntPortion(next, 0n, puppet)
    const pnl = seed.pnl + getParticiapntPortion(next, next.realisedPnlUsd, puppet)

    const winCount = seed.winCount + (next.realisedPnlUsd > 0n ? 1 : 0)
    const lossCount = seed.lossCount + (next.realisedPnlUsd < 0n ? 1 : 0)

    const puppets = isMirrorPosition(next) ? [...seed.puppets, ...next.puppetList.map(p => p.account).filter(x => !seed.puppets.includes(x))] : seed.puppets

    return {
      size,
      collateral,
      cumulativeLeverage,
      avgCollateral,
      avgSize,
      fee,
      lossCount,
      pnl,
      winCount,
      puppets,
    }
  }, seedAccountSummary)


  return summary
}



export function aggregatePositionList(list: (IPositionIncrease | IPositionDecrease)[]): IPosition[] {
  const sortedUpdateList = list.sort((a, b) => b.blockTimestamp - a.blockTimestamp)
  const openPositionMap: { [k: viem.Hex]: IPosition } = {}
  const positionList: IPosition[] = []

  for (let index = 0; index < sortedUpdateList.length; index++) {
    const next = sortedUpdateList[index]
    const position = openPositionMap[next.positionKey] ??= {
      key: next.positionKey,
      account: next.account,
      market: next.market,
      collateralToken: next.collateralToken,

      sizeInUsd: 0n,
      sizeInTokens: 0n,
      collateralInTokens: 0n,
      collateralInUsd: 0n,
      realisedPnlUsd: 0n,

      cumulativeSizeUsd: 0n,
      cumulativeSizeToken: 0n,
      cumulativeCollateralUsd: 0n,
      cumulativeCollateralToken: 0n,

      maxSizeInUsd: 0n,
      maxSizeInTokens: 0n,
      maxCollateralInTokens: 0n,
      maxCollateralInUsd: 0n,

      avgEntryPrice: 0n,

      isLong: next.isLong,

      openTimestamp: next.blockTimestamp,
      settledTimestamp: 0,

      puppetList: [],
      increaseList: [],
      decreaseList: [],

      collateralList: [],

      lastUpdate: next,
    }

    position.lastUpdate = next

    if (isUpdateIncrease(next)) {
      position.sizeInUsd += next.sizeDeltaUsd
      position.sizeInTokens += next.sizeDeltaInTokens
      position.collateralInTokens += next.collateralDeltaAmount
      position.collateralInUsd = position.collateralInTokens * next.collateralTokenPriceMax

      position.maxSizeInTokens = next.sizeInTokens > position.maxSizeInTokens ? next.sizeInTokens : position.maxSizeInTokens
      position.maxSizeInUsd = next.sizeInUsd > position.maxSizeInUsd ? next.sizeInUsd : position.maxSizeInUsd
      position.maxCollateralInTokens = next.collateralAmount > position.maxCollateralInTokens ? next.collateralAmount : position.maxCollateralInTokens
      position.maxCollateralInUsd = position.collateralInUsd > position.maxCollateralInUsd ? position.collateralInUsd : position.maxCollateralInUsd

      position.cumulativeSizeToken += next.sizeInTokens
      position.cumulativeSizeUsd += next.sizeInUsd
      position.cumulativeCollateralToken += next.collateralAmount
      position.cumulativeCollateralUsd += position.collateralInUsd

      position.increaseList.push(next)
    } else {

      // case where indexing ahead of prior position updates
      if (position.cumulativeCollateralUsd === 0n) {
        position.maxCollateralInTokens = next.collateralAmount + next.collateralDeltaAmount
        position.maxCollateralInUsd = position.maxCollateralInTokens * next.collateralTokenPriceMax
        position.maxSizeInTokens = next.sizeInTokens + next.sizeDeltaInTokens
        position.maxSizeInUsd = next.sizeInUsd + next.sizeDeltaUsd

        position.cumulativeCollateralToken = position.maxCollateralInTokens
        position.cumulativeCollateralUsd = position.maxCollateralInUsd
        position.cumulativeSizeToken = position.maxSizeInTokens
        position.cumulativeSizeUsd = position.maxSizeInUsd
      }

      position.decreaseList.push(next)
      position.realisedPnlUsd += next.basePnlUsd

      if (next.sizeInTokens === 0n) {
        position.settledTimestamp = next.blockTimestamp

        positionList.push(position)
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete openPositionMap[next.positionKey]
      }
    }

    position.avgEntryPrice = position.maxSizeInUsd / position.maxSizeInTokens * getTokenDescription(getMarketIndexToken(next.market)).denominator

  }

  positionList.push(...Object.values(openPositionMap))
  return positionList
}




// export function leaderboardSummary(pricefeedMap: IPricefeedMap, tradeList: IAccountLastAggregatedStats[]): ILeaderboardSummary[] {
//   const map: { [k: viem.Address]: ILeaderboardSummary } = {}

//   for (const next of tradeList) {
//     const summary = map[next.account] ??= {
//       account: next.account,
//       cumulativeCollateral: 0n,
//       cumulativeSize: 0n,
//       maxCollateral: 0n,
//       maxSize: 0n,
//       leverage: 0n,
//       lossCount: 0,
//       winCount: 0,
//       pnl: 0n,
//       puppets: [],
//       positionList: [],
//       indexTokenList: [],
//       collateralTokenList: [],
//     }

//     summary.cumulativeCollateral += next.maxCollateralInUsd
//     summary.cumulativeSize += next.maxSizeInTokens
//     summary.maxCollateral = next.maxCollateralInUsd > summary.maxCollateral ? next.maxCollateralInUsd : summary.maxCollateral
//     summary.maxSize = next.maxSizeInUsd > summary.maxSize ? next.maxSizeInUsd : summary.maxSize
//     summary.leverage = summary.maxSize / summary.maxCollateral

//     if (next.sizeInTokens === 0n) {
//       summary.pnl += next.realisedPnlUsd

//       summary.winCount += next.realisedPnlUsd > 0n ? 1 : 0
//       summary.lossCount += next.realisedPnlUsd < 0n ? 1 : 0
//     } else {

//       try {
//         const priceCandle = getLatestPriceFeedPrice(pricefeedMap, getMarketIndexToken(next.market))
//         const pnl = next.realisedPnlUsd + getPositionPnlUsd(next.isLong, next.sizeInUsd, next.sizeInTokens, priceCandle.c)
//         summary.pnl += pnl
//         summary.winCount += pnl > 0n ? 1 : 0
//         summary.lossCount += pnl < 0n ? 1 : 0
//       } catch (e) {
//         console.error(e)
//         continue
//       }

//     }

//     const indexToken = getMarketIndexToken(next.market)

//     if (summary.indexTokenList.indexOf(indexToken) === -1) {
//       summary.indexTokenList.push(indexToken)
//     }

//     if (summary.collateralTokenList.indexOf(next.collateralToken) === -1) {
//       summary.collateralTokenList.push(next.collateralToken)
//     }


//     // summary.puppets = []
//     summary.positionList.push(next)

//     map[next.account] = summary
//   }


//   return Object.values(map)
// }


export function getLatestPriceFeedPrice(priceFeed: IPricefeedMap, token: viem.Address): IPriceCandle {
  const feed = getMappedValue(priceFeed, token)

  if (feed.length === 0) {
    throw new Error("Price feed not found")
  }

  // get the latest price based on timestamp from unsorted array
  return feed[0]
}

export function isMirrorPosition(mp: IPosition): mp is IPosition {
  return 'mirror' in mp && mp.mirror !== null
}

export function isPositionSettled(trade: IPosition): boolean {
  return trade.settledTimestamp > 0
}

export function isPositionOpen(trade: IPosition): trade is IPosition {
  return trade.settledTimestamp === 0
}


export function getPuppetShare(puppetList: IPuppetPosition[], puppet: viem.Address): bigint {
  const position = puppetList.find(p => p.account === puppet)

  if (!position) throw new Error("Puppet not found")

  return position.collateral
}

export function getParticiapntCollateral(mp: IPosition, puppet?: viem.Address): bigint {
  return puppet ? getPuppetShare(mp.puppetList, puppet) : mp.maxCollateralInUsd
}

export function getParticiapntPortion(mp: IPosition, totalAmount: bigint, puppet?: viem.Address): bigint {
  const share = getParticiapntCollateral(mp, puppet)

  return getPortion(mp.maxCollateralInUsd, share, totalAmount)
}

export function getSettledMpPnL(mp: IPosition, puppet?: viem.Address): bigint {
  const realisedPnl = getParticiapntPortion(mp, mp.realisedPnlUsd, puppet)

  return realisedPnl
}



export function getPortion(supply: bigint, share: bigint, amount: bigint): bigint {
  if (supply === 0n || amount == 0n) return amount

  if (share == 0n) {
    return amount
  } else {
    return amount * share / supply
  }
}


