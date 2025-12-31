import { constant, filter, map, merge, o, op, start } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import {
  $element,
  component,
  type I$Node,
  type I$Slottable,
  type INode,
  type INodeCompose,
  nodeEvent,
  styleBehavior
} from 'aelea/ui'
import { type Control, designSheet } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'

const interactionOp = o((src: I$Node) => merge(nodeEvent('focus', src), nodeEvent('pointerover', src)), constant(true))

const dismissOp = o(
  (src: I$Node) => merge(nodeEvent('blur', src), nodeEvent('pointerout', src)),
  filter(x => document.activeElement !== x.target), // focused elements cannot be dismissed
  constant(false)
)

export interface IButtonCore extends Control {
  $container?: INodeCompose
  $content: I$Slottable
}

export const $defaultButtonCore = $element('button')(designSheet.btn)

export const $ButtonCore = ({ $content, $container = $defaultButtonCore, disabled }: IButtonCore) =>
  component(
    (
      [focusStyle, interactionTether]: IBehavior<INode, true>,
      [dismissstyle, dismissTether]: IBehavior<INode, false>,
      [click, clickTether]: IBehavior<INode, PointerEvent>
    ) => {
      const $button = $container(
        clickTether(nodeEvent('pointerup')),
        disabled
          ? styleBehavior(
              op(
                disabled,
                start(false),
                map(isDisabled => {
                  return isDisabled ? { opacity: 0.4, pointerEvents: 'none' } : null
                })
              )
            )
          : op,

        styleBehavior(
          map(active => (active ? { borderColor: pallete.primary } : null), merge(focusStyle, dismissstyle))
        ),

        interactionTether(interactionOp),
        dismissTether(dismissOp)
      )

      return [
        $button($content),

        {
          click
        }
      ]
    }
  )
