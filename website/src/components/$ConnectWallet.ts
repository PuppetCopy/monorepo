import { type IOps, just, map, switchLatest, switchMap } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $node, $text, component, type I$Node, type INodeCompose, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import { type IWalletState, wallet } from '../wallet/wallet.js'
import { $ButtonSecondary } from './form/$Button.js'
import type { IButtonCore } from './form/$ButtonCore.js'

export interface IConnectWalletPopover {
  $$display: IOps<IWalletState, I$Node>
  primaryButtonConfig?: Partial<IButtonCore>
  $container?: INodeCompose
}

export const $IntermediateConnectButton = (config: IConnectWalletPopover) =>
  component(([changeWallet, changeWalletTether]: IBehavior<any>) => {
    const $container = config.$container || $row(style({ minHeight: '48px', minWidth: '0px' }))

    return [
      $container(
        switchMap(getAccountStatus => {
          if (getAccountStatus.isConnecting) {
            return $node($text('Connecting...'))
          }

          // no wallet connected, show connection flow
          if (!getAccountStatus.address) {
            return $ButtonSecondary({
              $content: $row(
                spacing.default,
                style({ alignItems: 'center' })
              )(
                $text('Connect Wallet')
                // $icon({ $content: $caretDown, width: '14px', viewBox: '0 0 32 32' })
              )
            })({
              click: changeWalletTether(
                map(() => {
                  wallet.connect()
                  return null
                })
              )
            })
          }

          return switchLatest(config.$$display(just(getAccountStatus)))
        }, wallet.account)
      ),

      {
        changeWallet
      }
    ]
  })
