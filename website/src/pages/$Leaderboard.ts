import * as sql from '@puppet/database/client'
import * as schema from '@puppet/database/schema'
import { type IntervalTime, USD_DECIMALS } from '@puppet/sdk/const'
import {
  fillTimeline,
  formatFixed,
  getMappedValue,
  getUnixTimestamp,
  type InferStream,
  readableUsd
} from '@puppet/sdk/core'
import { combine, type IStream, just, map, start, switchMap } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { type BaselineData, LineType } from 'lightweight-charts'
import type { Address } from 'viem/accounts'
import {
  $Baseline,
  $defaultTableCell,
  $defaultTableContainer,
  $defaultTableRowContainer,
  $spinner,
  $Table,
  type IMarker,
  type IQuantumScrollPage,
  type ISeriesTime,
  type ISortBy,
  type TableColumn
} from '@/ui-components'
import { uiStorage } from '@/ui-storage'
import { $MasterDisplay, $pnlDisplay } from '../common/$common.js'
import { $card2 } from '../common/elements/$common.js'
import { sqlClient } from '../common/sqlClient.js'
import { $SelectCollateralToken } from '../components/$CollateralTokenSelector.js'
import { $LastAtivity, activityOptionLabelMap } from '../components/$LastActivity.js'
import { localStore } from '../const/localStore.js'
import type { IPageFilterParams, IPageParams } from './types.js'

// Basic metric type matching masterLatestMetric schema
type IBasicMetric = {
  master: `0x${string}`
  user: `0x${string}`
  baseToken: `0x${string}`
  allocated: bigint
  realisedPnl: bigint
  pnlList: bigint[]
  pnlTimestampList: number[]
}

// TODO: Replace with proper type once schema is updated
type IMatchingRuleDraft = unknown

interface ILeaderboard extends IPageFilterParams, IPageParams {
  // TODO: These are placeholders until schema has subscription types
  userMatchingRuleQuery: IStream<Promise<unknown[]>>
  draftMatchingRuleList: IStream<IMatchingRuleDraft[]>
}

