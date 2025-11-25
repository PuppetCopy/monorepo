import { type IOps, just, map, merge, sampleMap, switchMap } from 'aelea/stream'
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
                dismiss: merge(selectConnector, closePopover)
              })({})
            }

            return switchMap(
              $displayNode => {
                return $ButtonSecondary({
                  $content: $row(spacing.default, style({ alignItems: 'center' }))($displayNode)
                })({})
              },
              config.$$display(just(connection))
            )
          }, wallet.account)
        }),

        {}
      ]
    }
  )
