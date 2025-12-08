import { awaitPromises, filterNull, map } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $text, component } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import wallet, { type IAccountState } from '../wallet/wallet.js'
import { $ButtonSecondary } from './form/$Button.js'

export const $WalletConnect = () =>
  component(([connect, connectTether]: IBehavior<PointerEvent, IAccountState>) => {
    const connectors = wallet.connectors.length > 0 ? wallet.connectors : [{ id: 'default', name: 'Connect' }]

    return [
      $column(spacing.small)(
        ...connectors.map(connector =>
          $ButtonSecondary({
            $content: $row(spacing.small)($text(connector.name || 'Connect Wallet'))
          })({
            click: connectTether(
              map(() => wallet.connect(connector.id)),
              awaitPromises,
              filterNull
            )
          })
        )
      ),
      { connect }
    ]
  })
