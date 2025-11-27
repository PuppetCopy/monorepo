import type { IntervalTime } from '@puppet-copy/middleware/const'
import { ETH_ADDRESS_REGEXP, ignoreAll, unixTimestampNow } from '@puppet-copy/middleware/core'
import * as router from 'aelea/router'
import { awaitPromises, map, merge, start, switchMap, tap } from 'aelea/stream'
import { type IBehavior, multicast, state } from 'aelea/stream-extended'
import { $node, $text, $wrapNativeElement, component, fromEventTarget, style } from 'aelea/ui'
import { $column, designSheet, isDesktopScreen, isMobileScreen, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $alertPositiveContainer } from '@/ui-components'
import { contains } from '@/ui-router/resolveUrl.js'
import { uiStorage } from '@/ui-storage'
import { $midContainer } from '../common/$common.js'
import { queryUserMatchingRuleList, subgraphStatus } from '../common/query.js'
import { $MainMenu } from '../components/$MainMenu.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../components/form/$Button.js'
import type { IDepositEditorDraft } from '../components/portfolio/$DepositEditor.js'
import type { ISetMatchingRuleEditorDraft } from '../components/portfolio/$MatchingRuleEditor.js'
import { $PortfolioEditorDrawer } from '../components/portfolio/$PortfolioEditorDrawer.js'
import { localStore } from '../const/localStore.js'
import { pwaUpgradeNotification } from '../sw/swUtils.js'
import { fadeIn } from '../transitions/enter.js'
import { wallet } from '../wallet/wallet.js'
import { $Leaderboard } from './$Leaderboard.js'
import { $PortfolioPage } from './$Portfolio.js'
import { $TraderPage } from './$Trader.js'

const popStateEvent = fromEventTarget(window, 'popstate')
const requestRouteChange = start(document.location, popStateEvent)
const locationChange = map(location => {
  return location
}, requestRouteChange)

interface IApp {
  baseRoute?: string
}

