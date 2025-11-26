import { type IOps, join, just, map, sampleMap } from 'aelea/stream'
import { $text, component, type I$Node, type INodeCompose, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import { $intermediatePromise } from '@/ui-components'
import { type IAccountState, wallet } from '../wallet/wallet.js'
import { $Popover } from './$Popover.js'
import { $WalletConnect } from './$WalletConnect.js'
import { $ButtonSecondary } from './form/$Button.js'
import type { IButtonCore } from './form/$ButtonCore.js'

export interface IConnectWalletPopover {
  $$display: IOps<IAccountState | null, I$Node>
  primaryButtonConfig?: Partial<IButtonCore>
  $container?: INodeCompose
}

export const $IntermediateConnectButton = (config: IConnectWalletPopover) =>
  component(([selectConnector, selectConnectorTether], [openPopover, openPopoverTether]) => {
    const $container = config.$container || $row(style({ minHeight: '48px', minWidth: '0px' }))

    const $walletConnect = $WalletConnect({
      connectors: wallet.connectors
    })({
      connect: selectConnectorTether()
    })

    return [
      $intermediatePromise({
        $display: map(async connectionQuery => {
          const connection = await connectionQuery

          if (!connection) {
            return $Popover({
              $target: $container(
                $ButtonSecondary({
                  $content: $row(spacing.default, style({ alignItems: 'center' }))($text('Connect Wallet'))
                })({
                  click: openPopoverTether()
                })
              ),
              $open: sampleMap(() => $walletConnect, wallet.account, openPopover),
              dismiss: selectConnector
            })({})
          }

          return join(config.$$display(just(connection)))
        }, wallet.account)
      }),

      {}
    ]
  })
