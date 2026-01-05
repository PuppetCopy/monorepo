import type { IGmxPositionDecrease, IGmxPositionIncrease, ISubaccountLatestMetric } from '@puppet/database/schema'
import { getUnixTimestamp } from '@puppet/sdk/core'
import { style } from 'aelea/ui'
import { $seperator } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { Address, Hex } from 'viem'
import type { IPosition, ISubaccountMetricSummary } from './types'

export const $seperator2 = style(
  { backgroundColor: colorAlpha(pallete.foreground, 0.2), alignSelf: 'stretch', display: 'block' },
  $seperator
)

function positionLatestTimestamp(position: IPosition): number {
  return position.lastUpdate.sizeInUsd === 0n ? getUnixTimestamp() : position.lastUpdateTimestamp
}

export function aggregatePositionList(list: (IGmxPositionIncrease | IGmxPositionDecrease)[]): IPosition[] {
  const sortedUpdateList = list.sort((a, b) => a.blockTimestamp - b.blockTimestamp)
  const positionMap = new Map<Hex, IPosition>()
  const openPositionList: IPosition[] = []

  for (let index = 0; index < sortedUpdateList.length; index++) {
    const next = sortedUpdateList[index]
    let position = positionMap.get(next.positionKey)

    if (!position) {
      if (next.sizeInUsd !== next.sizeDeltaUsd || 'decreasedAtTime' in next) {
        // Ignore adjustments preceding the creation of the position
        continue
      }

      position = {
        key: next.positionKey,
        account: next.account,
        market: next.market,
        collateralToken: next.collateralToken,
        indexToken: next.indexToken,

        sizeInUsd: 0n,
        sizeInTokens: 0n,
        collateralInTokens: 0n,
        collateralInUsd: 0n,
        realisedPnlUsd: 0n,

        maxSizeInUsd: 0n,
        maxSizeInTokens: 0n,
        maxCollateralInTokens: 0n,
        maxCollateralInUsd: 0n,

        avgEntryPrice: 0n,

        isLong: next.isLong,

        lastUpdateTimestamp: 0,
        settledTimestamp: 0,

        puppetList: [],
        increaseList: [],
        decreaseList: [],

        collateralList: [],

        lastUpdate: next
      }

      positionMap.set(next.positionKey, position)
    }

    position.lastUpdate = next

    if ('increasedAtTime' in next) {
      position.sizeInUsd = next.sizeInUsd
      position.sizeInTokens = next.sizeInTokens
      position.collateralInTokens = next.collateralInTokens
      position.collateralInUsd = next.collateralInTokens * next.collateralTokenPriceMax

      position.maxSizeInTokens =
        next.sizeInTokens > position.maxSizeInTokens ? next.sizeInTokens : position.maxSizeInTokens
      position.maxSizeInUsd = next.sizeInUsd > position.maxSizeInUsd ? next.sizeInUsd : position.maxSizeInUsd
      position.maxCollateralInTokens =
        next.collateralInTokens > position.maxCollateralInTokens
          ? next.collateralInTokens
          : position.maxCollateralInTokens
      position.maxCollateralInUsd =
        position.collateralInUsd > position.maxCollateralInUsd ? position.collateralInUsd : position.maxCollateralInUsd

      position.increaseList.push(next)
    } else {
      position.decreaseList.push(next)
      position.realisedPnlUsd += next.basePnlUsd

      if (next.sizeInTokens === 0n) {
        position.lastUpdateTimestamp = next.blockTimestamp

        openPositionList.push(position)
        positionMap.delete(next.positionKey)
      }
    }

    if (next.sizeInUsd === 0n) {
      position.settledTimestamp = next.blockTimestamp
    }

    position.lastUpdateTimestamp = next.blockTimestamp
  }

  openPositionList.push(...positionMap.values())
  return openPositionList.sort((a, b) => {
    return positionLatestTimestamp(a) - positionLatestTimestamp(b)
  })
}

export function accountSettledPositionListSummary(
  account: Address,
  metricList: ISubaccountLatestMetric[]
): ISubaccountMetricSummary {
  const seedAccountSummary: ISubaccountMetricSummary = {
    account,
    realisedPnl: 0n,
    allocatedVolume: 0n,
    lossCount: 0,
    winCount: 0,
    pnlTimeline: [],
    matchedPuppetList: []
  }

  const summary = metricList.reduce((seed, next, _idx): ISubaccountMetricSummary => {
    seed.realisedPnl += next.realisedPnl
    seed.allocatedVolume += next.allocatedVolume

    next.pnlList.forEach((pnl: bigint, idx: number) => {
      seed.lossCount += pnl < 0n ? 1 : 0
      seed.winCount += pnl > 0n ? 1 : 0

      seed.pnlTimeline.push({
        time: next.pnlTimestampList[idx],
        value: pnl,
        subaccount: next.subaccount
      })
    })

    seed.matchedPuppetList = [...new Set([...seed.matchedPuppetList, ...next.matchedPuppetList])]

    return seed
  }, seedAccountSummary)

  summary.pnlTimeline = summary.pnlTimeline.sort((a: { time: number }, b: { time: number }) => a.time - b.time)

  return summary
}