export const $Main = ({ baseRoute = '' }: IApp) =>
  component(
    (
      [routeChanges, changeRouteTether]: IBehavior<any, string>,
      [clickUpdateVersion, clickUpdateVersionTether]: IBehavior<any, bigint>,

      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<IntervalTime>,
      [selectCollateralTokenList, selectCollateralTokenListTether]: IBehavior<Address[]>,
      [selectIndexTokenList, selectIndexTokenListTether]: IBehavior<Address[]>,

      [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<ISetMatchingRuleEditorDraft[]>,
      [changeDepositTokenList, changeDepositTokenListTether]: IBehavior<IDepositEditorDraft[]>
    ) => {
      // walletConnectAppkit.getIsConnectedState()

      const changes = merge(locationChange, multicast(routeChanges))
      const fragmentsChange = map(() => {
        const trailingSlash = /\/$/
        const relativeUrl = location.href
          .replace(trailingSlash, '')
          .split(document.baseURI.replace(trailingSlash, ''))[1]
        const frags = relativeUrl.split('/')
        frags.splice(0, 1, baseRoute)
        return frags
      }, changes)

      const rootRoute = router.create({ fragment: baseRoute, title: 'Puppet', fragmentsChange })
      // const appRoute = rootRoute.create({ fragment: 'app', title: '' })

      const leaderboardRoute = rootRoute.create({ fragment: 'leaderboard' })
      const traderRoute = rootRoute.create({ fragment: 'trader' }).create({
        title: 'Trader',
        fragment: ETH_ADDRESS_REGEXP
      })
      const portfolioRoute = rootRoute.create({ fragment: 'portfolio', title: 'Portfolio' })

      const activityTimeframe = uiStorage.replayWrite(localStore.global.activityTimeframe, changeActivityTimeframe)
      const collateralTokenList = uiStorage.replayWrite(
        localStore.global.collateralTokenList,
        selectCollateralTokenList
      )
      const indexTokenList = uiStorage.replayWrite(localStore.global.indexTokenList, selectIndexTokenList)

      const subgraphBeaconStatusColor = map(status => {
        const timestampDelta = unixTimestampNow() - new Date(status.arbitrum?.block?.number || 0).getTime()

        const color =
          timestampDelta > 60 ? pallete.negative : timestampDelta > 10 ? pallete.indeterminate : pallete.positive
        return color
      }, subgraphStatus)

      const userMatchingRuleQuery = state(
        queryUserMatchingRuleList({
          address: map(getAccountStatus => getAccountStatus?.address, awaitPromises(wallet.account))
        })
      )

      const draftMatchingRuleList = state(changeMatchRuleList, [])
      const draftDepositTokenList = state(changeDepositTokenList, [])

      return [
        $wrapNativeElement(document.body)(
          spacing.big,
          designSheet.customScroll,
          style({
            color: pallete.message,
            fill: pallete.message,
            backgroundColor: pallete.horizon,
            fontSize: isDesktopScreen ? '16px' : '14px',
            fontWeight: 400
          }),
          isMobileScreen ? style({ userSelect: 'none' }) : style({})
        )(
          switchMap(cb => {
            return fadeIn(
              $alertPositiveContainer(
                style({
                  backgroundColor: pallete.horizon,
                  margin: '12px',
                  placeSelf: 'center',
                  border: `1px solid ${pallete.foreground}`,
                  borderRadius: '14px',
                  gap: '10px',
                  alignItems: 'center',
                  padding: '12px 16px',
                  maxWidth: '460px'
                })
              )(
                $column(spacing.tiny)(
                  $node(style({ fontWeight: 700 }))($text('New version available')),
                  $node(style({ color: pallete.foreground }))($text('Reload to switch to the new version.')),
                  ignoreAll(clickUpdateVersion)
                ),
                $ButtonSecondary({
                  $container: $defaultMiniButtonSecondary,
                  $content: $text('Reload')
                })({
                  click: clickUpdateVersionTether(tap(cb))
                })
              )
            )
          }, pwaUpgradeNotification),

          $MainMenu({ route: rootRoute })({
            routeChange: changeRouteTether()
          }),

          router.match(rootRoute)(
            $midContainer(
              fadeIn(
                $Leaderboard({
                  route: leaderboardRoute,
                  draftMatchingRuleList,
                  activityTimeframe,
                  collateralTokenList,
                  indexTokenList,
                  userMatchingRuleQuery
                })({
                  changeActivityTimeframe: changeActivityTimeframeTether(),
                  selectCollateralTokenList: selectCollateralTokenListTether(),
                  selectIndexTokenList: selectIndexTokenListTether(),
                  routeChange: changeRouteTether(),
                  changeMatchRuleList: changeMatchRuleListTether()
                })
              )
            )
          ),
          contains(traderRoute)(
            $midContainer(
              fadeIn(
                $TraderPage({
                  userMatchingRuleQuery,
                  activityTimeframe,
                  collateralTokenList,
                  indexTokenList,
                  draftMatchingRuleList
                })({
                  selectCollateralTokenList: selectCollateralTokenListTether(),
                  selectIndexTokenList: selectIndexTokenListTether(),
                  changeActivityTimeframe: changeActivityTimeframeTether(),
                  changeMatchRuleList: changeMatchRuleListTether(),
                  changeRoute: changeRouteTether()
                })
              )
            )
          ),
          contains(portfolioRoute)(
            $midContainer(
              fadeIn(
                $PortfolioPage({
                  draftMatchingRuleList,
                  draftDepositTokenList,
                  userMatchingRuleQuery,
                  activityTimeframe,
                  collateralTokenList,
                  indexTokenList
                })({
                  changeDepositTokenList: changeDepositTokenListTether(),
                  selectCollateralTokenList: selectCollateralTokenListTether(),
                  selectIndexTokenList: selectIndexTokenListTether(),
                  changeActivityTimeframe: changeActivityTimeframeTether(),
                  changeMatchRuleList: changeMatchRuleListTether()
                })
              )
            )
          ),
          // router.contains(adminRoute)(
          //   $Admin({  providerClientQuery })({
          //     changeWallet: changeWalletTether(),
          //   })
          // ),
          // router.match(tradeTermsAndConditions)(
          //   fadeIn(
          //     $midContainer(spacing.default, style({ maxWidth: '680px', alignSelf: 'center' }))(
          //       $heading2(style({ fontSize: '3em', textAlign: 'center' }))('Puppet DAO'),
          //       $node(),
          //       $text(style({ fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold' }))('Terms And Conditions'),
          //       $text(style({ whiteSpace: 'pre-wrap' }))(`By accessing, I agree that ${document.location.host} is not responsible for any loss of funds, and I agree to the following terms and conditions:`),
          //       $element('ul')(spacing.default, style({}))(
          //         $liItem(
          //           $text(`I am not a United States person or entity;`),
          //         ),
          //         $liItem(
          //           $text(`I am not a resident, national, or agent of any country to which the United States, the United Kingdom, the United Nations, or the European Union embargoes goods or imposes similar sanctions, including without limitation the U.S. Office of Foreign Asset Control, Specifically Designated Nationals and Blocked Person List;`),
          //         ),
          //         $liItem(
          //           $text(`I am legally entitled to access the Interface under the laws of the jurisdiction where I am located;`),
          //         ),
          //         $liItem(
          //           $text(`I am responsible for the risks using the Interface, including, but not limited to, the following: (i) the use of Puppet smart contracts; (ii) leverage trading, the risk may result in the total loss of my deposit.`),
          //         ),
          //       ),
          //       $node(style({ height: '100px' }))(),
          //     )
          //   ),
          // ),
          // $row(
          //   spacing.default,
          //   style({ position: 'fixed', zIndex: 100, right: '16px', bottom: '16px' })
          // )(
          //   $Tooltip({
          //     $content: switchMap(
          //       params => {
          //         const status = params.subgraphStatus.arbitrum

          //         if (status.block === null) {
          //           return $column(spacing.tiny)(
          //             $text('Subgraph Status'),
          //             $alertNegativeContainer(
          //               $text('Indexing is currently experiencing issues, please try again later.')
          //             )
          //           )
          //         }

          //         const blocksBehind = readableUnitAmount(Number(params.latestBlock) - status.block.number)
          //         const timeSince = getTimeSince(new Date(status.block.timestamp || 0).getTime())

          //         return $column(spacing.tiny)(
          //           $text('Subgraph Status'),
          //           $column(
          //             $infoLabeledValue('Latest Sync', timeSince),
          //             $infoLabeledValue('blocks behind', blocksBehind)
          //           )
          //         )
          //       },
          //       zip({ subgraphStatus: subgraphStatus, latestBlock })
          //     ),
          //     $anchor: $row(
          //       style({
          //         width: '8px',
          //         height: '8px',
          //         borderRadius: '50%',
          //         outlineOffset: '4px',
          //         padding: '6px'
          //       }),
          //       styleBehavior(
          //         map(color => {
          //           return { backgroundColor: colorAlpha(color, 0.5), outlineColor: color }
          //         }, subgraphStatusColorOnce)
          //       )
          //     )(
          //       $node(
          //         style({
          //           position: 'absolute',
          //           top: 'calc(50% - 20px)',
          //           left: 'calc(50% - 20px)',
          //           width: '40px',
          //           height: '40px',
          //           borderRadius: '50%',
          //           border: '1px solid rgba(74, 180, 240, 0.12)',
          //           opacity: 0,
          //           animationName: 'signal',
          //           animationDuration: '2s',
          //           animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          //         }),
          //         styleBehavior(
          //           map(color => {
          //             return {
          //               backgroundColor: colorAlpha(color, 0.5),
          //               animationIterationCount: color === pallete.negative ? 'infinite' : 1
          //             }
          //           }, subgraphStatusColorOnce)
          //         )
          //       )()
          //     )
          //   })({})
          // ),

          contains(rootRoute)(
            $column(
              style({
                maxWidth: '1000px',
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                margin: '0 auto',
                width: '100%',
                zIndex: 10
              })
            )(
              $PortfolioEditorDrawer({
                route: rootRoute,
                userMatchingRuleQuery,
                draftDepositTokenList,
                draftMatchingRuleList
              })({
                routeChange: changeRouteTether(),
                changeMatchRuleList: changeMatchRuleListTether(),
                changeDepositTokenList: changeDepositTokenListTether()
              })
            )
          )
        )
      ]
    }
  )
