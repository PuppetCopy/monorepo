import { Behavior, combineObject, fromCallback, replayLatest } from "@aelea/core"
import { $element, $node, $text, component, eventElementTarget, style, styleBehavior } from "@aelea/dom"
import * as router from '@aelea/router'
import { $column, $row, designSheet, layoutSheet } from '@aelea/ui-components'
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import { constant, map, merge, mergeArray, multicast, now, skipRepeats, startWith, switchLatest, take, tap } from '@most/core'
import { Stream } from "@most/types"
import { IntervalTime, filterNull, getTimeSince, readableUnitAmount, switchMap, unixTimestampNow, zipState } from "common-utils"
import { EIP6963ProviderDetail } from "mipd"
import { queryPricefeed, subgraphStatus } from "puppet-middleware-utils"
import { $Tooltip, $alertPositiveContainer, $infoLabeledValue } from "ui-components"
import { indexDb, uiStorage } from "ui-storage"
import * as viem from "viem"
import { arbitrum } from "viem/chains"
import * as walletLink from "wallet"
import { $midContainer } from "../common/$common.js"
import { $heading2 } from "../common/$text"
import { subgraphClient } from "../common/graphClient"
import { announcedProviderList } from "../components/$ConnectWallet"
import { $MainMenu, $MainMenuMobile } from '../components/$MainMenu.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from "../components/form/$Button"
import { IChangeSubscription } from "../components/portfolio/$RouteSubscriptionEditor"
import { newUpdateInvoke } from "../sw/swUtils"
import { fadeIn } from "../transitions/enter.js"
import { $Admin } from "./$Admin"
import { $Home } from "./$Home.js"
import { $rootContainer } from "./common"
import { $Leaderboard } from "./leaderboard/$Leaderboard.js"
import { $PublicUserPage } from "./user/$PublicUser.js"
import { $WalletPage } from "./user/$Wallet.js"
import { $RouteSubscriptionDrawer } from "../components/portfolio/$RouteSubscriptionDrawer"
import localstore from "../const/localStore"
import localStore from "../const/localStore"

const popStateEvent = eventElementTarget('popstate', window)
const initialLocation = now(document.location)
const requestRouteChange = merge(initialLocation, popStateEvent)
const locationChange = map((location) => {
  return location
}, requestRouteChange)

interface IApp {
  baseRoute?: string
}

export const chains = [arbitrum] as const

export const publicTransportMap: walletLink.IWalletLinkConfig['publicTransportMap'] = {
  [arbitrum.id]: viem.fallback([
    viem.webSocket('wss://arb-mainnet.g.alchemy.com/v2/sI7JV4ahbI8oNlOosnZ7klOi8vsxdVwm'),
    viem.http('https://arb1.arbitrum.io/rpc'),
    
  ]),
  // [CHAIN.AVALANCHE]: avaGlobalProvider,
}



