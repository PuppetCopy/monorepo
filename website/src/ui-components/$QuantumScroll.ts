import { empty, filter, type Fn, type IStream, join, joinMap, just, map, merge, until } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $custom, $node, $text, component, type I$Node, type INodeCompose, style } from 'aelea/ui'
import { $column, observer, spacing } from 'aelea/ui-components'
import { $intermediatePromise, $spinner } from './$IntermediateDisplay.js'

export type IQuantumScrollPage = {
  pageSize: number
  offset: number
}

export type IScrollPagable = IQuantumScrollPage & {
  $items: I$Node[]
  hasMore?: boolean
  isLoading?: boolean
}

export interface QuantumScroll {
  insertAscending?: boolean
  dataSource: IStream<Promise<IScrollPagable>>
  $container?: INodeCompose
  $loader?: I$Node
  $emptyMessage?: I$Node
  $$fail?: Fn<Error, I$Node>
}

export const $defaultVScrollContainer = $column(spacing.default)
const $defaultEmptyMessage = $column(spacing.default, style({ padding: '20px' }))($text('No items to display'))

export const $QuantumScroll = ({
  dataSource,
  $container = $defaultVScrollContainer,
  $emptyMessage = $defaultEmptyMessage,
  $loader = $spinner,
  $$fail,
  insertAscending = false
}: QuantumScroll) =>
  component(([nextScrollRequest, nextScrollRequestTether]: IBehavior<any, IQuantumScrollPage>) => {
    return [
      $container(map(node => ({ ...node, insertAscending })))(
        joinMap(dataPromise => {
          return $intermediatePromise({
            $loader,
            $$fail,
            $display: just(
              dataPromise.then(response => {
                const { $items, pageSize, offset } = response
                const itemCount = $items.length

                const hasMore = itemCount === pageSize && itemCount > 0
                const nextOffset = offset + pageSize

                // Empty state on first page
                if (offset === 0 && itemCount === 0) {
                  return $emptyMessage
                }

                // No items in this page
                if (itemCount === 0) {
                  return empty
                }

                // Return items + observer if more pages
                if (!hasMore) {
                  return merge(...$items)
                }

                return merge(
                  ...$items,
                  until(
                    nextScrollRequest,
                    $custom('observer')(
                      nextScrollRequestTether(
                        observer.intersection({ threshold: 0.25, rootMargin: '200px 0px 200px 0px' }),
                        filter(([entry]) => entry.isIntersecting),
                        map(() => ({ offset: nextOffset, pageSize }))
                      )
                    )($node(style({ height: '12px', width: '100%' }))())
                  )
                )
              })
            )
          })
        }, dataSource)
      ),
      { scrollRequest: nextScrollRequest }
    ]
  })
