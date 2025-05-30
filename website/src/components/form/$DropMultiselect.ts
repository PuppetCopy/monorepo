import { constant, map, mergeArray, never, now, snapshot, switchLatest, tap } from '@most/core'
import { append, remove } from '@most/prelude'
import type { Stream } from '@most/types'
import { $caretDown, $infoLabel, $xCross } from '@puppet-copy/middleware/ui-components'
import {
  $text,
  component,
  type I$Node,
  type IBehavior,
  type INode,
  type INodeCompose,
  type IOps,
  nodeEvent,
  O,
  style,
  stylePseudo,
  switchMap
} from 'aelea/core'
import { $icon, $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { $Dropdown, $defaulMultiselectDropContainer } from './$Dropdown'

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
export const $defaultOptionContainer = $row(
  style({
    backgroundColor: pallete.primary,
    paddingLeft: '4px',
    cursor: 'default',
    alignItems: 'center',
    borderRadius: '22px'
  })
)

export interface IMultiselectDrop<T> {
  value: Stream<T[]>
  optionList: Stream<T[]> | T[]

  getId?: (item: T) => string | number
  $noneSelected?: I$Node
  $$selectedOption?: IOps<T, I$Node>
  $$option?: IOps<T, I$Node>
  $container?: INodeCompose
  $dropListContainer?: INodeCompose
  $optionContainer?: INodeCompose

  validation?: IOps<T, string | null>
}

export const $defaultNoneSelected = $infoLabel(
  style({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '12px 0 12px 18px'
  })
)
export const $DropMultiSelect = <T>({
  value, //
  optionList,

  getId,
  $noneSelected = $defaultNoneSelected($text('None selected')),
  $$selectedOption = map((item) => $defaultDropMultiSelectOption($text(String(item)))),
  $$option = map((item) => $defaultDropMultiSelectOption($text(String(item)))),
  $container = $defaulMultiselectDropContainer,
  $dropListContainer,
  $optionContainer = $defaultOptionContainer,
  validation = never
}: IMultiselectDrop<T>) =>
  component(([select, selectTether]: IBehavior<T>, [pluck, pluckTether]: IBehavior<INode, T>) => {
    return [
      $Dropdown({
        $anchor: $row(style({ display: 'flex', flexDirection: 'row', position: 'relative' }))(
          switchMap((valueList) => {
            if (!valueList.length) {
              return $noneSelected
            }

            return $row(
              spacing.tiny,
              style({ alignItems: 'center', paddingLeft: '6px' })
            )(
              ...valueList.map((token) => {
                return $optionContainer(
                  switchLatest($$selectedOption(now(token))),
                  $icon({
                    $content: $xCross,
                    width: '28px',
                    svgOps: O(
                      style({ padding: '4px', cursor: 'pointer' }),
                      pluckTether(
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
          }, value),

          $row(style({ alignItems: 'center', cursor: 'pointer', padding: '12px 18px', flex: '1' }))(
            $icon({
              $content: $caretDown,
              width: '12px',
              svgOps: style({ minWidth: '12px', margin: '2px 1px 0' }),
              viewBox: '0 0 32 32'
            })
          )
        ),
        optionList,
        $$option,
        $container
      })({
        select: selectTether()
      }),
      {
        select: mergeArray([
          snapshot(
            (seed, next) => {
              const matchedIndex = getId ? seed.findIndex((item) => getId(item) === getId(next)) : seed.indexOf(next)

              if (matchedIndex === -1) {
                return append(next, seed)
              }

              return remove(matchedIndex, seed)
            },
            value,
            select
          ),
          snapshot(
            (seed, next) => {
              const matchedIndex = getId ? seed.findIndex((item) => getId(item) === getId(next)) : seed.indexOf(next)

              if (matchedIndex !== -1) {
                return remove(matchedIndex, seed)
              }

              return seed
            },
            value,
            pluck
          )
        ])
        // alert
      }
    ]
  })
