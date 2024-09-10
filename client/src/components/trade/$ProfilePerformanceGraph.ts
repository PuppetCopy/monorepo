import { Behavior } from "@aelea/core"
import { $Node, NodeComposeFn, component, style } from "@aelea/dom"
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import { now, skipRepeatsWith } from "@most/core"
import { IntervalTime, USD_DECIMALS, createTimeline, formatFixed, unixTimestampNow } from "common-utils"
import { IPositionDecrease, IPositionIncrease, IPricefeedMap, IPricetick, getMarketIndexToken, getPositionPnlUsd, isPositionOpen, isPositionSettled } from "gmx-middleware-utils"
import { BaselineData, ChartOptions, DeepPartial, LineType, MouseEventParams, Time } from "lightweight-charts"
import { ILeaderboardPosition, IPosition, getLatestPriceFeedPrice } from "puppet-middleware-utils"
import { $Baseline, IMarker } from "ui-components"
import * as viem from "viem"



export interface IPerformanceTimeline {
  pricefeedMap: IPricefeedMap
  activityTimeframe: IntervalTime
  puppet?: viem.Address
  list: IPosition[]
  tickCount: number
  chartConfig?: DeepPartial<ChartOptions>
}

type OpenPnl = {
  update: { sizeInUsd: bigint, sizeInTokens: bigint, isLong: boolean }
  indexToken: viem.Address
  pnl: bigint
}


type IPricetickWithIndexToken = IPricetick & { indexToken: viem.Address }


function getTime(item: IPositionIncrease | IPositionDecrease | IPricetickWithIndexToken): number {
  return 'price' in item ? item.timestamp : item.blockTimestamp
}

export function getPositionListTimelinePerformance(config: IPerformanceTimeline) {
  if (config.list.length === 0) {
    return []
  }

  const timeNow = unixTimestampNow()
  const startTime = timeNow - config.activityTimeframe
  const initialPositionTime = config.list.map(pos => pos.openTimestamp).reduce((a, b) => Math.min(a, b), config.list[0].openTimestamp)
  const adjustList: (IPositionIncrease | IPositionDecrease)[] = config.list.flatMap(mp => [...mp.increaseList, ...mp.decreaseList]).sort((a, b) => a.blockTimestamp - b.blockTimestamp)
  const uniqueIndexTokenList = [...new Set(config.list.map(update => getMarketIndexToken(update.market)))]
  const priceUpdateTicks: IPricetickWithIndexToken[] = uniqueIndexTokenList
    .flatMap(indexToken =>
      config.pricefeedMap[indexToken].map(x => ({ indexToken, price: x.c, timestamp: x.timestamp })) ?? []
    )
    .filter(tick => tick.timestamp > initialPositionTime)

  const data = createTimeline({
    source: [...adjustList, ...priceUpdateTicks],
    seed: {
      value: 0,
      realisedPnl: 0n,
      openPnlMap: {},
      time: startTime,
    },
    getTime,
    seedMap: (acc, next) => {
      let realisedPnl = acc.realisedPnl
      let openPnl: OpenPnl

      const openPnlMap: Record<viem.Hex, OpenPnl> = acc.openPnlMap

      if ('price' in next) {
        for (const positionKey in openPnlMap) {
          const openPnl = openPnlMap[positionKey as viem.Hex]

          if (next.indexToken === openPnl.indexToken) {
            openPnl.pnl = getPositionPnlUsd(openPnl.update.isLong, openPnl.update.sizeInUsd, openPnl.update.sizeInTokens, next.price)
          }
        }

      } else {
        const indexToken = getMarketIndexToken(next.market)
        openPnl = openPnlMap[next.positionKey] ??= { pnl: 0n, update: next, indexToken }

        if (next.__typename === 'PositionIncrease') {
          openPnl.update = next
          openPnl.pnl = getPositionPnlUsd(openPnl.update.isLong, openPnl.update.sizeInUsd, openPnl.update.sizeInTokens, next.indexTokenPriceMax)
        } else {
          openPnl.update = next
          realisedPnl += next.basePnlUsd

          openPnl.pnl = openPnl.update.sizeInTokens > 0n ? getPositionPnlUsd(openPnl.update.isLong, openPnl.update.sizeInUsd, openPnl.update.sizeInTokens, next.indexTokenPriceMax) : 0n
        }
      }

      const aggregatedOpenPnl = Object.values(openPnlMap).reduce((acc, next) => acc + next.pnl, 0n)
      const value = formatFixed(USD_DECIMALS, realisedPnl + aggregatedOpenPnl)

      return { openPnlMap, realisedPnl, value }
    },
  })

  return data
}

