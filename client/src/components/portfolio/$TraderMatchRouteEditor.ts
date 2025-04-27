
import { Behavior, combineObject } from "@aelea/core"
import { $Node, $text, component, NodeComposeFn, style } from "@aelea/dom"
import { $row, layoutSheet, screenUtils } from "@aelea/ui-components"
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import { constant, map, mergeArray, snapshot } from "@most/core"
import { Stream } from "@most/types"
import { IMatchRule } from "@puppet/middleware/core"
import { $caretDown, $icon } from "@puppet/middleware/ui-components"
import { switchMap, unixTimestampNow } from "@puppet/middleware/utils"
import * as viem from "viem"
import { $Popover } from "../$Popover"
import { $tokenTryLabeled } from "../../common/$common"
import { $responsiveFlex } from "../../common/elements/$common.js"
import { $seperator2 } from "../../pages/common"
import { IWalletPageParams } from "../../pages/type.js"
import { $ButtonSecondary, $defaultMiniButtonSecondary } from "../form/$Button.js"
import { $MatchRuleEditor, IDraftMatchRule } from "./$MatchRuleEditor.js"


export interface IMatchRuleEditorChange {
  draft: IDraftMatchRule
  trader: viem.Address
  collateralToken: viem.Address
  // matchRule?: IMatchRule
}

interface ITraderMatchingRouteEditor extends IWalletPageParams {
  trader: viem.Address
  traderMatchingRuleList: {
    puppet: `0x${string}`;
    allowanceRate: bigint;
    throttleActivity: bigint;
    expiry: bigint;
  }[]
  collateralToken: viem.Address
  matchRuleList: Stream<IMatchRuleEditorChange[]>
  $container?: NodeComposeFn<$Node>
}

export const $defaultTraderMatchRouteEditorContainer = $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))

export const $TraderMatchingRouteEditor = (config: ITraderMatchingRouteEditor) => component((
  [popRouteSubscriptionEditor, popRouteSubscriptionEditorTether]: Behavior<any, IMatchRule | undefined>,

  [discardDraft, discardDraftTether]: Behavior<IDraftMatchRule>,
  [saveDraft, saveDraftTether]: Behavior<IDraftMatchRule>,
) => {

  const {
    $container = $defaultTraderMatchRouteEditorContainer,
    walletClientQuery, trader, matchRuleList, collateralToken, traderMatchingRuleList
  } = config

  const matchRule = switchMap(async walletQuery => {
    const wallet = await walletQuery

    if (wallet === null) {
      return
    }

    return traderMatchingRuleList.find(mr => mr.puppet === wallet.account.address)
  }, walletClientQuery)

  return [
    $Popover({
      $container,
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
              $tokenTryLabeled(collateralToken),
            ),
            $seperator2,
            $row(style({ gap: '6px' }))(
              $text(`Copy`),
              $icon({ $content: $caretDown, width: '12px', svgOps: style({ marginTop: '2px', minWidth: '8px' }), viewBox: '0 0 32 32' }),
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
          const change = {
            draft: params.saveDraft,
            trader,
            collateralToken: collateralToken,
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


