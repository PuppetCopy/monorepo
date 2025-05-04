import {
  constant,
  fromPromise,
  map,
  merge,
  mergeArray,
  multicast,
  now,
  skipRepeats,
  startWith,
  take,
  tap
} from '@most/core'
import type { Stream } from '@most/types'
import type { IntervalTime } from '@puppet/middleware/const'
import {
  $alertNegativeContainer,
  $alertPositiveContainer,
  $infoLabeledValue,
  $Tooltip
} from '@puppet/middleware/ui-components'
import { indexDb, uiStorage } from '@puppet/middleware/ui-storage'
import {
  filterNull,
  getTimeSince,
  readableUnitAmount,
  switchMap,
  unixTimestampNow,
  zipState
} from '@puppet/middleware/utils'
import * as walletLink from '@puppet/middleware/wallet'
// import { announcedProviderList } from "../components/$ConnectWallet"
import { connect, disconnect, reconnect, watchAccount, watchBlockNumber, watchBlocks } from '@wagmi/core'
import {
  $element,
  $node,
  $text,
  component,
  eventElementTarget,
  fromCallback,
  type IBehavior,
  replayLatest,
  style,
  styleBehavior
} from 'aelea/core'
import * as router from 'aelea/router'
import { $column, $row, designSheet, layoutSheet } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { EIP6963ProviderDetail } from 'mipd'
import type * as viem from 'viem'
import { arbitrum } from 'viem/chains'
import { $midContainer } from '../common/$common.js'
import { $heading2 } from '../common/$text.js'
import { queryPricefeed, subgraphStatus } from '../common/query.js'
import { $MainMenu, $MainMenuMobile } from '../components/$MainMenu.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../components/form/$Button.js'
import type { IDepositEditorChange } from '../components/portfolio/$DepositEditor.js'
import { $PortfolioEditorDrawer } from '../components/portfolio/$PortfolioEditorDrawer.js'
import type { IMatchRuleEditorChange } from '../components/portfolio/$TraderMatchRouteEditor.js'
import { localStore } from '../const/localStore.js'
import { pwaUpgradeNotification } from '../sw/swUtils.js'
import { fadeIn } from '../transitions/enter.js'
import { wagmiConfig, walletConnectAppkit } from '../walletConnect.js'
import { $Admin } from './$Admin.js'
import { $Home } from './$Home.js'
import { $rootContainer } from './common.js'
import { $Leaderboard } from './leaderboard/$Leaderboard.js'
import { $WalletPage } from './user/$Wallet.js'

const popStateEvent = eventElementTarget('popstate', window)
const initialLocation = now(document.location)
const requestRouteChange = merge(initialLocation, popStateEvent)
const locationChange = map((location) => {
  return location
}, requestRouteChange)

interface IApp {
  baseRoute?: string
}

