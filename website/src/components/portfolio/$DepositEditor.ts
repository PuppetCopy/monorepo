import { constant, empty, map, mergeArray, sample, snapshot } from '@most/core'
import type { Stream } from '@most/types'
import {
  parseFixed,
  parseReadableNumber,
  readableTokenAmount,
  readableTokenAmountLabel
} from '@puppet-copy/middleware/core'
import { getTokenDescription } from '@puppet-copy/middleware/gmx'
import { $ButtonToggle, $defaulButtonToggleContainer, $FieldLabeled } from '@puppet-copy/middleware/ui-components'
import { $node, $text, combineState, component, type IBehavior, type IOps, style, switchMap } from 'aelea/core'
import { $column, $row, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'

export enum DepositEditorAction {
  DEPOSIT,
  WITHDRAW
}

export interface IDepositEditorDraft {
  action: DepositEditorAction
  token: Address
  amount: bigint
}

export const $DepositEditor = (config: {
  walletBalance: Stream<bigint> //
  depositBalance: Stream<bigint> //
  model: Stream<IDepositEditorDraft>
  token: Address
  validation?: IOps<bigint, string | null>
}) =>
  component(
    (
      [clickMax, clickMaxTether]: IBehavior<PointerEvent>,
      [inputAmount, inputAmountTether]: IBehavior<string, bigint>,
      [changeDepositMode, changeDepositModeTether]: IBehavior<DepositEditorAction>,
      [clickSave, clickSaveTether]: IBehavior<PointerEvent>
    ) => {
      const tokenDescription = getTokenDescription(config.token)

      const action = mergeArray([map((model) => model.action, config.model), changeDepositMode])

      const maxAmount = switchMap(
        (action) => {
          return action === DepositEditorAction.DEPOSIT ? config.walletBalance : config.depositBalance
        },
        mergeArray([map((model) => model.action, config.model), changeDepositMode])
      )

      const inputMaxAmount = sample(maxAmount, clickMax)

      const value = mergeArray([
        inputMaxAmount,
        inputAmount,
        constant(0n, changeDepositMode),
        map((model) => model.amount, config.model)
      ])

      const alert = mergeArray([
        map((params) => {
          if (params.action === DepositEditorAction.DEPOSIT && params.value > params.maxAmount) {
            return `Exceeds wallet balance of ${readableTokenAmountLabel(tokenDescription, params.maxAmount)}`
          }

          if (params.action === DepositEditorAction.WITHDRAW && params.value > params.maxAmount) {
            return `Exceeds deposit balance of ${readableTokenAmountLabel(tokenDescription, params.maxAmount)}`
          }

          if (params.value < 0n) {
            return 'Amount cannot be negative'
          }

          return null
        }, combineState({ maxAmount, value, action })),
        config.validation ? config.validation(value) : empty()
      ])

      return [
        $column(spacing.default, style({ minWidth: '230px' }))(
          $ButtonToggle({
            $container: $defaulButtonToggleContainer(style({ placeSelf: 'center' })),
            optionList: [DepositEditorAction.DEPOSIT, DepositEditorAction.WITHDRAW],
            value: action,
            $$option: map((action) => {
              const label = action === DepositEditorAction.DEPOSIT ? 'Deposit' : 'Withdraw'
              return $node(style({ width: '100px', textAlign: 'center' }))($text(label))
            })
          })({
            select: changeDepositModeTether()
          }),

          $row(spacing.small, style({ position: 'relative' }))(
            $FieldLabeled({
              label: 'Amount',
              validation: alert,
              value: map((value) => {
                return value ? readableTokenAmount(tokenDescription, value) : ''
              }, value),
              placeholder: 'Enter amount',
              hint: map(
                (params) => {
                  return `${params.action === DepositEditorAction.DEPOSIT ? 'Wallet' : 'Deposit'} Balance: ${readableTokenAmountLabel(tokenDescription, params.maxAmount)}`
                },
                combineState({
                  maxAmount,
                  action: action
                })
              )
            })({
              change: inputAmountTether(
                map((val) => {
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
              disabled: map(
                (params) => params.alert !== null || params.model?.amount === params.value,
                combineState({ alert, value, model: config.model })
              ),
              $content: $text('Save')
            })({
              click: clickSaveTether()
            })
          )
        ),

        {
          changeModel: mergeArray([
            snapshot(
              (params): IDepositEditorDraft => {
                return {
                  action: params.action,
                  token: config.token,
                  amount: params.value
                }
              },
              combineState({
                value,
                action
              }),
              clickSave
            )
            // constant(0n, changeDepositMode)
          ])
        }
      ]
    }
  )
