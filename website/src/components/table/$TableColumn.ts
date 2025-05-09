import { map, skipRepeats } from '@most/core'
import { latestPriceMap } from '@puppet/middleware/core'
import { getMarketIndexToken, getPositionPnlUsd } from '@puppet/middleware/gmx'
import { $infoTooltip, type TableColumn } from '@puppet/middleware/ui-components'
import {
  getBasisPoints,
  getMappedValue,
  getTimeSince,
  readableDate,
  readablePercentage
} from '@puppet/middleware/utils'
import { $node, $text, type IComposeBehavior, type INode, O, style, switchMap, toStream } from 'aelea/core'
import { $column, $row, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type * as viem from 'viem'
import { $entry, $openPositionBreakdown, $pnlDisplay, $puppetList, $size } from '../../common/$common.js'
import { $seperator2 } from '../../pages/common.js'

export const $tableHeader = (primaryLabel: string, secondaryLabel: string) =>
  $column(style({ textAlign: 'right' }))(
    $text(primaryLabel),
    $node(style({ fontSize: '.85rem' }))($text(secondaryLabel))
  )

// export const sizeColumn = (puppet?: viem.Address): TableColumn<IPosition> => ({
//   $head: $tableHeader('Size', 'Leverage'),
//   columnOp: O(spacing.tiny, style({ flex: 1.2, placeContent: 'flex-end' })),
//   $bodyCallback: map((mp) => {
//     const size = getParticiapntPortion(mp, mp.maxSizeInUsd, puppet)
//     const collateral = getParticiapntPortion(mp, mp.maxCollateralInUsd, puppet)

//     return $size(size, collateral)
//   })
// })

export const entryColumn: TableColumn<IPosition> = {
  $head: $text('Entry'),
  $bodyCallback: map((pos) => {
    return $entry(pos)
  })
}

export const puppetsColumn = (click: IComposeBehavior<INode, string>): TableColumn<IPosition> => ({
  $head: $text('Puppets'),
  gridTemplate: '90px',
  $bodyCallback: map((pos) => {
    return $puppetList(pos.puppetList?.map((m) => m.account) || [], click)
  })
})

export const pnlColumn = (puppet?: viem.Address): TableColumn<IPosition> => ({
  $head: $tableHeader('PnL $', 'ROI'),
  gridTemplate: '90px',
  columnOp: style({ placeContent: 'flex-start' }),
  $bodyCallback: map((pos) => {
    const indexToken = getMarketIndexToken(pos.market)
    const latestPrice = map((pm) => getMappedValue(pm, indexToken).max, latestPriceMap)
    const isSettled = isPositionSettled(pos)

    const updateList = [...pos.increaseList, ...pos.decreaseList].sort((a, b) => a.blockTimestamp - b.blockTimestamp)
    const totalPositionFeeAmount = updateList.reduce(
      (acc, next) => acc + next.feeCollected.positionFeeAmount * next.collateralTokenPriceMax,
      0n
    )
    const totalBorrowingFeeAmount = updateList.reduce(
      (acc, next) => acc + next.feeCollected.borrowingFeeAmount * next.collateralTokenPriceMax,
      0n
    )
    const totalFundingFeeAmount = updateList.reduce(
      (acc, next) => acc + next.feeCollected.fundingFeeAmount * next.collateralTokenPriceMax,
      0n
    )

    const totalFeesUsd = totalPositionFeeAmount + totalBorrowingFeeAmount + totalFundingFeeAmount

    const pnl = isSettled
      ? getSettledMpPnL(pos, puppet)
      : map((price) => {
          return (
            pos.realisedPnlUsd +
            getPositionPnlUsd(pos.isLong, pos.lastUpdate.sizeInUsd, pos.lastUpdate.sizeInTokens, price) -
            totalFeesUsd
          )
        }, latestPrice)

    const displayColor = skipRepeats(
      map((value) => {
        return value > 0n ? pallete.positive : value === 0n ? pallete.foreground : pallete.negative
      }, toStream(pnl))
    )

    return isSettled
      ? $pnlDisplay(pnl)
      : $column(spacing.tiny)(
          $row(style({ alignItems: 'center' }))(
            switchMap((color) => {
              return style({ backgroundColor: colorAlpha(color, 0.1), borderRadius: '50%' })(
                $infoTooltip($openPositionBreakdown(pos), color, '18px')
              )
            }, displayColor),
            $pnlDisplay(pnl)
          ),
          $seperator2,
          // $liquidationSeparator(pos.isLong, pos.lastUpdate.sizeInUsd, pos.lastUpdate.sizeInTokens, pos.lastUpdate.collateralAmount, latestPrice),
          $node(style({ fontSize: '.85rem' }))(
            $text(
              map((value) => {
                return readablePercentage(getBasisPoints(value, pos.maxCollateralInUsd))
              }, toStream(pnl))
            )
          )
        )
  })
})

export const timeColumn: TableColumn<IPosition> = {
  $head: $text('Settle Timestamp'),
  gridTemplate: 'minmax(110px, 120px)',
  sortBy: 'openTimestamp',
  $bodyCallback: map((pos) => {
    return $column(spacing.tiny)(
      $text(getTimeSince(pos.openTimestamp)),
      $row(spacing.small)($node(style({ fontSize: '.85rem' }))($text(readableDate(pos.openTimestamp))))
    )
  })
}
