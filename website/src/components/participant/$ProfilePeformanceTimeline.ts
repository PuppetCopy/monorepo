import { empty, map, skipRepeatsWith, startWith, switchLatest } from '@most/core'
import type { Stream } from '@most/types'
import { type IntervalTime, USD_DECIMALS } from '@puppet/middleware/const'
import { $Baseline, $infoTooltipLabel, $intermediatePromise, type ISeriesTime } from '@puppet/middleware/ui-components'
import {
  fillTimeline,
  filterNull,
  formatFixed,
  parseReadableNumber,
  readableUnitAmount,
  unixTimestampNow
} from '@puppet/middleware/utils'
import { $node, $text, combineState, component, type IBehavior, motion, style, switchMap } from 'aelea/core'
import { $column, $NumberTicker, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { BaselineData, MouseEventParams } from 'lightweight-charts'
import type { Hex } from 'viem'
import type { Address } from 'viem/accounts'
import type { IPageFilterParams, ITraderRouteMetricSummary } from '../../pages/type.js'
import { $SelectCollateralToken } from '../$CollateralTokenSelector.js'
import { $LastAtivity } from '../$LastActivity.js'

interface IProfilePeformanceTimeline extends IPageFilterParams {
  metricsQuery: Stream<Promise<ITraderRouteMetricSummary>>
}

export const $TradeRouteTimeline = ({
  activityTimeframe,
  collateralTokenList,
  metricsQuery
}: IProfilePeformanceTimeline) =>
  component(
    (
      [crosshairMove, crosshairMoveTether]: IBehavior<MouseEventParams>,
      [selectCollateralTokenList, selectCollateralTokenListTether]: IBehavior<Address[]>,
      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<any, IntervalTime>
    ) => {
      const timelineQuery = map(async (params) => {
        const pos = await params.metricsQuery

        if (pos.pnlTimeline.length === 0) {
          return []
        }

        const endTime = unixTimestampNow()
        const startTime = endTime - params.activityTimeframe
        const sourceList = [
          { value: 0n, time: startTime, traderMatchingKey: pos.pnlTimeline[0].traderMatchingKey },
          ...pos.pnlTimeline.filter((item) => item.time > startTime),
          { value: 0n, time: endTime, traderMatchingKey: '0xdead' as Hex }
        ]

        const sumMap = new Map<Hex, bigint>()

        const timelinbe = fillTimeline({
          sourceList,
          ticks: 280,
          getTime: (item) => item.time,
          sourceMap: (next) => {
            sumMap.set(next.traderMatchingKey, next.value)

            const sum = [...sumMap.values()].reduce((acc, curr) => acc + curr, 0n)

            return formatFixed(USD_DECIMALS, sum)
          }
        })

        return timelinbe
      }, combineState({ metricsQuery, activityTimeframe }))

      return [
        $column(style({ width: '100%', padding: 0, height: '200px', placeContent: 'center' }))(
          $row(
            style({
              position: 'absolute',
              top: '14px',
              left: isDesktopScreen ? '20px' : '12px',
              right: isDesktopScreen ? '20px' : '12px',
              alignSelf: 'center',
              zIndex: 11,
              alignItems: 'flex-start'
            })
          )(
            $row(style({ flex: 1 }))(
              $SelectCollateralToken({
                selectedList: collateralTokenList
              })({
                changeCollateralTokenList: selectCollateralTokenListTether()
              })
            ),
            switchLatest(
              switchMap(async (paramsQuery) => {
                const timeline = await paramsQuery

                if (timeline.length === 0) {
                  return empty()
                }

                const pnlCrossHairTimeChange = startWith(
                  null,
                  skipRepeatsWith((xsx, xsy) => {
                    return xsx.time === xsy.time
                  }, crosshairMove)
                )
                const hoverChartPnl = filterNull(
                  map((cross) => {
                    if (cross?.point) {
                      const value = cross.seriesData.values().next().value?.value || 0
                      return value
                    }

                    const value = timeline[timeline.length - 1].value
                    return value ?? null
                  }, pnlCrossHairTimeChange)
                )

                return $column(style({ flex: 1, alignItems: 'center' }))(
                  $NumberTicker({
                    textStyle: {
                      fontSize: '1.45rem',
                      fontWeight: '900'
                    },
                    // background: `radial-gradient(${colorAlpha(invertColor(pallete.message), .7)} 9%, transparent 63%)`,
                    value$: map(
                      (hoverValue) => {
                        const newLocal2 = readableUnitAmount(hoverValue)
                        const newLocal = parseReadableNumber(newLocal2)
                        return newLocal
                      },
                      motion({ damping: 26, precision: 15, stiffness: 210 }, 0, hoverChartPnl)
                    ),
                    incrementColor: pallete.positive,
                    decrementColor: pallete.negative
                  }),
                  $infoTooltipLabel('The total combined settled and open trades', $text('PnL'))
                )
              }, timelineQuery)
            ),
            $row(style({ flex: 1 }))(
              $node(style({ flex: 1 }))(),

              $LastAtivity(activityTimeframe)({
                changeActivityTimeframe: changeActivityTimeframeTether()
              })
            )
          ),
          $intermediatePromise({
            $display: map(
              async (params) => {
                const timeline = await params.timelineQuery

                if (timeline.length === 0) {
                  return $row(
                    spacing.tiny,
                    style({ color: pallete.foreground, textAlign: 'center', placeSelf: 'center' })
                  )($text('No activity found'))
                }

                // const openMarkerList = pos.list.filter(isPositionOpen).map((pos): IMarker => {
                //   const pnl = params.timeline[params.timeline.length - 1].value
                //   return {
                //     position: 'inBar',
                //     color: pnl < 0n ? pallete.negative : pallete.positive,
                //     time: unixTimestampNow() as Time,
                //     size: 1.5,
                //     shape: 'circle'
                //   }
                // })
                // const settledMarkerList = pos.list
                //   .filter(isPositionSettled)
                //   .flatMap((pos) => pos.decreaseList)
                //   .map((pos): IMarker => {
                //     return {
                //       position: 'inBar',
                //       color: colorAlpha(pallete.message, 0.5),
                //       time: Number(pos.blockTimestamp) as Time,
                //       size: 0.1,
                //       shape: 'circle'
                //     }
                //   })

                // const allMarkerList = [...settledMarkerList, ...openMarkerList].sort(
                //   (a, b) => Number(a.time) - Number(b.time)
                // )

                return $Baseline({
                  // markers: now(allMarkerList),
                  chartConfig: {
                    leftPriceScale: {
                      autoScale: true,
                      ticksVisible: true,
                      scaleMargins: {
                        top: 0.4,
                        bottom: 0.1
                      }
                    },
                    timeScale: {
                      visible: false
                    }
                  },
                  baselineOptions: {
                    baseLineColor: pallete.message,
                    baseLineVisible: true,
                    lineWidth: 2,
                    baseValue: {
                      price: 0,
                      type: 'price'
                    }
                  },
                  // appendData: scan((prev, next) => {
                  //   const marketPrice = formatFixed(next.indexTokenPrice, 30)
                  //   const timeNow = unixTimestampNow()
                  //   const prevTimeSlot = Math.floor(prev.time as number / tf)
                  //   const nextTimeSlot = Math.floor(timeNow / tf)
                  //   const time = nextTimeSlot * tf as Time
                  //   const isNext = nextTimeSlot > prevTimeSlot

                  //   return {
                  //     value: marketPrice,
                  //     time
                  //   }
                  // }, data[data.length - 1], config.processData),
                  data: timeline as any as BaselineData<ISeriesTime>[]
                })({
                  crosshairMove: crosshairMoveTether()
                })
              },
              combineState({
                timelineQuery,
                activityTimeframe,
                collateralTokenList
              })
            )
          })
        ),

        { selectCollateralTokenList, changeActivityTimeframe }
      ]
    }
  )
