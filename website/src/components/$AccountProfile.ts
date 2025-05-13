// import { blueberrySubgraph } from "@gambitdao/gbc-middleware"
import { empty } from '@most/core'
import { $node, $text, type INodeCompose, style } from 'aelea/core'
import { $column, $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $jazzicon } from '../common/$avatar.js'

export const $profileDisplay = ({
  $container = $row,
  address,
  showAddress = true,
  profileSize = 45,
  $labelContainer
}: {
  $container?: INodeCompose
  address: Address
  showAddress?: boolean
  profileSize?: number
  $labelContainer?: INodeCompose
}) => {
  return $container(spacing.small, style({ alignItems: 'center', textDecoration: 'none' }))(
    $profileAvatar({ size: profileSize, address }),
    showAddress
      ? $AccountLabel({
          address,
          $container: $labelContainer
        })
      : empty()
  )
}

export const $profileAvatar = ({ address, size = 50 }: { address: Address; size?: number }) => {
  // const profileEv = awaitPromises(blueberrySubgraph.owner(now({ id: account.toLowerCase() })))

  return $row(style({ width: `${size}px`, borderRadius: '50%', overflow: 'hidden', height: `${size}px` }))(
    $jazzicon(address)
    // switchMap(profile => {
    //   return profile && profile.profile
    //     ? $berryByToken(profile.profile) as any
    //     : $jazzicon(address)
    // }, profileEv)
  )
}

export const $disconnectedWalletDisplay = ($container = $row, size = 50) => {
  const $wrapper = $node(style({ width: `${size}px`, aspectRatio: '1 / 1', borderRadius: '50%' }))

  return $container(spacing.small, style({ alignItems: 'center', textDecoration: 'none' }))(
    $wrapper(
      style({
        display: 'flex',
        border: `1px solid ${pallete.foreground}`,
        placeContent: 'center',
        alignItems: 'center'
      })
    )($node(style({ fontWeight: 800, color: pallete.foreground }))($text('?'))),
    $column(style({ whiteSpace: 'nowrap', fontSize: '1.2rem', alignItems: 'center' }))(
      $node(style({}))($text('0x----')),
      $node(style({ fontSize: '1.55em', lineHeight: 1 }))($text('----'))
    )
  )
}

export const $AccountLabel = ({
  address,
  $container = $column,
  primarySize = 1.6,
  secondarySize = primarySize * 0.85
}: {
  address: string
  $container?: INodeCompose
  primarySize?: number
  secondarySize?: number
}) => {
  return $container(style({ alignItems: 'baseline', flexDirection: 'row' }))(
    $node(style({ fontSize: `${secondarySize}rem`, color: pallete.foreground }))($text(`${address.slice(0, 6)}..`)),
    $node(style({ fontSize: `${primarySize}rem` }))($text(address.slice(-4)))
  )
}
