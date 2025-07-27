import { empty, filter, map, mergeArray, multicast, scan, snapshot, tap } from '@most/core'
import { disposeWith } from '@most/disposable'
import type { Stream } from '@most/types'
import {
  $wrapNativeElement,
  combineState,
  component,
  fromCallback,
  type I$Node,
  type IBehavior,
  type INode,
  style,
  styleInline,
  switchMap
} from 'aelea/core'
import { $row, observer } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import {
  type ChartOptions,
  type Coordinate,
  CrosshairMode,
  createSeriesMarkers, // Import createSeriesMarkers
  type DeepPartial,
  type IChartApi,
  type IPriceLine,
  type IRange,
  type ISeriesApi,
  LineStyle,
  type LogicalRange,
  type MouseEventParams,
  type PriceLineOptions,
  type SeriesDataItemTypeMap,
  type SeriesMarker,
  type Time
} from 'lightweight-charts'
import { filterNull } from '../../core/stream.js'

export type ISeriesTime = Time
export type IMarker = SeriesMarker<ISeriesTime> & {}
export type ISeriesType = SeriesDataItemTypeMap<ISeriesTime>

export interface ICHartAxisChange {
  coords: Stream<Coordinate | null>
  isFocused: Stream<boolean>
  price: Stream<number | null>
}

export interface IChart<TSeriesType extends keyof ISeriesType> {
  chartApi: IChartApi
  series: ISeriesApi<TSeriesType>

  appendData?: Stream<ISeriesType[TSeriesType]>
  priceLines?: Stream<(Partial<PriceLineOptions> & Pick<PriceLineOptions, 'price'>) | null>[]
  markers?: Stream<IMarker[]>

  $content?: I$Node

  yAxisState?: ICHartAxisChange
}

