import { $element, component, type INode, type INodeCompose, nodeEvent, style, styleBehavior } from 'aelea/core'
import {
  combine,
  empty,
  filterNull,
  type IBehavior,
  type IStream,
  map,
  merge,
  now,
  o,
  startWith,
  switchMap
} from 'aelea/stream'
import { designSheet } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
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
  disabled?: IStream<boolean>
}
export interface Input<T> extends Control {
  value: IStream<T>
  validation?: IStream<string | null>
}

export interface Field extends Optional<Input<string>, 'value'> {
  $input?: INodeCompose<HTMLInputElement>
}

export const $Field = ({ value = empty, disabled, validation = empty, $input = $element('input') }: Field) =>
  component(
    (
      [focusStyle, interactionTether]: IBehavior<INode, true>,
      [dismissstyle, dismissTether]: IBehavior<INode, false>,
      [blur, blurTether]: IBehavior<INode, FocusEvent>,
      [change, changeTether]: IBehavior<INode<HTMLInputElement>, string>
    ) => {
      const focus = merge(focusStyle, dismissstyle)
      const state = combine({ focus, validation })

      return [
        $input(
          designSheet.input,

          changeTether(
            nodeEvent('input'),
            map(inputEv => {
              if (inputEv.target instanceof HTMLInputElement) {
                const text = inputEv.target.value
                return text || ''
              }
              return ''
            })
          ),

          styleBehavior(
            map(params => {
              const hasValue = params.value
              const opacity = hasValue ? '' : '.5'

              if (params.validation) {
                return { opacity, borderBottom: `2px solid ${pallete.negative}` }
              }

              if (params.focus) {
                return { opacity, borderBottom: `2px solid ${pallete.primary}` }
              }

              return { opacity }
            }, combine({ value, focus, validation }))
          ),

          interactionTether(interactionOp),
          dismissTether(dismissOp),
          blurTether(nodeEvent('blur')),

          disabled
            ? styleBehavior(
                map(
                  isDisabled => {
                    return isDisabled ? { opacity: 0.4, pointerEvents: 'none' } : null
                  },
                  startWith(true, disabled)
                )
              )
            : o(),

          switchMap(node =>
            merge(
              now(node),
              filterNull(
                map(
                  params => {
                    if (params.focus) {
                      return null
                    }

                    // applying by setting `HTMLInputElement.value` imperatively(only way known to me)
                    node.element.value = String(params.value)

                    return null
                  },
                  combine({ value, focus: startWith(null, focus) })
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
