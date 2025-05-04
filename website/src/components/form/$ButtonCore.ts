import { constant, filter, map, merge, mergeArray, startWith } from '@most/core'
import {
  $element,
  component,
  type I$Node,
  type IBehavior,
  type IBranch,
  type INode,
  type NodeComposeFn,
  nodeEvent,
  O,
  styleBehavior
} from 'aelea/core'
import { type Control, designSheet } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'

export const interactionOp = O(
  (src: I$Node) => merge(nodeEvent('focus', src), nodeEvent('pointerover', src)),
  constant(true)
)

export const dismissOp = O(
  (src: I$Node) => merge(nodeEvent('blur', src), nodeEvent('pointerout', src)),
  filter((x) => document.activeElement !== x.target), // focused elements cannot be dismissed
  constant(false)
)

export interface IButtonCore extends Control {
  $container?: NodeComposeFn<$Node>
  $content: I$Node
}

export const $defaultButtonCore = $element('button')(designSheet.btn)

export const $ButtonCore = ({ $content, $container = $defaultButtonCore, disabled }: IButtonCore) =>
  component(
    (
      [focusStyle, interactionTether]: Behavior<IBranch, true>,
      [dismissstyle, dismissTether]: Behavior<IBranch, false>,
      [click, clickTether]: Behavior<INode, PointerEvent>
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
          : (O() as any),

        styleBehavior(
          map((active) => (active ? { borderColor: pallete.primary } : null), mergeArray([focusStyle, dismissstyle]))
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
