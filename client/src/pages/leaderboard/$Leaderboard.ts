import { Behavior, combineObject } from "@aelea/core"
import { $text, component, style } from "@aelea/dom"
import { $column, $row, layoutSheet, screenUtils } from "@aelea/ui-components"
import { pallete } from "@aelea/ui-components-theme"
import { empty, map, startWith } from "@most/core"
import { Stream } from "@most/types"
import { IntervalTime, getBasisPoints, getMappedValue, pagingQuery, readablePercentage } from "common-utils"
import { ILeaderboardSummary, leaderboardSummary, queryLeaderboardPosition } from "puppet-middleware-utils"
import { $ButtonToggle, $IntermediatePromise, $bear, $bull, $icon, $infoLabel, IQuantumScrollPage, ISortBy, TableColumn, TablePageResponse } from "ui-components"
import { uiStorage } from "ui-storage"
import * as viem from "viem"
import { $TraderDisplay, $TraderRouteDisplay, $pnlDisplay, $size } from "../../common/$common.js"
import { $card2, $responsiveFlex } from "../../common/elements/$common.js"
import { subgraphClient } from "../../common/graphClient"
import { $SelectCollateralToken } from "../../components/$CollateralTokenSelector"
import { $LastAtivity, LAST_ACTIVITY_LABEL_MAP } from "../../components/$LastActivity.js"
import { $CardTable } from "../../components/$common"
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

  const { activityTimeframe, selectedCollateralTokenList, walletClientQuery, pricefeedMapQuery, route } = config

  const sortBy = uiStorage.replayWrite(storeDb.store.leaderboard, sortByChange, 'sortBy')
  const isLong = uiStorage.replayWrite(storeDb.store.leaderboard, switchIsLong, 'isLong')

  const positionListQuery = queryLeaderboardPosition(subgraphClient, { selectedCollateralTokenList, activityTimeframe, isLong })

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
          $SelectCollateralToken({
            selectedList: selectedCollateralTokenList,
          })({
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
                gridTemplate: '155px',
                // columnOp: style({ placeContent: 'flex-end' }),
                $bodyCallback: map(pos => {
                  return $TraderDisplay({
                    route: config.route,
                    trader: pos.account,
                    puppets: pos.puppets,
                  })({
                    click: routeChangeTether()
                  })
                })
              },
              {
                $head: $text('Trade Route'),
                gridTemplate: screenUtils.isDesktopScreen ? '210px' : '80px',
                $bodyCallback: map(pos => {
                  return $TraderRouteDisplay({
                    walletClientQuery,
                    selectedCollateralTokenList,
                    collateralTokenList: pos.collateralTokenList,
                    trader: pos.account
                  })({
                    modifySubscribeList: modifySubscriberTether()
                  })
                })
              },
              ...screenUtils.isDesktopScreen
                ? [

                  {
                    $head: $text('Win/Loss'),
                    gridTemplate: '70px',
                    columnOp: style({ alignItems: 'center', placeContent: 'center' }),
                    $bodyCallback: map((pos: ILeaderboardSummary) => {
                      return $row(layoutSheet.spacingSmall)(
                        $text(`${pos.winCount} / ${pos.lossCount}`)

                      )
                    })
                  },
                  {
                    $head: $column(style({ textAlign: 'right' }))(
                      $text('Size'),
                      $text(style({ fontSize: '.85rem' }))('Leverage'),
                    ),
                    sortBy: 'maxSize',
                    columnOp: style({ placeContent: 'flex-end' }),
                    $bodyCallback: map((pos: ILeaderboardSummary) => {
                      return $size(pos.maxSize, pos.maxCollateral)
                    })
                  },
                ]
                : [],
              {
                columnOp: style({ placeContent: 'flex-start' }),
                $head: $row(layoutSheet.spacingSmall, style({ flex: 1, placeContent: 'space-between' }))(
                  $tableHeader('PnL $', 'ROI %'),
                  $text(style({ alignSelf: 'center' }))(
                    map(tf => `${getMappedValue(LAST_ACTIVITY_LABEL_MAP, tf)} Activtiy`, activityTimeframe)
                  )
                ),
                sortBy: 'pnl',
                gridTemplate: screenUtils.isDesktopScreen ? '200px' : '165px',
                $bodyCallback: map(pos => {
                  return $row(style({ position: 'relative', flex: 1 }))(
                    $LeaderboardPerformanceTimeline({
                      $container: $row(style({ position: 'relative', pointerEvents: 'none', width: `100%`, height: `80px` })),
                      tickCount: 25,
                      list: pos.positionList,
                      pricefeedMap: params.pricefeedMap,
                      activityTimeframe: params.activityTimeframe,
                    })({}),

                    $row(style({ position: 'absolute', background: `linear-gradient(to right, ${pallete.background} 0%, ${pallete.background} 23%, transparent 100%)`, inset: 0, zIndex: 1, alignItems: 'center' }))(
                      $PnlAndRoi(pos)
                    ),
                  )
                })
              },
              // {
              //   $head: $tableHeader('PnL $', 'ROI %'),
              //   gridTemplate: screenUtils.isDesktopScreen ? '120px' : '80px',
              //   sortBy: 'pnl',
              //   columnOp: style({ placeContent: 'flex-start' }),
              //   $bodyCallback: map(tr => {

              //     return $PnlAndRoi(tr)
              //   })
              // },
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
  return $column(layoutSheet.spacingTiny)(
    $pnlDisplay(tr.pnl),
    $seperator2,
    $text(style({ fontSize: '.85rem' }))(
      readablePercentage(getBasisPoints(tr.pnl, tr.maxCollateral))
    )
  )
}

