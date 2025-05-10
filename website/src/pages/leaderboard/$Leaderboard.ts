import { empty, map, now, startWith } from '@most/core'
import type { Time } from '@most/types'
import { type IntervalTime, USD_DECIMALS } from '@puppet/middleware/const'
import {
  $Baseline,
  $ButtonToggle,
  $bear,
  $bull,
  $defaultTableCell,
  $defaultTableContainer,
  $defaultTableRowContainer,
  $icon,
  $infoLabeledValue,
  $spinner,
  $Table,
  type IMarker,
  type IQuantumScrollPage,
  type ISortBy,
  type TableColumn
} from '@puppet/middleware/ui-components'
import { uiStorage } from '@puppet/middleware/ui-storage'
import {
  fillTimeline,
  formatFixed,
  getMappedValue,
  type InferStream,
  readablePnl,
  unixTimestampNow
} from '@puppet/middleware/utils'
import { $node, $text, combineState, component, type IBehavior, style, switchMap } from 'aelea/core'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { type BaselineData, LineType } from 'lightweight-charts'
import { asc, desc } from 'ponder'
import * as schema from 'schema'
import type { Address } from 'viem/accounts'
import { $roiDisplay, $size, $TraderDisplay } from '../../common/$common.js'
import { $card2, $responsiveFlex } from '../../common/elements/$common.js'
import { queryPricefeed } from '../../common/query.js'
import { queryDb } from '../../common/sqlClient.js'
import { $SelectCollateralToken } from '../../components/$CollateralTokenSelector.js'
import { $LastAtivity, LAST_ACTIVITY_LABEL_MAP } from '../../components/$LastActivity.js'
import type { IMatchingRuleEditorChange } from '../../components/portfolio/$MatchRuleEditor.js'
import { $TraderMatchingRouteEditor } from '../../components/portfolio/$TraderMatchRouteEditor.js'
import { $tableHeader } from '../../components/table/$TableColumn.js'
import { localStore } from '../../const/localStore.js'
import { $seperator2 } from '../common.js'
import type { IPageFilterParams, IUserActivityPageParams } from '../type.js'

interface ILeaderboard extends IPageFilterParams {
  user: IUserActivityPageParams
}

