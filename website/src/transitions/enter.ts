import { combine, now } from '@most/core'
import { type I$Node, motion, styleInline } from 'aelea/core'

export function fadeIn($content: I$Node) {
  const fadeIn = motion({ stiffness: 170, damping: 26, precision: 1 }, 0, now(100))
  const slideIn = motion({ stiffness: 190, damping: 48, precision: 1 }, 25, now(0))

  const animation = styleInline(
    combine(
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
