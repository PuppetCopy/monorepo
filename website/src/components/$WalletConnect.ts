import { map } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $text, component } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { wallet } from '../wallet/wallet.js'
import { $ButtonSecondary } from './form/$Button.js'

type ConnectorOption = { id: string; name: string }

interface IWalletConnectProps {
  connectors: ConnectorOption[]
}

export const $WalletConnect = ({ connectors }: IWalletConnectProps) =>
  component(([connect, connectTether]: IBehavior<PointerEvent, string>) => {
    const connectorList = connectors.length > 0 ? connectors : [{ id: 'default', name: 'Connect' }]

    return [
      $column(spacing.small)(
        ...connectorList.map(connector =>
          $ButtonSecondary({
            $content: $row(spacing.small)($text(connector.name || 'Connect Wallet'))
          })({
            click: connectTether(
              map(() => {
                void wallet.connect(connector.id)
                return connector.id
              })
            )
          })
        )
      ),
      { connect }
    ]
  })
