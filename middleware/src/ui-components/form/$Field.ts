import { type Behavior, O, combineState } from 'aelea/core'
import { $element, type IBranch, type NodeComposeFn, component, nodeEvent, style, styleBehavior } from 'aelea/dom'
import { type Input, designSheet } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { empty, filter, map, merge, mergeArray, multicast, never, now, startWith, switchLatest, tap } from '@most/core'
import { dismissOp, interactionOp } from './common.js'
import type { Optional } from '../../utils/index.js'

export interface Field extends Optional<Input<string>, 'value'> {
  $input?: NodeComposeFn<any, HTMLInputElement>
}




export const $Field = ({ value = empty(), disabled, validation = never, $input = $element('input') }: Field) =>
  component(
    (
      [focusStyle, interactionTether]: Behavior<IBranch, true>,
      [dismissstyle, dismissTether]: Behavior<IBranch, false>,
      [blur, blurTether]: Behavior<IBranch, FocusEvent>,
      [change, changeTether]: Behavior<IBranch<HTMLInputElement>, string>,
    ) => {
      const multicastValidation = O(validation, startWith(''), multicast)

      const alert = multicastValidation(change)

      const focus = merge(focusStyle, dismissstyle)
      const state = combineState({ focus, alert })

      return [
        $input(
          designSheet.input,

          changeTether(
            nodeEvent('input'),
            map((inputEv) => {
              if (inputEv.target instanceof HTMLInputElement) {
                const text = inputEv.target.value
                return text || ''
              }
              return ''
            }),
          ),

          styleBehavior(
            mergeArray([
              startWith(
                { opacity: '.5' },
                map(() => ({ opacity: '' }), value),
              ),
              map(({ focus, alert }) => {
                if (alert) {
                  return { borderBottom: `2px solid ${pallete.negative}` }
                }

                return focus ? { borderBottom: `2px solid ${pallete.primary}` } : null
              }, state),
            ]),
          ),

          interactionTether(interactionOp),
          dismissTether(dismissOp),
          blurTether(nodeEvent('blur')),

          disabled
            ? styleBehavior(
                map(
                  (isDisabled) => {
                    return isDisabled ? { opacity: 0.4, pointerEvents: 'none' } : null
                  },
                  startWith(true, disabled),
                ),
              )
            : O(),

          O(
            map((node) =>
              merge(
                now(node),
                filter(
                  () => false,
                  tap((val) => {
                    // applying by setting `HTMLInputElement.value` imperatively(only way known to me)
                    node.element.value = String(val)
                  }, value),
                ),
              ),
            ),
            switchLatest,
          ),
        )(),

        {
          change,
          blur,
        },
      ]
    },
  )

export const $form = $element('form')(style({ display: 'flex', flexDirection: 'column' }))
