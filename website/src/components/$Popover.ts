import { combine, constant, empty, type IStream, map, merge, op, start, switchMap } from 'aelea/stream'
import { type IBehavior, multicast, state } from 'aelea/stream-extended'
import {
  $node,
  component,
  fromEventTarget,
  type I$Node,
  type INode,
  type INodeCompose,
  nodeEvent,
  style,
  styleBehavior,
  styleInline
} from 'aelea/ui'
import { $column, isDesktopScreen, observer } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'

export const $defaultPopoverContentContainer = $column(
  style({
    backgroundColor: pallete.middleground,
    padding: isDesktopScreen ? '36px' : '16px',
    borderRadius: '24px',
    border: `1px solid ${colorAlpha(pallete.foreground, 0.15)}`,
    boxShadow: `0 0 10px 0 ${colorAlpha(pallete.background, 0.5)}`
  })
)

interface IPopover {
  $open: IStream<I$Node>
  $target: I$Node
  dismiss?: IStream<any>
  spacing?: number
  $contentContainer?: INodeCompose
  $container?: INodeCompose
}

export const $Popover = ({
  $open,
  $target,
  $contentContainer = $defaultPopoverContentContainer,
  $container = $node,
  dismiss = empty,
  spacing = 10
}: IPopover) =>
  component(
    (
      [overlayClick, overlayClickTether]: IBehavior<INode, false>,
      [targetIntersection, targetIntersectionTether]: IBehavior<INode, IntersectionObserverEntry[]>,
      [contentIntersection, contentIntersectionTether]: IBehavior<INode, IntersectionObserverEntry[]>
    ) => {
      const dismissEvent = merge(overlayClick, dismiss)

      let targetElement: Element | null = null

      // Update events stream
      const updateEvents = merge(
        fromEventTarget(window, 'scroll', { capture: true }),
        fromEventTarget(window, 'resize')
      )

      const $overlay = $node(
        style({
          position: 'fixed',
          zIndex: 2321,
          backgroundColor: colorAlpha(pallete.horizon, 0.85),
          inset: 0
        }),
        overlayClickTether(nodeEvent('pointerdown'), constant(false))
      )

      const openContent = multicast(merge($open, constant(null, dismissEvent)))

      // Apply z-index to target when popover is open
      const $targetWithZIndex = op(
        $target,
        targetIntersectionTether(state, observer.intersection()),
        styleBehavior(
          map($isOpen => {
            return $isOpen ? ({ zIndex: 2345, position: 'relative' } as const) : null
          }, openContent)
        )
      )

      const $popover = switchMap($content => {
        if (!$content) {
          return empty
        }

        return merge(
          $contentContainer(
            style({ position: 'fixed', zIndex: 3456 }),
            contentIntersectionTether(observer.intersection()),
            styleInline(
              map(
                params => {
                  const [targetEntry] = params.targetIntersection
                  const [contentEntry] = params.contentIntersection

                  // Store target element for scroll updates
                  if (targetEntry?.target) {
                    targetElement = targetEntry.target
                  }

                  // Use stored element or entry
                  const el = params.updateEvent ? targetElement : targetEntry?.target
                  if (!el) return { visibility: 'hidden' }

                  // Wait for content to be measured before positioning
                  if (!contentEntry?.boundingClientRect.width) {
                    return { visibility: 'hidden' }
                  }

                  const rect = el.getBoundingClientRect()
                  const bottomSpace = window.innerHeight - rect.bottom
                  const topSpace = rect.top
                  const goDown = bottomSpace > 200 || bottomSpace > topSpace

                  // Get actual popover width
                  const popoverWidth = contentEntry.boundingClientRect.width

                  // Center horizontally on the element
                  const centerX = rect.left + rect.width / 2
                  const left = Math.max(
                    spacing,
                    Math.min(centerX - popoverWidth / 2, window.innerWidth - popoverWidth - spacing)
                  )

                  return {
                    top: `${goDown ? rect.bottom + spacing : rect.top - spacing}px`,
                    left: `${left}px`,
                    transform: `translate(0, ${goDown ? '0' : '-100%'})`,
                    visibility: 'visible'
                  }
                },
                combine({
                  targetIntersection,
                  contentIntersection,
                  updateEvent: start(null, updateEvents)
                })
              )
            )
          )($content),
          $overlay()
        )
      }, openContent)

      // ($target)

      return [
        $container($targetWithZIndex, $popover), //
        { overlayClick }
      ]
    }
  )
