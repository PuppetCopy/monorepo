import { type IOps, type IStream, join, just, map, op } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $text, component, type I$Node, type INodeCompose, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import { keccak256, toBytes, toHex } from 'viem'
import { $intermediatePromise } from '@/ui-components'
import {
  type connectWallet,
  type IAccountState,
  initializeAccountState,
  setExtensionWalletState
} from '../wallet/wallet.js'
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
      [connect, connectTether]: IBehavior<ReturnType<typeof connectWallet>>, //
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

      const SIGNER_DERIVATION_MESSAGE = `Puppet Protocol Session Authorization
      
Sign this message to authorize your trading session.

This signature will not cost any gas and does not grant access to your funds.`

      const $content = op(
        config.accountQuery, //
        map(async query => {
          const account = await query
          if (!account) {
            return $Popover({
              $target: $baseButton,
              $open: map(() => $walletConnect, openPopover),
              dismiss: connect
            })({})
          }

          if (!account.subaccount) {
            return $ButtonCore({
              $content: $text('Sign')
            })({
              click: changeAccountTether(
                map(async () => {
                  const message = await account.walletClient.signMessage({
                    message: SIGNER_DERIVATION_MESSAGE,
                    account: account.address
                  })

                  const privateKey = keccak256(toBytes(message))

                  // Initialize account to get rhinestone smart wallet address
                  const nextAccountState = await initializeAccountState(account.connection, privateKey)

                  // Store complete wallet entry in extension
                  if (nextAccountState?.subaccount) {
                    const smartWalletAddress = nextAccountState.subaccount.getAddress()
                    const subaccountName = toHex('default', { size: 32 })
                    await setExtensionWalletState(account.address, {
                      smartWalletAddress,
                      subaccountName,
                      privateKey
                    })
                  }

                  return nextAccountState
                })
              )
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
