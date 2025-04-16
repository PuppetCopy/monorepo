import { Behavior, combineObject, isStream } from "@aelea/core"
import { $Node, $text, component, NodeComposeFn, style } from "@aelea/dom"
import { $row, layoutSheet } from "@aelea/ui-components"
import { empty, fromPromise, map, mergeArray, now, switchLatest } from "@most/core"
import { Stream } from "@most/types"
import { erc20Abi } from "abitype/abis"
import { promiseState, PromiseStatus, switchMap } from "@puppet/middleware/utils"
import { MAX_UINT256 } from "@puppet/middleware/const"
import { $alertPositiveTooltip, $alertTooltip, $intermediateTooltip, $txHashRef } from "@puppet/middleware/ui-components"
import * as viem from "viem"
import * as walletLink from "@puppet/middleware/wallet"
import { $defaultButtonPrimary } from "./$Button"
import { $ButtonCore } from "./$ButtonCore"

export interface ISpend {
  spender: viem.Address
  token: viem.Address
  amount?: Stream<bigint>
  $label?: $Node | string
}

interface IApproveSpend extends ISpend {
  walletClient: walletLink.IWalletClient
  disabled?: Stream<boolean>
  txQuery: Stream<walletLink.IWriteContractReturn>
  $content?: $Node
  $container?: NodeComposeFn<$Node>
}

export const $ApproveSpend = (config: IApproveSpend) => component((
  [approveTokenSpend, approveTokenSpendTether]: Behavior<PointerEvent, walletLink.IWriteContractReturn>,
) => {

  const {
    $content, amount, token,
    walletClient, spender,
    $label, disabled,
    $container = $row(style({ minWidth: 0 }))
  } = config


  const allowance = mergeArray([
    switchMap(async query => {
      return ((await query).events[0].args as any).value as bigint;
    }, config.txQuery),
    fromPromise(walletLink.readContract({
      provider: walletClient,
      address: token,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [walletClient.account.address, spender]
    }))
  ])

  const requestStatus = mergeArray([
    promiseState(config.txQuery),
  ])

  return [
    $container(
      switchMap(params => {
        if (params.allowance >= params.amount) {
          return $content || empty()
        }

        return $row(layoutSheet.spacingSmall, style({ minWidth: 0, alignItems: 'center', placeContent: 'flex-end' }))(
          switchLatest(map(status => {
            if (status === null) {
              return empty()
            }

            if (status.state === PromiseStatus.PENDING) {
              return $intermediateTooltip($text('Awaiting confirmation'))
            } else if (status.state === PromiseStatus.ERROR) {
              const err = status.error
              let message: string | undefined

              if (err instanceof viem.BaseError) {
                message = err.shortMessage || err.message
              }

              return $alertTooltip(
                $text(style({ whiteSpace: 'pre-wrap' }))(message || 'Transaction failed')
              )
            }

            return $alertPositiveTooltip(
              $row(layoutSheet.spacingSmall)(
                $text('Transaction confirmed'),
                $txHashRef(status.value.transactionReceipt.transactionHash)
              )
            )
          }, requestStatus)),
          $ButtonCore({
            disabled,
            $container: $defaultButtonPrimary(style({
              position: 'relative',
              overflow: 'hidden',
            })),
            $content: $label ? isStream($label) ? $label : $text($label) : $text('Approve spend'),
          })({
            click: approveTokenSpendTether(
              map(async () => {
                return walletLink.writeContract({
                  walletClient,
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
      }, combineObject({ allowance, amount: amount ?? now(MAX_UINT256) }))
    ),
    {
      approveTokenSpend
    }
  ]
})

