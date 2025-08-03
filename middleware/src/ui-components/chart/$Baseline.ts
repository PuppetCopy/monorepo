import type { IStream } from 'aelea/stream'
import { pallete } from 'aelea/ui-components-theme'
import {
  type BarPrice,
  BaselineSeries,
  type BaselineSeriesPartialOptions,
  type ChartOptions,
  createChart,
  type DeepPartial,
  LineStyle
} from 'lightweight-charts'
import { readableUnitAmount } from '../../core/readable.js'
import { $Chart, defaultChartConfig, type IMarker, type ISeriesType } from './$Chart.js'

type Stream<T> = IStream<T>

export interface IBaselineChart {
  baselineOptions?: BaselineSeriesPartialOptions
  data: ISeriesType['Baseline'][]

  chartConfig?: DeepPartial<ChartOptions>
  markers?: Stream<IMarker[]>
}

export const $Baseline = ({ data, baselineOptions, chartConfig, markers }: IBaselineChart) => {
  const chartElement = document.createElement('chart')
  const chartApi = createChart(chartElement, {
    ...defaultChartConfig,
    layout: {
      attributionLogo: false,
      background: {
        color: 'transparent'
      },
      textColor: pallete.foreground,
      fontSize: 10
    },
    leftPriceScale: {
      ticksVisible: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1
      }
    },
    handleScale: false,
    handleScroll: false,
    timeScale: {
      secondsVisible: false,
      timeVisible: true,
      shiftVisibleRangeOnNewBar: true,
      rightBarStaysOnScroll: true,
      fixRightEdge: true,
      fixLeftEdge: true,
      borderVisible: false,
      rightOffset: 0
    },
    ...chartConfig
  })
  const series = chartApi.addSeries(BaselineSeries, {
    priceFormat: {
      type: 'custom',
      formatter: (priceValue: BarPrice) => readableUnitAmount(priceValue.valueOf())
    },
    baseLineStyle: LineStyle.Dashed,
    lineStyle: LineStyle.Solid,
    topLineColor: pallete.positive,
    bottomLineColor: pallete.negative,
    baseValue: {
      type: 'price',
      price: 0
    },
    // baseLineStyle: LineStyle.Dashed,
    // lineWidth: 2,
    baseLineWidth: 1,
    // baseLineColor: 'yellow',
    // priceLineColor: 'yellow',
    baseLineVisible: true,
    // lastValueVisible: false,
    priceLineVisible: false,
    ...baselineOptions
  })

  // setTimeout(() => {
  series.setData(data)
  // }, 100)

  return $Chart({
    chartApi,
    series,
    markers
  })
}
