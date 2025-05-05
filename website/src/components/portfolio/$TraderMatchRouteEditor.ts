import { map, mergeArray, snapshot } from '@most/core'
import type { Stream } from '@most/types'
import { getMatchKey, type IMatchRule } from '@puppet/middleware/core'
import { $caretDown, $icon } from '@puppet/middleware/ui-components'
import { unixTimestampNow } from '@puppet/middleware/utils'
import { $text, combineState, component, type IBehavior, type INodeCompose, style, styleBehavior } from 'aelea/core'
import { $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { Hex } from 'viem'
import type { Address } from 'viem/accounts'
import { $tokenTryLabeled } from '../../common/$common.js'
import { $responsiveFlex } from '../../common/elements/$common.js'
import { $seperator2 } from '../../pages/common.js'
import { $Popover } from '../$Popover.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'
import { $MatchRuleEditor, type IDraftMatchRule } from './$MatchRuleEditor.js'

export interface IMatchRuleEditorChange {
  draft: IDraftMatchRule
  trader: Address
  expiry: number
  collateralToken: Address
}

interface ITraderMatchingRouteEditor {
  trader: Address
  matchedPuppetList: Address[]
  collateralToken: Address
  userMatchingRuleList: Stream<IMatchRuleEditorChange[]>
  $container?: INodeCompose
}

export const $defaultTraderMatchRouteEditorContainer = $row(spacing.small, style({ alignItems: 'center' }))

export const $TraderMatchingRouteEditor = (config: ITraderMatchingRouteEditor) =>
  component(
    (
      [popRouteSubscriptionEditor, popRouteSubscriptionEditorTether]: IBehavior<any, IMatchRule | undefined>,

      [discardDraft, discardDraftTether]: IBehavior<IDraftMatchRule>,
      [saveDraft, saveDraftTether]: IBehavior<IDraftMatchRule>
    ) => {
      const matchingKey = getMatchKey(config.collateralToken, config.trader)

      const {
        $container = $defaultTraderMatchRouteEditorContainer,
        trader,
        userMatchingRuleList,
        collateralToken,
        matchedPuppetList
      } = config

      const matchedMatchingRule = map((ruleList) => {
        return ruleList.length
          ? ruleList.find((mr) => getMatchKey(mr.collateralToken, mr.trader) === matchingKey)
          : undefined
      }, userMatchingRuleList)

      return [
        $Popover({
          $container,
          open: snapshot(
            (matchRule) => {
              return $MatchRuleEditor(matchRule)({
                remove: discardDraftTether(),
                save: saveDraftTether()
              })
            },
            matchedMatchingRule,
            popRouteSubscriptionEditor
          ),
          dismiss: mergeArray([saveDraft, discardDraft]),
          $target: $ButtonSecondary({
            $content: $responsiveFlex(style({ alignItems: 'center', gap: isDesktopScreen ? '12px' : '4px' }))(
              $row(style({ alignItems: 'center' }))($tokenTryLabeled(collateralToken)),
              $seperator2,
              $row(style({ gap: '6px' }))(
                $text('Copy'),
                $icon({
                  $content: $caretDown,
                  width: '12px',
                  svgOps: style({ marginTop: '2px', minWidth: '8px' }),
                  viewBox: '0 0 32 32'
                })
              )
            ),
            $container: $defaultMiniButtonSecondary(
              style({
                borderRadius: '16px',
                padding: '8px',
                height: 'auto'
              }),

              styleBehavior(
                map((rule) => {
                  return {
                    borderColor:
                      rule && rule.expiry > unixTimestampNow() ? pallete.primary : colorAlpha(pallete.foreground, 0.25)
                  }
                }, matchedMatchingRule)
              )
            )
          })({
            click: popRouteSubscriptionEditorTether()
          })
        })({}),
        {
          changeMatchRuleList: mergeArray([
            snapshot(
              (list, params) => {
                const index = list.findIndex((x) => x.trader === trader)
                const newList = [...list]
                const change = {
                  draft: params.saveDraft,
                  trader,
                  collateralToken: collateralToken,
                  matchRule: matchedMatchingRule
                }
                if (index === -1) {
                  newList.push(change)
                  return newList
                }

                newList[index] = change
                return newList
              },
              userMatchingRuleList,
              combineState({ saveDraft })
            ),
            snapshot(
              (list, draft) => {
                const index = list.findIndex((x) => x.trader === trader)
                const newList = [...list]

                if (index === -1) {
                  return list
                }

                newList.splice(index, 1)
                return newList
              },
              userMatchingRuleList,
              discardDraft
            )
          ])
        }
      ]
    }
  )
