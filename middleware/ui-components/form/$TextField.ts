import { Behavior, O } from "@aelea/core"
import { $element, $text, NodeComposeFn, attr, attrBehavior, component, style, stylePseudo } from "@aelea/dom"
import { $row, layoutSheet } from "@aelea/ui-components"
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import { empty, map } from "@most/core"
import { Stream } from "@most/types"
import { $Field, Field } from "./$Field.js"
import { streamOf } from "../utils/index.js"



export const $defaultTextFieldContainer = $element('label')(
  layoutSheet.spacingSmall,
  style({
    width: '100%',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    color: pallete.foreground
  })
)


export const $labelDisplay = $text(style({ paddingRight: '4px', alignSelf: 'flex-end', cursor: 'pointer', lineHeight: '42px', borderBottom: `2px solid ${colorAlpha(pallete.message, .1)}` }))


const overideInputStyle = O(
  style({
    backgroundColor: pallete.background,
    color: pallete.message,
    lineHeight: '42px',
    height: '42px',
    padding: '0 8px',
  }),
  stylePseudo('::placeholder', {
    color: colorAlpha(pallete.foreground, .8),
  })
)


export interface ITextField extends Field {
  label: string
  hint?: string | Stream<string>
  placeholder?: string | Stream<string>

  $container?: NodeComposeFn<any, HTMLLabelElement>
  labelWidth?: number
}

export const $FieldLabeled = (config: ITextField) => component((
  [change, sampleValue]: Behavior<string, string>
) => {

  const {
    label, placeholder, hint, labelWidth,
    $container = $defaultTextFieldContainer
  } = config

  const $field = overideInputStyle(
    $Field(config)({
      change: sampleValue()
    })
  )

  return [
    $container(
      $row(layoutSheet.spacingSmall, style({ width: '100%' }))(
        $labelDisplay(style({ width: labelWidth ? labelWidth + 'px' : '' }))(label),
        attrBehavior(map(placeholder => ({ placeholder }), streamOf(placeholder)), $field)
      ),
      $row(style({ position: 'relative' }))(
        hint ? $text(style({ fontSize: '.85rem', width: '100%', whiteSpace: 'pre-wrap' }))(hint) : empty()
      )
    ),

    { change }
  ]
})