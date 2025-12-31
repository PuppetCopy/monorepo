import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import { ARBITRUM_ADDRESS } from '@puppet/sdk/const'
import { getDebankProfileUrl, readableAddress } from '@puppet/sdk/core'
import { awaitPromises, filter, type IStream, just, map, merge, op, sampleMap, switchMap } from 'aelea/stream'
import { type IBehavior, state } from 'aelea/stream-extended'
import { $node, $text, attr, component, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { encodeAbiParameters, keccak256, toHex, zeroAddress } from 'viem'
import {
  $anchor,
  $defaultTooltipDropContainer,
  $external,
  $icon,
  $info,
  $infoLabel,
  $intermediatePromise,
  $Tooltip
} from '@/ui-components'
import { $jazzicon } from '../common/$avatar.js'
import { $card } from '../common/elements/$common.js'
import { $ConnectWalletCard } from '../components/$ConnectWalletCard.js'
import { $ButtonPrimary } from '../components/form/$Button.js'
import {
  BALANCE_ACTION,
  type BalanceDraft,
  type IDepositEditorDraft,
  type IWithdrawEditorDraft
} from '../components/portfolio/$DepositEditor.js'
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
              const draftsCleared = op(
                draftDepositTokenList,
                filter(d => d.length === 0)
              )
              const walletBalance = state(
                switchMap(
                  () => {
                    if (!subaccountAddress) return just(0n)
                    return wallet.getTokenBalance(ARBITRUM_ADDRESS.USDC, subaccountAddress, 42161, true)
                  },
                  merge(just(null), draftsCleared)
                ),
                0n
              )

              // Check if subaccount is registered with Allocation module
              const subaccountName = toHex('default', { size: 32 })
              const isRegistered = state(
                switchMap(() => {
                  if (!subaccountAddress) return just(zeroAddress)
                  const matchingKey = keccak256(
                    encodeAbiParameters(
                      [{ type: 'address' }, { type: 'address' }, { type: 'bytes32' }],
                      [ARBITRUM_ADDRESS.USDC, subaccountAddress, subaccountName]
                    )
                  )
                  return wallet.read({
                    abi: PUPPET_CONTRACT_MAP.Allocation.abi,
                    address: PUPPET_CONTRACT_MAP.Allocation.address,
                    functionName: 'masterSubaccountMap',
                    args: [matchingKey] as const
                  })
                }, just(null)),
                zeroAddress
              )

              // Combined status: extension, session, registered
              const $statusDot = (isActive: boolean) =>
                $node(
                  style({
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isActive ? pallete.positive : pallete.negative
                  })
                )()

              const $statusLine = (label: string, desc: string, isActive: boolean) =>
                $row(spacing.small, style({ alignItems: 'center', justifyContent: 'space-between' }))(
                  $column(style({ gap: '2px' }))(
                    $node(style({ fontSize: '0.85rem' }))($text(label)),
                    $node(style({ fontSize: '0.75rem', color: pallete.foreground }))($text(desc))
                  ),
                  $statusDot(isActive)
                )

              const combinedStatus = map(
                registered => ({
                  extension: account.isSynced,
                  session: hasSession,
                  registered: registered !== zeroAddress
                }),
                isRegistered
              )

              // Subaccount label with status-colored info icon
              const $subaccountLabel = switchMap(status => {
                const allGood = status.extension && status.session && status.registered
                const iconColor = allGood ? pallete.positive : pallete.negative
                return $row(style({ alignItems: 'center' }))(
                  $infoLabel($text('Subaccount')),
                  $Tooltip({
                    $dropContainer: $defaultTooltipDropContainer,
                    $content: $column(spacing.default, style({ maxWidth: '280px' }))(
                      $node(style({  fontSize: '0.85rem', lineHeight: '1.4' }))(
                        $text('A smart wallet for one-click trading without wallet popups. Your trades can be matched by puppets based on your performance.')
                      ),
                      $column(spacing.default, style({ paddingTop: '8px', borderTop: `1px solid ${pallete.horizon}` }))(
                        $statusLine('Extension', 'Browser extension installed', status.extension),
                        $statusLine('Session', 'Signed trading session', status.session),
                        $statusLine('Registered', 'On-chain subaccount setup', status.registered)
                      )
                    ),
                    $anchor: $icon({
                      $content: $info,
                      viewBox: '0 0 32 32',
                      fill: iconColor,
                      svgOps: style({ width: '24px', height: '24px', padding: '2px 4px' })
                    })
                  })({})
                )
              }, combinedStatus)

              const $setupGuide = $column(spacing.default)(
                $node(style({ fontSize: '1rem', fontWeight: '600' }))($text('Enable Trading Session')),
                $node(style({ color: pallete.foreground, lineHeight: '1.5' }))(
                  $text('Sign a message to enable session connection and a one-click trading. No gas required.')
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
                        $column(spacing.small)(
                          $subaccountLabel,
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