export const $ProfilePerformanceGraph = (config: IPerformanceTimeline & { $container: NodeComposeFn<$Node> }) => component((
  [crosshairMove, crosshairMoveTether]: Behavior<MouseEventParams, MouseEventParams>,
) => {

  const timeline = getPositionListTimelinePerformance(config)

  const openMarkerList = config.list.filter(isPositionOpen).map((pos): IMarker => {
    const pnl = timeline[timeline.length - 1].value
    return {
      position: 'inBar',
      color: pnl < 0 ? pallete.negative : pallete.positive,
      time: unixTimestampNow() as Time,
      size: 1.5,
      shape: 'circle'
    }
  })
  const settledMarkerList = config.list.filter(isPositionSettled).flatMap(pos => pos.decreaseList).map((pos): IMarker => {
    return {
      position: 'inBar',
      color: colorAlpha(pallete.message, .15),
      time: Number(pos.blockTimestamp) as Time,
      size: 0.1,
      shape: 'circle'
    }
  })

  const allMarkerList = [...settledMarkerList, ...openMarkerList].sort((a, b) => Number(a.time) - Number(b.time))


  return [
    config.$container(
      $Baseline({
        containerOp: style({ inset: '0px 0px 0px 0px', position: 'absolute' }),
        markers: now(allMarkerList),
        chartConfig: {
          width: 100,
          leftPriceScale: {
            // autoScale: true,
            ticksVisible: true,
            scaleMargins: {
              top: 0,
              bottom: 0,
            }
          },
          crosshair: {
            horzLine: {
              visible: false,
            },
            vertLine: {
              visible: false,
            }
          },
          // height: 150,
          // width: 100,
          timeScale: {
            visible: false
          },
          // ...config.chartConfig
        },
        data: timeline as any as BaselineData[],
        // containerOp: style({  inset: '0px 0px 0px 0px' }),
        baselineOptions: {
          baseValue: {
            price: 0,
            type: 'price',
          },
          lineWidth: 1,
          lineType: LineType.Curved,
        },
      })({
        crosshairMove: crosshairMoveTether(
          skipRepeatsWith((a, b) => a.point?.x === b.point?.x)
        )
      }),
    ),

    {
      crosshairMove,
      // requestPricefeed
    }
  ]
})

export interface ILeaderboardPerformanceTimeline {
  activityTimeframe: IntervalTime
  puppet?: viem.Address
  list: ILeaderboardPosition[]
  tickCount: number
  pricefeedMap: IPricefeedMap
  chartConfig?: DeepPartial<ChartOptions>
}

export function getLeaderboardPositionTimelinePerformance(config: ILeaderboardPerformanceTimeline) {
  if (config.list.length === 0) {
    return []
  }

  const timeNow = unixTimestampNow()
  const startTime = timeNow - config.activityTimeframe
  const initialPositionTime = config.list.map(pos => pos.openTimestamp).reduce((a, b) => Math.min(a, b), config.list[0].openTimestamp)
  const uniqueIndexTokenList = [...new Set(config.list.map(update => getMarketIndexToken(update.market)))]
  const priceUpdateTicks: IPricetickWithIndexToken[] = uniqueIndexTokenList
    .flatMap(indexToken =>
      config.pricefeedMap[indexToken].map(x => ({ indexToken, price: x.c, timestamp: x.timestamp })) ?? []
    )
    .filter(tick => tick.timestamp > initialPositionTime)

  const timeline = createTimeline({
    ticks: config.tickCount,
    source: [...config.list, ...priceUpdateTicks],
    seed: {
      value: 0,
      realisedPnl: 0n,
      openPnlMap: {},
      time: startTime,
    },
    seedMap: (acc, next) => {
      let realisedPnl = acc.realisedPnl
      let openPnl: OpenPnl

      const openPnlMap: Record<viem.Hex, OpenPnl> = acc.openPnlMap

      if ('price' in next) {
        for (const positionKey in openPnlMap) {
          const openPnl = openPnlMap[positionKey as viem.Hex]

          if (next.indexToken === openPnl.indexToken) {
            openPnl.pnl = getPositionPnlUsd(openPnl.update.isLong, openPnl.update.sizeInUsd, openPnl.update.sizeInTokens, next.price)
          }
        }

      } else {
        const indexToken = getMarketIndexToken(next.market)
        openPnl = openPnlMap[`${next.account}:${next.market}:${next.isLong}:${next.openTimestamp}`] ??= { pnl: 0n, update: next, indexToken }

        if (next.__typename === 'Position') {
          openPnl.update = next
        }
      }

      const aggregatedOpenPnl = Object.values(openPnlMap).reduce((acc, next) => acc + next.pnl, 0n)
      const value = formatFixed(USD_DECIMALS, realisedPnl + aggregatedOpenPnl)

      return { openPnlMap, realisedPnl, value }
    },
    getTime: src => 'price' in src ? src.timestamp : src.openTimestamp,
  })

  return timeline
}

export const $LeaderboardPerformanceTimeline = (config: ILeaderboardPerformanceTimeline & { $container: NodeComposeFn<$Node> }) => component((
  [crosshairMove, crosshairMoveTether]: Behavior<MouseEventParams, MouseEventParams>,
) => {

  const timeline = getLeaderboardPositionTimelinePerformance(config)
  const markerList = config.list
    .map(pos => {
      return {
        position: 'inBar',
        color: colorAlpha(pallete.message, .15),
        time: pos.openTimestamp as Time,
        size: 0.1,
        shape: 'circle'
      }
    })
    .sort((a, b) => Number(a.time) - Number(b.time))


  return [
    config.$container(
      $Baseline({
        containerOp: style({ inset: '0px 0px 0px 0px', position: 'absolute' }),
        markers: now(markerList as IMarker[]),
        chartConfig: {
          width: 100,
          leftPriceScale: {
            // autoScale: true,
            ticksVisible: true,
            scaleMargins: {
              top: 0,
              bottom: 0,
            }
          },
          crosshair: {
            horzLine: {
              visible: false,
            },
            vertLine: {
              visible: false,
            }
          },
          // height: 150,
          // width: 100,
          timeScale: {
            visible: false
          },
          // ...config.chartConfig
        },
        data: timeline as any as BaselineData[],
        // containerOp: style({  inset: '0px 0px 0px 0px' }),
        baselineOptions: {
          baseValue: {
            price: 0,
            type: 'price',
          },
          lineWidth: 1,
          lineType: LineType.Curved,
        },
      })({
        crosshairMove: crosshairMoveTether(
          skipRepeatsWith((a, b) => a.point?.x === b.point?.x)
        )
      }),
    ),

    {
      crosshairMove,
      // requestPricefeed
    }
  ]
})




