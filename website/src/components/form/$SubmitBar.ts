import { constant, empty, map, mergeArray, multicast, now, startWith, switchLatest } from '@most/core'
import type { Stream } from '@most/types'
import { getSafeMappedValue, type PromiseStateError, PromiseStatus, promiseState } from '@puppet-copy/middleware/core'
import {
  $alertPositiveTooltip,
  $alertTooltip,
  $spinnerTooltip,
  $txHashRef
} from '@puppet-copy/middleware/ui-components'
import {
  $node,
  $text,
  combineArray,
  combineState,
  component,
  type I$Node,
  type I$Slottable,
  type IBehavior,
  type INodeCompose,
  style
} from 'aelea/core'
import { $row, type Control, spacing } from 'aelea/ui-components'
import type { EIP6963ProviderDetail } from 'mipd'
import { BaseError, ContractFunctionRevertedError, type GetCallsStatusReturnType } from 'viem'
import { getContractErrorMessage } from '../../const/contractErrorMessage.js'
import type { IWalletConnected, IWriteContractReturn } from '../../wallet/wallet.js'
import { $IntermediateConnectButton } from '../$ConnectWallet.js'
import { $ApproveSpend, type ISpend } from './$ApproveSpend.js'
import { $defaultButtonPrimary } from './$Button.js'
import { $ButtonCore } from './$ButtonCore.js'

export interface ISubmitBar {
  txQuery: Stream<Promise<GetCallsStatusReturnType>>
  alert?: Stream<string | null>
  $container?: INodeCompose
  $submitContent: I$Slottable
  $barContent?: I$Node
  disabled?: Stream<boolean>

  spend?: ISpend
}

export const $SubmitBar = (config: ISubmitBar) =>
  component(
    (
      [submit, submitTether]: IBehavior<PointerEvent, IWalletConnected>,
      [changeWallet, changeWalletTether]: IBehavior<EIP6963ProviderDetail>,
      [approveTokenSpend, approveTokenSpendTether]: IBehavior<IWriteContractReturn>
    ) => {
      const {
        disabled = now(false),
        alert = now(null),
        txQuery,
        spend,
        $barContent,
        $container = $row,
        $submitContent
      } = config

      const multicastTxQuery = multicast(promiseState(txQuery))
      const requestStatus = mergeArray([
        multicastTxQuery,
        map((a) => (a ? ({ status: PromiseStatus.ERROR, error: new Error(a) } as PromiseStateError) : null), alert)
      ])
      const isRequestPending = startWith(
        false,
        map((s) => s.status === PromiseStatus.PENDING, multicastTxQuery)
      )

      return [
        $container(spacing.small, style({ minWidth: 0, alignItems: 'center', placeContent: 'flex-end' }))(
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
                  const revertError = err.walk((err) => err instanceof ContractFunctionRevertedError)
                  if (revertError instanceof ContractFunctionRevertedError) {
                    if (revertError.data) {
                      message = getContractErrorMessage(revertError.data)
                    } else {
                      message = err.shortMessage || err.message
                    }
                  }
                }

                return $alertTooltip(
                  $node(
                    $text(
                      String(
                        message ||
                          getSafeMappedValue(err, 'shortMessage', 'message') ||
                          'Transaction failed with an unknown error'
                      )
                    )
                  )
                )
              }

              return status.value.status === 'success'
                ? $alertPositiveTooltip(
                    $row(spacing.small)(
                      $text('Transaction confirmed'),

                      ...(status.value.receipts?.map((receipt) =>
                        $txHashRef(receipt.transactionHash)
                          ? $node($text(receipt.transactionHash))
                          : $node($text(receipt.transactionHash || ''))
                      ) || [])
                    )
                  )
                : $alertTooltip($node($text('Transaction failed')))
            }, requestStatus)
          ),
          $barContent ?? empty(),
          $IntermediateConnectButton({
            $$display: map((wallet) => {
              const $primaryActionButton = $ButtonCore({
                $container: $defaultButtonPrimary(
                  style({
                    position: 'relative',
                    overflow: 'hidden'
                  })
                ),
                disabled: map((params) => {
                  return params.alert !== null || params.disabled || params.isRequestPending
                }, combineState({ disabled, isRequestPending, alert })),
                $content: $submitContent
              })({
                click: submitTether(constant(wallet))
              })

              if (spend) {
                const isSpendPending = startWith(
                  false,
                  map((s) => s.status === PromiseStatus.PENDING, promiseState(approveTokenSpend))
                )

                return $ApproveSpend({
                  ...spend,
                  wallet,
                  txQuery: approveTokenSpend,
                  $label: spend.$label,
                  $content: $primaryActionButton,
                  disabled: combineArray((params) => params.isSpendPending, combineState({ isSpendPending }))
                })({
                  approveTokenSpend: approveTokenSpendTether()
                })
              }
              return $primaryActionButton
            })
          })({
            changeWallet: changeWalletTether()
          })
        ),

        { submit, changeWallet }
      ]
    }
  )

interface IButtonCircular extends Control {
  $iconPath: I$Node<SVGPathElement>
}
