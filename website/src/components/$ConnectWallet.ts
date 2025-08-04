import { $node, $text, component, type I$Node, type INodeCompose, style } from 'aelea/core'
import { type IBehavior, type IOps, map, now, switchLatest, switchMap } from 'aelea/stream'
import { $row, spacing } from 'aelea/ui-components'
import { type IGetWalletStatus, wallet } from '../wallet/wallet.js'
import { $ButtonSecondary } from './form/$Button.js'
import type { IButtonCore } from './form/$ButtonCore.js'

export interface IConnectWalletPopover {
  $$display: IOps<IGetWalletStatus, I$Node>
  primaryButtonConfig?: Partial<IButtonCore>
  $container?: INodeCompose
}

export const $IntermediateConnectButton = (config: IConnectWalletPopover) =>
  component(([changeWallet, changeWalletTether]: IBehavior<any>) => {
    const $container = config.$container || $row(style({ minHeight: '48px', minWidth: '0px' }))

    return [
      $container(
        switchMap(getAccountStatus => {
          if (getAccountStatus.status === 'connecting' || getAccountStatus.status === 'reconnecting') {
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
                map(async _xx => {
                  wallet.appkit.open({})

                  return null
                })
              )
            })
          }

          return switchLatest(config.$$display(now(getAccountStatus as any as IGetWalletStatus)))
        }, wallet.account)
      ),

      {
        changeWallet
      }
    ]
  })
