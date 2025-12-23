import { awaitPromises, type IOps, join, just, map, merge, switchMap } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $text, component, type I$Node, type INodeCompose, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import type { Address } from 'viem'
import wallet, { type IAccountState } from '../wallet/wallet.js'
import { $Popover } from './$Popover.js'
import { $WalletConnect } from './$WalletConnect.js'
import { $ButtonSecondary } from './form/$Button.js'

export interface IConnectWalletPopover {
  $$display: IOps<IAccountState, I$Node>
  $container?: INodeCompose
}

export const $IntermediateConnectButton = (config: IConnectWalletPopover) =>
  component(
    (
      [connect, connectTether]: IBehavior<Address[]>, //
      [openPopover, openPopoverTether]: IBehavior<PointerEvent>
    ) => {
      const $container = config.$container || $row(style({ minHeight: '48px', minWidth: '0px' }))

      const $walletConnect = $WalletConnect()({
        connect: connectTether()
      })

      const $baseButton = $container(
        $ButtonSecondary({
          $content: $row(spacing.default, style({ alignItems: 'center' }))($text('Connect Wallet'))
        })({
          click: openPopoverTether()
        })
      )

      const $content = switchMap(
        account => {
          if (!account) {
            return $Popover({
              $target: $baseButton,
              $open: map(() => $walletConnect, openPopover),
              dismiss: connect
            })({})
          }

          return join(config.$$display(just(account)))
        },
        merge(awaitPromises(wallet.account), just(null))
      )

      return [$content, { connect }]
    }
  )
