import * as PUPPET from '@puppet-copy/middleware/const'
import { readableTokenAmountLabel } from '@puppet-copy/middleware/core'
import { getTokenDescription } from '@puppet-copy/middleware/gmx'
import { combine, constant, fromPromise, type IStream, just, map, merge, op, sampleMap, switchMap } from 'aelea/stream'
import { type IBehavior, state } from 'aelea/stream-extended'
import { $node, $text, component, type I$Node, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { getAddress } from 'viem'
import type { Address } from 'viem/accounts'
import { $intermediatePromise, $labeledhintAdjustment } from '@/ui-components'
import { $route } from '../../common/$common.js'
import type { IComponentPageParams } from '../../pages/types.js'
import wallet from '../../wallet/wallet.js'
import { $Popover } from '../$Popover.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'
import {
  $DepositEditor,
  BALANCE_ACTION,
  type BalanceDraft,
  type IDepositEditorDraft,
  type IWithdrawEditorDraft
} from './$DepositEditor.js'
import { $WithdrawEditor } from './$WithdrawEditor.js'

interface IRouteBalanceEditor extends IComponentPageParams {
  walletAddress?: Address
  collateralToken: Address
  draftDepositTokenList: IStream<BalanceDraft[]>
}

export const $RouteBalanceEditor = (config: IRouteBalanceEditor) =>
  component(
    (
      [popEditor, popEditorTether]: IBehavior<PointerEvent, 'deposit' | 'withdraw'>,
      [changeDeposit, changeDepositTether]: IBehavior<IDepositEditorDraft>,
      [changeWithdraw, changeWithdrawTether]: IBehavior<IWithdrawEditorDraft>
    ) => {
      const { draftDepositTokenList, collateralToken } = config

      const balanceModel = op(
        draftDepositTokenList,
        map(list => {
          const match = list.find(ct => ct.token === collateralToken)
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
              ...PUPPET.CONTRACT.Account,
              functionName: 'userBalanceMap',
              args: [collateralToken, account.subaccountAddress]
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

          return $Popover({
            $open: op(
              popEditor,
              map(action => {
                if (!account) {
                  return $node($text('No account connected'))
                }

                const depositBal = op(
                  just(account),
                  switchMap(async a => {
                    try {
                      const readResult = await wallet.read({
                        ...PUPPET.CONTRACT.Account,
                        functionName: 'userBalanceMap',
                        args: [collateralToken, a.subaccountAddress]
                      })
                      return readResult
                    } catch (error) {
                      console.warn('Failed to read deposit balance, account may not be initialized:', error)
                      return 0n
                    }
                  }),
                  state
                )

                if (action === BALANCE_ACTION.DEPOSIT) {
                  return $DepositEditor({
                    depositBalance: depositBal,
                    model: balanceModel,
                    token: collateralToken,
                    account
                  })({
                    changeModel: changeDepositTether()
                  })
                } else {
                  return $WithdrawEditor({
                    depositBalance: depositBal,
                    token: collateralToken,
                    account
                  })({
                    withdraw: changeWithdrawTether()
                  })
                }
              })
            ),
            $target: $row(spacing.big, style({ padding: '6px 0' }))(
              $route(collateralTokenDescription),
              switchMap((balance): I$Node => {
                return $row(spacing.small, style({ alignItems: 'center' }))(
                  $labeledhintAdjustment({
                    color: map(
                      draft =>
                        draft
                          ? draft.action === BALANCE_ACTION.DEPOSIT
                            ? pallete.positive
                            : pallete.negative
                          : undefined,
                      balanceModel
                    ),
                    change: adjustmentChangeStream,
                    $val: $text(readableTokenAmountLabel(collateralTokenDescription, balance))
                  }),
                  $node(),
                  $ButtonSecondary({
                    $container: $defaultMiniButtonSecondary,
                    $content: $text('Deposit'),
                    disabled: just(!account)
                  })({
                    click: popEditorTether(constant(BALANCE_ACTION.DEPOSIT))
                  }),
                  $ButtonSecondary({
                    $container: $defaultMiniButtonSecondary,
                    $content: $text('Withdraw'),
                    disabled: just(!account || balance === 0n)
                  })({
                    click: popEditorTether(constant(BALANCE_ACTION.WITHDRAW))
                  })
                )
              }, depositBalanceStream)
            ),
            dismiss: merge(changeDeposit, changeWithdraw)
          })({})
        }, wallet.account)
      })

      const updateDraftList = (changeList: BalanceDraft[], draft: BalanceDraft) => {
        const existingIndex = changeList.findIndex(ct => getAddress(ct.token) === getAddress(collateralToken))
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
