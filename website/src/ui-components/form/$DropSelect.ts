import { type IOps, type IStream, isStream, just, map, switchLatest, switchMap, toStream } from 'aelea/stream'
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
    placeContent: 'space-between',
    padding: '8px 12px',
    gap: '10px',
    borderRadius: '14px',
    border: `1px solid ${colorAlpha(pallete.foreground, 0.15)}`
  })
)

export interface IDropSelect<T> {
  value: IStream<T>
  optionList: IStream<readonly T[]> | readonly T[]
  label?: string | IStream<string>
  $container?: INodeCompose
  $valueLabel?: IOps<T, ReturnType<typeof $node>>
  $$option?: IOps<T, ReturnType<typeof $node>>
}

export const $DropSelect = <T>({
  value,
  optionList,
  label,
  $container = $defaultDropSelectContainer,
  $$option = map((val: T) => $node($text(String(val)))),
  $valueLabel = $$option
}: IDropSelect<T>) =>
  component(([select, selectTether]: IBehavior<T>) => {
    const labelStream = label ? (isStream(label) ? label : just(label)) : null

    return [
      $Dropdown({
        optionList,
        $$option,
        $anchor: $container(
          labelStream ? switchLatest(map(text => $infoLabel($text(text)), labelStream)) : $node(),
          $row(spacing.small)(
            switchLatest($valueLabel(toStream(value))),
            $icon({
              $content: $caretDown,
              width: '12px',
              fill: pallete.foreground,
              svgOps: style({ minWidth: '12px' }),
              viewBox: '0 0 32 32'
            })
          )
        )
      })({
        select: selectTether()
      }),
      { select }
    ]
  })
