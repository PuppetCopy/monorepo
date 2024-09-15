import { Behavior, combineObject } from "@aelea/core"
import { $element, $text, component, style } from "@aelea/dom"
import { $column, $row, layoutSheet, screenUtils } from "@aelea/ui-components"
import { pallete } from "@aelea/ui-components-theme"
import { empty, map, startWith } from "@most/core"
import { Stream } from "@most/types"
import { ADDRESS_ZERO, IntervalTime, getBasisPoints, getMappedValue, groupArrayMany, pagingQuery, readablePercentage } from "common-utils"
import { MARKET_TOKEN_MAP } from "gmx-middleware-utils"
import { ILeaderboardSummary, leaderboardSummary, queryLeaderboardPosition } from "puppet-middleware-utils"
import { $ButtonToggle, $IntermediatePromise, $bear, $bull, $icon, $infoLabel, $labelDisplay, IQuantumScrollPage, ISortBy, TableColumn, TablePageResponse } from "ui-components"
import { uiStorage } from "ui-storage"
import * as viem from "viem"
import { $TraderDisplay, $TraderRouteDisplay, $pnlDisplay, $size, $tokenIcon, $tokenLabeled } from "../../common/$common.js"
import { $card2, $responsiveFlex } from "../../common/elements/$common.js"
import { subgraphClient } from "../../common/graphClient"
import { $LastAtivity, LAST_ACTIVITY_LABEL_MAP } from "../../components/$LastActivity.js"
import { $CardTable } from "../../components/$common"
import { $DropMultiSelect } from "../../components/form/$Dropdown"
import { IChangeSubscription } from "../../components/portfolio/$RouteSubscriptionEditor"
import { $tableHeader } from "../../components/table/$TableColumn.js"
import { $LeaderboardPerformanceTimeline } from "../../components/trade/$ProfilePerformanceGraph"
import * as storeDb from "../../const/store.js"
import { $seperator2 } from "../common.js"
import { IUserActivityPageParams } from "../type.js"




