import { awaitPromises, map, multicast, now, startWith } from '@most/core'
import type { IntervalTime } from '@puppet/middleware/const'
import { getTokenDescription } from '@puppet/middleware/gmx'
import { $intermediateText, $Table, type IQuantumScrollPage, type ISortBy } from '@puppet/middleware/ui-components'
import { pagingQuery, readableLeverage, readableUsd, unixTimestampNow } from '@puppet/middleware/utils'
import { $node, $text, combineState, component, type IBehavior, replayLatest, style, switchMap } from 'aelea/core'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { asc } from 'ponder'
import { positionIncrease } from 'schema'
import type { Address } from 'viem/accounts'
import { $heading2 } from '../../common/$text.js'
import { $card, $card2 } from '../../common/elements/$common.js'
import { queryDb } from '../../common/sqlClient.js'
import { $AccountLabel, $profileAvatar } from '../../components/$AccountProfile.js'
import { $TradeRouteTimeline } from '../../components/participant/$ProfilePeformanceTimeline'
import { $metricLabel, $metricRow } from '../../components/participant/$Summary.js'
import type { IMatchingRuleEditorChange } from '../../components/portfolio/$MatchRuleEditor.js'
import {
  $defaultTraderMatchRouteEditorContainer,
  $TraderMatchingRouteEditor
} from '../../components/portfolio/$TraderMatchRouteEditor'
import { entryColumn, pnlColumn, puppetsColumn, sizeColumn, timeColumn } from '../../components/table/$TableColumn.js'
import { $seperator2, accountSettledPositionListSummary, aggregatePositionList } from '../common'
import type { IPageFilterParams, IPageParams, IUserActivityPageParams } from '../type.js'

interface ITraderPage extends IPageParams, IUserActivityPageParams, IPageFilterParams {
  account: Address
  //   matchRouteStatsQuery: Stream<Promise<IMatchingRuleEditorChange[]>>
}

