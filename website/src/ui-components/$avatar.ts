import { map } from 'aelea/stream'
import { $wrapNativeElement, style } from 'aelea/ui'
import { createJazziconSvg } from '../common/$avatar.js'

export function $jazzicon(address: string, size = '24px') {
  const wrapper = document.createElement('div')
  wrapper.appendChild(createJazziconSvg(address))

  return $wrapNativeElement(wrapper)(
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
