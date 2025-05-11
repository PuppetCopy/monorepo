import { constant, empty, map, now, switchLatest } from '@most/core'
import type { Stream } from '@most/types'
import {
  $node,
  $svg,
  attr,
  component,
  type I$Node,
  type I$Slottable,
  type IBehavior,
  type INode,
  type INodeCompose,
  type IOps,
  nodeEvent,
  O,
  style
} from 'aelea/core'
import { $column, $icon, $row, isDesktopScreen, layoutSheet, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { $QuantumScroll, type IQuantumScrollPage, type QuantumScroll } from './$QuantumScroll.js'

export type TablePageResponse<T> = IQuantumScrollPage & {
  page: T[]
}

export interface TableOption<T> {
  columns: TableColumn<T>[]
  gridTemplateColumns?: string
  dataSource: Stream<TablePageResponse<T> | T[]>

  $between?: I$Node
  scrollConfig?: Omit<QuantumScroll, 'dataSource'>

  $rowCallback?: IOps<T, INodeCompose>

  $container?: INodeCompose
  $rowContainer?: INodeCompose
  $headerContainer?: INodeCompose

  $cell?: INodeCompose
  $bodyCell?: INodeCompose
  $headerCell?: INodeCompose

  sortBy?: ISortBy
  $sortArrowDown?: I$Node
}

export interface TableColumn<T> {
  $head: I$Slottable
  $bodyCallback: IOps<T, I$Node>
  sortBy?: string

  gridTemplate?: string

  columnOp?: IOps<INode, INode>
}

export interface IPageRequest {
  page: IQuantumScrollPage
  pageSize: number
}

export interface ISortBy<T = any, K extends keyof T = keyof T> {
  direction: 'asc' | 'desc'
  selector: K
}

const $caretDown = $svg('path')(
  attr({
    d: 'M4.616.296c.71.32 1.326.844 2.038 1.163L13.48 4.52a6.105 6.105 0 005.005 0l6.825-3.061c.71-.32 1.328-.84 2.038-1.162l.125-.053A3.308 3.308 0 0128.715 0a3.19 3.19 0 012.296.976c.66.652.989 1.427.989 2.333 0 .906-.33 1.681-.986 2.333L18.498 18.344a3.467 3.467 0 01-1.14.765c-.444.188-.891.291-1.345.314a3.456 3.456 0 01-1.31-.177 2.263 2.263 0 01-1.038-.695L.95 5.64A3.22 3.22 0 010 3.309C0 2.403.317 1.628.95.98c.317-.324.68-.568 1.088-.732a3.308 3.308 0 011.24-.244 3.19 3.19 0 011.338.293z'
  })
)()

export const $defaultTableCell = $row(
  spacing.small,
  style({ padding: '6px 0', minWidth: 0, alignItems: 'center', overflowWrap: 'break-word' })
)
export const $defaultTableHeaderCell = $defaultTableCell(style({ alignItems: 'center', color: pallete.foreground }))
export const $defaultTableRowContainer = $node(isDesktopScreen ? spacing.big : spacing.small)
export const $defaultTableContainer = $column(spacing.default)

export const $Table = <T>({
  dataSource,
  columns,
  scrollConfig,

  $container = $defaultTableContainer,
  $headerContainer = $defaultTableRowContainer,
  $cell = $defaultTableCell,
  $bodyCell = $cell,
  $headerCell = $defaultTableHeaderCell,

  $rowCallback,

  $rowContainer = $defaultTableRowContainer,

  sortBy,
  $between = empty(),
  $sortArrowDown = $caretDown
}: TableOption<T>) =>
  component(
    (
      [scrollRequest, scrollRequestTether]: IBehavior<IQuantumScrollPage, IQuantumScrollPage>,
      [sortByChange, sortByChangeTether]: IBehavior<INode, string>
    ) => {
      const gridTemplateColumns = style({
        display: 'grid',
        gridTemplateColumns: columns.map((col) => col.gridTemplate || '1fr').join(' ')
      })

      const $header = $headerContainer(gridTemplateColumns)(
        ...columns.map((col) => {
          if (col.sortBy) {
            const IBehavior = sortByChangeTether(nodeEvent('click'), constant(col.sortBy))

            return $headerCell(col.columnOp || O(), IBehavior)(
              style({ cursor: 'pointer' }, col.$head),
              sortBy
                ? $column(
                    $icon({
                      $content: $sortArrowDown,
                      svgOps: style({ transform: 'rotate(180deg)' }),
                      width: '8px',
                      viewBox: '0 0 32 19.43',
                      fill:
                        sortBy.selector === col.sortBy && sortBy.direction === 'desc'
                          ? ''
                          : colorAlpha(pallete.message, 0.3)
                    }),
                    $icon({
                      $content: $sortArrowDown,
                      fill:
                        sortBy.selector === col.sortBy && sortBy.direction === 'asc'
                          ? ''
                          : colorAlpha(pallete.message, 0.3),
                      width: '8px',
                      viewBox: '0 0 32 19.43'
                    })
                  )
                : empty()
            )
          }

          const $headCell = $headerCell(col.columnOp || O())(col.$head)

          return $headCell
        })
      )

      const $body = $QuantumScroll({
        ...scrollConfig,
        dataSource: map((res) => {
          const $items = (Array.isArray(res) ? res : res.page).map((rowData) => {
            return $rowCallback
              ? switchLatest(
                  map(
                    ($rowContainer) => {
                      return $rowContainer(gridTemplateColumns)(
                        ...columns.map((col) => {
                          return $bodyCell(col.columnOp || O())(switchLatest(col.$bodyCallback(now(rowData))))
                        })
                      )
                    },
                    $rowCallback(now(rowData))
                  )
                )
              : $rowContainer(gridTemplateColumns)(
                  ...columns.map((col) => {
                    return $bodyCell(col.columnOp || O())(switchLatest(col.$bodyCallback(now(rowData))))
                  })
                )
          })

          if (Array.isArray(res)) {
            return $items
          }
          return {
            $items,
            offset: res.offset,
            pageSize: res.pageSize
          }
        }, dataSource)
      })({
        scrollRequest: scrollRequestTether()
      })

      return [
        $container($header, $between, $body),

        {
          scrollRequest,
          sortBy: map((selector) => {
            if (!sortBy) {
              return sortBy
            }

            if (sortBy.selector === selector) {
              const direction = sortBy.direction === 'asc' ? 'desc' : 'asc'

              return { direction, selector }
            }

            return { direction: sortBy.direction, selector }
          }, sortByChange)
        }
      ]
    }
  )
