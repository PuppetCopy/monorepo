import { empty, isStream } from 'aelea/stream'
import { $node, $text, type I$Node, style } from 'aelea/ui'
import { $ButtonIcon, $column, $icon, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete, theme } from 'aelea/ui-components-theme'
import { $caretDblDown } from '@/ui-components'
import { $trash } from './$icons.js'

export const $TrashBtn = $ButtonIcon($trash)

export const boxShadow =
  theme.name === 'dark'
    ? 'rgb(0 0 0 / 25%) 0px 0px 1px, rgb(0 0 0 / 15%) 0px 15px 20px, rgb(0 0 0 / 8%) 0px 1px 12px'
    : 'rgb(0 0 0 / 25%) 0px 0px 1px, rgb(59 60 74 / 15%) 0px 15px 20px, rgb(0 0 0 / 8%) 0px 1px 12px'

export const $card = $column(
  spacing.default,
  style({
    borderRadius: '6px',
    boxShadow: boxShadow,
    padding: isDesktopScreen ? '36px' : '12px',
    backgroundColor: pallete.background
  })
)

export const $card2 = $column(
  spacing.default,
  style({
    borderRadius: '6px',
    padding: '12px',
    backgroundColor: pallete.middleground,
    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 4px 20px 0px'
  })
)

export const $seperator = $node(style({ color: pallete.foreground, pointerEvents: 'none' }))($text('|'))
export const $responsiveFlex = isDesktopScreen ? $row(spacing.default) : $column(spacing.small, style({ flex: 1 }))

function convertMsToGoogleCalendarDate(ms: Date) {
  const date = new Date(ms)
  const year = date.getUTCFullYear()
  const month = `0${date.getUTCMonth() + 1}`.slice(-2)
  const day = `0${date.getUTCDate()}`.slice(-2)
  const hours = `0${date.getUTCHours()}`.slice(-2)
  const minutes = `0${date.getUTCMinutes()}`.slice(-2)
  const seconds = `0${date.getUTCSeconds()}`.slice(-2)

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

export const $labeledDivider = (label: string | I$Node, displayIcon = true) => {
  return $row(spacing.default, style({ placeContent: 'center', alignItems: 'center' }))(
    $column(style({ flex: 1, borderBottom: `1px solid ${colorAlpha(pallete.foreground, 0.2)}` }))(),
    $row(spacing.small, style({ alignItems: 'center' }))(
      isStream(label) ? label : $node(style({ fontSize: '.8rem' }))($text(label)),
      displayIcon
        ? $icon({ $content: $caretDblDown, width: '10px', viewBox: '0 0 32 32', fill: pallete.foreground })
        : empty
    ),
    $column(style({ flex: 1, borderBottom: `1px solid ${colorAlpha(pallete.foreground, 0.2)}` }))()
  )
}
