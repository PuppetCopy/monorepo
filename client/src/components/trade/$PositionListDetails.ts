// import { Behavior, combineObject } from "@aelea/core"
// import { $Node, $text, NodeComposeFn, component, style, styleBehavior } from "@aelea/dom"
// import { $column, $row, layoutSheet, screenUtils } from "@aelea/ui-components"
// import { pallete } from "@aelea/ui-components-theme"
// import { constant, map, mergeArray } from "@most/core"
// import { Stream } from "@most/types"
// import { StateStream, filterNull } from "@puppet/middleware/utils"
// import { IMarket } from "../gmx/index.js"
// import { IMirrorPosition } from "puppet-middleware"
// import { $IntermediatePromise } from "@puppet/middleware/ui-components"
// import * as viem from "viem"
// import { $entry, $positionPnl, $sizeAndLiquidation } from "../../common/$common.js"
// import { $seperator2 } from "../../pages/common"
// import { $ButtonPrimary, $ButtonSecondary, $defaultMiniButtonSecondary } from "../form/$Button.js"
// import { IRequestTrade } from "./$PositionAdjustmentDetails"
// import { ITradeParams } from "./$PositionEditor.js"




// interface IPositionListDetails {
//   chain: viem.Chain
//   positionListQuery: Stream<Promise<IMirrorPosition[]>>
//   tradeState: StateStream<ITradeParams>
//   $container: NodeComposeFn<$Node>
//   requestTrade: Stream<IRequestTrade>
//   mirrorPosition: Stream<IMirrorPosition | null>
// }
// export const $PositionListDetails = (config: IPositionListDetails) => component((
//   [switchPosition, switchPositionTether]: Behavior<any, IMirrorPosition>,
//   [clickClose, clickCloseTeter]: Behavior<any, IMirrorPosition>,

//   [changeMarket, changeMarketTether]: Behavior<IMarket>,
//   [switchIsLong, switchIsLongTether]: Behavior<boolean>,
//   [switchIsIncrease, switchIsIncreaseTether]: Behavior<boolean>,
// ) => {

//   const { chain, positionListQuery, tradeState, $container, requestTrade, mirrorPosition } = config


//   return [
//     config.$container(
//       $IntermediatePromise({
//         $$done: map(posList => {
//           return $column(layoutSheet.spacing, style({ flex: 1 }))(
//             ...posList.map(mp => {


//               // const cumulativeFee = vault.read('cumulativeFundingRates', pos.collateralToken)
//               // const pnl = map(params => {
//               //   const delta = getPnL(pos.isLong, pos.averagePrice, params.positionMarkPrice.min, pos.size)

//               //   return pos.realisedPnl + delta - pos.cumulativeFee
//               // }, combineObject({ positionMarkPrice, cumulativeFee }))



//               return $column(layoutSheet.spacing)(
//                 style({ marginRight: screenUtils.isDesktopScreen ? '-16px' : '' })($seperator2),

//                 $row(style({ placeContent: 'space-between', alignItems: 'center' }))(
//                   $ButtonPrimary({
//                     $content: $entry(mp),
//                     $container: $defaultMiniButtonSecondary(
//                       styleBehavior(map(activePositionSlot => ({ backgroundColor: activePositionSlot.key === mp.key ? pallete.primary : pallete.middleground }), filterNull(mirrorPosition))),
//                       style({ borderRadius: '20px', borderColor: 'transparent',  })
//                     )
//                   })({
//                     click: switchPositionTether(
//                       constant(mp),
//                     )
//                   }),
//                   $sizeAndLiquidation(mp),
//                   $positionPnl(mp),
//                   $ButtonSecondary({
//                     $content: $text('Close'),
//                     $container: $defaultMiniButtonSecondary
//                   })({
//                     click: clickCloseTeter(
//                       constant(mp),
//                     )
//                   })
//                 ),
 
//                 // isActive
//                 //   ? $column(layoutSheet.spacing, styleInline(map(mode => ({ display: mode ? 'flex' : 'none' }), inTradeMode)))(
//                 //     $seperator2,
//                 //     $adjustmentDetails,
//                 //   )
//                 //   : empty(),

//               // $infoTooltipLabel(
//               //   $openPositionPnlBreakdown(pos, cumulativeFee),
//               //   $pnlValue(pnl)
//               // ),
//               )
//             })
//           )
//         }),
//         query: config.positionListQuery
//       })({}),
//     ),

//     {
//       switchPosition: mergeArray([
//         switchPosition,
//         // clickClose
//       ]),
//       changeMarketToken: map((posSlot) => posSlot.market, switchPosition),
//       switchIsLong: map(params => params.switchPosition.isLong, combineObject({ switchPosition })),
//       switchIsIncrease: mergeArray([
//         constant(true, switchPosition),
//         constant(false, clickClose)
//       ]),
//       changeLeverage: constant(0n, clickClose),
//     }
//   ]
// })



