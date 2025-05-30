import { map } from '@most/core'
import type { Stream } from '@most/types'
import { PUPPET_COLLATERAL_LIST } from '@puppet-copy/middleware/const'
import { getTokenDescription } from '@puppet-copy/middleware/gmx'
import type { IBehavior } from 'aelea/core'
import { $text, component } from 'aelea/core'
import { isDesktopScreen } from 'aelea/ui-components'
import type { Address } from 'viem/accounts'
import { $tokenIcon, $tokenLabeled } from '../common/$common'
import { $DropMultiSelect, $defaultNoneSelected } from './form/$DropMultiselect'

interface ISelectCollateralToken {
  selectedList: Stream<Address[]>
}

export const $SelectCollateralToken = ({ selectedList }: ISelectCollateralToken) =>
  component(([changeCollateralTokenList, changeCollateralTokenListTether]: IBehavior<Address[]>) => {
    return [
      $DropMultiSelect({
        $noneSelected: $defaultNoneSelected($text(isDesktopScreen ? 'All Collateral' : 'All')),
        $$option: map((tr) => {
          return $tokenLabeled(getTokenDescription(tr))
        }),
        $$selectedOption: map((tr) => {
          return $tokenIcon(getTokenDescription(tr))
        }),
        value: selectedList,
        optionList: map((list) => PUPPET_COLLATERAL_LIST.filter((item) => list.indexOf(item) === -1), selectedList)
      })({
        select: changeCollateralTokenListTether()
      }),

      {
        changeCollateralTokenList
      }
    ]
  })
