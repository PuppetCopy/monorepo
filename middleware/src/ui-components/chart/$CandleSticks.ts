import type { Stream } from '@most/types'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import {
  CandlestickSeries,
  type CandlestickSeriesOptions,
  type ChartOptions,
  CrosshairMode,
  createChart,
  type DeepPartial,
  LineStyle
} from 'lightweight-charts'
import { $Chart, defaultChartConfig, type IMarker, type ISeriesType } from './$Chart.js'

export interface ICandlesticksChart {
  data: ISeriesType['Candlestick'][]
  candlestickConfig?: CandlestickSeriesOptions

  chartConfig?: DeepPartial<ChartOptions>
  markers?: Stream<IMarker[]>
}

export const $CandleSticks = ({ data, candlestickConfig, chartConfig, markers }: ICandlesticksChart) => {
  const chartElement = document.createElement('chart')
  const chartApi = createChart(chartElement, {
    ...defaultChartConfig,
    overlayPriceScales: {
      borderColor: pallete.indeterminate,
      borderVisible: false
    },
    leftPriceScale: {
      visible: false
    },
    rightPriceScale: {
      borderColor: 'yellow',
      autoScale: true,
      visible: false,
      scaleMargins: {
        top: 0.4,
        bottom: 0
      }
    },
    timeScale: {
      fixLeftEdge: true,
      fixRightEdge: true,
      rightOffset: 0,
      rightBarStaysOnScroll: true,
      secondsVisible: true,
      timeVisible: true
    },
    crosshair: {
      mode: CrosshairMode.Normal,
      horzLine: {
        visible: false,
        labelVisible: false,
        labelBackgroundColor: pallete.foreground,
        color: colorAlpha(pallete.foreground, 0.2),
        width: 1,
        style: LineStyle.Solid
      },
      vertLine: {
        // visible: false,
        // labelVisible: false,
        labelBackgroundColor: pallete.indeterminate,
        color: colorAlpha(pallete.indeterminate, 0.2),
        width: 1,
        style: LineStyle.Solid
      }
    },
    ...chartConfig
  })
  const series = chartApi.addSeries(CandlestickSeries, {
    ...candlestickConfig
  })

  series.setData(data)

  return $Chart({
    chartApi,
    series,
    markers
  })
}
