import { map, skipRepeatsWith } from '@most/core'
import type { Stream } from '@most/types'
import { type IntervalTime, USD_DECIMALS } from '@puppet/middleware/const'
import { $Baseline, $intermediatePromise, type ISeriesTime } from '@puppet/middleware/ui-components'
import { fillTimeline, formatFixed, unixTimestampNow } from '@puppet/middleware/utils'
import { $node, $text, combineState, component, type IBehavior, style } from 'aelea/core'
import { $column, $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { BaselineData, MouseEventParams } from 'lightweight-charts'
import type { Address } from 'viem/accounts'
import type { IPageFilterParams, ITraderRouteMetricSummary, IUserActivityPageParams } from '../../pages/type.js'
import { $SelectCollateralToken } from '../$CollateralTokenSelector.js'
import { $LastAtivity } from '../$LastActivity.js'

interface IProfilePeformanceTimeline extends IUserActivityPageParams, IPageFilterParams {
  metricsQuery: Stream<Promise<ITraderRouteMetricSummary>>
}

export const $TradeRouteTimeline = ({
  activityTimeframe,
  collateralTokenList,
  depositTokenList,
  matchingRuleQuery,
  metricsQuery
}: IProfilePeformanceTimeline) =>
  component(
    (
      [crosshairMove, crosshairMoveTether]: IBehavior<MouseEventParams>,
      [selectMarketTokenList, selectMarketTokenListTether]: IBehavior<Address[]>,
      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<any, IntervalTime>
    ) => {
      return [
        $column(style({ width: '100%', padding: 0, height: '200px', placeContent: 'center' }))(
          $row(
            style({
              position: 'absolute',
              top: '14px',
              left: '20px',
              right: '20px',
              alignSelf: 'center',
              zIndex: 11,
              alignItems: 'flex-start'
            })
          )(
            $row(style({ flex: 1 }))(
              $SelectCollateralToken({
                selectedList: collateralTokenList
              })({
                selectMarketTokenList: selectMarketTokenListTether()
              })
            ),
            // switchLatest(
            //   switchMap(async (paramsQuery) => {
            //     const params = await paramsQuery
            //     const positionCount = params.pnlList.length

            //     if (positionCount === 0) {
            //       return empty()
            //     }

            //     const pnlCrossHairTimeChange = startWith(
            //       null,
            //       skipRepeatsWith((xsx, xsy) => xsx.time === xsy.time, crosshairMove)
            //     )
            //     const hoverChartPnl = filterNull(
            //       map((cross) => {
            //         if (cross?.point) {
            //           const value = cross.seriesData.values().next().value?.value || 0
            //           return value
            //         }

            //         const data = params.timeline
            //         const value = data[data.length - 1]?.value
            //         return value || null
            //       }, pnlCrossHairTimeChange)
            //     )

            //     return $column(style({ flex: 1, alignItems: 'center' }))(
            //       $NumberTicker({
            //         textStyle: {
            //           fontSize: '1.85rem',
            //           fontWeight: '900'
            //         },
            //         // background: `radial-gradient(${colorAlpha(invertColor(pallete.message), .7)} 9%, transparent 63%)`,
            //         value$: map(
            //           (hoverValue) => {
            //             const newLocal2 = readableUnitAmount(hoverValue)
            //             const newLocal = parseReadableNumber(newLocal2)
            //             return newLocal
            //           },
            //           motion({ damping: 26, precision: 15, stiffness: 210 }, 0, hoverChartPnl)
            //         ),
            //         incrementColor: pallete.positive,
            //         decrementColor: pallete.negative
            //       }),
            //       $infoTooltipLabel('The total combined settled and open trades', $text('PnL'))
            //     )
            //   }, metricsQuery)
            // ),
            $row(style({ flex: 1 }))(
              $node(style({ flex: 1 }))(),

              $LastAtivity(activityTimeframe)({
                changeActivityTimeframe: changeActivityTimeframeTether()
              })
            )
          ),
          $intermediatePromise({
            $$display: map(async (params) => {
              const pos = await params.metricsQuery

              if (pos.pnlList.length === 0) {
                return $row(
                  spacing.tiny,
                  style({ color: pallete.foreground, textAlign: 'center', placeSelf: 'center' })
                )($text('No activity found'))
              }

              const endTime = unixTimestampNow()
              const startTime = endTime - params.activityTimeframe
              const sourceList = [
                { value: 0n, time: startTime },
                ...pos.pnlList
                  .map((pnl, index) => ({
                    value: pnl,
                    time: pos.pnlTimestampList[index]
                  }))
                  .filter((item) => item.time > startTime),
                { value: pos.pnlList[pos.pnlList.length - 1], time: endTime }
              ]

              const timeline = fillTimeline({
                sourceList,
                ticks: 260,
                getTime: (item) => item.time,
                sourceMap: (next) => {
                  return formatFixed(USD_DECIMALS, next.value)
                }
              })

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
                      bottom: 0
                    }
                  }
                  // timeScale: {}
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
                crosshairMove: crosshairMoveTether(skipRepeatsWith((a, b) => a.point?.x === b.point?.x))
              })
            }, combineState({ metricsQuery, activityTimeframe, depositTokenList, collateralTokenList }))
          })
        ),

        { selectMarketTokenList, changeActivityTimeframe }
      ]
    }
  )
