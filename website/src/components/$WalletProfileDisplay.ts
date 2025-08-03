import {   tap , switchMap , behavior } from 'aelea/stream'
import { ignoreAll } from '@puppet-copy/middleware/core'
import { $node, $text, nodeEvent, style } from 'aelea/core'
import { $column, $row, spacing } from 'aelea/ui-components'
import { $seperator2 } from '../pages/common.js'
import { wallet } from '../wallet/wallet.js'
import { $disconnectedWalletDisplay, $profileDisplay } from './$AccountProfile.js'

export const $walletProfileDisplay = () => {
  // const account = accountStatus.connector === undefined ? startWith(accountStatus, account) : account

  const [click, clickTether] = behavior()

  return switchMap((getAccountStatus) => {
    if (getAccountStatus.status === 'connecting' || getAccountStatus.status === 'reconnecting') {
      return $node($text('Connecting...'))
    }

    if (!getAccountStatus.address) {
      return $row(
        clickTether(
          nodeEvent('pointerdown'),
          tap((_es) => {
            wallet.appkit.open()
          })
        ),
        spacing.small,
        style({ alignItems: 'center', paddingRight: '16px' })
      )(
        ignoreAll(click),
        $disconnectedWalletDisplay(),
        $seperator2,
        $column(style({ fontSize: '.8rem' }))($text('Click to'), style({ fontWeight: 'bold' })($node($text('Connect'))))
      )
    }

    return $row(
      spacing.small,
      style({ alignItems: 'center', pointerEvents: 'none', paddingRight: '16px' })
    )(
      getAccountStatus.address
        ? $profileDisplay({ address: getAccountStatus.address })
        : style({ cursor: 'pointer' }, $disconnectedWalletDisplay())
    )
  }, wallet.account)
}
