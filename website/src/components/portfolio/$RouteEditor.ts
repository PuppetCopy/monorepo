import { getTraderMatchingKey, unixTimestampNow } from '@puppet-copy/middleware/core'
import type { ISetMatchingRule } from '@puppet-copy/sql/schema'
import { awaitPromises, empty, type IStream, map, switchMap } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $text, component, type INodeCompose, style, styleBehavior } from 'aelea/ui'
import { $row, isDesktopScreen, isMobileScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $caretDown, $icon } from '@/ui-components'
import { $tokenIconByAddress } from '../../common/$common.js'
import { $responsiveFlex } from '../../common/elements/$common.js'
import { $seperator2 } from '../../pages/common.js'
import { $Popover } from '../$Popover.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'
import { $MatchingRuleEditor, type ISetMatchingRuleEditorDraft } from './$MatchingRuleEditor.js'

interface ITraderMatchingRouteEditor {
  trader: Address
  userMatchingRuleQuery: IStream<Promise<ISetMatchingRule[]>>
  collateralToken: Address
  draftMatchingRuleList: IStream<ISetMatchingRuleEditorDraft[]>
  $container?: INodeCompose
}

export const $defaultTraderMatchRouteEditorContainer = $row(spacing.small, style({ alignItems: 'center' }))

export const $RouteEditor = (config: ITraderMatchingRouteEditor) =>
  component(
    (
      [popRouteSubscriptionEditor, popRouteSubscriptionEditorTether]: IBehavior<PointerEvent>,
      [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<ISetMatchingRuleEditorDraft[]>
    ) => {
      const traderMatchingKey = getTraderMatchingKey(config.collateralToken, config.trader)

      const {
        $container = $defaultTraderMatchRouteEditorContainer,
        draftMatchingRuleList,
        trader,
        collateralToken,
        userMatchingRuleQuery
      } = config

      const matchingRule = map(list => {
        return list.find(mr => getTraderMatchingKey(mr.collateralToken, mr.trader) === traderMatchingKey)
      }, awaitPromises(userMatchingRuleQuery))

      const borderColorStyle = map(
        rule =>
          rule && rule.expiry > unixTimestampNow()
            ? { borderColor: pallete.primary }
            : { borderColor: colorAlpha(pallete.foreground, 0.25) },
        matchingRule
      )

      return [
        $Popover({
          $container,
          $open: switchMap(
            () =>
              map(
                rule =>
                  $MatchingRuleEditor({
                    draftMatchingRuleList,
                    model: rule,
                    traderMatchingKey,
                    collateralToken,
                    trader
                  })({
                    changeMatchRuleList: changeMatchRuleListTether()
                  }),
                matchingRule
              ),
            popRouteSubscriptionEditor
          ),
          dismiss: changeMatchRuleList,
          $target: $ButtonSecondary({
            $content: $responsiveFlex(style({ alignItems: 'center', gap: isDesktopScreen ? '6px' : '4px' }))(
              $row(style({ alignItems: 'center' }))(
                $tokenIconByAddress(collateralToken, isDesktopScreen ? '38px' : '24px'),
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
                      width: '8px',
                      svgOps: style({ marginTop: '2px', minWidth: '8px', marginRight: '8px' }),
                      viewBox: '0 0 32 32'
                    })
                  : empty
              )
            ),
            $container: $defaultMiniButtonSecondary(
              isDesktopScreen
                ? style({
                    borderRadius: '100px',
                    padding: '0',
                    height: 'auto'
                  })
                : style({
                    borderRadius: '8px',
                    padding: '4px 8px',
                    height: 'auto'
                  }),
              styleBehavior(borderColorStyle)
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
