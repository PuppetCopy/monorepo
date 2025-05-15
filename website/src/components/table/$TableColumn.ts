import { map, skipRepeats } from '@most/core'
import { latestPriceMap } from '@puppet/middleware/core'
import { getPositionPnlUsd } from '@puppet/middleware/gmx'
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
import type { Address } from 'viem/accounts'
import { $entry, $openPositionBreakdown, $pnlDisplay, $puppetList, $size } from '../../common/$common.js'
import { $seperator2 } from '../../pages/common.js'
import type { IPosition } from '../../pages/type.js'
import { isPositionSettled } from '../../utils/utils.js'

export const $tableHeader = (primaryLabel: string, secondaryLabel: string) =>
  $column(style({ textAlign: 'right', whiteSpace: 'nowrap' }))(
    $node(style({ fontWeight: 'bold' }))($text(primaryLabel)),
    $node(style({ fontSize: '.8rem' }))($text(secondaryLabel))
  )

export const sizeColumn = (): TableColumn<IPosition> => ({
  $head: $tableHeader('Max Size', 'Leverage'),
  columnOp: O(spacing.tiny, style({ placeContent: 'flex-end' })),
  $bodyCallback: map((mp) => {
    return $size(mp.maxSizeInUsd, mp.maxCollateralInUsd)
  })
})

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
    return $puppetList(pos.puppetList, click)
  })
})

export const pnlColumn = (puppet?: Address): TableColumn<IPosition> => ({
  $head: $tableHeader('PnL $', 'ROI'),
  gridTemplate: '90px',
  columnOp: style({ placeContent: 'flex-start' }),
  $bodyCallback: map((pos) => {
    const latestPrice = map((pm) => getMappedValue(pm, pos.indexToken).max, latestPriceMap)
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
      ? pos.realisedPnlUsd
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
          $node(style({ fontSize: '.8rem' }))(
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
  // sortBy: 'openTimestamp',
  $bodyCallback: map((pos) => {
    return $column(spacing.tiny)(
      $text(getTimeSince(pos.lastUpdateTimestamp)),
      $row(spacing.small)($node(style({ fontSize: '.8rem' }))($text(readableDate(pos.lastUpdateTimestamp))))
    )
  })
}
