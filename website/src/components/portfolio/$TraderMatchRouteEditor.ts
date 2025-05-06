import { map, mergeArray, snapshot } from '@most/core'
import type { Stream } from '@most/types'
import { getMatchKey, type IMatchRule } from '@puppet/middleware/core'
import { $caretDown, $icon } from '@puppet/middleware/ui-components'
import { unixTimestampNow } from '@puppet/middleware/utils'
import { $text, combineState, component, type IBehavior, type INodeCompose, style } from 'aelea/core'
import { $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { Hex } from 'viem'
import type { Address } from 'viem/accounts'
import type { IMatchingRule } from '../../__generated__/ponder.types.js'
import { $tokenTryLabeled } from '../../common/$common.js'
import { $responsiveFlex } from '../../common/elements/$common.js'
import { $seperator2 } from '../../pages/common.js'
import { $Popover } from '../$Popover.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'
import { $MatchRuleEditor, type IMatchingRuleEditorChange } from './$MatchRuleEditor.js'

interface ITraderMatchingRouteEditor {
  trader: Address
  matchedPuppetList: Address[]
  collateralToken: Address
  userMatchingRuleList: IMatchingRule[]
  $container?: INodeCompose
}

export const $defaultTraderMatchRouteEditorContainer = $row(spacing.small, style({ alignItems: 'center' }))

export const $TraderMatchingRouteEditor = (config: ITraderMatchingRouteEditor) =>
  component(
    (
      [popRouteSubscriptionEditor, popRouteSubscriptionEditorTether]: IBehavior<any, IMatchRule | undefined>,
      [discardDraft, discardDraftTether]: IBehavior<IMatchingRuleEditorChange>,
      [saveDraft, saveDraftTether]: IBehavior<IMatchingRuleEditorChange>
    ) => {
      const matchingKey = getMatchKey(config.collateralToken, config.trader)

      const {
        $container = $defaultTraderMatchRouteEditorContainer,
        trader,
        userMatchingRuleList,
        collateralToken,
        matchedPuppetList
      } = config

      const matchingRule = userMatchingRuleList.length
        ? userMatchingRuleList.find((mr) => getMatchKey(mr.collateralToken, mr.trader) === matchingKey)
        : undefined

      return [
        $Popover({
          $container,
          open: map(() => {
            return $MatchRuleEditor({
              matchingRule,
              matchingKey,
              collateralToken,
              trader
            })({
              remove: discardDraftTether(),
              save: saveDraftTether()
            })
          }, popRouteSubscriptionEditor),
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
          changeMatchRuleList: mergeArray([
            map((params) => {
              const index = userMatchingRuleList.findIndex(
                (x) => x.trader === trader && x.collateralToken === collateralToken
              )
              const newList: IMatchingRuleEditorChange[] = [...userMatchingRuleList]
              const change = {
                ...matchingRule,
                ...params.saveDraft
              }
              if (index === -1) {
                newList.push(change)
                return newList
              }

              newList[index] = change
              return newList
            }, combineState({ saveDraft })),
            map((draft) => {
              const index = userMatchingRuleList.findIndex((x) => x.trader === trader)
              const newList = [...userMatchingRuleList]

              if (index === -1) {
                return userMatchingRuleList
              }

              newList.splice(index, 1)
              return newList
            }, discardDraft)
          ])
        }
      ]
    }
  )
