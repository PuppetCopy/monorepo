import {
  getMappedValue,
  getTimeSince,
  readableDate,
  readablePercentage,
  toBasisPoints
} from '@puppet-copy/middleware/core'
import { getPositionPnlUsd } from '@puppet-copy/middleware/gmx'
import { empty, filterNull, map, skipRepeats, switchMap, toStream } from 'aelea/stream'
import type { IComposeBehavior } from 'aelea/stream-extended'
import { $node, $text, type INode, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { getAddress } from 'viem'
import type { Address } from 'viem/accounts'
import { $defaultTableCell, $infoTooltip, type TableColumn } from '@/ui-components'
import { $entry, $openPositionBreakdown, $pnlDisplay, $puppetList, $size } from '../../common/$common.js'
import { latestPriceMap } from '../../logic/latestPriceMap.js'
import { $seperator2 } from '../../pages/common.js'
import type { IPosition } from '../../pages/types.js'
import { isPositionSettled } from '../../utils/utils.js'

export const $tableHeader = (primaryLabel: string, secondaryLabel: string) =>
  $column(style({ whiteSpace: 'nowrap' }))(
    $node(style({ fontWeight: 'bold' }))($text(primaryLabel)),
    $node(style({ fontSize: '.8rem' }))($text(secondaryLabel))
  )

export const sizeColumn = (): TableColumn<IPosition> => ({
  $head: $tableHeader('Max Size', 'Leverage'),
  gridTemplate: '78px',
  $bodyCallback: map(mp => {
    return $size(mp.maxSizeInUsd, mp.maxCollateralInUsd)
  })
})

export const entryColumn: TableColumn<IPosition> = {
  $head: $text('Entry'),
  $bodyCallback: map(pos => {
    return $entry(pos)
  })
}

export const puppetsColumn = (click: IComposeBehavior<INode, string>): TableColumn<IPosition> => ({
  $head: $text('Puppets'),
  gridTemplate: '90px',
  $bodyCallback: map(pos => {
    return $puppetList(pos.puppetList, click)
  })
})

export const pnlColumn = (_puppet?: Address): TableColumn<IPosition> => ({
  $head: $tableHeader('PnL $', 'ROI'),
  gridTemplate: '100px',
  $bodyCellContainer: $defaultTableCell(style({ placeContent: 'flex-start' })),
  $bodyCallback: map(pos => {
    const latestPrice = filterNull(
      map(pm => {
        const oraclePrice = getMappedValue(pm, getAddress(pos.indexToken), null)

        if (oraclePrice === null) {
          return null
        }
        return oraclePrice.price
      }, latestPriceMap)
    )
    const isSettled = isPositionSettled(pos)

    // const updateList = [...pos.increaseList, ...pos.decreaseList].sort((a, b) => a.blockTimestamp - b.blockTimestamp)
    // TODO: Fix fee collection - need to include feeCollected relation in query
    const totalPositionFeeAmount = 0n // updateList.reduce((acc, next) => acc + next.feeCollected.positionFeeAmount * next.collateralTokenPriceMax, 0n)
    const totalBorrowingFeeAmount = 0n // updateList.reduce((acc, next) => acc + next.feeCollected.borrowingFeeAmount * next.collateralTokenPriceMax, 0n)
    const totalFundingFeeAmount = 0n // updateList.reduce((acc, next) => acc + next.feeCollected.fundingFeeAmount * next.collateralTokenPriceMax, 0n)

    const totalFeesUsd = totalPositionFeeAmount + totalBorrowingFeeAmount + totalFundingFeeAmount

    const pnl = isSettled
      ? pos.realisedPnlUsd
      : map(price => {
          return (
            pos.realisedPnlUsd +
            getPositionPnlUsd(pos.isLong, pos.lastUpdate.sizeInUsd, pos.lastUpdate.sizeInTokens, price) -
            totalFeesUsd
          )
        }, latestPrice)

    const displayColor = skipRepeats(
      map(value => {
        return value > 0n ? pallete.positive : value === 0n ? pallete.foreground : pallete.negative
      }, toStream(pnl))
    )

    return isSettled
      ? $pnlDisplay(pnl)
      : $column(spacing.tiny)(
          $row(style({ alignItems: 'center' }))(
            switchMap(color => {
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
              map(value => {
                return readablePercentage(toBasisPoints(value, pos.maxCollateralInUsd))
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
  $bodyCallback: map(pos => {
    return pos.lastUpdate.sizeInUsd === 0n
      ? $column(spacing.tiny)(
          $text(getTimeSince(pos.lastUpdateTimestamp)),
          $row(spacing.small)($node(style({ fontSize: '.8rem' }))($text(readableDate(pos.lastUpdateTimestamp))))
        )
      : empty
  })
}
