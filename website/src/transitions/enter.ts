import { type I$Slottable, motion, styleInline } from 'aelea/core'
import { combineMap, fromArray } from 'aelea/stream'

export function fadeIn($content: I$Slottable) {
  const fadeIn = motion({ stiffness: 70, damping: 26, precision: 3 }, fromArray([0, 100]))
  const slideIn = motion({ stiffness: 370, damping: 46, precision: 3 }, fromArray([20, 0]))

  const animation = combineMap(
    (state, slide) => ({
      opacity: `${state}%`,
      transform: `translate(0, ${slide}px)`
    }),
    fadeIn,
    slideIn
  )

  return styleInline(animation, $content)
}
