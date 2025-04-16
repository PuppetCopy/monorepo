import { Behavior, combineArray, combineObject, fromCallback, O, Op } from "@aelea/core"
import { $Node, $wrapNativeElement, component, INode, style, styleInline } from "@aelea/dom"
import { $row, observer } from '@aelea/ui-components'
import { colorAlpha, pallete } from '@aelea/ui-components-theme'
import { empty, filter, map, mergeArray, multicast, scan, snapshot, tap } from '@most/core'
import { disposeWith } from '@most/disposable'
import { Stream } from '@most/types'
import { filterNull } from "common-utils"
import {
  ChartOptions, Coordinate, createChart,
  CrosshairMode, DeepPartial,
  IChartApi,
  IPriceLine,
  ISeriesApi,
  LineStyle, LogicalRange, MouseEventParams, PriceLineOptions,
  Range,
  SeriesDataItemTypeMap, SeriesMarker,
  SeriesPartialOptionsMap,
  Time
} from 'lightweight-charts'

export interface IMarker extends SeriesMarker<Time> {

}

export interface ICHartAxisChange {
  coords: Stream<Coordinate | null>
  isFocused: Stream<boolean>
  price: Stream<number | null>
}


export interface IChartConfig<TSeriesType extends keyof SeriesDataItemTypeMap> {
  chartConfig?: DeepPartial<ChartOptions>
  containerOp?: Op<INode, INode>
  seriesConfig?: SeriesPartialOptionsMap[TSeriesType]

  data: Array<SeriesDataItemTypeMap[TSeriesType]>
  appendData?: Stream<SeriesDataItemTypeMap[TSeriesType]>
  priceLines?: Stream<Partial<PriceLineOptions> & Pick<PriceLineOptions, "price"> | null>[]
  markers?: Stream<IMarker[]>

  $content?: $Node

  yAxisState?: ICHartAxisChange
}

export interface IChart<TSeriesType extends keyof SeriesDataItemTypeMap> extends IChartConfig<TSeriesType> {
  getSeriesApi: (api: IChartApi) => ISeriesApi<TSeriesType>,
}

