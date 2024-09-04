import { Behavior } from "@aelea/core"
import { $Node, NodeComposeFn, component, style } from "@aelea/dom"
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import { now, skipRepeatsWith } from "@most/core"
import { IntervalTime, createTimeline, formatFixed, unixTimestampNow } from "common-utils"
import { IPositionDecrease, IPositionIncrease, IPricefeedMap, IPricetick, getMarketIndexToken, getPositionPnlUsd, isPositionOpen, isPositionSettled } from "gmx-middleware-utils"
import { BaselineData, ChartOptions, DeepPartial, LineType, MouseEventParams, Time } from "lightweight-charts"
import { ILeaderboardPosition, IPosition } from "puppet-middleware-utils"
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
  isLong: boolean
  pnl: bigint
  sizeInUsd: bigint
  sizeInTokens: bigint
}

interface IGraphLTick {
  realisedPnl: bigint
  openPnlMap: Record<viem.Hex, OpenPnl>
  value: number
  time: number
}

type IPricetickWithIndexToken = IPricetick & { indexToken: viem.Address }


function getTime(item: IPositionIncrease | IPositionDecrease | IPricetickWithIndexToken): number {
  return 'price' in item ? item.timestamp : item.blockTimestamp
}

export function getPosolitionListTimelinePerformance(config: IPerformanceTimeline) {
  const timeNow = unixTimestampNow()
  const startTime = timeNow - config.activityTimeframe
  const adjustList: (IPositionIncrease | IPositionDecrease)[] = config.list.flatMap(mp => [...mp.increaseList, ...mp.decreaseList])
  const uniqueIndexTokenList = [...new Set(config.list.map(update => getMarketIndexToken(update.market)))]
  const priceUpdateTicks: IPricetickWithIndexToken[] = uniqueIndexTokenList.flatMap(indexToken => config.pricefeedMap[indexToken].map(x => ({ indexToken, price: x.c, timestamp: x.timestamp })) ?? [])

  const seed: IGraphLTick = {
    value: 0,
    realisedPnl: 0n,
    openPnlMap: {},
    time: startTime,
  }

  const data = createTimeline({
    source: [...adjustList, ...priceUpdateTicks],
    seed,
    getTime,
    seedMap: (acc, next) => {
      let value = acc.value
      let realisedPnl = acc.realisedPnl
      let indexToken: viem.Address
      let openPnl: OpenPnl

      const openPnlMap: Record<viem.Hex, OpenPnl> = { ...acc.openPnlMap }

      if ('price' in next) {
        indexToken = next.indexToken
        openPnl = openPnlMap[indexToken]

        if (!openPnl) {
          throw new Error('OpenPnl not found')
        }

        openPnl.pnl = getPositionPnlUsd(openPnl.isLong, openPnl.sizeInUsd, openPnl.sizeInTokens, next.price)
      } else {
        indexToken = getMarketIndexToken(next.market)
        openPnl = openPnlMap[indexToken] = { ...acc.openPnlMap[indexToken] }

        if (next.__typename === 'PositionIncrease') {
          openPnl.isLong = next.isLong
          openPnl.sizeInTokens += next.sizeDeltaInTokens
          openPnl.sizeInUsd += next.sizeDeltaUsd

          openPnl.pnl = getPositionPnlUsd(openPnl.isLong, openPnl.sizeInUsd, openPnl.sizeInTokens, next.indexTokenPriceMax)
        } else {
          openPnl.sizeInTokens -= next.sizeDeltaInTokens
          openPnl.sizeInUsd -= next.sizeDeltaUsd
          realisedPnl += next.basePnlUsd

          openPnl.pnl = openPnl.sizeInTokens > 0n ? getPositionPnlUsd(openPnl.isLong, openPnl.sizeInUsd, openPnl.sizeInTokens, next.indexTokenPriceMax) : 0n
        }


      }

      const aggregatedOpenPnl = Object.values(openPnlMap).reduce((acc, next) => acc + next.pnl, 0n)

      value = formatFixed(30, realisedPnl + aggregatedOpenPnl)

      return { openPnlMap, realisedPnl, value }
    },
  })

  return data
}

export const $ProfilePerformanceGraph = (config: IPerformanceTimeline & { $container: NodeComposeFn<$Node> }) => component((
  [crosshairMove, crosshairMoveTether]: Behavior<MouseEventParams, MouseEventParams>,
) => {

  const timeline = getPosolitionListTimelinePerformance(config)

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
  chartConfig?: DeepPartial<ChartOptions>
}

export function getLeaderboardPositionTimelinePerformance(config: ILeaderboardPerformanceTimeline) {
  const timeNow = unixTimestampNow()
  const startTime = timeNow - config.activityTimeframe

  const seed = {
    value: 0,
    realisedPnl: 0n,
    time: startTime,
  }

  return createTimeline({
    source: config.list,
    seed,
    seedMap: (acc, next) => {

      const realisedPnl = acc.realisedPnl + next.realisedPnlUsd
      const value = formatFixed(30, realisedPnl)

      return { realisedPnl, value }
    },
    getTime: src => src.settledTimestamp,
  })
}

export const $LeaderboardPerformanceTimeline = (config: ILeaderboardPerformanceTimeline & { $container: NodeComposeFn<$Node> }) => component((
  [crosshairMove, crosshairMoveTether]: Behavior<MouseEventParams, MouseEventParams>,
) => {

  const timeline = getLeaderboardPositionTimelinePerformance(config)
  const markerList = config.list
    .map((pos): IMarker => {
      return {
        position: 'inBar',
        color: colorAlpha(pallete.message, .15),
        time: pos.settledTimestamp as Time,
        size: 0.1,
        shape: 'circle'
      }
    })
    .sort((a, b) => Number(a.time) - Number(b.time))


  return [
    config.$container(
      $Baseline({
        containerOp: style({ inset: '0px 0px 0px 0px', position: 'absolute' }),
        markers: now(markerList),
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




