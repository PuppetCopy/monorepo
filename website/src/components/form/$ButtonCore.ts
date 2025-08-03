import {    constant, filter, map, merge, startWith , type IBehavior , o , behavior } from 'aelea/stream'
import { $element, component, type I$Node, type I$Slottable, type INode, type INodeCompose, nodeEvent, styleBehavior } from 'aelea/core'
import { type Control, designSheet } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'

const interactionOp = o((src: I$Node) => merge(nodeEvent('focus', src), nodeEvent('pointerover', src)), constant(true))

const dismissOp = o(
  (src: I$Node) => merge(nodeEvent('blur', src), nodeEvent('pointerout', src)),
  filter((x) => document.activeElement !== x.target), // focused elements cannot be dismissed
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
              map(
                (isDisabled) => {
                  return isDisabled ? { opacity: 0.4, pointerEvents: 'none' } : null
                },
                startWith(true, disabled)
              )
            )
          : (o() as any),

        styleBehavior(
          map((active) => (active ? { borderColor: pallete.primary } : null), merge(focusStyle, dismissstyle))
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
