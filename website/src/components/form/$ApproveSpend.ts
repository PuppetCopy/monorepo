import { empty, fromPromise, map, mergeArray, now, switchLatest } from '@most/core'
import type { Stream } from '@most/types'
import { MAX_UINT256 } from '@puppet-copy/middleware/const'
import {
  $alertPositiveTooltip,
  $alertTooltip,
  $spinnerTooltip,
  $txHashRef
} from '@puppet-copy/middleware/ui-components'
import { PromiseStatus, promiseState } from '@puppet-copy/middleware/utils'
import { BaseError } from 'abitype'
import { erc20Abi } from 'abitype/abis'
import {
  $node,
  $text,
  combineState,
  component,
  type I$Node,
  type I$Slottable,
  type IBehavior,
  type INodeCompose,
  style,
  switchMap
} from 'aelea/core'
import { $row, spacing } from 'aelea/ui-components'
import type { Address } from 'viem/accounts'
import { type IWalletConnected, type IWriteContractReturn, wallet } from '../../wallet/wallet'
import { $defaultButtonPrimary } from './$Button'
import { $ButtonCore } from './$ButtonCore'

export interface ISpend {
  spender: Address
  token: Address
  amount?: Stream<bigint>
  $label?: I$Slottable
}

interface IApproveSpend extends ISpend {
  wallet: IWalletConnected
  disabled?: Stream<boolean>
  txQuery: Stream<IWriteContractReturn>
  $content?: I$Node
  $container?: INodeCompose
}

export const $ApproveSpend = (config: IApproveSpend) =>
  component(([approveTokenSpend, approveTokenSpendTether]: IBehavior<PointerEvent, IWriteContractReturn>) => {
    const { $content, amount, token, spender, $label, disabled, $container = $row(style({ minWidth: 0 })) } = config

    const allowance = mergeArray([
      switchMap(async (query) => {
        return ((await query).events[0].args as any).value as bigint
      }, config.txQuery),
      fromPromise(
        wallet.read({
          address: token,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [config.wallet.address, spender]
        })
      )
    ])

    const requestStatus = promiseState(config.txQuery)

    return [
      $container(
        switchMap(
          (params) => {
            if (params.allowance >= params.amount) {
              return $content || empty()
            }

            return $row(spacing.small, style({ minWidth: 0, alignItems: 'center', placeContent: 'flex-end' }))(
              switchLatest(
                map((status) => {
                  if (status === null) {
                    return empty()
                  }

                  if (status.status === PromiseStatus.PENDING) {
                    return $spinnerTooltip($node($text('Awaiting confirmation')))
                  }
                  if (status.status === PromiseStatus.ERROR) {
                    const err = status.error
                    let message: string | undefined

                    if (err instanceof BaseError) {
                      message = err.shortMessage || err.message
                    }

                    return $alertTooltip($node($text(message || 'Transaction failed')))
                  }

                  return $alertPositiveTooltip(
                    $row(spacing.small)(
                      $text('Transaction confirmed'),
                      $txHashRef(status.value.transactionReceipt.transactionHash)
                    )
                  )
                }, requestStatus)
              ),
              $ButtonCore({
                disabled,
                $container: $defaultButtonPrimary(
                  style({
                    position: 'relative',
                    overflow: 'hidden'
                  })
                ),
                $content: $label ?? $text('Approve spend')
              })({
                click: approveTokenSpendTether(
                  map(async () => {
                    return wallet.write({
                      address: token,
                      abi: erc20Abi,
                      eventName: 'Approval',
                      functionName: 'approve',
                      args: [spender, params.amount] as const
                    })
                  })
                )
              })
            )
          },
          combineState({ allowance, amount: amount ?? now(MAX_UINT256) })
        )
      ),
      {
        approveTokenSpend
      }
    ]
  })
