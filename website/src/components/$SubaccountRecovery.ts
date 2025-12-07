import { readableTokenAmountLabel } from '@puppet-copy/middleware/core'
import { awaitPromises, empty, just, map, op, switchMap } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $node, $text, component, type INode, nodeEvent, style } from 'aelea/ui'
import { $column, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { $heading3 } from 'src/common/$text.js'
import { encodeFunctionData, erc20Abi } from 'viem'
import { arbitrum } from 'viem/chains'
import { $alertIcon, $icon } from '@/ui-components'
import wallet, { type IAccountState } from '../wallet/wallet.js'
import { $Popover } from './$Popover.js'
import { $SubmitBar } from './form/$SubmitBar.js'

export const $SubaccountRecoveryIndicator = ({ account }: { account: IAccountState }) =>
  component(
    (
      [submitRecover, submitRecoverTether]: IBehavior<IAccountState, any>,
      [openPopover, openPopoverTether]: IBehavior<INode, PointerEvent>
    ) => {
      // Fetch subaccount portfolio
      const portfolioQuery = wallet.getPortfolio(account.subaccountAddress, true)

      return [
        op(
          just(portfolioQuery),
          awaitPromises,
          switchMap(items => {
            // Filter to items with positive Arbitrum balance only
            const arbTokensWithBalance = items
              .map(item => {
                const arbBalance = item.tokenChainBalance.find(tcb => tcb.chainId === arbitrum.id)
                if (!arbBalance?.tokenAddress || arbBalance.balance.unlocked <= 0n) return null
                return {
                  tokenName: item.tokenName,
                  tokenDecimals: item.tokenDecimals,
                  tokenAddress: arbBalance.tokenAddress,
                  balance: arbBalance.balance.unlocked
                }
              })
              .filter((item): item is NonNullable<typeof item> => item !== null)

            if (arbTokensWithBalance.length === 0) return empty

            // Warning indicator with click handler
            const $warningIndicator = $node(
              style({
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: colorAlpha(pallete.negative, 0.2),
                border: `1px solid ${pallete.negative}`
              }),
              openPopoverTether(nodeEvent('click'))
            )(
              $icon({
                $content: $alertIcon,
                width: '14px',
                viewBox: '0 0 24 24',
                svgOps: style({ fill: pallete.negative })
              })
            )

            // Show warning indicator with popover
            return $Popover({
              $target: $warningIndicator,
              $open: map(() => {
                return $column(spacing.default, style({ width: '320px' }))(
                  $heading3(
                    $text('Recover stuck tokens')
                  ),
                  $text(
                    'You have tokens stuck in your subaccount from a previous incomplete transaction. Withdraw them back to your wallet.'
                  ),
                  $column(
                    spacing.tiny,
                    style({
                      backgroundColor: colorAlpha(pallete.foreground, 0.1),
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '8px'
                    })
                  )(
                    ...arbTokensWithBalance.map(item =>
                      $text(
                        readableTokenAmountLabel({ decimals: item.tokenDecimals, symbol: item.tokenName }, item.balance)
                      )
                    )
                  ),
                  $SubmitBar({
                    txQuery: submitRecover,
                    $submitContent: $text('Withdraw')
                  })({
                    submit: submitRecoverTether(
                      map(async () => {
                        // Build transfer calls for Arbitrum tokens
                        const calls = arbTokensWithBalance.map(item => ({
                          to: item.tokenAddress,
                          data: encodeFunctionData({
                            abi: erc20Abi,
                            functionName: 'transfer',
                            args: [account.address, item.balance]
                          }),
                          value: 0n
                        }))

                        // Execute via Rhinestone - same-chain transaction on Arbitrum
                        const tx = await account.subAccount.sendTransaction({
                          chain: arbitrum,
                          calls
                        })

                        return account.subAccount.waitForExecution(tx)
                      })
                    )
                  })
                )
              }, openPopover)
            })({})
          })
        ),

        {}
      ]
    }
  )
