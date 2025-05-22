// import { component, eventElementTarget, style } from "aelea/core"
// import * as router from 'aelea/router'
// import { $column, layoutSheet } from "aelea/ui-components"
// import { map, now } from "@most/core"
// import { IntervalTime } from "@puppet-copy/middleware/utils"
// import { queryPricefeed, queryRouteTypeList } from "@puppet-copy/middleware/core"
// import { $rootContainer } from "../pages/common"
// import { $trader } from "./$trader"
// import { Stream } from "@most/types"
// import { subgraphClient } from "../common/graphClient"

// function dispatchPushStateEvent(url: string, title: string = '') {
//   history.pushState({}, title, url)

//   // Create a new event
//   const pushStateEvent = new CustomEvent('ogRouteChange', {
//     detail: {
//       title: title,
//       url: url
//     }
//   })

//   // Dispatch the event
//   window.dispatchEvent(pushStateEvent)
// }

// type IOgRouteChange = CustomEvent<{
//   title: string;
//   url: string;
// }>

// export const $Opengraph = (parentRoute: router.Route) => component(() => {
//   const traderRoute = parentRoute.create({ fragment: /trader\?.*/ })
//   const url = new URL(document.location.href)

//   const activityTimeframe = now(Number(url.searchParams.get('activityTimeframe')!) as IntervalTime)
//   const collateralToken = now([])
//   const priceTickMapQuery = queryPricefeed(subgraphClient, { activityTimeframe, collateralToken })
//   const routeTypeListQuery = now(queryRouteTypeList(subgraphClient))

//   // use playwright pushstate events as trigger to change route
//   const pushstateEvents: Stream<IOgRouteChange> = eventElementTarget('ogRouteChange' as any, window)

//   setTimeout(() => {
//     dispatchPushStateEvent(`/og/trader?address=${'0x82efa1d9336fc1C3D1bc8c5D568d164E10E130dd'}&activityTimeframe=${2628000}`)
//   }, 3000)

//   return[
//     $rootContainer(
//       $column(spacing.big, style({ placeContent: 'space-between', flex: 1, paddingTop: '36px' }))(
//         router.contains(traderRoute)(
//           $trader({ priceTickMapQuery, routeTypeListQuery,  })
//         ),
//       ),
//     ),

//     {
//       changeRoute: map(option => {
//         return option.detail.url
//       }, pushstateEvents)
//     }
//   ]
// })

