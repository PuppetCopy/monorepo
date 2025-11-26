import { tap } from 'aelea/stream'
import { $svg, attr } from 'aelea/ui'
import type { Address } from 'viem/accounts'
import { buildJazziconShapes } from './jazzicon.js'

export function $jazzicon(address: Address) {
  return $svg('svg')(attr({ xmlns: 'http://www.w3.org/2000/svg', x: 0, y: 0, viewBox: '0 0 100 100' }))(
    tap(node => {
      node.element.innerHTML = buildJazziconShapes(address)
      return node
    })
  )()
  // return $element('img')(attr({ src: buildDataUrl(address) }))()
}
