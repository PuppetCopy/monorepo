import { constant, empty, map, merge, mergeArray, now, skip, skipRepeats, switchLatest, take, zip } from '@most/core'
import type { Stream } from '@most/types'
import {
  $node,
  $text,
  combineState,
  component,
  eventElementTarget,
  type I$Node,
  type I$Slottable,
  type IBehavior,
  type INode,
  type INodeCompose,
  type IOps,
  nodeEvent,
  style,
  styleInline,
  stylePseudo,
  switchMap,
  toStream
} from 'aelea/core'
import { $column, $row, observer, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'

export const $defaultOptionContainer = $row(
  spacing.small,
  style({ alignItems: 'center', borderBottom: `1px solid ${pallete.horizon}`, padding: '12px 20px', width: '100%' }),
  style({ cursor: 'pointer' }),
  stylePseudo(':hover', { backgroundColor: pallete.horizon })
)
export const $defaultSelectContainer = $column(
  style({
    left: 0,
    minWidth: '80px',
    overflow: 'hidden',
    border: `1px solid ${pallete.horizon}`,
    borderRadius: '20px',
    backgroundColor: pallete.background,
    boxShadow: 'rgb(0 0 0 / 21%) 1px 1px 14px'
  })
)
export const $defaultDropListContainer = $column(
  style({
    whiteSpace: 'pre-wrap',
    maxWidth: '600px',
    userSelect: 'text',
    background: pallete.background,
    boxShadow: `${colorAlpha(pallete.message, 0.14)} 0px 4px 20px 8px, ${colorAlpha(pallete.message, 0.1)} 0px 1px 3px 1px`,
    borderRadius: '8px',
    fontWeight: 'normal',
    overflow: 'hidden'
  })
)

export const $defaulMultiselectDropContainer = $node(
  style({
    position: 'relative',
    alignItems: 'center',
    height: '44px',
    display: 'grid',
    gridAutoFlow: 'column',
    // gridAutoColumns: 'minmax(50px, 1fr)',
    borderRadius: '20px',
    border: `1px solid ${pallete.horizon}`,
    backgroundColor: pallete.background
  })
)

export interface IDropdown<T> {
  optionList: Stream<T[]> | T[]
  $anchor: I$Node

  closeOnSelect?: boolean

  $$option?: IOps<T, I$Slottable>
  $container?: INodeCompose
  $dropListContainer?: INodeCompose
  $optionContainer?: INodeCompose
}

export function $Dropdown<T>({
  $anchor,
  optionList,

  closeOnSelect = true,

  $container = $defaulMultiselectDropContainer,
  $dropListContainer = $defaultDropListContainer,
  $$option = map(<T>(o: T) => $node($text(String(o)))),
  $optionContainer = $defaultOptionContainer
}: IDropdown<T>) {
  return component(
    (
      [select, selectTether]: IBehavior<any, T>,
      [openMenu, openMenuTether]: IBehavior<INode, any>,
      [targetIntersection, targetIntersectionTether]: IBehavior<INode, IntersectionObserverEntry[]>,
      [contentIntersection, contentIntersectionTether]: IBehavior<INode, IntersectionObserverEntry[]>
    ) => {
      const openTrigger = constant(true, mergeArray([openMenu]))
      const windowClick = switchLatest(
        map((_open) => take(1, skip(1, eventElementTarget('click', window))), openTrigger)
      )

      const closeTrigger = constant(false, mergeArray([windowClick, closeOnSelect ? select : empty()]))

      const isOpen = skipRepeats(merge(closeTrigger, openTrigger))

      return [
        $container(
          openMenuTether(nodeEvent('click')), //
          targetIntersectionTether(observer.intersection())
        )(
          switchMap(
            (params) => {
              if (!params.isOpen) {
                return empty()
              }

              return $dropListContainer(
                styleInline(
                  zip(
                    ([targetRect], [contentRect]) => {
                      const { bottom, right, left } = targetRect.intersectionRect
                      const { width } = contentRect.boundingClientRect

                      const rootWidth = targetRect.rootBounds?.width || 0

                      const bottomSpcace = window.innerHeight - bottom
                      const goDown = bottomSpcace > bottom
                      const placedWidth = left + width
                      const leftOffset = placedWidth > rootWidth ? rootWidth - placedWidth - 20 : 0

                      return {
                        [goDown ? 'top' : 'bottom']: 'calc(100% + 5px)',
                        left: `${leftOffset}px`,
                        visibility: 'visible'
                      }
                    },
                    targetIntersection,
                    contentIntersection
                  )
                ),
                contentIntersectionTether(observer.intersection()),
                style({
                  zIndex: 60,
                  visibility: 'hidden',
                  position: 'absolute'
                })
              )(
                ...params.list.map((opt) =>
                  $optionContainer(
                    selectTether(nodeEvent('click'), constant(opt)) //
                  )(switchLatest($$option(now(opt))))
                )
              )
            },
            combineState({ isOpen, list: toStream(optionList) })
          ),
          $anchor
        ),

        {
          select
        }
      ]
    }
  )
}
