import { getMappedValueFallback } from '@puppet/sdk/core'
import { awaitPromises, combine, empty, filter, type IStream, map, merge, op, sample, switchMap } from 'aelea/stream'
import { type IBehavior, PromiseStatus, promiseState, state } from 'aelea/stream-extended'
import { $node, $text, component, type I$Slottable, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { type Address, BaseError, type Chain, ContractFunctionRevertedError, type Hex } from 'viem'
import { arbitrum } from 'viem/chains'
import {
  $alertIntermediateTooltip,
  $alertPositiveTooltip,
  $alertTooltip,
  $spinnerTooltip,
  $txHashRef
} from '@/ui-components'
import { getContractErrorMessage } from '../../const/contractErrorMessage.js'
import wallet, { type IAccountState } from '../../wallet/wallet.js'
import { $IntermediateConnectButton } from '../$ConnectWallet.js'
import { $defaultButtonPrimary } from './$Button.js'
import { $ButtonCore } from './$ButtonCore.js'

type TxResult = { hashes: Hex[]; chain: Chain }

export type ContractCall = {
  to: Address
  data: Hex
  value?: bigint
}

export interface ISendTransaction {
  operations: IStream<ContractCall[]>
  chain?: Chain
  $content?: I$Slottable
}

export const $SendTransaction = ({
  operations, //
  chain = arbitrum,
  $content = $text('Submit')
}: ISendTransaction) =>
  component(
    (
      [submit, submitTether]: IBehavior<PointerEvent>, //
      [accountChange, accountChangeTether]: IBehavior<IAccountState>
    ) => {
      const account = op(
        merge(accountChange, awaitPromises(wallet.account)),
        filter((a): a is IAccountState => a !== null)
      )

      // Check if wallet supports batched transactions (null = not connected yet)
      const supportsBatching = state(
        op(
          account,
          map(async params => {
            try {
              if (typeof params.client.getCapabilities === 'function') {
                const capabilities = await params.client.getCapabilities({ account: params.address })
                return Object.values(capabilities).some(chainCaps => chainCaps?.atomicBatch?.supported === true)
              }
            } catch {
              // Wallet doesn't support capability checking
            }
            return false
          }),
          awaitPromises
        ),
        null as boolean | null
      )

      const txQuery = op(
        sample(combine({ operations, account }), submit),
        map(async params => {
          if (params.operations.length === 0) {
            throw new Error('No operations to execute')
          }

          const calls = params.operations

          const result = await params.account.client.sendCalls({
            account: params.account.address,
            chain,
            calls,
            experimental_fallback: true
          })

          const status = await params.account.client.waitForCallsStatus({
            id: result.id,
            throwOnFailure: true
          })

          // Extract hashes from all receipts
          const hashes = status.receipts?.map(r => r.transactionHash).filter((h): h is Hex => !!h) ?? []
          if (hashes.length === 0) {
            throw new Error('No transaction hashes in receipts')
          }

          return { hashes, chain } as TxResult
        })
      )

      const txState = state(promiseState(txQuery), null)

      const $status = op(
        combine({ supportsBatching, operations, txState }),
        switchMap(params => {
          // Show tx status when there's an active transaction
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
              const { hashes, chain: txChain } = params.txState.value
              return $alertPositiveTooltip(
                $text('Success'),
                $column(spacing.small)(...hashes.map(hash => $txHashRef(hash, txChain)))
              )
            }

            return $spinnerTooltip($node($text('Awaiting execution')))
          }

          // Show EOA warning when wallet doesn't support batching
          // null = not connected yet, true = supports batching, false = EOA
          if (params.supportsBatching === false && params.operations.length > 1) {
            return $alertIntermediateTooltip(
              $text(`${params.operations.length} signatures required`),
              $text(
                'Your wallet does not support batched transactions yet. You will need to sign each transaction separately.'
              )
            )
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
            connect: accountChangeTether()
          })
        ),
        { account, success }
      ]
    }
  )
