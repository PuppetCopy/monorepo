import { O, Tether } from "@aelea/core"
import { $text, INode, style } from "@aelea/dom"
import { $column, $row, layoutSheet } from "@aelea/ui-components"
import { map, skipRepeats } from "@most/core"
import { getBasisPoints, getTimeSince, readableDate, readablePercentage, streamOf, switchMap } from "common-utils"
import { IPosition, getParticiapntPortion, getSettledMpPnL, isPositionSettled, latestPriceMap } from "puppet-middleware"
import { $infoTooltip, TableColumn } from "ui-components"
import * as viem from 'viem'
import { $entry, $openPositionBreakdown, $pnlDisplay, $puppetList, $size } from "../../common/$common.js"
import { pallete, colorAlpha } from "@aelea/ui-components-theme"
import { getMarketIndexToken, getPositionPnlUsd } from "gmx-middleware"
import { $seperator2 } from "../../pages/common"


export const $tableHeader = (primaryLabel: string, secondaryLabel: string) => $column(style({ textAlign: 'right' }))(
  $text(primaryLabel),
  $text(style({ fontSize: '.85rem' }))(secondaryLabel)
)


export const sizeColumn = (puppet?: viem.Address): TableColumn<IPosition> => ({
  $head: $tableHeader('Size', 'Leverage'),
  columnOp: O(layoutSheet.spacingTiny, style({ flex: 1.2, placeContent: 'flex-end' })),
  $bodyCallback: map(mp => {
    const size = getParticiapntPortion(mp, mp.maxSizeInUsd, puppet)
    const collateral = getParticiapntPortion(mp, mp.maxCollateralInUsd, puppet)

    return $size(size, collateral)
  })
})




export const entryColumn: TableColumn<IPosition> = {
  $head: $text('Entry'),
  $bodyCallback: map(pos => {
    return $entry(pos)
  })
}

export const puppetsColumn = (click: Tether<INode, string>): TableColumn<IPosition> => ({
  $head: $text('Puppets'),
  gridTemplate: '90px',
  $bodyCallback: map((pos) => {
    return $puppetList(pos.puppetList?.map(m => m.account) || [], click)
  })
})

export const pnlColumn = (puppet?: viem.Address): TableColumn<IPosition> => ({
  $head: $tableHeader('PnL $', 'ROI'),
  gridTemplate: '90px',
  columnOp: style({ placeContent: 'flex-start' }),
  $bodyCallback: map(pos => {
    const indexToken = getMarketIndexToken(pos.market)
    const latestPrice = map(pm => pm[indexToken].max, latestPriceMap)
    const isSettled = isPositionSettled(pos)

    const updateList = [...pos.increaseList, ...pos.decreaseList].sort((a, b) => a.blockTimestamp - b.blockTimestamp)
    const totalPositionFeeAmount = updateList.reduce((acc, next) => acc + next.feeCollected.positionFeeAmount * next.collateralTokenPriceMax, 0n)
    const totalBorrowingFeeAmount = updateList.reduce((acc, next) => acc + next.feeCollected.borrowingFeeAmount * next.collateralTokenPriceMax, 0n)
    const totalFundingFeeAmount = updateList.reduce((acc, next) => acc + next.feeCollected.fundingFeeAmount * next.collateralTokenPriceMax, 0n)

    const totalFeesUsd = totalPositionFeeAmount + totalBorrowingFeeAmount + totalFundingFeeAmount


    const pnl = isSettled
      ? getSettledMpPnL(pos, puppet)
      : map(price => {
        return pos.realisedPnlUsd + getPositionPnlUsd(pos.isLong, pos.lastUpdate.sizeInUsd, pos.lastUpdate.sizeInTokens, price) - totalFeesUsd
      }, latestPrice)


    const displayColor = skipRepeats(map(value => {
      return value > 0n ? pallete.positive : value === 0n ? pallete.foreground : pallete.negative
    }, streamOf(pnl)))


    return isSettled
      ? $pnlDisplay(pnl)
      : $column(layoutSheet.spacingTiny)(
        $row(style({ alignItems: 'center' }))(
          switchMap(color => {
            return style({ backgroundColor: colorAlpha(color, .1), borderRadius: '50%' })(
              $infoTooltip($openPositionBreakdown(pos), color, '18px')
            )
          }, displayColor),
          $pnlDisplay(pnl),
        ),
        $seperator2,
        // $liquidationSeparator(pos.isLong, pos.lastUpdate.sizeInUsd, pos.lastUpdate.sizeInTokens, pos.lastUpdate.collateralAmount, latestPrice),
        $text(style({ fontSize: '.85rem' }))(
          map(value => {
            return readablePercentage(getBasisPoints(value, pos.maxCollateralInUsd))
          }, streamOf(pnl))
        )
      )
  })
})


export const timeColumn: TableColumn<IPosition>  = {
  $head: $text('Open Timestamp'),
  gridTemplate: 'minmax(110px, 120px)',
  sortBy: 'openTimestamp',
  $bodyCallback: map(pos => {
    return $column(layoutSheet.spacingTiny)(
      $text(getTimeSince(pos.openTimestamp)),
      $row(layoutSheet.spacingSmall)(
        $text(style({ fontSize: '.85rem' }))(readableDate(pos.openTimestamp))
      )
    )
  })
}

