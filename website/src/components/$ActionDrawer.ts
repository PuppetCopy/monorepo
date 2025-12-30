import { readableTokenAmountLabel } from '@puppet/sdk/core'
import { getTokenDescription } from '@puppet/sdk/gmx'
import {
  combine,
  constant,
  empty,
  filter,
  type IStream,
  map,
  merge,
  op,
  skipRepeatsWith,
  switchMap
} from 'aelea/stream'
import { type IBehavior, PromiseStatus, promiseState } from 'aelea/stream-extended'
import { $node, $text, component, type I$Node, style } from 'aelea/ui'
import { $column, $row, designSheet, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { type Address, encodeFunctionData, erc20Abi } from 'viem'
import { $alertPositiveTooltip, $alertTooltip, $spinnerTooltip, $xCross } from '@/ui-components'
import { $heading3 } from '../common/$text.js'
import { $card2 } from '../common/elements/$common.js'
import { fadeIn } from '../transitions/enter.js'
import type { IAccountState } from '../wallet/wallet.js'
import { $IntermediateConnectButton } from './$IntermediateConnectButton.js'
import { $ButtonCircular } from './form/$Button.js'
import { $ButtonCore } from './form/$ButtonCore.js'
import type { ContractCall } from './form/$WalletTransaction.js'
import { BALANCE_ACTION, type BalanceDraft } from './portfolio/$DepositEditor.js'

export interface IActionDraft<T = unknown> {
  id: string
  data: T
  $display: I$Node
}

interface IActionDrawer {
  accountQuery: IStream<Promise<IAccountState | null>>
  drafts: IStream<IActionDraft[]>
  depositDrafts: IStream<BalanceDraft[]>
  title?: string
}

export const $ActionDrawer = ({ accountQuery, drafts, depositDrafts, title = 'Pending Actions' }: IActionDrawer) =>
  component(
    (
      [clickSubmit, clickSubmitTether]: IBehavior<PointerEvent>,
      [clickClose, clickCloseTether]: IBehavior<PointerEvent>,
      [clickRemove, clickRemoveTether]: IBehavior<PointerEvent, string>,
      [changeAccount, changeAccountTether]: IBehavior<Promise<IAccountState>>
    ) => {
      const hasContent = op(
        drafts,
        map(list => list.length > 0),
        skipRepeatsWith((a, b) => a === b)
      )

      // Handle submit: execute deposit operations
      const submitQuery = op(
        clickSubmit,
        switchMap(() =>
          map(
            async ({ acc: accPromise, deposits }: { acc: Promise<IAccountState | null>; deposits: BalanceDraft[] }) => {
              const acc = await accPromise
              if (!acc?.subaccount) throw new Error('No account or session')

              const subaccountAddress = acc.subaccount.getAddress()
              const encodedDeposits = deposits.flatMap(draft => encodeBalanceDraft(draft, subaccountAddress))

              for (const call of encodedDeposits) {
                await acc.walletClient.sendTransaction({
                  to: call.to,
                  data: call.data,
                  value: call.value,
                  account: acc.walletClient.account!
                })
              }
            },
            combine({ acc: accountQuery, deposits: depositDrafts })
          )
        )
      )

      const txState = promiseState(submitQuery)
      const isLoading = map(s => s?.status === PromiseStatus.PENDING, txState)

      const txSuccess = op(
        txState,
        filter(
          (s): s is NonNullable<typeof s> =>
            s !== null && s.status !== PromiseStatus.PENDING && s.status !== PromiseStatus.ERROR
        ),
        map(() => null as null)
      )

      const $status = op(
        txState,
        switchMap(s => {
          if (!s) return empty
          if (s.status === PromiseStatus.PENDING) return $spinnerTooltip($text('Processing...'))
          if (s.status === PromiseStatus.ERROR) {
            const msg = s.error instanceof Error ? s.error.message : 'Transaction failed'
            return $alertTooltip($text(msg))
          }
          return $alertPositiveTooltip($text('Success'))
        })
      )

      const $drawerContent = $card2(
        style({
          border: `1px solid ${colorAlpha(pallete.foreground, 0.2)}`,
          padding: '12px 0',
          borderBottom: 'none',
          borderRadius: '20px 20px 0 0'
        })
      )(
        $column(spacing.default)(
          $row(spacing.small, style({ alignItems: 'center', padding: '0 24px' }))(
            $heading3($text(title)),
            $node(style({ flex: 1 }))(),
            $ButtonCircular({ $iconPath: $xCross })({
              click: clickCloseTether()
            })
          ),

          $column(
            designSheet.customScroll,
            style({ overflow: 'auto', maxHeight: '35vh', padding: '0 24px' })
          )(
            switchMap(list => {
              if (list.length === 0) return empty

              return $column(spacing.small)(
                ...list.map(draft =>
                  $row(spacing.default, style({ alignItems: 'center' }))(
                    $ButtonCircular({
                      $iconPath: $xCross,
                      $container: $node(
                        style({
                          backgroundColor: pallete.horizon,
                          borderRadius: '50%',
                          padding: '4px',
                          cursor: 'pointer'
                        })
                      )
                    })({
                      click: clickRemoveTether(constant(draft.id))
                    }),
                    draft.$display
                  )
                )
              )
            }, drafts)
          ),

          $row(spacing.small, style({ padding: '0 24px', alignItems: 'center' }))(
            $node(style({ flex: 1 }))(),
            $status,
            $IntermediateConnectButton({
              accountQuery,
              $$display: map(() =>
                $ButtonCore({
                  disabled: isLoading,
                  $content: $text('Submit')
                })({
                  click: clickSubmitTether()
                })
              )
            })({ changeAccount: changeAccountTether() })
          )
        )
      )

      return [
        op(
          hasContent,
          switchMap(has => (has ? fadeIn($drawerContent) : empty))
        ),

        {
          changeAccount,
          removeDraft: clickRemove,
          clearDrafts: merge(constant(null, clickClose), txSuccess)
        }
      ]
    }
  )

export function balanceDraftToAction(draft: BalanceDraft): IActionDraft<BalanceDraft> {
  const tokenDesc = getTokenDescription(draft.token)
  const actionLabel = draft.action === BALANCE_ACTION.DEPOSIT ? 'Deposit' : 'Withdraw'
  const amountLabel = readableTokenAmountLabel(tokenDesc, draft.amount)

  return {
    id: `${draft.action}-${draft.token}`,
    data: draft,
    $display: $row(spacing.small, style({ alignItems: 'center' }))(
      $node(
        style({
          backgroundColor: draft.action === BALANCE_ACTION.DEPOSIT ? pallete.positive : pallete.negative,
          color: pallete.background,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem'
        })
      )($text(actionLabel)),
      $text(amountLabel)
    )
  }
}

export function encodeBalanceDraft(draft: BalanceDraft, subaccountAddress: Address): ContractCall[] {
  if (draft.action === BALANCE_ACTION.DEPOSIT) {
    return [
      {
        to: draft.token,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [subaccountAddress, draft.amount]
        })
      }
    ]
  }
  return []
}
