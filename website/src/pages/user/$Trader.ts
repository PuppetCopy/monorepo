// import { Behavior, combineState, replayLatest } from "aelea/core"
// import { $text, component, style } from "aelea/dom"
// import { $column, $row, layoutSheet, screenUtils } from "aelea/ui-components"
// import { map, startWith } from "@most/core"
// import { Stream } from "@most/types"
// import { pagingQuery } from "@puppet/middleware/utils"
// import { getTokenDescription } from "@puppet/middleware/gmx"
// import { IntervalTime } from "@puppet/middleware/const"
// import { aggregatePositionList, IMatchRouteStats } from "@puppet/middleware/core"
// import { $infoLabel, $IntermediatePromise, $Table, IQuantumScrollPage, ISortBy } from "@puppet/middleware/ui-components"
// import * as viem from 'viem'
// import { $card, $card2 } from "../../common/elements/$common.js"
// import { IMatchRuleEditorChange } from "../../components/portfolio/$MatchRuleEditor"
// import { $defaultTraderMatchRouteEditorContainer, $TraderMatchingRouteEditor } from "../../components/portfolio/$TraderMatchRouteEditor"
// import { entryColumn, pnlColumn, puppetsColumn, sizeColumn, timeColumn } from "../../components/table/$TableColumn.js"
// import { $seperator2 } from "../common"
// import { IPageParams, IUserActivityPageParams } from "../type.js"
// import { $ProfilePeformanceTimeline } from "../../components/participant/$ProfilePeformanceTimeline"


// interface ITraderPage extends IPageParams, IUserActivityPageParams {
//   matchRouteStatsQuery: Stream<Promise<IMatchRouteStats[]>>
// }

// export const $TraderPage = (config: ITraderPage) => component((
//   [changeRoute, changeRouteTether]: Behavior<any, string>,
//   [scrollRequest, scrollRequestTether]: Behavior<IQuantumScrollPage>,
//   [sortByChange, sortByChangeTether]: Behavior<ISortBy>,
//   [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<any, IntervalTime>,
//   [selectMarketTokenList, selectMarketTokenListTether]: Behavior<viem.Address[]>,
//   [changeMatchRuleList, changeMatchRuleListTether]: Behavior<IMatchRuleEditorChange[]>,
// ) => {

//   const {
//     activityTimeframe, selectedCollateralTokenList, matchRouteStatsQuery,
//     matchRuleList, depositTokenList, pricefeedMapQuery, providerClientQuery, route, walletClientQuery
//   } = config

//   const sortBy = replayLatest(sortByChange, { direction: 'desc', selector: 'openTimestamp' } as const)

//   const tableParams = map(async params => {
//     const activityTimeframe = params.activityTimeframe
//     const matchRouteList = await params.matchRouteStatsQuery

//     return { matchRouteList, sortBy: params.sortBy, activityTimeframe }
//   }, combineState({ sortBy, matchRouteStatsQuery, activityTimeframe }))


//   return [
//     $column(spacing.big)(
//       $card(spacing.big, style({ flex: 1, width: '100%' }))(
//         $card2(style({ padding: 0, height: screenUtils.isDesktopScreen ? '200px' : '200px', position: 'relative', margin: screenUtils.isDesktopScreen ? `-36px -36px 0` : `-12px -12px 0px` }))(
//           $ProfilePeformanceTimeline({ ...config })({
//             selectMarketTokenList: selectMarketTokenListTether(),
//             changeActivityTimeframe: changeActivityTimeframeTether(),
//           })
//         ),

//         $IntermediatePromise({
//           query: tableParams,
//           $$done: map(params => {
//             const list = params.matchRouteList
//             const paging = startWith({ offset: 0, pageSize: 20 }, scrollRequest)

//             if (list.length === 0) {
//               return $column(spacing.small)(
//                 $text('No active positions found'),
//                 $infoLabel(`Try changing the timeframe or selecting a different trade route`),
//               )
//             }


//             return $column(spacing.default)(
//               ...list.map(route => {

//                 const positionList = aggregatePositionList([...route.matchRoute.decreaseList, ...route.matchRoute.increaseList])
//                 const dataSource = map(pageParams => {
//                   return pagingQuery({ ...pageParams.paging, ...pageParams.sortBy }, positionList)
//                 }, combineState({ sortBy, paging }))

//                 const collateralTokenDescription = getTokenDescription(route.matchRoute.collateralToken)

//                 return $column(
//                   // style({ padding: '0 0 12px' })($route(collateralTokenDescription)),
//                   $TraderMatchingRouteEditor({
//                     matchRuleList,
//                     walletClientQuery,
//                     matchRoute: route.matchRoute,
//                     trader: route.account,
//                     $container: $defaultTraderMatchRouteEditorContainer(style({ marginLeft: '-16px', paddingBottom: '16px' }))
//                   })({
//                     changeMatchRuleList: changeMatchRuleListTether(),
//                   }),
//                   $row(
//                     style({ marginRight: '26px' })($seperator2),
//                     $Table({
//                       $container: $column(style({ flex: 1 })),
//                       dataSource,
//                       sortBy: params.sortBy,
//                       columns: [
//                         ...screenUtils.isDesktopScreen ? [timeColumn] : [],
//                         entryColumn,
//                         puppetsColumn(changeRouteTether),
//                         sizeColumn(),
//                         pnlColumn(),
//                       ],
//                     })({
//                       sortBy: sortByChangeTether(),
//                       scrollRequest: scrollRequestTether()
//                     })
//                   )
//                 )
//               })
//             )
//           })
//         })({}),
//       ),
//     ),
//     { changeRoute, changeActivityTimeframe, selectMarketTokenList, changeMatchRuleList }
//   ]
// })


