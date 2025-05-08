import { map, multicast } from '@most/core'
import type { Stream } from '@most/types'
import { accountSettledPositionListSummary, type IPosition } from '@puppet/middleware/core'
import { intermediateText } from '@puppet/middleware/ui-components'
import {  readableLeverage, readableUsd } from '@puppet/middleware/utils'
import { $node, $text, combineState, component, style } from 'aelea/core'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type * as viem from 'viem'
import { $heading2 } from '../../common/$text.js'
import { $profileDisplay } from '../$AccountProfile.js'

export interface IAccountSummary {
  positionListQuery: Stream<Promise<IPosition[]>>
  account: viem.Address
  puppet?: viem.Address
}

export const $PuppetSummary = (config: IAccountSummary) =>
  component(() => {
    const { account, positionListQuery, puppet } = config

    const metricsQuery = multicast(
      map(async (params) => {
        const allPositions = await params.positionListQuery

        return accountSettledPositionListSummary(allPositions, puppet)
      }, combineState({ positionListQuery }))
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
              account,
              labelSize: '22px',
              profileSize: isDesktopScreen ? 90 : 90
            })
          ),
          $row(spacing.big, style({ alignItems: 'flex-end' }))(
            $metricRow(
              $heading2(
                $text(
                  intermediateText(
                    map(async (summaryQuery) => {
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
                    map(async (summaryQuery) => {
                      const summary = await summaryQuery

                      return readableUsd(summary.avgCollateral)
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
                    map(async (summaryQuery) => {
                      const summary = await summaryQuery

                      return readableLeverage(summary.avgSize, summary.avgCollateral)
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
    fontSize: isDesktopScreen ? '.85rem' : '.85rem'
  })
)
export const $metricValue = $row(style({ fontWeight: 900, letterSpacing: '1px', fontSize: '1.85rem' }))
