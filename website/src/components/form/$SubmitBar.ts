import { getMappedValueFallback } from '@puppet-copy/middleware/core'
import { combine, constant, empty, type IStream, just, map, merge, start, switchLatest } from 'aelea/stream'
import { type IBehavior, multicast, type PromiseStateError, PromiseStatus, promiseState } from 'aelea/stream-extended'
import { $node, $text, component, type I$Node, type I$Slottable, type INodeCompose, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import type { EIP6963ProviderDetail } from 'mipd'
import { BaseError, ContractFunctionRevertedError, type GetCallsStatusReturnType } from 'viem'
import { $alertPositiveTooltip, $alertTooltip, $spinnerTooltip, $txHashRef } from '@/ui-components'
import { getContractErrorMessage } from '../../const/contractErrorMessage.js'
import type { IAccountState } from '../../wallet/wallet.js'
import { $IntermediateConnectButton } from '../$ConnectWallet.js'
import { $defaultButtonPrimary } from './$Button.js'
import { $ButtonCore } from './$ButtonCore.js'

export interface ISubmitBar {
  txQuery: IStream<Promise<GetCallsStatusReturnType>>
  alert?: IStream<string | null>
  $container?: INodeCompose
  $submitContent: I$Slottable
  $barContent?: I$Node
  disabled?: IStream<boolean>
}

export const $SubmitBar = (config: ISubmitBar) =>
  component(
    (
      [submit, submitTether]: IBehavior<PointerEvent, IAccountState>,
      [changeWallet, changeWalletTether]: IBehavior<EIP6963ProviderDetail>
    ) => {
      const {
        disabled = just(false),
        alert = just(null),
        txQuery,
        $barContent,
        $container = $row,
        $submitContent
      } = config

      const multicastTxQuery = multicast(promiseState(txQuery))
      const requestStatus = merge(
        multicastTxQuery,
        map(a => (a ? ({ status: PromiseStatus.ERROR, error: new Error(a) } as PromiseStateError) : null), alert)
      )
      const isRequestPending = start(
        false,
        map(s => s.status === PromiseStatus.PENDING, multicastTxQuery)
      )

      return [
        $container(spacing.small, style({ minWidth: 0, alignItems: 'center', placeContent: 'flex-end' }))(
          switchLatest(
            map(status => {
              if (status === null) {
                return empty
              }

              if (status.status === PromiseStatus.PENDING) {
                return $spinnerTooltip($node($text('Awaiting confirmation')))
              }
              if (status.status === PromiseStatus.ERROR) {
                const err = status.error
                let message: string | undefined

                if (err instanceof BaseError) {
                  const revertError = err.walk(err => err instanceof ContractFunctionRevertedError)
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
                          getMappedValueFallback(err, 'shortMessage', (err as any).message) ||
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

                      ...(status.value.receipts?.map(receipt =>
                        $txHashRef(receipt.transactionHash)
                          ? $node($text(receipt.transactionHash))
                          : $node($text(receipt.transactionHash || ''))
                      ) || [])
                    )
                  )
                : $alertTooltip($node($text('Transaction failed')))
            }, requestStatus)
          ),
          $barContent ?? empty,
          $IntermediateConnectButton({
            $$display: map(wallet => {
              return $ButtonCore({
                $container: $defaultButtonPrimary(
                  style({
                    position: 'relative',
                    overflow: 'hidden'
                  })
                ),
                disabled: map(params => {
                  return params.alert !== null || params.disabled || params.isRequestPending
                }, combine({ disabled, isRequestPending, alert })),
                $content: $submitContent
              })({
                click: submitTether(constant(wallet))
              })
            })
          })({
            changeWallet: changeWalletTether()
          })
        ),

        { submit, changeWallet }
      ]
    }
  )
