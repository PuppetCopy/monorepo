import { constant, filter, join, map, mergeArray, now, recoverWith, until } from '@most/core'
import type { Stream } from '@most/types'
import type { Behavior } from 'aelea/core'
import { type $Branch, $custom, $text, component, type I$Node, type NodeComposeFn, style } from 'aelea/core'
import { $column, layoutSheet, observer } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { $alertNegativeContainer } from './$common.js'

export type IQuantumScrollPage = {
  pageSize: number
  offset: number
}

export type IScrollPagable = IQuantumScrollPage & {
  $items: $Branch[]
}

export interface QuantumScroll {
  insertAscending?: boolean
  dataSource: Stream<IScrollPagable>
  $container?: NodeComposeFn<$Node>
  $loader?: I$Node
  $emptyMessage?: I$Node
}

export const $defaultVScrollLoader = $text(style({ color: pallete.foreground, padding: '3px 10px' }))('loading...')
export const $defaultVScrollContainer = $column(spacing.default)
const $defaultEmptyMessage = $column(spacing.default, style({ padding: '20px' }))($text('No items to display'))

export const $QuantumScroll = ({
  dataSource,
  $container = $defaultVScrollContainer,
  $emptyMessage = $defaultEmptyMessage,
  $loader = $defaultVScrollLoader,
  insertAscending = false
  // scrollRequest = empty()
}: QuantumScroll) =>
  component(([nextScrollRequest, nextScrollRequestTether]: Behavior<any, IQuantumScrollPage>) => {
    const $itemLoader = map((nextResponse) => {
      const itemCount = Array.isArray(nextResponse) ? nextResponse.length : nextResponse.$items.length

      if (itemCount === 0) {
        return $emptyMessage
      }

      if (Array.isArray(nextResponse)) {
        return mergeArray(nextResponse)
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

      return mergeArray($items)
    }, dataSource)

    return [
      $container(map((node) => ({ ...node, insertAscending })))(
        join(
          mergeArray([
            recoverWith((err) => {
              return now(
                $alertNegativeContainer(style({ alignSelf: 'center', margin: '10px' }))(
                  $text(String(err.message || ('reason' in err ? err.cause : 'unknown error')))
                )
              )
            }, $itemLoader)
          ])
        )
      ),

      {
        scrollRequest: nextScrollRequest
      }
    ]
  })
