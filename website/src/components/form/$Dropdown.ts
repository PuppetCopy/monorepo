import {
  constant,
  empty,
  filter,
  map,
  merge,
  mergeArray,
  multicast,
  never,
  now,
  scan,
  skip,
  skipRepeats,
  switchLatest,
  take,
  tap,
  zip
} from '@most/core'
import { append, remove } from '@most/prelude'
import type { Stream } from '@most/types'
import { $caretDown, $xCross } from '@puppet/middleware/ui-components'
import {
  $node,
  $text,
  combineState,
  component,
  eventElementTarget,
  type I$Node,
  type IBehavior,
  type INode,
  type INodeCompose,
  type IOps,
  isEmpty,
  nodeEvent,
  O,
  style,
  styleBehavior,
  styleInline,
  stylePseudo,
  switchMap,
  toStream
} from 'aelea/core'
import { $column, $icon, $row, type Input, layoutSheet, observer, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { $Select, type ISelect } from './$Select'

export interface IMultiselect<T> extends ISelect<T> {}

export interface IDropdown<T> {
  optionList: Stream<T[]> | T[]
  $selection: I$Node

  $$option?: IOps<T, I$Node>
  $container?: INodeCompose
  $dropContainer?: INodeCompose
  $optionContainer?: INodeCompose

  openMenuOp?: IOps<MouseEvent, MouseEvent>
}

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

export const $defaultDropContainer = $column(
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

export function $Dropdown<T>({
  optionList,

  $container = $column(spacing.tiny, style({ position: 'relative' })),
  $dropContainer = $defaultDropContainer,
  $$option = map(<T>(o: T) => $node($text(String(o)))),
  $selection,
  $optionContainer = $defaultOptionContainer,
  openMenuOp = O()
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

      const closeTrigger = constant(false, mergeArray([windowClick]))

      const isOpen = skipRepeats(merge(closeTrigger, openTrigger))

      return [
        $container(
          openMenuTether(nodeEvent('pointerdown'), openMenuOp),
          targetIntersectionTether(observer.intersection())
        )(
          switchMap(
            ({ isOpen, list }) => {
              if (!isOpen) {
                return empty()
              }

              return $dropContainer(
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
                ...list.map((opt) =>
                  $optionContainer(
                    selectTether(nodeEvent('click'), constant(opt)) //
                  )(switchLatest($$option(now(opt))))
                )
              )
            },
            combineState({ isOpen, list: toStream(optionList) })
          )
        ),

        {
          select
        }
      ]
    }
  )
}

export const $defaultDropMultiSelectOption = $row(
  spacing.small,
  style({
    overflow: 'hidden',
    border: `1px solid ${pallete.message}`,
    alignItems: 'center',
    padding: '4px 8px',
    width: '100%'
  }),
  stylePseudo(':hover', { backgroundColor: pallete.horizon })
)
export const $defaultChip = $row(
  style({
    backgroundColor: pallete.primary,
    paddingLeft: '4px',
    cursor: 'default',
    alignItems: 'center',
    borderRadius: '22px'
  })
)

export interface IMultiselectDrop<T> extends Input<T[]> {
  placeholder?: string
  closeOnSelect?: boolean
  getId?: (item: T) => string | number

  selector: Omit<IMultiselect<T>, 'value'>

  $label?: I$Node

  $container?: INodeCompose
  $dropdownContainer?: INodeCompose

  $chip?: INodeCompose
  $$chip: IOps<T, I$Node>
  openMenu?: Stream<any>
}

export const $DropMultiSelect = <T>({
  $container = $column(spacing.tiny, style({ display: 'flex', position: 'relative' })),
  $$chip,
  $label = empty(),
  $chip = $defaultChip,
  selector,
  validation = never,
  value,
  getId
}: IMultiselectDrop<T>) =>
  component(
    (
      [pick, pickTether]: IBehavior<T, T>,
      [targetIntersection, targetIntersectionTether]: IBehavior<INode, IntersectionObserverEntry[]>,

      [openMenu, openMenuTether]: IBehavior<INode, any>,

      [clickOptionRemove, clickOptionRemoveTether]: IBehavior<INode, T>
    ) => {
      const openTrigger = constant(true, mergeArray([openMenu]))
      const windowClick = switchLatest(
        map((_open) => take(1, skip(1, eventElementTarget('click', window))), openTrigger)
      )

      const closeTrigger = constant(false, mergeArray([windowClick]))

      const isOpen = skipRepeats(merge(closeTrigger, openTrigger))

      const clickOpenBehavior = O(
        openMenuTether(nodeEvent('pointerdown')),
        targetIntersectionTether(observer.intersection())
      )

      const select = switchLatest(
        map((initSeedList) => {
          return skip(
            1,
            scan(
              (seed, next) => {
                const matchedIndex = getId ? seed.findIndex((item) => getId(item) === getId(next)) : seed.indexOf(next)

                if (matchedIndex === -1) {
                  return append(next, seed)
                }

                return remove(matchedIndex, seed)
              },
              initSeedList,
              mergeArray([pick, clickOptionRemove])
            )
          )
        }, value)
      )

      const selectionChange = merge(select, value)
      const alert = validation(selectionChange)
      const state = combineState({ isOpen, alert })

      return [
        $container(
          $row(layoutSheet.flex, spacing.tiny, style({ display: 'flex', flexDirection: 'row', position: 'relative' }))(
            isEmpty($label) ? empty() : $row(style({ alignSelf: 'flex-end', cursor: 'pointer' }))($label),

            $row(spacing.tiny, style({ borderBottom: `1px solid ${pallete.message}` }))(
              styleBehavior(
                map((params) => {
                  if (params.alert) {
                    return { borderColor: pallete.negative }
                  }

                  return params.isOpen ? { borderColor: pallete.foreground } : null
                }, state)
              ),
              targetIntersectionTether(observer.intersection(), multicast),
              layoutSheet.flex,
              spacing.small,
              style({ alignItems: 'center', position: 'relative', flexWrap: 'wrap' })
            )(
              switchMap((valueList) => {
                return mergeArray(
                  valueList.map((token) => {
                    return $chip(
                      switchLatest($$chip(now(token))),
                      $icon({
                        $content: $xCross,
                        width: '28px',
                        svgOps: O(
                          style({ padding: '4px', cursor: 'pointer' }),
                          clickOptionRemoveTether(
                            nodeEvent('click'),
                            tap((x) => x.preventDefault()),
                            constant(token)
                          )
                        ),
                        viewBox: '0 0 32 32'
                      })
                    )
                  })
                )
              }, selectionChange),

              $row(
                clickOpenBehavior,
                style({ alignItems: 'center', cursor: 'pointer', padding: '0 8px', flex: '1', alignSelf: 'stretch' })
              )(
                $icon({
                  $content: $caretDown,
                  width: '12px',
                  svgOps: style({ minWidth: '12px', margin: '2px 1px 0' }),
                  viewBox: '0 0 32 32'
                })
              )
            ),

            switchMap(
              (params) => {
                if (!params.isOpen) {
                  return empty()
                }

                const $floatingContainer = (selector.$container || $defaultSelectContainer)(
                  style({
                    padding: '8px',
                    zIndex: 50,
                    position: 'absolute',
                    visibility: 'hidden'
                  })
                )

                const optionSelection = params.list.filter((n) => {
                  const id = getId ? getId(n) : n
                  return params.selectionChange.findIndex((item) => (getId ? getId(item) === id : item === id)) === -1
                })

                if (optionSelection.length === 0) {
                  return $floatingContainer($text('Nothing to select'))
                }

                const dropBehavior = O(
                  styleInline(
                    map(([rect]) => {
                      const { bottom } = rect.intersectionRect

                      const bottomSpcace = window.innerHeight - bottom
                      const goDown = bottomSpcace > bottom

                      return goDown
                        ? {
                            top: 'calc(100% + -1px)',
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            display: 'flex',
                            visibility: 'visible'
                          }
                        : {
                            bottom: 'calc(100% + -1px)',
                            visibility: 'visible',
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            display: 'flex'
                          }
                    }, targetIntersection)
                  )
                )

                return dropBehavior(
                  $Select({
                    ...selector,
                    $container: $floatingContainer,
                    list: optionSelection
                  })({
                    select: pickTether()
                  })
                )
              },
              combineState({ list: toStream(selector.list), isOpen, selectionChange })
            )
          ),

          switchMap((msg) => {
            if (!msg) {
              return empty()
            }

            return $node(style({ color: pallete.negative, fontSize: '.8rem', minHeight: '17px' }))($text(msg))
          }, alert)
        ),

        {
          select,
          alert
        }
      ]
    }
  )

export const interactionOp = O(
  (src: I$Node) => merge(nodeEvent('focus', src), nodeEvent('pointerover', src)),
  constant(true)
)

export const dismissOp = O(
  (src: I$Node) => merge(nodeEvent('blur', src), nodeEvent('pointerout', src)),
  filter((x) => document.activeElement !== x.target), // focused elements cannot be dismissed
  constant(false)
)
