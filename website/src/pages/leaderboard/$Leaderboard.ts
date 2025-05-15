import { awaitPromises, empty, map, now, startWith } from '@most/core'
import { ADDRESS_ZERO, type IntervalTime, USD_DECIMALS } from '@puppet/middleware/const'
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
  type ISeriesTime,
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
import { arrayContains } from 'drizzle-orm'
import { type BaselineData, LineType, type Time } from 'lightweight-charts'
import { asc, desc, inArray } from 'ponder'
import * as schema from 'schema'
import type { Address } from 'viem/accounts'
import type { ITraderRouteLatestMetric } from '../../__generated__/ponder.types.js'
import { $roiDisplay, $size, $TraderDisplay, $tokenTryLabeled } from '../../common/$common.js'
import { $card2, $responsiveFlex } from '../../common/elements/$common.js'
import { queryDb } from '../../common/sqlClient.js'
import { $SelectCollateralToken } from '../../components/$CollateralTokenSelector.js'
import { $LastAtivity, LAST_ACTIVITY_LABEL_MAP } from '../../components/$LastActivity.js'
import type { IMatchingRuleEditorChange } from '../../components/portfolio/$MatchRuleEditor.js'
import {
  $defaultTraderMatchRouteEditorContainer,
  $TraderMatchingRouteEditor
} from '../../components/portfolio/$TraderMatchRouteEditor.js'
import { $tableHeader } from '../../components/table/$TableColumn.js'
import { localStore } from '../../const/localStore.js'
import { $seperator2 } from '../common.js'
import type { IPageFilterParams, IPageParams, IUserActivityPageParams } from '../type.js'

interface ILeaderboard extends IPageFilterParams, IPageParams {
  user: IUserActivityPageParams
}

