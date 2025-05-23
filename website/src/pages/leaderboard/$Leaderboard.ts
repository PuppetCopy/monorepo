import { awaitPromises, empty, map, mergeArray, now, startWith } from '@most/core'
import type { Stream } from '@most/types'
import { type IntervalTime, USD_DECIMALS } from '@puppet-copy/middleware/const'
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
} from '@puppet-copy/middleware/ui-components'
import { uiStorage } from '@puppet-copy/middleware/ui-storage'
import {
  fillTimeline,
  formatFixed,
  type InferStream,
  readablePnl,
  unixTimestampNow
} from '@puppet-copy/middleware/utils'
import { $node, $text, combineState, component, type IBehavior, style, switchMap } from 'aelea/core'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { type BaselineData, LineType, type Time } from 'lightweight-charts'
import { asc, desc } from 'ponder'
import * as schema from 'schema'
import type { Address } from 'viem/accounts'
import type { IMatchingRule, ITraderRouteLatestMetric } from '../../__generated__/ponder.types.js'
import { $pnlDisplay, $roiDisplay, $size, $TraderDisplay, $tokenTryLabeled } from '../../common/$common.js'
import { $card2 } from '../../common/elements/$common.js'
import { $bagOfCoins, $trophy } from '../../common/elements/$icons.js'
import { queryDb } from '../../common/sqlClient.js'
import { $SelectCollateralToken } from '../../components/$CollateralTokenSelector.js'
import { $LastAtivity, lastActivityOptionList } from '../../components/$LastActivity.js'
import type { IMatchingRuleEditorDraft } from '../../components/portfolio/$MatchRuleEditor.js'
import { $RouteEditor } from '../../components/portfolio/$RouteEditor.js'
import { $tableHeader } from '../../components/table/$TableColumn.js'
import { localStore } from '../../const/localStore.js'
import { $seperator2 } from '../common.js'
import type { IPageFilterParams, IPageParams } from '../type.js'

interface ILeaderboard extends IPageFilterParams, IPageParams {
  userMatchingRuleQuery: Stream<Promise<IMatchingRule[]>>
  draftMatchingRuleList: Stream<IMatchingRuleEditorDraft[]>
}

type ISortLeaderboardBy = ISortBy<Omit<ITraderRouteLatestMetric, 'traderRouteMetric'>>

