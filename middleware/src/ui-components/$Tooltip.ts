import { constant, empty, map, skip, skipRepeats, startWith, switchLatest, zip } from '@most/core'
import type { IBehavior } from 'aelea/core'
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
import { $column, $row, observer } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'

export interface TooltipConfig {
  $anchor: I$Node
  $content: I$Node
  $container?: INodeCompose
  $dropContainer?: INodeCompose

  offset?: number
}

export const $defaultDropContainer = $column(
  style({
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
  offset = 5,
  $container = $defaultTooltipAnchorContainer,
  $dropContainer = $defaultDropContainer
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
            map((enterEvent) => {
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
          switchLatest(
            map((show) => {
              if (!show) {
                return empty()
              }

              return $row(
                contentIntersectionTether(observer.intersection()),
                style({
                  zIndex: 5160,
                  whiteSpace: 'pre-wrap',
                  position: 'absolute',
                  visibility: 'hidden',
                  padding: '8px'
                }),
                styleInline(
                  zip(
                    ([contentRect], [targetRect]) => {
                      const { bottom, top, left, right, height } = targetRect.intersectionRect
                      const { width } = contentRect.boundingClientRect
                      const rootBounds = contentRect.rootBounds!

                      const bottomSpcace = rootBounds.height - bottom
                      const goDown = bottomSpcace > bottom

                      const targetSlice = targetRect.intersectionRect.width / 2

                      const leftSpace = left + targetSlice
                      const rightSpace = rootBounds.width - leftSpace

                      const isLeft = leftSpace < rightSpace
                      const boundingOffset = isLeft
                        ? leftSpace - width / 2 - targetSlice - offset
                        : rightSpace - width / 2 - targetSlice

                      const leftPx =
                        boundingOffset < 0 ? (isLeft ? Math.abs(boundingOffset) : boundingOffset) : targetSlice

                      return {
                        [goDown ? 'top' : 'bottom']: `calc(100% + ${0}px)`,
                        left: `${leftPx}px`,
                        visibility: 'visible',
                        transform: 'translate(-50%, 0)'
                      }
                    },
                    contentIntersection,
                    targetIntersection
                  )
                )
              )($dropContainer($content))
            }, hover)
          )
        ),
        {
          hover
        }
      ]
    }
  )
