import {
  awaitPromises,
  debounce,
  empty,
  map,
  multicast,
  now,
  skipRepeatsWith,
  startWith,
  switchLatest
} from '@most/core'
import type { IntervalTime } from '@puppet/middleware/const'
import { isPositionOpen, isPositionSettled } from '@puppet/middleware/core'
import { $Baseline, $IntermediatePromise, $infoTooltipLabel, type IMarker } from '@puppet/middleware/ui-components'
import { filterNull, parseReadableNumber, readableUnitAmount, unixTimestampNow } from '@puppet/middleware/utils'
import { $node, $text, combineState, component, type IBehavior, MOTION_NO_WOBBLE, motion, style } from 'aelea/core'
import { $column, $NumberTicker, $row, layoutSheet } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { BaselineData, MouseEventParams, Time } from 'lightweight-charts'
import type * as viem from 'viem'
import type { IUserActivityPageParams } from '../../pages/type.js'
import { $SelectCollateralToken } from '../$CollateralTokenSelector.js'
import { $LastAtivity } from '../$LastActivity.js'
import { getPositionListTimelinePerformance } from '../trade/$ProfilePerformanceGraph.js'

interface IProfilePeformanceTimeline extends IUserActivityPageParams {}

export const $ProfilePeformanceTimeline = (config: IProfilePeformanceTimeline) =>
  component(
    (
      [crosshairMove, crosshairMoveTether]: Behavior<MouseEventParams>,
      [selectMarketTokenList, selectMarketTokenListTether]: Behavior<viem.Address[]>,
      [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<any, IntervalTime>
    ) => {
      const {
        activityTimeframe,
        selectedCollateralTokenList,
        pricefeedMapQuery,
        depositTokenList,
        matchRuleList,
        providerClientQuery,
        route
      } = config

      const debouncedState = debounce(
        40,
        combineState({ selectedCollateralTokenList, pricefeedMapQuery, activityTimeframe, matchRuleList })
      )
      const positionParams = multicast(
        map(async (params) => {
          const list = await params.positionListQuery
          const timeline = getPositionListTimelinePerformance({
            ...params,
            list: list.flatMap((pos) => [...pos.decreaseList, ...pos.increaseList]),
            tickCount: 100,
            activityTimeframe: params.activityTimeframe,
            pricefeedMap: await params.pricefeedMapQuery
          })

          return { timeline, list }
        }, debouncedState)
      )

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
                selectedList: selectedCollateralTokenList
              })({
                selectMarketTokenList: selectMarketTokenListTether()
              })
            ),
            switchLatest(
              awaitPromises(
                map(async (paramsQuery) => {
                  const params = await paramsQuery
                  const positionCount = params.list.length

                  if (positionCount === 0) {
                    return empty()
                  }

                  const pnlCrossHairTimeChange = startWith(
                    null,
                    skipRepeatsWith((xsx, xsy) => xsx.time === xsy.time, crosshairMove)
                  )
                  const hoverChartPnl = filterNull(
                    map((cross) => {
                      if (cross?.point) {
                        const value = cross.seriesData.values().next().value?.value || 0
                        return value
                      }

                      const data = params.timeline
                      const value = data[data.length - 1]?.value
                      return value || null
                    }, pnlCrossHairTimeChange)
                  )

                  return $column(style({ flex: 1, alignItems: 'center' }))(
                    $NumberTicker({
                      textStyle: {
                        fontSize: '1.85rem',
                        fontWeight: '900'
                      },
                      // background: `radial-gradient(${colorAlpha(invertColor(pallete.message), .7)} 9%, transparent 63%)`,
                      value$: map(
                        (hoverValue) => {
                          const newLocal2 = readableUnitAmount(hoverValue)
                          const newLocal = parseReadableNumber(newLocal2)
                          return newLocal
                        },
                        motion({ ...MOTION_NO_WOBBLE, precision: 15, stiffness: 210 }, 0, hoverChartPnl)
                      ),
                      incrementColor: pallete.positive,
                      decrementColor: pallete.negative
                    }),
                    $infoTooltipLabel(
                      'The total combined settled and open trades',
                      $text(style({ fontSize: '.85rem' }))('PnL')
                    )
                  )
                }, positionParams)
              )
            ),
            $row(style({ flex: 1 }))(
              $node(style({ flex: 1 }))(),
              $LastAtivity(config.activityTimeframe)({
                changeActivityTimeframe: changeActivityTimeframeTether()
              })
            )
          ),
          $IntermediatePromise({
            query: positionParams,
            $$done: map((params) => {
              const positionCount = params.list.length

              if (positionCount === 0) {
                return $row(
                  spacing.defaultTiny,
                  style({ textAlign: 'center', placeSelf: 'center' })
                )($text(style({ color: pallete.foreground }))('No activity found'))
              }

              const openMarkerList = params.list.filter(isPositionOpen).map((pos): IMarker => {
                const pnl = params.timeline[params.timeline.length - 1].value
                return {
                  position: 'inBar',
                  color: pnl < 0n ? pallete.negative : pallete.positive,
                  time: unixTimestampNow() as Time,
                  size: 1.5,
                  shape: 'circle'
                }
              })
              const settledMarkerList = params.list
                .filter(isPositionSettled)
                .flatMap((pos) => pos.decreaseList)
                .map((pos): IMarker => {
                  return {
                    position: 'inBar',
                    color: colorAlpha(pallete.message, 0.5),
                    time: Number(pos.blockTimestamp) as Time,
                    size: 0.1,
                    shape: 'circle'
                  }
                })

              const allMarkerList = [...settledMarkerList, ...openMarkerList].sort(
                (a, b) => Number(a.time) - Number(b.time)
              )

              return $Baseline({
                markers: now(allMarkerList),
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
                data: params.timeline as any as BaselineData[]
              })({
                crosshairMove: crosshairMoveTether(skipRepeatsWith((a, b) => a.point?.x === b.point?.x))
              })
            })
          })({})
        ),

        { selectMarketTokenList, changeActivityTimeframe }
      ]
    }
  )
