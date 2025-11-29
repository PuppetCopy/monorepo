import { combine, empty, filterNull, type IStream, map, merge, o, start, switchMap } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $element, component, type INode, type INodeCompose, nodeEvent, style, styleBehavior } from 'aelea/ui'
import { designSheet } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { dismissOp, interactionOp } from './common.js'

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

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
                  start(true, disabled)
                )
              )
            : o(),

          switchMap(node =>
            start(
              node,
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
                  combine({ value, focus: start(null, focus) })
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
