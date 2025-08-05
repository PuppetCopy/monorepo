import { $element, $node, $text, attrBehavior, component, type INodeCompose, style, stylePseudo } from 'aelea/core'
import { combine, empty, type IBehavior, type IStream, map, o, startWith, switchMap, toStream } from 'aelea/stream'
import { $row, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
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

const overideInputStyle = o(
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
  hint?: string | IStream<string>
  placeholder?: string | IStream<string>

  $container?: INodeCompose<HTMLLabelElement>
  labelWidth?: number
}

export const $FieldLabeled = ({
  label,
  placeholder,
  hint,
  labelWidth,
  value,
  $input,
  validation = empty,
  $container = $defaultTextFieldContainer
}: ITextField) =>
  component(([change, sampleValue]: IBehavior<string, string>) => {
    const $message = switchMap(
      params => {
        if (params.validation) {
          return $node(style({ color: pallete.negative }))($text(params.validation))
        }

        return params.hint ? $node($text(params.hint)) : empty
      },
      combine({ validation: startWith(null, validation), hint: toStream(hint) })
    )

    return [
      $container(
        $row(spacing.small, style({ width: '100%' }))(
          $labelDisplay(style({ width: labelWidth ? `${labelWidth}px` : '' }))($text(label)),
          o(
            attrBehavior(map(placeholder => ({ placeholder }), toStream(placeholder))),
            overideInputStyle
          )(
            $Field({
              $input,
              value,
              validation
            })({
              change: sampleValue()
            })
          )
        ),
        $row(
          style({ fontSize: '.8rem', minHeight: '1rem', width: '100%', whiteSpace: 'pre-wrap', position: 'relative' })
        )($message)
      ),

      { change }
    ]
  })
