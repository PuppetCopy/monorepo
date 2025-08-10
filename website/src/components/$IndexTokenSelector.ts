import { TOKEN_DESCRIPTION_LIST } from '@puppet-copy/middleware/const'
import { getTokenDescription } from '@puppet-copy/middleware/gmx'
import { type IBehavior, type IStream, map } from 'aelea/stream'
import { $text, component } from 'aelea/ui'
import { isDesktopScreen } from 'aelea/ui-components'
import type { Address } from 'viem/accounts'
import { $tokenIcon, $tokenLabeled } from '../common/$common'
import { $DropMultiSelect, $defaultNoneSelected } from './form/$DropMultiselect'

interface ISelectIndexToken {
  selectedList: IStream<Address[]>
}

export const $SelectIndexToken = ({ selectedList }: ISelectIndexToken) =>
  component(([changeIndexTokenList, changeIndexTokenListTether]: IBehavior<Address[]>) => {
    return [
      $DropMultiSelect({
        $noneSelected: $defaultNoneSelected($text(isDesktopScreen ? 'All Index Tokens' : 'All')),
        $$option: map(address => {
          const token = getTokenDescription(address)
          return token ? $tokenLabeled(token) : $text(address)
        }),
        $$selectedOption: map(address => {
          const token = getTokenDescription(address)
          return token ? $tokenIcon(token) : $text('')
        }),
        value: selectedList,
        optionList: map(selected => {
          return TOKEN_DESCRIPTION_LIST.map(t => t.address as Address).filter(addr => selected.indexOf(addr) === -1)
        }, selectedList)
      })({
        select: changeIndexTokenListTether()
      }),

      { changeIndexTokenList }
    ]
  })
