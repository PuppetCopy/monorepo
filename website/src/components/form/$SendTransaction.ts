import { getMappedValueFallback } from '@puppet-copy/middleware/core'
import { constant, empty, map, op, start, switchMap } from 'aelea/stream'
import { type IBehavior, PromiseStatus, promiseState, state } from 'aelea/stream-extended'
import { $node, $text, component, type I$Slottable, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import {
  type Abi,
  type Address,
  BaseError,
  type Chain,
  type ContractFunctionArgs,
  ContractFunctionRevertedError,
  type ContractFunctionName,
  encodeFunctionData,
  type Hex
} from 'viem'
import { arbitrum } from 'viem/chains'
import { $alertPositiveTooltip, $alertTooltip, $spinnerTooltip } from '@/ui-components'
import { getContractErrorMessage } from '../../const/contractErrorMessage.js'
import type { IAccountState } from '../../wallet/wallet.js'
import { $IntermediateConnectButton } from '../$ConnectWallet.js'
import { $defaultButtonPrimary } from './$Button.js'
import { $ButtonCore } from './$ButtonCore.js'

export type ContractCall<
  TAbi extends Abi = Abi,
  TFunctionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'> = ContractFunctionName<
    TAbi,
    'nonpayable' | 'payable'
  >
> = {
  to: Address
  abi: TAbi
  functionName: TFunctionName
  args: ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', TFunctionName>
  value?: bigint
}

type RawCall = { to: Address; data: Hex; value?: bigint }

function encodeCall(call: ContractCall): RawCall {
  return {
    to: call.to,
    data: encodeFunctionData({
      abi: call.abi,
      functionName: call.functionName,
      args: call.args
    }),
    value: call.value
  }
}

async function checkSendCallsSupport(walletClient: IAccountState['walletClient'], address: Address): Promise<boolean> {
  try {
    if (typeof walletClient.getCapabilities === 'function') {
      const capabilities = await walletClient.getCapabilities({ account: address })
      return Object.values(capabilities).some(chainCaps => chainCaps?.atomicBatch?.supported === true)
    }
  } catch {
    // Wallet doesn't support capability checking
  }
  return false
}

async function executeSequentially(
  walletClient: IAccountState['walletClient'],
  address: Address,
  chain: Chain,
  calls: RawCall[]
): Promise<Hex> {
  let lastHash: Hex | undefined

  for (const call of calls) {
    const hash = await walletClient.sendTransaction({
      account: address,
      chain,
      to: call.to,
      data: call.data,
      value: call.value
    })

    // Wait for each transaction to be mined before sending the next
    const publicClient = walletClient.extend(() => ({}))
    await (publicClient as any).waitForTransactionReceipt({ hash })

    lastHash = hash
  }

  if (!lastHash) throw new Error('No transactions executed')
  return lastHash
}

export interface ISendTransaction {
  getOperations: (account: IAccountState) => ContractCall[] | Promise<ContractCall[]>
  chain?: Chain
  $content?: I$Slottable
}

export const $SendTransaction = ({
  getOperations,
  chain = arbitrum,
  $content = $text('Submit')
}: ISendTransaction) =>
  component(([submit, submitTether]: IBehavior<PointerEvent, IAccountState>) => {
    const txQuery = op(
      submit,
      map(async account => {
        const operations = await getOperations(account)

        if (operations.length === 0) {
          throw new Error('No operations to execute')
        }

        const calls = operations.map(encodeCall)
        const supportsSendCalls = await checkSendCallsSupport(account.walletClient, account.address)

        if (supportsSendCalls) {
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
        }

        // Fallback: execute transactions sequentially
        return executeSequentially(account.walletClient, account.address, chain, calls)
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
