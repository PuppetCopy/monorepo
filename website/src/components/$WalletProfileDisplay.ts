import { map, switchMap } from 'aelea/stream'
import { $node, $text, component, nodeEvent, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { $alertIntermediateSpinnerContainer, $intermediatePromise } from '@/ui-components'
import { $seperator2 } from '../pages/common.js'
import { wallet } from '../wallet/wallet.js'
import { $disconnectedWalletDisplay, $profileDisplay } from './$AccountProfile.js'
import { $Popover } from './$Popover.js'
import { $WalletConnect } from './$WalletConnect.js'

export const $WalletProfileDisplay = component(
  ([selectConnector, selectConnectorTether]: any, [targetClick, targetClickTether]: any) => {
    const $target = $row(
      spacing.small,
      style({ alignItems: 'center', paddingRight: '16px' }),
      targetClickTether(nodeEvent('pointerdown'))
    )(
      $disconnectedWalletDisplay(),
      $seperator2,
      $column(style({ fontSize: '.8rem' }))($text('Click to'), style({ fontWeight: 'bold' })($node($text('Connect'))))
    )

    const $walletConnect = $WalletConnect({
      connectors: wallet.connectors
    })({
      connect: selectConnectorTether()
    })

    const openStream = switchMap(() => map(() => $walletConnect, targetClick), wallet.account)

    const $connectingLoader = $node(style({ position: 'relative', display: 'inline-flex', borderRadius: '999px' }))(
      style({ position: 'relative', borderRadius: 'inherit' })($target),
      style({
        position: 'absolute',
        inset: '0px',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        borderRadius: 'inherit'
      })(
        style({ width: '100%', height: '100%', borderRadius: 'inherit', overflow: 'hidden' })(
          $alertIntermediateSpinnerContainer()
        )
      )
    )

    return [
      $intermediatePromise({
        $loader: $connectingLoader,
        $display: map(async connectionQuery => {
          const connection = await connectionQuery

          if (!connection) {
            return $Popover({
              $target,
              $open: openStream,
              dismiss: selectConnector
            })({})
          }

          return $row(
            spacing.small,
            style({ alignItems: 'center', pointerEvents: 'none', paddingRight: '16px' })
          )(
            connection.address
              ? $profileDisplay({ address: connection.address })
              : style({ cursor: 'pointer' }, $disconnectedWalletDisplay())
          )
        }, wallet.account)
      }),
      {}
    ]
  }
)
