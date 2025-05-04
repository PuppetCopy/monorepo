// import { Behavior, O, combineState } from "aelea/core"
// import { $element, $text, component, style } from "aelea/dom"
// import * as router from 'aelea/router'
// import { $column, $row, layoutSheet } from "aelea/ui-components"
// import { pallete } from "aelea/ui-components-theme"
// import { map, startWith } from "@most/core"
// import { Stream } from "@most/types"
// import * as GMX from '@puppet/middleware/gmx'
// import { $Table, ISortBy, ScrollRequest } from "@puppet/middleware/ui-components"
// import { IAbstractPositionParams, pagingQuery, switchMap } from "@puppet/middleware/gmx"
// import { ROUTE_DESCRIPTION } from "@puppet/middleware/const"
// import { IPositionMirrorOpen, IPuppetSubscritpion, getMpSlotPnL, getRouteTypeKey } from "@puppet/middleware/core"
// import { $labelDisplay } from "../../common/$TextField.js"
// import { $TraderDisplay, $route } from "../../common/$common.js"
// import { $DropMultiSelect } from "../../components/form/$Dropdown.js"
// import { entryColumn, pnlSlotColumn, puppetsColumn, slotSizeColumn } from "../../components/table/$TableColumn.js"
// import { IGmxProcessState } from "../../data/process/process.js"
// import { rootStoreScope } from "../../data/store/store.js"
// import { $card } from "../../common/elements/$common.js"
// import * as storage from "../../utils/storage/storeScope.js"



//   type IPosition = IPositionMirrorOpen & {
//     pnl: bigint
//   }

// export type ITopOpen = {
//   route: router.Route
//   subscriptionList: Stream<IPuppetSubscritpion[]>
//   processData: Stream<IGmxProcessState>
// }


// export const $TopOpen = (config: ITopOpen) => component((
//   [routeChange, routeChangeTether]: Behavior<any, string>,
//   [modifySubscriber, modifySubscriberTether]: Behavior<IPuppetSubscritpion>,
//   [sortByChange, sortByChangeTether]: Behavior<ISortBy>,
//   [scrollRequest, scrollRequestTether]: Behavior<ScrollRequest>,
//   [routeTypeChange, routeTypeChangeTether]: Behavior<IAbstractPositionParams[]>,

// ) => {

//   const exploreStore = storage.createStoreScope(rootStoreScope, 'topOpen' as const)


//   const sortBy = storage.replayWrite(exploreStore, { direction: 'desc', selector: 'pnl' } as ISortBy<IPosition>, sortByChange, 'sortBy')
//   const routeList = map(list => list.map(rt => {
//     const matchedMemType = ROUTE_DESCRIPTION.find(rtd => getRouteTypeKey(rt.collateralToken, rt.indexToken, rt.isLong) === getRouteTypeKey(rtd.collateralToken, rtd.indexToken, rtd.isLong))

//     if (!matchedMemType) {
//       throw new Error(`Route type not found for ${rt.collateralToken} ${rt.indexToken} ${rt.isLong}`)
//     }

//     return matchedMemType
//   }), storage.replayWrite(exploreStore, [] as IAbstractPositionParams[], routeTypeChange, 'filterRouteList'))


//   const pageParms = map(params => {
//     const requestPage = { ...params.sortBy, offset: 0, pageSize: 20 }
//     const paging = startWith(requestPage, scrollRequest)

//     const dataSource =  map(req => {

//       const flattenMapMap = Object.values(params.processData.mirrorPositionSlot)
//         .filter(pos => {
//           // if (pos.route === GMX.ADDRESS_ZERO) {
//           //   return false
//           // }

//           const routeLength = params.routeList.length
//           if (routeLength && params.routeList.findIndex(rt => getRouteTypeKey(rt.collateralToken, rt.indexToken, rt.isLong) === pos.routeTypeKey) === -1) {
//             return false
//           }

//           return true
//         })
//         .map(pos => {
//           const marketPrice = params.processData.latestPrice[pos.indexToken]
//           const pnl = getMpSlotPnL(pos, marketPrice)

//           return { ...pos, pnl }
//         })

//       return pagingQuery({ ...params.sortBy, ...req }, flattenMapMap as IPosition[])
//     }, paging)


//     return { ...params, dataSource }
//   }, combineState({ processData: config.processData, sortBy, routeList }))


//   return [
//     $column(spacing.big)(


//       $card(spacing.big, style({ flex: 1 }))(

//         $row(style({ placeContent: 'space-between' }))(
//           $row(
//             $DropMultiSelect({
//               $label: $labelDisplay(style({ color: pallete.foreground }))('Markets'),
//               $input: $element('input')(style({ maxWidth: '80px' })),
//               placeholder: 'All / Select',
//               $$chip: map(rt => {
//                 return $route(rt)
//               }),
//               selector: {
//                 list: ROUTE_DESCRIPTION,
//                 $$option: map(route => {
//                   return style({
//                     padding: '8px'
//                   }, $route(route))
//                 })
//               },
//               value: routeList
//             })({
//               select: routeTypeChangeTether()
//             }),
//           ),
          
//         ),

//         switchMap(params => {
//           return $Table({
//             dataSource: params.dataSource,
//             sortBy: params.sortBy,
//             columns: [
//               {
//                 $head: $text('Trader'),
//                 gridTemplate: '200px',
//                 columnOp: style({ alignItems: 'center' }),
//                 $bodyCallback: map(pos => {
//                   return $TraderDisplay({
//                     route: config.route,
//                     // changeMatchRuleList: config.changeMatchRuleList,
//                     subscriptionList: config.subscriptionList,
//                     trader: pos.trader,
//                   })({ 
//                     modifySubscribeList: modifySubscriberTether(),
//                     clickTrader: routeChangeTether()
//                   })
//                 })
//               },
//               entryColumn,
//               puppetsColumn<IPosition>(routeChangeTether),
//               {
//                 ...slotSizeColumn(config.processData),
//                 sortBy: 'maxSizeUsd'
//               },
//               {
//                 sortBy: 'pnl',
//                 ...pnlSlotColumn(config.processData),
//               },
//             ],
//           })({
//             sortBy: sortByChangeTether(),
//             scrollRequest: scrollRequestTether()
//           })
//         }, pageParms),
    
//       ),

      
//     ),

//     {
//       routeChange, modifySubscriber,
//     }
//   ]
// })