export const $Leaderboard = (config: IUserActivityPageParams) => component((
  [modifySubscriber, modifySubscriberTether]: Behavior<IChangeSubscription>,

  [scrollRequest, scrollRequestTether]: Behavior<IQuantumScrollPage>,
  [sortByChange, sortByChangeTether]: Behavior<ISortBy>,

  [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<IntervalTime>,
  [selectMarketTokenList, selectMarketTokenListTether]: Behavior<viem.Address[]>,

  [routeChange, routeChangeTether]: Behavior<any, string>,
  [switchIsLong, switchIsLongTether]: Behavior<boolean | undefined>,
) => {

  const { activityTimeframe, collateralTokenList, walletClientQuery, pricefeedMapQuery, route } = config

  const sortBy = uiStorage.replayWrite(storeDb.store.leaderboard, sortByChange, 'sortBy')
  const isLong = uiStorage.replayWrite(storeDb.store.leaderboard, switchIsLong, 'isLong')

  const positionListQuery = queryLeaderboardPosition(subgraphClient, { collateralTokenList, activityTimeframe, isLong })

  const tableParams = map(async pageParams => {
    const positionList = await pageParams.positionListQuery
    const pricefeedMap = await pageParams.pricefeedMapQuery
    const activityTimeframe = pageParams.activityTimeframe

    return { positionList, pricefeedMap, sortBy: pageParams.sortBy, activityTimeframe }
  }, combineObject({ sortBy, positionListQuery, pricefeedMapQuery, activityTimeframe }))



  return [
    $column(layoutSheet.spacing, style({ paddingTop: '36px' }))(

      $card2(style({ padding: "0", gap: 0 }))(
        $responsiveFlex(layoutSheet.spacingBig, style({ padding: '26px', placeContent: 'space-between', alignItems: 'flex-start' }))(
          $DropMultiSelect({
            // $container: $row(layoutSheet.spacingTiny, style({ display: 'flex', position: 'relative' })),
            $input: $element('input')(style({ width: '100px' })),
            $label: $labelDisplay(style({ color: pallete.foreground }))('Route'),
            placeholder: 'All / Select',
            // getId: item => item.routeTypeKey,
            $$chip: map(tr => $tokenIcon(tr)),
            selector: {
              list: Object.values(MARKET_TOKEN_MAP).filter(token => token !== ADDRESS_ZERO),
              $$option: map(tr => {
                return style({
                  padding: '8px'
                }, $tokenLabeled(tr))
              })
            },
            value: collateralTokenList
          })({
            select: selectMarketTokenListTether()
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

            const positionList = params.positionList
            if (positionList.length === 0) {
              return $column(layoutSheet.spacingSmall, style({ padding: '30px' }))(
                $text('No positions found'),
                $infoLabel(`Try changing filters or selecting a different markets`),
              )
            }


            const paging = startWith({ offset: 0, pageSize: 20 }, scrollRequest)

            const dataSource: Stream<TablePageResponse<ILeaderboardSummary>> = map(scroll => {
              const filterestPosList = leaderboardSummary(params.pricefeedMap, positionList)

              return pagingQuery(
                { ...params.sortBy, ...scroll },
                filterestPosList,
                (a: any, b: any) => params.sortBy.direction === 'desc'
                  ? Number(b[params.sortBy.selector]) - Number(a[params.sortBy.selector])
                  : Number(a[params.sortBy.selector]) - Number(b[params.sortBy.selector])
              )
            }, paging)


            const columns: TableColumn<ILeaderboardSummary>[] = [
              {
                $head: $text('Trader'),
                gridTemplate: screenUtils.isDesktopScreen ? '160px' : '120px',
                // columnOp: style({ placeContent: 'flex-end' }),
                $bodyCallback: map(pos => {

                  return $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
                    $TraderDisplay({
                      route: config.route,
                      trader: pos.account,
                    })({
                      click: routeChangeTether()
                    }),
                    $TraderRouteDisplay({
                      walletClientQuery,
                      puppets: pos.puppets,
                      trader: pos.account
                    })({
                      modifySubscribeList: modifySubscriberTether()
                    }),
                  )
                })
              },
              ...screenUtils.isDesktopScreen
                ? [
                  // {
                  //   $head: $text('Puppets'),
                  //   gridTemplate: '90px',
                  //   $bodyCallback: map((pos: ITableRow) => {
                  //     return $puppets(pos.summary.puppets, routeChangeTether)
                  //   })
                  // },
                  {
                    $head: $text('Win/Loss'),
                    gridTemplate: '90px',
                    columnOp: style({ alignItems: 'center', placeContent: 'center' }),
                    $bodyCallback: map((pos: ILeaderboardSummary) => {
                      return $row(layoutSheet.spacingSmall)(
                        $text(`${pos.winCount} / ${pos.lossCount}`)

                      )
                    })
                  },
                ]
                : [],
              {
                $head: $column(style({ textAlign: 'right' }))(
                  $text('Size'),
                  $text(style({ fontSize: '.85rem' }))('Leverage'),
                ),
                sortBy: 'maxSize',
                columnOp: style({ placeContent: 'flex-end' }),
                $bodyCallback: map((pos) => {
                  return $size(pos.maxSize, pos.maxCollateral)
                })
              },

              {
                $head: $tableHeader('PnL $', 'ROI %'),
                gridTemplate: screenUtils.isDesktopScreen ? '120px' : '80px',
                sortBy: 'pnl',
                columnOp: style({ placeContent: 'flex-end' }),
                $bodyCallback: map(tr => {

                  return $PnlAndRoi(tr)
                })
              },

              ...screenUtils.isDesktopScreen
                ? [
                  {
                    columnOp: style({ placeContent: 'flex-end' }),
                    $head: $text(map(tf => `Last ${getMappedValue(LAST_ACTIVITY_LABEL_MAP, tf)} activity`, activityTimeframe)),
                    gridTemplate: '140px',
                    $bodyCallback: map((pos: ILeaderboardSummary) => {

                      return screenUtils.isDesktopScreen
                        ? $LeaderboardPerformanceTimeline({
                          $container: $row(style({ position: 'relative', width: `180px`, height: `80px`, margin: '-16px 0' })),
                          tickCount: 25,
                          list: pos.positionList,
                          pricefeedMap: params.pricefeedMap,
                          activityTimeframe: params.activityTimeframe,
                        })({})
                        : empty()
                    })
                  },
                ]
                : [],
            ]

            return $CardTable({
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
      routeChange, modifySubscriber, changeActivityTimeframe, selectMarketTokenList,
      // unSubscribeSelectedTraders: snapshot((params, trader) => {
      //   const selectedIdx = params.selection.indexOf(trader)
      //   selectedIdx === -1 ? params.selection.push(trader) : params.selection.splice(selectedIdx, 1)
      //   return params.selection
      // }, combineObject({ selection: config.selectedTraders, subscription: config.subscription }), selectTrader),
    }
  ]
})





function $PnlAndRoi(tr: ILeaderboardSummary) {
  return $column(layoutSheet.spacingTiny, style({ textAlign: 'right' }))(
    $pnlDisplay(tr.pnl),
    $seperator2,
    $text(style({ fontSize: '.85rem' }))(
      readablePercentage(getBasisPoints(tr.pnl, tr.maxCollateral))
    )
  )
}

