import { invertColor } from '@puppet-copy/middleware/core'
import { combine, type IBehavior, type IStream, join, map, merge, now, sampleMap, until } from 'aelea/stream'
import {
  $node,
  $text,
  component,
  eventElementTarget,
  type I$Node,
  type INode,
  type INodeCompose,
  nodeEvent,
  style,
  styleBehavior,
  styleInline
} from 'aelea/ui'
import { $column, $row, type Input, observer } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'

export interface ISliderParams extends Input<number> {
  step?: number

  $thumb?: I$Node
  $container?: INodeCompose
  disabled?: IStream<boolean>
  min?: IStream<number>
  max?: IStream<number>

  color?: IStream<string>
}

export const $defaultSliderThumb = $row(
  style({
    whiteSpace: 'pre-wrap',
    textAlign: 'center',
    position: 'absolute',
    background: pallete.background,
    borderRadius: '50px',
    cursor: 'grab',
    lineHeight: 0.9,
    userSelect: 'none',
    fontSize: '1.1rem',
    alignItems: 'center',
    pointerEvents: 'all',
    placeContent: 'center',
    transition: 'border 250ms ease-in',
    border: `2px solid ${pallete.primary}`,
    // borderWidth: '2px',
    width: '38px',
    height: '38px'
  })
)

export const $sliderDefaultContainer = $column(
  style({ minHeight: '26px', zIndex: 0, touchAction: 'none', placeContent: 'center', cursor: 'pointer' })
)

export const $Slider = ({
  value,
  color = now(pallete.primary),
  step = 0,
  disabled = now(false),
  min = now(0),
  max = now(1),
  $thumb,
  $container = $sliderDefaultContainer
}: ISliderParams) =>
  component(
    (
      [changeSliderDimension, changeSliderDimensionTether]: IBehavior<INode<HTMLInputElement>, ResizeObserverEntry>,
      [thumbePositionDelta, thumbePositionDeltaTether]: IBehavior<INode<HTMLInputElement>, number>
    ) => {
      const $rangeWrapper = $row(
        style({ height: '2px', pointerEvents: 'none', background: pallete.background, position: 'relative' })
      )

      return [
        $container(
          changeSliderDimensionTether(
            observer.resize({}),
            map(res => res[0])
          ),
          thumbePositionDeltaTether(
            nodeEvent('pointerdown'),
            downSrc => {
              return sampleMap(
                (params, downEvent) => {
                  const dragEnd = eventElementTarget('pointerup', window.document)
                  const dragStart = eventElementTarget('pointermove', window.document)
                  const drag = until(dragEnd, dragStart)
                  const rectWidth = params.changeSliderDimension.contentRect.width

                  const startFromBar = downEvent.target === params.changeSliderDimension.target

                  if (startFromBar) {
                    const initOffsetX = downEvent.layerX || downEvent.offsetX // Firefox uses layerX
                    const initialOffset = now(Math.min(Math.max(downEvent.offsetX / rectWidth, params.min), params.max))
                    const moveDelta = map(moveEvent => {
                      const deltaX = moveEvent.clientX - downEvent.clientX + initOffsetX

                      moveEvent.preventDefault()

                      const val = deltaX / rectWidth

                      const cVal = Math.min(Math.max(val, params.min), params.max)
                      const steppedVal = step > 0 ? (cVal / step) * step : cVal

                      return steppedVal
                    }, drag)

                    return merge(initialOffset, moveDelta)
                  }

                  return map(moveEvent => {
                    const normalisedValue = Math.min(Math.max(params.value, params.min), params.max)
                    const deltaX = moveEvent.clientX - downEvent.clientX + rectWidth * normalisedValue

                    moveEvent.preventDefault()

                    const val = deltaX / rectWidth

                    const cVal = Math.min(Math.max(val, params.min), params.max)
                    const steppedVal = step > 0 ? (cVal / step) * step : cVal

                    return steppedVal
                  }, drag)
                },
                combine({ value, min, max, color, changeSliderDimension }),
                downSrc
              )
            },
            join
          )
        )(
          $rangeWrapper(
            styleInline(
              map(params => {
                const gutterColor = colorAlpha(pallete.background, 0.35)
                const minArea = `${colorAlpha(params.color, 0.35)} ${params.min * 100}%,`
                const valArea = `${params.color} ${params.min * 100}% ${params.value * 100}%,`
                const freeArea = `${invertColor(pallete.message)} ${params.value * 100}% ${params.max * 100}%,`
                const maxArea = `${gutterColor} ${params.max * 100}%`

                const background = `linear-gradient(90deg, ${minArea} ${valArea} ${freeArea} ${maxArea}`
                return { background }
              }, combine({ value, min, max, color }))
            )
          )(
            $row(
              styleInline(map(val => ({ left: `${Math.min(Math.max(val, 0), 1) * 100}%` }), value)),
              style({
                width: '0px',
                top: '50%',
                position: 'absolute',
                transition: 'left 175ms cubic-bezier(0.25, 0.8, 0.25, 1) 0s',
                alignItems: 'center',
                placeContent: 'center'
              })
            )(
              styleBehavior(
                map(params => {
                  return params.disabled
                    ? {
                        borderColor: colorAlpha(pallete.foreground, 0.2),
                        pointerEvents: params.disabled ? 'none' : 'all'
                      }
                    : { borderColor: params.color }
                }, combine({ disabled, color }))
              )(
                $thumb
                  ? $thumb
                  : $defaultSliderThumb(
                      $node(style({ paddingTop: '2px' }))($text(map(n => `${Math.floor(n * 100)}%`, value)))
                    )
              )
            )
          )
        ),
        {
          change: thumbePositionDelta
        }
      ]
    }
  )
