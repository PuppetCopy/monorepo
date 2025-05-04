import { type Behavior, combineState, isEmpty, O, type Op } from "aelea/core"
import { $element, type $Node, $text, attr, component, eventElementTarget, type IBranch, type INode, type NodeComposeFn, nodeEvent, style, styleBehavior, styleInline, stylePseudo } from "aelea/dom"
import { $column, $icon, $row, type Input, spacing, observer } from "aelea/ui-components"
import { pallete } from "aelea/ui-components-theme"
import { constant, empty, filter, map, merge, mergeArray, multicast, never, now, scan, skip, skipRepeats, snapshot, startWith, switchLatest, take, tap, zip } from "@most/core"
import { append, remove } from "@most/prelude"
import type { Stream } from "@most/types"
import { $caretDown, $xCross } from "@puppet/middleware/ui-components"
import { streamOf } from "@puppet/middleware/utils"
import { $Select, type ISelect } from "./$Select.js"


export interface IMultiselect<T> extends ISelect<T> {

}



export interface IDropdown<T> {
  selector: ISelect<T>
  dropWidth?: number,
  $selection: $Node
  $container?: NodeComposeFn<$Node>
  $option?: NodeComposeFn<$Node>

  openMenuOp?: Op<MouseEvent, MouseEvent>
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
    minWidth: '80px', overflow: 'hidden',
    border: `1px solid ${pallete.horizon}`,
    borderRadius: '20px',
    backgroundColor: pallete.background,
    boxShadow: `rgb(0 0 0 / 21%) 1px 1px 14px`
  })
)


export function $Dropdown<T>({
  $container = $column(spacing.defaultTiny, style({ position: 'relative' })),
  $selection,
  $option = $defaultOptionContainer,
  selector,
  openMenuOp = O()
}: IDropdown<T>) {

  return component((
    [select, selectTether]: Behavior<T, T>,
    [openMenu, openMenuTether]: Behavior<INode, any>,
    [targetIntersection, targetIntersectionTether]: Behavior<INode, IntersectionObserverEntry[]>,
    [contentIntersection, contentIntersectionTether]: Behavior<INode, IntersectionObserverEntry[]>,
  ) => {


    const openTrigger = constant(true, mergeArray([openMenu]))
    const windowClick = switchLatest(map(open => take(1, skip(1, eventElementTarget('click', window))), openTrigger))

    const closeTrigger = constant(false, mergeArray([windowClick]))

    const isOpen = skipRepeats(merge(closeTrigger, openTrigger))

    const clickBehavior = O(
      openMenuTether(
        nodeEvent('pointerdown'),
        openMenuOp,
      ),
      targetIntersectionTether(
        observer.intersection(),
      )
    )

    return [
      $container(
        clickBehavior($selection),

        switchLatest(map(show => {
          if (!show) {
            return empty()
          }

          const dropBehavior = O(
            styleInline(
              zip(function ([targetRect], [contentRect]) {
                const { bottom, right, left } = targetRect.intersectionRect
                const { width } = contentRect.boundingClientRect

                const rootWidth = targetRect.rootBounds?.width || 0

                const bottomSpcace = window.innerHeight - bottom
                const goDown = bottomSpcace > bottom
                const placedWidth = left + width
                const leftOffset = placedWidth > rootWidth ? rootWidth - placedWidth - 20 : 0

                return {
                  [goDown ? 'top' : 'bottom']: 'calc(100% + 5px)',
                  left: leftOffset + 'px',
                  visibility: 'visible'
                }
              }, targetIntersection, contentIntersection)
            ),
          )

          const $dropContainer = (selector.$container || $defaultSelectContainer)(
            contentIntersectionTether(
              observer.intersection()
            ),
            style({
              zIndex: 60,
              visibility: "hidden",
              position: 'absolute'
            })
          )

          return dropBehavior(
            $Select({
              ...selector,
              $container: $dropContainer,
              $$option: O(selector.$$option, map($option)),
            })({
              select: selectTether()
            })
          )

        }, isOpen))
      ),

      {
        select
      }
    ]
  })
}


export const $defaultDropMultiSelectContainer = $row(spacing.defaultTiny, style({ borderBottom: `1px solid ${pallete.message}` }))
export const $defaultDropMultiSelectOption = $row(spacing.small,
  style({
    overflow: 'hidden', border: `1px solid ${pallete.message}`,
    alignItems: 'center', padding: '4px 8px', width: '100%'
  }),
  stylePseudo(':hover', { backgroundColor: pallete.horizon })
)
export const $defaultChip = $row(style({ backgroundColor: pallete.primary, paddingLeft: '4px', cursor: 'default', alignItems: 'center', borderRadius: '22px' }))



export interface IMultiselectDrop<T> extends Input<T[]> {
  placeholder?: string
  closeOnSelect?: boolean
  getId?: (item: T) => string | number

  selector: Omit<IMultiselect<T>, 'value'>

  $label?: $Node

  $container?: NodeComposeFn<$Node>
  $fieldcontainer?: NodeComposeFn<$Node>
  $dropdownContainer?: NodeComposeFn<$Node>

  $chip?: NodeComposeFn<$Node>
  $input?: NodeComposeFn<$Node<HTMLInputElement>>
  $$chip: Op<T, $Node>
  openMenu?: Stream<any>
}

