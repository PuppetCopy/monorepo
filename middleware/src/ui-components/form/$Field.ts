import { empty, map, merge, mergeArray, now, startWith } from '@most/core'
import type { Stream } from '@most/types'
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
  styleBehavior,
  switchMap
} from 'aelea/core'
import { designSheet } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { filterNull } from '../../core/stream/stream.js'
import { dismissOp, interactionOp } from './common.js'

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export declare enum InputType {
  TEXT = 'text',
  NUMBER = 'number',
  SEARCH = 'search',
  PASSWORD = 'password',
  BUTTON = 'button',
  CHECKBOX = 'checkbox',
  COLOR = 'color',
  DATE = 'date',
  TEL = 'tel',
  URL = 'url',
  HIDDEN = 'hidden'
}
export interface Control {
  disabled?: Stream<boolean>
}
export interface Input<T> extends Control {
  value: Stream<T>
  validation?: Stream<string | null>
}

export interface Field extends Optional<Input<string>, 'value'> {
  $input?: INodeCompose<HTMLInputElement>
}

export const $Field = ({ value = empty(), disabled, validation = empty(), $input = $element('input') }: Field) =>
  component(
    (
      [focusStyle, interactionTether]: IBehavior<INode, true>,
      [dismissstyle, dismissTether]: IBehavior<INode, false>,
      [blur, blurTether]: IBehavior<INode, FocusEvent>,
      [change, changeTether]: IBehavior<INode<HTMLInputElement>, string>
    ) => {
      const focus = merge(focusStyle, dismissstyle)
      const state = combineState({ focus, validation })

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
              map((params) => {
                if (params.validation) {
                  return { borderBottom: `2px solid ${pallete.negative}` }
                }

                return params.focus ? { borderBottom: `2px solid ${pallete.primary}` } : null
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

          switchMap((node) =>
            merge(
              now(node),
              filterNull(
                map(
                  (params) => {
                    if (params.focus) {
                      return null
                    }

                    // applying by setting `HTMLInputElement.value` imperatively(only way known to me)
                    node.element.value = String(params.value)

                    return null
                  },
                  combineState({ value, focus: startWith(null, focus) })
                )
              )
            )
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
