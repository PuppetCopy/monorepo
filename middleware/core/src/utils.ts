import { combineArray, map, now } from "@most/core"
import { Stream } from "@most/types"
import { getMarketIndexToken, getPositionPnlUsd } from "gmx-middleware-utils"
import * as viem from "viem"
import { latestPriceMap } from "./graph.js"
import { IMirrorListSummary, IMirrorPosition, IPosition, IPuppetPosition } from "./types.js"
import { factor } from "common-utils"


export function accountSettledPositionListSummary(
  tradeList: IPosition[],
  puppet?: viem.Address,
): IMirrorListSummary {
  const fst = tradeList[0]
  const account = isMirrorPosition(fst) ? fst.mirror.trader : fst.account

  const seedAccountSummary: IMirrorListSummary = {
    account,
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

    // const lstFeeUpdate = lst(next.feeUpdateList)

    const fee = seed.fee + getParticiapntPortion(next, 0n, puppet)
    // const fee = seed.fee + getParticiapntPortion(next, lstFeeUpdate.totalCostAmount, puppet)
    const pnl = seed.pnl + getParticiapntPortion(next, next.realisedPnlUsd, puppet)

    const winCount = seed.winCount + (next.realisedPnlUsd > 0n ? 1 : 0)
    const lossCount = seed.lossCount + (next.realisedPnlUsd <= 0n ? 1 : 0)

    const puppets = isMirrorPosition(next) ? [...seed.puppets, ...next.mirror.puppetList.map(p => p.account).filter(x => !seed.puppets.includes(x))] : seed.puppets

    return {
      account: seed.account,
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

export function getLastAdjustment(mp: IPosition) {
  const allAdjustmentList = [...mp.increaseList, ...mp.decreaseList].sort((a, b) => Number(b.blockTimestamp - a.blockTimestamp))

  if (allAdjustmentList.length === 0) {
    throw new Error("position has no updates")
  }

  return allAdjustmentList[0]
}
