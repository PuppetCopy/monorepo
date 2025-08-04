import { getTraderMatchingKey, unixTimestampNow } from '@puppet-copy/middleware/core'
import { $caretDown, $icon } from '../ui-components'
import type { ISetMatchingRule } from '@puppet-copy/sql/schema'
import { $text, component, type INodeCompose, style } from 'aelea/core'
import { empty, type IBehavior, type IStream, map } from 'aelea/stream'
import { $row, isDesktopScreen, isMobileScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { Hex } from 'viem'
import type { Address } from 'viem/accounts'
import { $tokenTryLabeled } from '../../common/$common.js'
import { $responsiveFlex } from '../../common/elements/$common.js'
import { $seperator2 } from '../../pages/common.js'
import { $Popover } from '../$Popover.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'
import { $MatchingRuleEditor, type ISetMatchingRuleEditorDraft } from './$MatchingRuleEditor.js'

interface ITraderMatchingRouteEditor {
  trader: Address
  traderMatchedPuppetList: Hex[]
  userMatchingRuleList: ISetMatchingRule[]
  collateralToken: Address
  displayCollateralTokenSymbol?: boolean
  draftMatchingRuleList: IStream<ISetMatchingRuleEditorDraft[]>
  $container?: INodeCompose
}

export const $defaultTraderMatchRouteEditorContainer = $row(spacing.small, style({ alignItems: 'center' }))

export const $RouteEditor = (config: ITraderMatchingRouteEditor) =>
  component(
    (
      [popRouteSubscriptionEditor, popRouteSubscriptionEditorTether]: IBehavior<any, ISetMatchingRule | undefined>,
      [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<ISetMatchingRuleEditorDraft[]>
    ) => {
      const traderMatchingKey = getTraderMatchingKey(config.collateralToken, config.trader)

      const {
        $container = $defaultTraderMatchRouteEditorContainer,
        draftMatchingRuleList,
        trader,
        collateralToken,
        traderMatchedPuppetList,
        userMatchingRuleList,
        displayCollateralTokenSymbol = false
      } = config

      const matchingRule = userMatchingRuleList.length
        ? userMatchingRuleList.find(mr => getTraderMatchingKey(mr.collateralToken, mr.trader) === traderMatchingKey)
        : undefined

      return [
        $Popover({
          $container,
          $open: map(() => {
            return $MatchingRuleEditor({
              draftMatchingRuleList,
              model: matchingRule,
              traderMatchingKey,
              collateralToken,
              trader
            })({
              changeMatchRuleList: changeMatchRuleListTether()
            })
          }, popRouteSubscriptionEditor),
          dismiss: changeMatchRuleList,
          $target: $ButtonSecondary({
            $content: $responsiveFlex(style({ alignItems: 'center', gap: isDesktopScreen ? '8px' : '4px' }))(
              $row(style({ alignItems: 'center' }))(
                $tokenTryLabeled(collateralToken, displayCollateralTokenSymbol),
                isMobileScreen
                  ? $icon({
                      $content: $caretDown,
                      width: '12px',
                      svgOps: style({ marginLeft: '4px', minWidth: '8px' }),
                      viewBox: '0 0 32 32'
                    })
                  : empty
              ),
              $seperator2,
              $row(style({ gap: '6px' }))(
                $text('Copy'),
                isDesktopScreen
                  ? $icon({
                      $content: $caretDown,
                      width: '12px',
                      svgOps: style({ marginTop: '2px', minWidth: '8px' }),
                      viewBox: '0 0 32 32'
                    })
                  : empty
              )
            ),
            $container: $defaultMiniButtonSecondary(
              style({
                borderRadius: '16px',
                padding: '8px',
                height: 'auto'
              }),

              style({
                borderColor:
                  matchingRule && matchingRule.expiry > unixTimestampNow()
                    ? pallete.primary
                    : colorAlpha(pallete.foreground, 0.25)
              })
            )
          })({
            click: popRouteSubscriptionEditorTether()
          })
        })({}),
        {
          changeMatchRuleList
        }
      ]
    }
  )
