import { map } from '@most/core'
import type { Stream } from '@most/types'
import { PUPPET_COLLATERAL_LIST } from '@puppet/middleware/const'
import { getTokenDescription } from '@puppet/middleware/gmx'
import { $labelDisplay } from '@puppet/middleware/ui-components'
import type { IBehavior } from 'aelea/core'
import { $element, $text, component, type I$Node, type INodeCompose, style } from 'aelea/core'
import { pallete } from 'aelea/ui-components-theme'

import { $tokenIcon, $tokenLabeled } from '../common/$common'
import { $DropMultiSelect } from './form/$Dropdown'

interface ISelectCollateralToken {
  selectedList: Stream<Address[]>
  $container?: INodeCompose
}

export const $SelectCollateralToken = (config: ISelectCollateralToken) =>
  component(([selectMarketTokenList, selectMarketTokenListTether]: IBehavior<Address[]>) => {
    return [
      $DropMultiSelect({
        $container: config.$container,
        $input: $element('input'),
        $label: $labelDisplay(style({ color: pallete.foreground }))($text('Collateral')),
        placeholder: 'All Tokens',
        $$chip: map((tr) => $tokenIcon(getTokenDescription(tr))),
        selector: {
          list: PUPPET_COLLATERAL_LIST,
          $$option: map((tr) => {
            return style(
              {
                padding: '8px'
              },
              $tokenLabeled(getTokenDescription(tr))
            )
          })
        },
        value: config.selectedList
      })({
        select: selectMarketTokenListTether()
      }),

      {
        selectMarketTokenList
      }
    ]
  })
