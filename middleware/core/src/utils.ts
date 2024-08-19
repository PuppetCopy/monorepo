import { combineArray, map, now } from "@most/core"
import { Stream } from "@most/types"
import { getMarketToken, getPositionPnlUsd } from "gmx-middleware-utils"
import * as viem from "viem"
import { latestPriceMap } from "./graph.js"
import { IMirrorAbstract, IMirrorListSummary, IMirrorSeed, IMirror } from "./types.js"
import { factor, lst } from "common-utils"


// export function extractPricefeedFromPositionList(
//   positionList: (IMirrorPositionOpen | IMirrorPositionSettled)[]
// ): IPricetickListMap {
//   const pricefeedMap: IPricetickListMap = {}

//   for (const mp of positionList) {
//     const indexToken = mp.position.indexToken

//     const adjustmentList = [...mp.position.link.increaseList, ...mp.position.link.decreaseList]
//     for (const update of adjustmentList) {
//       pricefeedMap[indexToken] ??= []
//       pricefeedMap[indexToken].push({ 
//         timestamp: Number(update.blockTimestamp),
//         price: update.indexTokenPriceMin,
//         token: indexToken
//       })
//     }
//   }

//   return pricefeedMap
// }

export function accountSettledPositionListSummary(
  tradeList: (IMirror | IMirrorSeed)[],
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
    pnl: 0n,
    winCount: 0,
  }

  const summary = tradeList.reduce((seed, next, idx): IMirrorListSummary => {
    const idxBn = BigInt(idx) + 1n

    const size = seed.size + getParticiapntPortion(next, next.maxSizeUsd, puppet)
    const collateral = seed.collateral + getParticiapntPortion(next, next.maxCollateralUsd, puppet)
    const cumulativeLeverage = seed.cumulativeLeverage + getParticiapntPortion(next, factor(next.maxSizeUsd, next.maxCollateralUsd), puppet)

    const avgSize = size / idxBn
    const avgCollateral = collateral / idxBn

    // const lstFeeUpdate = lst(next.link.feeUpdateList)

    const fee = seed.fee + getParticiapntPortion(next, 0n, puppet)
    // const fee = seed.fee + getParticiapntPortion(next, lstFeeUpdate.totalCostAmount, puppet)
    const pnl = seed.pnl + getParticiapntPortion(next, next.realisedPnlUsd, puppet)

    const winCount = seed.winCount + (next.realisedPnlUsd > 0n ? 1 : 0)
    const lossCount = seed.lossCount + (next.realisedPnlUsd <= 0n ? 1 : 0)

    const puppets = next.mirror ? [...seed.puppets, ...next.mirror.puppetList.filter(x => !seed.puppets.includes(x))] : seed.puppets

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

export function openPositionListPnl(
  tradeList: IMirrorSeed[],
  puppet?: viem.Address,
): Stream<bigint> {

  if (tradeList.length === 0) return now(0n)

  const pnlList = tradeList.map(mp => {
    const indexToken = getMarketToken(mp.market).indexToken
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

export function getPuppetShare(collateralList: readonly bigint[], puppets: readonly viem.Address[], puppet: viem.Address): bigint {
  const idx = puppets.indexOf(puppet)

  if (idx == -1) throw new Error("Puppet not found")

  const share = collateralList[idx]

  if (share === undefined) throw new Error("Puppet share not found")

  return share
}

export function getParticiapntCollateral(mp: IMirrorAbstract, puppet?: viem.Address): bigint {
  if (!mp.mirror || !puppet) return mp.collateralAmount
  if (mp.mirror.puppetList.indexOf(puppet) === -1) throw new Error("Account is not a participant")

  return getPuppetShare(mp.mirror.collateralList, mp.mirror.puppetList, puppet)
}

export function getParticiapntPortion(mp: IMirrorAbstract, totalAmount: bigint, puppet?: viem.Address): bigint {
  const share = getParticiapntCollateral(mp, puppet)

  return getPortion(mp.collateralAmount, share, totalAmount)
}

export function getSettledMpPnL(mp: IMirrorAbstract, puppet?: viem.Address): bigint {
  const realisedPnl = getParticiapntPortion(mp, mp.realisedPnlUsd, puppet)

  return realisedPnl
}

export function getOpenMpPnL(mp: IMirrorSeed | IMirror, markPrice: bigint, puppet?: viem.Address): bigint {
  const pnl = getPositionPnlUsd(mp.isLong, mp.sizeInUsd, mp.sizeInTokens, markPrice)
  const openPnl = getParticiapntPortion(mp, pnl, puppet)
  const realisedPnl = getSettledMpPnL(mp, puppet)

  return realisedPnl + openPnl
}

export function getPortion(supply: bigint, share: bigint, amount: bigint): bigint {
  if (supply === 0n || amount == 0n) return amount

  if (share == 0n) {
    return amount
  } else {
    return amount * share / supply
  }
}

export function getLastAdjustment(mp: IMirrorAbstract) {
  const allAdjustmentList = [...mp.link.increaseList, ...mp.link.decreaseList].sort((a, b) => Number(b.blockTimestamp - a.blockTimestamp))

  if (allAdjustmentList.length === 0) {
    throw new Error("position has no updates")
  }

  return allAdjustmentList[0]
}
