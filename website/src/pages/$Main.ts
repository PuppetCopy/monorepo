import { IntervalTime } from '@puppet-copy/middleware/const'
import { ETH_ADDRESS_REGEXP, getTimeAgo, ignoreAll, readableUnitAmount } from '@puppet-copy/middleware/core'
import * as router from 'aelea/router'
import { awaitPromises, map, merge, periodic, start, switchMap, tap } from 'aelea/stream'
import { type IBehavior, multicast, state } from 'aelea/stream-extended'
import { $node, $text, $wrapNativeElement, component, fromEventTarget, style } from 'aelea/ui'
import { $column, $row, designSheet, isDesktopScreen, isMobileScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { $heading3 } from 'src/common/$text.js'
import { getAddress } from 'viem'
import type { Address } from 'viem/accounts'
import { $alertNegativeContainer, $alertPositiveContainer, $infoLabeledValue, $Tooltip } from '@/ui-components'
import { contains } from '@/ui-router/resolveUrl.js'
import { uiStorage } from '@/ui-storage'
import { $midContainer } from '../common/$common.js'
import { queryUserMatchingRuleList } from '../common/query.js'
import { getStatus } from '../common/sqlClient.js'
import { $MainMenu } from '../components/$MainMenu.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../components/form/$Button.js'
import type { BalanceDraft } from '../components/portfolio/$DepositEditor.js'
import type { ISetMatchingRuleEditorDraft } from '../components/portfolio/$MatchingRuleEditor.js'
import { $PortfolioEditorDrawer } from '../components/portfolio/$PortfolioEditorDrawer.js'
import { localStore } from '../const/localStore.js'
import { pwaUpgradeNotification } from '../sw/swUtils.js'
import { fadeIn } from '../transitions/enter.js'
import wallet from '../wallet/wallet.js'
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
      [changeDepositTokenList, changeDepositTokenListTether]: IBehavior<BalanceDraft[]>,
      [txSuccess, txSuccessTether]: IBehavior<null>
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

      const userMatchingRuleQuery = state(
        queryUserMatchingRuleList(switchMap(() => wallet.account, merge(wallet.account, txSuccess)))
      )

      const indexerStatus = state(awaitPromises(map(() => getStatus(), start(0, periodic(IntervalTime.MIN * 1000)))))

      const draftMatchingRuleList = state(changeMatchRuleList, [])
      const draftDepositTokenList = state(
        map(list => {
          // Deduplicate by token address using normalized addresses
          const deduped = list.reduce((acc, draft) => {
            acc.set(getAddress(draft.token), draft)
            return acc
          }, new Map<Address, BalanceDraft>())
          return Array.from(deduped.values())
        }, changeDepositTokenList),
        []
      )

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
                  route: leaderboardRoute,
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
          $row(style({ position: 'fixed', zIndex: 100, right: '16px', bottom: '16px' }))(
            switchMap(status => {
              const block = status?.arbitrum?.block
              // Consider stale if more than 5 minutes behind
              const isStale = block ? Date.now() / 1000 - block.timestamp > 300 : true
              const statusColor = block ? (isStale ? pallete.negative : pallete.positive) : pallete.negative

              return $Tooltip({
                $content: block
                  ? $column(spacing.small)(
                      $heading3($text('Indexer Status')),
                      $node(),
                      $column(spacing.tiny)(
                        $infoLabeledValue(
                          'Updated',
                          switchMap(() => $text(getTimeAgo(block.timestamp)), start(0, periodic(1000)))
                        ),
                        $infoLabeledValue('Block', readableUnitAmount(block.number))
                      )
                    )
                  : $column(spacing.tiny)(
                      $text('Indexer Status'),
                      $alertNegativeContainer(
                        $text('Indexing is currently experiencing issues, please try again later.')
                      )
                    ),
                $anchor: $row(
                  style({
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    padding: '6px',
                    backgroundColor: colorAlpha(statusColor, 0.5)
                  })
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
                      backgroundColor: colorAlpha(statusColor, 0.5),
                      animationName: 'signal',
                      animationDuration: '2s',
                      animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      animationIterationCount: isStale ? 'infinite' : '1'
                    })
                  )()
                )
              })({})
            }, indexerStatus)
          ),

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
                changeDepositTokenList: changeDepositTokenListTether(),
                txSuccess: txSuccessTether()
              })
            )
          )
        )
      ]
    }
  )
