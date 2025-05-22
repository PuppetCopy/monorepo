// import { empty, map } from '@most/core'
// import type { Stream } from '@most/types'
// import { getMatchKey } from '@puppet-copy/middleware/core'
// import { $caretDown, $icon, $Link } from '@puppet-copy/middleware/ui-components'
// import { unixTimestampNow } from '@puppet-copy/middleware/utils'
// import { $node, $text, component, type IBehavior, type INodeCompose, style } from 'aelea/core'
// import { $column, $row, isDesktopScreen, isMobileScreen, spacing } from 'aelea/ui-components'
// import { colorAlpha, pallete } from 'aelea/ui-components-theme'
// import type { Hex } from 'viem'
// import type { Address } from 'viem/accounts'
// import type { IMatchingRule } from '../../__generated__/ponder.types.js'
// import { $tokenTryLabeled } from '../../common/$common.js'
// import { $responsiveFlex } from '../../common/elements/$common.js'
// import { $seperator2 } from '../../pages/common.js'
// import { $Popover } from '../$Popover.js'
// import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'
// import { $MatchRuleEditor, type IMatchingRuleEditorDraft } from './$MatchRuleEditor.js'
// import { $AccountLabel, $profileAvatar } from '../$AccountProfile.js'
// import type { Route } from 'aelea/router'

// interface ITraderMatchingRouteEditor {
//   address: Address
//   traderMatchedPuppetList: Hex[]
//   userMatchingRuleList: IMatchingRule[]
//   collateralToken: Address
//   displayCollateralTokenSymbol?: boolean
//   draftMatchingRuleList: Stream<IMatchingRuleEditorDraft[]>
//   route: Route
//   $container?: INodeCompose
//   labelSize?: number
//   profileSize?: number
// }

// export const $defaultTraderMatchRouteEditorContainer = $row(spacing.small, style({ alignItems: 'center' }))

// export const $TraderMatchingRouteEditor = (config: ITraderMatchingRouteEditor) =>
//   component(
//     (
//       [popRouteSubscriptionEditor, popRouteSubscriptionEditorTether]: IBehavior<any, IMatchingRule | undefined>,
//       [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<IMatchingRuleEditorDraft[]>,
//       [click, clickTether]: IBehavior<any, Address>
//     ) => {
//       const traderMatchingKey = getMatchKey(config.collateralToken, config.address)

//       const {
//         $container = $defaultTraderMatchRouteEditorContainer(style({ flex: 1 })),
//         draftMatchingRuleList,
//         address,
//         collateralToken,
//         traderMatchedPuppetList,
//         userMatchingRuleList,
//         displayCollateralTokenSymbol = false,
//         labelSize,
//         route,
//         profileSize
//       } = config

//       const matchingRule = userMatchingRuleList.length
//         ? userMatchingRuleList.find((mr) => getMatchKey(mr.collateralToken, mr.trader) === traderMatchingKey)
//         : undefined

//       return [
//         $Popover({
//           $container,
//           $open: map(() => {
//             return $MatchRuleEditor({
//               draftMatchingRuleList,
//               model: matchingRule,
//               traderMatchingKey,
//               collateralToken,
//               trader: address
//             })({
//               changeMatchRuleList: changeMatchRuleListTether()
//             })
//           }, popRouteSubscriptionEditor),
//           dismiss: changeMatchRuleList,
//           $target: $ButtonSecondary({
//             $content: $responsiveFlex(style({ alignItems: 'center', gap: isDesktopScreen ? '8px' : '4px' }))(
//               $Link({
//                 $content: $row(spacing.small, style({ alignItems: 'center', textDecoration: 'none' }))(
//                   $profileAvatar({ address, size: profileSize }),
//                   $column(style({ gap: '3px' }))(
//                     $AccountLabel({
//                       address,
//                       primarySize: labelSize
//                     }),
//                     traderMatchedPuppetList.length > 0
//                       ? $row(style({ alignItems: 'center' }))(
//                           ...traderMatchedPuppetList.map((puppet) => {
//                             return style({ marginRight: '-12px', border: '2px solid black' })(
//                               $profileAvatar({ address: puppet, size: 25 })
//                             )
//                           }),
//                           $node(style({ gap: '8px', marginLeft: '16px', fontSize: '.8rem' }))(
//                             $text(`${traderMatchedPuppetList.length}`)
//                           )
//                         )
//                       : $row(style({ alignItems: 'center' }))(
//                           $node(style({ color: pallete.foreground, fontSize: '.8rem' }))($text('0 puppets'))
//                         )
//                   )
//                 ),
//                 route: route.create({ fragment: 'baseRoute' }),
//                 url: `/trader/${address}`
//               })({ click: clickTether() }),
//               $row(style({ alignItems: 'center' }))(
//                 $tokenTryLabeled(collateralToken, displayCollateralTokenSymbol),
//                 isMobileScreen
//                   ? $icon({
//                       $content: $caretDown,
//                       width: '12px',
//                       svgOps: style({ marginLeft: '4px', minWidth: '8px' }),
//                       viewBox: '0 0 32 32'
//                     })
//                   : empty()
//               ),
//               $seperator2,
//               $row(style({ gap: '6px' }))(
//                 $text('Copy'),
//                 isDesktopScreen
//                   ? $icon({
//                       $content: $caretDown,
//                       width: '12px',
//                       svgOps: style({ marginTop: '2px', minWidth: '8px' }),
//                       viewBox: '0 0 32 32'
//                     })
//                   : empty()
//               )
//             ),
//             $container: $defaultMiniButtonSecondary(
//               style({
//                 flex: 1,
//                 borderRadius: '16px',
//                 padding: '8px',
//                 height: 'auto',
//                 borderColor:
//                   matchingRule && matchingRule.expiry > unixTimestampNow()
//                     ? pallete.primary
//                     : colorAlpha(pallete.foreground, 0.25)
//               })
//             )
//           })({
//             click: popRouteSubscriptionEditorTether()
//           })
//         })({}),
//         {
//           changeMatchRuleList,
//           click
//         }
//       ]
//     }
//   )
