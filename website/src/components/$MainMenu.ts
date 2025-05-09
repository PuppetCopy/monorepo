import { constant, multicast, startWith } from '@most/core'
import type { Stream } from '@most/types'
import {
  $anchor,
  $discord,
  $gitbook,
  $github,
  $icon,
  $instagram,
  $Link,
  $moreDots,
  $twitter
} from '@puppet/middleware/ui-components'
import {
  $element,
  $text,
  attr,
  combineArray,
  component,
  type I$Node,
  type IBehavior,
  type ISlottable,
  type IStyleCSS,
  nodeEvent,
  O,
  style,
  styleBehavior
} from 'aelea/core'
import { $RouterAnchor, type IAnchor, type Route } from 'aelea/router'
import { $column, $row, layoutSheet, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete, type Theme, theme, themeList } from 'aelea/ui-components-theme'
import type { EIP6963ProviderDetail } from 'mipd'
import { $gmxLogo, $puppetLogo } from '../common/$icons.js'
import { $stackedCoins, $trophy } from '../common/elements/$icons.js'
import type { IPageParams } from '../pages/type.js'
import { $Popover } from './$Popover.js'
import { $ThemePicker } from './$ThemePicker.js'
import { $walletProfileDisplay } from './$WalletProfileDisplay.js'
import { $ButtonSecondary } from './form/$Button.js'

interface MainMenu extends IPageParams {
  route: Route
  showAccount?: boolean
}

