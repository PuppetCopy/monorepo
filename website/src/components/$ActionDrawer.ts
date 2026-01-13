import { CROSS_CHAIN_TOKEN_MAP } from '@puppet/sdk/const'
import { getMappedValueFallback, readableTokenAmountLabel } from '@puppet/sdk/core'
import { getTokenDescription } from '@puppet/sdk/gmx'
import { waitForTransactionReceipt } from '@wagmi/core'
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
import { encodeFunctionData, erc20Abi, type Hex } from 'viem'
import { arbitrum, base, type Chain, optimism, polygon } from 'viem/chains'

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
import wallet, { getPortfolio, type ISmartAccountState } from '../wallet/wallet.js'
import { $ButtonCircular, $defaultButtonPrimary } from './form/$Button.js'
import { $ButtonCore } from './form/$ButtonCore.js'
import type { BalanceDraft } from './portfolio/$DepositEditor.js'

interface IActionDrawer {
  accountState: IStream<ISmartAccountState>
  depositDrafts: IStream<BalanceDraft[]>
  title?: string
}

export const $ActionDrawer = ({ accountState, depositDrafts, title = 'Pending Actions' }: IActionDrawer) =>
  component(
    (
      [clickSubmit, clickSubmitTether]: IBehavior<PointerEvent>,
      [clickClose, clickCloseTether]: IBehavior<PointerEvent>,
      [clickRemove, clickRemoveTether]: IBehavior<PointerEvent, string>
    ) => {
      // Derive action drafts from deposit drafts (state() caches for late subscribers when drawer re-opens)
      const drafts = state(map(list => list.map(balanceDraftToAction), depositDrafts))

      // Track account address to detect account switches
      const accountAddress = op(
        accountState,
        map(acc => {
          return acc?.address
        }),
        skipRepeats
      )

      // Pre-calculate intent when drafts change (fetches portfolio for sourceChains)
      const intentQuery = switchMap(
        async params => {
          const { drafts, acc } = params
          if (drafts.length === 0) return null

          const smartAccount = acc.subaccount
          const deposits = drafts.filter(d => d.amount > 0n)
          const withdrawals = drafts.filter(d => d.amount < 0n)

          // For withdrawals, pre-fetch portfolio to determine sourceChains
          const withdrawIntents = await Promise.all(
            withdrawals.map(async draft => {
              const tokenItem = acc.portfolio.find(item =>
                item.tokenChainBalance.some(tcb => tcb.tokenAddress.toLowerCase() === draft.token.toLowerCase())
              )
              const sourceChainIds = tokenItem?.tokenChainBalance
                .filter(tcb => tcb.balance.locked + tcb.balance.unlocked > 0n)
                .map(tcb => tcb.chainId) ?? [arbitrum.id]
              const sourceChains = sourceChainIds.map(id => chainById[id]).filter((c): c is Chain => c !== undefined)
              if (sourceChains.length === 0) sourceChains.push(arbitrum)

              return {
                draft,
                sourceChains,
                amount: -draft.amount
              }
            })
          )

          return {
            account: acc,
            smartAccount,
            deposits,
            withdrawIntents,
            hasWithdraw: withdrawals.length > 0
          }
        },
        combine({ drafts: depositDrafts, acc: accountState })
      )

      const intentState = state(intentQuery, null)

      // Submit using pre-calculated intent
      const submitQuery = sampleMap(
        async intent => {
          if (!intent) throw new Error('No intent calculated')

          const acc = intent.account
          const smartAccount = intent.smartAccount
          const txResults: { hash: Hex; chain: Chain }[] = []

          // Process deposits
          for (const draft of intent.deposits) {
            const tokenDesc = getTokenDescription(draft.token)
            const tokenMap = CROSS_CHAIN_TOKEN_MAP[draft.chainId as keyof typeof CROSS_CHAIN_TOKEN_MAP]
            const tokenAddress = getMappedValueFallback(tokenMap, tokenDesc.symbol, null)
            if (!tokenAddress) throw new Error(`Token ${tokenDesc.symbol} not available on chain ${draft.chainId}`)

            const chain = chainById[draft.chainId]
            if (!chain) throw new Error(`Unsupported chain: ${draft.chainId}`)

            const targetAddress = smartAccount.getAddress()

            // Deposit: transfer from EOA to smart account
            if (acc.walletClient.chain?.id !== draft.chainId) {
              await acc.walletClient.switchChain({ id: draft.chainId })
            }

            const hash = await acc.walletClient.sendTransaction({
              to: tokenAddress,
              data: encodeFunctionData({
                abi: erc20Abi,
                functionName: 'transfer',
                args: [targetAddress, draft.amount]
              }),
              account: acc.walletClient.account!,
              chain,
              sponsored: true
            })
            txResults.push({ hash, chain })

            await waitForTransactionReceipt(wallet.wagmi, { hash, chainId: draft.chainId })

            // Cross-chain: bridge to Arbitrum after transfer confirms
            if (draft.chainId !== arbitrum.id) {
              const result = await smartAccount.sendTransaction({
                sourceChains: [chain],
                targetChain: arbitrum,
                signers: { type: 'owner', kind: 'ecdsa', accounts: [acc.sessionSigner!] },
                calls: [],
                tokenRequests: [{ address: tokenAddress, amount: draft.amount }]
              })
              const receipt = await smartAccount.waitForExecution(result)
              const bridgeHash =
                ('transactionHash' in receipt && receipt.transactionHash) || ('hash' in receipt && receipt.hash)
              if (bridgeHash) txResults.push({ hash: bridgeHash as Hex, chain: arbitrum })
            }
          }

          // Process withdrawals using pre-calculated sourceChains
          for (const wi of intent.withdrawIntents) {
            const result = await smartAccount.sendTransaction({
              targetChain: arbitrum,
              sourceChains: wi.sourceChains,
              signers: { type: 'owner', kind: 'ecdsa', accounts: [acc.sessionSigner!] },
              calls: [
                {
                  to: wi.draft.token,
                  data: encodeFunctionData({
                    abi: erc20Abi,
                    functionName: 'transfer',
                    args: [acc.address, wi.amount]
                  }),
                  value: 0n
                }
              ],
              tokenRequests: [],
              // Sponsor gas and bridging fees to avoid leaving dust
              sponsored: { gas: true, bridging: true, swaps: false }
            })
            const receipt = await smartAccount.waitForExecution(result)
            const hash =
              ('transactionHash' in receipt && receipt.transactionHash) || ('hash' in receipt && receipt.hash)
            if (hash) txResults.push({ hash: hash as Hex, chain: arbitrum })
          }

          // Refresh portfolio after successful transactions
          await getPortfolio(smartAccount.getAddress(), true).catch(() => {})

          return { txResults }
        },
        intentState,
        clickSubmit
      )

      const txState = state(
        merge(
          promiseState(submitQuery),
          op(
            drafts,
            filter(list => list.length > 0),
            constant(null)
          ) // Reset on new drafts
        ),
        null
      )
      const isLoading = state(
        map(s => s?.status === PromiseStatus.PENDING, txState),
        false
      )
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
          op(
            drafts,
            filter(list => list.length > 0),
            constant(false)
          ) // New drafts re-open
        ),
        false
      )

      // Show drawer when (drafts exist OR transaction active) AND not dismissed
      const hasContent = op(
        combine({ drafts, txState, isDismissed }),
        map(({ drafts, txState, isDismissed }) => !isDismissed && (drafts.length > 0 || txState !== null)),
        skipRepeats
      )

      // Fetch intent cost using pre-calculated intent
      const costQuery = switchMap(async intent => {
        if (!intent) return null
        if (!intent.hasWithdraw) return { type: 'deposit' as const }

        try {
          // Build token requests from pre-calculated withdraw intents
          const tokenRequests = intent.withdrawIntents.map(wi => ({
            tokenAddress: wi.draft.token,
            amount: wi.amount
          }))

          const cost = await wallet.getIntentCost({
            destinationChainId: arbitrum.id,
            tokenRequests,
            account: {
              address: intent.smartAccount.getAddress(),
              accountType: 'ERC7579',
              setupOps: []
            },
            destinationExecutions: [],
            // topupCompact consolidates tokens; sponsorSettings requests bridging fee sponsorship
            options: {
              topupCompact: true,
              sponsorSettings: { gasSponsored: true, bridgeFeesSponsored: true, swapFeesSponsored: false }
            }
          } as unknown as Parameters<typeof wallet.getIntentCost>[0])

          return { type: 'withdraw' as const, cost }
        } catch (e) {
          console.error('Failed to fetch intent cost:', e)
          return { type: 'withdraw' as const, error: e }
        }
      }, intentState)

      const costState = state(costQuery, null)

      // Derive alert from cost state (null = no error, string = error message)
      const quoteAlert = map(cost => {
        if (!cost) return null
        if (cost.type === 'deposit') return null
        if ('error' in cost) {
          const err = cost.error
          return err instanceof Error ? err.message : 'Failed to get quote'
        }
        if ('cost' in cost) {
          const response = cost.cost as { hasFulfilledAll?: boolean; totalTokenShortfallInUSD?: number }
          if (response.hasFulfilledAll === false) {
            const shortfall = response.totalTokenShortfallInUSD
            return shortfall ? `Insufficient balance (~$${shortfall.toFixed(2)} short)` : 'Insufficient balance'
          }
        }
        return null
      }, costState)

      // Fee label based on intent cost quote
      const $feeLabel = switchMap(cost => {
        if (!cost) return $node(style({ fontSize: '0.75rem', color: pallete.foreground }))($text('...'))
        if (cost.type === 'deposit') {
          return $node(style({ fontSize: '0.75rem', color: pallete.positive }))($text('Sponsored'))
        }
        if ('error' in cost) {
          return $alertTooltip(
            $text(cost.error instanceof Error ? cost.error.message : 'Failed to get quote'),
            $text('Quote failed')
          )
        }
        if ('cost' in cost) {
          const response = cost.cost as {
            hasFulfilledAll?: boolean
            sponsorFee?: { relayer: number; protocol: number }
            totalTokenShortfallInUSD?: number
            tokenShortfall?: Array<{
              tokenSymbol: string
              destinationAmount: string
              fee: string
              tokenDecimals: number
            }>
          }
          // Check if quote is insufficient - show detailed tooltip
          if (response.hasFulfilledAll === false) {
            const shortfall = response.tokenShortfall?.[0]
            const shortfallUSD = response.totalTokenShortfallInUSD

            const $tooltipContent = $column(spacing.small)(
              $node(style({ fontWeight: '600', marginBottom: '4px' }))($text('Insufficient Balance')),
              shortfall
                ? $column(spacing.tiny)(
                    $row(spacing.small)(
                      $node(style({ color: pallete.foreground }))($text('Requested:')),
                      $text(
                        `${(Number(shortfall.destinationAmount) / 10 ** shortfall.tokenDecimals).toFixed(2)} ${shortfall.tokenSymbol}`
                      )
                    ),
                    $row(spacing.small)(
                      $node(style({ color: pallete.foreground }))($text('Bridge fee:')),
                      $text(
                        `${(Number(shortfall.fee) / 10 ** shortfall.tokenDecimals).toFixed(4)} ${shortfall.tokenSymbol}`
                      )
                    )
                  )
                : empty,
              shortfallUSD
                ? $node(style({ color: pallete.negative, marginTop: '4px' }))(
                    $text(`Short by ~$${shortfallUSD.toFixed(2)}`)
                  )
                : empty,
              $node(style({ color: pallete.foreground, fontSize: '0.7rem', marginTop: '8px' }))(
                $text('Cross-chain withdrawals have bridging fees deducted from the token amount.')
              )
            )

            return $alertTooltip($tooltipContent, $text('Insufficient'))
          }
          // Show sponsor fee
          if (response.sponsorFee) {
            const totalFee = response.sponsorFee.relayer + response.sponsorFee.protocol
            const feeText = totalFee > 0 ? `~$${totalFee.toFixed(4)} fee` : 'Free'
            return $node(style({ fontSize: '0.75rem', color: pallete.foreground }))($text(feeText))
          }
        }
        return $node(style({ fontSize: '0.75rem', color: pallete.foreground }))($text('Free'))
      }, costState)

      // Status indicator (switches with fee estimate)
      const $statusOrFee = switchMap(
        params => {
          const s = params.tx
          if (!s) return $feeLabel
          if (s.status === PromiseStatus.PENDING) return $spinnerTooltip($text('Processing...'))
          if (s.status === PromiseStatus.ERROR) {
            const err = s.error
            console.error(err)

            // Extract error message
            const errorMsg =
              err && typeof err === 'object' && 'shortMessage' in err
                ? String(err.shortMessage)
                : err instanceof Error
                  ? err.message
                  : 'Transaction failed'

            // Derive intent details from pre-calculated intent
            const intent = params.intent
            const action = intent?.hasWithdraw ? 'Withdraw' : 'Deposit'

            // Get source chains from pre-calculated intent (has actual portfolio-based sourceChains)
            const sourceChainNames = intent?.withdrawIntents.length
              ? [...new Set(intent.withdrawIntents.flatMap(wi => wi.sourceChains.map(c => c.name)))].join(', ')
              : intent?.deposits.length
                ? [...new Set(intent.deposits.map(d => chainById[d.chainId]?.name ?? `Chain ${d.chainId}`))].join(', ')
                : 'Unknown'

            // Build tooltip content with intent details
            const $tooltipContent = $column(spacing.small)(
              $row(spacing.small)($node(style({ color: pallete.foreground }))($text('Action:')), $text(action)),
              $row(spacing.small)($node(style({ color: pallete.foreground }))($text('From:')), $text(sourceChainNames)),
              $row(spacing.small)($node(style({ color: pallete.foreground }))($text('To:')), $text('Arbitrum')),
              $node(style({ borderTop: `1px solid ${pallete.horizon}`, paddingTop: '8px', marginTop: '4px' }))(
                $text(errorMsg)
              )
            )

            return $alertTooltip($tooltipContent, $text(`${action} failed`))
          }
          if ('value' in s && s.value !== undefined) {
            return $alertPositiveTooltip($text('Success'))
          }
          return $feeLabel
        },
        combine({ tx: txState, intent: intentState })
      )

      // Draft item row with remove button (visible on hover)
      const $draftItem = (draft: { id: string; $display: I$Node }) =>
        $row(
          spacing.default,
          style({
            alignItems: 'center',
            cursor: 'pointer'
          })
        )(
          $ButtonCircular({
            $iconPath: $xCross,
            $container: $node(
              style({
                backgroundColor: pallete.horizon,
                borderRadius: '50%',
                padding: '4px',
                cursor: 'pointer',
                opacity: '0.3',
                transition: 'opacity 0.15s ease'
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

          // Draft list OR success tx results
          $column(
            designSheet.customScroll,
            style({ overflow: 'auto', maxHeight: '35vh', padding: '0 24px' })
          )(
            switchMap(
              params => {
                // Show tx results on success
                if (params.tx && 'value' in params.tx && params.tx.value !== undefined) {
                  const { txResults } = params.tx.value
                  if (txResults.length > 0) {
                    return $column(spacing.small)(
                      ...txResults.map(tx =>
                        $row(spacing.small, style({ alignItems: 'center' }))(
                          $node(
                            style({
                              backgroundColor: pallete.positive,
                              color: pallete.background,
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem'
                            })
                          )($text(tx.chain.name)),
                          $txHashRef(tx.hash, tx.chain)
                        )
                      )
                    )
                  }
                  // Success but no tx hashes (shouldn't happen, but handle gracefully)
                  return $node(style({ color: pallete.positive, padding: '8px 0' }))(
                    $text('Transaction completed successfully')
                  )
                }
                // Show draft list otherwise
                return params.list.length === 0 ? empty : $column(spacing.small)(...params.list.map($draftItem))
              },
              combine({ list: drafts, tx: txState })
            )
          ),

          // Footer with submit
          $row(spacing.small, style({ padding: '0 24px', alignItems: 'center' }))(
            $node(style({ flex: 1 }))(),
            $statusOrFee,
            $ButtonCore({
              $container: $defaultButtonPrimary,
              disabled: map(
                params => {
                  // Disabled if: tx loading, has alert, or quote pending for withdrawals
                  if (params.loading) return true
                  if (params.alert !== null) return true
                  // For withdrawals, disable while quote is pending (cost is null but intent has withdrawals)
                  if (params.cost === null && params.intent?.hasWithdraw) return true
                  return false
                },
                combine({ loading: isLoading, alert: quoteAlert, cost: costState, intent: intentState })
              ),
              $content: $text('Submit')
            })({
              click: clickSubmitTether()
            })
          )
        )
      )

      return [
        switchMap(has => (has ? fadeIn($drawerContent) : empty), hasContent),

        {
          removeDraft: clickRemove,
          clearDrafts: merge(constant(null, clickClose), txSuccess, accountAddress)
        }
      ]
    }
  )

function balanceDraftToAction(draft: BalanceDraft) {
  const tokenDesc = getTokenDescription(draft.token)
  const isDeposit = draft.amount > 0n
  const actionLabel = isDeposit ? 'Deposit' : 'Withdraw'
  const absAmount = isDeposit ? draft.amount : -draft.amount
  const amountLabel = readableTokenAmountLabel(tokenDesc, absAmount)

  return {
    id: draft.token.toLowerCase(), // Key by token (single active smart account)
    data: draft,
    $display: $row(spacing.small, style({ alignItems: 'center' }))(
      $node(
        style({
          backgroundColor: isDeposit ? pallete.positive : pallete.negative,
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
