import type { IntervalTime } from '@puppet/sdk/const'
import {
  getDebankProfileUrl,
  getUnixTimestamp,
  pagingQuery,
  readableAddress,
  readableLeverage,
  readableUsd
} from '@puppet/sdk/core'
import { gmx__PositionIncrease, type ISubscribeRule } from '@puppet/sql/schema'
import { combine, type IStream, map, start } from 'aelea/stream'
import { type IBehavior, multicast, state } from 'aelea/stream-extended'
import { $node, $text, attr, component, style } from 'aelea/ui'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { asc } from 'ponder'
import type { Address } from 'viem/accounts'
import {
  $anchor,
  $arrowRight,
  $external,
  $icon,
  $infoLabel,
  $intermediatePromise,
  $intermediateText,
  $spinner,
  $Table,
  type IQuantumScrollPage,
  type ISortBy
} from '@/ui-components'
import { $RouterAnchor } from '@/ui-router'
import { $heading2 } from '../common/$text.js'
import { $card, $card2 } from '../common/elements/$common.js'
import { sqlClient } from '../common/sqlClient.js'
import { $TradeRouteTimeline } from '../components/participant/$ProfilePeformanceTimeline.js'
import { $metricLabel, $metricRow } from '../components/participant/$Summary.js'
import type { ISetMatchingRuleEditorDraft } from '../components/portfolio/$MatchingRuleEditor.js'
import { $defaultTraderMatchRouteEditorContainer, $RouteEditor } from '../components/portfolio/$RouteEditor.js'
import { entryColumn, pnlColumn, puppetsColumn, sizeColumn, timeColumn } from '../components/table/$TableColumn.js'
import { $seperator2, accountSettledPositionListSummary, aggregatePositionList } from './common'
import type { IPageFilterParams } from './types.js'

interface ITraderPage extends IPageFilterParams {
  route: import('aelea/router').Route
  userMatchingRuleQuery: IStream<Promise<ISubscribeRule[]>>
  draftMatchingRuleList: IStream<ISetMatchingRuleEditorDraft[]>
}

