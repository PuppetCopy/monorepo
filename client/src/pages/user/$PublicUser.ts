import { Behavior } from "@aelea/core"
import { $node, $text, component, style } from "@aelea/dom"
import * as router from '@aelea/router'
import { $column, layoutSheet } from "@aelea/ui-components"
import { map, mergeArray, now, startWith } from "@most/core"
import { ETH_ADDRESS_REGEXP, switchMap } from "common-utils"
import { getMarketIndexToken } from "gmx-middleware"
import { queryPosition } from "puppet-middleware-utils"
import { $ButtonToggle, $defaulButtonToggleContainer } from "ui-components"
import * as viem from 'viem'
import { subgraphClient } from "../../common/graphClient"
import { $TraderSummary } from "../../components/participant/$Summary.js"
import { IPageParams, IUserActivityPageParams } from "../type.js"
import { $TraderPage } from "./$Trader.js"
import { IntervalTime } from "puppet-const"



export interface IProfile extends IPageParams {
  route: router.Route
}


type IRouteOption = {
  label: string
  fragment: string
}


export const $PublicUserPage = (config: IUserActivityPageParams) => component((
  [changeRoute, changeRouteTether]: Behavior<string, string>,
  [selectProfileMode, selectProfileModeTether]: Behavior<IRouteOption, IRouteOption>,
  [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<any, IntervalTime>,
  [selectMarketTokenList, selectMarketTokenListTether]: Behavior<viem.Address[]>,

) => {

  const { route, activityTimeframe, selectedCollateralTokenList, pricefeedMapQuery, } = config

  const profileAddressRoute = config.route
  const traderRoute = profileAddressRoute.create({ fragment: 'trader' }).create({ title: 'Trader', fragment: ETH_ADDRESS_REGEXP })
  const puppetRoute = profileAddressRoute.create({ fragment: 'puppet' }).create({ title: 'Puppet', fragment: ETH_ADDRESS_REGEXP })


  const options: IRouteOption[] = [
    {
      label: 'Puppet',
      fragment: 'puppet'
    },
    {
      label: 'Trader',
      fragment: 'trader'
    },
  ]



  return [

    $column(layoutSheet.spacingBig)(

      $node(),

      $column(layoutSheet.spacingBig, style({ alignItems: 'center', placeContent: 'center' }))(
        $ButtonToggle({
          $container: $defaulButtonToggleContainer(style({ alignSelf: 'center', })),
          selected: mergeArray([
            router.match<IRouteOption>(puppetRoute)(now(options[0])),
            router.match<IRouteOption>(traderRoute)(now(options[1])),
          ]),
          options,
          $$option: map(option => {
            return $text(option.label)
          })
        })({ select: selectProfileModeTether() }),
      ),

      $column(
        router.match(traderRoute)(
          {
            run(sink, scheduler) {
              const urlFragments = document.location.pathname.split('/')
              const account = viem.getAddress(urlFragments[urlFragments.length - 1])
              const filteredMarketList = startWith([], selectMarketTokenList)

              const positionListQuery = switchMap(marketList => {
                const query = queryPosition(subgraphClient, { account, activityTimeframe })

                return map(async listQuery => {
                  const list = await listQuery

                  if (marketList.length === 0) {
                    return list
                  }

                  return list
                    .filter(pos => marketList.includes(getMarketIndexToken(pos.market)))
                    .sort((a, b) => b.openTimestamp - a.openTimestamp)
                }, query)
              }, filteredMarketList)




              return $column(layoutSheet.spacingBig)(
                $TraderSummary({ ...config, account, positionListQuery })({}),

                $TraderPage({ ...config, positionListQuery, })({
                  selectMarketTokenList: selectMarketTokenListTether(),
                  changeRoute: changeRouteTether(),
                  changeActivityTimeframe: changeActivityTimeframeTether(),
                })
              ).run(sink, scheduler)
            },
          }
        ),
        // router.match(puppetRoute)(
        //   {
        //     run(sink, scheduler) {
        //       const urlFragments = document.location.pathname.split('/')
        //       const address = viem.getAddress(urlFragments[urlFragments.length - 1])
        //       const puppetTradeRouteListQuery = queryPuppetTradeRoute(subgraphClient, { address, activityTimeframe, collateralTokenList })

        //       const settledPositionListQuery = map(async trList => {
        //         const tradeList = (await trList).flatMap(p => p.settledList.map(x => x.position))
        //         return tradeList
        //       }, puppetTradeRouteListQuery)

        //       const openPositionListQuery = map(async trList => {
        //         const tradeList = (await trList).flatMap(p => p.openList.map(x => x.position))
        //         return tradeList
        //       }, puppetTradeRouteListQuery)

        //       return $column(layoutSheet.spacingBig)(
        //         $PuppetSummary({ ...config, account, puppet: address, positionListQuery })({}),

        //         $column(layoutSheet.spacingTiny)(
        //           $PuppetProfile({
        //             ...config,
        //             openPositionListQuery,
        //             settledPositionListQuery,
        //             puppetTradeRouteListQuery,
        //           })({
        //             changeRoute: changeRouteTether(),
        //             changeActivityTimeframe: changeActivityTimeframeTether(),
        //             selectMarketTokenList: selectMarketTokenListTether(),
        //             modifySubscriber: modifySubscriberTether()
        //           }),
        //         ),

        //       ).run(sink, scheduler)
        //     },
        //   }
        // ),
      ),

      $node(),
      $node(),

    ),

    {
      changeActivityTimeframe,
      changeRoute: mergeArray([
        changeRoute,
        map(option => {
          const urlFragments = document.location.pathname.split('/')
          const address = urlFragments[urlFragments.length - 1] as viem.Address
          const url = `/app/profile/${option.fragment}/${address}`
          history.pushState({}, '', url)
          return url
        }, selectProfileMode)
      ]),
    }
  ]
})


