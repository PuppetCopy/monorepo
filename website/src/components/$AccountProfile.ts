import { $Node, $node, $text, NodeComposeFn, style } from "aelea/dom"
import { $column, $row, layoutSheet } from "aelea/ui-components"
import { pallete } from "aelea/ui-components-theme"
// import { blueberrySubgraph } from "@gambitdao/gbc-middleware"
import { awaitPromises, empty, now } from "@most/core"
import * as viem from "viem"
import { $jazzicon } from "../common/$avatar.js"


export interface IAccountPreview {
  account: viem.Address
  labelSize?: string
  profileSize?: number
}

export interface IProfilePreview extends IAccountPreview {
  $container?: NodeComposeFn<$Node>
  showAddress?: boolean
  $labelContainer?: NodeComposeFn<$Node>
}



export const $profileDisplay = (config: IProfilePreview) => {
  const { $container = $row, account, showAddress = true, profileSize = 45, $labelContainer } = config

  return $container(spacing.small, style({ alignItems: 'center', textDecoration: 'none' }))(
    $profileAvatar({ ...config, profileSize }),
    showAddress ? $AccountLabel(account, $labelContainer) : empty(),
  )
}


export const $profileAvatar = (config: IAccountPreview) => {
  const { account, profileSize = 50 } = config
  // const profileEv = awaitPromises(blueberrySubgraph.owner(now({ id: account.toLowerCase() })))

  return $row(style({ width: `${profileSize}px`, borderRadius: '50%', overflow: 'hidden', height: `${profileSize}px` }))(
    $jazzicon(account),
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
    $wrapper(style({ display: 'flex', border: `1px solid ${pallete.foreground}`, placeContent: 'center', alignItems: 'center' }))(
      $text(style({ fontWeight: 800, color: pallete.foreground }))('?')
    ),
    $column(style({ whiteSpace: 'nowrap', fontSize: '.85rem', alignItems: 'center' }))(
      $text(style({}))('0x----'),
      $text(style({ fontSize: '1.55em', lineHeight: 1 }))('----')
    )
  )
}


export const $AccountLabel = (address: string, $container = $column) => {
  return $container(style({ alignItems: 'flex-end', flexDirection: 'row' }))(
    $text(style({ fontSize: '.85em', color: pallete.foreground }))(`${address.slice(0, 6)}..`),
    $text(style({  }))(address.slice(-4)),
  )
}



