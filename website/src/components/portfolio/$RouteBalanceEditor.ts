import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import { readableTokenAmountLabel } from '@puppet/sdk/core'
import { getTokenDescription } from '@puppet/sdk/gmx'
import { combine, type IStream, map, merge, op, sampleMap, switchMap } from 'aelea/stream'
import { type IBehavior, state } from 'aelea/stream-extended'
import { component } from 'aelea/ui'
import { getAddress } from 'viem'
import type { Address } from 'viem/accounts'
import { $intermediatePromise } from '@/ui-components'
import type { IComponentPageParams } from '../../pages/types.js'
import wallet from '../../wallet/wallet.js'
import {
  BALANCE_ACTION,
  type BalanceDraft,
  type IDepositEditorDraft,
  type IWithdrawEditorDraft
} from './$DepositEditor.js'
import { $TokenBalanceEditor } from './$TokenBalanceEditor.js'

interface IRouteBalanceEditor extends IComponentPageParams {
  walletAddress?: Address
  collateralToken: Address
  draftDepositTokenList: IStream<BalanceDraft[]>
}

export const $RouteBalanceEditor = (config: IRouteBalanceEditor) =>
  component(
    (
      [changeDeposit, changeDepositTether]: IBehavior<IDepositEditorDraft>,
      [changeWithdraw, changeWithdrawTether]: IBehavior<IWithdrawEditorDraft>
    ) => {
      const { draftDepositTokenList, collateralToken } = config

      const balanceModel = op(
        draftDepositTokenList,
        map(list => {
          const normalizedCollateral = getAddress(collateralToken)
          const match = list.find(ct => getAddress(ct.token) === normalizedCollateral)
          return (match ?? {
            action: BALANCE_ACTION.DEPOSIT,
            token: collateralToken,
            amount: 0n
          }) as BalanceDraft
        }),
        state
      )

      const collateralTokenDescription = getTokenDescription(collateralToken)

      const depositBalanceStream = op(
        wallet.account,
        switchMap(async accountQuery => {
          const account = await accountQuery
          if (!account) return 0n

          try {
            return await wallet.read({
              ...PUPPET_CONTRACT_MAP.Account,
              functionName: 'userBalanceMap',
              args: [collateralToken, account.address]
            })
          } catch (error) {
            console.warn('Failed to read deposit balance for target, account may not be initialized:', error)
            return 0n
          }
        }),
        state
      )

      const adjustmentChangeStream = map(
        (params: { draft: BalanceDraft; balance: bigint }) => {
          const { draft, balance } = params

          if (!draft) return ''

          if (draft.action === BALANCE_ACTION.DEPOSIT) {
            if (draft.amount === 0n) return ''
          }

          const newBalance = draft.action === BALANCE_ACTION.DEPOSIT ? draft.amount + balance : balance - draft.amount

          return readableTokenAmountLabel(collateralTokenDescription, newBalance)
        },
        combine({ draft: balanceModel, balance: depositBalanceStream })
      )

      const targetDisplay = $intermediatePromise({
        $display: map(async accountQuery => {
          const account = await accountQuery

          if (!account) {
            return $TokenBalanceEditor({
              token: collateralToken,
              balance: depositBalanceStream,
              account: account!
            })({
              changeDeposit: changeDepositTether(),
              changeWithdraw: changeWithdrawTether()
            })
          }

          return $TokenBalanceEditor({
            token: collateralToken,
            balance: depositBalanceStream,
            account,
            model: balanceModel,
            adjustmentChange: adjustmentChangeStream,
            withdrawBalance: depositBalanceStream
          })({
            changeDeposit: changeDepositTether(),
            changeWithdraw: changeWithdrawTether()
          })
        }, wallet.account)
      })

      const updateDraftList = (changeList: BalanceDraft[], draft: BalanceDraft) => {
        const normalizedToken = getAddress(draft.token)
        const existingIndex = changeList.findIndex(ct => getAddress(ct.token) === normalizedToken)
        if (existingIndex !== -1) {
          changeList[existingIndex] = draft
          return [...changeList]
        }
        return [...changeList, draft]
      }

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
