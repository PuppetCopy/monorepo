import {
  type AttributeBackground,
  type AttributeBadge,
  type AttributeMappings,
  type IBerryDisplayTupleMap,
  getBerryFromItems,
  getLabItemTupleIndex,
  tokenIdAttributeTuple,
} from '@puppet/middleware/gbc'
import {
  $Table,
  $defaultTableCell,
  $defaultTableRowContainer,
  $defaultVScrollContainer,
  $infoLabeledValue,
  $spinner,
  type TableOption,
} from '@puppet/middleware/ui-components'
import { style, stylePseudo } from 'aelea/core'
import { $column, screenUtils } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { $berry } from './$DisplayBerry.js'

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
        padding: '16px 0',
      })($infoLabeledValue('Loading', style({ margin: '' })($spinner))),
    },
    $headerContainer: $defaultTableRowContainer(
      style({ background: pallete.background, padding: screenUtils.isDesktopScreen ? '8px 26px' : '8px' }),
    ),
    $rowContainer: $defaultTableRowContainer(
      stylePseudo(':last-child', { borderRadius: '0 0 18px 18px', marginBottom: '2px' }),
      style({ background: pallete.background, padding: screenUtils.isDesktopScreen ? '8px 26px' : '8px' }),
    ),
    // $bodyRowContainer: $defaultTableRowContainer(
    //   style({ margin: '0 1px' })
    // ),
    ...config,
  })
}

export const $berryByToken = (token: IToken) => {
  const display = getBerryFromItems(token.labItems.map((li) => Number(li.id)))
  const tuple: Partial<IBerryDisplayTupleMap> = [...tokenIdAttributeTuple[token.id - 1]]

  return $berryByLabItems(token.id, display.background, display.custom, display.badge, tuple)
}

export const $berryByLabItems = (
  berryId: number,
  backgroundId: AttributeBackground,
  labItemId: AttributeMappings,
  badgeId: AttributeBadge,
  tuple: Partial<IBerryDisplayTupleMap> = [...tokenIdAttributeTuple[berryId - 1]],
) => {
  if (labItemId) {
    const customIdx = getLabItemTupleIndex(labItemId)

    tuple.splice(customIdx, 1, labItemId as any)
  }

  if (badgeId) {
    tuple.splice(6, 1, badgeId)
  }

  if (backgroundId) {
    tuple.splice(0, 1, backgroundId)
  }

  return $berry(tuple)
}
