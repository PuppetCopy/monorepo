import { $node, $text, component, style } from "@aelea/dom"
import { $column, $row, layoutSheet, screenUtils } from "@aelea/ui-components"
import { pallete } from "@aelea/ui-components-theme"
import { map, multicast } from "@most/core"
import { combineState, readableLeverage, readableUsd } from "@puppet/middleware/utils"
import { accountSettledPositionListSummary, IPosition } from "puppet-middleware"
import { intermediateText } from "@puppet/middleware/ui-components"
import * as viem from 'viem'
import { $profileDisplay } from "../$AccountProfile.js"
import { $heading2 } from "../../common/$text.js"
import { Stream } from "@most/types"


export interface IAccountSummary {
  positionListQuery: Stream<Promise<IPosition[]>>
  account: viem.Address
  puppet?: viem.Address
}



export const $PuppetSummary = (config: IAccountSummary) => component(() => {

  const { account, positionListQuery, puppet, } = config

  const metricsQuery = multicast(map(async params => {
    const allPositions = await params.positionListQuery

    return accountSettledPositionListSummary(allPositions, puppet)
  }, combineState({ positionListQuery })))

  return [

    $column(layoutSheet.spacing, style({ minHeight: '90px' }))(
      $node(style({ display: 'flex', flexDirection: screenUtils.isDesktopScreen ? 'row' : 'column', gap: screenUtils.isDesktopScreen ? '56px' : '26px', zIndex: 10, placeContent: 'center', alignItems: 'center', padding: '0 8px' }))(
        $row(
          $profileDisplay({
            account,
            labelSize: '22px',
            profileSize: screenUtils.isDesktopScreen ? 90 : 90
          })
        ),
        $row(layoutSheet.spacingBig, style({ alignItems: 'flex-end' }))(
          $metricRow(
            $heading2(intermediateText(
              map(async summaryQuery => {
                const summary = await summaryQuery

                return `${summary.winCount} / ${summary.lossCount}`
              }, metricsQuery)
            )),
            $metricLabel($text('Win / Loss'))
          ),

          $metricRow(
            $heading2(intermediateText(
              map(async summaryQuery => {
                const summary = await summaryQuery

                return readableUsd(summary.avgCollateral)
              }, metricsQuery)
            )),
            $metricLabel($text('Avg Collateral'))
          ),
          $metricRow(
            $heading2(intermediateText(
              map(async summaryQuery => {
                const summary = await summaryQuery

                return readableLeverage(summary.avgSize, summary.avgCollateral)
              }, metricsQuery)
            )),
            $metricLabel($text('Avg Leverage'))
          )
        ),
      )
    ),
    {
    }
  ]
})

export const $metricRow = $column(layoutSheet.spacingTiny, style({ placeContent: 'center', alignItems: 'center' }))
export const $metricLabel = $row(style({ color: pallete.foreground, letterSpacing: '1px', fontSize: screenUtils.isDesktopScreen ? '.85rem' : '.85rem' }))
export const $metricValue = $row(style({ fontWeight: 900, letterSpacing: '1px', fontSize: '1.85rem' }))


