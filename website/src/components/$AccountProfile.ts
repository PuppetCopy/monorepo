import { empty } from 'aelea/stream'
import { $node, $text, type INodeCompose, style } from 'aelea/ui'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $jazzicon } from '../common/$avatar.js'

export const $profileDisplay = ({
  $container = $row,
  address,
  ensName,
  showAddress = true,
  profileSize = 45,
  $labelContainer
}: {
  $container?: INodeCompose
  address: Address
  ensName?: string | null
  showAddress?: boolean
  profileSize?: number
  $labelContainer?: INodeCompose
}) => {
  return $container(spacing.small, style({ alignItems: 'center', textDecoration: 'none' }))(
    $profileAvatar({ size: profileSize, address }),
    showAddress
      ? $AccountLabel({
          address,
          ensName,
          $container: $labelContainer
        })
      : empty
  )
}

export const $profileAvatar = ({ address, size = isDesktopScreen ? 50 : 36 }: { address: Address; size?: number }) => {
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
  return $container(spacing.small, style({ alignItems: 'center', textDecoration: 'none' }))(
    $node(style({ width: `${size}px`, aspectRatio: '1 / 1', borderRadius: '50%' }))(
      style({
        display: 'flex',
        border: `1px solid ${colorAlpha(pallete.foreground, 0.2)}`,
        placeContent: 'center',
        alignItems: 'center'
      })
    )($node(style({ fontWeight: 800, color: pallete.foreground }))($text('?'))),
    $column(style({ whiteSpace: 'nowrap', fontSize: '.8rem', alignItems: 'center' }))(
      $node(style({}))($text('0x----')),
      $node(style({ fontSize: '1.55em', lineHeight: 1 }))($text('----'))
    )
  )
}

export const $AccountLabel = ({
  address,
  ensName,
  $container = $column,
  primarySize = 1,
  secondarySize = primarySize * 0.85
}: {
  address: string
  ensName?: string | null
  $container?: INodeCompose
  primarySize?: number
  secondarySize?: number
}) => {
  // If ENS name exists, display it; otherwise fall back to shortened address
  if (ensName) {
    return $container(style({ alignItems: 'baseline', flexDirection: 'row' }))(
      $node(style({ fontSize: `${primarySize}rem` }))($text(ensName))
    )
  }

  return $container(style({ alignItems: 'baseline', flexDirection: 'row' }))(
    $node(style({ fontSize: `${secondarySize}rem`, color: pallete.foreground }))($text(`${address.slice(0, 6)}..`)),
    $node(style({ fontSize: `${primarySize}rem` }))($text(address.slice(-4)))
  )
}
