
import { Behavior, combineObject } from "@aelea/core"
import { $text, component, style } from "@aelea/dom"
import { $row, layoutSheet, screenUtils } from "@aelea/ui-components"
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import { constant, map, mergeArray, multicast, snapshot } from "@most/core"
import { Stream } from "@most/types"
import { switchMap, unixTimestampNow } from "common-utils"
import { getTokenDescription } from "gmx-middleware"
import { IMatchRoute, IMatchRule } from "puppet-middleware-utils"
import { $caretDown, $icon } from "ui-components"
import * as viem from "viem"
import { $Popover } from "../$Popover"
import { $tokenLabeled } from "../../common/$common"
import { $responsiveFlex } from "../../common/elements/$common.js"
import { $seperator2 } from "../../pages/common"
import { IWalletPageParams } from "../../pages/type.js"
import { $ButtonSecondary, $defaultMiniButtonSecondary } from "../form/$Button.js"
import { $MatchRuleEditor, IMatchRuleEditorChange, IDraftMatchRule } from "./$MatchRuleEditor.js"


interface ITraderMatchRouteEditor extends IWalletPageParams {
  trader: viem.Address
  collateralToken: viem.Address
  matchRoute: IMatchRoute
  matchRuleList: Stream<IMatchRuleEditorChange[]>
}


export const $TraderMatchRouteEditor = (config: ITraderMatchRouteEditor) => component((
  [popRouteSubscriptionEditor, popRouteSubscriptionEditorTether]: Behavior<any, IMatchRule | undefined>,

  [discardDraft, discardDraftTether]: Behavior<IDraftMatchRule>,
  [saveDraft, saveDraftTether]: Behavior<IDraftMatchRule>,
) => {

  const { walletClientQuery, trader, matchRuleList, matchRoute } = config

  const matchRule = switchMap(async walletQuery => {
    const wallet = await walletQuery

    if (wallet === null) {
      return
    }

    return matchRoute.matchRuleList.find(mr => mr.puppet === wallet.account.address)
  }, walletClientQuery)

  return [
    $Popover({
      $container: $row(layoutSheet.spacingSmall, style({ alignItems: 'center' })),
      open: map(matchRule => {
        return $MatchRuleEditor(matchRule)({
          remove: discardDraftTether(),
          save: saveDraftTether(),
        })
      }, popRouteSubscriptionEditor),
      dismiss: mergeArray([saveDraft, discardDraft]),
      $target: switchMap(rule => {
        const isHighlisted = rule && rule.expiry > unixTimestampNow()
        return $ButtonSecondary({
          $content: $responsiveFlex(style({ alignItems: 'center', gap: screenUtils.isDesktopScreen ? '12px' : '4px' }))(
            $row(style({ alignItems: 'center' }))(
              $tokenLabeled(getTokenDescription(matchRoute.collateralToken)),
            ),
            $seperator2,

            $row(style({ gap: '8px' }))(
              $text(`Copy`),
              $icon({ $content: $caretDown, width: '18px', svgOps: style({ marginTop: '1px', minWidth: '18px' }), viewBox: '0 0 32 32' }),
            ),

          ),
          $container: $defaultMiniButtonSecondary(style({
            borderRadius: '16px', padding: '8px', height: 'auto',
            borderColor: isHighlisted ? pallete.primary : colorAlpha(pallete.foreground, .25)
          }))
        })({
          click: popRouteSubscriptionEditorTether(constant(rule))
        })
      }, matchRule)
    })({}),


    {
      changeMatchRuleList: mergeArray([
        snapshot((list, params) => {
          const index = list.findIndex(x =>
            x.trader === trader
          )
          const newList = [...list]
          const change: IMatchRuleEditorChange = {
            value: params.saveDraft,
            trader,
            collateralToken: matchRoute.collateralToken,
            matchRule: params.matchRule
          }
          if (index === -1) {
            newList.push(change)
            return newList
          }

          newList[index] = change
          return newList
        }, matchRuleList, combineObject({ saveDraft, matchRule })),
        snapshot((list, draft) => {
          const index = list.findIndex(x =>
            x.trader === trader
          )
          const newList = [...list]

          if (index === -1) {
            return list
          }

          newList.splice(index, 1)
          return newList
        }, matchRuleList, discardDraft)
      ]),
    }
  ]
})


