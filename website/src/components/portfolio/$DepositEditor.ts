import { CROSS_CHAIN_TOKEN_MAP } from '@puppet-copy/middleware/const'
import {
  getMappedValueFallback,
  parseFixed,
  parseReadableNumber,
  readableTokenAmount,
  readableTokenAmountLabel
} from '@puppet-copy/middleware/core'
import { getTokenDescription } from '@puppet-copy/middleware/gmx'
import {
  combine,
  constant,
  empty,
  type IOps,
  type IStream,
  just,
  map,
  merge,
  op,
  sample,
  sampleMap,
  switchMap
} from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { state } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $ButtonToggle, $DropSelect, $defaulButtonToggleContainer, $FieldLabeled } from '@/ui-components'
import type { ValueOf } from '@/utils/types.js'
import { $tokenIconWithAmount } from '../../common/$common.js'
import wallet, { type IAccountState } from '../../wallet/wallet.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'

export const DEPOSIT_EDITOR_ACTION = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw'
} as const
export type DepositEditorAction = ValueOf<typeof DEPOSIT_EDITOR_ACTION>

export interface IDepositEditorDraft {
  action: DepositEditorAction
  token: Address
  amount: bigint
}

export const $DepositEditor = (config: {
  walletBalance: IStream<bigint>
  depositBalance: IStream<bigint>
  model: IStream<IDepositEditorDraft>
  token: Address
  account: IAccountState
  refreshBalances?: IStream<any>
  validation?: IOps<bigint, string | null>
}) =>
  component(
    (
      [clickMax, clickMaxTether]: IBehavior<PointerEvent>,
      [inputAmount, inputAmountTether]: IBehavior<string, bigint>,
      [changeDepositMode, changeDepositModeTether]: IBehavior<DepositEditorAction>,
      [clickSave, clickSaveTether]: IBehavior<PointerEvent>,
      [selectChain, selectChainTether]: IBehavior<number>
    ) => {
      const tokenDescription = getTokenDescription(config.token)

      const chainBalanceMap = op(
        config.refreshBalances ?? just(null),
        switchMap(async () => {
          const balances: Record<number, bigint> = {}

          await Promise.all(
            wallet.chainList.map(async chain => {
              const tokenAddress = getMappedValueFallback(
                CROSS_CHAIN_TOKEN_MAP[chain.id],
                tokenDescription.symbol,
                null
              )
              if (!tokenAddress) return
              balances[chain.id] = await wallet.getTokenBalance(tokenAddress, config.account.address, chain.id, true)
            })
          )
          return balances
        }),
        state
      )

      const chainSelection = state(selectChain, config.account.walletClient.chain.id)

      const selectedChainBalance = op(
        combine({ chainBalanceMap, chainSelection }),
        map(({ chainBalanceMap, chainSelection }) => chainBalanceMap[chainSelection] ?? 0n)
      )

      const action = merge(
        map(model => model.action, config.model),
        changeDepositMode
      )

      const maxAmount = op(
        combine({ action, selectedChainBalance, depositBalance: config.depositBalance }),
        map(({ action, selectedChainBalance, depositBalance }) =>
          action === DEPOSIT_EDITOR_ACTION.DEPOSIT ? selectedChainBalance : depositBalance
        )
      )

      const inputMaxAmount = sample(maxAmount, clickMax)

      const value = merge(
        inputMaxAmount,
        inputAmount,
        constant(0n, changeDepositMode),
        constant(0n, selectChain),
        map(model => model.amount, config.model)
      )

      const alert = merge(
        map(params => {
          if (params.action === DEPOSIT_EDITOR_ACTION.DEPOSIT && params.value > params.maxAmount) {
            return `Exceeds wallet balance of ${readableTokenAmountLabel(tokenDescription, params.maxAmount)}`
          }

          if (params.action === DEPOSIT_EDITOR_ACTION.WITHDRAW && params.value > params.maxAmount) {
            return `Exceeds deposit balance of ${readableTokenAmountLabel(tokenDescription, params.maxAmount)}`
          }

          if (params.value < 0n) {
            return 'Amount cannot be negative'
          }

          return null
        }, combine({ maxAmount, value, action })),
        config.validation ? config.validation(value) : empty
      )

      return [
        $column(spacing.default, style({ minWidth: '230px' }))(
          $ButtonToggle({
            $container: $defaulButtonToggleContainer(style({ placeSelf: 'center' })),
            optionList: [DEPOSIT_EDITOR_ACTION.DEPOSIT, DEPOSIT_EDITOR_ACTION.WITHDRAW],
            value: action,
            $$option: map(action => {
              const label = action === DEPOSIT_EDITOR_ACTION.DEPOSIT ? 'Deposit' : 'Withdraw'
              return $node(style({ width: '100px', textAlign: 'center' }))($text(label))
            })
          })({
            select: changeDepositModeTether()
          }),

          $row(
            spacing.small,
            style({ alignItems: 'center' })
          )(
            $DropSelect({
              value: chainSelection,
              optionList: wallet.chainList.map(chain => chain.id),
              label: 'Network',
              placeholder: 'Select',
              $$option: map(id => {
                const chain = getMappedValueFallback(wallet.chainMap, id, null)
                const balance = map(balances => balances[id] ?? 0n, chainBalanceMap)
                return $row(spacing.small, style({ alignItems: 'center', flex: 1, justifyContent: 'space-between' }))(
                  $node($text(chain?.name ?? String(id))),
                  $tokenIconWithAmount(tokenDescription, balance)
                )
              })
            })({
              select: selectChainTether()
            })
          ),

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
              disabled: map(
                params => params.alert !== null || params.model?.amount === params.value,
                combine({
                  alert,
                  value,
                  model: config.model
                })
              ),
              $content: $text('Save')
            })({
              click: clickSaveTether()
            })
          )
        ),

        {
          changeModel: merge(
            sampleMap(
              (params): IDepositEditorDraft => {
                return {
                  action: params.action,
                  token: config.token,
                  amount: params.value
                }
              },
              combine({
                value,
                action
              }),
              clickSave
            )
            // constant(0n, changeDepositMode)
          )
        }
      ]
    }
  )
