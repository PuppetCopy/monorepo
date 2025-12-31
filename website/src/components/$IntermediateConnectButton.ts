import { type IOps, type IStream, join, just, map, op } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $text, component, type I$Node, type INodeCompose, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import { $intermediatePromise } from '@/ui-components'
import { type connectWallet, type IAccountState, signAndEnableSession } from '../wallet/wallet.js'
import { $Popover } from './$Popover.js'
import { $WalletConnect } from './$WalletConnect.js'
import { $ButtonSecondary } from './form/$Button.js'
import { $ButtonCore } from './form/$ButtonCore.js'

export interface IConnectWalletPopover {
  $$display: IOps<IAccountState, I$Node>
  $container?: INodeCompose
  accountQuery: IStream<Promise<IAccountState>>
}

export const $IntermediateConnectButton = (config: IConnectWalletPopover) =>
  component(
    (
      [openPopover, openPopoverTether]: IBehavior<PointerEvent>,
      [changeAccount, changeAccountTether]: IBehavior<PointerEvent, Promise<IAccountState>>
    ) => {
      const $container = config.$container || $row(style({ minHeight: '48px', minWidth: '0px' }))

      const $walletConnect = $WalletConnect()({})

      const $baseButton = $container(
        $ButtonSecondary({
          $content: $row(spacing.default, style({ alignItems: 'center' }))($text('Connect Wallet'))
        })({
          click: openPopoverTether()
        })
      )

      const $content = op(
        config.accountQuery, //
        map(async query => {
          const account = await query
          if (!account) {
            return $Popover({
              $target: $baseButton,
              $open: map(() => $walletConnect, openPopover)
            })({})
          }

          if (!account.subaccount) {
            return $ButtonCore({
              $content: $text('Sign')
            })({
              click: changeAccountTether(map(() => signAndEnableSession(account)))
            })
          }

          return join(config.$$display(just(account)))
        })
      )

      return [
        $intermediatePromise({
          $display: $content
        }),
        {
          changeAccount
        }
      ]
    }
  )
