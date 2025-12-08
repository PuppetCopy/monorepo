import type { IAnchor, Route } from 'aelea/router'
import { constant, empty, map, o, start } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import {
  $element,
  $node,
  $text,
  attr,
  component,
  type I$Node,
  type INode,
  type INodeCompose,
  type ISlottable,
  nodeEvent,
  style,
  stylePseudo
} from 'aelea/ui'
import { $column, $row, isDesktopScreen, isMobileScreen, layoutSheet, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete, type Theme, theme } from 'aelea/ui-components-theme'
import { $seperator2 } from 'src/pages/common.js'
import wallet, { type IAccountState } from 'src/wallet/wallet.js'
import {
  $alertIntermediateSpinnerContainer,
  $anchor,
  $gitbook,
  $github,
  $icon,
  $intermediatePromise,
  $moreDots,
  $twitter
} from '@/ui-components'
import { $RouterAnchor } from '@/ui-router'
import { $puppetLogo } from '../common/$icons.js'
import type { IPageParams } from '../pages/types.js'
import { $disconnectedWalletDisplay, $profileDisplay } from './$AccountProfile.js'
import { $Popover } from './$Popover.js'
import { $ThemePicker } from './$ThemePicker.js'
import { $WalletConnect } from './$WalletConnect.js'
import { $ButtonSecondary } from './form/$Button.js'

interface MainMenu extends IPageParams {
  route: Route
}

export const $MainMenu = (config: MainMenu) =>
  component(
    (
      [routeChange, routeChangeTether]: IBehavior<string, string>,
      [clickPopoverClaim, clickPopoverClaimTether]: IBehavior<any, any>,
      [changeTheme, changeThemeTether]: IBehavior<ISlottable, Theme>,
      [selectConnector, selectConnectorTether]: IBehavior<IAccountState>, //
      [targetClick, targetClickTether]: IBehavior<INode, PointerEvent>
    ) => {
      const { route } = config

      const $iconAnchor = $anchor(
        layoutSheet.displayFlex,
        style({
          padding: '0 4px',
          border: `1px solid ${colorAlpha(pallete.foreground, 0.2)}`,
          borderRadius: '50%',
          alignItems: 'center',
          placeContent: 'center',
          height: '42px',
          width: '42px'
        }),
        attr({ href: 'https://docs.puppet.tech' })
      )

      const $iconCircular = $node(
        layoutSheet.displayFlex,
        style({
          padding: '0 4px',
          border: `1px solid ${colorAlpha(pallete.foreground, 0.2)}`,
          borderRadius: '50%',
          alignItems: 'center',
          placeContent: 'center',
          height: '42px',
          width: '42px'
        })
      )

      const $socialLinkList = [
        $iconAnchor(attr({ href: 'https://docs.puppet.tech', 'aria-label': 'Documentation' }))(
          $icon({ $content: $gitbook, width: '22px', viewBox: '0 0 32 32' })
        ),
        $iconAnchor(attr({ href: 'https://twitter.com/PuppetCopy', 'aria-label': 'Twitter' }))(
          $icon({ $content: $twitter, width: '22px', viewBox: '0 0 24 24' })
        ),
        $iconAnchor(attr({ href: 'https://github.com/PuppetCopy/monorepo', 'aria-label': 'GitHub' }))(
          $icon({ $content: $github, width: '22px', viewBox: '0 0 32 32' })
        )
      ]

      const themeState = start(theme, changeTheme)
      const $extraMenuPopover = $Popover({
        $container: $iconCircular,
        $open: constant(
          $column(spacing.default)(
            isMobileScreen
              ? $row(spacing.big, style({ flexWrap: 'wrap', placeContent: 'center' }))(...$socialLinkList)
              : empty,
            $ButtonSecondary({
              $content: $ThemePicker(themeState)({
                changeTheme: changeThemeTether()
              })
            })({})
          ),
          clickPopoverClaim
        ),
        dismiss: routeChange,
        $target: $icon({
          svgOps: o(
            clickPopoverClaimTether(nodeEvent('click')),
            style({
              padding: '6px',
              cursor: 'pointer',
              alignSelf: 'center',
              transform: 'rotate(90deg)'
            })
          ),
          width: '32px',
          $content: $moreDots,
          viewBox: '0 0 32 32'
        })
      })({})

      const $target = $row(
        spacing.small,
        style({
          borderRadius: '50px',
          border: `1px solid ${colorAlpha(pallete.foreground, 0.2)}`,
          alignItems: 'center',
          paddingRight: '16px',
          cursor: 'pointer'
        }),
        stylePseudo(':hover', {
          border: `1px solid ${pallete.foreground}`
        }),
        targetClickTether(nodeEvent('pointerdown'))
      )(
        $disconnectedWalletDisplay(),
        $seperator2,
        $column(style({ fontSize: '.8rem' }))($text('Click to'), style({ fontWeight: 'bold' })($node($text('Connect'))))
      )

      return [
        $row(
          spacing.default,
          style({
            transition: 'width .3s ease-in-out',
            overflow: 'hidden',
            zIndex: 22,
            padding: '18px 12px',
            maxHeight: '100vh',
            flexShrink: 0,
            placeContent: 'space-between'
          })
        )(
          $column(
            spacing.big,
            style({ flex: 1, alignItems: 'flex-start' })
          )(
            $RouterAnchor({
              url: '/',
              route: route,
              $anchor: $element('a')(attr({ 'aria-label': 'Home' }))(
                $icon({ $content: $puppetLogo, width: '45px', viewBox: '0 0 32 32' })
              )
            })({
              click: routeChangeTether()
            })
          ),

          $row(style({ flex: 1, alignItems: 'center', placeContent: 'center' }))(
            $intermediatePromise({
              $loader: $node(style({ position: 'relative', display: 'inline-flex', borderRadius: '999px' }))(
                style({ position: 'relative', borderRadius: 'inherit' })($target),
                style({
                  position: 'absolute',
                  inset: '0px',
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 0,
                  borderRadius: 'inherit'
                })(
                  style({ width: '100%', height: '100%', borderRadius: 'inherit', overflow: 'hidden' })(
                    $alertIntermediateSpinnerContainer()
                  )
                )
              ),
              $display: map(async connectionQuery => {
                const connection = await connectionQuery

                if (!connection) {
                  return $Popover({
                    $target,
                    $open: map(() => {
                      return $WalletConnect()({
                        connect: selectConnectorTether()
                      })
                    }, targetClick),
                    dismiss: selectConnector
                  })({})
                }

                return $row(
                  spacing.small,
                  style({ alignItems: 'center' })
                )(
                  $pageLink({
                    $container: $anchor(spacing.big, style({ padding: 0 })),
                    route: route.create({ fragment: 'wallet', title: 'Portfolio' }),
                    url: '/portfolio',
                    $content: $row(
                      spacing.small,
                      style({ alignItems: 'center', pointerEvents: 'none', paddingRight: '16px' })
                    )(
                      connection.address
                        ? $profileDisplay({ address: connection.address })
                        : style({ cursor: 'pointer' }, $disconnectedWalletDisplay())
                    )
                  })({
                    click: routeChangeTether()
                  })
                )
              }, wallet.account)
            })
          ),

          $row(spacing.big, style({ flex: 1, placeContent: 'flex-end', alignItems: 'center' }))(
            $extraMenuPopover,
            ...(isDesktopScreen ? $socialLinkList : [])
          )
        ),

        {
          routeChange
        }
      ]
    }
  )

