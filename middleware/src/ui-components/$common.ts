import { empty, fromPromise, map, now, skipRepeats, startWith } from '@most/core'
import type { Stream } from '@most/types'
import {
  $element,
  $node,
  $svg,
  $text,
  attr,
  combineState,
  type I$Node,
  type I$Slottable,
  type I$Text,
  type INode,
  type IOps,
  type ISlottable,
  isStream,
  O,
  style,
  styleBehavior,
  stylePseudo,
  switchMap
} from 'aelea/core'
import { $column, $row, layoutSheet, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { arbitrum, type Chain } from 'viem/chains'
import { getExplorerUrl, getMappedValue, type ITokenDescription, shortenTxAddress } from '../utils/index.js'
import { $alertIcon, $arrowRight, $caretDblDown, $info, $tokenIconMap } from './$icons.js'
import { $defaultDropContainer, $Tooltip } from './$Tooltip.js'

const $elipsisTextWrapper = $node(
  style({ overflow: 'hidden', minHeight: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis' })
)

export const $anchor = $element('a')(
  spacing.tiny,
  attr({ target: '_blank' }),
  stylePseudo(':hover', { color: `${pallete.foreground}!important`, fill: pallete.foreground }),
  style({
    cursor: 'pointer',
    color: pallete.message,
    alignItems: 'center',
    display: 'inline-flex'
  })
)

export const $alertNegativeContainer = $row(
  spacing.small,
  style({
    minWidth: 0,
    maxWidth: '100%',
    borderRadius: '100px',
    alignItems: 'center',
    fontSize: '.85rem',
    border: `1px dashed ${pallete.negative}`,
    padding: '8px 12px'
  })
)

export const $alertPositiveContainer = $row(
  spacing.small,
  style({
    minWidth: 0,
    maxWidth: '100%',
    borderRadius: '100px',
    alignItems: 'center',
    fontSize: '.85rem',
    border: `1px dashed ${pallete.positive}`,
    padding: '8px 12px'
  })
)

export const $alertIntermediateContainer = (...$content: I$Node[]) =>
  $row(
    spacing.small,
    style({
      minWidth: 0,
      maxWidth: '100%',
      borderRadius: '100px',
      alignItems: 'center',
      fontSize: '.85rem',
      padding: '9px 12px',
      position: 'relative',
      overflow: 'hidden'
    })
  )(
    $node(
      style({
        left: '-50%',
        width: '200%',
        aspectRatio: '1 / 1',
        animation: 'rotate 3.5s linear infinite',
        position: 'absolute',
        background: `conic-gradient(transparent, transparent, transparent, ${pallete.indeterminate})`
      })
    )(),
    $node(
      style({
        inset: '1px',
        position: 'absolute',
        background: colorAlpha(pallete.background, 0.9),
        borderRadius: '100px'
      })
    )(),
    ...$content
  )

export const $alert = ($content: I$Node) =>
  $alertNegativeContainer(style({ alignSelf: 'flex-start' }))(
    $icon({ $content: $alertIcon, viewBox: '0 0 24 24', width: '18px', svgOps: style({ minWidth: '18px' }) }),
    $content
  )

export const $alertTooltip = ($content: I$Node) => {
  return $Tooltip({
    $content: $content,
    // $dropContainer: $defaultDropContainer,
    $anchor: $alertNegativeContainer(
      $icon({ $content: $alertIcon, viewBox: '0 0 24 24', width: '18px', svgOps: style({ minWidth: '18px' }) }),
      $elipsisTextWrapper($content)
    )
  })({})
}

export const $alertPositiveTooltip = ($content: I$Node) => {
  return $Tooltip({
    $content: $content,
    // $dropContainer: $defaultDropContainer,
    $anchor: $alertPositiveContainer(
      $icon({ $content: $alertIcon, viewBox: '0 0 24 24', width: '18px', svgOps: style({ minWidth: '18px' }) }),
      $elipsisTextWrapper($content)
    )
  })({})
}

export const $intermediateTooltip = ($content: I$Node) => {
  return $Tooltip({
    $content: $content,
    // $dropContainer: $defaultDropContainer,
    $anchor: $alertIntermediateContainer(
      $icon({
        $content: $alertIcon,
        viewBox: '0 0 24 24',
        width: '18px',
        svgOps: style({ minWidth: '18px', position: 'relative' })
      }),
      $elipsisTextWrapper(style({ position: 'relative' }))($content)
    )
  })({})
}

export const $toText = (text: string | I$Text): I$Text => {
  return isStream(text) ? text : $text(text)
}

export const $infoLabel = (label: string | I$Text) => {
  // const $msg = isStream(label) ? label : $toText(label)
  return $node(style({ color: pallete.foreground }))($toText(label))
}

export const $infoLabeledValue = (label: string | I$Slottable, value: string | I$Slottable, collapseMobile = false) => {
  const $container = collapseMobile ? $column : $row(style({ alignItems: 'center' }))

  return $container(spacing.small)($infoLabel(label), isStream(value) ? value : $text(value))
}

export const $infoTooltipLabel = (text: string | I$Slottable, label?: string | I$Slottable) => {
  return $row(style({ alignItems: 'center' }))(label ? $infoLabel(label) : empty(), $infoTooltip(text))
}

export const $infoTooltip = (text: string | I$Slottable, color = pallete.foreground, size = '24px') => {
  return $Tooltip({
    $dropContainer: $defaultDropContainer,
    $content: isStream(text) ? text : $node($text(text)),
    $anchor: $icon({
      $content: $info,
      viewBox: '0 0 32 32',
      fill: color,
      svgOps: style({ width: size, height: size, padding: '2px 4px' })
    })
  })({})
}

export const $labeledDivider = (label: string | I$Slottable) => {
  return $row(spacing.default, style({ placeContent: 'center', alignItems: 'center' }))(
    $column(style({ flex: 1, borderBottom: `1px solid ${pallete.horizon}` }))(),
    $row(spacing.small, style({ color: pallete.foreground, alignItems: 'center' }))(
      $node(style({ fontSize: '.85rem' }))($toText(label)),
      $icon({ $content: $caretDblDown, width: '10px', viewBox: '0 0 32 32', fill: pallete.foreground })
    ),
    $column(style({ flex: 1, borderBottom: `1px solid ${pallete.horizon}` }))()
  )
}

export const $tokenLabel = (token: ITokenDescription, $iconPath: I$Node, $label?: I$Slottable) => {
  return $row(spacing.default, style({ cursor: 'pointer', alignItems: 'center' }))(
    $icon({ $content: $iconPath, width: '34px', viewBox: '0 0 32 32' }),
    $column(layoutSheet.flex)(
      $node(style({ fontWeight: 'bold' }))($text(token.symbol)),
      $node(style({ fontSize: '.85rem', color: pallete.foreground }))($text(token.symbol))
    ),
    $label ? $elipsisTextWrapper($label) : empty()
  )
}

export const $tokenLabelFromSummary = (token: ITokenDescription, $label?: I$Slottable) => {
  const $iconG = getMappedValue($tokenIconMap, token.symbol)

  return $row(spacing.default, style({ cursor: 'pointer', alignItems: 'center' }))(
    $icon({ $content: $iconG, width: '34px', viewBox: '0 0 32 32' }),
    $column(layoutSheet.flex)(
      $node(style({ fontWeight: 'bold' }))($text(token.symbol)),
      $node(style({ color: pallete.foreground }))($text(token.name))
    ),
    $label ? $elipsisTextWrapper($label) : empty()
  )
}

export function $txHashRef(txHash: string, chain: Chain = arbitrum) {
  const href = `${getExplorerUrl(chain)}/tx/${txHash}`

  return $anchor(attr({ href }))($text(shortenTxAddress(txHash)))
}

interface IHintAdjustment {
  color?: Stream<string>
  $val: I$Slottable | string
  change: Stream<string>
}

interface ILabeledHintAdjustment extends IHintAdjustment {
  label?: string | I$Slottable
  tooltip?: string | I$Slottable
}

export const $hintAdjustment = ({ change, color, $val }: IHintAdjustment) => {
  const displayChange = skipRepeats(map((str) => !!str, startWith('', change)))
  const arrowColor = color ?? now(pallete.foreground)

  return $row(spacing.tiny, style({ lineHeight: 1, alignItems: 'center' }))(
    styleBehavior(
      map((str) => (str ? { color: pallete.foreground } : {}), change),
      $node(isStream($val) ? $val : $text($val))
    ),

    $icon({
      $content: $arrowRight,
      width: '10px',
      svgOps: styleBehavior(
        map((params) => {
          return params.displayChange ? { fill: params.arrowColor } : { display: 'none' }
        }, combineState({ displayChange, arrowColor }))
      ),
      viewBox: '0 0 32 32'
    }),

    $text(map((str) => str ?? '', change))
  )
}

export const $labeledhintAdjustment = ({ change, color, $val, label, tooltip }: ILabeledHintAdjustment) => {
  return $row(spacing.small, style({ alignItems: 'center' }))(
    tooltip ? $infoTooltipLabel(tooltip, label) : label ? $infoLabel(label) : empty(),

    $hintAdjustment({ change, color, $val })
  )
}

interface Icon {
  /**  in pixels */
  width?: string
  height?: string
  viewBox?: string
  fill?: string

  $content: I$Node
  svgOps?: IOps<INode<SVGSVGElement>, INode<SVGSVGElement>>
}

export const $icon = ({ $content, width = '24px', viewBox = '0 0 32 32', fill = 'inherit', svgOps = O() }: Icon) =>
  $svg('svg')(attr({ viewBox, fill }), style({ width, aspectRatio: '1 /1' }), svgOps)($content)

export const $intermediateText = (querySrc: Stream<Promise<string>>, hint = '-'): I$Node => {
  return $node($text(intermediateText(querySrc, hint)))
}

export const intermediateText = (querySrc: Stream<Promise<string>>, hint = '-'): Stream<string> => {
  const text = switchMap((res) => {
    return startWith(hint, fromPromise(res))
  }, querySrc)
  return text
}
export const $label = $element('label')(
  spacing.small,
  style({ color: pallete.foreground, cursor: 'pointer', display: 'flex' })
)
