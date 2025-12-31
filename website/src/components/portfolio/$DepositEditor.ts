import { CROSS_CHAIN_TOKEN_MAP } from '@puppet/sdk/const'
import {
  getMappedValue,
  getMappedValueFallback,
  parseFixed,
  parseReadableNumber,
  readableTokenAmount,
  readableTokenAmountLabel
} from '@puppet/sdk/core'
import { getTokenDescription } from '@puppet/sdk/gmx'
import { combine, constant, type IStream, map, merge, op, sample, sampleMap, switchMap } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { multicast, state } from 'aelea/stream-extended'
import { $element, $node, $text, attr, component, style } from 'aelea/ui'
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

export interface IWithdrawEditorDraft {
  action: typeof BALANCE_ACTION.WITHDRAW
  token: Address
  amount: bigint
}

export type BalanceDraft = IDepositEditorDraft | IWithdrawEditorDraft

export interface IDepositEditor {
  model: IStream<IDepositEditorDraft>
  token: Address
  account: IAccountState
}

export const $DepositEditor = ({ model, token, account }: IDepositEditor) =>
  component(
    (
      [clickMax, clickMaxTether]: IBehavior<PointerEvent>,
      [inputAmount, inputAmountTether]: IBehavior<string, bigint>,
      [clickSave, clickSaveTether]: IBehavior<PointerEvent>,
      [selectChain, selectChainTether]: IBehavior<number>
    ) => {
      const tokenDescription = getTokenDescription(token)
      const chainSelection = state(selectChain, account.walletClient.chain!.id)

      // Cache balance per chain - single RPC call shared across all usages
      const chainBalanceCache = new Map<number, Promise<bigint>>()
      const getChainBalance = (chainId: number): Promise<bigint> => {
        let cached = chainBalanceCache.get(chainId)
        if (!cached) {
          const tokenMap = CROSS_CHAIN_TOKEN_MAP[chainId as keyof typeof CROSS_CHAIN_TOKEN_MAP]
          const tokenAddress = getMappedValueFallback(tokenMap, tokenDescription.symbol, null)
          cached = tokenAddress
            ? wallet.getTokenBalance(tokenAddress, account.address, chainId, true)
            : Promise.resolve(0n)
          chainBalanceCache.set(chainId, cached)
        }
        return cached
      }

      // Multicast selected chain balance to share across subscribers
      const selectedChainBalance = multicast(switchMap(getChainBalance, chainSelection))

      const value: IStream<bigint> = merge(
        sample(selectedChainBalance, clickMax),
        inputAmount,
        constant(0n, selectChain),
        map(m => (m.action === BALANCE_ACTION.DEPOSIT ? m.amount : 0n), model)
      )

      const alert = op(
        combine({ balance: selectedChainBalance, value }),
        map(params => {
          if (params.value > params.balance) {
            return `Exceeds wallet balance of ${readableTokenAmountLabel(tokenDescription, params.balance)}`
          }
          if (params.value < 0n) {
            return 'Amount cannot be negative'
          }
          return null
        })
      )

      return [
        $column(spacing.default, style({ minWidth: '230px' }))(
          $DropSelect({
            value: chainSelection,
            optionList: wallet.chainList.map(chain => chain.id),
            $label: map(
              id =>
                $row(spacing.small, style({ alignItems: 'center' }))(
                  $element('img')(attr({ src: `/assets/chain/${id}.svg`, width: '16', height: '16' }))(),
                  $node($text(getMappedValue(wallet.chainMap, id).name))
                ),
              chainSelection
            ),
            $container: $defaultDropSelectContainer(style({ flex: 1, justifyContent: 'space-between' })),
            $valueLabel: () =>
              map(balance => $node($text(readableTokenAmountLabel(tokenDescription, balance))), selectedChainBalance),
            $$option: switchMap(async id => {
              const chain = getMappedValue(wallet.chainMap, id)
              const balance = await getChainBalance(id)
              return $row(spacing.small, style({ alignItems: 'center', flex: 1, justifyContent: 'space-between' }))(
                $row(spacing.small, style({ alignItems: 'center' }))(
                  $element('img')(attr({ src: `/assets/chain/${id}.svg`, width: '20', height: '20' }))(),
                  $node($text(chain.name))
                ),
                $tokenIconWithAmount(tokenDescription, balance)
              )
            })
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
                  model
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
                token,
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
