import { Behavior } from '@aelea/core'
import { $Node, $element, NodeComposeFn, component, style } from '@aelea/dom'
import { pallete } from "@aelea/ui-components-theme"
import { map } from "@most/core"
import { Stream } from '@most/types'
import { getTokenDescription } from 'gmx-middleware-utils'
import { PUPPET_COLLATERAL_LIST } from 'puppet-middleware-const'
import { $labelDisplay } from 'ui-components'
import * as viem from 'viem'
import { $tokenIcon, $tokenLabeled } from '../common/$common'
import { $DropMultiSelect } from './form/$Dropdown'

interface ISelectCollateralToken {
  collateralTokenList: Stream<viem.Address[]>
  $container?: NodeComposeFn<$Node>
}

export const $SelectCollateralToken = (config: ISelectCollateralToken) => component((
  [selectMarketTokenList, selectMarketTokenListTether]: Behavior<viem.Address[]>,
) => {

  return [
    $DropMultiSelect({
      $container: config.$container,
      $input: $element('input')(style({ width: '100px' })),
      $label: $labelDisplay(style({ color: pallete.foreground }))('Collateral'),
      placeholder: 'All Tokens',
      $$chip: map(tr => $tokenIcon(getTokenDescription(tr))),
      selector: {
        list: PUPPET_COLLATERAL_LIST,
        $$option: map(tr => {
          return style({
            padding: '8px'
          }, $tokenLabeled(getTokenDescription(tr)))
        })
      },
      value: config.collateralTokenList
    })({
      select: selectMarketTokenListTether()
    }),

    {
      selectMarketTokenList
    }
  ]
})

