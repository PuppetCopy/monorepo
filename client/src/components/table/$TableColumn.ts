import { O, Tether } from "@aelea/core"
import { $text, INode, style } from "@aelea/dom"
import { $column, $row, layoutSheet } from "@aelea/ui-components"
import { map } from "@most/core"
import { getTimeSince, readableDate } from "common-utils"
import { IPosition } from "gmx-middleware-utils"
import { IMirrorPosition, getParticiapntPortion } from "puppet-middleware-utils"
import { TableColumn } from "ui-components"
import * as viem from 'viem'
import { $entry, $positionPnl, $puppets, $size, $sizeAndLiquidation } from "../../common/$common.js"


export const $tableHeader = (primaryLabel: string, secondaryLabel: string) => $column(style({ textAlign: 'right' }))(
  $text(primaryLabel),
  $text(style({ fontSize: '.85rem' }))(secondaryLabel)
)


export const slotSizeColumn = <T extends IMirrorPosition>(puppet?: viem.Address): TableColumn<T> => ({
  $head: $tableHeader('Size', 'Leverage'),
  columnOp: O(layoutSheet.spacingTiny, style({ flex: 1.2, placeContent: 'flex-end' })),
  $bodyCallback: map(mp => {

    return $sizeAndLiquidation(mp, puppet)
  })
})

export const settledSizeColumn = (puppet?: viem.Address): TableColumn<IMirrorPosition> => ({
  $head: $tableHeader('Size', 'Leverage'),
  columnOp: O(layoutSheet.spacingTiny, style({ flex: 1.2, placeContent: 'flex-end' })),
  $bodyCallback: map(mp => {
    const size = getParticiapntPortion(mp, mp.maxSizeUsd, puppet)
    const collateral = getParticiapntPortion(mp, mp.maxCollateralUsd, puppet)

    return $size(size, collateral)
  })
})




export const entryColumn: TableColumn<IPosition> = {
  $head: $text('Entry'),
  $bodyCallback: map(pos => {
    return $entry(pos)
  })
}

export const puppetsColumn = <T extends IMirrorPosition>(click: Tether<INode, string>): TableColumn<T> => ({
  $head: $text('Puppets'),
  gridTemplate: '90px',
  $bodyCallback: map((pos) => {
    return $puppets(pos.mirror?.puppetList.map(m => m.account) || [], click)
  })
})

export const pnlColumn = (puppet?: viem.Address): TableColumn<IMirrorPosition> => ({
  $head: $tableHeader('PnL $', 'ROI'),
  gridTemplate: '90px',
  columnOp: style({ placeContent: 'flex-end' }),
  $bodyCallback: map(pos => {
    return $positionPnl(pos, puppet)
  })
})


export const timeColumn: TableColumn<IPosition | IPosition>  = {
  $head: $text('Timestamp'),
  gridTemplate: 'minmax(110px, 120px)',
  $bodyCallback: map((pos) => {
    // const isSettled = isPositionSettled(pos)
    const timestamp = Number(pos.settledTimestamp || pos.openTimestamp)

    return $column(layoutSheet.spacingTiny)(
      $text(readableDate(timestamp)),
      $row(layoutSheet.spacingSmall)(
        $text(style({ fontSize: '.85rem' }))(getTimeSince(timestamp)),
        // $txnIconLink(pos.transactionHash, arbitrum)
      )
    )
  })
}
