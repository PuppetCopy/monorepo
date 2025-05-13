// import { style } from "aelea/core"
// import { $column, layoutSheet } from "aelea/ui-components"
// import { now } from "@most/core"
// import { Stream } from "@most/types"
// import { IntervalTime } from "@puppet/middleware/utils"
// import { IPriceTickListMap } from "@puppet/middleware/gmx"
// import { ISetRouteType, queryPosition } from "@puppet/middleware/core"
//
// import { $ProfilePeformanceTimeline } from "../components/participant/$ProfilePeformanceTimeline.js"
// import { $TraderSummary } from "../components/participant/$Summary.js"
// import { subgraphClient } from "../common/graphClient"

// interface ITrader {
//   routeTypeListQuery: Stream<Promise<ISetRouteType[]>>
//   priceTickMapQuery: Stream<Promise<IPriceTickListMap>>
// }

// export const $trader = (config: ITrader) => {
//   const url = new URL(document.location.href)

//   const account = getAddress(String(url.searchParams.get('address'))) as Address
//   const activityTimeframe = now(Number(url.searchParams.get('activityTimeframe')!) as IntervalTime)
//   const collateralTokenList = now([])
//   const positionListQuery = queryPosition(subgraphClient, { account, activityTimeframe, collateralTokenList })

//   return $column(spacing.big, style({ placeContent: 'space-between', flex: 1 }))(
//     $TraderSummary({ ...config, account, positionListQuery })({}),

//     $column(style({ position: 'relative' }))(
//       $ProfilePeformanceTimeline({ ...config, activityTimeframe, positionListQuery, collateralTokenList })({ })
//     )
//   )
// }

