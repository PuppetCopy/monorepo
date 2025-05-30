import { constant, map, merge, startWith } from '@most/core'
import type { IBehavior } from 'aelea/core'
import { attr, component, type I$Node, type INode, type IOps, nodeEvent, O, style } from 'aelea/core'
import type { Route } from './types.js'

export interface IAnchor {
  url: string
  route: Route
  $anchor: I$Node
  anchorOp?: IOps<INode<HTMLAnchorElement>, INode<HTMLAnchorElement>>
}

export const $RouterAnchor = ({ url, route, $anchor, anchorOp = O() }: IAnchor) =>
  component(([click, clickTether]: IBehavior<INode, string>, [focus, focusTether]: IBehavior<INode, boolean>) => {
    const trailingSlash = /\/$/
    const href = url.replace(trailingSlash, '')

    const contains = merge(constant(true, route.contains), constant(false, route.miss))

    const anchorOps = O(
      attr({ href }),
      style({ textDecoration: 'none' }),
      clickTether(
        nodeEvent('click'),
        map((clickEv): string => {
          clickEv.preventDefault()

          const pathName = clickEv.currentTarget instanceof HTMLAnchorElement ? clickEv.currentTarget.pathname : null

          if (pathName) {
            // avoid repeated adjacent states
            if (location.pathname !== pathName) {
              history.pushState(null, '', pathName)
            }

            return pathName
          }
          throw new Error('target anchor contains no href')
        })
      ),
      focusTether(($anchor) => {
        const focus = constant(true, merge(nodeEvent('focus', $anchor), nodeEvent('pointerenter', $anchor)))
        const blur = constant(false, merge(nodeEvent('blur', $anchor), nodeEvent('pointerleave', $anchor)))

        return startWith(false, merge(focus, blur))
      }),
      anchorOp
    )

    return [
      anchorOps($anchor),

      { click, match: route.match, contains, focus }
    ]
  })