export const $TraderPage = (config: ITraderPage) =>
  component(
    (
      [changeRoute, changeRouteTether]: IBehavior<any, string>,
      [scrollRequest, scrollRequestTether]: IBehavior<IQuantumScrollPage>,
      [sortByChange, sortByChangeTether]: IBehavior<ISortBy>,
      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<any, IntervalTime>,
      [selectMarketTokenList, selectMarketTokenListTether]: IBehavior<Address[]>,
      [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<IMatchingRuleEditorChange[]>
    ) => {
      const { account, activityTimeframe, collateralTokenList, depositTokenList, matchingRuleQuery, route } = config

      const sortBy = replayLatest(sortByChange, { direction: 'desc', selector: 'openTimestamp' } as const)

      const routeMetricListQuery = multicast(map(async (params) => {
        const startActivityTimeframe = unixTimestampNow() - params.activityTimeframe

        const routeMetricList = await queryDb.query.traderRouteLatestMetric.findMany({
          where: (t, f) =>
            f.and(
              f.eq(t.account, account),
              f.eq(t.interval, params.activityTimeframe),

              // filterParams.collateralTokenList.length > 0 ? arrayContains(t.marketList, filterParams.collateralTokenList) : undefined,
              params.collateralTokenList.length > 0
                ? f.inArray(t.collateralToken, params.collateralTokenList)
                : undefined,
              f.gt(t.lastUpdatedTimestamp, startActivityTimeframe)
            )
        })

        return routeMetricList
      }, combineState({ activityTimeframe, collateralTokenList })))

      const metricsQuery = multicast(
        map(async (metricList) => {
          return accountSettledPositionListSummary(account, await metricList)
        }, routeMetricListQuery)
      )

      const pageParams = switchMap(async (params) => {
        const startActivityTimeframe = unixTimestampNow() - params.activityTimeframe
        const paging = startWith({ offset: 0, pageSize: 20 }, scrollRequest)

        const routeMetricList = await params.routeMetricListQuery

        const increaseList = await queryDb.query.positionIncrease.findMany({
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
        })

        const decreaseList = await queryDb.query.positionDecrease.findMany({
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

        const positionList = aggregatePositionList([...increaseList, ...decreaseList])

        for (const position of positionList) {
        }

        //   if (list.length === 0) {
        //     return $column(spacing.small)(
        //       $text('No active positions found'),
        //       $infoLabel('Try changing the timeframe or selecting a different trade route')
        //     )
        //   }

        return { ...params, routeMetricList, increaseList, decreaseList, positionList }
      }, combineState({ sortBy, activityTimeframe, collateralTokenList, routeMetricListQuery }))

      return [
        $column(spacing.big)(
          $column(
            spacing.default,
            style({ minHeight: '90px' })
          )(
            $node(
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
              $row(spacing.small, style({ textDecoration: 'none', alignItems: 'center' }))(
                $profileAvatar({ address: account, size: isDesktopScreen ? 80 : 50 }),
                $AccountLabel({
                  address: account,
                  primarySize: 2.25
                })
              ),
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
                        return readableUsd(summary.cumulativeSizeUsd)
                      }, metricsQuery)
                    )
                  ),
                  $metricLabel($text('Avg Size'))
                ),
                $metricRow(
                  $heading2(
                    $intermediateText(
                      map(async (summaryQuery) => {
                        const summary = await summaryQuery
                        return readableLeverage(summary.cumulativeSizeUsd, summary.cumulativeCollateralUsd)
                      }, metricsQuery)
                    )
                  ),
                  $metricLabel($text('Avg Leverage'))
                )
              )
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
                depositTokenList,
                matchingRuleQuery,
                metricsQuery
              })({
                selectMarketTokenList: selectMarketTokenListTether(),
                changeActivityTimeframe: changeActivityTimeframeTether()
              })
            ),

            switchMap((params) => {
              const startActivityTimeframe = unixTimestampNow() - params.activityTimeframe
              const paging = startWith({ offset: 0, pageSize: 20 }, scrollRequest)

              const positionList = aggregatePositionList([...params.increaseList, ...params.decreaseList])

              //   if (list.length === 0) {
              //     return $column(spacing.small)(
              //       $text('No active positions found'),
              //       $infoLabel('Try changing the timeframe or selecting a different trade route')
              //     )
              //   }

              return $column(spacing.default)(
                ...params.routeMetricList.map((routeMetric) => {
                  const dataSource = map((pageParams) => {
                    return pagingQuery({ ...pageParams.paging, ...pageParams.sortBy }, positionList)
                  }, combineState({ sortBy, paging }))
                  const collateralTokenDescription = getTokenDescription(routeMetric.collateralToken)
                  return $column(
                    // style({ padding: '0 0 12px' })($route(collateralTokenDescription)),

                    switchMap((list) => {
                      return $TraderMatchingRouteEditor({
                        collateralToken: routeMetric.collateralToken,
                        matchedPuppetList: routeMetric.matchedPuppetList,
                        userMatchingRuleList: list,
                        trader: routeMetric.account,
                        $container: $defaultTraderMatchRouteEditorContainer(
                          style({ marginLeft: '-16px', paddingBottom: '16px' })
                        )
                      })({
                        changeMatchRuleList: changeMatchRuleListTether()
                      })
                    }, awaitPromises(matchingRuleQuery)),
                    $row(
                      style({ marginRight: '26px' })($seperator2),
                      $Table({
                        $container: $column(style({ flex: 1 })),
                        dataSource: now(positionList),
                        sortBy: params.sortBy,
                        columns: [
                          ...(isDesktopScreen ? [timeColumn] : []),
                          entryColumn,
                          puppetsColumn(changeRouteTether),
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
        { changeRoute, changeActivityTimeframe, selectMarketTokenList, changeMatchRuleList }
      ]
    }
  )
