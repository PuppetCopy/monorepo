// import { IBehavior } from "aelea/core"
// import { $node, $text, component, style } from "aelea/core"
// import * as router from 'aelea/router'
// import { $column, $row, layoutSheet, screenUtils } from "aelea/ui-components"
// import { map, mergeArray, multicast, now } from "@most/core"
// import { IntervalTime } from "@puppet/middleware/const"
// import { accountSettledPositionListSummary, aggregatePositionList, IPosition } from "@puppet/middleware/core"
// import { $ButtonToggle, $defaulButtonToggleContainer, intermediateText } from "@puppet/middleware/ui-components"
// import { ETH_ADDRESS_REGEXP, readableLeverage, readableUsd } from "@puppet/middleware/utils"
// import * as viem from 'viem'
// import { $TraderDisplay } from "../../common/$common"
// import { $heading2 } from "../../common/$text"
// import { $metricLabel, $metricRow } from "../../components/participant/$Summary.js"
// import { IPageParams, IUserActivityPageParams } from "../type.js"
// import { $TraderPage } from "./$Trader.js"
// import { IMatchRuleEditorChange } from "../../components/portfolio/$TraderMatchRouteEditor"

// export interface IProfile extends IPageParams {
//   route: router.Route
// }

// type IRouteOption = {
//   label: string
//   fragment: string
// }

// export const $PublicUserPage = (config: IUserActivityPageParams) => component((
//   [changeRoute, changeRouteTether]: IBehavior<string, string>,
//   [selectProfileMode, selectProfileModeTether]: IBehavior<IRouteOption, IRouteOption>,
//   [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<any, IntervalTime>,
//   [selectMarketTokenList, selectMarketTokenListTether]: IBehavior<viem.Address[]>,
//   [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<IMatchRuleEditorChange[]>,

// ) => {

//   const { route, activityTimeframe, selectedCollateralTokenList, pricefeedMapQuery, } = config

//   const profileAddressRoute = config.route
//   const traderRoute = profileAddressRoute.create({ fragment: 'trader' }).create({
//     title: 'Trader',
//     fragment: ETH_ADDRESS_REGEXP
//   })
//   const puppetRoute = profileAddressRoute.create({ fragment: 'puppet' }).create({ title: 'Puppet', fragment: ETH_ADDRESS_REGEXP })

//   const options: IRouteOption[] = [
//     {
//       label: 'Puppet',
//       fragment: 'puppet'
//     },
//     {
//       label: 'Trader',
//       fragment: 'trader'
//     },
//   ]

//   return [

//     $column(spacing.big)(

//       $node(),

//       $column(spacing.big, style({ alignItems: 'center', placeContent: 'center' }))(
//         $ButtonToggle({
//           $container: $defaulButtonToggleContainer(style({ alignSelf: 'center', })),
//           selected: mergeArray([
//             router.match<IRouteOption>(puppetRoute)(now(options[0])),
//             router.match<IRouteOption>(traderRoute)(now(options[1])),
//           ]),
//           options,
//           $$option: map(option => {
//             return $text(option.label)
//           })
//         })({ select: selectProfileModeTether() }),
//       ),

//       $column(
//         router.match(traderRoute)(
//           {
//             run(sink, scheduler) {
//               const urlFragments = document.location.pathname.split('/')
//               const account = viem.getAddress(urlFragments[urlFragments.length - 1])
//               const matchRouteStatsQuery = queryMatchRouteStats(client, { account, activityTimeframe, collateralTokenList: selectedCollateralTokenList })

//               const metricsQuery = multicast(map(async query => {
//                 const positionList = (await query).reduce((seed, next) => {
//                   seed.push(...aggregatePositionList([...next.matchRoute.decreaseList, ...next.matchRoute.increaseList]))
//                   return seed
//                 }, [] as IPosition[])

//                 console.log(positionList)

//                 return accountSettledPositionListSummary(positionList)
//               }, matchRouteStatsQuery))

