import { ARBITRUM_ADDRESS } from '@puppet/sdk/const'
import { readableAddress } from '@puppet/sdk/core'
import { type IStream, just, map, merge, op, sampleMap, switchMap } from 'aelea/stream'
import { type IBehavior, state } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { $intermediatePromise } from '@/ui-components'
import { $card } from '../common/elements/$common.js'
import { $ConnectWalletCard } from '../components/$ConnectWalletCard.js'
import type { BalanceDraft, IDepositEditorDraft, IWithdrawEditorDraft } from '../components/portfolio/$DepositEditor.js'
import { $TokenBalanceEditor } from '../components/portfolio/$TokenBalanceEditor.js'
import wallet, { type IAccountState } from '../wallet/wallet.js'

function updateDraftList(changeList: BalanceDraft[], draft: BalanceDraft): BalanceDraft[] {
  const normalizedToken = draft.token.toLowerCase()
  const existingIndex = changeList.findIndex(ct => ct.token.toLowerCase() === normalizedToken)
  if (existingIndex !== -1) {
    const updated = [...changeList]
    updated[existingIndex] = draft
    return updated
  }
  return [...changeList, draft]
}

interface IWalletPage {
  accountQuery: IStream<Promise<IAccountState | null>>
  draftDepositTokenList: IStream<BalanceDraft[]>
}

export const $WalletPage = ({ accountQuery, draftDepositTokenList }: IWalletPage) =>
  component(
    (
      [changeDeposit, changeDepositTether]: IBehavior<IDepositEditorDraft>,
      [changeWithdraw, changeWithdrawTether]: IBehavior<IWithdrawEditorDraft>
    ) => {
      return [
        $intermediatePromise({
          $display: op(
            accountQuery,
            map(async query => {
              const account = await query

              if (!account) {
                return $column(
                  spacing.big,
                  style({ padding: '24px', maxWidth: '600px', margin: '0 auto', width: '100%' })
                )($ConnectWalletCard({}))
              }

              const subaccountAddress = account.subaccount?.getAddress()
              const hasSession = !!account.subaccount

              const walletBalance = state(
                switchMap(
                  () => wallet.getTokenBalance(ARBITRUM_ADDRESS.USDC, account.address, 42161, true),
                  just(null)
                ),
                0n
              )

              const $statusIndicator = (
                label: string,
                isActive: boolean,
                activeText: string,
                inactiveText: string,
                inactiveColor = pallete.foreground
              ) =>
                $row(spacing.small, style({ alignItems: 'center' }))(
                  $node(style({ color: pallete.foreground, fontSize: '0.75rem' }))($text(label)),
                  $row(spacing.small, style({ alignItems: 'center' }))(
                    $node(
                      style({
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isActive ? pallete.positive : inactiveColor
                      })
                    )(),
                    $node(style({ fontSize: '0.75rem', color: isActive ? pallete.positive : inactiveColor }))(
                      $text(isActive ? activeText : inactiveText)
                    )
                  )
                )

              // Only show "Not synced" if user has a subaccount but extension isn't connected
              // If no subaccount exists, user hasn't set up yet - don't show sync status
              const showSyncStatus = !!subaccountAddress
              const $statusRow = $row(spacing.default, style({ alignItems: 'center' }))(
                showSyncStatus
                  ? $statusIndicator('Extension', account.isSynced, 'Synced', 'Not synced', pallete.negative)
                  : $node(),
                hasSession ? $statusIndicator('Session', true, 'Active', '') : $node()
              )

              return $column(
                spacing.big,
                style({ padding: '24px', maxWidth: '600px', margin: '0 auto', width: '100%' })
              )(
                $card(spacing.default)(
                  $column(spacing.default)(
                    $row(style({ justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }))(
                      $column(spacing.small)(
                        $node(style({ color: pallete.foreground, fontSize: '0.75rem' }))($text('Subaccount')),
                        subaccountAddress
                          ? $node(style({ fontFamily: 'monospace' }))($text(readableAddress(subaccountAddress)))
                          : $node(style({ color: pallete.foreground }))(
                              $text(hasSession ? 'Initializing...' : 'Sign to initialize')
                            )
                      ),
                      $statusRow
                    ),
                    subaccountAddress
                      ? $TokenBalanceEditor({
                          token: ARBITRUM_ADDRESS.USDC,
                          balance: walletBalance,
                          account
                        })({
                          changeDeposit: changeDepositTether(),
                          changeWithdraw: changeWithdrawTether()
                        })
                      : $node()
                  )
                )
              )
            })
          )
        }),

        {
          changeDepositTokenList: merge(
            sampleMap(updateDraftList, draftDepositTokenList, changeDeposit),
            sampleMap(updateDraftList, draftDepositTokenList, changeWithdraw)
          )
        }
      ]
    }
  )
