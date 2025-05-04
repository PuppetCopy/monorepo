import { empty, filter, map, merge, mergeArray, multicast, never, now, startWith, switchLatest, tap } from '@most/core'
import {
  $element,
  combineState,
  component,
  type IBehavior,
  type INode,
  type INodeCompose,
  nodeEvent,
  O,
  style,
  styleBehavior
} from 'aelea/core'
import { designSheet, type Input } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { dismissOp, interactionOp } from './common.js'

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export interface Field extends Optional<Input<string>, 'value'> {
  $input?: INodeCompose<HTMLInputElement>
}

export const $Field = ({ value = empty(), disabled, validation = never, $input = $element('input') }: Field) =>
  component(
    (
      [focusStyle, interactionTether]: IBehavior<INode, true>,
      [dismissstyle, dismissTether]: IBehavior<INode, false>,
      [blur, blurTether]: IBehavior<INode, FocusEvent>,
      [change, changeTether]: IBehavior<INode<HTMLInputElement>, string>
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
            })
          ),

          styleBehavior(
            mergeArray([
              startWith(
                { opacity: '.5' },
                map(() => ({ opacity: '' }), value)
              ),
              map(({ focus, alert }) => {
                if (alert) {
                  return { borderBottom: `2px solid ${pallete.negative}` }
                }

                return focus ? { borderBottom: `2px solid ${pallete.primary}` } : null
              }, state)
            ])
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
                  startWith(true, disabled)
                )
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
                  }, value)
                )
              )
            ),
            switchLatest
          )
        )(),

        {
          change,
          blur
        }
      ]
    }
  )

export const $form = $element('form')(style({ display: 'flex', flexDirection: 'column' }))
