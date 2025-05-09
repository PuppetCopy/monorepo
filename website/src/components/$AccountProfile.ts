// import { blueberrySubgraph } from "@gambitdao/gbc-middleware"
import { awaitPromises, empty, now } from '@most/core'
import { $node, $text, type I$Node, type INodeCompose, style } from 'aelea/core'
import { $column, $row, layoutSheet, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type * as viem from 'viem'
import { $jazzicon } from '../common/$avatar.js'

export interface IAccountPreview {
  account: viem.Address
  labelSize?: string
  profileSize?: number
}

export interface IProfilePreview extends IAccountPreview {
  $container?: INodeCompose
  showAddress?: boolean
  $labelContainer?: INodeCompose
}

export const $profileDisplay = (config: IProfilePreview) => {
  const { $container = $row, account, showAddress = true, profileSize = 45, $labelContainer } = config

  return $container(spacing.small, style({ alignItems: 'center', textDecoration: 'none' }))(
    $profileAvatar({ ...config, profileSize }),
    showAddress ? $AccountLabel(account, $labelContainer) : empty()
  )
}

export const $profileAvatar = (config: IAccountPreview) => {
  const { account, profileSize = 50 } = config
  // const profileEv = awaitPromises(blueberrySubgraph.owner(now({ id: account.toLowerCase() })))

  return $row(
    style({ width: `${profileSize}px`, borderRadius: '50%', overflow: 'hidden', height: `${profileSize}px` })
  )(
    $jazzicon(account)
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
    $column(style({ whiteSpace: 'nowrap', fontSize: '.85rem', alignItems: 'center' }))(
      $node(style({}))($text('0x----')),
      $node(style({ fontSize: '1.55em', lineHeight: 1 }))($text('----'))
    )
  )
}

export const $AccountLabel = (address: string, $container = $column) => {
  return $container(style({ alignItems: 'flex-end', flexDirection: 'row' }))(
    $node(style({ fontSize: '.85em', color: pallete.foreground }))($text(`${address.slice(0, 6)}..`)),
    $node(style({}))($text(address.slice(-4)))
  )
}
