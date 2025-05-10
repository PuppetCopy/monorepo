import { join, map, now } from '@most/core'
import type { IBehavior, IOps } from 'aelea/core'
import { $text, component, type I$Node, type INodeCompose, style, switchMap } from 'aelea/core'
import { $row, spacing } from 'aelea/ui-components'
import { type IWalletConnected, wallet } from '../wallet/wallet.js'
import { $ButtonSecondary } from './form/$Button.js'
import type { IButtonCore } from './form/$ButtonCore.js'

export interface IConnectWalletPopover {
  $$display: IOps<IWalletConnected, I$Node>
  primaryButtonConfig?: Partial<IButtonCore>
  $container?: INodeCompose
}

export const $IntermediateConnectButton = (config: IConnectWalletPopover) =>
  component(([changeWallet, changeWalletTether]: IBehavior<any>) => {
    const $container = config.$container || $row(style({ minHeight: '48px', minWidth: '0px' }))

    return [
      $container(
        switchMap((account) => {
          // no wallet connected, show connection flow
          if (!account.address) {
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
                map(async (xx) => {
                  wallet.connectAppkit.open({})

                  return null
                })
              )
            })
          }

          return join(config.$$display(now(account as any as IWalletConnected)))
        }, wallet.account)
      ),

      {
        changeWallet
      }
    ]
  })
