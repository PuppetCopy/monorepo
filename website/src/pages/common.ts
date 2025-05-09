import { $node, $text, style } from 'aelea/core'
import { $column, $row, $seperator, isMobileScreen, screenUtils } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'

export const $metricEntry = (label: string, value: string) =>
  $row(style({ fontSize: '.85rem', alignItems: 'center' }))(
    $node(style({ color: pallete.foreground, flex: 1 }))($text(label)),
    $node(style({ fontWeight: 'bold' }))($text(value))
  )

export const $seperator2 = style(
  { backgroundColor: colorAlpha(pallete.foreground, 0.2), alignSelf: 'stretch', display: 'block' },
  $seperator
)

export const $rootContainer = $column(
  style({
    color: pallete.message,
    fill: pallete.message,
    // position: 'relative',
    // backgroundImage: `radial-gradient(570% 71% at 50% 15vh, ${pallete.background} 0px, ${pallete.horizon} 100%)`,
    backgroundColor: pallete.horizon,
    fontSize: '1rem',
    // fontSize: isDesktopScreen ? '1.15rem' : '1rem',
    minHeight: '100vh',
    fontWeight: 400
    // flexDirection: 'row',
  }),

  isMobileScreen ? style({ userSelect: 'none' }) : style({})
)
