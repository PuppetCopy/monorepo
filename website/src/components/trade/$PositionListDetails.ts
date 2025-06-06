// import { IBehavior, combineState } from "aelea/core"
// import { I$Node, $text, NodeComposeFn, component, style, styleBehavior } from "aelea/core"
// import { $column, $row, layoutSheet, screenUtils } from "aelea/ui-components"
// import { pallete } from "aelea/ui-components-theme"
// import { constant, map, mergeArray } from "@most/core"
// import { Stream } from "@most/types"
// import { StateStream, filterNull } from "@puppet-copy/middleware/utils"
// import { IMarket } from "@puppet-copy/middleware/gmx"
// import { IMirrorPosition } from "@puppet-copy/middleware/core"
// import { $IntermediatePromise } from "@puppet-copy/middleware/ui-components"
// import * as viem from "viem"
// import { $entry, $positionPnl, $sizeAndLiquidation } from "../../common/$common.js"
// import { $seperator2 } from "../../pages/common"
// import { $ButtonPrimary, $ButtonSecondary, $defaultMiniButtonSecondary } from "../form/$Button.js"
// import { IRequestTrade } from "./$PositionAdjustmentDetails"
// import { ITradeParams } from "./$PositionEditor.js"

// interface IPositionListDetails {
//   chain: Chain
//   positionListQuery: Stream<Promise<IMirrorPosition[]>>
//   tradeState: StateStream<ITradeParams>
//   $container: INodeCompose
//   requestTrade: Stream<IRequestTrade>
//   mirrorPosition: Stream<IMirrorPosition | null>
// }
// export const $PositionListDetails = (config: IPositionListDetails) => component((
//   [switchPosition, switchPositionTether]: IBehavior<any, IMirrorPosition>,
//   [clickClose, clickCloseTeter]: IBehavior<any, IMirrorPosition>,

//   [changeMarket, changeMarketTether]: IBehavior<IMarket>,
//   [switchIsLong, switchIsLongTether]: IBehavior<boolean>,
//   [switchIsIncrease, switchIsIncreaseTether]: IBehavior<boolean>,
// ) => {

//   const { chain, positionListQuery, tradeState, $container, requestTrade, mirrorPosition } = config

//   return [
//     config.$container(
//       $IntermediatePromise({
//         $$done: map(posList => {
//           return $column(spacing.default, style({ flex: 1 }))(
//             ...posList.map(mp => {

//               // const cumulativeFee = vault.read('cumulativeFundingRates', pos.collateralToken)
//               // const pnl = map(params => {
//               //   const delta = getPnL(pos.isLong, pos.averagePrice, params.positionMarkPrice.min, pos.size)

//               //   return pos.realisedPnl + delta - pos.cumulativeFee
//               // }, combineState({ positionMarkPrice, cumulativeFee }))

//               return $column(spacing.default)(
//                 style({ marginRight: isDesktopScreen ? '-16px' : '' })($seperator2),

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
//                 //   ? $column(spacing.default, styleInline(map(mode => ({ display: mode ? 'flex' : 'none' }), inTradeMode)))(
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
//       switchIsLong: map(params => params.switchPosition.isLong, combineState({ switchPosition })),
//       switchIsIncrease: mergeArray([
//         constant(true, switchPosition),
//         constant(false, clickClose)
//       ]),
//       changeLeverage: constant(0n, clickClose),
//     }
//   ]
// })

