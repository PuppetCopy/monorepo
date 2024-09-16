import { combineArray, map, now } from "@most/core"
import { Stream } from "@most/types"
import { getMarketIndexToken, getPositionPnlUsd, IPriceCandle, IPricefeedMap } from "gmx-middleware-utils"
import * as viem from "viem"
import { latestPriceMap } from "./graph.js"
import { ILeaderboardPosition, ILeaderboardSummary, IMirrorListSummary, IMirrorPosition, IPosition, IPuppetPosition } from "./types.js"
import { factor, getMappedValue } from "common-utils"


export function accountSettledPositionListSummary(
  tradeList: IPosition[],
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

  const summary = tradeList.reduce((seed, next, idx): IMirrorListSummary => {
    const idxBn = BigInt(idx) + 1n

    const size = seed.size + getParticiapntPortion(next, next.maxSizeInUsd, puppet)
    const collateral = seed.collateral + getParticiapntPortion(next, next.maxCollateralInUsd, puppet)
    const cumulativeLeverage = seed.cumulativeLeverage + getParticiapntPortion(next, factor(next.maxSizeInUsd, next.maxCollateralInUsd), puppet)

    const avgSize = size / idxBn
    const avgCollateral = collateral / idxBn

    const fee = seed.fee + getParticiapntPortion(next, 0n, puppet)
    const pnl = seed.pnl + getParticiapntPortion(next, next.pnlUsd, puppet)

    const winCount = seed.winCount + (next.pnlUsd > 0n ? 1 : 0)
    const lossCount = seed.lossCount + (next.pnlUsd < 0n ? 1 : 0)

    const puppets = isMirrorPosition(next) ? [...seed.puppets, ...next.mirror.puppetList.map(p => p.account).filter(x => !seed.puppets.includes(x))] : seed.puppets

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

export function leaderboardSummary(pricefeedMap: IPricefeedMap, tradeList: ILeaderboardPosition[]): ILeaderboardSummary[] {
  const map: { [k: viem.Address]: ILeaderboardSummary } = {}

  for (const next of tradeList) {
    const summary = map[next.account] ??= {
      account: next.account,
      cumulativeCollateral: 0n,
      cumulativeSize: 0n,
      maxCollateral: 0n,
      maxSize: 0n,
      leverage: 0n,
      lossCount: 0,
      winCount: 0,
      pnl: 0n,
      puppets: [],
      positionList: [],
    }

    summary.cumulativeCollateral += next.maxCollateralInUsd
    summary.cumulativeSize += next.maxSizeInTokens
    summary.maxCollateral = next.maxCollateralInUsd > summary.maxCollateral ? next.maxCollateralInUsd : summary.maxCollateral
    summary.maxSize = next.maxSizeInUsd > summary.maxSize ? next.maxSizeInUsd : summary.maxSize
    summary.leverage = summary.maxSize / summary.maxCollateral

    if (next.sizeInTokens === 0n) {
      summary.pnl += next.realisedPnlUsd

      summary.winCount += next.realisedPnlUsd > 0n ? 1 : 0
      summary.lossCount += next.realisedPnlUsd < 0n ? 1 : 0
    } else {

      try {
        const priceCandle = getLatestPriceFeedPrice(pricefeedMap, getMarketIndexToken(next.market))
        const pnl = next.realisedPnlUsd + getPositionPnlUsd(next.isLong, next.sizeInUsd, next.sizeInTokens, priceCandle.c)
        summary.pnl += pnl
        summary.winCount += pnl > 0n ? 1 : 0
        summary.lossCount += pnl < 0n ? 1 : 0
      } catch (e) {
        console.error(e)
        continue
      }

    }



    summary.puppets = []
    summary.positionList.push(next)

    map[next.account] = summary
  }


  return Object.values(map)
}


export function getLatestPriceFeedPrice(priceFeed: IPricefeedMap, token: viem.Address): IPriceCandle {
  const feed = getMappedValue(priceFeed, token)

  if (feed.length === 0) {
    throw new Error("Price feed not found")
  }

  // get the latest price based on timestamp from unsorted array
  return feed[0]
}

export function isMirrorPosition(mp: IPosition): mp is IMirrorPosition {
  return 'mirror' in mp && mp.mirror !== null
}

export function openPositionListPnl(
  tradeList: IPosition[],
  puppet?: viem.Address,
): Stream<bigint> {

  if (tradeList.length === 0) return now(0n)

  const pnlList = tradeList.map(mp => {
    const indexToken = getMarketIndexToken(mp.market)
    return map(pm => {
      const markPrice = pm[indexToken].max
      const pnl = getOpenMpPnL(mp, markPrice, puppet)
      return pnl
    }, latestPriceMap)
  })

  return combineArray((...pl) => {
    return pl.reduce((seed, next) => seed + next, 0n)
  }, pnlList)
}

export function getPuppetShare(puppetList: IPuppetPosition[], puppet: viem.Address): bigint {
  const position = puppetList.find(p => p.account === puppet)

  if (!position) throw new Error("Puppet not found")

  return position.collateral
}

export function getParticiapntCollateral(mp: IMirrorPosition, puppet?: viem.Address): bigint {
  return puppet ? getPuppetShare(mp.mirror.puppetList, puppet) : mp.collateralAmount
}

export function getParticiapntPortion(mp: IPosition, totalAmount: bigint, puppet?: viem.Address): bigint {
  const share = isMirrorPosition(mp) ? getParticiapntCollateral(mp, puppet) : mp.collateralAmount

  return getPortion(mp.collateralAmount, share, totalAmount)
}

export function getSettledMpPnL(mp: IPosition, puppet?: viem.Address): bigint {
  const realisedPnl = getParticiapntPortion(mp, mp.realisedPnlUsd, puppet)

  return realisedPnl
}

export function getOpenMpPnL(mp: IPosition, markPrice: bigint, puppet?: viem.Address): bigint {
  const pnl = getPositionPnlUsd(mp.isLong, mp.sizeInUsd, mp.sizeInTokens, markPrice)
  const openPnl = getParticiapntPortion(mp, pnl, puppet)

  return openPnl
}

export function getPortion(supply: bigint, share: bigint, amount: bigint): bigint {
  if (supply === 0n || amount == 0n) return amount

  if (share == 0n) {
    return amount
  } else {
    return amount * share / supply
  }
}

export function getLastAdjustment(mp: IPosition) {
  const allAdjustmentList = [...mp.increaseList, ...mp.decreaseList].sort((a, b) => Number(b.blockTimestamp - a.blockTimestamp))

  if (allAdjustmentList.length === 0) {
    throw new Error("position has no updates")
  }

  return allAdjustmentList[0]
}
