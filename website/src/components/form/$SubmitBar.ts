import { getMappedValueFallback } from '@puppet-copy/middleware/core'
import { combine, constant, empty, type IStream, just, map, op, start, switchMap } from 'aelea/stream'
import { type IBehavior, PromiseStatus, promiseState, state } from 'aelea/stream-extended'
import { $node, $text, component, type I$Node, type I$Slottable, type INodeCompose, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import { BaseError, ContractFunctionRevertedError } from 'viem'
import { $alertPositiveTooltip, $alertTooltip, $spinnerTooltip, $txHashRef } from '@/ui-components'
import { getContractErrorMessage } from '../../const/contractErrorMessage.js'
import type { IAccountState } from '../../wallet/wallet.js'
import { $IntermediateConnectButton } from '../$ConnectWallet.js'
import { $defaultButtonPrimary } from './$Button.js'
import { $ButtonCore } from './$ButtonCore.js'

export interface TransactionResult {
  type: 'intent'
  id: bigint
  sourceChains?: number[]
  targetChain: number
}

export interface ISubmitBar {
  txQuery: IStream<Promise<TransactionResult>>
  alert?: IStream<string | null>
  $container?: INodeCompose
  $submitContent: I$Slottable
  $barContent?: I$Node
  disabled?: IStream<boolean>
}

export const $SubmitBar = (config: ISubmitBar) =>
  component(([submit, submitTether]: IBehavior<PointerEvent, IAccountState>) => {
    const {
      disabled = just(false),
      alert = just(null),
      txQuery,
      $barContent,
      $container = $row,
      $submitContent
    } = config

    const submitState = op(
      combine({
        multicastTxQuery: start(null, promiseState(txQuery)),
        alert,
        disabled
      }),
      state
    )

    const $alert = switchMap(params => {
      if (params.alert !== null) {
        return $alertTooltip($node($text(params.alert)))
      }

      const requestState = params.multicastTxQuery as {
        status: PromiseStatus
        value: TransactionResult
        error: unknown
      } | null

      if (requestState === null) return empty

      if (requestState.status === PromiseStatus.PENDING) {
        return $spinnerTooltip($node($text('Awaiting confirmation')))
      }

      if (requestState.status === PromiseStatus.ERROR) {
        const err = requestState.error
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

        const errorRecord =
          err && typeof err === 'object' ? (err as Record<PropertyKey, any>) : ({} as Record<PropertyKey, any>)

        return $alertTooltip(
          $node(
            $text(
              String(
                message ||
                  getMappedValueFallback(errorRecord, 'shortMessage', (err as any).message) ||
                  'Transaction failed with an unknown error'
              )
            )
          )
        )
      }

      const value = requestState.value as TransactionResult | null
      if (value?.id) {
        return $alertPositiveTooltip(
          $row(spacing.small)(
            $text('Intent submitted'), //
            $txHashRef(value.id.toString())
          )
        )
      }

      return $spinnerTooltip($node($text('Awaiting execution')))
    }, submitState)

    return [
      $container(spacing.small, style({ minWidth: 0, alignItems: 'center', placeContent: 'flex-end' }))(
        $alert,
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
                return params.alert || params.disabled || params.multicastTxQuery?.status === PromiseStatus.PENDING
              }, submitState),
              $content: $submitContent
            })({
              click: submitTether(constant(wallet))
            })
          })
        })({})
      ),

      { submit }
    ]
  })
