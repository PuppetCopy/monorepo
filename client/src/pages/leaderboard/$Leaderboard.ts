import { Behavior, combineObject } from "@aelea/core"
import { $text, component, style } from "@aelea/dom"
import { $column, $row, layoutSheet, screenUtils } from "@aelea/ui-components"
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import { empty, map, now, startWith } from "@most/core"
import { Time } from "@most/types"
import { desc } from "@ponder/client"
import { getMappedValue, InferStream, readablePnl, switchMap, unixTimestampNow } from "@puppet/middleware/utils"
import { arrayContains } from "drizzle-orm"
import { BaselineData, LineType } from "lightweight-charts"
import { IntervalTime } from "@puppet/middleware/const"
import { IMatchRouteStats, IPositionDecrease, IPositionIncrease } from "@puppet/middleware/core"
import * as schema from "schema"
import {
  $Baseline, $bear, $bull, $ButtonToggle, $defaultTableCell, $defaultTableContainer, $defaultTableRowContainer, $icon,
  $infoLabeledValue, $IntermediatePromise, $spinner, $Table, IMarker, IQuantumScrollPage, ISortBy,
  TableColumn
} from "@puppet/middleware/ui-components"
import { uiStorage } from "@puppet/middleware/ui-storage"
import * as viem from "viem"
import { $roiDisplay, $size, $TraderDisplay } from "../../common/$common.js"
import { $card2, $responsiveFlex } from "../../common/elements/$common.js"
import { client, queryPricefeed } from "../../common/query"
import { $SelectCollateralToken } from "../../components/$CollateralTokenSelector"
import { $LastAtivity, LAST_ACTIVITY_LABEL_MAP } from "../../components/$LastActivity.js"
import { $TraderMatchingRouteEditor, IMatchRuleEditorChange } from "../../components/portfolio/$TraderMatchRouteEditor.js"
import { $tableHeader } from "../../components/table/$TableColumn.js"
import { getPositionListTimelinePerformance, IPerformanceTimelineTick } from "../../components/trade/$ProfilePerformanceGraph"
import { $seperator2 } from "../common.js"
import { IUserActivityPageParams } from "../type.js"
import { localStore } from "../../const/localStore"

export interface ILeaderboardMatchStats extends IMatchRouteStats {
  timeline: IPerformanceTimelineTick[]
  list: (IPositionIncrease | IPositionDecrease)[]
}


interface ILeaderboard extends IUserActivityPageParams {
}

