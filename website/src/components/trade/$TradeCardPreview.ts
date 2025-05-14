import { empty, map, multicast, skipRepeatsWith, startWith } from '@most/core'
import type { Stream } from '@most/types'
import type { IPosition } from '@puppet/middleware/core'
import { $Baseline, $bear, $bull, $infoTooltipLabel } from '@puppet/middleware/ui-components'
import { filterNull, parseReadableNumber, readableUnitAmount } from '@puppet/middleware/utils'
import {
  $node,
  $text,
  combineState,
  component,
  type I$Node,
  type IBehavior,
  type INodeCompose,
  motion,
  replayLatest,
  style
} from 'aelea/core'
import { $column, $icon, $NumberTicker, $row, isDesktopScreen, layoutSheet, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { BaselineData, ChartOptions, DeepPartial, MouseEventParams } from 'lightweight-charts'
import { getPositionListTimelinePerformance, type IPerformanceTimeline } from './$ProfilePerformanceGraph.js'

export interface ITradeCardPreview extends Omit<IPerformanceTimeline, 'positionList'> {
  mp: IPosition
  $container?: INodeCompose
  chartConfig?: DeepPartial<ChartOptions>
  latestPrice: Stream<bigint>
  animatePnl?: boolean
}

export const $TradeCardPreview = (config: ITradeCardPreview) =>
  component(
    (
      [accountPreviewClick, accountPreviewClickTether]: IBehavior<string, string>,
      [crosshairMove, crosshairMoveTether]: IBehavior<MouseEventParams, MouseEventParams>
    ) => {
      const $container = config.$container || $column(style({ height: '80px', minWidth: '100px' }))
      const timeline = getPositionListTimelinePerformance({ ...config, list: [config.mp] })
      const pnlCrossHairTimeChange = replayLatest(
        multicast(
          startWith(
            null,
            skipRepeatsWith((xsx, xsy) => xsx.time === xsy.time, crosshairMove)
          )
        )
      )

      const hoverChartPnl = filterNull(
        map((params) => {
          if (params.pnlCrossHairTimeChange?.point) {
            const value = params.pnlCrossHairTimeChange.seriesData.values().next().value?.value
            return value
          }

          const data = timeline
          const value = data[data.length - 1]?.value
          return value || null
        }, combineState({ pnlCrossHairTimeChange }))
      )

      // const openMarkerList = config.openPositionList.map((pos): IMarker => {
      //   const pnl = timeline[timeline.length - 1].value
      //   return {
      //     position: 'inBar',
      //     color: pnl < 0 ? pallete.negative : pallete.positive,
      //     time: unixTimestampNow() as Time,
      //     size: 1.5,
      //     shape: 'circle'
      //   }
      // })
      // const settledMarkerList = config.settledPositionList.flatMap(pos => pos.decreaseList).map((pos): IMarker => {
      //   return {
      //     position: 'inBar',
      //     color: colorAlpha(pallete.message, .15),
      //     time: Number(pos.blockTimestamp) as Time,
      //     size: 0.1,
      //     shape: 'circle'
      //   }
      // })

      // const allMarkerList = [...settledMarkerList, ...openMarkerList].sort((a, b) => Number(a.time) - Number(b.time))

      return [
        $container(
          $column(
            $row(
              isDesktopScreen ? spacing.big : spacing.default,
              style({
                placeContent: 'center',
                alignItems: 'center',
                fontFamily: 'Moderat',
                padding: isDesktopScreen ? '25px 35px 0px' : '35px 35px 0px',
                zIndex: 11
              })
            )(
              $row(style({ fontFamily: 'ModeratMono', alignItems: 'center', placeContent: 'space-evenly' }))(
                $row(spacing.default, style({ alignItems: 'center' }))(
                  $row(
                    style({ borderRadius: '2px', padding: '4px', backgroundColor: pallete.message })(
                      $icon({
                        $content: config.mp.isLong ? $bull : $bear,
                        width: '38px',
                        fill: pallete.background,
                        viewBox: '0 0 32 32'
                      })
                    )
                  ),
                  $column(style({ gap: '6px' }))(
                    $row(spacing.tiny, style({ alignItems: 'center' }))(
                      // $icon({
                      //   $content: newLocal,
                      //   viewBox: '0 0 32 32',
                      //   width: '18px'
                      // }),
                      // $text(readableFixedUSD30(config.position.averagePrice))
                    )
                    // $row(spacing.small, style({ color: isSettled ? '' : pallete.indeterminate, fontSize: '.8rem' }))(
                    //   $text(tradeTitle(mirroredPosition)),
                    //   $row(style({ gap: '3px', alignItems: 'baseline' }))(
                    //     $icon({
                    //       $content: $target,
                    //       width: '10px',
                    //       fill: isSettled ? '' : pallete.indeterminate,
                    //       viewBox: '0 0 32 32'
                    //     }),
                    //     $text(style(isSettled ? {} : { color: pallete.indeterminate }))(
                    //       merge(
                    //         now('Loading...'),
                    //         map(price => {
                    //           return readableNumber(formatFixed(price, 30))
                    //         }, latestPrice)
                    //       )
                    //     )
                    //   )
                    // ),
                  )
                )
              )

              // style({ alignSelf: 'stretch' }, $seperator),

              // !isSettled
              //   ? $RiskLiquidator(mirroredPosition, latestPrice)({})
              //   : $column(spacing.tiny, style({ textAlign: 'center' }))(
              //     $text(readableUSD(mirroredPosition.size)),
              //     $seperator,
              //     style({ textAlign: 'center', fontSize: '.8rem' }, $text(style({ fontWeight: 'bold' }))(`${readableNumber(bnDiv(mirroredPosition.size, mirroredPosition.collateral))}x`)),
              //   ),

              // $row(style({ flex: 1 }))(),

              // switchLatest(map(cMap => {
              //   return $AccountPreview({ ...accountPreview, chain, address: trade.account, claim: cMap[trade.account.toLowerCase()] })({
              //     profileClick: accountPreviewClickTether()
              //   })
              // }, claimMap)),
            ),

            $container(
              $row(
                style({
                  position: 'absolute',
                  placeContent: 'center',
                  top: '10px',
                  alignSelf: 'center',
                  zIndex: 11,
                  alignItems: 'center',
                  placeSelf: 'center'
                })
              )(
                !config.mp
                  ? $node(
                      style({
                        fontSize: '.8rem',
                        color: pallete.foreground,
                        textAlign: 'center'
                      })
                    )($text('No trades yet'))
                  : empty(),
                $column(style({ alignItems: 'center' }))(
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
                      motion({ damping: 26, precision: 15, stiffness: 210 }, 0, hoverChartPnl)
                    ),
                    incrementColor: pallete.positive,
                    decrementColor: pallete.negative
                  }),
                  $infoTooltipLabel(
                    'The total combined settled and open trades',
                    $textNode(style({ fontSize: '.8rem' }))('PnL')
                  )
                )
              ),
              $Baseline({
                // markers: now(allMarkerList),
                chartConfig: {
                  leftPriceScale: {
                    autoScale: true,
                    ticksVisible: true,
                    scaleMargins: {
                      top: 0.35,
                      bottom: 0
                    }
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
                data: timeline as any as BaselineData[]
              })({
                crosshairMove: crosshairMoveTether(skipRepeatsWith((a, b) => a.point?.x === b.point?.x))
              })
            )

            // $row(spacing.default, style({ alignItems: 'baseline', placeContent: 'center', pointerEvents: 'none' }))(
            //   $row(style({ fontSize: '2.25em', alignItems: 'baseline', paddingTop: '26px', paddingBottom: '26px' }))(
            //     animatePnl
            //       ? style({
            //         lineHeight: 1,
            //         fontWeight: "bold",
            //         zIndex: 10,
            //         position: 'relative'
            //       })(
            //         $NumberTicker({
            //           value$: map(Math.round, motion({ ...MOTION_NO_WOBBLE, precision: 15, stiffness: 210 }, 0, chartRealisedPnl)),
            //           incrementColor: pallete.positive,
            //           decrementColor: pallete.negative
            //         })
            //       )
            //       : $text(tickerStyle, styleBehavior(map(pnl => ({ color: pnl > 0 ? pallete.positive : pallete.negative }), chartRealisedPnl)))(map(O(Math.floor, x => `${x > 0 ? '+' : ''}` + x.toLocaleString()), chartRealisedPnl)),
            //     $text(style({ fontSize: '.8rem', color: pallete.foreground }))('$'),
            //   ),
            //   // $liquidationSeparator(liqPercentage),
            //   $row(style({ fontSize: '1.85rem', alignItems: 'baseline' }))(
            //     $text(style({ color: pallete.foreground }))('('),
            //     animatePnl
            //       ? tickerStyle(
            //         $NumberTicker({
            //           value$: map(Math.round, skip(1, motion({ ...MOTION_NO_WOBBLE, precision: 15, stiffness: 210 }, 0, chartPnlPercentage))),
            //           incrementColor: pallete.positive,
            //           decrementColor: pallete.negative
            //         })
            //       )
            //       : $text(tickerStyle, styleBehavior(map(pnl => ({ color: pnl > 0 ? pallete.positive : pallete.negative }), chartPnlPercentage)))(map(O(Math.floor, n => `${n > 0 ? '+' : ''}` + n), chartPnlPercentage)),
            //     $text(tickerStyle, style({ color: pallete.foreground }))('%'),
            //     $text(style({ color: pallete.foreground }))(')'),
            //   ),
            // ),

            // $TradePnlHistory({ trade, latestPrice, pricefeed })({
            //   // pnlCrossHairChange: pnlCrosshairMoveTether(),
            //   // requestTradePricefeed: requestTradePricefeedTether(),
            //   crosshairMove: crosshairMoveTether()
            // })
          )
        ),

        {
          accountPreviewClick
        }
      ]
    }
  )