export const $DropMultiSelect = <T>({
  $container = $column(spacing.defaultTiny, style({ display: 'flex', position: 'relative' })),
  $fieldcontainer = $defaultDropMultiSelectContainer,
  $$chip,
  $label = empty(),
  $chip = $defaultChip,
  selector,
  placeholder,
  validation = never,
  value,
  closeOnSelect = true,
  openMenu = empty(),
  $input = $element('input'),
  getId,
}: IMultiselectDrop<T>
) => component((
  [pick, pickTether]: Behavior<T, T>,
  [targetIntersection, targetIntersectionTether]: Behavior<INode, IntersectionObserverEntry[]>,

  [interaction, interactionTether]: Behavior<IBranch, true>,
  [blur, blurTether]: Behavior<IBranch, false>,

  [focusField, focusFieldTether]: Behavior<IBranch, FocusEvent>,
  [inputSearch, inputSearchTether]: Behavior<IBranch<HTMLInputElement>, string>,
  [clickOptionRemove, clickOptionRemoveTether]: Behavior<INode, T>,
) => {


  const openTrigger = mergeArray([focusField, constant(true, openMenu)])
  const closeTrigger = constant(false, mergeArray([
    // delay(100, blur),
    closeOnSelect ? pick : empty()
  ]))
  const isOpen = mergeArray([openTrigger, closeTrigger])
  const focus = startWith(false, merge(interaction, blur))


  const select = switchLatest(
    map(initSeedList => {
      return skip(1, scan((seed, next) => {
        const matchedIndex = getId ? seed.findIndex(item => getId(item) === getId(next)) : seed.indexOf(next)

        if (matchedIndex === -1) {
          return append(next, seed)
        }

        return remove(matchedIndex, seed)
      }, initSeedList, mergeArray([pick, clickOptionRemove])))
    }, value)
  )

  const selectionChange = merge(select, value)
  const alert = validation(selectionChange)
  const state = combineState({ focus, alert })


  return [
    $container(

      $row(layoutSheet.flex, spacing.defaultTiny, style({ display: 'flex', flexDirection: 'row', position: 'relative' }))(
        isEmpty($label)
          ? empty()
          : $row(style({ alignSelf: 'flex-end', cursor: 'pointer' }))(
            $label
          ),

        $fieldcontainer(
          styleBehavior(
            map(({ focus, alert }) => {
              if (alert) {
                return { borderColor: pallete.negative }
              }

              return focus ? { borderColor: pallete.foreground } : null
            }, state)
          ),
          targetIntersectionTether(
            observer.intersection(),
            multicast
          ),
          layoutSheet.flex, spacing.small, style({ alignItems: 'center', position: 'relative', flexWrap: 'wrap' })
        )(
          switchLatest(map(valueList => {
            return mergeArray(valueList.map(token => {

              return $chip(
                switchLatest($$chip(now(token))),
                $icon({
                  $content: $xCross, width: '28px',
                  svgOps: O(
                    style({ padding: '4px', cursor: 'pointer' }),
                    clickOptionRemoveTether(nodeEvent('click'), tap(x => x.preventDefault()), constant(token))
                  ),
                  viewBox: '0 0 32 32'
                })
              )
            }))
          }, selectionChange)),

          $row(style({ alignItems: 'center', flex: '1', alignSelf: 'stretch' }))(
            $input(
              attr({ placeholder: placeholder || '', autocomplete: 'off', 'data-lpignore': 'true' }),

              interactionTether(interactionOp),
              blurTether(dismissOp),

              style({
                width: '100px',
                border: 'none',
                fontSize: '1em',
                alignSelf: 'stretch',
                outline: 'none',
                minHeight: '36px',
                flex: '1 0 70px',
                color: pallete.message,
                background: 'transparent',
              }),

              inputSearchTether(
                nodeEvent('input'),
                map(inputEv => {
                  if (inputEv.target instanceof HTMLInputElement) {
                    const text = inputEv.target.value
                    return text || ''
                  }
                  return ''
                })
              ),

              focusFieldTether(
                nodeEvent('pointerdown')
              ),

            )(),
            $icon({ $content: $caretDown, width: '12px', svgOps: style({ minWidth: '12px', margin: '2px 1px 0' }), viewBox: '0 0 32 32' }),
          ),

        ),

        switchLatest(snapshot((params, show) => {
          if (!show) {
            return empty()
          }

          const $floatingContainer = (selector.$container || $defaultSelectContainer)(
            style({
              padding: '8px', zIndex: 50,
              position: 'absolute', visibility: 'hidden'
            })
          )

          const optionSelection = params.list.filter(n => {
            const id = getId ? getId(n) : n
            return params.selectionChange.findIndex(item => getId ? getId(item) === id : item === id) === -1
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
                    borderTopLeftRadius: 0, borderTopRightRadius: 0,
                    display: 'flex', visibility: 'visible'
                  } : {
                    bottom: 'calc(100% + -1px)', visibility: 'visible',
                    borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
                    display: 'flex'
                  }
              }, targetIntersection),

            ),
          )

          return dropBehavior(
            $Select({
              ...selector,
              $container: $floatingContainer,
              list: optionSelection,
              value: empty(),
            })({
              select: pickTether()
            })
          )
        }, combineState({ list: streamOf(selector.list), selectionChange }), isOpen)),
      ),


      switchLatest(map(msg => {
        if (!msg) {
          return empty()
        }

        return $text(style({ color: pallete.negative, fontSize: '.85rem', minHeight: '17px' }))(msg)
      }, alert))

    ),

    {
      select, alert
    }
  ]
})


export const interactionOp = O(
  (src: $Node) => merge(nodeEvent('focus', src), nodeEvent('pointerover', src)),
  constant(true)
)

export const dismissOp = O(
  (src: $Node) => merge(nodeEvent('blur', src), nodeEvent('pointerout', src)),
  filter(x => document.activeElement !== x.target,), // focused elements cannot be dismissed
  constant(false)
)

