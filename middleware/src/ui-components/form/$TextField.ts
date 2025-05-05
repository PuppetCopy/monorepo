import { empty, map } from '@most/core'
import type { Stream } from '@most/types'
import {
  $element,
  $node,
  $text,
  attrBehavior,
  component,
  type IBehavior,
  type INodeCompose,
  O,
  style,
  stylePseudo
} from 'aelea/core'
import { $row, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { streamOf } from '../../utils/index.js'
import { $Field, type Field } from './$Field.js'

export const $defaultTextFieldContainer = $element('label')(
  spacing.small,
  style({
    width: '100%',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    color: pallete.foreground
  })
)

export const $labelDisplay = $node(
  style({
    paddingRight: '4px',
    alignSelf: 'flex-end',
    cursor: 'pointer',
    lineHeight: '42px',
    borderBottom: `2px solid ${colorAlpha(pallete.message, 0.1)}`
  })
)

const overideInputStyle = O(
  style({
    backgroundColor: pallete.background,
    color: pallete.message,
    lineHeight: '42px',
    height: '42px',
    padding: '0 8px'
  }),
  stylePseudo('::placeholder', {
    color: colorAlpha(pallete.foreground, 0.8)
  })
)

export interface ITextField extends Field {
  label: string
  hint?: string | Stream<string>
  placeholder?: string | Stream<string>

  $container?: INodeCompose<HTMLLabelElement>
  labelWidth?: number
}

export const $FieldLabeled = ({
  label,
  placeholder,
  hint,
  labelWidth,
  $container = $defaultTextFieldContainer
}: ITextField) =>
  component(([change, sampleValue]: IBehavior<string, string>) => {
    return [
      $container(
        $row(spacing.small, style({ width: '100%' }))(
          $labelDisplay(style({ width: labelWidth ? `${labelWidth}px` : '' }))($text(label)),
          O(
            attrBehavior(map((placeholder) => ({ placeholder }), streamOf(placeholder))),
            overideInputStyle
          )(
            $Field({})({
              change: sampleValue()
            })
          )
        ),
        $row(style({ fontSize: '.85rem', width: '100%', whiteSpace: 'pre-wrap', position: 'relative' }))(
          hint ? $text(hint) : empty()
        )
      ),

      { change }
    ]
  })