export const $MainMenu = (config: MainMenu) =>
  component(
    (
      [routeChange, routeChangeTether]: IBehavior<string, string>,
      [clickPopoverClaim, clickPopoverClaimTether]: IBehavior<any, any>,
      [changeWallet, changeWalletTether]: IBehavior<any, EIP6963ProviderDetail | null>,
      [changeTheme, changeThemeTether]: IBehavior<ISlottable, Theme>
    ) => {
      const { route, showAccount } = config

      const $circleButtonAnchor = $anchor(
        style({
          padding: '0 4px',
          border: `2px solid ${pallete.horizon}`,
          display: 'flex',
          borderRadius: '50%',
          alignItems: 'center',
          placeContent: 'center',
          height: '42px',
          width: '42px'
        })
      )

      const themeState = startWith(theme, changeTheme)
      const $extraMenuPopover = $Popover({
        open: constant(
          $column(spacing.big)(
            // ...isMobileScreen ? $menuItemList : [],
            // $row(spacing.big, style({ flexWrap: 'wrap', width: '210px' }))(
            //   $anchor(layoutSheet.displayFlex, style({ padding: '0 4px', border: `2px solid ${pallete.horizon}`, borderRadius: '50%', alignItems: 'center', placeContent: 'center', height: '42px', width: '42px' }), attr({ href: 'https://docs.blueberry.club/' }))(
            //     $icon({ $content: $gitbook, width: '22px', viewBox: `0 0 32 32` })
            //   ),
            //   $anchor(layoutSheet.displayFlex, style({ padding: '0 4px', border: `2px solid ${pallete.horizon}`, borderRadius: '50%', alignItems: 'center', placeContent: 'center', height: '42px', width: '42px' }), attr({ href: 'https://discord.com/invite/7ZMmeU3z9j' }))(
            //     $icon({ $content: $discord, width: '22px', viewBox: `0 0 32 32` })
            //   ),
            //   $anchor(layoutSheet.displayFlex, style({ padding: '0 4px', border: `2px solid ${pallete.horizon}`, borderRadius: '50%', alignItems: 'center', placeContent: 'center', height: '42px', width: '42px' }), attr({ href: 'https://twitter.com/PuppetFinance' }))(
            //     $icon({ $content: $twitter, width: '22px', viewBox: `0 0 24 24` })
            //   ),
            //   $anchor(layoutSheet.displayFlex, style({ padding: '0 4px', border: `2px solid ${pallete.horizon}`, borderRadius: '50%', alignItems: 'center', placeContent: 'center', height: '42px', width: '42px' }), attr({ href: 'https://www.instagram.com/blueberryclub.eth' }))(
            //     $icon({ $content: $instagram, width: '18px', viewBox: `0 0 32 32` })
            //   ),
            //   $anchor(layoutSheet.displayFlex, style({ padding: '0 4px', border: `2px solid ${pallete.horizon}`, borderRadius: '50%', alignItems: 'center', placeContent: 'center', height: '42px', width: '42px' }), attr({ href: 'https://github.com/nissoh/blueberry-club' }))(
            //     $icon({ $content: $github, width: '22px', viewBox: `0 0 32 32` })
            //   ),
            // ),

            $ButtonSecondary({
              $content: $ThemePicker(themeState)({
                changeTheme: changeThemeTether()
              })
            })({})

            // switchLatest(snapshot((_, walletQuery) => {
            //   if (walletQuery === null) {
            //     return empty()
            //   }

            //   return $ButtonSecondary({
            //     $content: $text('Disconnect Wallet')
            //   })({
            //     click: changeWalletTether(
            //       map(async xx => {

            //         // Check if connection is already established
            //         await disconnect(wagmiConfig)

            //       }),
            //       awaitPromises
            //     )
            //   })
            // }, changeWallet, walletClientQuery)),
          ),
          clickPopoverClaim
        ),
        dismiss: routeChange,
        $target: $circleButtonAnchor(
          $icon({
            svgOps: O(
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
        )
      })({
        // overlayClick: clickPopoverClaimTether()
      })

      return [
        $row(
          // styleBehavior(map(isOpen => ({ width: isOpen ? '210px' : '78px' }), isMenuOpen)),
          spacing.big,
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
              $anchor: $element('a')(style({ padding: '8px', margin: '8px' }))(
                $icon({ $content: $puppetLogo, width: '45px', viewBox: '0 0 32 32' })
              )
            })({
              click: routeChangeTether()
            })
          ),

          $row(
            spacing.big,
            style({ flex: 1, alignItems: 'center', placeContent: 'center' })
          )(
            style({ padding: 0 })(
              $pageLink({
                route: route.create({ fragment: 'wallet', title: 'Portfolio' }),
                // anchorOp: style({  }),
                url: '/wallet',
                $content: $walletProfileDisplay()
              })({
                click: routeChangeTether()
              })
            )
            // $pageLink({
            //   $content: $row(spacing.default, style({ alignItems: 'center', cursor: 'pointer', borderRadius: '50px', pointerEvents: 'none' }))(
            //     $icon({ $content: $trophy, svgOps: style({ width: '28px', aspectRatio: `1 / 1` }), viewBox: '0 0 32 32' }),
            //     $text(style({ fontSize: '1.15rem' }))('Leaderboard')
            //   ),
            //   route: route.create({ fragment: 'leaderboard' }),
            //   url: '/app/leaderboard',
            // })({
            //   click: routeChangeTether()
            // }),
            // $pageLink({
            //   $content: $row(spacing.default, style({ alignItems: 'center', cursor: 'pointer',  borderRadius: '50px', pointerEvents: 'none' }))(
            //     $icon({ $content: $gmxLogo, svgOps: style({ width: '28px', aspectRatio: `1 / 1` }), viewBox: '0 0 32 32' }),
            //     $text(style({ fontSize: '1.15rem' }))('Trade')
            //   ),
            //   route: route.create({ fragment: 'trade' }),
            //   url: '/app/trade',
            // })({
            //   click: routeChangeTether()
            // }),
          ),

          $row(spacing.big, style({ flex: 1, placeContent: 'flex-end', alignItems: 'center' }))(
            // $SwitchNetworkDropdown()({}),
            $extraMenuPopover,
            // $circleButtonAnchor(attr({ href: 'https://docs.blueberry.club/' }))(
            //   $icon({ $content: $gitbook, fill: pallete.middleground, width: '22px', viewBox: `0 0 32 32` })
            // ),
            // $circleButtonAnchor(attr({ href: 'https://discord.com/invite/7ZMmeU3z9j' }))(
            //   $icon({ $content: $discord, fill: pallete.middleground, width: '22px', viewBox: `0 0 32 32` })
            // ),
            $circleButtonAnchor(attr({ href: 'https://twitter.com/PuppetCopy' }))(
              $icon({ $content: $twitter, fill: pallete.foreground, width: '22px', viewBox: '0 0 24 24' })
            )
          )
        ),

        {
          routeChange,
          changeWallet
        }
      ]
    }
  )