export const $Chart = <TSeriesType extends keyof ISeriesType>({
  chartApi,
  series,
  $content,
  appendData,
  priceLines,
  markers,
  yAxisState
}: IChart<TSeriesType>) =>
  component(
    (
      // [sampleCrosshairMove, crosshairMove]: IBehavior<MouseEventParams, MouseEventParams>,
      [containerDimension, sampleContainerDimension]: IBehavior<INode, ResizeObserverEntry[]>
    ) => {
      const containerEl = chartApi.chartElement()

      const crosshairMove = fromCallback<MouseEventParams>((cb) => {
        chartApi.subscribeCrosshairMove((xx) => {
          return cb(xx)
        })
        return disposeWith((handler) => chartApi.unsubscribeCrosshairMove(handler), cb)
      })

      const click = multicast(
        fromCallback<MouseEventParams>((cb) => {
          chartApi.subscribeClick(cb)
          return disposeWith((handler) => chartApi.unsubscribeClick(handler), cb)
        })
      )

      const timeScale = chartApi.timeScale()

      const visibleLogicalRangeChange: Stream<LogicalRange | null> = multicast(
        fromCallback((cb) => {
          timeScale.subscribeVisibleLogicalRangeChange(cb)
          return disposeWith((handler) => timeScale.subscribeVisibleLogicalRangeChange(handler), cb)
        })
      )

      const visibleTimeRangeChange = multicast(
        fromCallback<IRange<Time> | null>((cb) => {
          timeScale.subscribeVisibleTimeRangeChange((x) => cb(x))
          return disposeWith((handler) => timeScale.unsubscribeVisibleTimeRangeChange(handler), cb)
        })
      )

      const ignoreAll = filter(() => false)
      const priceLineConfigList = priceLines || []
      const seriesMarkers = createSeriesMarkers(series) // Create the marker primitive

      return [
        $wrapNativeElement(containerEl)(
          style({ position: 'relative', minHeight: '30px', flex: 1, width: '100%' }),
          sampleContainerDimension(observer.resize())
        )(
          yAxisState
            ? $row(
                style({
                  placeContent: 'flex-end',
                  alignItems: 'center',
                  height: '1px',
                  zIndex: 10,
                  pointerEvents: 'none',
                  width: '100%',
                  position: 'absolute'
                }),
                styleInline(
                  map((params) => {
                    if (params.isFocused === false && params.coords === null) {
                      return { display: 'none' }
                    }

                    return {
                      background: colorAlpha(params.isFocused ? pallete.primary : pallete.indeterminate, 0.5),
                      top: `${params.coords}px`,
                      display: 'flex'
                    }
                  }, combineState(yAxisState))
                )
              )($content || empty())
            : empty(),

          ignoreAll(
            mergeArray([
              switchMap(([containerObserver]) => {
                chartApi.resize(containerObserver.contentRect.width, containerObserver.contentRect.height)
                timeScale.fitContent()
                return empty()
              }, containerDimension),
              appendData
                ? tap((next) => {
                    if (next?.time) {
                      series.update(next)
                    }
                  }, appendData)
                : empty(),
              ...priceLineConfigList.map((lineStreamConfig) => {
                return scan(
                  (prev, params) => {
                    if (prev && params === null) {
                      series.removePriceLine(prev)
                    }

                    if (params) {
                      if (prev) {
                        prev.applyOptions(params)
                        return prev
                      }
                      return series.createPriceLine(params)
                    }

                    return null
                  },
                  null as IPriceLine | null,
                  lineStreamConfig
                )
              }),
              tap((next) => {
                seriesMarkers.setMarkers(next)
              }, markers || empty())
            ])
          )
        ),

        {
          // yAxisCoords: yAxisState
          //   ? mergeArray([
          //       map(
          //         (coords) => {
          //           if (coords.isFocused) {
          //             return null
          //           }

          //           return coords.crosshairMove?.point?.y || null
          //         },
          //         combineState({ crosshairMove, isFocused: yAxisState.isFocused })
          //       ),
          //       snapshot(
          //         (params) => {
          //           if (params.isFocused && params.price) {
          //             return seriesApi.priceToCoordinate(params.price)
          //           }

          //           return null
          //         },
          //         combineState(yAxisState),
          //         visibleLogicalRangeChange
          //       )
          //     ])
          //   : empty(),
          focusPrice: yAxisState
            ? filterNull(
                mergeArray([
                  snapshot(
                    (params, ev) => {
                      if (params.isFocused) {
                        return null
                      }

                      return ev.point ? series.coordinateToPrice(ev.point.y) : null
                    },
                    combineState(yAxisState),
                    click
                  ),
                  snapshot(
                    (params, coords) => {
                      if (params.isFocused) {
                        return null
                      }

                      return coords ? series.coordinateToPrice(coords) : null
                    },
                    combineState(yAxisState),
                    yAxisState.coords
                  )
                ])
              )
            : empty(),
          isFocused: yAxisState ? snapshot((focused) => !focused, yAxisState.isFocused, click) : empty(),
          crosshairMove,
          click,
          visibleLogicalRangeChange,
          visibleTimeRangeChange,
          containerDimension
        }
      ]
    }
  )

export const defaultChartConfig: DeepPartial<ChartOptions> = {
  rightPriceScale: {
    visible: false
  },
  grid: {
    horzLines: {
      visible: false
    },
    vertLines: {
      visible: false
    }
  },
  overlayPriceScales: {
    borderVisible: false
  },
  layout: {
    attributionLogo: false,
    textColor: pallete.message,
    background: {
      color: 'transparent'
    },
    fontFamily: '-apple-system,BlinkMacSystemFont,Trebuchet MS,Roboto,Ubuntu,sans-serif',
    fontSize: 12
  },
  timeScale: {
    rightOffset: 0,
    secondsVisible: true,
    timeVisible: true,
    lockVisibleTimeRangeOnResize: true
  },
  crosshair: {
    mode: CrosshairMode.Magnet,
    horzLine: {
      // visible: false,
      labelBackgroundColor: pallete.background,
      // labelVisible: false,
      color: pallete.indeterminate,
      width: 1,
      style: LineStyle.Dotted
    },
    vertLine: {
      color: pallete.indeterminate,
      labelBackgroundColor: pallete.background,
      width: 1,
      style: LineStyle.Dotted
    }
  }
}
