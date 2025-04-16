import { pallete } from '@aelea/ui-components-theme'
import {
  BarPrice,
  BaselineSeriesPartialOptions,
  ChartOptions,
  DeepPartial,
  LineStyle
} from 'lightweight-charts'
import { $Chart, IChartConfig } from "./$Chart.js"
import { readableUnitAmount } from 'common-utils'


export interface IBaselineChart extends IChartConfig<'Baseline'> {
  baselineOptions?: BaselineSeriesPartialOptions
}


export const $Baseline = (config: IBaselineChart) => {

  const baselineOptions: BaselineSeriesPartialOptions = {
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
      price: 0,
    },
    // baseLineStyle: LineStyle.Dashed,
    // lineWidth: 2,
    baseLineWidth: 1,
    // baseLineColor: 'yellow',
    // priceLineColor: 'yellow',
    baseLineVisible: true,
    // lastValueVisible: false,
    priceLineVisible: false,
    ...config.baselineOptions
  }

  const chartConfig: DeepPartial<ChartOptions> = {
    layout: {
      attributionLogo: false,
      background: {
        color: 'transparent'
      },
      textColor: pallete.foreground,
      fontSize: 10
    },
    leftPriceScale: {
      autoScale: true,
      ticksVisible: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      }
    },
    // rightPriceScale: {
    //   // mode: PriceScaleMode.Logarithmic,
    //   autoScale: true,
    //   visible: true,
    //   scaleMargins: {
    //     top: 0.4,
    //     bottom: 0,
    //   }
    // },
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
      rightOffset: 0,
    },
    ...config.chartConfig || {}
  }

  return $Chart({
    ...config,
    chartConfig,
    getSeriesApi: api => {
      const series = api.addBaselineSeries(baselineOptions)
      setTimeout(() => {
        api.timeScale().fitContent()
      }, 55)
      
      return series
    }
  })
}


