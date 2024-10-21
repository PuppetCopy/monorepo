import { Behavior, O } from '@aelea/core'
import { $Node, $element, IBranch, INode, NodeComposeFn, component, nodeEvent, styleBehavior } from '@aelea/dom'
import { Control, designSheet } from "@aelea/ui-components"
import { pallete } from '@aelea/ui-components-theme'
import { constant, filter, map, merge, mergeArray, startWith } from "@most/core"


export const interactionOp = O(
  (src: $Node) => merge(nodeEvent('focus', src), nodeEvent('pointerover', src)),
  constant(true)
)

export const dismissOp = O(
  (src: $Node) => merge(nodeEvent('blur', src), nodeEvent('pointerout', src)),
  filter(x => document.activeElement !== x.target,), // focused elements cannot be dismissed
  constant(false)
)

export interface IButtonCore extends Control {
  $container?: NodeComposeFn<$Node>,
  $content: $Node
}

export const $defaultButtonCore = $element('button')(designSheet.btn)

export const $ButtonCore = ({ $content, $container = $defaultButtonCore, disabled }: IButtonCore) => component((
  [focusStyle, interactionTether]: Behavior<IBranch, true>,
  [dismissstyle, dismissTether]: Behavior<IBranch, false>,
  [click, clickTether]: Behavior<INode, PointerEvent>
) => {


  const $button = $container(
    clickTether(
      nodeEvent('pointerup')
    ),
    disabled
      ? styleBehavior(
        map(isDisabled => {
          return isDisabled ? { opacity: .4, pointerEvents: 'none' } : null
        }, startWith(true, disabled))
      ) : O() as any,


    styleBehavior(
      map(
        active => active ? { borderColor: pallete.primary } : null,
        mergeArray([focusStyle, dismissstyle])
      )
    ),

    interactionTether(interactionOp),
    dismissTether(dismissOp),
  )

  return [
    $button($content),

    {
      click
    }
  ]
})
