import type { IntervalTime } from '@puppet/middleware/const'
import type { IBehavior } from 'aelea/core'
import { component, style } from 'aelea/core'
import { $column, isDesktopScreen, layoutSheet, spacing } from 'aelea/ui-components'
import type * as viem from 'viem'
import { $card, $card2 } from '../../common/elements/$common.js'
import { $ProfilePeformanceTimeline } from '../../components/participant/$ProfilePeformanceTimeline.js'
import type { IMatchRuleEditorChange } from '../../components/portfolio/$TraderMatchRouteEditor.js'
import type { IUserActivityPageParams } from '../type.js'

export interface IPuppetProfile extends IUserActivityPageParams {
  // puppetTradeRouteListQuery: Stream<Promise<IPuppetTradeRoute[]>>
}

export const $PuppetProfile = (config: IPuppetProfile) =>
  component(
    (
      [changeRoute, changeRouteTether]: IBehavior<string, string>,
      [modifySubscriber, modifySubscriberTether]: IBehavior<IMatchRuleEditorChange>,

      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<any, IntervalTime>,
      [selectMarketTokenList, selectMarketTokenListTether]: IBehavior<viem.Address[]>
    ) => {
      const {
        activityTimeframe,
        walletClientQuery,
        providerClientQuery,
        pricefeedMapQuery,
        selectedCollateralTokenList,
        route
      } = config

      return [
        $column(spacing.big)(
          $card(
            spacing.big,
            style({ flex: 1, width: '100%' })
          )(
            $card2(
              style({
                padding: 0,
                height: isDesktopScreen ? '200px' : '200px',
                position: 'relative',
                margin: isDesktopScreen ? '-36px -36px 0' : '-12px -12px 0px'
              })
            )(
              $ProfilePeformanceTimeline({ ...config })({
                selectMarketTokenList: selectMarketTokenListTether(),
                changeActivityTimeframe: changeActivityTimeframeTether()
              })
            )

            // $column(spacing.default)(
            //   $heading3('Active Trader Routes'),
            //   switchLatest(awaitPromises(map(async params => {

            //     const puppetTradeRouteList = await params.puppetTradeRouteListQuery
            //     const priceTickMap = await params.priceTickMapQuery
            //     const routeTypeList = await params.routeTypeListQuery

            //     if (puppetTradeRouteList.length === 0) {
            //       return $text('No activity found')
            //     }

            //     const tradeRouteList = Object.entries(groupArrayMany(puppetTradeRouteList, x => x.routeTypeKey)) as [viem.Address, IPuppetTradeRoute[]][]

            //     return $column(spacing.big, style({ width: '100%' }))(
            //       // ...tradeRouteList.map(([routeTypeKey, traderPuppetTradeRouteList]) => {
            //       //   const routeType = routeTypeList.find(route => route.routeTypeKey === routeTypeKey)!

            //       //   return $column(spacing.default)(
            //       //     $route(routeType),

            //       //     $column(style({ paddingLeft: '16px' }))(
            //       //       $row(spacing.default)(
            //       //         $seperator2,
            //       //         $column(spacing.default, style({ flex: 1 }))(
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
            //   }, combineState({ puppetTradeRouteListQuery, priceTickMapQuery, activityTimeframe, collateralToken, routeTypeListQuery })))),
            // ),
          )
        ),

        {
          changeRoute,
          modifySubscriber,
          changeActivityTimeframe,
          selectMarketTokenList
        }
      ]
    }
  )
