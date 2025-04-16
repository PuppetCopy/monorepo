import { Behavior, O, combineArray, combineObject } from "@aelea/core"
import { $Branch, $Node, $text, INode, NodeComposeFn, attrBehavior, component, nodeEvent, style, styleBehavior } from "@aelea/dom"
import { $row, Control, layoutSheet } from "@aelea/ui-components"
import { constant, empty, map, mergeArray, multicast, now, startWith, switchLatest } from "@most/core"
import { Stream } from "@most/types"
import { PromiseStateError, PromiseStatus, getSafeMappedValue, promiseState } from "../utils/index.js"
import { EIP6963ProviderDetail } from "mipd"
import { $alertPositiveTooltip, $alertTooltip, $intermediateTooltip, $txHashRef } from "ui-components"
import * as viem from "viem"
import * as walletLink from "wallet"
import { $IntermediateConnectButton } from "../$ConnectWallet.js"
import { $iconCircular } from "../../common/elements/$common.js"
import { getContractErrorMessage } from "../../const/contractErrorMessage.js"
import { $ApproveSpend, ISpend } from "./$ApproveSpend.js"
import { $defaultButtonPrimary } from "./$Button.js"
import { $ButtonCore } from "./$ButtonCore.js"


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
    disabled = now(false),
    alert = now(null),
    txQuery, walletClientQuery, spend,
    $barContent,
    $container = $row,
    $submitContent,
  } = config

  const multicastTxQuery = multicast(promiseState(txQuery))
  const requestStatus = mergeArray([
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

          if (err instanceof viem.BaseError) {
            const revertError = err.walk(err => err instanceof viem.ContractFunctionRevertedError)
            if (revertError instanceof viem.ContractFunctionRevertedError) {

              if (revertError.data) {
                message = getContractErrorMessage(revertError.data)
              } else {
                message = err.shortMessage || err.message
              }
            }
          }



          return $alertTooltip(
            $text(style({ whiteSpace: 'pre-wrap' }))(
              message || getSafeMappedValue(err, 'shortMessage', 'message') || 'Transaction failed with an unknown error'
            )
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
