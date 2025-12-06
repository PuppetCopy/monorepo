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
  switchLatest,
  switchMap
} from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { state } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $DropSelect, $defaultDropSelectContainer, $FieldLabeled } from '@/ui-components'
import type { ValueOf } from '@/utils/types.js'
import { $tokenIconWithAmount } from '../../common/$common.js'
import wallet, { type IAccountState } from '../../wallet/wallet.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'

export const BALANCE_ACTION = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw'
} as const

export type BalanceAction = ValueOf<typeof BALANCE_ACTION>

export interface IDepositEditorDraft {
  action: typeof BALANCE_ACTION.DEPOSIT
  token: Address
  amount: bigint
  chainId: number
}

export const $DepositEditor = (config: {
  walletBalance: IStream<bigint>
  depositBalance: IStream<bigint>
  model: IStream<IDepositEditorDraft>
  token: Address
  account: IAccountState
  validation?: IOps<bigint, string | null>
}) =>
  component(
    (
      [clickMax, clickMaxTether]: IBehavior<PointerEvent>,
      [inputAmount, inputAmountTether]: IBehavior<string, bigint>,
      [clickSave, clickSaveTether]: IBehavior<PointerEvent>,
      [selectChain, selectChainTether]: IBehavior<number>
    ) => {
      const tokenDescription = getTokenDescription(config.token)

      const chainBalanceMap = op(
        just(null),
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

      const chainSelection = state(selectChain, config.account.walletClient.chain?.id ?? wallet.chainList[0].id)

      const selectedChainBalance = op(
        combine({ chainBalanceMap, chainSelection }),
        map(({ chainBalanceMap, chainSelection }) => {
          return chainBalanceMap[chainSelection] ?? 0n
        }),
        state
      )

      const inputMaxAmount = sample(selectedChainBalance, clickMax)

      const value = merge(
        inputMaxAmount,
        inputAmount,
        constant(0n, selectChain),
        map(model => model.amount, config.model)
      )

      const alert = merge(
        map(params => {
          if (params.value > params.selectedChainBalance) {
            return `Exceeds wallet balance of ${readableTokenAmountLabel(tokenDescription, params.selectedChainBalance)}`
          }

          if (params.value < 0n) {
            return 'Amount cannot be negative'
          }

          return null
        }, combine({ selectedChainBalance, value })),
        config.validation ? config.validation(value) : empty
      )

      return [
        $column(spacing.default, style({ minWidth: '230px' }))(
          $DropSelect({
            value: chainSelection,
            optionList: wallet.chainList.map(chain => chain.id),
            label: map(id => {
              const chain = getMappedValueFallback(wallet.chainMap, id, null)
              return chain?.name ?? String(id)
            }, chainSelection),
            $container: $defaultDropSelectContainer(style({ flex: 1, justifyContent: 'space-between' })),
            $valueLabel: map(id => {
              const balance = map(balances => balances[id] ?? 0n, chainBalanceMap)
              return switchLatest(map(bal => $node($text(readableTokenAmountLabel(tokenDescription, bal))), balance))
            }),
            $$option: sampleMap((balances, id) => {
              const chain = getMappedValueFallback(wallet.chainMap, id, null)
              const balance = balances[id] ?? 0n
              return $row(spacing.small, style({ alignItems: 'center', flex: 1, justifyContent: 'space-between' }))(
                $node($text(chain?.name ?? String(id))),
                $tokenIconWithAmount(tokenDescription, balance)
              )
            }, chainBalanceMap)
          })({
            select: selectChainTether()
          }),

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
          changeModel: sampleMap(
            ({ value, chainId }): IDepositEditorDraft => {
              return {
                action: BALANCE_ACTION.DEPOSIT,
                token: config.token,
                amount: value,
                chainId
              }
            },
            combine({ value, chainId: chainSelection }),
            clickSave
          )
        }
      ]
    }
  )