export const $Main = ({ baseRoute = '' }: IApp) => component((
  [routeChanges, changeRouteTether]: Behavior<any, string>,
  [modifySubscriptionList, modifySubscriptionListTether]: Behavior<IChangeSubscription[]>,
  [modifySubscriber, modifySubscriberTether]: Behavior<IChangeSubscription>,
  [clickUpdateVersion, clickUpdateVersionTether]: Behavior<any, bigint>,

  [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<IntervalTime>,
  [selectMarketTokenList, selectMarketTokenListTether]: Behavior<viem.Address[]>,

  [changeWallet, changeWalletTether]: Behavior<EIP6963ProviderDetail>,
) => {

  const changes = merge(locationChange, multicast(routeChanges))
  const fragmentsChange = map(() => {
    const trailingSlash = /\/$/
    const relativeUrl = location.href.replace(trailingSlash, '').split(document.baseURI.replace(trailingSlash, ''))[1]
    const frags = relativeUrl.split('/')
    frags.splice(0, 1, baseRoute)
    return frags
  }, changes)


  const rootRoute = router.create({ fragment: baseRoute, title: 'Puppet', fragmentsChange })
  const appRoute = rootRoute.create({ fragment: 'app', title: '' })

  const profileRoute = appRoute.create({ fragment: 'profile' })
  const walletRoute = appRoute.create({ fragment: 'wallet', title: 'Portfolio' })
  const tradeRoute = appRoute.create({ fragment: 'trade' })
  const tradeTermsAndConditions = appRoute.create({ fragment: 'terms-and-conditions' })

  const leaderboardRoute = appRoute.create({ fragment: 'leaderboard' })
  const adminRoute = appRoute.create({ fragment: 'admin' })

  const opengraph = rootRoute.create({ fragment: 'og' })

  const $liItem = $element('li')(style({ marginBottom: '14px' }))

  const isDesktopScreen = skipRepeats(map(() => document.body.clientWidth > 1040 + 280, startWith(null, eventElementTarget('resize', window))))

  const activityTimeframe = uiStorage.replayWrite(localstore.global, changeActivityTimeframe, 'activityTimeframe')
  const selectedCollateralTokenList = uiStorage.replayWrite(localStore.global, selectMarketTokenList, 'collateralTokenList')

  const pricefeedMapQuery = replayLatest(multicast(queryPricefeed(subgraphClient, { activityTimeframe })))

  const subgraphStatusStream = subgraphStatus(subgraphClient)
  const subgraphBeaconStatusColor = map(status => {
    const timestampDelta = unixTimestampNow() - new Date(status.timestamp_caught_up_to_head_or_endblock).getTime()

    const color = timestampDelta > 60 ? pallete.negative : timestampDelta > 10 ? pallete.indeterminate : pallete.positive
    return color
  }, subgraphStatusStream)
  const subgraphStatusColorOnce = take(1, subgraphBeaconStatusColor)

  //  fromPromise(indexDb.get(store.global, 'wallet'))

  const changeWalletProviderRdns = map(detail => {
    return detail ? detail.info.rdns : null
  }, changeWallet)


  const walletRdnsStore = uiStorage.replayWrite(localStore.global, changeWalletProviderRdns, 'wallet')
  const initWalletProvider: Stream<EIP6963ProviderDetail | null> = map(params => {

    return params.walletRdnsStore ? params.announcedProviderList.find(p => p.info.rdns === params.walletRdnsStore) || null : null
  }, combineObject({ announcedProviderList, walletRdnsStore }))


  // hanlde disconnect and account change
  const walletProvider = map(d => d?.provider || null, mergeArray([initWalletProvider, changeWallet]))


  const chainIdQuery = indexDb.get(localStore.global, 'chain')
  const chainQuery: Stream<Promise<viem.Chain>> = now(chainIdQuery.then(id => chains.find(c => c.id === id) || arbitrum))

  const {
    providerClientQuery,
    publicProviderClientQuery,
    walletClientQuery
  } = walletLink.initWalletLink({ publicTransportMap, chainQuery, walletProvider })

  const block = switchMap(async query => (await query).getBlockNumber(), providerClientQuery)
  const latestBlock: Stream<bigint> = switchLatest(switchMap(async query => {
    const provider = await query
    const blockChange = fromCallback(cb => provider.watchBlockNumber({
      onBlockNumber: bn => {
        return cb(bn)
      }
    }))
    return mergeArray([blockChange, block])
  }, providerClientQuery))


  return [
    $column(
      switchMap(cb => {
        return fadeIn(
          $alertPositiveContainer(style({ backgroundColor: pallete.horizon }))(
            filterNull(constant(null, clickUpdateVersion)) as Stream<never>,

            $text('New version Available'),
            $ButtonSecondary({
              $container: $defaultMiniButtonSecondary,
              $content: $text('Update'),
            })({
              click: clickUpdateVersionTether(
                tap(cb)
              )
            })
          )

        )
      }, newUpdateInvoke),
      router.contains(appRoute)(
        $rootContainer(
          $column(style({ flex: 1, position: 'relative' }))(

            $column(
              designSheet.customScroll,
              style({ flex: 1, position: 'absolute', inset: 0, overflowY: 'scroll', overflowX: 'hidden' })
            )(
              switchMap(isDesktop => {
                if (isDesktop) {
                  return $MainMenu({ route: appRoute, walletClientQuery, providerClientQuery })({
                    routeChange: changeRouteTether()
                  })
                }

                return $MainMenuMobile({ route: rootRoute, walletClientQuery, providerClientQuery })({
                  routeChange: changeRouteTether(),
                })
              }, isDesktopScreen),
              router.contains(walletRoute)(
                $midContainer(
                  $WalletPage({ route: walletRoute, providerClientQuery, activityTimeframe, selectedCollateralTokenList, pricefeedMapQuery, walletClientQuery })({
                    changeWallet: changeWalletTether(),
                    modifySubscriber: modifySubscriberTether(),
                    changeRoute: changeRouteTether(),
                    changeActivityTimeframe: changeActivityTimeframeTether(),
                    selectMarketTokenList: selectMarketTokenListTether(),
                  })
                )
              ),
              router.match(leaderboardRoute)(
                $midContainer(
                  fadeIn($Leaderboard({ route: leaderboardRoute, providerClientQuery, activityTimeframe, walletClientQuery, selectedCollateralTokenList, pricefeedMapQuery })({
                    changeActivityTimeframe: changeActivityTimeframeTether(),
                    selectMarketTokenList: selectMarketTokenListTether(),
                    routeChange: changeRouteTether(),
                    modifySubscriber: modifySubscriberTether(),
                  }))
                )
              ),
              router.contains(profileRoute)(
                $midContainer(
                  fadeIn($PublicUserPage({ route: profileRoute, walletClientQuery, pricefeedMapQuery, activityTimeframe, selectedCollateralTokenList, providerClientQuery })({
                    modifySubscriber: modifySubscriberTether(),
                    changeActivityTimeframe: changeActivityTimeframeTether(),
                    // selectMarketTokenList: selectMarketTokenListTether(),
                    changeRoute: changeRouteTether(),
                  }))
                )
              ),
              router.contains(adminRoute)(
                $Admin({ walletClientQuery, providerClientQuery })({
                  changeWallet: changeWalletTether(),
                })
              ),
              router.match(tradeTermsAndConditions)(
                fadeIn(
                  $midContainer(layoutSheet.spacing, style({ maxWidth: '680px', alignSelf: 'center' }))(
                    $heading2(style({ fontSize: '3em', textAlign: 'center' }))('Puppet DAO'),
                    $node(),
                    $text(style({ fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold' }))('Terms And Conditions'),
                    $text(style({ whiteSpace: 'pre-wrap' }))(`By accessing, I agree that ${document.location.host} is not responsible for any loss of funds, and I agree to the following terms and conditions:`),
                    $element('ul')(layoutSheet.spacing, style({}))(
                      $liItem(
                        $text(`I am not a United States person or entity;`),
                      ),
                      $liItem(
                        $text(`I am not a resident, national, or agent of any country to which the United States, the United Kingdom, the United Nations, or the European Union embargoes goods or imposes similar sanctions, including without limitation the U.S. Office of Foreign Asset Control, Specifically Designated Nationals and Blocked Person List;`),
                      ),
                      $liItem(
                        $text(`I am legally entitled to access the Interface under the laws of the jurisdiction where I am located;`),
                      ),
                      $liItem(
                        $text(`I am responsible for the risks using the Interface, including, but not limited to, the following: (i) the use of Puppet smart contracts; (ii) leverage trading, the risk may result in the total loss of my deposit.`),
                      ),
                    ),
                    $node(style({ height: '100px' }))(),
                  )
                ),
              ),
              $row(layoutSheet.spacing, style({ position: 'fixed', zIndex: 100, right: '16px', bottom: '16px' }))(
                $row(
                  $Tooltip({
                    $content: switchMap(params => {
                      const blocksBehind = $text(readableUnitAmount(Math.max(0, Number(params.latestBlock - params.subgraphStatus.latest_processed_block))))
                      const timeSince = getTimeSince(new Date(params.subgraphStatus.timestamp_caught_up_to_head_or_endblock).getTime())


                      return $column(layoutSheet.spacingTiny)(
                        $text('Subgraph Status'),
                        $column(
                          // params.subgraphStatus.hasIndexingErrors
                          //   ? $alertPositiveContainer($text('Indexing has experienced errors')) : empty(),
                          $infoLabeledValue('Latest Sync', timeSince),
                          $infoLabeledValue('blocks behind', blocksBehind),
                        )
                      )
                    }, zipState({ subgraphStatus: subgraphStatusStream, latestBlock })),
                    $anchor: $row(
                      style({ width: '8px', height: '8px', borderRadius: '50%', outlineOffset: '4px', padding: '6px' }),
                      styleBehavior(map(color => {
                        return { backgroundColor: colorAlpha(color, .5), outlineColor: color }
                      }, subgraphStatusColorOnce))
                    )(
                      $node(
                        style({
                          position: 'absolute', top: 'calc(50% - 20px)', left: 'calc(50% - 20px)', width: '40px', height: '40px',
                          borderRadius: '50%', border: `1px solid rgba(74, 180, 240, 0.12)`, opacity: 0,
                          animationName: 'signal', animationDuration: '2s',
                          animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        }),
                        styleBehavior(map(color => {
                          return { backgroundColor: colorAlpha(color, .5), animationIterationCount: color === pallete.negative ? 'infinite' : 1 }
                        }, subgraphStatusColorOnce))
                      )()
                    ),
                  })({}),
                ),

              ),
            )
          ),

          $column(style({ maxWidth: '1000px', margin: '0 auto', width: '100%', zIndex: 10 }))(
            $RouteSubscriptionDrawer({
              providerClientQuery,
              walletClientQuery,
              modifySubscriptionList: replayLatest(modifySubscriptionList, []),
              modifySubscriber,
            })({
              changeWallet: changeWalletTether(),
              modifySubscriptionList: modifySubscriptionListTether()
            })
          )
        )
      ),

      router.match(rootRoute)(
        $rootContainer(
          designSheet.customScroll,
          style({
            scrollSnapType: 'y mandatory',
            fontSize: '1.15rem',
            overflow: 'hidden scroll',
            maxHeight: '100vh',
            margin: '0 auto', width: '100%'
          })
        )(
          $Home({
            parentRoute: rootRoute,
          })({ routeChanges: changeRouteTether() })
        )
      ),

      // router.contains(opengraph)(
      //   $Opengraph(opengraph)({
      //     changeRoute: changeRouteTether()
      //   })
      // )

    )

  ]
})

