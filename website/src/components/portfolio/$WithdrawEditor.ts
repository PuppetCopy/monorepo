import { parseFixed, parseReadableNumber, readableTokenAmount, readableTokenAmountLabel } from '@puppet/sdk/core'
import { getTokenDescription } from '@puppet/sdk/gmx'
import { combine, constant, empty, type IOps, type IStream, map, merge, sample } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $FieldLabeled } from '@/ui-components'
import type { IAccountState } from '../../wallet/wallet.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'
import { BALANCE_ACTION, type IWithdrawEditorDraft } from './$DepositEditor.js'

export const $WithdrawEditor = (config: {
  depositBalance: IStream<bigint>
  token: Address
  account: IAccountState
  validation?: IOps<bigint, string | null>
}) =>
  component(
    (
      [clickMax, clickMaxTether]: IBehavior<PointerEvent>,
      [inputAmount, inputAmountTether]: IBehavior<string, bigint>,
      [clickSave, clickSaveTether]: IBehavior<PointerEvent>
    ) => {
      const tokenDescription = getTokenDescription(config.token)

      const inputValue = merge(sample(config.depositBalance, clickMax), inputAmount)

      const value = merge(inputValue, constant(0n, clickSave))

      const alert = merge(
        map(
          params => {
            if (params.value > params.depositBalance) {
              return `Exceeds deposit balance of ${readableTokenAmountLabel(tokenDescription, params.depositBalance)}`
            }

            if (params.value < 0n) {
              return 'Amount cannot be negative'
            }

            if (params.value === 0n) {
              return 'Amount must be greater than 0'
            }

            return null
          },
          combine({ value, depositBalance: config.depositBalance })
        ),
        config.validation ? config.validation(value) : empty
      )

      return [
        $column(spacing.default, style({ minWidth: '230px' }))(
          $row(spacing.small, style({ position: 'relative' }))(
            $FieldLabeled({
              label: 'Amount',
              validation: alert,
              value: map(value => {
                return value ? readableTokenAmount(tokenDescription, value) : ''
              }, value),
              placeholder: 'Enter amount',
              hint: constant('', value)
            })({
              change: inputAmountTether(
                map(val => {
                  return val ? parseFixed(tokenDescription.decimals, parseReadableNumber(val)) : 0n
                })
              )
            }),
            $ButtonSecondary({
              $container: $defaultMiniButtonSecondary(
                style({
                  position: 'absolute',
                  borderColor: colorAlpha(pallete.foreground, 0.35),
                  right: '6px',
                  top: '8px'
                })
              ),
              $content: $text('Max')
            })({
              click: clickMaxTether()
            })
          ),

          $row(
            $node(style({ flex: 1 }))(),

            $ButtonSecondary({
              disabled: map(params => params.alert !== null || params.value === 0n, combine({ alert, value })),
              $content: $text('Withdraw')
            })({
              click: clickSaveTether()
            })
          )
        ),

        {
          withdraw: map(
            v =>
              ({
                action: BALANCE_ACTION.WITHDRAW,
                token: config.token,
                amount: v
              }) as IWithdrawEditorDraft,
            sample(inputValue, clickSave)
          )
        }
      ]
    }
  )
