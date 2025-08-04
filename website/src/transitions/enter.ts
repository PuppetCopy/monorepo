import { type I$Node, motion, styleInline } from 'aelea/core'
import { combineMap, fromArray } from 'aelea/stream'

export function fadeIn($content: I$Node) {
  const fadeIn = motion({ stiffness: 170, damping: 26, precision: 1 }, fromArray([0, 100]))
  const slideIn = motion({ stiffness: 190, damping: 48, precision: 1 }, fromArray([25, 0]))

  const animation = styleInline(
    combineMap(
      (opacity, slide) => {
        return {
          opacity: opacity === 100 ? '' : `${opacity}%`,
          transform: slide === 0 ? '' : `translate(0, ${slide}px)`
        }
      },
      fadeIn,
      slideIn
    )
  )

  return animation($content)
}
