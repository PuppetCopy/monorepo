import { tap } from '@most/core'
import { berryPartsToSvg, type IBerryDisplayTupleMap } from '@puppet-copy/middleware/gbc'
import { $svg, attr } from 'aelea/core'

export const $berry = (displayTuple: Partial<IBerryDisplayTupleMap>) => {
  return $svg('svg')(
    attr({
      xmlns: 'http://www.w3.org/2000/svg',
      preserveAspectRatio: 'xMidYMin meet',
      fill: 'none',
      viewBox: '0 0 1500 1500'
    })
  )(
    tap((node) => {
      node.element.innerHTML = berryPartsToSvg(displayTuple)
      return node
    })
  )()
}
