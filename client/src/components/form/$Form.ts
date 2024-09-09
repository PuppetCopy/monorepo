import { Behavior, O, combineArray, combineObject, isStream } from "@aelea/core"
import { $Branch, $Node, $text, INode, NodeComposeFn, attrBehavior, component, nodeEvent, style, styleBehavior } from "@aelea/dom"
import { $row, Control, layoutSheet } from "@aelea/ui-components"
import { constant, empty, fromPromise, map, mergeArray, multicast, now, startWith, switchLatest } from "@most/core"
import { Stream } from "@most/types"
import { MAX_UINT256, PromiseStateError, PromiseStatus, promiseState, switchMap } from "common-utils"
import { EIP6963ProviderDetail } from "mipd"
import { $alertPositiveTooltip, $alertTooltip, $intermediateTooltip, $txHashRef } from "ui-components"
import * as viem from "viem"
import * as walletLink from "wallet"
import { $IntermediateConnectButton } from "../$ConnectWallet"
import { $iconCircular } from "../../common/elements/$common.js"
import { $defaultButtonPrimary, $Submit } from "./$Button"
import { $ButtonCore } from "./$ButtonCore"
import { erc20Abi } from "abitype/abis"

interface ISpend {
  spender: viem.Address
  token: viem.Address
  amount?: Stream<bigint>
  $label?: $Node | string
}


export interface ISubmitBar {
  walletClientQuery: Stream<Promise<walletLink.IWalletClient | null>>
  txQuery: Stream<walletLink.IWriteContractReturn>
  alert?: Stream<string | null>
  $container?: NodeComposeFn<$Node>,
  $submitContent: $Node
  $barContent?: $Node
  disabled?: Stream<boolean>

  spend?: ISpend
}

export const $SubmitBar = (config: ISubmitBar) => component((
  [click, clickTether]: Behavior<PointerEvent, walletLink.IWalletClient>,
  [changeWallet, changeWalletTether]: Behavior<EIP6963ProviderDetail>,
  [approveTokenSpend, approveTokenSpendTether]: Behavior<walletLink.IWriteContractReturn>,
) => {
  const {
    $barContent,
    disabled = now(false),
    alert = now(null),
    $container = $row,
    txQuery, $submitContent, walletClientQuery, spend
  } = config

  const multicastTxQuery = multicast(promiseState(txQuery))
  const requestStatus = mergeArray([
    promiseState(approveTokenSpend),
    multicastTxQuery,
    map(a => a ? { state: PromiseStatus.ERROR, error: new Error(a) } as PromiseStateError : null, alert)
  ])
  const isRequestPending = startWith(false, map(s => s.state === PromiseStatus.PENDING, multicastTxQuery))

  return [
    $container(layoutSheet.spacingSmall, style({ minWidth: 0, alignItems: 'center', placeContent: 'flex-end' }))(
      switchLatest(map(status => {
        if (status === null) {
          return empty()
        }

        if (status.state === PromiseStatus.PENDING) {
          return $intermediateTooltip($text('Awaiting confirmation'))
        } else if (status.state === PromiseStatus.ERROR) {
          const err = status.error
          let message: string | undefined

          if (err instanceof viem.TransactionExecutionError) {
            message = err.shortMessage || err.message
          }

          if (err instanceof viem.ContractFunctionExecutionError && err.cause instanceof viem.ContractFunctionRevertedError) {
            message = err.cause.reason || err.cause.message
          }

          return $alertTooltip(
            $text(style({ whiteSpace: 'pre-wrap' }))(message || err.message || 'Transaction failed')
          )
        }

        return $alertPositiveTooltip(
          $row(layoutSheet.spacingSmall)(
            $text('Transaction confirmed'),
            $txHashRef(status.value.transactionReceipt.transactionHash)
          )
        )
      }, requestStatus)),
      $barContent ?? empty(),
      $IntermediateConnectButton({
        walletClientQuery,
        $$display: map(wallet => {
          const $btn = $ButtonCore({
            $container: $defaultButtonPrimary(style({
              position: 'relative',
              overflow: 'hidden',
            })),
            disabled: combineArray(params => {
              return params.alert !== null || params.disabled || params.isRequestPending
            }, combineObject({ disabled, isRequestPending, alert })),
            $content: $row(style({ position: 'relative' })($submitContent))
          })({
            click: clickTether(
              constant(wallet)
            )
          })

          if (spend) {
            const isSpendPending = startWith(false, map(s => s.state === PromiseStatus.PENDING, promiseState(approveTokenSpend)))


            return $ApproveSpend({
              ...spend,
              txQuery: approveTokenSpend,
              $label: spend.$label,
              walletClient: wallet,
              $content: $btn,
              disabled: combineArray(params => params.isSpendPending, combineObject({ isSpendPending })),
            })({
              approveTokenSpend: approveTokenSpendTether()
            })
          }
          return $btn
        })
      })({
        changeWallet: changeWalletTether()
      })
    ),

    { click, changeWallet }
  ]
})


interface IApproveSpend extends ISpend {
  walletClient: walletLink.IWalletClient
  $content?: $Node
  disabled?: Stream<boolean>
  txQuery: Stream<walletLink.IWriteContractReturn>
}

export const $ApproveSpend = (config: IApproveSpend) => component((
  [approveTokenSpend, approveTokenSpendTether]: Behavior<PointerEvent, walletLink.IWriteContractReturn>,
) => {

  const { $content, amount, token, walletClient, spender, $label, disabled } = config


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

  return [
    $row(
      switchMap(params => {
        if (params.allowance >= params.amount) {
          return $content || empty()
        }


        return $ButtonCore({
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
      }, combineObject({ allowance, amount: amount ?? now(MAX_UINT256) }))
    ),
    {
      approveTokenSpend
    }
  ]
})



interface IButtonCircular extends Control {
  $iconPath: $Branch<SVGPathElement>
}

export const $ButtonCircular = ({ $iconPath, disabled = empty() }: IButtonCircular) => component((
  [click, clickTether]: Behavior<INode, PointerEvent>
) => {


  const ops = O(
    clickTether(
      nodeEvent('pointerup')
    ),
    styleBehavior(
      map(isDisabled => isDisabled ? { opacity: .4, pointerEvents: 'none' } : null, disabled)
    ),
    attrBehavior(
      map(d => {
        return { disabled: d ? 'true' : null }
      }, disabled)
    ),
  )


  return [
    ops(
      $row(style({ cursor: 'pointer', padding: '6px', margin: '-6px' }))(
        $iconCircular($iconPath)
      )
    ),

    {
      click
    }
  ]
})