export const $MainMenuMobile = (config: MainMenu) =>
  component(
    (
      [routeChange, routeChangeTether]: IBehavior<string, string>,
      [clickPopoverClaim, clickPopoverClaimTether]: IBehavior<any, any>,
      [changeTheme, changeThemeTether]: IBehavior<ISlottable, Theme>
    ) => {
      const { route, showAccount = true } = config
      const routeChangeMulticast = multicast(routeChange)

      const $popoverPageLink = ($iconPath: I$Node<SVGPathElement>, text: string | Stream<string>) =>
        $row(style({ alignItems: 'center', cursor: 'pointer' }))(
          $icon({
            $content: $iconPath,
            width: '16px',
            fill: pallete.foreground,
            svgOps: style({ minWidth: '36px' }),
            viewBox: '0 0 32 32'
          }),
          $text(text)
        )

      const $circleButtonAnchor = $anchor(
        style({
          padding: '0 4px',
          border: `2px solid ${colorAlpha(pallete.foreground, 0.25)}`,
          display: 'flex',
          borderRadius: '50%',
          alignItems: 'center',
          placeContent: 'center',
          height: '42px',
          width: '42px'
        })
      )

      const $extraMenuPopover = $Popover({
        open: constant(
          $column(spacing.big)(
            $Link({
              $content: $popoverPageLink($gmxLogo, 'Trade'),
              url: '/app/trade',
              route: route.create({ fragment: 'feefwefwe' })
            })({
              // $Link({ $content: $pageLink($gmxLogo, 'Trade'), url: '/app/trade', disabled: now(false), route: parentRoute.create({ fragment: 'feefwefwe' }) })({
              click: routeChangeTether()
            }),
            $Link({
              $content: $popoverPageLink($stackedCoins, 'Leaderboard'),
              url: '/app/leaderboard',
              route: route.create({ fragment: 'feefwefwe' })
            })({
              click: routeChangeTether()
            }),

            // ...isMobileScreen ? $menuItemList : [],
            $row(spacing.big, style({ flexWrap: 'wrap', width: '210px' }))(
              $anchor(
                layoutSheet.displayFlex,
                style({
                  padding: '0 4px',
                  border: `2px solid ${pallete.horizon}`,
                  borderRadius: '50%',
                  alignItems: 'center',
                  placeContent: 'center',
                  height: '42px',
                  width: '42px'
                }),
                attr({ href: 'https://docs.blueberry.club/' })
              )($icon({ $content: $gitbook, width: '22px', viewBox: '0 0 32 32' })),
              $anchor(
                layoutSheet.displayFlex,
                style({
                  padding: '0 4px',
                  border: `2px solid ${pallete.horizon}`,
                  borderRadius: '50%',
                  alignItems: 'center',
                  placeContent: 'center',
                  height: '42px',
                  width: '42px'
                }),
                attr({ href: 'https://discord.com/invite/7ZMmeU3z9j' })
              )($icon({ $content: $discord, width: '22px', viewBox: '0 0 32 32' })),
              $anchor(
                layoutSheet.displayFlex,
                style({
                  padding: '0 4px',
                  border: `2px solid ${pallete.horizon}`,
                  borderRadius: '50%',
                  alignItems: 'center',
                  placeContent: 'center',
                  height: '42px',
                  width: '42px'
                }),
                attr({ href: 'https://twitter.com/PuppetFinance' })
              )($icon({ $content: $twitter, width: '22px', viewBox: '0 0 24 24' })),
              $anchor(
                layoutSheet.displayFlex,
                style({
                  padding: '0 4px',
                  border: `2px solid ${pallete.horizon}`,
                  borderRadius: '50%',
                  alignItems: 'center',
                  placeContent: 'center',
                  height: '42px',
                  width: '42px'
                }),
                attr({ href: 'https://www.instagram.com/blueberryclub.eth' })
              )($icon({ $content: $instagram, width: '18px', viewBox: '0 0 32 32' })),
              $anchor(
                layoutSheet.displayFlex,
                style({
                  padding: '0 4px',
                  border: `2px solid ${pallete.horizon}`,
                  borderRadius: '50%',
                  alignItems: 'center',
                  placeContent: 'center',
                  height: '42px',
                  width: '42px'
                }),
                attr({ href: 'https://github.com/nissoh/blueberry-club' })
              )($icon({ $content: $github, width: '22px', viewBox: '0 0 32 32' }))
            ),

            $ButtonSecondary({
              $content: $ThemePicker(startWith(theme, changeTheme))({})
            })({})

            // switchLatest(snapshot((_, wallet) => {
            //   if (wallet === null) {
            //     return empty()
            //   }

            //   return $ButtonSecondary({
            //     $content: $text('Disconnect Wallet')
            //   })({
            //     click: walletChangeTether(
            //       map(async xx => {

            //         // Check if connection is already established
            //         // await disconnect(wagmiConfig)

            //       }),
            //       awaitPromises
            //     )
            //   })
            // }, walletChange, walletClientQuery)),
          ),
          clickPopoverClaim
        ),
        dismiss: routeChangeMulticast,
        $target: $circleButtonAnchor(
          $icon({
            svgOps: O(
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
        )
      })({
        // overlayClick: clickPopoverClaimTether()
      })

      return [
        $row(
          spacing.big,
          style({
            padding: '14px',
            flexShrink: 0,
            alignItems: 'flex-end',
            borderRadius: '30px',
            placeContent: 'space-between'
          })
        )(
          $row(
            spacing.big,
            style({ alignItems: 'center', flex: 1 })
          )(
            $RouterAnchor({
              url: '/',
              route: route,
              $anchor: $element('a')($icon({ $content: $puppetLogo, width: '45px', viewBox: '0 0 32 32' }))
            })({
              click: routeChangeTether()
            })
          ),

          $row(
            spacing.default,
            style({ flex: 1, alignItems: 'center', placeContent: 'center' })
          )(
            style({ padding: 0 })(
              $pageLink({
                route: route.create({ fragment: 'wallet', title: 'Portfolio' }),
                // anchorOp: style({  }),
                url: '/app/wallet',
                $content: $walletProfileDisplay()
              })({
                click: routeChangeTether()
              })
            )
          ),

          $row(spacing.big, style({ placeContent: 'flex-end', flex: 1 }))($extraMenuPopover)
        ),

        {
          routeChange: routeChangeMulticast
        }
      ]
    }
  )

const $pageLink = (config: Omit<IAnchor, '$anchor'> & { $content: I$Node }) => {
  return component(
    (
      [click, clickTether]: IBehavior<string, string>,
      [active, containsTether]: IBehavior<boolean, boolean>,
      [focus, focusTether]: IBehavior<boolean, boolean>
    ) => {
      const $anchorEl = $anchor(
        style({
          borderRadius: '50px',
          padding: '11px 22px',
          border: `1px solid ${colorAlpha(pallete.foreground, 0.2)}`
        }),
        styleBehavior(
          combineArray(
            (isActive, isFocus): IStyleCSS | null => {
              return isActive
                ? {
                    backgroundColor: `${pallete.background} !important`,
                    fill: pallete.foreground,
                    borderColor: `${pallete.primary} !important`,
                    cursor: 'default  !important'
                  }
                : isFocus
                  ? { backgroundColor: `${pallete.background} !important`, fill: pallete.foreground }
                  : null
            },
            active,
            focus
          )
        )
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
