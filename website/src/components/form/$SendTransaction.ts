import { getMappedValueFallback } from '@puppet-copy/middleware/core'
import { constant, empty, map, op, start, switchMap } from 'aelea/stream'
import { type IBehavior, PromiseStatus, promiseState, state } from 'aelea/stream-extended'
import { $node, $text, component, type I$Slottable, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import { type Address, BaseError, type Chain, ContractFunctionRevertedError, type Hex } from 'viem'
import { arbitrum } from 'viem/chains'
import { $alertPositiveTooltip, $alertTooltip, $spinnerTooltip } from '@/ui-components'
import { getContractErrorMessage } from '../../const/contractErrorMessage.js'
import type { IAccountState } from '../../wallet/wallet.js'
import { $IntermediateConnectButton } from '../$ConnectWallet.js'
import { $defaultButtonPrimary } from './$Button.js'
import { $ButtonCore } from './$ButtonCore.js'

type Call = { to: Address; data: Hex; value?: bigint }

export interface ISendTransaction {
  getCalls: (account: IAccountState) => Call[] | Promise<Call[]>
  chain?: Chain
  $content?: I$Slottable
}

export const $SendTransaction = ({ getCalls, chain = arbitrum, $content = $text('Submit') }: ISendTransaction) =>
  component(([submit, submitTether]: IBehavior<PointerEvent, IAccountState>) => {
    const txQuery = op(
      submit,
      map(async account => {
        const calls = await getCalls(account)

        if (calls.length === 0) {
          throw new Error('No operations to execute')
        }

        const tx = await account.walletClient.sendCalls({
          account: account.address,
          chain,
          calls,
          experimental_fallback: true,
          forceAtomic: true
        })

        return account.walletClient.waitForCallsStatus({
          id: tx.id,
          throwOnFailure: true
        })
      })
    )

    const txState = op(start(null, promiseState(txQuery)), state)

    const $status = op(
      txState,
      switchMap(requestState => {
        if (!requestState) return empty

        if (requestState.status === PromiseStatus.PENDING) {
          return $spinnerTooltip($node($text('Awaiting confirmation')))
        }

        if (requestState.status === PromiseStatus.ERROR) {
          const err = requestState.error
          let message: string | undefined

          if (err instanceof BaseError) {
            const revertError = err.walk(e => e instanceof ContractFunctionRevertedError)
            if (revertError instanceof ContractFunctionRevertedError) {
              message = revertError.data ? getContractErrorMessage(revertError.data) : err.shortMessage || err.message
            }
          }

          const errorRecord = err && typeof err === 'object' ? (err as unknown as Record<string, unknown>) : {}
          const errorMessage = String(
            message || getMappedValueFallback(errorRecord, 'shortMessage', errorRecord.message) || 'Transaction failed'
          )

          return $alertTooltip($text(errorMessage))
        }

        if (requestState.value) {
          return $alertPositiveTooltip($text('Transaction executed'))
        }

        return $spinnerTooltip($node($text('Awaiting execution')))
      })
    )

    const isDisabled = map(s => s?.status === PromiseStatus.PENDING, txState)

    return [
      $row(spacing.small, style({ minWidth: 0, alignItems: 'center', placeContent: 'flex-end' }))(
        $status,
        $IntermediateConnectButton({
          $$display: map(wallet =>
            $ButtonCore({
              $container: $defaultButtonPrimary(style({ position: 'relative', overflow: 'hidden' })),
              disabled: isDisabled,
              $content
            })({
              click: submitTether(constant(wallet))
            })
          )
        })({})
      ),
      { submit }
    ]
  })
