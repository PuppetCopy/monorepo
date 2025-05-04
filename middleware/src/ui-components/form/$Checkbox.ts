import { empty, map, mergeArray, startWith } from '@most/core'
import type { Stream } from '@most/types'
import {
  $element,
  $node,
  $text,
  attr,
  attrBehavior,
  component,
  type IBehavior,
  type IBranch,
  nodeEvent,
  O,
  style,
  styleBehavior
} from 'aelea/core'
import { type Input, layoutSheet } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { $label } from '../$common.js'
import { dismissOp, interactionOp } from './common.js'

export interface Checkbox extends Input<boolean> {
  label?: string | Stream<string>
}

export const $Checkbox = ({ value, disabled, label }: Checkbox) =>
  component(
    (
      [focusStyle, interactionTether]: IBehavior<IBranch, true>,
      [dismissstyle, dismissTether]: IBehavior<IBranch, false>,
      [check, checkTether]: IBehavior<IBranch<HTMLInputElement>, boolean>
    ) => {
      const $overlay = $node(
        layoutSheet.stretch,
        style({ flex: 1, margin: '3px' }),
        styleBehavior(map((ch) => (ch ? { backgroundColor: pallete.message } : null), value))
      )

      const $checkInput = $element('input')(
        style({ opacity: 0, width: 'inherit', height: 'inherit', margin: '0', cursor: 'pointer' }),
        layoutSheet.stretch,
        checkTether(
          nodeEvent('change'),
          map((evt) => (<HTMLInputElement>evt.target).checked)
        ),
        attr({ type: 'checkbox' }),
        attrBehavior(map((checked) => ({ checked: checked ? true : null }), value)),
        interactionTether(interactionOp),
        dismissTether(dismissOp)
      )

      return [
        $label(
          disabled
            ? styleBehavior(
                map(
                  (isDisabled) => {
                    return isDisabled ? { opacity: 0.4, pointerEvents: 'none' } : null
                  },
                  startWith(true, disabled)
                )
              )
            : O()
        )(
          $node(
            styleBehavior(
              map(
                (active) => (active ? { borderColor: pallete.primary } : null),
                mergeArray([focusStyle, dismissstyle])
              )
            ),
            style({ position: 'relative', width: '18px', height: '18px', border: `2px solid ${pallete.message}` })
          )($overlay(), $checkInput()),

          label ? $text(label) : empty()
        ),
        { check }
      ]
    }
  )
