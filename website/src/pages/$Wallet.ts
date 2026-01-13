import { ADDRESS_ZERO, ARBITRUM_ADDRESS } from '@puppet/sdk/const'
import { getDebankProfileUrl, readableAddress } from '@puppet/sdk/core'
import { getWalletClient } from '@wagmi/core'
import { awaitPromises, empty, type IStream, just, map, merge, op, switchMap } from 'aelea/stream'
import { type IBehavior, state } from 'aelea/stream-extended'
import { $node, $text, attr, component, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { type Hex, toHex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
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
import { $ButtonPrimary, $ButtonSecondary, $defaultMiniButtonSecondary } from '../components/form/$Button.js'
import type { BalanceDraft } from '../components/portfolio/$DepositEditor.js'
import { $TokenBalanceEditor } from '../components/portfolio/$TokenBalanceEditor.js'
import wallet, {
  clearAllExtensionStorage,
  createMasterAccount,
  getExtensionWalletState,
  getPortfolio,
  type IConnectedAccountState,
  type IMasterAccountState,
  setActiveWallet,
  setExtensionWalletState,
  signSession,
  TOKEN_ID
} from '../wallet/wallet.js'

interface IWalletPage {
  draftDepositTokenList: IStream<BalanceDraft[]>
}

// Extended connected account state for $Wallet with sync status
type IWalletConnectedState = IConnectedAccountState & { isSynced: boolean }
type IWalletMasterState = IMasterAccountState & { isSynced: boolean }
type IWalletAccountState = IWalletConnectedState | IWalletMasterState | null

export const $WalletPage = ({ draftDepositTokenList }: IWalletPage) =>
  component(
    (
      [changeDraft, changeDraftTether]: IBehavior<BalanceDraft>, //
      [changeAccount, changeAccountTether]: IBehavior<PointerEvent, Promise<IWalletAccountState>>,
      [clickDisconnect, clickDisconnectTether]: IBehavior<PointerEvent, Promise<IWalletAccountState>>
    ) => {
      // Own account state - handles Master account creation with extension sync
      const accountQuery = state(
        merge(
          changeAccount,
          clickDisconnect,
          op(
            wallet.connection,
            map(async connection => {
              if (connection.status !== 'connected' || !connection.connector || !connection.chainId) return null
              if (typeof connection.connector.getChainId !== 'function') return null

              const walletClient = await getWalletClient(wallet.wagmi, { chainId: connection.chainId })
              const address = walletClient.account.address

              let hasExtension = false
              let sessionKey: Hex | null = null

              // Check if extension is installed and get any existing session key
              try {
                const extensionState = await getExtensionWalletState(address)
                hasExtension = true // Extension responded - it's installed

                await setActiveWallet(walletClient.account.address)

                if (extensionState?.privateKey) {
                  sessionKey = extensionState.privateKey as Hex
                }
              } catch {
                // Extension not installed or timed out
                hasExtension = false
              }

              const connectedAccount: IWalletConnectedState = {
                sessionSigner: null,
                walletClient,
                address,
                connection,
                isSynced: hasExtension
              }

              if (!sessionKey) {
                return connectedAccount
              }

              // Create Master Account with MasterHook module
              const sessionSigner = privateKeyToAccount(sessionKey)
              const master = await createMasterAccount(connectedAccount, sessionSigner, {
                baseTokenId: TOKEN_ID.USDC
              })

              // Sync master address to extension
              await setExtensionWalletState(address, {
                smartWalletAddress: master.getAddress(),
                subaccountName: toHex('master', { size: 32 }),
                privateKey: sessionKey
              }).catch(() => {})

              const portfolio = await getPortfolio(master.getAddress(), false)

              const masterState: IWalletMasterState = {
                ...connectedAccount,
                sessionSigner,
                portfolio,
                subaccount: master,
                baseTokenId: TOKEN_ID.USDC
              }

              return masterState
            })
          )
        )
      )

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

              if (account.sessionSigner === null) {
                const hasExtension = account.isSynced

                // Only show warning when extension is not installed
                const $extensionWarning = hasExtension
                  ? empty
                  : $row(
                      spacing.small,
                      style({
                        alignItems: 'center',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(229, 62, 62, 0.1)'
                      })
                    )(
                      $node(
                        style({
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: pallete.negative
                        })
                      )(),
                      $column(style({ gap: '2px' }))(
                        $node(style({ fontSize: '0.85rem', color: pallete.negative }))(
                          $text('Puppet Master Wallet not detected')
                        ),
                        $node(style({ fontSize: '0.75rem', color: pallete.foreground }))(
                          $text('Install for secure key storage and cross-session sync')
                        )
                      )
                    )

                return $card(style({ width: '450px', alignSelf: 'center' }))(
                  $node(style({ fontSize: '1rem', fontWeight: '600' }))($text('Enable Trading Session')),
                  $node(style({ color: pallete.foreground, lineHeight: '1.5' }))(
                    $text('Sign a message to enable session connection and one-click trading. No gas required.')
                  ),
                  $extensionWarning,
                  $ButtonPrimary({
                    $content: $text('Enable'),
                    disabled: just(!hasExtension)
                  })({
                    click: changeAccountTether(
                      map(async () => {
                        const sessionKey = await signSession(account)
                        const sessionSigner = privateKeyToAccount(sessionKey)
                        const master = await createMasterAccount(account, sessionSigner, {
                          baseTokenId: TOKEN_ID.USDC
                        })

                        // Sync master address to extension
                        await setExtensionWalletState(account.address, {
                          smartWalletAddress: master.getAddress(),
                          subaccountName: toHex('master', { size: 32 }),
                          privateKey: sessionKey
                        }).catch(() => {})

                        const portfolio = await getPortfolio(master.getAddress(), false)

                        const masterState: IWalletMasterState = {
                          ...account,
                          sessionSigner,
                          portfolio,
                          subaccount: master,
                          baseTokenId: TOKEN_ID.USDC,
                          isSynced: true
                        }
                        return masterState
                      }),
                      awaitPromises,
                      map(x => Promise.resolve(x))
                    )
                  })
                )
              }

              // Account has session signer - it's a Master account
              const masterAccount = account as IWalletMasterState
              const master = masterAccount.subaccount
              const masterAddress = master.getAddress()

              // TODO: Check if master is registered via Registry contract
              const masterInfo: { user: `0x${string}` } | null = { user: ADDRESS_ZERO }

              // Fetch unified balance from portfolio (sum across all chains)
              const masterBalance = state(
                switchMap(async () => {
                  const portfolio = await getPortfolio(masterAddress, false)
                  const usdcItem = portfolio.find(item =>
                    item.tokenChainBalance.some(
                      tcb => tcb.tokenAddress.toLowerCase() === ARBITRUM_ADDRESS.USDC.toLowerCase()
                    )
                  )
                  return usdcItem ? usdcItem.balance.locked + usdcItem.balance.unlocked : 0n
                }, just(null)),
                0n
              )

              // Status indicators
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
                extension: masterAccount.isSynced,
                session: !!masterAccount.sessionSigner,
                created: !!masterInfo && masterInfo.user !== ADDRESS_ZERO
              }

              const allGood = combinedStatus.extension && combinedStatus.session && combinedStatus.created
              const iconColor = allGood ? pallete.positive : pallete.negative

              const $masterLabel = $row(style({ alignItems: 'center' }))(
                $infoLabel($text('Master Account')),
                $Tooltip({
                  $dropContainer: $defaultTooltipDropContainer,
                  $content: $column(spacing.default, style({ maxWidth: '280px' }))(
                    $node(style({ fontSize: '0.85rem', lineHeight: '1.4' }))(
                      $text(
                        'A smart account that receives allocations from puppets. Fund it to start receiving copy-trade profits.'
                      )
                    ),
                    $column(spacing.default, style({ paddingTop: '8px', borderTop: `1px solid ${pallete.horizon}` }))(
                      $statusLine('Session', 'Keys synced with extension', combinedStatus.extension),
                      $statusLine('Created', 'Deployed on first deposit', combinedStatus.created)
                    ),
                    $row(style({ paddingTop: '8px', borderTop: `1px solid ${pallete.horizon}` }))(
                      $ButtonSecondary({
                        $container: $defaultMiniButtonSecondary,
                        $content: $text('Disconnect Session')
                      })({
                        click: clickDisconnectTether(
                          map(async () => {
                            // Clear all extension storage
                            await clearAllExtensionStorage().catch(() => {})
                            // Clear localStorage fallback
                            localStorage.removeItem(`puppet:signer:${masterAccount.address}`)
                            localStorage.removeItem(`puppet:account:${masterAccount.address}`)

                            // Return connected state without session
                            const connectedAccount: IWalletConnectedState = {
                              sessionSigner: null,
                              walletClient: masterAccount.walletClient,
                              address: masterAccount.address,
                              connection: masterAccount.connection,
                              isSynced: masterAccount.isSynced
                            }
                            return connectedAccount
                          }),
                          awaitPromises,
                          map(x => Promise.resolve(x))
                        )
                      })
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

              return $card(
                spacing.default,
                style({ maxWidth: '660px', margin: '0 auto', width: '100%' })
              )(
                $row(spacing.default, style({ justifyContent: 'space-between' }))(
                  $column(spacing.small)(
                    $masterLabel,
                    $row(spacing.small, style({ alignItems: 'center' }))(
                      $node(style({ width: '24px', height: '24px', borderRadius: '50%', flexShrink: '0' }))(
                        $jazzicon(masterAddress)
                      ),
                      $anchor(
                        attr({ href: getDebankProfileUrl(masterAddress), target: '_blank' }),
                        style({ fontFamily: 'monospace' })
                      )($text(readableAddress(masterAddress))),
                      $icon({ $content: $external, width: '12px', fill: pallete.foreground })
                    )
                  ),
                  $TokenBalanceEditor({
                    token: ARBITRUM_ADDRESS.USDC,
                    balance: masterBalance,
                    walletAccount: masterAccount,
                    model: map(
                      drafts =>
                        drafts.find(d => d.token.toLowerCase() === ARBITRUM_ADDRESS.USDC.toLowerCase()) ?? {
                          token: ARBITRUM_ADDRESS.USDC,
                          amount: 0n,
                          chainId: masterAccount.walletClient.chain!.id
                        },
                      draftDepositTokenList
                    )
                  })({
                    changeDraft: changeDraftTether()
                  })
                )
              )
            })
          )
        }),

        {
          changeDraft,
          changeAccount: accountQuery
        }
      ]
    }
  )