export const $Chart = <TSeriesType extends keyof SeriesDataItemTypeMap>(config: IChart<TSeriesType>) => component((
  // [sampleCrosshairMove, crosshairMove]: Behavior<MouseEventParams, MouseEventParams>,
  [containerDimension, sampleContainerDimension]: Behavior<INode, ResizeObserverEntry[]>
) => {

  const containerEl = document.createElement('chart')



  const chartApi = createChart(containerEl, {
    rightPriceScale: {
      visible: false,
    },
    grid: {
      horzLines: {
        visible: false,
      },
      vertLines: {
        visible: false
      },
    },
    overlayPriceScales: {
      borderVisible: false,
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
      fontFamily: `-apple-system,BlinkMacSystemFont,Trebuchet MS,Roboto,Ubuntu,sans-serif`,
      fontSize: 12
    },
    timeScale: {
      rightOffset: 0,
      secondsVisible: true,
      timeVisible: true,
      lockVisibleTimeRangeOnResize: true,
    },
    crosshair: {
      mode: CrosshairMode.Magnet,
      horzLine: {
        // visible: false,
        labelBackgroundColor: pallete.background,
        // labelVisible: false,
        color: pallete.indeterminate,
        width: 1,
        style: LineStyle.Dotted,
      },
      vertLine: {
        color: pallete.indeterminate,
        labelBackgroundColor: pallete.background,
        width: 1,
        style: LineStyle.Dotted,
      }
    },
    ...config.chartConfig
  })


  const seriesApi: ISeriesApi<TSeriesType> = config.getSeriesApi(chartApi)

  seriesApi.setData(config.data)

  const crosshairMove = fromCallback<MouseEventParams>(
    cb => {
      chartApi.subscribeCrosshairMove(cb)
      return disposeWith(handler => chartApi.unsubscribeCrosshairMove(handler), cb)
    }
  )


  const click = multicast(
    fromCallback<MouseEventParams>(cb => {
      chartApi.subscribeClick(cb)
      return disposeWith(handler => chartApi.unsubscribeClick(handler), cb)
    })
  )

  const timeScale = chartApi.timeScale()


  const visibleLogicalRangeChange: Stream<LogicalRange | null> = multicast(
    fromCallback(cb => {
      timeScale.subscribeVisibleLogicalRangeChange(cb)
      return disposeWith(handler => timeScale.subscribeVisibleLogicalRangeChange(handler), cb)
    })
  )

  const visibleTimeRangeChange = multicast(
    fromCallback<Range<Time> | null>(cb => {
      timeScale.subscribeVisibleTimeRangeChange(cb)
      return disposeWith(handler => timeScale.unsubscribeVisibleTimeRangeChange(handler), cb)
    })
  )



  const ignoreAll = filter(() => false)

  const priceLineConfigList = config.priceLines || []




  return [
    $wrapNativeElement(containerEl)(
      style({ position: 'relative', minHeight: '30px', flex: 1, width: '100%' }),
      sampleContainerDimension(observer.resize()),
      config.containerOp || O(),
    )(
      config.yAxisState
        ? $row(
          style({
            placeContent: 'flex-end', alignItems: 'center', height: '1px',
            zIndex: 10, pointerEvents: 'none', width: '100%', position: 'absolute'
          }),
          styleInline(
            map(params => {
              if (params.isFocused === false && params.coords === null) {
                return { display: 'none' }
              }

              return {
                background: colorAlpha(params.isFocused ? pallete.primary : pallete.indeterminate, .5),
                top: params.coords + 'px',
                display: 'flex'
              }
            }, combineObject(config.yAxisState))
          )
        )(config.$content || empty())
        : empty(),

      ignoreAll(mergeArray([
        config.appendData
          ? tap(next => {
            if (next && next.time) {
              seriesApi.update(next)
            }

          }, config.appendData)
          : empty(),
        ...priceLineConfigList.map(lineStreamConfig => {
          return scan((prev, params) => {
            if (prev && params === null) {
              seriesApi.removePriceLine(prev)
            }

            if (params) {
              if (prev) {
                prev.applyOptions(params)
                return prev
              } else {
                return seriesApi.createPriceLine(params)
              }
            }

            return null
          }, null as IPriceLine | null, lineStreamConfig)
        }),
        tap(next => {
          seriesApi.setMarkers(next)
        }, config.markers || empty()),
        combineArray(([containerDimension]) => {
          const { width, height } = containerDimension.contentRect
          chartApi.resize(width, height)
          // timeScale.fitContent()
          timeScale.resetTimeScale()

          return empty()
        }, containerDimension),
      ]))
    ),

    {
      yAxisCoords: config.yAxisState
        ? mergeArray([
          map(coords => {
            if (coords.isFocused) {
              return null
            }

            return coords.crosshairMove?.point?.y || null
          }, combineObject({ crosshairMove, isFocused: config.yAxisState.isFocused })),
          snapshot((params, range) => {
            if (params.isFocused && params.price) {
              return seriesApi.priceToCoordinate(params.price)
            }

            return null
          }, combineObject(config.yAxisState), visibleLogicalRangeChange),

        ]) : empty(),
      focusPrice: config.yAxisState
        ? filterNull(mergeArray([
          snapshot((params, ev) => {
            if (params.isFocused) {
              return null
            }

            return ev.point ? seriesApi.coordinateToPrice(ev.point.y) : null
          }, combineObject(config.yAxisState), click),
          snapshot((params, coords) => {
            if (params.isFocused) {
              return null
            }

            return coords ? seriesApi.coordinateToPrice(coords) : null
          }, combineObject(config.yAxisState), config.yAxisState.coords)
        ])) : empty(),
      isFocused: config.yAxisState ? snapshot(focused => !focused, config.yAxisState.isFocused, click) : empty(),
      crosshairMove,
      click,
      visibleLogicalRangeChange,
      visibleTimeRangeChange,
      containerDimension
    }
  ]
})


