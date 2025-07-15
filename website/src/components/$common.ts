import {
  $defaultTableCell,
  $defaultTableRowContainer,
  $defaultVScrollContainer,
  $infoLabeledValue,
  $spinner,
  $Table,
  type TableOption
} from '@puppet-copy/middleware/ui-components'
import { style, stylePseudo } from 'aelea/core'
import { $column, isDesktopScreen } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'

export interface ICardTable<T> extends TableOption<T> {}

export const $CardTable = <T>(config: TableOption<T>) => {
  return $Table({
    $container: $column(style({ borderTop: `1px solid ${colorAlpha(pallete.foreground, 0.2)}` })),
    $cell: $defaultTableCell(style({ padding: '0', height: '80px' })),
    scrollConfig: {
      $container: $defaultVScrollContainer(style({ gap: '2px' })),
      $loader: style({
        placeContent: 'center',
        margin: '0 1px',
        background: pallete.background,
        flexDirection: 'row-reverse',
        padding: '16px 0'
      })($infoLabeledValue('Loading', style({ margin: '' })($spinner)))
    },
    $headerRowContainer: $defaultTableRowContainer(
      style({ background: pallete.background, padding: isDesktopScreen ? '8px 26px' : '8px' })
    ),
    $rowContainer: $defaultTableRowContainer(
      stylePseudo(':last-child', { borderRadius: '0 0 18px 18px', marginBottom: '2px' }),
      style({ background: pallete.background, padding: isDesktopScreen ? '8px 26px' : '8px' })
    ),
    // $bodyRowContainer: $defaultTableRowContainer(
    //   style({ margin: '0 1px' })
    // ),
    ...config
  })
}
