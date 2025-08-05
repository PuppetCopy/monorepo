import { type I$Node, motion, styleInline } from 'aelea/core'
import { combine, combineMap, fromArray } from 'aelea/stream'

export function fadeIn($content: I$Node) {
  const fadeIn = motion({ stiffness: 170, damping: 26, precision: 1 }, fromArray([0, 100]))
  const slideIn = motion({ stiffness: 190, damping: 48, precision: 1 }, fromArray([25, 0]))

  const animation = styleInline(
    combineMap(params => {
      return {
        opacity: params.fadeIn === 100 ? '' : `${params.fadeIn}%`,
        transform: params.slideIn === 0 ? '' : `translate(0, ${params.slideIn}px)`
      }
    }, combine({ fadeIn, slideIn }))
  )

  return animation($content)
}
