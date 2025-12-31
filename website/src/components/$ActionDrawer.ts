import { CROSS_CHAIN_TOKEN_MAP } from '@puppet/sdk/const'
import { getMappedValueFallback, readableTokenAmountLabel } from '@puppet/sdk/core'
import { getTokenDescription } from '@puppet/sdk/gmx'
import {
  combine,
  constant,
  empty,
  filter,
  type IStream,
  map,
  merge,
  op,
  sampleMap,
  skipRepeats,
  switchMap
} from 'aelea/stream'
import { type IBehavior, PromiseStatus, promiseState, state } from 'aelea/stream-extended'
import { $node, $text, component, type I$Node, style } from 'aelea/ui'
import { $column, $row, designSheet, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { waitForTransactionReceipt } from '@wagmi/core'
import { encodeFunctionData, erc20Abi, type Hex } from 'viem'
import { arbitrum, base, optimism, polygon, type Chain } from 'viem/chains'
import type { IDepositEditorDraft } from './portfolio/$DepositEditor.js'

const chainById: Record<number, Chain> = {
  [arbitrum.id]: arbitrum,
  [base.id]: base,
  [optimism.id]: optimism,
  [polygon.id]: polygon
}
import { $alertPositiveTooltip, $alertTooltip, $spinnerTooltip, $txHashRef, $xCross } from '@/ui-components'
import { $heading3 } from '../common/$text.js'
import { $card2 } from '../common/elements/$common.js'
import { fadeIn } from '../transitions/enter.js'
import wallet, { type IAccountState } from '../wallet/wallet.js'
import { $IntermediateConnectButton } from './$IntermediateConnectButton.js'
import { $ButtonCircular, $defaultButtonPrimary } from './form/$Button.js'
import { $ButtonCore } from './form/$ButtonCore.js'
import { BALANCE_ACTION, type BalanceDraft } from './portfolio/$DepositEditor.js'

interface IActionDrawer {
  accountQuery: IStream<Promise<IAccountState | null>>
  depositDrafts: IStream<BalanceDraft[]>
  title?: string
}

export const $ActionDrawer = ({ accountQuery, depositDrafts, title = 'Pending Actions' }: IActionDrawer) =>
  component(
    (
      [clickSubmit, clickSubmitTether]: IBehavior<PointerEvent>,
      [clickClose, clickCloseTether]: IBehavior<PointerEvent>,
      [clickRemove, clickRemoveTether]: IBehavior<PointerEvent, string>,
      [changeAccount, changeAccountTether]: IBehavior<Promise<IAccountState>>
    ) => {
      // Derive action drafts from deposit drafts (state() caches for late subscribers when drawer re-opens)
      const drafts = state(map(list => list.map(balanceDraftToAction), depositDrafts), [])

      // Submit: sample current state on click, execute transactions
      const submitQuery = sampleMap(
        async ({ acc: accPromise, deposits }) => {
          const acc = await accPromise
          if (!acc?.subaccount) throw new Error('No account or session')

          const subaccountAddress = acc.subaccount.getAddress()
          const ownerAddress = acc.address
          const txResults: { hash: Hex; chain: Chain }[] = []

          // Separate deposits (wallet → subaccount) from withdrawals (subaccount → wallet)
          const depositDrafts = deposits.filter(
            (d): d is IDepositEditorDraft => d.action === BALANCE_ACTION.DEPOSIT
          )
          const withdrawDrafts = deposits.filter(d => d.action === BALANCE_ACTION.WITHDRAW)

          // Execute deposits: transfer to subaccount on selected chain
          // Rhinestone's unified balance allows using funds from any chain
          for (const draft of depositDrafts) {
            const isArbitrum = draft.chainId === arbitrum.id

            // Get token address for the deposit chain
            const tokenDesc = getTokenDescription(draft.token)
            const tokenMap = CROSS_CHAIN_TOKEN_MAP[draft.chainId as keyof typeof CROSS_CHAIN_TOKEN_MAP]
            const tokenAddress = getMappedValueFallback(tokenMap, tokenDesc.symbol, null)
            if (!tokenAddress) throw new Error(`Token ${tokenDesc.symbol} not available on chain ${draft.chainId}`)

            // For non-Arbitrum chains: deposit on source chain, then bridge to Arbitrum
            if (!isArbitrum) {
              const depositChain = chainById[draft.chainId]
              if (!depositChain) throw new Error(`Unsupported chain: ${draft.chainId}`)

              // Step 1: Switch chain and transfer to subaccount on source chain
              if (acc.walletClient.chain?.id !== draft.chainId) {
                await acc.walletClient.switchChain({ id: draft.chainId })
              }

              const depositHash = await acc.walletClient.sendTransaction({
                to: tokenAddress,
                data: encodeFunctionData({
                  abi: erc20Abi,
                  functionName: 'transfer',
                  args: [subaccountAddress, draft.amount]
                }),
                account: acc.walletClient.account!,
                chain: depositChain
              })
              txResults.push({ hash: depositHash, chain: depositChain })

              // Wait for deposit tx to confirm before bridging
              await waitForTransactionReceipt(wallet.wagmi, {
                hash: depositHash,
                chainId: draft.chainId
              })

              // Step 2: Bridge from source chain to Arbitrum via subaccount
              const bridgeResult = await acc.subaccount.sendTransaction({
                sourceChains: [depositChain],
                targetChain: arbitrum,
                calls: [],
                tokenRequests: [
                  {
                    address: tokenAddress, // Use source chain token address
                    amount: draft.amount
                  }
                ]
              })
              const bridgeReceipt = await acc.subaccount.waitForExecution(bridgeResult)
              const bridgeTxHash =
                ('transactionHash' in bridgeReceipt && bridgeReceipt.transactionHash) ||
                ('hash' in bridgeReceipt && bridgeReceipt.hash)
              if (bridgeTxHash) {
                txResults.push({ hash: bridgeTxHash as Hex, chain: arbitrum })
              }
            } else {
              // Arbitrum: direct transfer
              const hash = await acc.walletClient.sendTransaction({
                to: tokenAddress,
                data: encodeFunctionData({
                  abi: erc20Abi,
                  functionName: 'transfer',
                  args: [subaccountAddress, draft.amount]
                }),
                account: acc.walletClient.account!
              })
              txResults.push({ hash, chain: arbitrum })
            }
          }

          // Execute withdrawals via subaccount on Arbitrum (7579 intent call)
          if (withdrawDrafts.length > 0) {
            const withdrawCalls = withdrawDrafts.map(draft => ({
              to: draft.token,
              data: encodeFunctionData({
                abi: erc20Abi,
                functionName: 'transfer',
                args: [ownerAddress, draft.amount]
              }),
              value: 0n
            }))

            const result = await acc.subaccount.sendTransaction({
              chain: arbitrum,
              calls: withdrawCalls,
              sponsored: true
            })
            const receipt = await acc.subaccount.waitForExecution(result)

            // Handle different receipt formats from Rhinestone SDK
            const txHash =
              ('transactionHash' in receipt && receipt.transactionHash) ||
              ('hash' in receipt && receipt.hash)
            if (txHash) {
              txResults.push({ hash: txHash as Hex, chain: arbitrum })
            }
          }

          return { txResults }
        },
        combine({ acc: accountQuery, deposits: depositDrafts }),
        clickSubmit
      )

      const txState = state(
        merge(
          promiseState(submitQuery),
          op(drafts, filter(list => list.length > 0), constant(null)) // Reset on new drafts
        ),
        null
      )
      const isLoading = state(map(s => s?.status === PromiseStatus.PENDING, txState), false)
      const txSuccess = op(
        txState,
        filter(s => s !== null && 'value' in s && s.value !== undefined),
        constant(null)
      )

      // Track if drawer is explicitly dismissed (reset when new drafts arrive)
      const isDismissed = state(
        merge(
          constant(true, clickClose), // X button dismisses
          constant(false, clickSubmit), // New submit re-opens
          op(drafts, filter(list => list.length > 0), constant(false)) // New drafts re-open
        ),
        false
      )

      // Show drawer when (drafts exist OR transaction active) AND not dismissed
      const hasContent = op(
        combine({ drafts, txState, isDismissed }),
        map(({ drafts, txState, isDismissed }) => !isDismissed && (drafts.length > 0 || txState !== null)),
        skipRepeats
      )

      // Status indicator
      const $status = switchMap(s => {
        if (!s) return empty
        if (s.status === PromiseStatus.PENDING) return $spinnerTooltip($text('Processing...'))
        if (s.status === PromiseStatus.ERROR) {
          const err = s.error
          const msg =
            err && typeof err === 'object' && 'shortMessage' in err
              ? String(err.shortMessage)
              : err instanceof Error
                ? err.message
                : 'Transaction failed'
          return $alertTooltip($text(msg))
        }
        if ('value' in s && s.value !== undefined) {
          const { txResults } = s.value
          return $alertPositiveTooltip(
            $text('Success'),
            $column(spacing.small)(...txResults.map(tx => $txHashRef(tx.hash, tx.chain)))
          )
        }
        return empty
      }, txState)

      // Draft item row with remove button
      const $draftItem = (draft: { id: string; $display: I$Node }) =>
        $row(spacing.default, style({ alignItems: 'center' }))(
          $ButtonCircular({
            $iconPath: $xCross,
            $container: $node(
              style({
                backgroundColor: pallete.horizon,
                borderRadius: '50%',
                padding: '4px',
                cursor: 'pointer'
              })
            )
          })({
            click: clickRemoveTether(constant(draft.id))
          }),
          draft.$display
        )

      const $drawerContent = $card2(
        style({
          border: `1px solid ${colorAlpha(pallete.foreground, 0.2)}`,
          padding: '12px 0',
          borderBottom: 'none',
          borderRadius: '20px 20px 0 0'
        })
      )(
        $column(spacing.default)(
          // Header
          $row(spacing.small, style({ alignItems: 'center', padding: '0 24px' }))(
            $heading3($text(title)),
            $node(style({ flex: 1 }))(),
            $ButtonCircular({ $iconPath: $xCross })({
              click: clickCloseTether()
            })
          ),

          // Draft list
          $column(designSheet.customScroll, style({ overflow: 'auto', maxHeight: '35vh', padding: '0 24px' }))(
            switchMap(
              list => (list.length === 0 ? empty : $column(spacing.small)(...list.map($draftItem))),
              drafts
            )
          ),

          // Footer with submit
          $row(spacing.small, style({ padding: '0 24px', alignItems: 'center' }))(
            $node(style({ flex: 1 }))(),
            $status,
            $IntermediateConnectButton({
              accountQuery,
              $$display: map(() =>
                $ButtonCore({
                  $container: $defaultButtonPrimary,
                  disabled: isLoading,
                  $content: $text('Submit')
                })({
                  click: clickSubmitTether()
                })
              )
            })({ changeAccount: changeAccountTether() })
          )
        )
      )

      return [
        switchMap(has => (has ? fadeIn($drawerContent) : empty), hasContent),

        {
          changeAccount,
          removeDraft: clickRemove,
          clearDrafts: merge(constant(null, clickClose), txSuccess)
        }
      ]
    }
  )

function balanceDraftToAction(draft: BalanceDraft) {
  const tokenDesc = getTokenDescription(draft.token)
  const actionLabel = draft.action === BALANCE_ACTION.DEPOSIT ? 'Deposit' : 'Withdraw'
  const amountLabel = readableTokenAmountLabel(tokenDesc, draft.amount)

  return {
    id: `${draft.action}-${draft.token}`,
    data: draft,
    $display: $row(spacing.small, style({ alignItems: 'center' }))(
      $node(
        style({
          backgroundColor: draft.action === BALANCE_ACTION.DEPOSIT ? pallete.positive : pallete.negative,
          color: pallete.background,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem'
        })
      )($text(actionLabel)),
      $text(amountLabel)
    )
  }
}

