import { empty, map, mergeArray, sample, startWith } from '@most/core'
import type { Stream } from '@most/types'
import { getTokenDescription } from '@puppet/middleware/gmx'
import { $FieldLabeled } from '@puppet/middleware/ui-components'
import {
  parseFixed,
  parseReadableNumber,
  readableTokenAmount,
  readableTokenAmountLabel
} from '@puppet/middleware/utils'
import { $node, $text, combineState, component, type IBehavior, type IOps, style } from 'aelea/core'
import { $column, $row, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'

export const $DepositEditor = (config: {
  walletBalance: Stream<bigint> //
  initialAmount: bigint
  token: Address
  validation?: IOps<bigint, string | null>
}) =>
  component(
    (
      [clickMax, clickMaxTether]: IBehavior<PointerEvent>,
      [inputAmount, inputAmountTether]: IBehavior<string, bigint>,
      [clickSave, clickSaveTether]: IBehavior<PointerEvent>
    ) => {
      const tokenDescription = getTokenDescription(config.token)
      const inputMaxAmount = sample(config.walletBalance, clickMax)
      const draft = mergeArray([inputMaxAmount, inputAmount])

      const alert = mergeArray([
        map(
          (params) => {
            if (params.walletBalance === 0n) {
              return 'Wallet balance is 0'
            }

            if (params.draft > params.walletBalance) {
              return `Exceeds wallet balance of ${readableTokenAmountLabel(tokenDescription, params.walletBalance)}`
            }

            if (params.draft === 0n) {
              return 'Amount cannot be 0'
            }

            if (params.draft < 0n) {
              return 'Amount cannot be negative'
            }

            return null
          },
          combineState({ walletBalance: config.walletBalance, draft })
        ),
        config.validation ? config.validation(draft) : empty()
      ])

      return [
        $column(spacing.default, style({ minWidth: '230px' }))(
          $row(spacing.small, style({ position: 'relative' }))(
            $FieldLabeled({
              label: 'Amount',
              validation: alert,
              value: startWith(
                readableTokenAmount(tokenDescription, config.initialAmount),
                map((value) => {
                  return value ? readableTokenAmount(tokenDescription, value) : ''
                }, inputMaxAmount)
              ),
              placeholder: 'Enter amount',
              hint: map((balance) => {
                return `Wallet Balance: ${readableTokenAmountLabel(tokenDescription, balance)}`
              }, config.walletBalance)
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
                (params) => params.alert !== null || config.initialAmount === params.draft,
                combineState({ alert, draft })
              ),
              $content: $text('Save')
            })({
              click: clickSaveTether()
            })
          )
        ),

        {
          changeAmount: sample(draft, clickSave)
        }
      ]
    }
  )

// export const $WithdrawEditor = (config: {
//   destination: Address
//   token: Address //
// }) =>
//   component(
//     (
//       [changeWallet, changeWalletTether]: IBehavior<EIP6963ProviderDetail>,

//       [clickMax, clickMaxTether]: IBehavior<PointerEvent>,
//       [changeAmount, changeAmountTether]: IBehavior<string, bigint>,
//       [changeDepositMode, changeDepositModeTether]: IBehavior<DepositEditorAction>,

//       [clickSave, clickSaveTether]: IBehavior<PointerEvent>
//     ) => {
//       const walletTokenbBalance = replayState(
//         switchMap(async (account) => {
//           if (!account.address) return 0n

//         }, wallet.account)
//       )

//       const tokenDescription = getTokenDescription(config.token)

//       const amount = replayState(
//         mergeArray([
//           sample(walletTokenbBalance, clickMax),
//           changeAmount, //
//           constant(0n, changeDepositMode)
//         ])
//       )

//       return [
//         $column(spacing.default, style({ width: '330px' }))(
//           $text('Deposit Editor'),
//           $infoLabel(`Token: ${tokenDescription.symbol} (${tokenDescription.name})`),

//           $node(),

//           $row(spacing.small, style({ position: 'relative' }))(
//             $FieldLabeled({
//               label: 'Amount',
//               value: map((value) => {
//                 return value ? readableTokenAmount(tokenDescription, value) : ''
//               }, amount),
//               placeholder: 'Enter amount',
//               hint: map((balance) => {
//                 return `Wallet Balance: ${readableTokenAmountLabel(tokenDescription, balance)}`
//               }, walletTokenbBalance)
//             })({
//               change: changeAmountTether(
//                 map((val) => {
//                   return val ? parseFixed(tokenDescription.decimals, parseReadableNumber(val)) : 0n
//                 })
//               )
//             }),
//             $ButtonSecondary({
//               $container: $defaultMiniButtonSecondary(
//                 style({
//                   position: 'absolute',
//                   borderColor: colorAlpha(pallete.foreground, 0.35),
//                   right: '6px',
//                   top: '8px'
//                 })
//               ),
//               $content: $text('Max')
//             })({
//               click: clickMaxTether()
//             })
//           ),

//           $row(
//             $node(style({ flex: 1 }))(),

//             $IntermediateConnectButton({
//               $$display: map((wallet) => {
//                 return $ButtonSecondary({
//                   disabled: map(
//                     (params) => {
//                       if (params.max === 0n || params.amount === 0n) {
//                         return true
//                       }

//                       return false
//                     },
//                     combineState({ max: walletTokenbBalance, amount })
//                   ),
//                   $content: $text('Save')
//                 })({
//                   click: clickSaveTether()
//                 })
//               })
//             })({
//               changeWallet: changeWalletTether()
//             })
//           )
//         ),

//         {
//           changeAmount: sample(amount, clickSave),
//           changeWallet
//         }
//       ]
//     }
//   )
