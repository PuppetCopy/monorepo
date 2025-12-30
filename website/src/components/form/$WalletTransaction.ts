import { getMappedValueFallback } from '@puppet/sdk/core'
import { awaitPromises, combine, empty, filter, type IStream, map, merge, op, sample, switchMap } from 'aelea/stream'
import { type IBehavior, PromiseStatus, promiseState, state } from 'aelea/stream-extended'
import { $node, $text, component, type I$Slottable, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { type Address, BaseError, type Chain, ContractFunctionRevertedError, type Hex } from 'viem'
import { arbitrum } from 'viem/chains'
import { $alertPositiveTooltip, $alertTooltip, $spinnerTooltip, $txHashRef } from '@/ui-components'
import { getContractErrorMessage } from '../../const/contractErrorMessage.js'
import type { IAccountState } from '../../wallet/wallet.js'
import { $IntermediateConnectButton } from '../$IntermediateConnectButton.js'
import { $defaultButtonPrimary } from './$Button.js'
import { $ButtonCore } from './$ButtonCore.js'

type TxResult = { hash: Hex; chain: Chain }

export type ContractCall = {
  to: Address
  data: Hex
  value?: bigint
}

export interface IWalletTransaction {
  accountQuery: IStream<Promise<IAccountState | null>>
  operations: IStream<ContractCall[]>
  chain?: Chain
  $content?: I$Slottable
}

export const $WalletTransaction = ({
  accountQuery,
  operations,
  chain = arbitrum,
  $content = $text('Submit')
}: IWalletTransaction) =>
  component(
    (
      [submit, submitTether]: IBehavior<PointerEvent>,
      [changeAccount, changeAccountTether]: IBehavior<Promise<IAccountState>>
    ) => {
      const accountState = op(
        merge(awaitPromises(changeAccount), awaitPromises(accountQuery)),
        filter((s): s is NonNullable<IAccountState> => s !== null)
      )

      const txQuery = op(
        sample(combine({ operations, accountState }), submit),
        map(async params => {
          if (params.operations.length === 0) {
            throw new Error('No operations to execute')
          }

          const { walletClient } = params.accountState

          for (const call of params.operations) {
            const hash = await walletClient.sendTransaction({
              to: call.to,
              data: call.data,
              value: call.value,
              chain,
              account: walletClient.account!
            })

            return { hash, chain } as TxResult
          }

          throw new Error('No operations executed')
        })
      )

      const txState = state(promiseState(txQuery), null)

      const $status = op(
        combine({ operations, txState }),
        switchMap(params => {
          if (params.txState !== null) {
            if (params.txState.status === PromiseStatus.PENDING) {
              return $spinnerTooltip($node($text('Awaiting confirmation')))
            }

            if (params.txState.status === PromiseStatus.ERROR) {
              const err = params.txState.error
              let message: string | undefined

              if (err instanceof BaseError) {
                const revertError = err.walk(e => e instanceof ContractFunctionRevertedError)
                if (revertError instanceof ContractFunctionRevertedError) {
                  message = revertError.data
                    ? getContractErrorMessage(revertError.data)
                    : err.shortMessage || err.message
                }
              }

              const errorRecord = err && typeof err === 'object' ? (err as unknown as Record<string, unknown>) : {}
              const errorMessage = String(
                message ||
                  getMappedValueFallback(errorRecord, 'shortMessage', errorRecord.message) ||
                  'Transaction failed'
              )

              return $alertTooltip($text(errorMessage))
            }

            if (params.txState.value) {
              const { hash, chain: txChain } = params.txState.value
              return $alertPositiveTooltip($text('Success'), $column(spacing.small)($txHashRef(hash, txChain)))
            }

            return $spinnerTooltip($node($text('Awaiting execution')))
          }

          return empty
        })
      )

      const isDisabled = map(s => s?.status === PromiseStatus.PENDING, txState)

      const success = op(
        txState,
        filter(s => s !== null && 'value' in s && s.value !== null),
        map(() => null as null)
      )

      return [
        $row(spacing.small, style({ minWidth: 0, alignItems: 'center', placeContent: 'flex-end' }))(
          $status,
          $IntermediateConnectButton({
            accountQuery,
            $$display: map(() =>
              $ButtonCore({
                $container: $defaultButtonPrimary(style({ position: 'relative', overflow: 'hidden' })),
                disabled: isDisabled,
                $content
              })({
                click: submitTether()
              })
            )
          })({
            changeAccount: changeAccountTether()
          })
        ),
        { success }
      ]
    }
  )
