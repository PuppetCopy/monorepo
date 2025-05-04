import { constant, filter, merge } from '@most/core'
import { type I$Node, nodeEvent, O } from 'aelea/core'

export const interactionOp = O(
  (src: I$Node) => merge(nodeEvent('focus', src), nodeEvent('pointerover', src)),
  constant(true)
)

export const dismissOp = O(
  (src: I$Node) => merge(nodeEvent('blur', src), nodeEvent('pointerout', src)),
  filter((x) => document.activeElement !== x.target), // focused elements cannot be dismissed
  constant(false)
)