export const $Main = ({ baseRoute = '' }: IApp) =>
  component(
    (
      [routeChanges, changeRouteTether]: Behavior<any, string>,
      [clickUpdateVersion, clickUpdateVersionTether]: Behavior<any, bigint>,

      [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<IntervalTime>,
      [selectMarketTokenList, selectMarketTokenListTether]: Behavior<viem.Address[]>,

      [changeWallet, changeWalletTether]: Behavior<EIP6963ProviderDetail>,

      [changeMatchRuleList, changeMatchRuleListTether]: Behavior<IMatchRuleEditorChange[]>,
      [changeDepositTokenList, changeDepositTokenListTether]: Behavior<IDepositEditorChange[]>
    ) => {
      walletConnectAppkit.getIsConnectedState()

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

      const _profileRoute = rootRoute.create({ fragment: 'profile' })
      const walletRoute = rootRoute.create({ fragment: 'wallet', title: 'Portfolio' })
      const _tradeRoute = rootRoute.create({ fragment: 'trade' })
      const _tradeTermsAndConditions = rootRoute.create({ fragment: 'terms-and-conditions' })

      const leaderboardRoute = rootRoute.create({ fragment: 'leaderboard' })
      const _adminRoute = rootRoute.create({ fragment: 'admin' })

      const _opengraph = rootRoute.create({ fragment: 'og' })

      const _$liItem = $element('li')(style({ marginBottom: '14px' }))

      const isDesktopScreen = skipRepeats(
        map(() => document.body.clientWidth > 1040 + 280, startWith(null, eventElementTarget('resize', window)))
      )

      const activityTimeframe = uiStorage.replayWrite(localStore.global, changeActivityTimeframe, 'activityTimeframe')
      const selectedCollateralTokenList = uiStorage.replayWrite(
        localStore.global,
        selectMarketTokenList,
        'collateralTokenList'
      )

      const pricefeedMapQuery = replayLatest(multicast(queryPricefeed({ activityTimeframe })))

      const subgraphBeaconStatusColor = map((status) => {
        const timestampDelta = unixTimestampNow() - new Date(status.arbitrum?.block?.number || 0).getTime()

        const color =
          timestampDelta > 60 ? pallete.negative : timestampDelta > 10 ? pallete.indeterminate : pallete.positive
        return color
      }, subgraphStatus)
      const subgraphStatusColorOnce = take(1, subgraphBeaconStatusColor)

      const latestBlock: Stream<bigint> = mergeArray([
        // fromPromise(useBlockNumber().promise),
        fromCallback((cb) =>
          watchBlockNumber(wagmiConfig, {
            onBlockNumber(blockNumber) {
              cb(blockNumber)
            }
          })
        )
      ])

      const matchRuleList = replayLatest(multicast(changeMatchRuleList), [] as IMatchRuleEditorChange[])
      const depositTokenList = replayLatest(multicast(changeDepositTokenList), [] as IDepositEditorChange[])

      return [
        $column(
          switchMap((cb) => {
            return fadeIn(
              $alertPositiveContainer(style({ backgroundColor: pallete.horizon }))(
                filterNull(constant(null, clickUpdateVersion)) as Stream<never>,

                $text('New version Available'),
                $ButtonSecondary({
                  $container: $defaultMiniButtonSecondary,
                  $content: $text('Update')
                })({
                  click: clickUpdateVersionTether(tap(cb))
                })
              )
            )
          }, pwaUpgradeNotification),
          router.contains(rootRoute)(
            $rootContainer(
              $column(style({ flex: 1, position: 'relative' }))(
                $column(
                  designSheet.customScroll,
                  style({ flex: 1, position: 'absolute', inset: 0, overflowY: 'scroll', overflowX: 'hidden' })
                )(
                  switchMap((isDesktop) => {
                    if (isDesktop) {
                      return $MainMenu({ route: rootRoute })({
                        routeChange: changeRouteTether(),
                        changeWallet: changeWalletTether()
                      })
                    }

                    return $MainMenuMobile({ route: rootRoute })({
                      routeChange: changeRouteTether()
                    })
                  }, isDesktopScreen),
                  router.contains(walletRoute)(
                    $midContainer(
                      $WalletPage({
                        route: walletRoute,
                        depositTokenList,
                        matchRuleList,
                        activityTimeframe,
                        selectedCollateralTokenList,
                        pricefeedMapQuery
                      })({
                        changeWallet: changeWalletTether(),
                        changeRoute: changeRouteTether(),
                        changeActivityTimeframe: changeActivityTimeframeTether(),
                        selectMarketTokenList: selectMarketTokenListTether(),

                        changeMatchRuleList: changeMatchRuleListTether(),
                        changeDepositTokenList: changeDepositTokenListTether()
                      })
                    )
                  ),
                  router.match(rootRoute)(
                    $midContainer(
                      fadeIn(
                        $Leaderboard({
                          route: leaderboardRoute,
                          activityTimeframe,
                          selectedCollateralTokenList,
                          matchRuleList,
                          depositTokenList,
                          pricefeedMapQuery
                        })({
                          changeActivityTimeframe: changeActivityTimeframeTether(),
                          selectMarketTokenList: selectMarketTokenListTether(),
                          routeChange: changeRouteTether(),
                          changeMatchRuleList: changeMatchRuleListTether()
                        })
                      )
                    )
                  ),
                  // // router.contains(profileRoute)(
                  // //   $midContainer(
                  // //     fadeIn($PublicUserPage({ route: profileRoute, walletClientQuery, pricefeedMapQuery, activityTimeframe, selectedCollateralTokenList, providerClientQuery, matchRuleList, depositTokenList })({
                  // //       changeActivityTimeframe: changeActivityTimeframeTether(),
                  // //       changeMatchRuleList: changeMatchRuleListTether(),
                  // //       changeRoute: changeRouteTether(),
                  // //     }))
                  // //   )
                  // // ),
                  // router.contains(adminRoute)(
                  //   $Admin({ walletClientQuery, providerClientQuery })({
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
                  $row(
                    spacing.default,
                    style({ position: 'fixed', zIndex: 100, right: '16px', bottom: '16px' })
                  )(
                    $row(
                      $Tooltip({
                        $content: switchMap(
                          (params) => {
                            const status = params.subgraphStatus.arbitrum

                            if (!status.ready || status.block === null) {
                              return $column(spacing.defaultTiny)(
                                $text('Subgraph Status'),
                                $alertNegativeContainer(
                                  $text('Indexing is currently experiencing issues, please try again later.')
                                )
                              )
                            }

                            const blocksBehind = $text(
                              readableUnitAmount(Number(params.latestBlock) - status.block.number)
                            )
                            const timeSince = getTimeSince(new Date(status.block.timestamp || 0).getTime())

                            return $column(spacing.defaultTiny)(
                              $text('Subgraph Status'),
                              $column(
                                $infoLabeledValue('Latest Sync', timeSince),
                                $infoLabeledValue('blocks behind', blocksBehind)
                              )
                            )
                          },
                          zipState({ subgraphStatus: subgraphStatus, latestBlock })
                        ),
                        $anchor: $row(
                          style({
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            outlineOffset: '4px',
                            padding: '6px'
                          }),
                          styleBehavior(
                            map((color) => {
                              return { backgroundColor: colorAlpha(color, 0.5), outlineColor: color }
                            }, subgraphStatusColorOnce)
                          )
                        )(
                          $node(
                            style({
                              position: 'absolute',
                              top: 'calc(50% - 20px)',
                              left: 'calc(50% - 20px)',
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              border: '1px solid rgba(74, 180, 240, 0.12)',
                              opacity: 0,
                              animationName: 'signal',
                              animationDuration: '2s',
                              animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                            }),
                            styleBehavior(
                              map((color) => {
                                return {
                                  backgroundColor: colorAlpha(color, 0.5),
                                  animationIterationCount: color === pallete.negative ? 'infinite' : 1
                                }
                              }, subgraphStatusColorOnce)
                            )
                          )()
                        )
                      })({})
                    )
                  )
                )
              )

              // $column(style({ maxWidth: '1000px', margin: '0 auto', width: '100%', zIndex: 10 }))(
              //   $PortfolioEditorDrawer({
              //     depositTokenList,
              //     providerClientQuery,
              //     walletClientQuery,
              //     matchRuleList
              //   })({
              //     changeWallet: changeWalletTether(),
              //     changeMatchRuleList: changeMatchRuleListTether(),
              //     changeDepositTokenList: changeDepositTokenListTether(),
              //   })
              // )
            )
          )

          // router.match(rootRoute)(
          //   $rootContainer(
          //     designSheet.customScroll,
          //     style({
          //       scrollSnapType: 'y mandatory',
          //       fontSize: '1.15rem',
          //       overflow: 'hidden scroll',
          //       maxHeight: '100vh',
          //       margin: '0 auto', width: '100%'
          //     })
          //   )(
          //     $Home({
          //       parentRoute: rootRoute,
          //     })({ routeChanges: changeRouteTether() })
          //   )
          // ),

          // router.contains(opengraph)(
          //   $Opengraph(opengraph)({
          //     changeRoute: changeRouteTether()
          //   })
          // )
        )
      ]
    }
  )
