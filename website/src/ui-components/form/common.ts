import { constant, filter, merge, o } from 'aelea/stream'
import { type I$Node, nodeEvent } from 'aelea/ui'

export const interactionOp = o(
  (src: I$Node) => merge(nodeEvent('focus', src), nodeEvent('pointerover', src)),
  constant(true)
)

export const dismissOp = o(
  (src: I$Node) => merge(nodeEvent('blur', src), nodeEvent('pointerout', src)),
  filter((x: any) => document.activeElement !== x.target), // focused elements cannot be dismissed
  constant(false)
)
