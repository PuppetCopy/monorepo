import { readableTokenAmountLabel } from '@puppet/sdk/core'
import { getTokenDescription } from '@puppet/sdk/gmx'
import { constant, type IStream, just, map, merge, switchMap } from 'aelea/stream'
import { type IBehavior, state } from 'aelea/stream-extended'
import { $node, $text, component, type I$Node, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $labeledhintAdjustment } from '@/ui-components'
import { $route } from '../../common/$common.js'
import type { IAccountState } from '../../wallet/wallet.js'
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

export interface ITokenBalanceEditor {
  token: Address
  balance: IStream<bigint>
  account: IAccountState
  model?: IStream<BalanceDraft>
  adjustmentChange?: IStream<string>
  withdrawBalance?: IStream<bigint>
}

export const $TokenBalanceEditor = (config: ITokenBalanceEditor) =>
  component(
    (
      [popEditor, popEditorTether]: IBehavior<PointerEvent, 'deposit' | 'withdraw'>,
      [changeDeposit, changeDepositTether]: IBehavior<IDepositEditorDraft>,
      [changeWithdraw, changeWithdrawTether]: IBehavior<IWithdrawEditorDraft>
    ) => {
      const { token, balance, account, model, adjustmentChange, withdrawBalance } = config

      const tokenDescription = getTokenDescription(token)

      // Default model if not provided
      const depositModel =
        model ??
        state(
          map(
            (): BalanceDraft => ({
              action: BALANCE_ACTION.DEPOSIT,
              token,
              amount: 0n,
              chainId: account.walletClient.chain!.id
            }),
            just(null)
          )
        )

      // Color based on action type
      const adjustmentColor = model
        ? map(
            draft =>
              draft ? (draft.action === BALANCE_ACTION.DEPOSIT ? pallete.positive : pallete.negative) : undefined,
            model
          )
        : just(undefined)

      const $balanceDisplay = (bal: bigint): I$Node => {
        if (adjustmentChange) {
          return $labeledhintAdjustment({
            color: adjustmentColor,
            change: adjustmentChange,
            $val: $text(readableTokenAmountLabel(tokenDescription, bal))
          })
        }
        return $node($text(readableTokenAmountLabel(tokenDescription, bal)))
      }

      const $depositEditor = $DepositEditor({
        model: depositModel,
        token,
        account
      })({
        changeModel: changeDepositTether()
      })

      const $withdrawEditor = withdrawBalance
        ? $WithdrawEditor({
            depositBalance: withdrawBalance,
            token,
            account
          })({
            withdraw: changeWithdrawTether()
          })
        : null

      return [
        $Popover({
          $target: $row(spacing.big, style({ padding: '6px 0', alignItems: 'center' }))(
            $route(tokenDescription),
            switchMap((bal): I$Node => {
              return $row(spacing.small, style({ alignItems: 'center' }))(
                $balanceDisplay(bal),
                $node(),
                $ButtonSecondary({
                  $container: $defaultMiniButtonSecondary,
                  $content: $text('Deposit')
                })({
                  click: popEditorTether(constant(BALANCE_ACTION.DEPOSIT))
                }),
                $ButtonSecondary({
                  $container: $defaultMiniButtonSecondary,
                  $content: $text('Withdraw'),
                  disabled: just(bal === 0n || !withdrawBalance)
                })({
                  click: popEditorTether(constant(BALANCE_ACTION.WITHDRAW))
                })
              )
            }, balance)
          ),
          $open: map(action => {
            if (action === BALANCE_ACTION.DEPOSIT) {
              return $depositEditor
            }
            return $withdrawEditor!
          }, popEditor),
          dismiss: merge(changeDeposit, changeWithdraw)
        })({}),

        {
          changeDeposit,
          changeWithdraw
        }
      ]
    }
  )
