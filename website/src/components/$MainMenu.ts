import {
  $element,
  $node,
  attr,
  component,
  type I$Node,
  type INodeCompose,
  type ISlottable,
  type IStyleCSS,
  nodeEvent,
  style,
  styleBehavior
} from 'aelea/core'
import type { IAnchor, Route } from 'aelea/router'
import { constant, empty, type IBehavior, o, startWith, zipMap } from 'aelea/stream'
import { $column, $row, isDesktopScreen, isMobileScreen, layoutSheet, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete, type Theme, theme } from 'aelea/ui-components-theme'
import type { EIP6963ProviderDetail } from 'mipd'
import { $anchor, $gitbook, $github, $icon, $moreDots, $twitter } from '@/ui-components'
import { $RouterAnchor } from '@/ui-router'
import { $puppetLogo } from '../common/$icons.js'
import type { IPageParams } from '../pages/type.js'
import { $Popover } from './$Popover.js'
import { $ThemePicker } from './$ThemePicker.js'
import { $walletProfileDisplay } from './$WalletProfileDisplay.js'
import { $ButtonSecondary } from './form/$Button.js'

interface MainMenu extends IPageParams {
  route: Route
}

export const $MainMenu = (config: MainMenu) =>
  component(
    (
      [routeChange, routeChangeTether]: IBehavior<string, string>,
      [clickPopoverClaim, clickPopoverClaimTether]: IBehavior<any, any>,
      [changeWallet, _changeWalletTether]: IBehavior<any, EIP6963ProviderDetail | null>,
      [changeTheme, changeThemeTether]: IBehavior<ISlottable, Theme>
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
        $iconAnchor(attr({ href: 'https://docs.puppet.tech' }))(
          $icon({ $content: $gitbook, width: '22px', viewBox: '0 0 32 32' })
        ),
        $iconAnchor(attr({ href: 'https://twitter.com/PuppetCopy' }))(
          $icon({ $content: $twitter, width: '22px', viewBox: '0 0 24 24' })
        ),
        $iconAnchor(attr({ href: 'https://github.com/PuppetCopy/monorepo' }))(
          $icon({ $content: $github, width: '22px', viewBox: '0 0 32 32' })
        )
      ]

      const themeState = startWith(theme, changeTheme)
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
              $anchor: $element('a')($icon({ $content: $puppetLogo, width: '45px', viewBox: '0 0 32 32' }))
            })({
              click: routeChangeTether()
            })
          ),

          $row(style({ flex: 1, alignItems: 'center', placeContent: 'center' }))(
            $pageLink({
              $container: $anchor(spacing.big, style({ padding: 0 })),
              route: route.create({ fragment: 'wallet', title: 'Portfolio' }),
              // anchorOp: style({  }),
              url: '/portfolio',
              $content: $walletProfileDisplay()
            })({
              click: routeChangeTether()
            })
          ),

          $row(spacing.big, style({ flex: 1, placeContent: 'flex-end', alignItems: 'center' }))(
            $extraMenuPopover,
            ...(isDesktopScreen ? $socialLinkList : [])
          )
        ),

        {
          routeChange,
          changeWallet
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
        }),
        styleBehavior(
          zipMap(
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
