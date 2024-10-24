// import { style } from "@aelea/dom"
// import { $column, layoutSheet } from "@aelea/ui-components"
// import { now } from "@most/core"
// import { Stream } from "@most/types"
// import { IntervalTime } from "common-utils"
// import { IPriceTickListMap } from "gmx-middleware"
// import { ISetRouteType, queryPosition } from "puppet-middleware"
// import * as viem from 'viem'
// import { $ProfilePeformanceTimeline } from "../components/participant/$ProfilePeformanceTimeline.js"
// import { $TraderSummary } from "../components/participant/$Summary.js"
// import { subgraphClient } from "../common/graphClient"



// interface ITrader {
//   routeTypeListQuery: Stream<Promise<ISetRouteType[]>>
//   priceTickMapQuery: Stream<Promise<IPriceTickListMap>>
// }

// export const $trader = (config: ITrader) => {
//   const url = new URL(document.location.href)

//   const account = viem.getAddress(String(url.searchParams.get('address'))) as viem.Address
//   const activityTimeframe = now(Number(url.searchParams.get('activityTimeframe')!) as IntervalTime)
//   const collateralTokenList = now([])
//   const positionListQuery = queryPosition(subgraphClient, { account, activityTimeframe, collateralTokenList })

//   return $column(layoutSheet.spacingBig, style({ placeContent: 'space-between', flex: 1 }))(
//     $TraderSummary({ ...config, account, positionListQuery })({}),

//     $column(style({ position: 'relative' }))(
//       $ProfilePeformanceTimeline({ ...config, activityTimeframe, positionListQuery, collateralTokenList })({ })
//     )
//   )
// }


