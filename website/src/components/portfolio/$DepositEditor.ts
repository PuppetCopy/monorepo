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
import wallet, { type ISignerAccountBase } from '../../wallet/wallet.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'

// Used internally for UI state (which popup to show)
export const BALANCE_ACTION = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw'
} as const

export type BalanceAction = ValueOf<typeof BALANCE_ACTION>

// Amount sign denotes action: positive = deposit, negative = withdraw, zero = no pending action
// Uses the active smartAccount from ISmartAccountState - no need to track account per draft
export interface BalanceDraft {
  token: Address
  amount: bigint // positive = deposit, negative = withdraw
  chainId: number
}

export interface IDepositEditor {
  model: IStream<BalanceDraft>
  token: Address
  walletAccount: ISignerAccountBase
}

export const $DepositEditor = ({ model, token, walletAccount }: IDepositEditor) =>
  component(
    (
      [clickMax, clickMaxTether]: IBehavior<PointerEvent>,
      [inputAmount, inputAmountTether]: IBehavior<string, bigint>,
      [clickSave, clickSaveTether]: IBehavior<PointerEvent>,
      [selectChain, selectChainTether]: IBehavior<number>
    ) => {
      const tokenDescription = getTokenDescription(token)
      const chainSelection = state(selectChain, walletAccount.walletClient.chain!.id)

      // Cache balance per chain - single RPC call shared across all usages
      const chainBalanceCache = new Map<number, Promise<bigint>>()
      const getChainBalance = (chainId: number): Promise<bigint> => {
        let cached = chainBalanceCache.get(chainId)
        if (!cached) {
          const tokenMap = CROSS_CHAIN_TOKEN_MAP[chainId as keyof typeof CROSS_CHAIN_TOKEN_MAP]
          const tokenAddress = getMappedValueFallback(tokenMap, tokenDescription.symbol, null)
          cached = tokenAddress
            ? wallet.getTokenBalance(tokenAddress, walletAccount.address, chainId, true)
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
        map(m => (m.amount > 0n ? m.amount : 0n), model) // Show deposit amount (positive) from model
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
                  if (!val) return 0n
                  const parsed = parseReadableNumber(val)
                  if (!parsed) return 0n
                  try {
                    return parseFixed(tokenDescription.decimals, parsed)
                  } catch {
                    return 0n
                  }
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
            ({ value, chainId }): BalanceDraft => ({
              token,
              amount: value, // Positive = deposit
              chainId
            }),
            combine({ value, chainId: chainSelection }),
            clickSave
          )
        }
      ]
    }
  )
