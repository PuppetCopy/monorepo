import { map } from 'aelea/stream'
import { $wrapNativeElement, style } from 'aelea/ui'
import { buildJazziconShapes } from '../common/jazzicon.js'

function createJazziconElement(address: string): HTMLElement {
  const wrapper = document.createElement('div')
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('viewBox', '0 0 100 100')
  svg.innerHTML = buildJazziconShapes(address)
  wrapper.appendChild(svg)
  return wrapper
}

export function $jazzicon(address: string, size = '24px') {
  const el: HTMLElement = createJazziconElement(address)

  return $wrapNativeElement(el)(
    map(node => {
      const el: HTMLElement = node.element
      const svg = el.querySelector('svg')
      if (svg) {
        svg.setAttribute('width', size)
        svg.setAttribute('height', size)

        el.style.borderRadius = '50%'
      }
      return node
    }),
    style({ width: size, minWidth: size, height: size, display: 'flex', position: 'relative' })
  )()
}
