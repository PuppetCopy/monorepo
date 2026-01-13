import { type IStream, merge, sampleMap } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import type { IComponentPageParams } from '../../pages/types.js'
import type { IAccountState } from '../../wallet/wallet.js'
import type { BalanceDraft } from './$DepositEditor.js'

interface IRouteBalanceEditor extends IComponentPageParams {
  accountQuery: IStream<Promise<IAccountState>>
  // Master address - this IS the route in the new architecture
  master: Address
  collateralToken: Address
  draftDepositTokenList: IStream<BalanceDraft[]>
}

// Each Master is a Route - puppets allocate shares to it
// TODO: This component needs to receive RhinestoneAccount instead of Address after consolidation
export const $RouteBalanceEditor = (config: IRouteBalanceEditor) =>
  component(
    (
      [changeDeposit, changeDepositTether]: IBehavior<BalanceDraft>, //
      [changeWithdraw, changeWithdrawTether]: IBehavior<BalanceDraft>
    ) => {
      const { draftDepositTokenList, master } = config

      // Key by token for deduplication (single active smart account)
      const getDraftKey = (draft: BalanceDraft) => draft.token.toLowerCase()

      const updateDraftList = (changeList: BalanceDraft[], draft: BalanceDraft) => {
        const key = getDraftKey(draft)
        const existingIndex = changeList.findIndex(ct => getDraftKey(ct) === key)
        if (existingIndex !== -1) {
          changeList[existingIndex] = draft
          return [...changeList]
        }
        return [...changeList, draft]
      }

      // TODO: This component requires RhinestoneAccount, not Address
      // It needs to be refactored to receive the account from parent or create it here
      // For now, returning placeholder - component disabled
      const targetDisplay = $node(style({ color: pallete.foreground, padding: '12px' }))(
        $text(`Route balance editor for ${master.slice(0, 8)}... disabled - needs RhinestoneAccount`)
      )

      return [
        targetDisplay,

        {
          changeDepositTokenList: merge(
            sampleMap(updateDraftList, draftDepositTokenList, changeDeposit),
            sampleMap(updateDraftList, draftDepositTokenList, changeWithdraw)
          )
        }
      ]
    }
  )
