import { readableLeverage, readableUsd } from '@puppet/sdk/core'
import { combine, type IStream, map } from 'aelea/stream'
import { multicast } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { intermediateText } from '@/ui-components'
import { $heading2 } from '../../common/$text.js'
import type { IPosition, ITraderRouteMetricSummary } from '../../pages/types.js'
import { $profileDisplay } from '../$AccountProfile.js'

export interface IAccountSummary {
  positionListQuery: IStream<Promise<IPosition[]>>
  account: Address
  puppet?: Address
}

export const $PuppetSummary = (config: IAccountSummary) =>
  component(() => {
    const { account, positionListQuery, puppet } = config

    const metricsQuery = multicast(
      map(async params => {
        const allPositions = await params.positionListQuery

        // TODO: Fix this - accountSettledPositionListSummary expects ITraderRouteLatestMetric, not IPosition[]
        // return accountSettledPositionListSummary(puppet || account, allPositions)

        // Return empty summary for now
        return {
          account: puppet || account,
          settledSizeInUsd: 0n,
          settledSizeLongInUsd: 0n,
          settledCollateralInUsd: 0n,
          sizeUsd: 0n,
          collateralUsd: 0n,
          longUsd: 0n,
          longShortRatio: 0n,
          pnl: 0n,
          realisedPnl: 0n,
          realisedRoi: 0n,
          roi: 0n,
          lossCount: 0,
          winCount: 0,
          pnlTimeline: [],
          matchedPuppetList: [],
          indexTokenList: []
        } as ITraderRouteMetricSummary
      }, combine({ positionListQuery }))
    )

    return [
      $column(
        spacing.default,
        style({ minHeight: '90px' })
      )(
        $node(
          style({
            display: 'flex',
            flexDirection: isDesktopScreen ? 'row' : 'column',
            gap: isDesktopScreen ? '56px' : '26px',
            zIndex: 10,
            placeContent: 'center',
            alignItems: 'center',
            padding: '0 8px'
          })
        )(
          $row(
            $profileDisplay({
              address: account,
              profileSize: isDesktopScreen ? 90 : 90
            })
          ),
          $row(spacing.big, style({ alignItems: 'flex-end' }))(
            $metricRow(
              $heading2(
                $text(
                  intermediateText(
                    map(async summaryQuery => {
                      const summary = await summaryQuery

                      return `${summary.winCount} / ${summary.lossCount}`
                    }, metricsQuery)
                  )
                )
              ),
              $metricLabel($text('Win / Loss'))
            ),

            $metricRow(
              $heading2(
                $text(
                  intermediateText(
                    map(async summaryQuery => {
                      const summary = await summaryQuery

                      // TODO: Fix avgCollateral - property no longer exists in schema
                      return readableUsd(0n) // summary.avgCollateral
                    }, metricsQuery)
                  )
                )
              ),
              $metricLabel($text('Avg Collateral'))
            ),
            $metricRow(
              $heading2(
                $text(
                  intermediateText(
                    map(async summaryQuery => {
                      const summary = await summaryQuery

                      // TODO: Fix avgSize and avgCollateral - properties no longer exist in schema
                      return readableLeverage(0n, 1n) // summary.avgSize, summary.avgCollateral
                    }, metricsQuery)
                  )
                )
              ),
              $metricLabel($text('Avg Leverage'))
            )
          )
        )
      ),
      {}
    ]
  })

export const $metricRow = $column(spacing.tiny, style({ placeContent: 'center', alignItems: 'center' }))
export const $metricLabel = $row(
  style({
    color: pallete.foreground,
    letterSpacing: '1px',
    fontSize: isDesktopScreen ? '.8rem' : '.8rem'
  })
)
export const $metricValue = $row(style({ fontWeight: 900, letterSpacing: '1px' }))