export const $Leaderboard = (config: ILeaderboard) => component((
  [scrollRequest, scrollRequestTether]: Behavior<IQuantumScrollPage>,
  [sortByChange, sortByChangeTether]: Behavior<ISortBy<schema.ITraderRouteMetric>>,

  [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<IntervalTime>,
  [selectMarketTokenList, selectMarketTokenListTether]: Behavior<viem.Address[]>,

  [routeChange, routeChangeTether]: Behavior<any, string>,
  [switchIsLong, switchIsLongTether]: Behavior<boolean | undefined>,
  [filterAccount, filterAccountTether]: Behavior<string | undefined>,

  [changeMatchRuleList, changeMatchRuleListTether]: Behavior<IMatchRuleEditorChange[]>,
) => {

  const { activityTimeframe, selectedCollateralTokenList, walletClientQuery, matchRuleList, route } = config

  const pricefeedMapQuery = queryPricefeed({ activityTimeframe })


  const sortBy = uiStorage.replayWrite(localStore.leaderboard, sortByChange, 'sortBy')
  const isLong = uiStorage.replayWrite(localStore.leaderboard, switchIsLong, 'isLong')
  const account = uiStorage.replayWrite(localStore.leaderboard, filterAccount, 'account')



  const tableParams = map(async pageParams => {
    const pricefeedMap = await pageParams.pricefeedMapQuery
    // const accountStatsListData = await pageParams.routeStatsList
    // const accountStatsList = accountStatsListData
    // .map(stats => {
    //   // const list = [...stats.traderRoute.increaseList, ...stats.traderRoute.decreaseList].filter(pos => {
    //   //   try {
    //   //     getMarketIndexToken(pos.market)
    //   //     return pageParams.isLong === undefined || pos.isLong === pageParams.isLong
    //   //   } catch (e) {
    //   //     console.error(e)
    //   //     return false
    //   //   }
    //   // })

    //   // if (list.length === 0) return null


    //   const timeline = getPositionListTimelinePerformance({
    //     activityTimeframe: pageParams.activityTimeframe,
    //     list,
    //     pricefeedMap,
    //     tickCount: 25,
    //   })

    //   stats.pnl = timeline[timeline.length - 1].pnl

    //   return { ...stats, timeline, list }
    // })
    // .filter(pos => pos !== null)

    return { pricefeedMap, sortBy: pageParams.sortBy, activityTimeframe: pageParams.activityTimeframe }
  }, combineObject({ sortBy, pricefeedMapQuery, activityTimeframe, isLong }))



  return [
    $column(layoutSheet.spacing, style({ paddingTop: '36px' }))(

      $card2(style({ padding: "0", gap: 0 }))(
        $responsiveFlex(layoutSheet.spacingBig, style({ padding: '26px', placeContent: 'space-between', alignItems: 'center' }))(
          $SelectCollateralToken({ selectedList: selectedCollateralTokenList })({
            selectMarketTokenList: selectMarketTokenListTether()
          }),
          $ButtonToggle({
            selected: isLong,
            options: [
              undefined,
              true,
              false,
            ],
            $$option: map(il => {
              return $row(layoutSheet.spacingTiny, style({ alignItems: 'center' }))(
                il === undefined
                  ? empty()
                  : $icon({ $content: il ? $bull : $bear, width: '18px', viewBox: '0 0 32 32' }),
                $text(il === undefined ? 'Both' : il ? 'Long' : 'Short'),
              )
            })
          })({
            select: switchIsLongTether()
          }),
          $LastAtivity(activityTimeframe)({
            changeActivityTimeframe: changeActivityTimeframeTether()
          }),
        ),
        $IntermediatePromise({
          query: tableParams,
          $$done: map(params => {

            const paging = startWith({ offset: 0, pageSize: 20 }, scrollRequest)

            const dataSource = switchMap(async filterParams => {
              const metrictList = await client.db.query.traderRouteMetric.findMany({
                where: ((t, f) =>
                  f.and(
                    f.eq(t.interval, filterParams.activityTimeframe),
                    filterParams.account ? f.ilike(t.account, filterParams.account) : undefined,
                    filterParams.collateralTokenList.length > 0 ? arrayContains(t.marketList, filterParams.collateralTokenList) : undefined,
                    f.gte(t.lastUpdatedTimestamp, unixTimestampNow() - filterParams.activityTimeframe),
                  )),
                limit: filterParams.paging.pageSize,
                offset: filterParams.paging.offset,
                orderBy: filterParams.sortBy ? desc(schema.traderRouteMetric[filterParams.sortBy.selector]) : undefined,
                columns: {
                  account: true,
                  collateralToken: true,
                  matchingKey: true,
                  maxSizeInUsd: true,
                  maxCollateralInUsd: true,
                  maxSizeInTokens: true,
                  maxCollateralInTokens: true,
                  roi: true,
                  pnl: true,
                }
              })

              const page = await Promise.all(metrictList.map(async (routeMetric) => {
                const [matchingRuleList, increaseList, decreaseList] = await Promise.all([
                  client.db.query.puppetMatchingRule.findMany({
                    where: (t, f) => f.and(
                      f.eq(t.matchingKey, routeMetric.matchingKey),
                    ),
                    columns: {
                      puppet: true,
                      allowanceRate: true,
                      expiry: true,
                      throttleActivity: true
                    },
                    limit: 10
                  }),
                  client.db.query.positionIncrease.findMany({
                    where: (t, f) => f.and(
                      f.eq(t.matchingKey, routeMetric.matchingKey),
                      f.gte(t.blockTimestamp, unixTimestampNow() - filterParams.activityTimeframe)
                    ),
                    columns: {
                      indexToken: true,
                      positionKey: true,
                      sizeInUsd: true,
                      sizeInTokens: true,
                      indexTokenPriceMax: true,
                      isLong: true,
                      blockTimestamp: true,
                    }
                  }),
                  client.db.query.positionDecrease.findMany({
                    where: (t, f) => f.and(
                      f.eq(t.matchingKey, routeMetric.matchingKey),
                      f.gte(t.blockTimestamp, unixTimestampNow() - filterParams.activityTimeframe)
                    ),
                    columns: {
                      indexToken: true,
                      positionKey: true,
                      sizeInUsd: true,
                      sizeInTokens: true,
                      indexTokenPriceMax: true,
                      basePnlUsd: true,
                      isLong: true,
                      blockTimestamp: true,
                    }
                  })
                ])


                return {
                  ...routeMetric,
                  decreaseList,
                  increaseList,
                  matchingRuleList
                }
              }))

              return { page, offset: filterParams.paging.offset, pageSize: filterParams.paging.pageSize }
            }, combineObject({ activityTimeframe, paging, sortBy, isLong, collateralTokenList: selectedCollateralTokenList, account }))

            type ILeaderboardDatasource = InferStream<typeof dataSource>
            type ILeaderboardCellData = ILeaderboardDatasource['page'][number]


            const columns: TableColumn<ILeaderboardCellData>[] = [
              {
                $head: $text('Trader'),
                gridTemplate: '149px',
                // columnOp: style({ placeContent: 'flex-end' }),
                $bodyCallback: map(pos => {
                  return $TraderDisplay({
                    route: config.route,
                    trader: pos.account,
                    puppetList: [],
                    // puppetList: pos.matchRoute.matchRuleList.map(mr => mr.puppet),
                  })({
                    click: routeChangeTether()
                  })
                })
              },
              {
                $head: $text('Routes'),
                gridTemplate: screenUtils.isDesktopScreen ? '210px' : undefined,
                $bodyCallback: map(pos => {
                  const tokenList = [...new Set(
                    [...pos.increaseList.map(x => x.indexToken), ...pos.decreaseList.map(x => viem.getAddress(x.indexToken))]
                  )]

                  // return $row(
                  //   ...tokenList.map(token =>
                  //     $column(layoutSheet.spacingTiny)(
                  //       $tokenTryLabeled(token)
                  //     )
                  //   )
                  // )
                  return $TraderMatchingRouteEditor({
                    matchRuleList,
                    walletClientQuery,
                    collateralToken: pos.collateralToken,
                    traderMatchingRuleList: pos.matchingRuleList,
                    trader: pos.account
                  })({
                    changeMatchRuleList: changeMatchRuleListTether(),
                  })
                })
              },
              ...screenUtils.isDesktopScreen
                ? [
                  {
                    $head: $text('Win/Loss'),
                    gridTemplate: '70px',
                    columnOp: style({ alignItems: 'center', placeContent: 'center' }),
                    $bodyCallback: map((pos: ILeaderboardCellData) => {
                      const totalCount = pos.decreaseList.length
                      const winCount = pos.decreaseList.reduce((acc, next) => acc + (next.basePnlUsd > 0n ? 1 : 0), 0)
                      return $row(layoutSheet.spacingSmall)(
                        $text(`${winCount} / ${totalCount - winCount}`)
                      )
                    })
                  },
                  {
                    $head: $column(style({ textAlign: 'right' }))(
                      $text('Size'),
                      $text(style({ fontSize: '.85rem' }))('Leverage')
                    ),
                    sortBy: 'maxSizeInUsd',
                    columnOp: style({ placeContent: 'flex-end' }),
                    $bodyCallback: map((pos: ILeaderboardCellData) => {
                      return $size(pos.maxSizeInUsd, pos.maxCollateralInUsd)
                    })
                  },
                ]
                : [],
              {
                // columnOp: style({ placeContent: 'flex-start' }),
                $head: $row(layoutSheet.spacingSmall, style({ flex: 1, placeContent: 'space-between' }))(
                  $tableHeader('ROI %', 'PnL $'),
                  $text(style({ alignSelf: 'center' }))(
                    map(tf => `${getMappedValue(LAST_ACTIVITY_LABEL_MAP, tf)} Activtiy`, activityTimeframe)
                  )
                ),
                sortBy: 'roi',
                gridTemplate: screenUtils.isDesktopScreen ? '200px' : '140px',
                $bodyCallback: map(pos => {
                  const adjustList = [...pos.increaseList, ...pos.decreaseList]

                  const timeline = getPositionListTimelinePerformance({
                    activityTimeframe: params.activityTimeframe,
                    list: adjustList,
                    pricefeedMap: params.pricefeedMap,
                    tickCount: 25,
                  })


                  const markerList = adjustList
                    .map(pos => ({
                      position: 'inBar',
                      color: colorAlpha(pallete.message, .15),
                      time: pos.blockTimestamp as Time,
                      size: 0.1,
                      shape: 'circle'
                    }))
                    .sort((a, b) => Number(a.time) - Number(b.time))

                  return $row(style({ position: 'relative', flex: 1, height: '100%' }))(
                    $row(style({ position: 'relative', pointerEvents: 'none', width: `100%` }))(
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
                              bottom: 0,
                            }
                          },
                          crosshair: {
                            horzLine: {
                              visible: false,
                            },
                            vertLine: {
                              visible: false,
                            }
                          },
                          // height: 150,
                          // width: 100,
                          timeScale: {
                            visible: false
                          },
                          // ...config.chartConfig
                        },
                        data: timeline as any as BaselineData[],
                        // containerOp: style({  inset: '0px 0px 0px 0px' }),
                        baselineOptions: {
                          baseValue: {
                            price: 0,
                            type: 'price',
                          },
                          lineWidth: 1,
                          lineType: LineType.Curved,
                        },
                      })({})
                    ),
                    $row(style({ position: 'absolute', background: `linear-gradient(to right, ${pallete.background} 0%, ${pallete.background} 23%, transparent 100%)`, inset: 0, zIndex: 1, alignItems: 'center' }))(
                      $column(layoutSheet.spacingTiny)(
                        $roiDisplay(
                          pos.roi
                        ),
                        $seperator2,
                        $text(style({ fontSize: '.85rem' }))(readablePnl(pos.pnl))
                      )
                    )
                  )
                })
              },
            ]
            // if (params.accountStatsList.length === 0) {
            //   return $column(layoutSheet.spacingSmall, style({ padding: '30px' }))(
            //     $text('No positions found'),
            //     $infoLabel(`Try changing filters or selecting a different markets`),
            //   )
            // }

            // const dataSource: Stream<TablePageResponse<ILeaderboardMatchStats>> = map(scroll => {

            //   const newLocal = pagingQuery(
            //     { ...params.sortBy, ...scroll },
            //     params.accountStatsList
            //   )
            //   return newLocal
            // }, paging)




            return $Table({
              $headerContainer: $defaultTableRowContainer(style({ marginTop: '-10px' })),
              $container: $defaultTableContainer(style({ backgroundColor: pallete.background, borderTop: `1px solid ${colorAlpha(pallete.foreground, .2)}`, padding: screenUtils.isDesktopScreen ? '36px' : '14px 8px' })),
              $cell: $defaultTableCell(style({ padding: '0', height: '70px' })),
              scrollConfig: {
                // $container: $defaultVScrollContainer(style({ gap: '2px' })),
                $loader: style({ placeContent: 'center', margin: '0 1px', background: pallete.background, flexDirection: 'row-reverse', padding: '16px 0' })(
                  $infoLabeledValue(
                    'Loading',
                    style({ margin: '' })(
                      $spinner
                    )
                  )
                )
              },
              // $headerContainer: $defaultTableRowContainer(style({ background: pallete.background, padding: screenUtils.isDesktopScreen ? '8px 26px' : '8px' })),
              // $rowContainer: $defaultTableRowContainer(
              //   stylePseudo(':last-child', { borderRadius: '0 0 18px 18px', marginBottom: '2px' }),
              //   style({ background: pallete.background, padding: screenUtils.isDesktopScreen ? '8px 26px' : '8px' })
              // ),
              // $bodyRowContainer: $defaultTableRowContainer(
              //   style({ margin: '0 1px' })
              // ),
              sortBy: params.sortBy,
              dataSource,
              columns,
            })({
              sortBy: sortByChangeTether(),
              scrollRequest: scrollRequestTether(),
            })


          })
        })({})
      )

    ),

    {
      routeChange, changeActivityTimeframe, selectMarketTokenList, changeMatchRuleList,
    }
  ]
})

