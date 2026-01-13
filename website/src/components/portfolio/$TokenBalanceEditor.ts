import { readableTokenAmount } from '@puppet/sdk/core'
import { getTokenDescription } from '@puppet/sdk/gmx'
import { combine, constant, type IStream, map, merge, sampleMap, switchMap } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $node, $text, component, type I$Node, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $labeledhintAdjustment } from '@/ui-components'
import { $route } from '../../common/$common.js'
import type { ISignerAccountBase } from '../../wallet/wallet.js'
import { $Popover } from '../$Popover.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'
import { $DepositEditor, BALANCE_ACTION, type BalanceDraft } from './$DepositEditor.js'
import { $WithdrawEditor } from './$WithdrawEditor.js'

export interface ITokenBalanceEditor {
  token: Address
  balance: IStream<bigint>
  walletAccount: ISignerAccountBase
  model: IStream<BalanceDraft> // Current draft state from parent (amount: positive=deposit, negative=withdraw)
}

export const $TokenBalanceEditor = (config: ITokenBalanceEditor) =>
  component(
    (
      [popEditor, popEditorTether]: IBehavior<PointerEvent, 'deposit' | 'withdraw'>,
      [addDeposit, addDepositTether]: IBehavior<BalanceDraft>,
      [addWithdraw, addWithdrawTether]: IBehavior<BalanceDraft>
    ) => {
      const { token, balance, walletAccount, model } = config

      const tokenDescription = getTokenDescription(token)

      // Amount from model: positive = deposit, negative = withdraw
      const draftAmount = map(draft => draft.amount, model)

      // Color based on sign: positive = green (deposit), negative = red (withdraw)
      const adjustmentColor = map(
        (amount: bigint) => (amount > 0n ? pallete.positive : amount < 0n ? pallete.negative : undefined),
        draftAmount
      )

      // Compute new balance preview
      const adjustmentChange = map(
        (params: { amount: bigint; bal: bigint }) => {
          if (params.amount === 0n) return ''
          const newBalance = params.bal + params.amount
          return readableTokenAmount(tokenDescription, newBalance)
        },
        combine({ amount: draftAmount, bal: balance })
      )

      const $balanceDisplay = (bal: bigint): I$Node => {
        return $labeledhintAdjustment({
          color: adjustmentColor,
          change: adjustmentChange,
          $val: $text(readableTokenAmount(tokenDescription, bal))
        })
      }

      const $depositEditor = $DepositEditor({
        model,
        token,
        walletAccount
      })({
        changeModel: addDepositTether()
      })

      const $withdrawEditor = $WithdrawEditor({
        balance,
        token,
        walletAccount
      })({
        changeModel: addWithdrawTether()
      })

      // Replace current model with new deposit/withdraw
      // Deposit emits positive amount, withdraw emits negative amount
      const depositChange = sampleMap(
        params => ({
          ...params.current,
          amount: params.deposit.amount,
          chainId: params.deposit.chainId
        }),
        combine({ current: model, deposit: addDeposit }),
        addDeposit
      )

      const withdrawChange = sampleMap(
        params => ({
          ...params.current,
          amount: params.withdraw.amount // withdraw.amount is already negative
        }),
        combine({ current: model, withdraw: addWithdraw }),
        addWithdraw
      )

      return [
        $Popover({
          $target: $row(spacing.small, style({ padding: '6px 0', alignItems: 'center' }))(
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
                  disabled: map(b => b === 0n, balance)
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
            return $withdrawEditor
          }, popEditor),
          dismiss: merge(addDeposit, addWithdraw)
        })({}),

        {
          changeDraft: merge(depositChange, withdrawChange)
        }
      ]
    }
  )
