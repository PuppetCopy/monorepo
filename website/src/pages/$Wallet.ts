import { ARBITRUM_ADDRESS } from '@puppet/sdk/const'
import { getDebankProfileUrl, readableAddress } from '@puppet/sdk/core'
import { awaitPromises, filter, type IStream, just, map, merge, op, sampleMap, switchMap } from 'aelea/stream'
import { type IBehavior, state } from 'aelea/stream-extended'
import { $node, $text, attr, component, type I$Node, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { $anchor, $defaultTooltipDropContainer, $external, $icon, $infoTooltipLabel, $intermediatePromise, $Tooltip } from '@/ui-components'
import { $jazzicon } from '../common/$avatar.js'
import { $card } from '../common/elements/$common.js'
import { $ConnectWalletCard } from '../components/$ConnectWalletCard.js'
import { $ButtonPrimary } from '../components/form/$Button.js'
import { BALANCE_ACTION, type BalanceDraft, type IDepositEditorDraft, type IWithdrawEditorDraft } from '../components/portfolio/$DepositEditor.js'
import { $TokenBalanceEditor } from '../components/portfolio/$TokenBalanceEditor.js'
import wallet, { type IAccountState, signAndEnableSession } from '../wallet/wallet.js'

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
      [changeWithdraw, changeWithdrawTether]: IBehavior<IWithdrawEditorDraft>,
      [changeAccount, changeAccountTether]: IBehavior<PointerEvent, Promise<IAccountState | null>>
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

              // Refresh balance on mount and when drafts are cleared (tx success)
              const draftsCleared = op(draftDepositTokenList, filter(d => d.length === 0))
              const walletBalance = state(
                switchMap(
                  () => wallet.getTokenBalance(ARBITRUM_ADDRESS.USDC, account.subaccount!.getAddress(), 42161, true),
                  merge(just(null), draftsCleared)
                ),
                0n
              )

              const $statusIndicator = ({
                isActive,
                text,
                inactiveColor = pallete.foreground,
                label,
                $tooltip
              }: {
                isActive: boolean
                text?: string
                inactiveColor?: string
                label: string
                $tooltip?: I$Node
              }) => {
                const $indicator = $row(spacing.small, style({ alignItems: 'center' }))(
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
                    text
                      ? $node(style({ fontSize: '0.75rem', color: isActive ? pallete.positive : inactiveColor }))(
                          $text(text)
                        )
                      : $node()
                  )
                )
                return $tooltip
                  ? $Tooltip({
                      $anchor: $indicator,
                      $content: $tooltip,
                      $dropContainer: $defaultTooltipDropContainer(style({ minWidth: '200px', maxWidth: '280px' }))
                    })({})
                  : $indicator
              }

              // Only show "Not synced" if user has a subaccount but extension isn't connected
              // If no subaccount exists, user hasn't set up yet - don't show sync status
              const showSyncStatus = !!subaccountAddress
              const $extensionStatus = account.isSynced
                ? $statusIndicator({ isActive: true, label: 'Extension' })
                : $statusIndicator({
                    isActive: false,
                    inactiveColor: pallete.negative,
                    label: 'Extension',
                    $tooltip: $column(spacing.small)(
                      $node(style({ fontWeight: '600' }))($text('Extension not connected')),
                      $node(style({ color: pallete.foreground, fontSize: '0.85rem' }))(
                        $text('Install the Puppet extension to enable one-click trading.')
                      )
                    )
                  })
              const $statusRow = $row(spacing.default, style({ alignItems: 'center' }))(
                showSyncStatus ? $extensionStatus : $node(),
                hasSession ? $statusIndicator({ isActive: true, label: 'Session' }) : $node()
              )

              const $setupGuide = $column(spacing.default)(
                $node(style({ fontSize: '1rem', fontWeight: '600' }))($text('Enable Trading Session')),
                $node(style({ color: pallete.foreground, lineHeight: '1.5' }))(
                  $text('Sign a message to create your subaccount and enable one-click trading. No gas required.')
                ),
                $ButtonPrimary({
                  $content: $text('Enable')
                })({
                  click: changeAccountTether(
                    map(() => signAndEnableSession(account)),
                    awaitPromises,
                    map(x => Promise.resolve(x))
                  )
                })
              )

              return $column(
                spacing.big,
                style({ padding: '24px', maxWidth: '600px', margin: '0 auto', width: '100%' })
              )(
                $card(spacing.default)(
                  subaccountAddress
                    ? $column(spacing.default)(
                        $row(style({ justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }))(
                          $column(spacing.small)(
                            $infoTooltipLabel('A dedicated smart wallet for one-click trading. Funds deposited here can be used without wallet popups.', 'Subaccount'),
                            $row(spacing.small, style({ alignItems: 'center' }))(
                              $node(style({ width: '24px', height: '24px', borderRadius: '50%', flexShrink: '0' }))(
                                $jazzicon(subaccountAddress)
                              ),
                              $anchor(
                                attr({ href: getDebankProfileUrl(subaccountAddress), target: '_blank' }),
                                style({ fontFamily: 'monospace' })
                              )($text(readableAddress(subaccountAddress))),
                              $icon({ $content: $external, width: '12px', fill: pallete.foreground })
                            )
                          ),
                          $statusRow
                        ),
                        $TokenBalanceEditor({
                          token: ARBITRUM_ADDRESS.USDC,
                          balance: walletBalance,
                          account,
                          withdrawBalance: walletBalance,
                          model: map(
                            drafts =>
                              drafts.find(d => d.token.toLowerCase() === ARBITRUM_ADDRESS.USDC.toLowerCase()) ?? {
                                action: BALANCE_ACTION.DEPOSIT,
                                token: ARBITRUM_ADDRESS.USDC,
                                amount: 0n,
                                chainId: account.walletClient.chain!.id
                              },
                            draftDepositTokenList
                          )
                        })({
                          changeDeposit: changeDepositTether(),
                          changeWithdraw: changeWithdrawTether()
                        })
                      )
                    : $setupGuide
                )
              )
            })
          )
        }),

        {
          changeDepositTokenList: merge(
            sampleMap(updateDraftList, draftDepositTokenList, changeDeposit),
            sampleMap(updateDraftList, draftDepositTokenList, changeWithdraw)
          ),
          changeAccount
        }
      ]
    }
  )
