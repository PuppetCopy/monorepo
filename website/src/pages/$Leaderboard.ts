import { type IntervalTime, USD_DECIMALS } from '@puppet-copy/middleware/const'
import {
  fillTimeline,
  formatFixed,
  getMappedValue,
  type InferStream,
  readablePnl,
  unixTimestampNow
} from '@puppet-copy/middleware/core'
import { getTokenDescription } from '@puppet-copy/middleware/gmx'
import type { ISetMatchingRule, ITraderRouteLatestMetric } from '@puppet-copy/sql/schema'
import * as schema from '@puppet-copy/sql/schema'
import {
  combine,
  empty,
  fromPromise,
  type IStream,
  joinMap,
  just,
  map,
  merge,
  op,
  start,
  switchMap
} from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { type BaselineData, LineType, type Time } from 'lightweight-charts'
import { asc, desc } from 'ponder'
import type { Address } from 'viem/accounts'
import {
  $Baseline,
  $ButtonToggle,
  $defaultTableCell,
  $defaultTableContainer,
  $defaultTableRowContainer,
  $icon,
  $infoLabel,
  $infoLabeledValue,
  $spinner,
  $Table,
  type IMarker,
  type IQuantumScrollPage,
  type ISeriesTime,
  type ISortBy,
  type TableColumn
} from '@/ui-components'
import { uiStorage } from '@/ui-storage'
import { $pnlDisplay, $roiDisplay, $size, $TraderDisplay, $tokenIcon } from '../common/$common.js'
import { $card2 } from '../common/elements/$common.js'
import { $bagOfCoins, $trophy } from '../common/elements/$icons.js'
import { sqlClient } from '../common/sqlClient.js'
import { $SelectCollateralToken } from '../components/$CollateralTokenSelector.js'
import { $LastAtivity, activityOptionLabelMap } from '../components/$LastActivity.js'
import type { ISetMatchingRuleEditorDraft } from '../components/portfolio/$MatchingRuleEditor.js'
import { $RouteEditor } from '../components/portfolio/$RouteEditor.js'
import { $tableHeader } from '../components/table/$TableColumn.js'
import { localStore } from '../const/localStore.js'
import { $seperator2 } from './common.js'
import type { IPageFilterParams, IPageParams } from './types.js'

interface ILeaderboard extends IPageFilterParams, IPageParams {
  userMatchingRuleQuery: IStream<Promise<ISetMatchingRule[]>>
  draftMatchingRuleList: IStream<ISetMatchingRuleEditorDraft[]>
}

