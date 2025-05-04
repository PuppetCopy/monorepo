import { constant, map, mergeArray, snapshot } from '@most/core'
import type { Stream } from '@most/types'
import type { IMatchRule } from '@puppet/middleware/core'
import { $caretDown, $icon } from '@puppet/middleware/ui-components'
import { unixTimestampNow } from '@puppet/middleware/utils'
import type { GetAccountReturnType } from '@wagmi/core'
import { $text, combineState, component, type IBehavior, type INodeCompose, style } from 'aelea/core'
import { $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type * as viem from 'viem'
import { $tokenTryLabeled } from '../../common/$common.js'
import { $responsiveFlex } from '../../common/elements/$common.js'
import { $seperator2 } from '../../pages/common.js'
import { $Popover } from '../$Popover.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'
import { $MatchRuleEditor, type IDraftMatchRule } from './$MatchRuleEditor.js'

export interface IMatchRuleEditorChange {
  draft: IDraftMatchRule
  trader: viem.Address
  collateralToken: viem.Address
  // matchRule?: IMatchRule
}

interface ITraderMatchingRouteEditor {
  trader: viem.Address
  accountInfo: GetAccountReturnType
  traderMatchingRuleList: {
    puppet: `0x${string}`
    allowanceRate: bigint
    throttleActivity: bigint
    expiry: bigint
  }[]
  collateralToken: viem.Address
  matchRuleList: Stream<IMatchRuleEditorChange[]>
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
      const {
        $container = $defaultTraderMatchRouteEditorContainer,
        trader,
        matchRuleList,
        collateralToken,
        traderMatchingRuleList
      } = config

      const rule = config.accountInfo.address
        ? traderMatchingRuleList.find((mr) => mr.puppet === config.accountInfo.address)
        : undefined

      return [
        $Popover({
          $container,
          open: map((matchRule) => {
            return $MatchRuleEditor(matchRule)({
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
                height: 'auto',
                borderColor:
                  rule && rule.expiry > unixTimestampNow() ? pallete.primary : colorAlpha(pallete.foreground, 0.25)
              })
            )
          })({
            click: popRouteSubscriptionEditorTether(constant(rule))
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
                  matchRule: rule
                }
                if (index === -1) {
                  newList.push(change)
                  return newList
                }

                newList[index] = change
                return newList
              },
              matchRuleList,
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
              matchRuleList,
              discardDraft
            )
          ])
        }
      ]
    }
  )
