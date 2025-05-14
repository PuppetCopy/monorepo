import { getMarketIndexToken, getTokenDescription } from '@puppet/middleware/gmx'
import { factor } from '@puppet/middleware/utils'
import { $node, $text, O, style } from 'aelea/core'
import { $column, $row, $seperator, isDesktopScreen, isMobileScreen } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { Address, Hex } from 'viem'
import type { IPositionDecrease, IPositionIncrease, ITraderRouteLatestMetric } from '../__generated__/ponder.types'
import type { IPosition, ITraderRouteMetricSummary } from './type'

export const $metricEntry = (label: string, value: string) =>
  $row(style({ fontSize: '.8rem', alignItems: 'center' }))(
    $node(style({ color: pallete.foreground, flex: 1 }))($text(label)),
    $node(style({ fontWeight: 'bold' }))($text(value))
  )

export const $seperator2 = style(
  { backgroundColor: colorAlpha(pallete.foreground, 0.2), alignSelf: 'stretch', display: 'block' },
  $seperator
)

export function aggregatePositionList(list: (IPositionIncrease | IPositionDecrease)[]): IPosition[] {
  const sortedUpdateList = list.sort((a, b) => a.blockTimestamp - b.blockTimestamp)
  const openPositionMap = new Map<Hex, IPosition>()
  const positionList: IPosition[] = []

  for (let index = 0; index < sortedUpdateList.length; index++) {
    const next = sortedUpdateList[index]
    let position = openPositionMap.get(next.positionKey)

    if (!position) {
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

        // cumulativeSizeUsd: 0n,
        // cumulativeSizeToken: 0n,
        // cumulativeCollateralUsd: 0n,
        // cumulativeCollateralToken: 0n,

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

        lastUpdate: next
      }

      openPositionMap.set(next.positionKey, position)
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

      // position.cumulativeSizeToken += next.sizeInTokens
      // position.cumulativeSizeUsd += next.sizeInUsd
      // position.cumulativeCollateralToken += next.collateralAmount
      // position.cumulativeCollateralUsd += position.collateralInUsd

      position.increaseList.push(next)
    } else {
      // case where indexing ahead of prior position updates
      // if (position.cumulativeCollateralUsd === 0n) {
      //   position.maxCollateralInTokens = next.collateralAmount + next.collateralDeltaAmount
      //   position.maxCollateralInUsd = position.maxCollateralInTokens * next.collateralTokenPriceMax
      //   position.maxSizeInTokens = next.sizeInTokens > position.maxSizeInTokens ? next.sizeInTokens : position.maxSizeInTokens
      //   position.maxSizeInUsd = next.sizeInUsd > position.maxSizeInUsd ? next.sizeInUsd : position.maxSizeInUsd

      //   position.cumulativeCollateralToken = position.maxCollateralInTokens
      //   position.cumulativeCollateralUsd = position.maxCollateralInUsd
      //   position.cumulativeSizeToken = position.maxSizeInTokens
      //   position.cumulativeSizeUsd = position.maxSizeInUsd
      // }

      position.decreaseList.push(next)
      position.realisedPnlUsd += next.basePnlUsd

      if (next.sizeInTokens === 0n) {
        position.settledTimestamp = next.blockTimestamp

        positionList.push(position)
        openPositionMap.delete(next.positionKey)
      }
    }

    // if (position.maxSizeInTokens > 0n) {
    //   position.avgEntryPrice =
    //     (position.maxSizeInUsd / position.maxSizeInTokens) *
    //     getTokenDescription(getMarketIndexToken(next.market)).denominator
    // }
  }

  positionList.push(...openPositionMap.values())
  return positionList.reverse()
}

export function accountSettledPositionListSummary(
  account: Address,
  metricList: ITraderRouteLatestMetric[]
): ITraderRouteMetricSummary {
  const seedAccountSummary: ITraderRouteMetricSummary = {
    account,
    cumulativeCollateralUsd: 0n,
    cumulativeLongUsd: 0n,
    cumulativeSizeUsd: 0n,
    interval: 0,
    lastUpdatedTimestamp: 0,
    longShortRatio: 0n,
    pnl: 0n,
    realisedPnl: 0n,
    realisedRoi: 0n,
    roi: 0n,
    settledCollateralInUsd: 0n,
    settledSizeInUsd: 0n,

    lossCount: 0,
    winCount: 0,

    pnlTimeline: [],

    openPositionList: [],
    marketList: [],
    matchedPuppetList: []
  }

  const summary = metricList.reduce((seed, next, idx): ITraderRouteMetricSummary => {
    seed.cumulativeCollateralUsd += next.cumulativeCollateralUsd
    seed.cumulativeLongUsd += next.cumulativeLongUsd
    seed.cumulativeSizeUsd += next.cumulativeSizeUsd
    seed.interval += next.interval
    seed.lastUpdatedTimestamp += next.lastUpdatedTimestamp
    seed.longShortRatio += next.longShortRatio
    seed.pnl += next.pnl
    seed.realisedPnl += next.realisedPnl
    seed.realisedRoi += next.realisedRoi
    seed.roi += next.roi
    seed.settledCollateralInUsd += next.settledCollateralInUsd
    seed.settledSizeInUsd += next.settledSizeInUsd

    next.pnlList.forEach((pnl, idx) => {
      seed.lossCount += pnl < 0n ? 1 : 0
      seed.winCount += pnl > 0n ? 1 : 0

      seed.pnlTimeline.push({
        time: next.pnlTimestampList[idx],
        value: pnl,
        matchingKey: next.matchingKey
      })
    })

    seed.openPositionList.push(...next.openPositionList)

    seed.marketList = [...new Set([...seed.marketList, ...next.marketList])]
    seed.matchedPuppetList = [...new Set([...seed.matchedPuppetList, ...next.matchedPuppetList])]

    return seed
  }, seedAccountSummary)


  summary.pnlTimeline = summary.pnlTimeline.sort((a, b) => a.time - b.time)

  return summary
}