//               return $column(spacing.big)(
//                 $column(spacing.default, style({ minHeight: '90px' }))(
//                   $node(style({ display: 'flex', flexDirection: isDesktopScreen ? 'row' : 'column', gap: isDesktopScreen ? '56px' : '26px', zIndex: 10, placeContent: 'center', alignItems: 'center', padding: '0 8px' }))(
//                     $row(
//                       $TraderDisplay({
//                         route: config.route,
//                         trader: account,
//                         puppetList: [],
//                         labelSize: '22px',
//                         profileSize: isDesktopScreen ? 80 : 80
//                       })({
//                         click: changeRouteTether()
//                       }),
//                     ),
//                     $row(spacing.big, style({ alignItems: 'flex-end' }))(
//                       $metricRow(
//                         $heading2(intermediateText(
//                           map(async summaryQuery => {
//                             const summary = await summaryQuery

//                             return `${summary.winCount} / ${summary.lossCount}`
//                           }, metricsQuery)
//                         )),
//                         $metricLabel($text('Win / Loss'))
//                       ),

//                       $metricRow(
//                         $heading2(intermediateText(
//                           map(async summaryQuery => {
//                             const summary = await summaryQuery

//                             return readableUsd(summary.avgCollateral)
//                           }, metricsQuery)
//                         )),
//                         $metricLabel($text('Avg Collateral'))
//                       ),
//                       $metricRow(
//                         $heading2(intermediateText(
//                           map(async summaryQuery => {
//                             const summary = await summaryQuery

//                             return readableLeverage(summary.avgSize, summary.avgCollateral)
//                           }, metricsQuery)
//                         )),
//                         $metricLabel($text('Avg Leverage'))
//                       )

//                     ),
//                   )
//                 ),

//                 $TraderPage({ ...config, matchRouteStatsQuery })({
//                   selectMarketTokenList: selectMarketTokenListTether(),
//                   changeRoute: changeRouteTether(),
//                   changeActivityTimeframe: changeActivityTimeframeTether(),
//                   changeMatchRuleList: changeMatchRuleListTether(),
//                 })
//               ).run(sink, scheduler)
//             },
//           }
//         ),
//         // router.match(puppetRoute)(
//         //   {
//         //     run(sink, scheduler) {
//         //       const urlFragments = document.location.pathname.split('/')
//         //       const address = viem.getAddress(urlFragments[urlFragments.length - 1])
//         //       const puppetTradeRouteListQuery = queryPuppetTradeRoute(subgraphClient, { address, activityTimeframe, collateralTokenList })

//         //       const settledPositionListQuery = map(async trList => {
//         //         const tradeList = (await trList).flatMap(p => p.settledList.map(x => x.position))
//         //         return tradeList
//         //       }, puppetTradeRouteListQuery)

//         //       const openPositionListQuery = map(async trList => {
//         //         const tradeList = (await trList).flatMap(p => p.openList.map(x => x.position))
//         //         return tradeList
//         //       }, puppetTradeRouteListQuery)

//         //       return $column(spacing.big)(
//         //         $PuppetSummary({ ...config, account, puppet: address, positionListQuery })({}),

//         //         $column(spacing.tiny)(
//         //           $PuppetProfile({
//         //             ...config,
//         //             openPositionListQuery,
//         //             settledPositionListQuery,
//         //             puppetTradeRouteListQuery,
//         //           })({
//         //             changeRoute: changeRouteTether(),
//         //             changeActivityTimeframe: changeActivityTimeframeTether(),
//         //             selectMarketTokenList: selectMarketTokenListTether(),
//         //             modifySubscriber: modifySubscriberTether()
//         //           }),
//         //         ),

//         //       ).run(sink, scheduler)
//         //     },
//         //   }
//         // ),
//       ),

//       $node(),
//       $node(),

//     ),

//     {
//       changeMatchRuleList,
//       changeActivityTimeframe,
//       changeRoute: mergeArray([
//         changeRoute,
//         map(option => {
//           const urlFragments = document.location.pathname.split('/')
//           const address = urlFragments[urlFragments.length - 1] as viem.Address
//           const url = `/app/profile/${option.fragment}/${address}`
//           history.pushState({}, '', url)
//           return url
//         }, selectProfileMode)
//       ]),
//     }
//   ]
// })