export const $Leaderboard = (config: ILeaderboard) =>
  component(
    (
      [scrollRequest, scrollRequestTether]: IBehavior<IQuantumScrollPage>,
      [sortByChange, sortByChangeTether]: IBehavior<ISortLeaderboardBy>,
      [changeScreenerFocus, changeScreenerFocusTether]: IBehavior<'roi' | 'pnl'>,

      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<IntervalTime>,
      [selectCollateralTokenList, selectCollateralTokenListTether]: IBehavior<Address[]>,

      [routeChange, routeChangeTether]: IBehavior<any, string>,
      // [switchIsLong, switchIsLongTether]: IBehavior<boolean | undefined>,
      [filterAccount, _filterAccountTether]: IBehavior<string | undefined>,

      [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<IMatchingRuleEditorDraft[]>
    ) => {
      const { activityTimeframe, collateralTokenList, draftMatchingRuleList, userMatchingRuleQuery, route } = config

      // const pricefeedMapQuery = queryPricefeed({ activityTimeframe })

      const screenerFocus = uiStorage.replayWrite(localStore.leaderboard, changeScreenerFocus, 'focus')
      const sortBy = uiStorage.replayWrite(
        localStore.leaderboard,
        mergeArray([
          sortByChange,
          map((selector) => {
            return { direction: 'desc', selector } as const
          }, changeScreenerFocus)
        ]),
        'sortBy'
      )
      // const isLong = uiStorage.replayWrite(localStore.leaderboard, switchIsLong, 'isLong')
      const account = uiStorage.replayWrite(localStore.leaderboard, filterAccount, 'account')
      const paging = startWith({ offset: 0, pageSize: 20 }, scrollRequest)

      return [
        $column(
          spacing.default,
          style({ paddingTop: '36px' })
        )(
          $card2(style({ padding: '0', gap: 0 }))(
            // display: flex
            // flex-direction: row;
            // gap: 26px;
            // flex: 1 1 0%;
            // padding: 26px;
            // place-content: center;
            // flex-wrap: wrap;
            // align-items: flex-start;
            (isDesktopScreen
              ? $row(spacing.big, style({ padding: '26px', placeContent: 'space-between', alignItems: 'center' }))
              : $row(
                  spacing.big,
                  style({ padding: '12px', placeContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start' })
                ))(
              $ButtonToggle({
                value: screenerFocus,
                optionList: ['pnl', 'roi'] as ISortLeaderboardBy['selector'][],
                $$option: map((option) => {
                  return $row(spacing.small, style({ alignItems: 'center' }))(
                    option === undefined
                      ? empty()
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
              $SelectCollateralToken({ selectedList: collateralTokenList })({
                changeCollateralTokenList: selectCollateralTokenListTether()
              }),

              $LastAtivity(activityTimeframe)({
                changeActivityTimeframe: changeActivityTimeframeTether()
              })
              // $ButtonToggle({
              //   selected: isLong,
              //   options: [undefined, true, false],
              //   $$option: map((il) => {
              //     return $row(spacing.tiny, style({ alignItems: 'center' }))(
              //       il === undefined
              //         ? empty()
              //         : $icon({ $content: il ? $bull : $bear, width: '18px', viewBox: '0 0 32 32' }),
              //       $text(il === undefined ? 'Both' : il ? 'Long' : 'Short')
              //     )
              //   })
              // })({
              //   select: switchIsLongTether()
              // }),
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
                        // params.isLong !== undefined
                        //   ? params.isLong
                        //     ? f.gte(t.longShortRatio, 5000n)
                        //     : f.lte(t.longShortRatio, 5000n)
                        //   : undefined,
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

              return $Table({
                $headerRowContainer: $defaultTableRowContainer(style({ marginTop: '-10px' })),
                $container: $defaultTableContainer(
                  style({
                    backgroundColor: pallete.background,
                    borderTop: `1px solid ${colorAlpha(pallete.foreground, 0.2)}`,
                    padding: isDesktopScreen ? '36px' : '14px'
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
                columns: [
                  {
                    $head: $text('Trader'),
                    gridTemplate: isDesktopScreen ? '149px' : '136px',
                    $bodyCallback: map((pos) => {
                      return $TraderDisplay({
                        route: config.route,
                        address: pos.metric.account,
                        puppetList: []
                      })({
                        click: routeChangeTether()
                      })
                    })
                  },
                  {
                    $head: $text('Collateral'),
                    gridTemplate: isDesktopScreen ? '104px' : '52px',
                    $bodyCallback: map((routeMetric) => {
                      return switchMap((list) => {
                        return $RouteEditor({
                          draftMatchingRuleList,
                          collateralToken: routeMetric.metric.collateralToken,
                          traderMatchedPuppetList: routeMetric.metric.matchedPuppetList,
                          userMatchingRuleList: list,
                          trader: routeMetric.metric.account
                        })({
                          changeMatchRuleList: changeMatchRuleListTether()
                        })
                      }, awaitPromises(userMatchingRuleQuery))
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
                          $head: $text('Markets'),
                          gridTemplate: isDesktopScreen ? '210px' : undefined,
                          $bodyCallback: map((pos) => {
                            const marketList = pos.metric.traderRouteMetric.marketList
                            const marketListLength = marketList.length
                            return $row(spacing.small)(
                              ...marketList.slice(0, 4).map((token) => $tokenTryLabeled(token, false, '32px')),
                              marketListLength > 4
                                ? style({ fontSize: '.8rem' })($infoLabel($text(`+${marketListLength - 4} more`)))
                                : empty()
                            )
                          })
                        },
                        {
                          $head: $tableHeader('Volume', 'Leverage'),
                          sortBy: 'sizeUsd',
                          // $headerCellContainer: $defaultTableCell(style({ placeContent: 'flex-end' })),
                          // $bodyCellContainer: $defaultTableCell(style({ placeContent: 'flex-end' })),
                          $bodyCallback: map((pos) => {
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
                        $text(
                          `${lastActivityOptionList.find((option) => option.value === params.activityTimeframe)?.label} Activtiy`
                        )
                      )
                    ),
                    sortBy: params.screenerFocus,
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

                      return $row(style({ position: 'relative', height: '100%', flex: 1 }))(
                        style({
                          flex: 1,
                          inset: '0px 0px 0px 0px',
                          position: 'absolute',
                          pointerEvents: 'none',
                          width: '100%'
                        })(
                          $Baseline({
                            markers: now(markerList),
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
                sortBy: sortByChangeTether(),
                scrollRequest: scrollRequestTether()
              })
            }, combineState({ screenerFocus, sortBy, activityTimeframe, account, collateralTokenList }))
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
