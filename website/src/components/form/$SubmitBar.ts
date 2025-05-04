import { constant, empty, map, mergeArray, multicast, now, startWith, switchLatest } from '@most/core'
import type { Stream } from '@most/types'
import {
  $alertPositiveTooltip,
  $alertTooltip,
  $intermediateTooltip,
  $txHashRef
} from '@puppet/middleware/ui-components'
import { getSafeMappedValue, type PromiseStateError, PromiseStatus, promiseState } from '@puppet/middleware/utils'
import type * as walletLink from '@puppet/middleware/wallet'
import {
  $node,
  $text,
  attrBehavior,
  combineArray,
  combineState,
  component,
  type I$Node,
  type IBehavior,
  type INode,
  type INodeCompose,
  nodeEvent,
  O,
  style,
  styleBehavior
} from 'aelea/core'
import { $row, type Control, layoutSheet, spacing } from 'aelea/ui-components'
import type { EIP6963ProviderDetail } from 'mipd'
import * as viem from 'viem'
import { $iconCircular } from '../../common/elements/$common.js'
import { getContractErrorMessage } from '../../const/contractErrorMessage.js'
import { $IntermediateConnectButton } from '../$ConnectWallet.js'
import { $ApproveSpend, type ISpend } from './$ApproveSpend.js'
import { $defaultButtonPrimary } from './$Button.js'
import { $ButtonCore } from './$ButtonCore.js'

export interface ISubmitBar {
  walletClientQuery: Stream<Promise<walletLink.IWalletClient | null>>
  txQuery: Stream<walletLink.IWriteContractReturn>
  alert?: Stream<string | null>
  $container?: INodeCompose
  $submitContent: I$Node
  $barContent?: I$Node
  disabled?: Stream<boolean>

  spend?: ISpend
}

export const $SubmitBar = (config: ISubmitBar) =>
  component(
    (
      [click, clickTether]: IBehavior<PointerEvent, walletLink.IWalletClient>,
      [changeWallet, changeWalletTether]: IBehavior<EIP6963ProviderDetail>,
      [approveTokenSpend, approveTokenSpendTether]: IBehavior<walletLink.IWriteContractReturn>
    ) => {
      const {
        disabled = now(false),
        alert = now(null),
        txQuery,
        walletClientQuery,
        spend,
        $barContent,
        $container = $row,
        $submitContent
      } = config

      const multicastTxQuery = multicast(promiseState(txQuery))
      const requestStatus = mergeArray([
        multicastTxQuery,
        map((a) => (a ? ({ state: PromiseStatus.ERROR, error: new Error(a) } as PromiseStateError) : null), alert)
      ])
      const isRequestPending = startWith(
        false,
        map((s) => s.state === PromiseStatus.PENDING, multicastTxQuery)
      )

      return [
        $container(spacing.small, style({ minWidth: 0, alignItems: 'center', placeContent: 'flex-end' }))(
          switchLatest(
            map((status) => {
              if (status === null) {
                return empty()
              }

              if (status.state === PromiseStatus.PENDING) {
                return $intermediateTooltip($node($text('Awaiting confirmation')))
              }
              if (status.state === PromiseStatus.ERROR) {
                const err = status.error
                let message: string | undefined

                if (err instanceof viem.BaseError) {
                  const revertError = err.walk((err) => err instanceof viem.ContractFunctionRevertedError)
                  if (revertError instanceof viem.ContractFunctionRevertedError) {
                    if (revertError.data) {
                      message = getContractErrorMessage(revertError.data)
                    } else {
                      message = err.shortMessage || err.message
                    }
                  }
                }

                return $alertTooltip(
                  $text(
                    String(
                      message ||
                        getSafeMappedValue(err, 'shortMessage', 'message') ||
                        'Transaction failed with an unknown error'
                    )
                  )
                )
              }

              return $alertPositiveTooltip(
                $row(spacing.small)(
                  $text('Transaction confirmed'),
                  $txHashRef(status.value.transactionReceipt.transactionHash)
                )
              )
            }, requestStatus)
          ),
          $barContent ?? empty(),
          $IntermediateConnectButton({
            $$display: map((wallet) => {
              const $btn = $ButtonCore({
                $container: $defaultButtonPrimary(
                  style({
                    position: 'relative',
                    overflow: 'hidden'
                  })
                ),
                disabled: combineArray((params) => {
                  return params.alert !== null || params.disabled || params.isRequestPending
                }, combineState({ disabled, isRequestPending, alert })),
                $content: $row(style({ position: 'relative' })($submitContent))
              })({
                click: clickTether(constant(wallet))
              })

              if (spend) {
                const isSpendPending = startWith(
                  false,
                  map((s) => s.state === PromiseStatus.PENDING, promiseState(approveTokenSpend))
                )

                return $ApproveSpend({
                  ...spend,
                  txQuery: approveTokenSpend,
                  $label: spend.$label,
                  $content: $btn,
                  disabled: combineArray((params) => params.isSpendPending, combineState({ isSpendPending }))
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
    }
  )

interface IButtonCircular extends Control {
  $iconPath: II$Node<SVGPathElement>
}

export const $ButtonCircular = ({ $iconPath, disabled = empty() }: IButtonCircular) =>
  component(([click, clickTether]: IBehavior<INode, PointerEvent>) => {
    const ops = O(
      clickTether(nodeEvent('pointerup')),
      styleBehavior(map((isDisabled) => (isDisabled ? { opacity: 0.4, pointerEvents: 'none' } : null), disabled)),
      attrBehavior(
        map((d) => {
          return { disabled: d ? 'true' : null }
        }, disabled)
      )
    )

    return [
      ops($row(style({ cursor: 'pointer', padding: '6px', margin: '-6px' }))($iconCircular($iconPath))),

      {
        click
      }
    ]
  })
