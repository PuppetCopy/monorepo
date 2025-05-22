import { constant, map, merge, mergeArray, multicast, now, take, tap } from '@most/core'
import type { Stream } from '@most/types'
import type { IntervalTime } from '@puppet/middleware/const'
import {
  $alertNegativeContainer,
  $alertPositiveContainer,
  $infoLabeledValue,
  $Tooltip
} from '@puppet/middleware/ui-components'
import { uiStorage } from '@puppet/middleware/ui-storage'
import {
  ETH_ADDRESS_REGEXP,
  filterNull,
  getTimeSince,
  readableUnitAmount,
  unixTimestampNow,
  zipState
} from '@puppet/middleware/utils'
import {
  $node,
  $text,
  component,
  eventElementTarget,
  type IBehavior,
  replayLatest,
  style,
  styleBehavior,
  switchMap
} from 'aelea/core'
import * as router from 'aelea/router'
import { $column, $row, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { EIP6963ProviderDetail } from 'mipd'
import type { Address } from 'viem/accounts'
import { $midContainer } from '../common/$common.js'
import { queryPricefeed, queryUserMatchingRuleList, subgraphStatus } from '../common/query.js'
import { $MainMenu } from '../components/$MainMenu.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../components/form/$Button.js'
import type { IMatchingRuleEditorDraft } from '../components/portfolio/$MatchRuleEditor.js'
import { $PortfolioEditorDrawer } from '../components/portfolio/$PortfolioEditorDrawer.js'
import type { IDepositEditorDraft } from '../components/portfolio/$RouteDepositEditor.js'
import { localStore } from '../const/localStore.js'
import { pwaUpgradeNotification } from '../sw/swUtils.js'
import { fadeIn } from '../transitions/enter.js'
import { wallet } from '../wallet/wallet.js'
import { $Leaderboard } from './leaderboard/$Leaderboard.js'
import { $PortfolioPage } from './user/$PortfolioPuppet.js'
import { $TraderPage } from './user/$Trader.js'

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
      [routeChanges, changeRouteTether]: IBehavior<any, string>,
      [clickUpdateVersion, clickUpdateVersionTether]: IBehavior<any, bigint>,

      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<IntervalTime>,
      [selectCollateralTokenList, selectCollateralTokenListTether]: IBehavior<Address[]>,

      [_changeWallet, changeWalletTether]: IBehavior<EIP6963ProviderDetail>,

      [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<IMatchingRuleEditorDraft[]>,
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

      const activityTimeframe = uiStorage.replayWrite(localStore.global, changeActivityTimeframe, 'activityTimeframe')
      const collateralTokenList = uiStorage.replayWrite(
        localStore.global,
        selectCollateralTokenList,
        'collateralTokenList'
      )

      const _pricefeedMapQuery = replayLatest(multicast(queryPricefeed({ activityTimeframe })))

      const subgraphBeaconStatusColor = map((status) => {
        const timestampDelta = unixTimestampNow() - new Date(status.arbitrum?.block?.number || 0).getTime()

        const color =
          timestampDelta > 60 ? pallete.negative : timestampDelta > 10 ? pallete.indeterminate : pallete.positive
        return color
      }, subgraphStatus)
      const subgraphStatusColorOnce = take(1, subgraphBeaconStatusColor)

      const latestBlock: Stream<bigint> = mergeArray([
        // fromPromise(useBlockNumber().promise),
        wallet.blockChange
      ])

      const userMatchingRuleQuery = replayLatest(
        multicast(
          queryUserMatchingRuleList({
            address: map((getAccountStatus) => getAccountStatus.address, wallet.account)
          })
        )
      )

      const draftMatchingRuleList = replayLatest(multicast(changeMatchRuleList), [] as IMatchingRuleEditorDraft[])
      const draftDepositTokenList = replayLatest(multicast(changeDepositTokenList), [] as IDepositEditorDraft[])

      return [
        $column(
          $MainMenu({ route: rootRoute })({
            routeChange: changeRouteTether(),
            changeWallet: changeWalletTether()
          }),

          router.match(rootRoute)(
            $midContainer(
              fadeIn(
                $Leaderboard({
                  route: leaderboardRoute,
                  draftMatchingRuleList,
                  activityTimeframe,
                  collateralTokenList,
                  userMatchingRuleQuery
                })({
                  changeActivityTimeframe: changeActivityTimeframeTether(),
                  selectCollateralTokenList: selectCollateralTokenListTether(),
                  routeChange: changeRouteTether(),
                  changeMatchRuleList: changeMatchRuleListTether()
                })
              )
            )
          ),
          router.contains(traderRoute)(
            $midContainer(
              fadeIn(
                $TraderPage({
                  userMatchingRuleQuery,
                  activityTimeframe,
                  collateralTokenList,
                  draftMatchingRuleList
                })({
                  selectCollateralTokenList: selectCollateralTokenListTether(),
                  changeActivityTimeframe: changeActivityTimeframeTether(),
                  changeMatchRuleList: changeMatchRuleListTether(),
                  changeRoute: changeRouteTether()
                })
              )
            )
          ),
          router.contains(portfolioRoute)(
            $midContainer(
              fadeIn(
                $PortfolioPage({
                  draftDepositTokenList,
                  userMatchingRuleQuery,
                  activityTimeframe,
                  collateralTokenList
                })({
                  selectCollateralTokenList: selectCollateralTokenListTether(),
                  changeActivityTimeframe: changeActivityTimeframeTether()
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
          $row(
            spacing.default,
            style({ position: 'fixed', zIndex: 100, right: '16px', bottom: '16px' })
          )(
            $Tooltip({
              $content: switchMap(
                (params) => {
                  const status = params.subgraphStatus.arbitrum

                  if (!status.ready || status.block === null) {
                    return $column(spacing.tiny)(
                      $text('Subgraph Status'),
                      $alertNegativeContainer(
                        $text('Indexing is currently experiencing issues, please try again later.')
                      )
                    )
                  }

                  const blocksBehind = readableUnitAmount(Number(params.latestBlock) - status.block.number)
                  const timeSince = getTimeSince(new Date(status.block.timestamp || 0).getTime())

                  return $column(spacing.tiny)(
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
          ),
          router.contains(rootRoute)(
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
                draftDepositTokenList,
                draftMatchingRuleList
              })({
                routeChange: changeRouteTether(),
                changeWallet: changeWalletTether(),
                changeMatchRuleList: changeMatchRuleListTether(),
                changeDepositTokenList: changeDepositTokenListTether()
              })
            )
          ),
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
          }, pwaUpgradeNotification)
        )
      ]
    }
  )