export const $Leaderboard = (config: ILeaderboard) =>
  component(
    (
      [scrollRequest, scrollRequestTether]: IBehavior<IQuantumScrollPage>,
      [sortByChange, sortByChangeTether]: IBehavior<ISortBy<IBasicMetric>>,

      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<IntervalTime>,
      [selectCollateralTokenList, selectCollateralTokenListTether]: IBehavior<Address[]>,
      [selectIndexTokenList, selectIndexTokenListTether]: IBehavior<Address[]>,

      [routeChange, routeChangeTether]: IBehavior<any, string>,
      [filterAccount, _filterAccountTether]: IBehavior<string | undefined>,

      // TODO: Placeholder for draft matching rules - not functional until schema updated
      [changeMatchRuleList, _changeMatchRuleListTether]: IBehavior<IMatchingRuleDraft[]>
    ) => {
      const { activityTimeframe, collateralTokenList } = config

      const sortBy = uiStorage.replayWrite(localStore.leaderboard.sortBy, sortByChange)
      const account = uiStorage.replayWrite(localStore.leaderboard.account, filterAccount)
      const paging = start({ offset: 0, pageSize: 20 }, scrollRequest)

      return [
        $column(spacing.default)(
          $card2(style({ padding: '0', gap: 0 }))(
            (isDesktopScreen
              ? $row(
                  spacing.default,
                  style({ padding: '18px 36px', placeContent: 'space-between', alignItems: 'center' })
                )
              : $row(
                  spacing.default,
                  style({ padding: '12px', placeContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start' })
                ))(
              $SelectCollateralToken({ selectedList: collateralTokenList })({
                changeCollateralTokenList: selectCollateralTokenListTether()
              }),

              $LastAtivity(activityTimeframe)({
                changeActivityTimeframe: changeActivityTimeframeTether()
              })
            ),
            switchMap(params => {
              const startActivityTimeframe = getUnixTimestamp() - params.activityTimeframe

              const dataSource = map(async filterParams => {
                const t = schema.masterLatestMetric

                const filter = sql.filter.and(
                  sql.filter.eq(t.interval, params.activityTimeframe),
                  params.account ? sql.filter.ilike(t.master, params.account) : undefined,
                  params.collateralTokenList.length > 0
                    ? sql.filter.inArray(t.baseToken, params.collateralTokenList)
                    : undefined,
                  sql.filter.gte(t.lastUpdatedTimestamp, startActivityTimeframe)
                )
                const orderBy = params.sortBy
                  ? params.sortBy.direction === 'asc'
                    ? sql.filter.asc(schema.masterLatestMetric[params.sortBy.selector])
                    : sql.filter.desc(schema.masterLatestMetric[params.sortBy.selector])
                  : sql.filter.desc(schema.masterLatestMetric.realisedPnl)

                const metricList = await sqlClient.query.masterLatestMetric.findMany({
                  where: filter,
                  limit: filterParams.paging.pageSize,
                  offset: filterParams.paging.offset,
                  orderBy: orderBy,
                  columns: {
                    master: true,
                    user: true,
                    baseToken: true,
                    allocated: true,
                    realisedPnl: true,
                    pnlList: true,
                    pnlTimestampList: true
                  }
                })

                const page = metricList.map(metric => ({ metric }))
                return { ...filterParams.paging, page, $items: page }
              }, combine({ paging }))

              type ILeaderboardDatasource = Awaited<InferStream<typeof dataSource>>['page']
              type ILeaderboardCellData = ILeaderboardDatasource[number]

              return $Table({
                $headerRowContainer: $defaultTableRowContainer,
                $container: $defaultTableContainer(
                  style({
                    backgroundColor: pallete.background,
                    borderTop: `1px solid ${colorAlpha(pallete.foreground, 0.2)}`,
                    padding: isDesktopScreen ? '24px 36px 36px' : '12px'
                  })
                ),
                $cell: $defaultTableCell(style({ padding: '0', height: '60px' })),
                scrollConfig: {
                  $loader: style({
                    placeContent: 'center',
                    margin: '0 1px',
                    background: pallete.background,
                    flexDirection: 'row-reverse',
                    padding: '16px 0'
                  })($spinner)
                },
                sortBy: params.sortBy as any,
                dataSource: dataSource as any,
                columns: [
                  {
                    $head: $text('Master'),
                    gridTemplate: isDesktopScreen ? '149px' : '136px',
                    $bodyCallback: map(pos => {
                      return $MasterDisplay({
                        route: config.route,
                        address: pos.metric.master,
                        puppetList: [] // TODO: puppetList not available on masterLatestMetric
                      })({
                        click: routeChangeTether()
                      })
                    })
                  },
                  {
                    $head: $text('Base Token'),
                    gridTemplate: isDesktopScreen ? '104px' : '58px',
                    $bodyCallback: map((pos: ILeaderboardCellData) => {
                      return $row(style({}))($text(`${pos.metric.baseToken.slice(0, 10)}...`))
                    })
                  },
                  ...((isDesktopScreen
                    ? [
                        {
                          $head: $text('Allocated'),
                          sortBy: 'allocated',
                          gridTemplate: '120px',
                          $bodyCallback: map((pos: ILeaderboardCellData) => {
                            return $row(style({}))($text(readableUsd(pos.metric.allocated)))
                          })
                        }
                      ]
                    : []) as TableColumn<ILeaderboardCellData>[]),
                  {
                    $head: $row(spacing.small, style({ flex: 1, placeContent: 'space-between', alignItems: 'center' }))(
                      $text('Realised PnL'),
                      $node(style({ textAlign: 'right', alignSelf: 'center' }))(
                        $text(`${getMappedValue(activityOptionLabelMap, params.activityTimeframe)} Activity`)
                      )
                    ),
                    sortBy: 'realisedPnl',
                    gridTemplate: isDesktopScreen ? '150px' : undefined,
                    $bodyCallback: map(pos => {
                      const endTime = getUnixTimestamp()
                      const startTime = endTime - params.activityTimeframe
                      const sourceList = [
                        { value: 0n, time: startTime },
                        ...pos.metric.pnlList
                          .map((pnl: bigint, index: number) => ({
                            value: pnl,
                            time: pos.metric.pnlTimestampList[index]
                          }))
                          .filter((item: { value: bigint; time: number }) => item.time > startTime),
                        {
                          value: pos.metric.pnlList[pos.metric.pnlList.length - 1] ?? 0n,
                          time: endTime
                        }
                      ]

                      const timeline = fillTimeline({
                        sourceList,
                        getTime: item => item.time,
                        sourceMap: next => {
                          return formatFixed(USD_DECIMALS, next.value)
                        }
                      })

                      const markerList: IMarker[] = []

                      return $row(style({ position: 'relative', height: '100%', flex: 1 }))(
                        style({
                          flex: 1,
                          inset: '0px 0px 0px 0px',
                          position: 'absolute',
                          pointerEvents: 'none',
                          width: '100%'
                        })(
                          $Baseline({
                            markers: just(markerList),
                            chartConfig: {
                              leftPriceScale: {
                                ticksVisible: true,
                                scaleMargins: { top: 0.1, bottom: 0.1 }
                              },
                              crosshair: {
                                horzLine: { visible: false },
                                vertLine: { visible: false }
                              },
                              timeScale: { visible: false }
                            },
                            data: timeline as any as BaselineData<ISeriesTime>[],
                            baselineOptions: {
                              baseValue: { price: 0, type: 'price' },
                              lineWidth: 1,
                              lineType: LineType.Curved
                            }
                          })({})
                        ),
                        $row(
                          style({
                            position: 'absolute',
                            background: `linear-gradient(to right, ${pallete.background} 0%, ${pallete.background} 23%, transparent 100%)`,
                            inset: 0,
                            zIndex: 1,
                            alignItems: 'center'
                          })
                        )($pnlDisplay(pos.metric.realisedPnl))
                      )
                    })
                  }
                ] as TableColumn<ILeaderboardCellData>[]
              })({
                sortBy: sortByChangeTether() as any,
                scrollRequest: scrollRequestTether()
              })
            }, combine({ sortBy, activityTimeframe, account, collateralTokenList }))
          )
        ),

        {
          routeChange,
          changeActivityTimeframe,
          selectCollateralTokenList,
          selectIndexTokenList,
          changeMatchRuleList
        }
      ]
    }
  )
