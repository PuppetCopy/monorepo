import { getMappedValueFallback } from '@puppet/sdk/core'
import { awaitPromises, combine, empty, filter, type IStream, map, merge, op, sample, switchMap } from 'aelea/stream'
import { type IBehavior, PromiseStatus, promiseState, state } from 'aelea/stream-extended'
import { $node, $text, component, type I$Slottable, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { type Address, BaseError, type Chain, ContractFunctionRevertedError, type Hex } from 'viem'
import { arbitrum } from 'viem/chains'
import { $alertPositiveTooltip, $alertTooltip, $spinnerTooltip, $txHashRef } from '@/ui-components'
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
      [accountChange, accountChangeTether]: IBehavior<Address[]>
    ) => {
      // Get subaccount with rhinestone account for transaction execution
      const subaccountState = op(
        merge(
          map(() => null, accountChange), // trigger refresh on connect
          awaitPromises(wallet.account)
        ),
        filter((s): s is NonNullable<IAccountState> => s !== null)
      )

      const txQuery = op(
        sample(combine({ operations, subaccountState }), submit),
        map(async params => {
          if (params.operations.length === 0) {
            throw new Error('No operations to execute')
          }

          // Convert ContractCall[] to Rhinestone calls format
          const calls = params.operations.map(op => ({
            to: op.to,
            data: op.data,
            value: op.value ?? 0n
          }))

          // Execute through rhinestone subaccount
          const result = await params.subaccountState.rhinestoneAccount.sendTransaction({
            chain,
            calls,
            // signers: {
            //   type: 'owner',
            //   kind: 'ecdsa',
            //   // The signer you've created before
            //   accounts: [params.subaccountState.signer]
            // }
          })

          // Wait for execution to complete
          const receipt = await params.subaccountState.rhinestoneAccount.waitForExecution(result)

          // Extract transaction hash from result
          const hashes: Hex[] = []
          if ('transactionHash' in receipt && receipt.transactionHash) {
            hashes.push(receipt.transactionHash as Hex)
          }
          if (hashes.length === 0 && 'receipt' in receipt && (receipt as any).receipt?.transactionHash) {
            hashes.push((receipt as any).receipt.transactionHash)
          }

          return { hashes, chain } as TxResult
        })
      )

      const txState = state(promiseState(txQuery), null)

      const $status = op(
        combine({ operations, txState }),
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
        { subaccountState, success }
      ]
    }
  )