export const $Leaderboard = (config: ILeaderboard) =>
  component(
    (
      [scrollRequest, scrollRequestTether]: IBehavior<IQuantumScrollPage>,
      [sortByChange, sortByChangeTether]: IBehavior<ISortBy<Omit<ITraderRouteLatestMetric, 'traderRouteMetric'>>>,

      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<IntervalTime>,
      [selectCollateralTokenList, selectCollateralTokenListTether]: IBehavior<Address[]>,

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
                selectMarketTokenList: selectCollateralTokenListTether()
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
                  const metrictList = await queryDb.query.traderRouteLatestMetric.findMany({
                    where: (t, f) =>
                      f.and(
                        f.eq(t.interval, params.activityTimeframe),
                        params.account ? f.ilike(t.account, params.account) : undefined,
                        params.isLong !== undefined
                          ? params.isLong
                            ? f.gte(t.longShortRatio, 5000n)
                            : f.lte(t.longShortRatio, 5000n)
                          : undefined,
                        // filterParams.collateralTokenList.length > 0 ? arrayContains(t.marketList, filterParams.collateralTokenList) : undefined,
                        params.collateralTokenList.length > 0
                          ? f.inArray(t.collateralToken, params.collateralTokenList)
                          : undefined,
                        f.gte(t.lastUpdatedTimestamp, startActivityTimeframe)
                      ),
                    limit: filterParams.paging.pageSize,
                    offset: filterParams.paging.offset,
                    orderBy: params.sortBy
                      ? params.sortBy.direction === 'asc'
                        ? asc(schema.traderRouteLatestMetric[params.sortBy.selector])
                        : desc(schema.traderRouteLatestMetric[params.sortBy.selector])
                      : undefined,
                    columns: {
                      account: true,
                      collateralToken: true,

                      sizeUsd: true,
                      collateralUsd: true,
                      longShortRatio: true,
                      pnl: true,
                      roi: true,

                      pnlList: true,
                      pnlTimestampList: true,
                      matchedPuppetList: true,

                      traderMatchingKey: true
                    },
                    with: {
                      traderRouteMetric: {
                        columns: {
                          crossOpenSizeInUsd: true,
                          marketList: true
                        }
                      }
                    }
                  })

                  const page = metrictList.map((metric) => {
                    return { metric }
                  })
                  return { ...filterParams.paging, page }
                },
                combineState({
                  paging
                })
              )

              type ILeaderboardDatasource = InferStream<typeof dataSource>['page']
              type ILeaderboardCellData = ILeaderboardDatasource[number]

              const columns: TableColumn<ILeaderboardCellData>[] = [
                {
                  $head: $text('Trader'),
                  gridTemplate: isDesktopScreen ? '149px' : '126px',
                  // columnOp: style({ placeContent: 'flex-end' }),
                  $bodyCallback: map((pos) => {
                    return $TraderDisplay({
                      route: config.route,
                      address: pos.metric.account,
                      puppetList: []
                      // puppetList: pos.matchRoute.matchRuleList.map(mr => mr.puppet),
                    })({
                      click: routeChangeTether()
                    })
                  })
                },
                {
                  $head: $text('Route'),
                  gridTemplate: isDesktopScreen ? '104px' : '52px',
                  $bodyCallback: map((routeMetric) => {
                    // const _tokenList = [
                    //   ...new Set([
                    //     ...pos.increaseList.map((x) => x.indexToken),
                    //     ...pos.decreaseList.map((x) => getAddress(x.indexToken))
                    //   ])
                    // ]

                    // return $row(
                    //   ...tokenList.map(token =>
                    //     $column(spacing.tiny)(
                    //       $tokenTryLabeled(token)
                    //     )
                    //   )
                    // )
                    return switchMap((list) => {
                      return $TraderMatchingRouteEditor({
                        collateralToken: routeMetric.metric.collateralToken,
                        matchedPuppetList: routeMetric.metric.matchedPuppetList,
                        userMatchingRuleList: list,
                        trader: routeMetric.metric.account
                      })({
                        changeMatchRuleList: changeMatchRuleListTether()
                      })
                    }, awaitPromises(matchingRuleQuery))
                  })
                },
                ...(isDesktopScreen
                  ? [
                      // {
                      //   $head: $text('Win/Loss'),
                      //   gridTemplate: '70px',
                      //   columnOp: style({ alignItems: 'center', placeContent: 'center' }),
                      //   $bodyCallback: map((pos: ILeaderboardCellData) => {
                      //     const totalCount = pos.metric.winCount + pos.metric.lossCount
                      //     return $row(spacing.small)(
                      //       $text(`${pos.metric.winCount} / ${totalCount - pos.metric.lossCount}`)
                      //     )
                      //   })
                      // },
                      {
                        $head: $text('Markets'),
                        gridTemplate: isDesktopScreen ? '210px' : undefined,
                        $bodyCallback: map((pos: ILeaderboardCellData) => {
                          // const _tokenList = [
                          //   ...new Set([
                          //     ...pos.increaseList.map((x) => x.indexToken),
                          //     ...pos.decreaseList.map((x) => getAddress(x.indexToken))
                          //   ])
                          // ]

                          return $row(spacing.small)(
                            ...pos.metric.traderRouteMetric.marketList.map((token) =>
                              $tokenTryLabeled(token, false, '32px')
                            )
                          )
                        })
                      },
                      {
                        $head: $tableHeader('Volume', 'Leverage'),
                        sortBy: 'sizeUsd',
                        columnOp: style({ placeContent: 'flex-end' }),
                        $bodyCallback: map((pos: ILeaderboardCellData) => {
                          return $size(pos.metric.sizeUsd, pos.metric.collateralUsd)
                        })
                      }
                    ]
                  : []),
                {
                  // columnOp: style({ placeContent: 'flex-start' }),
                  $head: $row(spacing.small, style({ flex: 1, placeContent: 'space-between', alignItems: 'center' }))(
                    $tableHeader('ROI %', 'PNL $'),
                    $node(style({ textAlign: 'right', alignSelf: 'center' }))(
                      $text(`${getMappedValue(LAST_ACTIVITY_LABEL_MAP, params.activityTimeframe)} Activtiy`)
                    )
                  ),
                  sortBy: 'roi',
                  gridTemplate: isDesktopScreen ? '200px' : undefined,
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

                    const markerList: IMarker[] = []

                    if (pos.metric.traderRouteMetric.crossOpenSizeInUsd > 0n) {
                      markerList.push({
                        position: 'inBar',
                        color: pos.metric.pnl > 0 ? pallete.positive : pallete.negative,
                        time: unixTimestampNow() as Time,
                        shape: 'circle'
                      })
                      markerList.push({
                        position: 'inBar',
                        color: colorAlpha(pos.metric.pnl > 0 ? pallete.positive : pallete.negative, 0.25),
                        time: unixTimestampNow() as Time,
                        size: 2.25,
                        shape: 'circle'
                      })
                    }

                    return $row(style({ position: 'relative', flex: 1, height: '100%' }))(
                      $row(style({ position: 'relative', pointerEvents: 'none', width: '100%' }))(
                        $Baseline({
                          containerOp: style({ inset: '0px 0px 0px 0px', position: 'absolute' }),
                          markers: now(markerList),
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
                          data: timeline as any as BaselineData<ISeriesTime>[],
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
                          $node(style({ fontSize: '.8rem' }))($text(readablePnl(pos.metric.pnl)))
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
            }, combineState({ sortBy, activityTimeframe, isLong, account, collateralTokenList }))
          )
        ),

        {
          routeChange,
          changeActivityTimeframe,
          selectCollateralTokenList,
          changeMatchRuleList
        }
      ]
    }
  )
