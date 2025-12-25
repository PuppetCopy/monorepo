import { ARBITRUM_ADDRESS } from '@puppet/sdk/const'
import { ignoreAll, readableAddress } from '@puppet/sdk/core'
import { map, op, switchMap, tap } from 'aelea/stream'
import { type IBehavior, state } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $column, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { erc20Abi } from 'viem'
import { $icon, $intermediatePromise } from '@/ui-components'
import { $card } from '../common/elements/$common.js'
import { $WalletConnect } from '../components/$WalletConnect.js'
import { $ButtonSecondary } from '../components/form/$Button.js'
import type { IDepositEditorDraft, IWithdrawEditorDraft } from '../components/portfolio/$DepositEditor.js'
import { $TokenBalanceEditor } from '../components/portfolio/$TokenBalanceEditor.js'
import { $info } from '../ui-components/$icons.js'
import wallet from '../wallet/wallet.js'

export const $WalletPage = () =>
  component(
    (
      [walletConnect, walletConnectTether]: IBehavior<any>,
      [clickDisconnect, clickDisconnectTether]: IBehavior<any>,
      [changeDeposit, changeDepositTether]: IBehavior<IDepositEditorDraft>,
      [changeWithdraw, changeWithdrawTether]: IBehavior<IWithdrawEditorDraft>
    ) => {
      // Combine account and subaccount streams
      const pageState = op(
        wallet.subaccount,
        map(async subaccountPromise => {
          const subaccountState = await subaccountPromise
          const account = await wallet.account
          return { account, subaccountState }
        })
      )

      return [
        $intermediatePromise({
          $display: map(async pageStateValue => {
            const { account, subaccountState } = await pageStateValue

            if (!account) {
              return $column(
                spacing.big,
                style({ alignItems: 'center', justifyContent: 'center', padding: '60px 24px', flex: 1 })
              )(
                $icon({ $content: $info, viewBox: '0 0 32 32', width: '48px', fill: pallete.foreground }),
                $column(spacing.small, style({ alignItems: 'center', textAlign: 'center' }))(
                  $node(style({ fontSize: '1.2rem', fontWeight: 'bold' }))($text('Connect Your Wallet')),
                  $node(style({ color: pallete.foreground }))($text('Connect to create a subaccount'))
                ),
                $WalletConnect()({ connect: walletConnectTether() })
              )
            }

            const subaccountAddress = subaccountState?.subaccountAddress

            const walletBalance = state(
              op(
                switchMap(
                  () => wallet.getTokenBalance(ARBITRUM_ADDRESS.USDC, account.address, 42161, true),
                  wallet.account
                )
              ),
              0n
            )

            // Deposit execution
            const depositExecution = op(
              changeDeposit,
              tap(draft => {
                if (!subaccountAddress) return alert('Subaccount not ready')
                account.walletClient
                  .writeContract({
                    address: draft.token,
                    abi: erc20Abi,
                    functionName: 'transfer',
                    args: [subaccountAddress, draft.amount],
                    chain: account.walletClient.chain,
                    account: account.walletClient.account!
                  })
                  .then(tx => alert(`Deposit sent: ${tx}`))
                  .catch(e => alert(`Failed: ${e.message}`))
              })
            )

            return $column(spacing.big, style({ padding: '24px', maxWidth: '600px', margin: '0 auto', width: '100%' }))(
              ignoreAll(depositExecution),

              // Main card
              $card(spacing.default)(
                $column(spacing.default)(
                  $node(style({ color: pallete.foreground, fontSize: '0.75rem' }))($text('Subaccount')),
                  subaccountAddress
                    ? $node(style({ fontFamily: 'monospace' }))($text(readableAddress(subaccountAddress)))
                    : $node(style({ color: pallete.foreground }))($text('Initializing...')),
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
                ),

                $ButtonSecondary({ $content: $text('Disconnect') })({
                  click: clickDisconnectTether(tap(() => wallet.disconnect()))
                })
              )
            )
          }, pageState)
        }),

        { walletConnect, clickDisconnect, changeDeposit, changeWithdraw }
      ]
    }
  )
