import type { IBehavior } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $column, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { connectWallet } from 'src/wallet/wallet.js'
import { $card } from '../common/elements/$common.js'
import { $WalletConnect } from './$WalletConnect.js'

function getErrorMessage(error: Error): string {
  if (error.name === 'UserRejectedRequestError' || error.message?.includes('rejected')) {
    return 'Connection cancelled'
  }
  return error.message || 'Connection failed'
}

export const $ConnectWalletCard = component(([connect, connectTether]: IBehavior<ReturnType<typeof connectWallet>>) => {
  return [
    $card(spacing.big)(
      $column(spacing.big, style({ alignItems: 'center', textAlign: 'center', padding: '24px' }))(
        $column(spacing.default, style({ alignItems: 'center' }))(
          $node(style({ fontSize: '1.25rem', fontWeight: '600' }))($text('Connect a wallet')),
          $node(style({ color: pallete.foreground }))($text('To manage your puppet account and copy top traders'))
        ),

        $WalletConnect()({
          connect: connectTether()
        })
      )
    )
  ]
})
