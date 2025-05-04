import { awaitPromises, constant, map, mergeArray, multicast, now, sample, snapshot, startWith } from '@most/core'
import type { Stream } from '@most/types'
import * as PUPPET from '@puppet/middleware/const'
import { CONTRACT } from '@puppet/middleware/const'
import { getTokenDescription } from '@puppet/middleware/gmx'
import { $ButtonToggle, $FieldLabeled, $defaulButtonToggleContainer } from '@puppet/middleware/ui-components'
import {
  PromiseStatus,
  combineState,
  getMappedValue,
  parseFixed,
  parseReadableNumber,
  promiseState,
  readableTokenAmount,
  readableTokenAmountLabel,
  switchMap,
} from '@puppet/middleware/utils'
import type * as walletLink from '@puppet/middleware/wallet'
import { type IBehavior, combineArray, combineState, replayLatest } from 'aelea/core'
import { $node, $text, component, style } from 'aelea/core'
import { $column, $row, layoutSheet } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { EIP6963ProviderDetail } from 'mipd'
import type * as viem from 'viem'
import { $IntermediateConnectButton } from '../$ConnectWallet.js'
import { readAddressTokenBalance } from '../../logic/traderRead.js'
import type { IComponentPageParams } from '../../pages/type.js'
import { $ApproveSpend } from '../form/$ApproveSpend.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'

export enum DepositEditorAction {
  DEPOSIT,
  WITHDRAW,
}

export interface IDepositEditorValue {
  amount: bigint
}

export interface IDepositEditorChange {
  token: viem.Address
  action: DepositEditorAction
  value: IDepositEditorValue
}

interface IDepositEditor extends IComponentPageParams {
  change: IDepositEditorChange
  depositBalanceQuery: Stream<Promise<bigint>>
}

export const $DepositEditor = (config: IDepositEditor) =>
  component(
    (
      [approveTokenSpend, approveTokenSpendTether]: Behavior<walletLink.IWriteContractReturn>,
      [changeWallet, changeWalletTether]: Behavior<EIP6963ProviderDetail>,

      [clickMax, clickMaxTether]: Behavior<any>,
      [changeAmount, changeAmountTether]: Behavior<string, bigint>,
      [changeDepositMode, changeDepositModeTether]: Behavior<DepositEditorAction>,

      [clickSave, clickSaveTether]: Behavior<PointerEvent>,
    ) => {
      const { walletClientQuery, change, depositBalanceQuery } = config

      const tokenDescription = getTokenDescription(change.token)
      const action = replayLatest(changeDepositMode, change.action)
      const max = switchMap((a) => {
        return a === DepositEditorAction.DEPOSIT
          ? switchMap(async (walletQuery) => {
              const wallet = await walletQuery

              if (wallet == null) return 0n

              return readAddressTokenBalance(wallet, change.token, wallet.account.address)
            }, walletClientQuery)
          : awaitPromises(depositBalanceQuery)
      }, action)

      const amount = replayLatest(
        multicast(mergeArray([clickMax, changeAmount, constant(0n, changeDepositMode)])),
        change.value.amount,
      )

      return [
        $column(spacing.default, style({ width: '330px' }))(
          $ButtonToggle({
            $container: $defaulButtonToggleContainer(style({ placeSelf: 'center' })),
            options: [DepositEditorAction.DEPOSIT, DepositEditorAction.WITHDRAW],
            selected: action,
            $$option: map((action) => {
              if (action === DepositEditorAction.DEPOSIT) {
                return $text(style({ width: '100px', textAlign: 'center' }))('Deposit')
              }

              return $text(style({ width: '100px', textAlign: 'center' }))('Withdraw')
            }),
          })({
            select: changeDepositModeTether(),
          }),

          $node(),

          $row(spacing.small, style({ position: 'relative' }))(
            $FieldLabeled({
              label: 'Amount',
              value: map(
                (value) => (value ? readableTokenAmount(tokenDescription, value) : ''),
                mergeArray([now(change.value.amount), clickMax, constant(0n, changeDepositMode)]),
              ),
              placeholder: 'Enter amount',
              hint: map((params) => {
                if (params.action === DepositEditorAction.DEPOSIT) {
                  return `Wallet Balance: ${readableTokenAmountLabel(tokenDescription, params.max)}`
                }

                return ` `
              }, combineState({ max, action })),
            })({
              change: changeAmountTether(
                map((val) => {
                  return val ? parseFixed(tokenDescription.decimals, parseReadableNumber(val)) : 0n
                }),
              ),
            }),
            $ButtonSecondary({
              $container: $defaultMiniButtonSecondary(
                style({
                  position: 'absolute',
                  borderColor: colorAlpha(pallete.foreground, 0.35),
                  right: '6px',
                  top: '8px',
                }),
              ),
              $content: $text('Max'),
            })({
              click: clickMaxTether(sample(max)),
            }),
          ),

          $row(
            $node(style({ flex: 1 }))(),

            $IntermediateConnectButton({
              walletClientQuery,
              $$display: map((wallet) => {
                if (wallet === null) {
                  return $ButtonSecondary({
                    disabled: now(true),
                    $content: $text('Save'),
                  })({})
                }

                const isSpendPending = startWith(
                  false,
                  map((s) => s.state === PromiseStatus.PENDING, promiseState(approveTokenSpend)),
                )

                return $ApproveSpend({
                  spender: CONTRACT[42161].TokenRouter.address,
                  token: change.token,
                  amount: map(
                    (params) => (params.action === DepositEditorAction.DEPOSIT ? params.amount : 0n),
                    combineState({ amount, action }),
                  ),
                  walletClient: wallet,
                  txQuery: approveTokenSpend,
                  $label: $text('Approve spend'),
                  $content: $ButtonSecondary({
                    disabled: map((params) => {
                      if (params.action === DepositEditorAction.DEPOSIT) {
                        if (params.max === 0n || params.amount === change.value.amount) {
                          return true
                        }
                      } else {
                        if (change.value.amount === 0n || params.amount === 0n) {
                          return true
                        }
                      }

                      return false
                    }, combineState({ max, amount, action })),
                    $content: $text('Save'),
                  })({
                    click: clickSaveTether(),
                  }),
                  disabled: combineArray((params) => params.isSpendPending, combineState({ isSpendPending })),
                })({
                  approveTokenSpend: approveTokenSpendTether(),
                })
              }),
            })({
              changeWallet: changeWalletTether(),
            }),
          ),
        ),

        {
          save: snapshot(
            (params): IDepositEditorChange => {
              return {
                token: change.token,
                action: params.action,
                value: {
                  amount: params.amount,
                },
              }
            },
            combineState({ amount, action }),
            clickSave,
          ),
          changeWallet,
        },
      ]
    },
  )
