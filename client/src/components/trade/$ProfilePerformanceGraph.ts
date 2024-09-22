import { Behavior } from "@aelea/core"
import { $Node, NodeComposeFn, component, style } from "@aelea/dom"
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import { now, skipRepeatsWith } from "@most/core"
import { IntervalTime, USD_DECIMALS, createTimeline, formatFixed, unixTimestampNow } from "common-utils"
import { IPositionDecrease, IPositionIncrease, IPricefeedMap, IPricetick, getMarketIndexToken, getPositionPnlUsd, isUpdateDecrease, isUpdateIncrease } from "gmx-middleware-utils"
import { BaselineData, ChartOptions, DeepPartial, LineType, MouseEventParams, Time } from "lightweight-charts"
import { IPerformanceTimelineTick } from "puppet-middleware-utils"
import { $Baseline, IMarker } from "ui-components"
import * as viem from "viem"



type OpenPnl = {
  update: { sizeInUsd: bigint, sizeInTokens: bigint, isLong: boolean }
  indexToken: viem.Address
  pnl: bigint
}

type IPerformanceTimelineTick2 = { openPnlMap: Map<viem.Hex, OpenPnl> } & IPerformanceTimelineTick

export interface IPerformanceTimeline {
  pricefeedMap: IPricefeedMap
  activityTimeframe: IntervalTime
  puppet?: viem.Address
  list: (IPositionIncrease | IPositionDecrease)[]
  tickCount: number
  chartConfig?: DeepPartial<ChartOptions>
}

export function getPositionListTimelinePerformance(config: IPerformanceTimeline): IPerformanceTimelineTick2[] {
  if (config.list.length === 0) {
    return []
  }

  const timeNow = unixTimestampNow()
  const startTime = timeNow - config.activityTimeframe
  const initialPositionTime = config.list.map(pos => pos.blockTimestamp).reduce((a, b) => Math.min(a, b), config.list[0].blockTimestamp)
  const uniqueIndexTokenList = [...new Set(config.list.map(update => getMarketIndexToken(update.market)))]
  const priceUpdateTicks: IPricetickWithIndexToken[] = uniqueIndexTokenList
    .flatMap(indexToken =>
      config.pricefeedMap[indexToken].map(x => ({ indexToken, price: x.c, timestamp: x.slotTime })) ?? []
    )
    .filter(tick => tick.timestamp > initialPositionTime)

  const seed: IPerformanceTimelineTick2 = {
    value: 0,
    realisedPnl: 0n,
    openPnl: 0n,
    openPnlMap: new Map<viem.Hex, OpenPnl>(),
    pnl: 0n,
    time: startTime,
  }
  const data = createTimeline({
    source: [...config.list, ...priceUpdateTicks],
    seed: seed,
    getTime(item: IPositionIncrease | IPositionDecrease | IPricetickWithIndexToken) {
      return 'price' in item ? item.timestamp : item.blockTimestamp
    },
    seedMap: (acc, next) => {
      const nextTick = { ...acc }

      if ('price' in next) {
        acc.openPnlMap.forEach(openPosition => {
          if (next.indexToken !== openPosition.indexToken) {
            return
          }

          const currentPnl = getPositionPnlUsd(openPosition.update.isLong, openPosition.update.sizeInUsd, openPosition.update.sizeInTokens, next.price)

          console.log(currentPnl - openPosition.pnl)
          nextTick.openPnl += currentPnl - openPosition.pnl

          openPosition.pnl = currentPnl
        })

        nextTick.pnl = nextTick.realisedPnl + nextTick.openPnl

        nextTick.value = formatFixed(USD_DECIMALS, nextTick.pnl)

        return nextTick
      }


      let openPosition = acc.openPnlMap.get(next.positionKey)

      if (!openPosition) {
        openPosition = { pnl: 0n, update: next, indexToken: getMarketIndexToken(next.market) }
        acc.openPnlMap.set(next.positionKey, openPosition)
      }


      const currentPnl = getPositionPnlUsd(openPosition.update.isLong, openPosition.update.sizeInUsd, openPosition.update.sizeInTokens, next.indexTokenPriceMax)

      nextTick.openPnl += currentPnl - openPosition.pnl
      openPosition.update = next
      openPosition.pnl = currentPnl

      if (next.__typename === 'PositionDecrease') {
        if (openPosition.update.sizeInTokens === 0n) {
          acc.openPnlMap.delete(next.positionKey)
        }

        nextTick.realisedPnl += next.basePnlUsd
      }

      nextTick.pnl = nextTick.realisedPnl + nextTick.openPnl
      nextTick.value = formatFixed(USD_DECIMALS, nextTick.pnl)

      return nextTick
    },
  })

  return data
}



type IPricetickWithIndexToken = IPricetick & { indexToken: viem.Address }



export const $ProfilePerformanceGraph = (config: IPerformanceTimeline & { $container: NodeComposeFn<$Node> }) => component((
  [crosshairMove, crosshairMoveTether]: Behavior<MouseEventParams, MouseEventParams>,
) => {

  const timeline = getPositionListTimelinePerformance(config)

  const openMarkerList = config.list.filter(isUpdateIncrease).map((pos): IMarker => {
    const pnl = timeline[timeline.length - 1].value
    return {
      position: 'inBar',
      color: pnl < 0 ? pallete.negative : pallete.positive,
      time: unixTimestampNow() as Time,
      size: 1.5,
      shape: 'circle'
    }
  })

  const settledMarkerList = config.list.filter(isUpdateDecrease).map((pos): IMarker => {
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




