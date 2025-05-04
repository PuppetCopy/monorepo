// import { O } from "aelea/core"
// import { $node, $text, component, style } from "aelea/core"
// import { $column, $row, layoutSheet, screenUtils } from "aelea/ui-components"
// import { map, now } from "@most/core"
// import { Stream } from "@most/types"
// import { StateStream, getMappedValue, getTimeSince, getTokenUsd, readableDate, readableTokenPrice, readableUsd, switchMap, unixTimestampNow } from "@puppet/middleware/utils"
// import { IPositionDecrease, IPositionIncrease, IPriceCandle, getMarketIndexToken, getTokenDescription } from "@puppet/middleware/gmx"
// import { IMirrorPosition } from "@puppet/middleware/core"
// import { $Table, $infoLabel, $txHashRef } from "@puppet/middleware/ui-components"
// import * as viem from "viem"
// import * as walletLink from "@puppet/middleware/wallet"
// import { ITradeConfig, ITradeParams } from "./$PositionEditor.js"
// import { IWalletPageParams } from "../../pages/type.js"
// import { IRequestTrade } from "./$PositionAdjustmentDetails"

// interface IPositionAdjustmentHistory extends IWalletPageParams {
//   chain: viem.Chain
//   pricefeed: Stream<IPriceCandle[]>
//   tradeConfig: StateStream<ITradeConfig> // ITradeParams
//   tradeState: StateStream<ITradeParams>
//   mirrorPosition: Stream<IMirrorPosition | null>
// }

// export const $PositionDetails = (config: IPositionAdjustmentHistory) => component((
// ) => {

//   const { chain, walletClientQuery, pricefeed, tradeConfig, tradeState, mirrorPosition } = config

//   return [
//     switchMap(pos => {
//       const dataSource: Stream<(IPositionIncrease | IPositionDecrease)[]> = pos
//         ? now([...pos.increaseList, ...pos.decreaseList].sort((a, b) => Number(b.blockTimestamp - a.blockTimestamp) ))
//         : now([])

//       return $Table({
//         $headerContainer: I$Node(spacing.small, style({ display: 'grid', padding: `12px` })),
//         $rowContainer: I$Node(spacing.small, style({ padding: `12px` })),
//         // headerCellOp: style({ padding: isDesktopScreen ? '15px 15px' : '6px 4px' }),
//         // cellOp: style({ padding: isDesktopScreen ? '4px 15px' : '6px 4px' }),
//         dataSource: dataSource,
//         // $container: $defaultTableContainer(isDesktopScreen ? style({ flex: '1 1 0', minHeight: '100px' }) : style({})),
//         scrollConfig: {
//           insertAscending: true,
//           $emptyMessage: style({ alignSelf: 'center', padding: '26px' })(
//             $infoLabel(`No active position`)
//           )
//         },
//         columns: [
//           {
//             $head: $text('Time'),
//             columnOp: O(style({ maxWidth: '100px' })),

//             $bodyCallback: map((req) => {
//               const isKeeperReq = 'slippage' in req
//               const timestamp = isKeeperReq ? unixTimestampNow() : Number(req.blockTimestamp)

//               return $column(spacing.tiny, style({ fontSize: '.85rem' }))(
//                 $text(getTimeSince(timestamp)),
//                 $text(readableDate(timestamp)),
//               )
//             })
//           },
//           {
//             $head: $text('Action'),
//             columnOp: O(style({ flex: 1 })),
//             $bodyCallback: map((pos) => {
//               const direction = pos.__typename === 'PositionIncrease' ? '↑' : '↓'
//               const indexToken = getMarketIndexToken(pos.market)
//               const tokendescription = getTokenDescription(indexToken)

//               return $row(spacing.small)(
//                 $txHashRef(pos.transactionHash, config.chain),
//                 $text(`${direction} ${readableTokenPrice(tokendescription.decimals, pos.executionPrice)}`)
//               )

//               // return $row(spacing.small)(
//               // switchMap(req => {
//               //   const activePositionAdjustment = take(1, filter(ev => {
//               //     const key = getPositionKey(ev.args.account, pos.isIncrease ? ev.args.path.slice(-1)[0] : ev.args.path[0], ev.args.indexToken, ev.args.isLong)

//               //     return key === getPositionKey(pos.route, pos.collateralToken, pos.indexToken, pos.isLong)
//               //   }, adjustPosition))

//               //   return $row(spacing.small)(
//               //     switchLatest(mergeArray([
//               //       now($spinner),
//               //       map(req => {
//               //         const isRejected = req.eventName === 'CancelIncreasePosition' // || req.eventName === 'CancelDecreasePosition'

//               //         const message = $text(`${isRejected ? `✖ ${readableFixedUSD30(req.args.acceptablePrice)}` : `✔ ${readableFixedUSD30(req.args.acceptablePrice)}`}`)

//               //         return $requestRow(
//               //           $txHashRef(req.transactionHash!, w3p.chain.id, message),
//               //           $infoTooltip('transaction was sent, keeper will execute the request, the request will either be executed or rejected'),
//               //         )
//               //       }, activePositionAdjustment),
//               //     ])),
//               //     $txHashRef(
//               //       req.transactionHash, w3p.chain.id,
//               //       $text(`${isIncrease ? '↑' : '↓'} ${readableFixedUSD30(pos.acceptablePrice)} ${isIncrease ? '<' : '>'}`)
//               //     ),
//               //   )
//               // }, fromPromise(pos.request)),
//               // )

//             })
//           },
//           ...isDesktopScreen
//             ? [
//               {
//                 $head: $text('PnL Realised'),
//                 columnOp: O(style({ flex: .5, placeContent: 'flex-end', textAlign: 'right', alignItems: 'center' })),
//                 $bodyCallback: map((req: IRequestTrade | IPositionIncrease | IPositionDecrease) => {
//                   if ('request' in req) {
//                     return $text('')
//                   }

//                   const pnl = req.priceImpactUsd

//                   return $text(readableUsd(pnl))
//                 })
//               }
//             ] : [],
//           {
//             $head: $text('Collateral'),
//             columnOp: O(style({ flex: .7, placeContent: 'flex-end', textAlign: 'right', alignItems: 'center' })),

//             $bodyCallback: map(req => {
//               const amount = req.__typename === 'PositionIncrease' ? req.collateralAmount : -req.collateralAmount
//               const delta = getTokenUsd(req.collateralTokenPriceMax, amount)

//               return $text(readableUsd(delta))
//             })
//           },
//           {
//             $head: $text('Size'),
//             columnOp: O(style({ flex: .7, placeContent: 'flex-end', textAlign: 'right', alignItems: 'center' })),
//             $bodyCallback: map((req) => {

//               const delta = req.__typename === 'PositionIncrease'
//                 ? req.sizeDeltaUsd : -req.sizeDeltaUsd

//               return $text(readableUsd(delta))
//             })
//           },
//         ]
//       })({})
//     }, mirrorPosition),

//     {

//     }
//   ]
// })

