import { type IOps, just, map, merge, sampleMap, switchLatest, switchMap } from 'aelea/stream'
import { $node, $text, component, type I$Node, type INodeCompose, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { type IAccountState, type IConnectionState, wallet } from '../wallet/wallet.js'
import { $Popover } from './$Popover.js'
import { $WalletConnect } from './$WalletConnect.js'
import { $ButtonSecondary } from './form/$Button.js'
import type { IButtonCore } from './form/$ButtonCore.js'

export interface IConnectWalletPopover {
  $$display: IOps<IConnectionState, I$Node>
  primaryButtonConfig?: Partial<IButtonCore>
  $container?: INodeCompose
}

export const $IntermediateConnectButton = (config: IConnectWalletPopover) =>
  component(
    (
      [selectConnector, selectConnectorTether]: any,
      [closePopover, closePopoverTether]: any,
      [openPopover, openPopoverTether]: any
    ) => {
      const $container = config.$container || $row(style({ minHeight: '48px', minWidth: '0px' }))

      const $walletConnect = $WalletConnect({
        connectors: wallet.connectors
      })({
        connect: selectConnectorTether()
      })

      return [
        $Popover({
          $target: $container(
            switchMap(getAccountStatus => {
              if (getAccountStatus === 'connecting') {
                return $node($text('Connecting...'))
              }

              if (!getAccountStatus?.address) {
                return $ButtonSecondary({
                  $content: $row(spacing.default, style({ alignItems: 'center' }))($text('Connect Wallet'))
                })({
                  click: openPopoverTether()
                })
              }

              return switchLatest(
                map(
                  $displayNode => {
                    return $ButtonSecondary({
                      $content: $row(spacing.default, style({ alignItems: 'center' }))($displayNode)
                    })({})
                  },
                  config.$$display(just(getAccountStatus))
                )
              )
            }, wallet.account)
          ),
          $open: sampleMap(() => $walletConnect, wallet.account, openPopover),
          dismiss: merge(selectConnector, closePopover)
        })({}),

        {}
      ]
    }
  )
