import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import { ADDRESS_ZERO, ARBITRUM_ADDRESS } from '@puppet/sdk/const'
import { getDebankProfileUrl, readableAddress } from '@puppet/sdk/core'
import {
  awaitPromises,
  filter,
  fromPromise,
  type IStream,
  just,
  map,
  merge,
  op,
  sampleMap,
  switchMap
} from 'aelea/stream'
import { type IBehavior, state } from 'aelea/stream-extended'
import { $node, $text, attr, component, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
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
import wallet, { createMasterSubaccount, type IAccountState, signAndEnableSession } from '../wallet/wallet.js'

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
      [changeDeposit, changeDepositTether]: IBehavior<IDepositEditorDraft>, //
      [changeWithdraw, changeWithdrawTether]: IBehavior<IWithdrawEditorDraft>, //
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

              // Master Account = account with MasterHook for receiving puppet allocations
              const masterAccount = account.signer
                ? await createMasterSubaccount(account, { baseToken: ARBITRUM_ADDRESS.USDC })
                : null

              const subaccountInfo = masterAccount
                ? await wallet.read({
                    abi: PUPPET_CONTRACT_MAP.Allocate.abi,
                    address: PUPPET_CONTRACT_MAP.Allocate.address,
                    functionName: 'getSubaccountInfo',
                    args: [masterAccount.getAddress()] as const
                  })
                : null

              // Main Account = 7579 operational account for trading
              const mainAccountAddress = account.subaccount?.getAddress()
              const hasSession = !!account.subaccount

              // Refresh balance on mount and when drafts are cleared (tx success)
              const draftsCleared = op(
                draftDepositTokenList,
                filter(d => d.length === 0)
              )
              const walletBalance = state(
                switchMap(
                  () => {
                    if (!mainAccountAddress) return just(0n)
                    return wallet.getTokenBalance(ARBITRUM_ADDRESS.USDC, mainAccountAddress, 42161, true)
                  },
                  merge(just(null), draftsCleared)
                ),
                0n
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

              const combinedStatus = {
                extension: account.isSynced,
                session: hasSession,
                registered: !!subaccountInfo && subaccountInfo.account !== ADDRESS_ZERO
              }

              // Main Account label with status-colored info icon
              const allGood = combinedStatus.extension && combinedStatus.session && combinedStatus.registered
              const iconColor = allGood ? pallete.positive : pallete.negative
              const $mainAccountLabel = $row(style({ alignItems: 'center' }))(
                $infoLabel($text('Main Account')),
                $Tooltip({
                  $dropContainer: $defaultTooltipDropContainer,
                  $content: $column(spacing.default, style({ maxWidth: '280px' }))(
                    $node(style({ fontSize: '0.85rem', lineHeight: '1.4' }))(
                      $text(
                        'A smart wallet for one-click trading without wallet popups. Your trades can be matched by puppets based on your performance.'
                      )
                    ),
                    $column(spacing.default, style({ paddingTop: '8px', borderTop: `1px solid ${pallete.horizon}` }))(
                      $statusLine('Extension', 'Browser extension installed', combinedStatus.extension),
                      $statusLine('Registered', 'Deployed on first deposit', combinedStatus.registered)
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

              const $setupGuide = $column(spacing.default)(
                $node(style({ fontSize: '1rem', fontWeight: '600' }))($text('Enable Trading Session')),
                $node(style({ color: pallete.foreground, lineHeight: '1.5' }))(
                  $text('Sign a message to enable session connection and one-click trading. No gas required.')
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
                  mainAccountAddress
                    ? $column(spacing.default)(
                        $column(spacing.small)(
                          $mainAccountLabel,
                          $row(spacing.small, style({ alignItems: 'center' }))(
                            $node(style({ width: '24px', height: '24px', borderRadius: '50%', flexShrink: '0' }))(
                              $jazzicon(mainAccountAddress)
                            ),
                            $anchor(
                              attr({ href: getDebankProfileUrl(mainAccountAddress), target: '_blank' }),
                              style({ fontFamily: 'monospace' })
                            )($text(readableAddress(mainAccountAddress))),
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
