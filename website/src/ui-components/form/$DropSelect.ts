import { type IOps, type IStream, just, map, switchLatest, toStream } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $node, $text, component, type INodeCompose, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { $icon, $infoLabel } from '../$common.js'
import { $caretDown } from '../$icons.js'
import { $Dropdown } from './$Dropdown.js'

export const $defaultDropSelectContainer = $row(
  spacing.tiny,
  style({
    alignItems: 'center',
    cursor: 'pointer',
    padding: '8px 12px',
    gap: '10px',
    borderRadius: '14px',
    border: `1px solid ${colorAlpha(pallete.foreground, 0.15)}`
  })
)

export interface IDropSelect<T> {
  value: IStream<T>
  optionList: IStream<readonly T[]> | readonly T[]
  label?: string
  placeholder?: string
  $container?: INodeCompose
  $valueLabel?: IOps<T, ReturnType<typeof $node>>
  $$option?: IOps<T, ReturnType<typeof $node>>
}

export const $DropSelect = <T>(config: IDropSelect<T>) =>
  component(([select, selectTether]: IBehavior<T>) => {
    const {
      value,
      optionList,
      label,
      placeholder = 'Select',
      $container = $defaultDropSelectContainer,
      $$option = map((val: T) => $node($text(String(val)))),
      $valueLabel = $$option
    } = config

    return [
      $Dropdown({
        optionList,
        $$option,
        $anchor: $container(
          label ? $infoLabel($text(label)) : $node(),
          $node(style({ flex: 1, whiteSpace: 'nowrap' }))(
            switchLatest(
              map(current => {
                if (current === null || current === undefined) {
                  return $node($text(placeholder))
                }
                return switchLatest($valueLabel(just(current as T)))
              }, toStream(value))
            )
          ),
          $icon({
            $content: $caretDown,
            width: '12px',
            svgOps: style({ minWidth: '12px', margin: '2px 1px 0' }),
            viewBox: '0 0 32 32'
          })
        )
      })({
        select: selectTether()
      }),
      { select }
    ]
  })