export const $TraderPage = ({
  route,
  activityTimeframe,
  collateralTokenList,
  indexTokenList,
  userMatchingRuleQuery,
  draftMatchingRuleList
}: ITraderPage) =>
  component(
    (
      [changeRoute, changeRouteTether]: IBehavior<any, string>,
      [scrollRequest, scrollRequestTether]: IBehavior<IQuantumScrollPage>,
      [sortByChange, _sortByChangeTether]: IBehavior<ISortBy>,
      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<any, IntervalTime>,
      [selectCollateralTokenList, selectCollateralTokenListTether]: IBehavior<Address[]>,
      [selectIndexTokenList, selectIndexTokenListTether]: IBehavior<Address[]>,
      [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<ISetMatchingRuleEditorDraft[]>
    ) => {
      const sortBy = state(sortByChange, { direction: 'desc', selector: 'openTimestamp' } as const)

      const urlFragments = document.location.pathname.split('/')
      const account = urlFragments[urlFragments.length - 1].toLowerCase() as Address

      const routeMetricListQuery = multicast(
        map(async params => {
          const startActivityTimeframe = getUnixTimestamp() - params.activityTimeframe

          const routeMetricList = await sqlClient.query.traderRouteLatestMetric.findMany({
            where: (t, f) =>
              f.and(
                f.eq(t.account, account),
                f.eq(t.interval, params.activityTimeframe),

                // filterParams.collateralTokenList.length > 0 ? arrayContains(t.marketList, filterParams.collateralTokenList) : undefined,
                params.collateralTokenList.length > 0
                  ? f.inArray(t.collateralToken, params.collateralTokenList)
                  : undefined,
                f.gte(t.lastUpdatedTimestamp, startActivityTimeframe)
              ),
            with: {
              traderRouteMetric: true
            }
          })

          return routeMetricList
        }, combine({ activityTimeframe, collateralTokenList, indexTokenList }))
      )

      const metricsQuery = multicast(
        map(async metricList => {
          return accountSettledPositionListSummary(account, await metricList)
        }, routeMetricListQuery)
      )

      const pageParams = map(params => {
        const startActivityTimeframe = getUnixTimestamp() - params.activityTimeframe

        const pageQuery = Promise.all([
          params.routeMetricListQuery,
          sqlClient.query.gmx__PositionIncrease.findMany({
            where: (t, f) =>
              f.and(
                f.eq(t.account, account),
                params.collateralTokenList.length > 0
                  ? f.inArray(t.collateralToken, params.collateralTokenList)
                  : undefined,
                f.gt(t.blockTimestamp, startActivityTimeframe)
              ),

            orderBy: asc(gmx__PositionIncrease.blockTimestamp),
            with: {
              feeCollected: true
            }
          }),
          sqlClient.query.gmx__PositionDecrease.findMany({
            where: (t, f) =>
              f.and(
                f.eq(t.account, account),
                params.collateralTokenList.length > 0
                  ? f.inArray(t.collateralToken, params.collateralTokenList)
                  : undefined,
                f.gt(t.blockTimestamp, startActivityTimeframe)
              ),
            with: {
              feeCollected: true
            }
          })
        ])

        return pageQuery.then(([routeMetricList, increaseList, decreaseList]) => {
          const openPositionList = aggregatePositionList([...increaseList, ...decreaseList])

          return { ...params, routeMetricList, increaseList, decreaseList, openPositionList }
        })
      }, combine({ sortBy, activityTimeframe, collateralTokenList, routeMetricListQuery }))

      return [
        $column(spacing.small)(
          $node(),
          $row(spacing.tiny, style({ alignItems: 'center', paddingLeft: '20px', fontSize: '.8rem' }))(
            $RouterAnchor({
              url: '/',
              route,
              $anchor: $anchor(attr({ href: '/' }))($text('Leaderboard'))
            })({ click: changeRouteTether() }),
            $node(
              $icon({
                $content: $arrowRight,
                fill: pallete.foreground,
                width: '8px'
              })
            ),
            $node(style({ color: pallete.foreground }))($text('Trader')),
            $node(
              $icon({
                $content: $arrowRight,
                fill: pallete.foreground,
                width: '8px'
              })
            ),
            $anchor(
              attr({
                href: getDebankProfileUrl(account),
                target: '_blank'
              })
            )(
              $text(readableAddress(account)),
              $icon({
                $content: $external,
                width: '12px'
              })
            )
          ),

          $card(spacing.big, style({ flex: 1, width: '100%' }))(
            $card2(
              style({
                padding: 0,
                height: isDesktopScreen ? '200px' : '200px',
                position: 'relative',
                margin: isDesktopScreen ? '-36px -36px 0' : '-12px -12px 0px'
              })
            )(
              $TradeRouteTimeline({
                activityTimeframe,
                collateralTokenList,
                indexTokenList,
                metricsQuery
              })({
                selectCollateralTokenList: selectCollateralTokenListTether(),
                selectIndexTokenList: selectIndexTokenListTether(),
                changeActivityTimeframe: changeActivityTimeframeTether()
              })
            ),

            $column(
              spacing.default,
              style({
                display: 'flex',
                flexDirection: isDesktopScreen ? 'row' : 'column',
                gap: isDesktopScreen ? '56px' : '26px',
                zIndex: 10,
                placeContent: 'center',
                alignItems: 'center',
                padding: '0 8px'
              })
            )(
              $row(spacing.big, style({ alignItems: 'flex-end' }))(
                $metricRow(
                  $heading2(
                    $intermediateText(
                      map(async summaryQuery => {
                        const summary = await summaryQuery
                        return `${summary.winCount} / ${summary.lossCount}`
                      }, metricsQuery)
                    )
                  ),
                  $metricLabel($text('Win / Loss'))
                ),
                $metricRow(
                  $heading2(
                    $intermediateText(
                      map(async summaryQuery => {
                        const summary = await summaryQuery
                        return readableUsd(summary.sizeUsd)
                      }, metricsQuery)
                    )
                  ),
                  $metricLabel($text('Volume'))
                ),
                $metricRow(
                  $heading2(
                    $intermediateText(
                      map(async summaryQuery => {
                        const summary = await summaryQuery
                        return readableLeverage(summary.sizeUsd, summary.collateralUsd)
                      }, metricsQuery)
                    )
                  ),
                  $metricLabel($text('Avg Leverage'))
                )
              )
            ),

            $intermediatePromise({
              $loader: $spinner,
              $display: map(async paramsQuery => {
                const params = await paramsQuery
                const paging = start({ offset: 0, pageSize: 20 }, scrollRequest)

                if (params.routeMetricList.length === 0) {
                  return $column(spacing.small)(
                    $text('No activity to display'),
                    $infoLabel($text('Try adjusting filters like Activity timeframe or collateral tokens'))
                  )
                }

                return $column(spacing.big)(
                  ...params.routeMetricList.map(routeMetric => {
                    const dataSource = map(async pageParams => {
                      const result = pagingQuery(
                        { ...pageParams.paging, ...pageParams.sortBy },
                        params.openPositionList.filter(item => item.collateralToken === routeMetric.collateralToken)
                      )
                      return { ...result, $items: result.page }
                    }, combine({ sortBy, paging }))
                    return $column(
                      // style({ padding: '0 0 12px' })($route(collateralTokenDescription)),

                      $RouteEditor({
                        collateralToken: routeMetric.collateralToken,
                        userMatchingRuleQuery,
                        draftMatchingRuleList,
                        trader: routeMetric.account,
                        $container: $defaultTraderMatchRouteEditorContainer(
                          style({ marginLeft: '-12px', paddingBottom: '12px' })
                        )
                      })({
                        changeMatchRuleList: changeMatchRuleListTether()
                      }),
                      $row(
                        style({ marginRight: '26px' })($seperator2),
                        $Table({
                          dataSource: dataSource as any,
                          sortBy: params.sortBy,
                          scrollConfig: { $loader: $spinner },
                          columns: [
                            ...(isDesktopScreen ? [timeColumn] : []),
                            entryColumn,
                            ...(isDesktopScreen ? [puppetsColumn(changeRouteTether)] : []),
                            sizeColumn(),
                            pnlColumn()
                          ]
                        })({
                          // sortBy: sortByChangeTether(),
                          scrollRequest: scrollRequestTether()
                        })
                      )
                    )
                  })
                )
              }, pageParams)
            })
          )
        ),
        { changeRoute, changeActivityTimeframe, selectCollateralTokenList, selectIndexTokenList, changeMatchRuleList }
      ]
    }
  )
