import { type IOps, join, just, map, merge, sampleMap } from 'aelea/stream'
import { $node, $text, component, type I$Node, type INodeCompose, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import { $alertIntermediateSpinnerContainer, $intermediatePromise } from '@/ui-components'
import wallet, { type IAccountState } from '../wallet/wallet.js'
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

    const $baseButton = $container(
      $ButtonSecondary({
        $content: $row(spacing.default, style({ alignItems: 'center' }))($text('Connect Wallet'))
      })({
        click: openPopoverTether()
      })
    )

    const $connectingLoader = $node(
      style({
        position: 'relative',
        display: 'inline-flex',
        borderRadius: '30px',
        overflow: 'visible'
      })
    )(
      $baseButton,
      style({
        position: 'absolute',
        inset: '0px',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3,
        borderRadius: 'inherit'
      })(
        style({ width: '100%', height: '100%', borderRadius: 'inherit', overflow: 'hidden' })(
          $alertIntermediateSpinnerContainer()
        )
      )
    )

    const connectingPlaceholder = map(() => new Promise<I$Node>(() => {}), selectConnector)

    return [
      $intermediatePromise({
        $display: merge(
          connectingPlaceholder,
          map(async connectionQuery => {
            const connection = await connectionQuery

            if (!connection) {
              return $Popover({
                $target: $baseButton,
                $open: sampleMap(() => $walletConnect, wallet.account, openPopover),
                dismiss: selectConnector
              })({})
            }

            return join(config.$$display(just(connection)))
          }, wallet.account)
        ),
        $loader: $connectingLoader
      }),

      {}
    ]
  })