export const $Leaderboard = (config: ILeaderboard) =>
  component(
    (
      [scrollRequest, scrollRequestTether]: IBehavior<IQuantumScrollPage>,
      [sortByChange, sortByChangeTether]: IBehavior<ISortBy<ITraderRouteLatestMetric>>,
      [changeScreenerFocus, changeScreenerFocusTether]: IBehavior<'roi' | 'pnl'>,

      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<IntervalTime>,
      [selectCollateralTokenList, selectCollateralTokenListTether]: IBehavior<Address[]>,
      [selectIndexTokenList, selectIndexTokenListTether]: IBehavior<Address[]>,

      [routeChange, routeChangeTether]: IBehavior<any, string>,
      // [switchIsLong, switchIsLongTether]: IBehavior<boolean | undefined>,
      [filterAccount, _filterAccountTether]: IBehavior<string | undefined>,

      [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<ISetMatchingRuleEditorDraft[]>
    ) => {
      const { activityTimeframe, collateralTokenList, indexTokenList, draftMatchingRuleList, userMatchingRuleQuery } =
        config

      // const pricefeedMapQuery = queryPricefeed({ activityTimeframe })

      const screenerFocus = uiStorage.replayWrite(localStore.leaderboard.focus, changeScreenerFocus)
      const sortBy = uiStorage.replayWrite(
        localStore.leaderboard.sortBy,
        merge(
          sortByChange,
          map(selector => {
            return { direction: 'desc', selector } as const
          }, changeScreenerFocus)
        )
      )
      // const isLong = uiStorage.replayWrite(localStore.leaderboard.isLong, switchIsLong)
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
              $ButtonToggle({
                value: screenerFocus,
                optionList: ['pnl', 'roi'],
                $$option: map(option => {
                  return $row(spacing.small, style({ alignItems: 'center' }))(
                    option === undefined
                      ? empty
                      : $icon({
                          $content: option === 'pnl' ? $bagOfCoins : $trophy,
                          width: '18px',
                          viewBox: '0 0 32 32'
                        }),
                    $text(option === 'roi' ? 'Performance' : 'Profit & Loss')
                  )
                })
              })({
                select: changeScreenerFocusTether()
              }),

              $row(
                // $SelectIndexToken({ selectedList: indexTokenList })({
                //   changeIndexTokenList: selectIndexTokenListTether()
                // }),
                $SelectCollateralToken({ selectedList: collateralTokenList })({
                  changeCollateralTokenList: selectCollateralTokenListTether()
                })
              ),

              $LastAtivity(activityTimeframe)({
                changeActivityTimeframe: changeActivityTimeframeTether()
              })
              // $ButtonToggle({
              //   selected: isLong,
              //   options: [undefined, true, false],
              //   $$option: map((il) => {
              //     return $row(spacing.tiny, style({ alignItems: 'center' }))(
              //       il === undefined
              //         ? empty
              //         : $icon({ $content: il ? $bull : $bear, width: '18px', viewBox: '0 0 32 32' }),
              //       $text(il === undefined ? 'Both' : il ? 'Long' : 'Short')
              //     )
              //   })
              // })({
              //   select: switchIsLongTether()
              // }),
            ),
            switchMap(params => {
              // const interval = IntervalTime.MIN
              const startActivityTimeframe = unixTimestampNow() - params.activityTimeframe
              // const startActivityTimeframeTimeSlot = Math.floor(startActivityTimeframe / interval) * interval

              const dataSource = map(async filterParams => {
                const metrictList = await sqlClient.query.traderRouteLatestMetric.findMany({
                  where: (t, f) => {
                    return f.and(
                      f.eq(t.interval, params.activityTimeframe),
                      params.account ? f.ilike(t.account, params.account) : undefined,
                      // params.isLong !== undefined
                      //   ? params.isLong
                      //     ? f.gte(t.longShortRatio, 5000n)
                      //     : f.lte(t.longShortRatio, 5000n)
                      //   : undefined,
                      // filterParams.collateralTokenList.length > 0 ? arrayContains(t.marketList, filterParams.collateralTokenList) : undefined,
                      params.collateralTokenList.length > 0
                        ? f.inArray(t.collateralToken, params.collateralTokenList)
                        : undefined,
                      params.indexTokenList.length > 0
                        ? f.sql`${t.indexTokenList} && ARRAY[${f.sql.raw(params.indexTokenList.map(token => `'${token.toLowerCase()}'`).join(','))}]::text[]`
                        : undefined,
                      f.gte(t.lastUpdatedTimestamp, startActivityTimeframe)
                    )
                  },
                  limit: filterParams.paging.pageSize,
                  offset: filterParams.paging.offset,
                  orderBy: params.sortBy
                    ? params.sortBy.direction === 'asc'
                      ? asc((schema.traderRouteLatestMetric as any)[params.sortBy.selector])
                      : desc((schema.traderRouteLatestMetric as any)[params.sortBy.selector])
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
                    indexTokenList: true
                  },
                  with: {
                    traderRouteMetric: {
                      columns: {
                        crossOpenSizeInUsd: true
                      }
                    }
                  }
                })

                const page = metrictList.map(metric => ({ metric }))
                return { ...filterParams.paging, page, hasMore: metrictList.length === filterParams.paging.pageSize }
              }, combine({ paging }))

              type ILeaderboardDatasource = Awaited<InferStream<typeof dataSource>>['page']
              type ILeaderboardCellData = ILeaderboardDatasource[number]

              return $Table({
                $headerRowContainer: $defaultTableRowContainer,
                $container: $defaultTableContainer(
                  style({
                    backgroundColor: pallete.background,
                    borderTop: `1px solid ${colorAlpha(pallete.foreground, 0.2)}`,
                    padding: isDesktopScreen ? '36px' : '12px'
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
                // $headerContainer: $defaultTableRowContainer(style({ background: pallete.background, padding: isDesktopScreen ? '8px 26px' : '8px' })),
                // $rowContainer: $defaultTableRowContainer(
                //   stylePseudo(':last-child', { borderRadius: '0 0 18px 18px', marginBottom: '2px' }),
                //   style({ background: pallete.background, padding: isDesktopScreen ? '8px 26px' : '8px' })
                // ),
                // $bodyRowContainer: $defaultTableRowContainer(
                //   style({ margin: '0 1px' })
                // ),
                sortBy: params.sortBy as any,
                dataSource,
                columns: [
                  {
                    $head: $text('Trader'),
                    gridTemplate: isDesktopScreen ? '149px' : '136px',
                    $bodyCallback: map(pos => {
                      return $TraderDisplay({
                        route: config.route,
                        address: pos.metric.account,
                        // ensNameStream: fromPromise(resolveEnsName(pos.metric.account as Address)),
                        puppetList: []
                      })({
                        click: routeChangeTether()
                      })
                    })
                  },
                  {
                    $head: $text('Collateral'),
                    gridTemplate: isDesktopScreen ? '104px' : '58px',
                    $bodyCallback: map((routeMetric: ILeaderboardCellData) => {
                      return op(
                        userMatchingRuleQuery,
                        joinMap(fromPromise),
                        switchMap(list => {
                          return $RouteEditor({
                            draftMatchingRuleList,
                            collateralToken: routeMetric.metric.collateralToken,
                            traderMatchedPuppetList: routeMetric.metric.matchedPuppetList,
                            userMatchingRuleList: list,
                            trader: routeMetric.metric.account
                          })({
                            changeMatchRuleList: changeMatchRuleListTether()
                          })
                        })
                      )
                    })
                  },
                  ...((isDesktopScreen
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
                          $head: $text('Traded Tokens'),
                          gridTemplate: isDesktopScreen ? '120px' : undefined,
                          $bodyCallback: map(pos => {
                            const indexTokenList = pos.metric.indexTokenList
                            const indexTokenListLength = indexTokenList.length
                            return $row(spacing.small)(
                              ...indexTokenList.slice(0, 3).map((token: Address) => {
                                const tokenDesc = getTokenDescription(token)
                                return tokenDesc
                                  ? op(
                                      $tokenIcon(tokenDesc),
                                      style({ marginRight: '-16px', border: `2px solid ${pallete.background}` })
                                    )
                                  : empty
                              }),
                              indexTokenListLength > 4
                                ? style({ fontSize: '.8rem', marginLeft: '18px', placeContent: 'center' })(
                                    $infoLabel($text(`+${indexTokenListLength - 3} more`))
                                  )
                                : empty
                            )
                          })
                        },
                        {
                          $head: $tableHeader('Volume', 'Leverage'),
                          sortBy: 'sizeUsd',
                          // $headerCellContainer: $defaultTableCell(style({ placeContent: 'flex-end' })),
                          // $bodyCellContainer: $defaultTableCell(style({ placeContent: 'flex-end' })),
                          $bodyCallback: map(pos => {
                            return $size(pos.metric.sizeUsd, pos.metric.collateralUsd)
                          })
                        }
                      ]
                    : []) as TableColumn<ILeaderboardCellData>[]),
                  {
                    // columnOp: style({ placeContent: 'flex-start' }),
                    $head: $row(spacing.small, style({ flex: 1, placeContent: 'space-between', alignItems: 'center' }))(
                      params.screenerFocus === 'roi' ? $tableHeader('ROI %', 'PNL $') : $tableHeader('PNL $', 'ROI %'),
                      $node(style({ textAlign: 'right', alignSelf: 'center' }))(
                        $text(`${getMappedValue(activityOptionLabelMap, params.activityTimeframe)} Activtiy`)
                      )
                    ),
                    sortBy: params.screenerFocus,
                    gridTemplate: isDesktopScreen ? '150px' : undefined,
                    $bodyCallback: map(pos => {
                      const endTime = unixTimestampNow()
                      const startTime = endTime - params.activityTimeframe
                      const sourceList = [
                        { value: 0n, time: startTime },
                        ...pos.metric.pnlList
                          .map((pnl: bigint, index: number) => ({
                            value: pnl,
                            time: pos.metric.pnlTimestampList[index]
                          }))
                          .filter((item: { value: bigint; time: number }) => item.time > startTime),
                        { value: pos.metric.pnlList[pos.metric.pnlList.length - 1], time: endTime }
                      ]

                      const timeline = fillTimeline({
                        sourceList,
                        getTime: item => item.time,
                        sourceMap: next => {
                          return formatFixed(USD_DECIMALS, next.value)
                        }
                      })

                      const markerList: IMarker[] = []

                      const crossOpenSizeInUsd = (pos.metric.traderRouteMetric as any)?.crossOpenSizeInUsd ?? 0n

                      if (crossOpenSizeInUsd > 0n) {
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
                                // autoScale: true,
                                ticksVisible: true,
                                scaleMargins: {
                                  top: 0.1,
                                  bottom: 0.1
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
                              timeScale: {
                                visible: false
                              }
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
                          params.screenerFocus === 'roi'
                            ? $column(spacing.tiny)(
                                $roiDisplay(pos.metric.roi),
                                $seperator2,
                                $node(style({ fontSize: '.8rem' }))($text(readablePnl(pos.metric.pnl)))
                              )
                            : $column(spacing.tiny)(
                                $pnlDisplay(pos.metric.pnl),
                                $seperator2,
                                $node(style({ fontSize: '.8rem' }))($text(`${formatFixed(2, pos.metric.roi)}%`))
                              )
                        )
                      )
                    })
                  }
                ] as TableColumn<ILeaderboardCellData>[]
              })({
                sortBy: sortByChangeTether() as any,
                scrollRequest: scrollRequestTether()
              })
            }, combine({ screenerFocus, sortBy, activityTimeframe, account, collateralTokenList, indexTokenList }))
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