export const $Leaderboard = (config: ILeaderboard) =>
  component(
    (
      [scrollRequest, scrollRequestTether]: IBehavior<IQuantumScrollPage>,
      [sortByChange, sortByChangeTether]: IBehavior<ISortBy<(typeof schema)['traderRouteMetric']['$inferInsert']>>,

      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<IntervalTime>,
      [selectMarketTokenList, selectMarketTokenListTether]: IBehavior<Address[]>,

      [routeChange, routeChangeTether]: IBehavior<any, string>,
      [switchIsLong, switchIsLongTether]: IBehavior<boolean | undefined>,
      [filterAccount, filterAccountTether]: IBehavior<string | undefined>,

      [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<IMatchingRuleEditorChange[]>
    ) => {
      const {
        activityTimeframe,
        collateralTokenList,
        user: { depositTokenList, matchingRuleQuery },
        route
      } = config

      // const pricefeedMapQuery = queryPricefeed({ activityTimeframe })

      const sortBy = uiStorage.replayWrite(localStore.leaderboard, sortByChange, 'sortBy')
      const isLong = uiStorage.replayWrite(localStore.leaderboard, switchIsLong, 'isLong')
      const account = uiStorage.replayWrite(localStore.leaderboard, filterAccount, 'account')
      const paging = startWith({ offset: 0, pageSize: 20 }, scrollRequest)

      return [
        $column(
          spacing.default,
          style({ paddingTop: '36px' })
        )(
          $card2(style({ padding: '0', gap: 0 }))(
            $responsiveFlex(
              spacing.big,
              style({ padding: '26px', placeContent: 'space-between', alignItems: 'center' })
            )(
              $SelectCollateralToken({ selectedList: collateralTokenList })({
                selectMarketTokenList: selectMarketTokenListTether()
              }),
              $ButtonToggle({
                selected: isLong,
                options: [undefined, true, false],
                $$option: map((il) => {
                  return $row(spacing.tiny, style({ alignItems: 'center' }))(
                    il === undefined
                      ? empty()
                      : $icon({ $content: il ? $bull : $bear, width: '18px', viewBox: '0 0 32 32' }),
                    $text(il === undefined ? 'Both' : il ? 'Long' : 'Short')
                  )
                })
              })({
                select: switchIsLongTether()
              }),
              $LastAtivity(activityTimeframe)({
                changeActivityTimeframe: changeActivityTimeframeTether()
              })
            ),
            switchMap((params) => {
              // const interval = IntervalTime.MIN
              const startActivityTimeframe = unixTimestampNow() - params.activityTimeframe
              // const startActivityTimeframeTimeSlot = Math.floor(startActivityTimeframe / interval) * interval

              const dataSource = switchMap(
                async (filterParams) => {
                  const metrictList = await queryDb.query.traderRouteMetric.findMany({
                    where: (t, f) =>
                      f.and(
                        f.eq(t.interval, params.activityTimeframe),
                        params.account ? f.ilike(t.account, params.account) : undefined,
                        // filterParams.collateralTokenList.length > 0 ? arrayContains(t.marketList, filterParams.collateralTokenList) : undefined,
                        f.gt(t.lastUpdatedTimestamp, startActivityTimeframe)
                      ),
                    limit: filterParams.paging.pageSize,
                    offset: filterParams.paging.offset,
                    orderBy: params.sortBy
                      ? params.sortBy.direction === 'asc'
                        ? asc(schema.traderRouteMetric[params.sortBy.selector])
                        : desc(schema.traderRouteMetric[params.sortBy.selector])
                      : undefined,
                    columns: {
                      lastUpdatedTimestamp: true,
                      account: true,
                      collateralToken: true,
                      matchingKey: true,
                      maxSizeInUsd: true,
                      maxCollateralInUsd: true,
                      roi: true,
                      pnl: true,
                      winCount: true,
                      lossCount: true,
                      pnlList: true,
                      pnlTimestampList: true,
                      matchedPuppetCount: true,
                      matchedPuppetList: true
                    }
                  })

                  const userMatchingRuleList = await params.matchingRuleQuery

                  const page = metrictList.map((metric) => {
                    return { metric, userMatchingRuleList }
                  })
                  return { ...filterParams.paging, page }
                },
                combineState({
                  paging,
                  collateralTokenList
                })
              )

              type ILeaderboardDatasource = InferStream<typeof dataSource>['page']
              type ILeaderboardCellData = ILeaderboardDatasource[number]

              const columns: TableColumn<ILeaderboardCellData>[] = [
                {
                  $head: $text('Trader'),
                  gridTemplate: '149px',
                  // columnOp: style({ placeContent: 'flex-end' }),
                  $bodyCallback: map((pos) => {
                    return $TraderDisplay({
                      route: config.route,
                      trader: pos.metric.account,
                      puppetList: []
                      // puppetList: pos.matchRoute.matchRuleList.map(mr => mr.puppet),
                    })({
                      click: routeChangeTether()
                    })
                  })
                },
                {
                  $head: $text('Routes'),
                  gridTemplate: isDesktopScreen ? '210px' : undefined,
                  $bodyCallback: map((pos) => {
                    // const _tokenList = [
                    //   ...new Set([
                    //     ...pos.increaseList.map((x) => x.indexToken),
                    //     ...pos.decreaseList.map((x) => viem.getAddress(x.indexToken))
                    //   ])
                    // ]

                    // return $row(
                    //   ...tokenList.map(token =>
                    //     $column(spacing.tiny)(
                    //       $tokenTryLabeled(token)
                    //     )
                    //   )
                    // )
                    return $TraderMatchingRouteEditor({
                      matchedPuppetList: pos.metric.matchedPuppetList,
                      collateralToken: pos.metric.collateralToken,
                      userMatchingRuleList: pos.userMatchingRuleList,
                      trader: pos.metric.account
                    })({
                      changeMatchRuleList: changeMatchRuleListTether()
                    })
                  })
                },
                ...(isDesktopScreen
                  ? [
                      {
                        $head: $text('Win/Loss'),
                        gridTemplate: '70px',
                        columnOp: style({ alignItems: 'center', placeContent: 'center' }),
                        $bodyCallback: map((pos: ILeaderboardCellData) => {
                          const totalCount = pos.metric.winCount + pos.metric.lossCount
                          return $row(spacing.small)(
                            $text(`${pos.metric.winCount} / ${totalCount - pos.metric.lossCount}`)
                          )
                        })
                      },
                      {
                        $head: $column(style({ textAlign: 'right' }))(
                          $text('Size'),
                          $node(style({ fontSize: '.85rem' }))($text('Leverage'))
                        ),
                        sortBy: 'maxSizeInUsd',
                        columnOp: style({ placeContent: 'flex-end' }),
                        $bodyCallback: map((pos: ILeaderboardCellData) => {
                          return $size(pos.metric.maxSizeInUsd, pos.metric.maxCollateralInUsd)
                        })
                      }
                    ]
                  : []),
                {
                  // columnOp: style({ placeContent: 'flex-start' }),
                  $head: $row(spacing.small, style({ flex: 1, placeContent: 'space-between' }))(
                    $tableHeader('ROI %', 'PnL $'),
                    $text(`${getMappedValue(LAST_ACTIVITY_LABEL_MAP, params.activityTimeframe)} Activtiy`)
                  ),
                  sortBy: 'roi',
                  gridTemplate: isDesktopScreen ? '200px' : '140px',
                  $bodyCallback: map((pos) => {
                    const endTime = unixTimestampNow()
                    const startTime = endTime - params.activityTimeframe
                    const sourceList = [
                      { value: 0n, time: startTime },
                      ...pos.metric.pnlList
                        .map((pnl, index) => ({
                          value: pnl,
                          time: pos.metric.pnlTimestampList[index]
                        }))
                        .filter((item) => item.time > startTime),
                      { value: pos.metric.pnlList[pos.metric.pnlList.length - 1], time: endTime }
                    ]

                    const timeline = fillTimeline({
                      sourceList,
                      getTime: (item) => item.time,
                      sourceMap: (next) => {
                        return formatFixed(USD_DECIMALS, next.value)
                      }
                    })

                    const markerList = pos.metric.pnlTimestampList
                      .map((timestmap) => ({
                        position: 'inBar',
                        color: colorAlpha(pallete.message, 0.15),
                        time: timestmap as Time,
                        size: 0.1,
                        shape: 'circle'
                      }))
                      .sort((a, b) => Number(a.time) - Number(b.time))

                    return $row(style({ position: 'relative', flex: 1, height: '100%' }))(
                      $row(style({ position: 'relative', pointerEvents: 'none', width: '100%' }))(
                        $Baseline({
                          containerOp: style({ inset: '0px 0px 0px 0px', position: 'absolute' }),
                          markers: now(markerList as IMarker[]),
                          chartConfig: {
                            width: 100,
                            leftPriceScale: {
                              // autoScale: true,
                              ticksVisible: true,
                              scaleMargins: {
                                top: 0,
                                bottom: 0
                              }
                            },
                            crosshair: {
                              horzLine: {
                                visible: false
                              },
                              vertLine: {
                                visible: false
                              }
                            },
                            // height: 150,
                            // width: 100,
                            timeScale: {
                              visible: false
                            }
                            // ...config.chartConfig
                          },
                          data: timeline as any as BaselineData[],
                          // containerOp: style({  inset: '0px 0px 0px 0px' }),
                          baselineOptions: {
                            baseValue: {
                              price: 0,
                              type: 'price'
                            },
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
                      )(
                        $column(spacing.tiny)(
                          $roiDisplay(pos.metric.roi),
                          $seperator2,
                          $node(style({ fontSize: '.85rem' }))($text(readablePnl(pos.metric.pnl)))
                        )
                      )
                    )
                  })
                }
              ]

              return $Table({
                $headerContainer: $defaultTableRowContainer(style({ marginTop: '-10px' })),
                $container: $defaultTableContainer(
                  style({
                    backgroundColor: pallete.background,
                    borderTop: `1px solid ${colorAlpha(pallete.foreground, 0.2)}`,
                    padding: isDesktopScreen ? '36px' : '14px 8px'
                  })
                ),
                $cell: $defaultTableCell(style({ padding: '0', height: '70px' })),
                scrollConfig: {
                  // $container: $defaultVScrollContainer(style({ gap: '2px' })),
                  $loader: style({
                    placeContent: 'center',
                    margin: '0 1px',
                    background: pallete.background,
                    flexDirection: 'row-reverse',
                    padding: '16px 0'
                  })($infoLabeledValue('Loading', style({ margin: '' })($spinner)))
                },
                // $headerContainer: $defaultTableRowContainer(style({ background: pallete.background, padding: isDesktopScreen ? '8px 26px' : '8px' })),
                // $rowContainer: $defaultTableRowContainer(
                //   stylePseudo(':last-child', { borderRadius: '0 0 18px 18px', marginBottom: '2px' }),
                //   style({ background: pallete.background, padding: isDesktopScreen ? '8px 26px' : '8px' })
                // ),
                // $bodyRowContainer: $defaultTableRowContainer(
                //   style({ margin: '0 1px' })
                // ),
                sortBy: params.sortBy,
                dataSource,
                columns
              })({
                sortBy: sortByChangeTether(),
                scrollRequest: scrollRequestTether()
              })
            }, combineState({ sortBy, activityTimeframe, matchingRuleQuery, account }))
          )
        ),

        {
          routeChange,
          changeActivityTimeframe,
          selectMarketTokenList,
          changeMatchRuleList
        }
      ]
    }
  )
