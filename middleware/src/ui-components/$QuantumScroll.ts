import { $custom, $node, $text, component, type I$Node, type INodeCompose, style } from 'aelea/core'
import { constant, filter, type IBehavior, type IStream, join, map, merge, until } from 'aelea/stream'
import { $column, observer, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'

export type IQuantumScrollPage = {
  pageSize: number
  offset: number
}

export type IScrollPagable = IQuantumScrollPage & {
  $items: I$Node[]
}

export interface QuantumScroll {
  insertAscending?: boolean
  dataSource: IStream<IScrollPagable>
  $container?: INodeCompose
  $loader?: I$Node
  $emptyMessage?: I$Node
}

export const $defaultVScrollLoader = $node(style({ color: pallete.foreground, padding: '3px 10px' }))(
  $text('loading...')
)
export const $defaultVScrollContainer = $column(spacing.default)
const $defaultEmptyMessage = $column(spacing.default, style({ padding: '20px' }))($text('No items to display'))

export const $QuantumScroll = ({
  dataSource,
  $container = $defaultVScrollContainer,
  $emptyMessage = $defaultEmptyMessage,
  $loader = $defaultVScrollLoader,
  insertAscending = false
  // scrollRequest = empty
}: QuantumScroll) =>
  component(([nextScrollRequest, nextScrollRequestTether]: IBehavior<any, IQuantumScrollPage>) => {
    const $itemLoader = map((nextResponse) => {
      const itemCount = Array.isArray(nextResponse) ? nextResponse.length : nextResponse.$items.length

      if (itemCount === 0) {
        return $emptyMessage
      }

      if (Array.isArray(nextResponse)) {
        return merge(...nextResponse)
      }

      const hasMoreItems = nextResponse.pageSize === itemCount

      const $observerloader = $custom('observer')(
        nextScrollRequestTether(
          observer.intersection({ threshold: 1 }),
          filter(([entry]) => {
            return entry.isIntersecting === true
          }),
          constant({ offset: nextResponse.offset + nextResponse.pageSize, pageSize: nextResponse.pageSize })
        )
      )($loader)

      const $items = hasMoreItems
        ? [...nextResponse.$items, until(nextScrollRequest, $observerloader)]
        : nextResponse.$items

      return merge(...$items)
    }, dataSource)

    return [
      $container(map((node) => ({ ...node, insertAscending })))(join($itemLoader)),

      {
        scrollRequest: nextScrollRequest
      }
    ]
  })
