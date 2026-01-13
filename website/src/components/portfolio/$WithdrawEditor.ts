import { parseFixed, parseReadableNumber, readableTokenAmount, readableTokenAmountLabel } from '@puppet/sdk/core'
import { getTokenDescription } from '@puppet/sdk/gmx'
import { combine, constant, empty, type IOps, type IStream, map, merge, sample } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $FieldLabeled } from '@/ui-components'
import type { ISignerAccountBase } from '../../wallet/wallet.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'
import type { BalanceDraft } from './$DepositEditor.js'

export const $WithdrawEditor = (config: {
  balance: IStream<bigint>
  token: Address
  walletAccount: ISignerAccountBase
  validation?: IOps<bigint, string | null>
}) =>
  component(
    (
      [clickMax, clickMaxTether]: IBehavior<PointerEvent>,
      [inputAmount, inputAmountTether]: IBehavior<string, bigint>,
      [clickSave, clickSaveTether]: IBehavior<PointerEvent>
    ) => {
      const tokenDescription = getTokenDescription(config.token)

      const inputValue: IStream<bigint> = merge(sample(config.balance, clickMax), inputAmount)

      const value = merge(inputValue, constant(0n, clickSave))

      const alert = merge(
        map(
          params => {
            if (params.value > params.balance) {
              return `Exceeds balance of ${readableTokenAmountLabel(tokenDescription, params.balance)}`
            }

            if (params.value < 0n) {
              return 'Amount cannot be negative'
            }

            if (params.value === 0n) {
              return 'Amount must be greater than 0'
            }

            return null
          },
          combine({ value, balance: config.balance })
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
          changeModel: map(
            (amount: bigint): BalanceDraft => ({
              token: config.token,
              amount: -amount, // Negative = withdraw
              chainId: config.walletAccount.walletClient.chain!.id
            }),
            sample(inputValue, clickSave)
          )
        }
      ]
    }
  )
