import { Behavior, O } from '@aelea/core'
import { $Node, $node, INode, NodeComposeFn, component, nodeEvent, style, styleBehavior } from '@aelea/dom'
import { $column, observer } from '@aelea/ui-components'
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import { constant, empty, filter, map, merge, mergeArray, multicast, switchLatest, until, zip } from "@most/core"
import { Stream } from "@most/types"


export const $defaultPopoverContentContainer = $column(style({ backgroundColor: pallete.middleground, padding: '36px', borderRadius: '24px', border: '1px solid ' + pallete.background, boxShadow: '0 0 10px 0 ' + colorAlpha(pallete.background, .5) }))

interface IPocus {
  open: Stream<$Node>
  dismiss?: Stream<any>

  $target: $Node

  $contentContainer?: NodeComposeFn<$Node>
  $container?: NodeComposeFn<$Node>
  spacing?: number
}

export const $Popover = ({
  open,
  dismiss = empty(),
  spacing = 10,
  $contentContainer = $defaultPopoverContentContainer,
  $container = $node,
  $target
}: IPocus) => component((
  [overlayClick, overlayClickTether]: Behavior<INode, false>,
  [targetIntersection, targetIntersectionTether]: Behavior<INode, IntersectionObserverEntry[]>,
  [popoverContentDimension, popoverContentDimensionTether]: Behavior<INode, ResizeObserverEntry[]>,
) => {

  const openMulticast = multicast(open)

  const contentOps = $contentContainer(
    popoverContentDimensionTether(
      observer.resize({})
    ),
    styleBehavior(
      zip(([contentRect], [targetRect]) => {
        targetRect.target.querySelector('#scrolled-parent');

        // Get the scroll position
        // const scrollTop = getScrollParent(targetRect.target)?.scrollTop || 0

        const screenWidth = targetRect.rootBounds ? targetRect.rootBounds.width : window.innerWidth
        const targetBound = targetRect.intersectionRect
        const bottomSpcace = window.innerHeight - targetBound.bottom
        const goDown = bottomSpcace > targetBound.bottom

        const top = (goDown ? targetBound.bottom + spacing : targetBound.y - spacing)  + 'px'
        const width = Math.min(contentRect.contentRect.width, screenWidth - spacing)
        const center = targetBound.x + (targetBound.width / 2)
        const centerWidth = width / 2
        const rightOffset = center - screenWidth
        const leftOffset = center - centerWidth + Math.min(rightOffset < 0 ? Math.abs(rightOffset) : 0, 0)
        const left = Math.max(leftOffset, spacing) + 'px'


        return {
          top, left,

          transition: 'opacity .2s ease-in-out', visibility: 'visible',
          transform: `translate(0, ${goDown ? '0' : '-100%'})`
        }
      }, popoverContentDimension, targetIntersection)
    ),
    style({ position: 'fixed', visibility: 'hidden' }),
  )



  const $overlay = $node(
    style({
      position: 'fixed', zIndex: 2321, backgroundColor: colorAlpha(pallete.background, .8),
      top: 0, left: 0, right: 0, bottom: 0, // visibility: 'hidden',
    }),
    overlayClickTether(
      nodeEvent('pointerdown'),
      filter(ev => {
        if (ev.target instanceof HTMLElement) {
          const computedStyle = getComputedStyle(ev.target)
          if (computedStyle.zIndex === '2321' && computedStyle.inset === '0px') {
            return true
          }
        }

        return false
      }),
      constant(false)
    ),
  )


  const dismissEvent = merge(overlayClick, dismiss)


  const $content = switchLatest(
    map(content => {
      return until(dismissEvent, mergeArray([
        style({ zIndex: 3456 })(contentOps(content)),
        $overlay(),
      ]))
    }, openMulticast)
  )


  const targetOp = O(
    targetIntersectionTether(
      observer.intersection(),
      // map(node => {
      //   const root = node.element instanceof HTMLElement && node.element.offsetParent || null
      //   return observer.intersection({ root })(now(node))
      // }),
      // switchLatest
    ),
    styleBehavior(
      merge(
        constant({ zIndex: 2345, position: 'relative' }, openMulticast),
        constant(null, dismissEvent)
      )
    )
  )

  return [
    $container(
      targetOp($target),
      $content,
    ),

    {
      overlayClick
    }
  ]
})

/**
 * Returns the nearest scrollable parent of an element.
 * @param {HTMLElement} element - The element whose scrollable parent is to be found.
 * @returns {HTMLElement} - The nearest scrollable parent element.
 */
function getScrollParent(element: Element): Element | null | undefined {
  let parent = element.parentElement;

  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.getPropertyValue('overflow-y');
    const isScrollable = overflowY === 'auto' || overflowY === 'scroll';

    if (isScrollable && parent.scrollHeight > parent.clientHeight) {
      return parent;
    }

    parent = parent.parentElement;
  }

  // Fallback to document scrolling element (usually <html> or <body>)
  return document.scrollingElement || document.documentElement;
}

