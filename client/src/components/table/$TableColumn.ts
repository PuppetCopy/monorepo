import { O, Tether } from "@aelea/core"
import { $text, INode, style } from "@aelea/dom"
import { $column, $row, layoutSheet } from "@aelea/ui-components"
import { map } from "@most/core"
import { getTimeSince, readableDate } from "common-utils"
import { IPosition, getParticiapntPortion } from "puppet-middleware-utils"
import { TableColumn } from "ui-components"
import * as viem from 'viem'
import { $entry, $positionPnl, $puppetList, $size } from "../../common/$common.js"


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
  columnOp: style({ placeContent: 'flex-end' }),
  $bodyCallback: map(pos => {
    return $positionPnl(pos, puppet)
  })
})


export const timeColumn: TableColumn<IPosition>  = {
  $head: $text('Timestamp'),
  gridTemplate: 'minmax(110px, 120px)',
  $bodyCallback: map(pos => {
    return $column(layoutSheet.spacingTiny)(
      $text(readableDate(pos.openTimestamp)),
      $row(layoutSheet.spacingSmall)(
        $text(style({ fontSize: '.85rem' }))(getTimeSince(pos.openTimestamp))
      )
    )
  })
}

