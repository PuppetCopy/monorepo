import { $Node, $svg, $wrapNativeElement, attr } from "aelea/dom"
import { IBerryDisplayTupleMap, berryPartsToSvg } from "@puppet/middleware/gbc"
import { tap } from "@most/core"



export function $svgContent(content: string): $Node[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<g>${content}</g>`, "image/svg+xml")
  const childNodes = doc.firstChild?.childNodes

  if (!childNodes) {
    return []
  }

  const firstNode = Array.from(childNodes)
  return firstNode.map(node => $wrapNativeElement(node as any)())
}


export const $berry = (
  displayTuple: Partial<IBerryDisplayTupleMap>,
) => {

  return $svg('svg')(
    attr({ xmlns: 'http://www.w3.org/2000/svg', preserveAspectRatio: "xMidYMin meet", fill: 'none', viewBox: `0 0 1500 1500` })
  )(
    tap((node) => {
      node.element.innerHTML = berryPartsToSvg(displayTuple)
      return node
    })
  )()
}


