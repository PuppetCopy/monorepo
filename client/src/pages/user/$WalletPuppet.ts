import { Behavior, combineObject } from "@aelea/core"
import { $text, component, style } from "@aelea/dom"
import { $column, $row, layoutSheet, screenUtils } from "@aelea/ui-components"
import { map, multicast } from "@most/core"
import { Stream } from "@most/types"
import { IntervalTime } from "common-utils"
import { getTokenDescription } from "gmx-middleware"
import { EIP6963ProviderDetail } from "mipd"
import { $infoLabel, $IntermediatePromise } from "ui-components"
import * as viem from "viem"
import { $card, $card2, $labeledDivider } from "../../common/elements/$common.js"
import { $ProfilePeformanceTimeline } from "../../components/participant/$ProfilePeformanceTimeline.js"
import { IDepositEditorChange } from "../../components/portfolio/$DepositEditor.js"
import { IMatchRuleEditorChange } from "../../components/portfolio/$MatchRuleEditor.js"
import { $RouteDepositEditor } from "../../components/portfolio/$RouteDepositEditor"
import { $seperator2 } from "../common"
import { IUserPositionPageParams } from "../type.js"


interface IWalletPuppet extends IUserPositionPageParams {
  depositTokenList: Stream<IDepositEditorChange[]>
  matchRuleList: Stream<IMatchRuleEditorChange[]>
}

export const $WalletPuppet = (config: IWalletPuppet) => component((
  [changeRoute, changeRouteTether]: Behavior<string, string>,
  [modifySubscriber, modifySubscriberTether]: Behavior<IMatchRuleEditorChange>,
  [changeWallet, changeWalletTether]: Behavior<EIP6963ProviderDetail>,

  [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<any, IntervalTime>,
  [selectMarketTokenList, selectMarketTokenListTether]: Behavior<viem.Address[]>,

  [changeMatchRuleList, changeMatchRuleListTether]: Behavior<IMatchRuleEditorChange[]>,
  [changeDepositTokenList, changeDepositTokenListTether]: Behavior<IDepositEditorChange[]>,
) => {

  const {
    activityTimeframe, walletClientQuery, depositTokenList, matchRuleList,
    pricefeedMapQuery, providerClientQuery, positionListQuery, selectedCollateralTokenList, route
  } = config


  const tableParams = map(async params => {
    const activityTimeframe = params.activityTimeframe
    const positionList = await params.positionListQuery
    const collateralTokenList = params.selectedCollateralTokenList

    return { positionList, activityTimeframe, collateralTokenList }
  }, combineObject({ positionListQuery, activityTimeframe, selectedCollateralTokenList }))


  return [

    $card(layoutSheet.spacingBig, style({ flex: 1, width: '100%' }))(
      $card2(style({ padding: 0, height: screenUtils.isDesktopScreen ? '200px' : '200px', position: 'relative', margin: screenUtils.isDesktopScreen ? `-36px -36px 0` : `-12px -12px 0px` }))(
        $ProfilePeformanceTimeline({ ...config })({
          selectMarketTokenList: selectMarketTokenListTether(),
          changeActivityTimeframe: changeActivityTimeframeTether(),
        }),
      ),

      $IntermediatePromise({
        query: tableParams,
        $$done: map(params => {

          if (params.collateralTokenList.length === 0) {
            return $column(layoutSheet.spacingSmall)(
              $text('No active collateral tokens selected'),
              $infoLabel(`Select collateral tokens to view activity`),
            )
          }

          return $column(layoutSheet.spacing)(
            ...params.collateralTokenList.map(collateralToken => {

              const tokenDescription = getTokenDescription(collateralToken)

              return $column(style({ paddingLeft: '16px' }))(
                $row(layoutSheet.spacingBig, style({ padding: '6px 0' }))(
                  $RouteDepositEditor({
                    depositTokenList,
                    collateralToken,
                    providerClientQuery,
                    walletClientQuery
                  })({
                    changeWallet: changeWalletTether(),
                    changeDepositTokenList: changeDepositTokenListTether(),
                  }),
                ),
                $row(layoutSheet.spacing)(
                  $seperator2,
                  $column(style({ flex: 1, padding: '12px 0' }))(
                    // ...[].map(modSubsc => {
                    //   const iconColorParams = modSubsc.matchRule
                    //     ? modSubsc.expiry === 0n
                    //       ? { fill: pallete.negative, icon: $xCross, label: screenUtils.isDesktopScreen ? 'Remove' : '-' } : { fill: pallete.message, icon: $target, label: screenUtils.isDesktopScreen ? 'Edit' : '~' }
                    //     : { fill: pallete.positive, icon: $check, label: screenUtils.isDesktopScreen ? 'Add' : '+' }

                    //   return $row(screenUtils.isDesktopScreen ? layoutSheet.spacingBig : layoutSheet.spacing, style({ alignItems: 'center', padding: `14px 0` }))(
                    //     // O(
                    //     //   style({ marginLeft: '-32px', backgroundColor: pallete.horizon, cursor: 'pointer' }),
                    //     //   clickRemoveSubscTether(nodeEvent('click'), constant(modSubsc))
                    //     // )(
                    //     //   $iconCircular($xCross)
                    //     // ),
                    //     $row(
                    //       $text(style({ backgroundColor: colorAlpha(iconColorParams.fill, .1), marginLeft: `-42px`, borderRadius: '6px', padding: screenUtils.isDesktopScreen ? `6px 12px 6px 22px` : `6px 8px 6px 30px`, color: iconColorParams.fill, }))(iconColorParams.label),
                    //     ),

                    //     // switchMap(amount => {
                    //     //   return $text(tokenAmountLabel(routeType.indexToken, amount))
                    //     // }, orchestrator.read('puppetAccountBalance', w3p.account.address, routeType.indexToken)),

                    //     $profileDisplay({
                    //       account: modSubsc.trader,
                    //       // $profileContainer: $defaultBerry(style({ width: '50px' }))
                    //     }),

                    //     $responsiveFlex(layoutSheet.spacing, style({ flex: 1 }))(
                    //       $infoLabeledValue('Allowance Rate', $text(`${readablePercentage(modSubsc.allowanceRate)}`)),
                    //       $infoLabeledValue('Expiry', readableDate(Number(modSubsc.expiry))),
                    //       $infoLabeledValue('Throttle Duration', $text(`${getDuration(modSubsc.throttleActivity)}`)),
                    //     )

                    //   )
                    // })
                  )
                ),
                $seperator2,

              )
            })
          )
        })
      })({}),



    ),

    {
      changeWallet, changeRoute, modifySubscriber, changeActivityTimeframe, selectMarketTokenList,
      changeDepositTokenList, changeMatchRuleList
    }
  ]
})



