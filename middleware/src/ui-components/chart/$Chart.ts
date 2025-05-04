import { empty, filter, map, mergeArray, multicast, scan, snapshot, tap } from '@most/core'
import { disposeWith } from '@most/disposable'
import type { Stream } from '@most/types'
import {
  $wrapNativeElement,
  combineArray,
  combineState,
  component,
  fromCallback,
  type I$Node,
  type INode,
  type IOp,
  O,
  style,
  styleInline
} from 'aelea/core'
import { $row, observer } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import {
  type ChartOptions,
  type Coordinate,
  CrosshairMode,
  createChart,
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
  type SeriesPartialOptionsMap,
  type Time
} from 'lightweight-charts'
import { filterNull } from '../../utils/index.js'

export type ISeriesTime = Time
export type IMarker = SeriesMarker<ISeriesTime> & {}
export type ISeriesType = SeriesDataItemTypeMap<ISeriesTime>

export interface ICHartAxisChange {
  coords: Stream<Coordinate | null>
  isFocused: Stream<boolean>
  price: Stream<number | null>
}

export interface IChartConfig<TType extends keyof ISeriesType> {
  chartConfig?: DeepPartial<ChartOptions>
  containerOp?: IOp<INode, INode>
  seriesConfig?: SeriesPartialOptionsMap[TType]

  data: ISeriesType[TType][]
  appendData?: Stream<ISeriesType[TType]>
  priceLines?: Stream<(Partial<PriceLineOptions> & Pick<PriceLineOptions, 'price'>) | null>[]
  markers?: Stream<IMarker[]>

  $content?: I$Node

  yAxisState?: ICHartAxisChange
}

export interface IChart<TSeriesType extends keyof ISeriesType> extends IChartConfig<TSeriesType> {
  getSeriesApi: (api: IChartApi) => ISeriesApi<TSeriesType> // Note: The implementation of this function where it's passed *into* $Chart needs to be updated to use chart.addSeries(Type, options)
}

export const $Chart = <TSeriesType extends keyof ISeriesType>(config: IChart<TSeriesType>) =>
  component(
    (
      // [sampleCrosshairMove, crosshairMove]: Behavior<MouseEventParams, MouseEventParams>,
      [containerDimension, sampleContainerDimension]: Behavior<INode, ResizeObserverEntry[]>
    ) => {
      const containerEl = document.createElement('chart')

      const chartApi = createChart(containerEl, {
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
        // leftPriceScale: {
        //   autoScale: true,
        //   visible: false,
        //   scaleMargins: {
        //     bottom: 0,
        //     top: 0,
        //   }
        // },
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
        },
        ...config.chartConfig
      })

      const seriesApi: ISeriesApi<TSeriesType> = config.getSeriesApi(chartApi)
      const seriesMarkers = createSeriesMarkers(seriesApi) // Create the marker primitive

      seriesApi.setData(config.data)

      const crosshairMove = fromCallback<MouseEventParams>((cb) => {
        chartApi.subscribeCrosshairMove(cb)
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
      const priceLineConfigList = config.priceLines || []
      const markers = config.markers || empty()

      return [
        $wrapNativeElement(containerEl)(
          style({ position: 'relative', minHeight: '30px', flex: 1, width: '100%' }),
          sampleContainerDimension(observer.resize()),
          config.containerOp || O()
        )(
          config.yAxisState
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
                  }, combineState(config.yAxisState))
                )
              )(config.$content || empty())
            : empty(),

          ignoreAll(
            mergeArray([
              config.appendData
                ? tap((next) => {
                    if (next?.time) {
                      seriesApi.update(next)
                    }
                  }, config.appendData)
                : empty(),
              ...priceLineConfigList.map((lineStreamConfig) => {
                return scan(
                  (prev, params) => {
                    if (prev && params === null) {
                      seriesApi.removePriceLine(prev)
                    }

                    if (params) {
                      if (prev) {
                        prev.applyOptions(params)
                        return prev
                      }
                      return seriesApi.createPriceLine(params)
                    }

                    return null
                  },
                  null as IPriceLine | null,
                  lineStreamConfig
                )
              }),
              tap((next) => {
                seriesMarkers.setMarkers(next)
              }, markers),
              combineArray(([containerDimension]) => {
                const { width, height } = containerDimension.contentRect
                chartApi.resize(width, height)
                // timeScale.fitContent()
                timeScale.resetTimeScale()

                return empty()
              }, containerDimension)
            ])
          )
        ),

        {
          yAxisCoords: config.yAxisState
            ? mergeArray([
                map(
                  (coords) => {
                    if (coords.isFocused) {
                      return null
                    }

                    return coords.crosshairMove?.point?.y || null
                  },
                  combineState({ crosshairMove, isFocused: config.yAxisState.isFocused })
                ),
                snapshot(
                  (params) => {
                    if (params.isFocused && params.price) {
                      return seriesApi.priceToCoordinate(params.price)
                    }

                    return null
                  },
                  combineState(config.yAxisState),
                  visibleLogicalRangeChange
                )
              ])
            : empty(),
          focusPrice: config.yAxisState
            ? filterNull(
                mergeArray([
                  snapshot(
                    (params, ev) => {
                      if (params.isFocused) {
                        return null
                      }

                      return ev.point ? seriesApi.coordinateToPrice(ev.point.y) : null
                    },
                    combineState(config.yAxisState),
                    click
                  ),
                  snapshot(
                    (params, coords) => {
                      if (params.isFocused) {
                        return null
                      }

                      return coords ? seriesApi.coordinateToPrice(coords) : null
                    },
                    combineState(config.yAxisState),
                    config.yAxisState.coords
                  )
                ])
              )
            : empty(),
          isFocused: config.yAxisState ? snapshot((focused) => !focused, config.yAxisState.isFocused, click) : empty(),
          crosshairMove,
          click,
          visibleLogicalRangeChange,
          visibleTimeRangeChange,
          containerDimension
        }
      ]
    }
  )
