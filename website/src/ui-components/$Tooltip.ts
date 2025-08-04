import {
  component,
  eventElementTarget,
  type I$Node,
  type INode,
  type INodeCompose,
  nodeEvent,
  style,
  styleInline
} from 'aelea/core'
import {
  constant,
  empty,
  type IBehavior,
  map,
  skip,
  skipRepeats,
  startWith,
  switchLatest,
  switchMap,
  zipMap
} from 'aelea/stream'
import { $column, $row, observer } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'

export interface TooltipConfig {
  $anchor: I$Node
  $content: I$Node
  $container?: INodeCompose
  $dropContainer?: INodeCompose
}

export const $defaultTooltipDropContainer = $column(
  style({
    whiteSpace: 'pre-wrap',
    maxWidth: '600px',
    userSelect: 'text',
    background: pallete.background,
    boxShadow: `${colorAlpha(pallete.message, 0.14)} 0px 4px 20px 8px, ${colorAlpha(pallete.message, 0.1)} 0px 1px 3px 1px`,
    padding: '16px',
    minWidth: '300px',
    borderRadius: '8px',
    fontWeight: 'normal'
  })
)

export const $defaultTooltipAnchorContainer = $row(style({ position: 'relative', minWidth: 0 }))

export const $Tooltip = ({
  $anchor,
  $content,
  $container = $defaultTooltipAnchorContainer,
  $dropContainer = $defaultTooltipDropContainer
}: TooltipConfig) =>
  component(
    (
      [hover, hoverTether]: IBehavior<INode, boolean>,
      [targetIntersection, targetIntersectionTether]: IBehavior<INode, IntersectionObserverEntry[]>,
      [contentIntersection, contentIntersectionTether]: IBehavior<INode, IntersectionObserverEntry[]>
    ) => {
      const isTouchDevice = 'ontouchstart' in window

      return [
        $container(
          hoverTether(
            nodeEvent(isTouchDevice ? 'pointerenter' : 'pointerenter'),
            map(enterEvent => {
              // prevent selection highlighting
              if (isTouchDevice) {
                enterEvent.preventDefault()
              }

              const target = enterEvent.currentTarget
              if (!(target instanceof HTMLElement)) {
                throw new Error('invalid Target element')
              }

              const pointerLeave = isTouchDevice
                ? skip(1, eventElementTarget('pointerdown', window))
                : eventElementTarget('pointerleave', target)
              return startWith(true, constant(false, pointerLeave))
              // return startWith(true, never())
            }),
            switchLatest,
            skipRepeats
          ),
          targetIntersectionTether(observer.intersection())
        )(
          style({ cursor: 'help' })($anchor),
          switchMap(show => {
            if (!show) {
              return empty
            }

            return $row(
              contentIntersectionTether(observer.intersection()),
              style({
                zIndex: 5160,
                whiteSpace: 'pre-wrap',
                position: 'fixed',
                visibility: 'hidden',
                padding: '8px'
              }),
              styleInline(
                zipMap(
                  ([contentRect], [targetRect]) => {
                    const screenWidth = targetRect.rootBounds?.width ?? window.innerWidth
                    const targetBound = targetRect.intersectionRect
                    const bottomSpace = window.innerHeight - targetBound.bottom
                    const goDown = bottomSpace > targetBound.bottom

                    // clamp width to screen minus both side‑spacings
                    const maxWidth = screenWidth

                    const measured = contentRect.target.clientWidth
                    const width = Math.min(measured, maxWidth)

                    // center on target, then clamp left within [spacing, screenWidth - width - spacing]
                    const centerX = targetBound.x + targetBound.width / 2
                    const rawLeft = Math.max(centerX - width / 2, 0)
                    const maxLeft = screenWidth - width
                    const left = `${Math.min(rawLeft, maxLeft)}px`

                    const top = `${goDown ? targetBound.bottom : targetBound.y}px`

                    return {
                      top,
                      left,
                      width: `${width}px`,
                      maxWidth: `${maxWidth}px`,
                      transition: 'opacity .2s ease-in-out',
                      visibility: 'visible',
                      transform: `translate(0, ${goDown ? '0' : '-100%'})`
                    }
                  },
                  contentIntersection,
                  targetIntersection
                )
              )
            )($dropContainer($content))
          }, hover)
        ),
        {
          hover
        }
      ]
    }
  )