const $pageLink = (config: Omit<IAnchor, '$anchor'> & { $container?: INodeCompose; $content: I$Node }) => {
  return component(
    (
      [click, clickTether]: IBehavior<string, string>,
      [active, containsTether]: IBehavior<boolean, boolean>,
      [focus, focusTether]: IBehavior<boolean, boolean>
    ) => {
      const $anchorEl = (
        config.$container ??
        $anchor(
          style({
            padding: '11px 22px'
          })
        )
      )(
        style({
          borderRadius: '50px',
          border: `1px solid ${colorAlpha(pallete.foreground, 0.2)}`
        })
        // styleBehavior(
        //   map((params): IStyleCSS | null => {
        //     return params.active
        //       ? {
        //           backgroundColor: `${pallete.background} !important`,
        //           fill: pallete.foreground,
        //           borderColor: `${pallete.primary} !important`,
        //           cursor: 'default  !important'
        //         }
        //       : params.focus
        //         ? { backgroundColor: `${pallete.background} !important`, fill: pallete.foreground }
        //         : null
        //   }, zip({ active, focus }))
        // )
        // styleBehavior(map(isDisabled => (isDisabled ?  { pointerEvents: 'none', opacity: .3 } : {}), disabled))
      )(config.$content)

      return [
        $RouterAnchor({ $anchor: $anchorEl, url: config.url, route: config.route })({
          click: clickTether(),
          focus: focusTether(),
          contains: containsTether()
        }),

        { click, active, focus }
      ]
    }
  )
}
