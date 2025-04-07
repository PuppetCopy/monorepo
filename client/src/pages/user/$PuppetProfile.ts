import { Behavior } from "@aelea/core"
import { component, style } from "@aelea/dom"
import { $column, layoutSheet, screenUtils } from "@aelea/ui-components"
import { IntervalTime } from "puppet-const"
import * as viem from "viem"
import { $card, $card2 } from "../../common/elements/$common.js"
import { $ProfilePeformanceTimeline } from "../../components/participant/$ProfilePeformanceTimeline.js"
import { IMatchRuleEditorChange } from "../../components/portfolio/$MatchRuleEditor"
import { IUserActivityPageParams } from "../type.js"


export interface IPuppetProfile extends IUserActivityPageParams {
  // puppetTradeRouteListQuery: Stream<Promise<IPuppetTradeRoute[]>>
}

export const $PuppetProfile = (config: IPuppetProfile) => component((
  [changeRoute, changeRouteTether]: Behavior<string, string>,
  [modifySubscriber, modifySubscriberTether]: Behavior<IMatchRuleEditorChange>,

  [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<any, IntervalTime>,
  [selectMarketTokenList, selectMarketTokenListTether]: Behavior<viem.Address[]>,
) => {
  
  const { activityTimeframe, walletClientQuery, providerClientQuery, pricefeedMapQuery, selectedCollateralTokenList, route } = config

  return [
    $column(layoutSheet.spacingBig)(
      $card(layoutSheet.spacingBig, style({ flex: 1, width: '100%' }))(
        $card2(style({ padding: 0, height: screenUtils.isDesktopScreen ? '200px' : '200px', position: 'relative', margin: screenUtils.isDesktopScreen ? `-36px -36px 0` : `-12px -12px 0px` }))(
          $ProfilePeformanceTimeline({ ...config })({
            selectMarketTokenList: selectMarketTokenListTether(),
            changeActivityTimeframe: changeActivityTimeframeTether(),
          }),
        ),

        // $column(layoutSheet.spacing)(
        //   $heading3('Active Trader Routes'),
        //   switchLatest(awaitPromises(map(async params => {

        //     const puppetTradeRouteList = await params.puppetTradeRouteListQuery
        //     const priceTickMap = await params.priceTickMapQuery
        //     const routeTypeList = await params.routeTypeListQuery

        //     if (puppetTradeRouteList.length === 0) {
        //       return $text('No activity found')
        //     }


        //     const tradeRouteList = Object.entries(groupArrayMany(puppetTradeRouteList, x => x.routeTypeKey)) as [viem.Address, IPuppetTradeRoute[]][]

        //     return $column(layoutSheet.spacingBig, style({ width: '100%' }))(
        //       // ...tradeRouteList.map(([routeTypeKey, traderPuppetTradeRouteList]) => {
        //       //   const routeType = routeTypeList.find(route => route.routeTypeKey === routeTypeKey)!

        //       //   return $column(layoutSheet.spacing)(
        //       //     $route(routeType),

        //       //     $column(style({ paddingLeft: '16px' }))(
        //       //       $row(layoutSheet.spacing)(
        //       //         $seperator2,
        //       //         $column(layoutSheet.spacing, style({ flex: 1 }))( 
        //       //           ...traderPuppetTradeRouteList.map(puppetTradeRoute => {
        //       //             return $PuppetTraderTradeRoute({ route, puppetTradeRoute, providerClientQuery, routeTypeList, walletClientQuery, activityTimeframe: params.activityTimeframe, priceTickMap })({
        //       //               modifySubscriber: modifySubscriberTether(),
        //       //               changeRoute: changeRouteTether(),
        //       //             })
        //       //           })
        //       //         ),
        //       //       ),
        //       //       $seperator2,
        //       //     ),
        //       //   )
        //       // })
        //     )
        //   }, combineObject({ puppetTradeRouteListQuery, priceTickMapQuery, activityTimeframe, collateralToken, routeTypeListQuery })))),
        // ),
      ),
    ),
    
    {
      changeRoute, modifySubscriber, changeActivityTimeframe, selectMarketTokenList
    }
  ]
})



