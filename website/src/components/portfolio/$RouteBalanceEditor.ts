import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import { readableTokenAmountLabel } from '@puppet/sdk/core'
import { getTokenDescription } from '@puppet/sdk/gmx'
import { awaitPromises, combine, type IStream, map, merge, op, sampleMap, switchMap } from 'aelea/stream'
import { type IBehavior, state } from 'aelea/stream-extended'
import { component } from 'aelea/ui'
import { getAddress } from 'viem'
import type { Address } from 'viem/accounts'
import { $intermediatePromise } from '@/ui-components'
import type { IComponentPageParams } from '../../pages/types.js'
import wallet, { type IAccountState } from '../../wallet/wallet.js'
import {
  BALANCE_ACTION,
  type BalanceDraft,
  type IDepositEditorDraft,
  type IWithdrawEditorDraft
} from './$DepositEditor.js'
import { $TokenBalanceEditor } from './$TokenBalanceEditor.js'

interface IRouteBalanceEditor extends IComponentPageParams {
  accountQuery: IStream<Promise<IAccountState | null>>
  // Master subaccount address - this IS the route in the new architecture
  masterSubaccount: Address
  collateralToken: Address
  draftDepositTokenList: IStream<BalanceDraft[]>
}

// Each Master subaccount is a Route - puppets allocate shares to it
export const $RouteBalanceEditor = (config: IRouteBalanceEditor) =>
  component(
    (
      [changeDeposit, changeDepositTether]: IBehavior<IDepositEditorDraft>,
      [changeWithdraw, changeWithdrawTether]: IBehavior<IWithdrawEditorDraft>
    ) => {
      const { accountQuery, draftDepositTokenList, collateralToken, masterSubaccount } = config

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

      // Read user's share balance in the master's subaccount (route)
      const shareBalanceStream = op(
        awaitPromises(accountQuery),
        switchMap(async account => {
          if (!account) return 0n

          try {
            return await wallet.read({
              abi: PUPPET_CONTRACT_MAP.Allocate.abi,
              address: PUPPET_CONTRACT_MAP.Allocate.address,
              functionName: 'shareBalanceMap',
              args: [masterSubaccount, account.address]
            })
          } catch (error) {
            console.warn('Failed to read share balance:', error)
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
        combine({ draft: balanceModel, balance: shareBalanceStream })
      )

      const targetDisplay = $intermediatePromise({
        $display: map(async accountQuery => {
          const account = await accountQuery

          if (!account) {
            return $TokenBalanceEditor({
              token: collateralToken,
              balance: shareBalanceStream,
              account: account!
            })({
              changeDeposit: changeDepositTether(),
              changeWithdraw: changeWithdrawTether()
            })
          }

          return $TokenBalanceEditor({
            token: collateralToken,
            balance: shareBalanceStream,
            account,
            model: balanceModel,
            withdrawBalance: shareBalanceStream
          })({
            changeDeposit: changeDepositTether(),
            changeWithdraw: changeWithdrawTether()
          })
        }, awaitPromises(accountQuery))
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
