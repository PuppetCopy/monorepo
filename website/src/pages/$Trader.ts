import { IStream, combineState, fromPromise, map, multicast, replayLatest, startWith, switchMap, type IBehavior } from 'aelea/stream'
import type { IntervalTime } from '@puppet-copy/middleware/const'
import {
  getDebankProfileUrl,
  pagingQuery,
  readableAddress,
  readableLeverage,
  readableUsd,
  unixTimestampNow
} from '@puppet-copy/middleware/core'
import { getTokenDescription } from '@puppet-copy/middleware/gmx'
import {
  $anchor,
  $arrowRight,
  $external,
  $icon,
  $infoLabel,
  $intermediateText,
  $Table,
  type IQuantumScrollPage,
  type ISortBy
} from '@puppet-copy/middleware/ui-components'
import { type ISetMatchingRule, positionIncrease } from '@puppet-copy/sql/schema'
import { $node, $text, attr, component, style } from 'aelea/core'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { asc } from 'ponder'
import type { Address } from 'viem/accounts'
import { $heading2 } from '../common/$text.js'
import { $card, $card2 } from '../common/elements/$common.js'
import { sqlClient } from '../common/sqlClient.js'
import { $TradeRouteTimeline } from '../components/participant/$ProfilePeformanceTimeline.js'
import { $metricLabel, $metricRow } from '../components/participant/$Summary.js'
import type { ISetMatchingRuleEditorDraft } from '../components/portfolio/$MatchingRuleEditor.js'
import { $defaultTraderMatchRouteEditorContainer, $RouteEditor } from '../components/portfolio/$RouteEditor.js'
import { entryColumn, pnlColumn, puppetsColumn, sizeColumn, timeColumn } from '../components/table/$TableColumn.js'
import { $seperator2, accountSettledPositionListSummary, aggregatePositionList } from './common'
import type { IPageFilterParams } from './type.js'

interface ITraderPage extends IPageFilterParams {
  userMatchingRuleQuery: IStream<Promise<ISetMatchingRule[]>>
  draftMatchingRuleList: IStream<ISetMatchingRuleEditorDraft[]>
}

export const $TraderPage = ({
  activityTimeframe,
  collateralTokenList,
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
      [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<ISetMatchingRuleEditorDraft[]>
    ) => {
      const sortBy = replayLatest(sortByChange, { direction: 'desc', selector: 'openTimestamp' } as const)

      const urlFragments = document.location.pathname.split('/')
      const account = urlFragments[urlFragments.length - 1].toLowerCase() as Address

      const routeMetricListQuery = multicast(
        map(async (params) => {
          const startActivityTimeframe = unixTimestampNow() - params.activityTimeframe

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
              traderRouteMetric: {
                columns: {
                  marketList: true,
                  positionList: true
                }
              }
            }
          })

          return routeMetricList
        }, combineState({ activityTimeframe, collateralTokenList }))
      )

      const metricsQuery = multicast(
        map(async (metricList) => {
          return accountSettledPositionListSummary(account, await metricList)
        }, routeMetricListQuery)
      )

      const pageParams = switchMap(async (params) => {
        const startActivityTimeframe = unixTimestampNow() - params.activityTimeframe
        const _paging = startWith({ offset: 0, pageSize: 20 }, scrollRequest)

        const [routeMetricList, increaseList, decreaseList] = await Promise.all([
          params.routeMetricListQuery,
          sqlClient.query.positionIncrease.findMany({
            where: (t, f) =>
              f.and(
                f.eq(t.account, account),
                params.collateralTokenList.length > 0
                  ? f.inArray(t.collateralToken, params.collateralTokenList)
                  : undefined,
                f.gt(t.blockTimestamp, startActivityTimeframe)
              ),

            orderBy: asc(positionIncrease.blockTimestamp),
            with: {
              feeCollected: true
            }
          }),
          sqlClient.query.positionDecrease.findMany({
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

        const positionList = aggregatePositionList([...increaseList, ...decreaseList])

        //   if (list.length === 0) {
        //     return $column(spacing.small)(
        //       $text('No active positions found'),
        //       $infoLabel('Try changing the timeframe or selecting a different trade route')
        //     )
        //   }

        return { ...params, routeMetricList, increaseList, decreaseList, positionList }
      }, combineState({ sortBy, activityTimeframe, collateralTokenList, routeMetricListQuery }))

      return [
        $column(spacing.small)(
          $node(),
          $row(spacing.tiny, style({ alignItems: 'center', paddingLeft: '20px', fontSize: '.8rem' }))(
            $node(style({ color: pallete.foreground }))($text('Leaderboard')),
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
                metricsQuery
              })({
                selectCollateralTokenList: selectCollateralTokenListTether(),
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
                      map(async (summaryQuery) => {
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
                      map(async (summaryQuery) => {
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
                      map(async (summaryQuery) => {
                        const summary = await summaryQuery
                        return readableLeverage(summary.sizeUsd, summary.collateralUsd)
                      }, metricsQuery)
                    )
                  ),
                  $metricLabel($text('Avg Leverage'))
                )
              )
            ),

            switchMap((params) => {
              const _startActivityTimeframe = unixTimestampNow() - params.activityTimeframe
              const paging = startWith({ offset: 0, pageSize: 20 }, scrollRequest)

              if (params.routeMetricList.length === 0) {
                return $column(spacing.small)(
                  $text('No activity to display'),
                  $infoLabel($text('Try adjusting filters like Activity timeframe or collateral tokens'))
                )
              }

              return $column(spacing.big)(
                ...params.routeMetricList.map((routeMetric) => {
                  const dataSource = map((pageParams) => {
                    return pagingQuery(
                      { ...pageParams.paging, ...pageParams.sortBy },
                      params.positionList.filter((item) => item.collateralToken === routeMetric.collateralToken)
                    )
                  }, combineState({ sortBy, paging }))
                  const _collateralTokenDescription = getTokenDescription(routeMetric.collateralToken)
                  return $column(
                    // style({ padding: '0 0 12px' })($route(collateralTokenDescription)),

                    switchMap((list) => {
                      return $RouteEditor({
                        displayCollateralTokenSymbol: true,
                        collateralToken: routeMetric.collateralToken,
                        traderMatchedPuppetList: routeMetric.matchedPuppetList,
                        userMatchingRuleList: [],
                        draftMatchingRuleList,
                        trader: routeMetric.account,
                        $container: $defaultTraderMatchRouteEditorContainer(
                          style({ marginLeft: '-12px', paddingBottom: '12px' })
                        )
                      })({
                        changeMatchRuleList: changeMatchRuleListTether()
                      })
                    }, switchMap((promise) => fromPromise(promise), userMatchingRuleQuery)),
                    $row(
                      style({ marginRight: '26px' })($seperator2),
                      $Table({
                        dataSource,
                        sortBy: params.sortBy,
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
          )
        ),
        { changeRoute, changeActivityTimeframe, selectCollateralTokenList, changeMatchRuleList }
      ]
    }
  )
