import { Behavior, combineObject } from "@aelea/core"
import { $element, $text, component, style } from "@aelea/dom"
import { $column, $row, layoutSheet, screenUtils } from "@aelea/ui-components"
import { awaitPromises, empty, map, startWith } from "@most/core"
import { Stream } from "@most/types"
import { ADDRESS_ZERO, IPagingQueryParams, IntervalTime, getBasisPoints, getMappedValue, groupArrayMany, pagingQuery, readablePercentage, switchMap } from "common-utils"
import { IPriceTickListMap, isPositionOpen, isPositionSettled, MARKET_TOKEN_MAP } from "gmx-middleware-utils"
import { IMirrorListSummary, accountSettledPositionListSummary, openPositionListPnl, queryPosition, IPosition } from "puppet-middleware-utils"
import { $bear, $bull, $ButtonToggle, $icon, $labelDisplay, ISortBy, IQuantumScrollPage, TableColumn, TablePageResponse, $IntermediatePromise, $infoLabel } from "ui-components"
import { uiStorage } from "ui-storage"
import * as viem from "viem"
import { $TraderDisplay, $TraderRouteDisplay, $pnlDisplay, $size, $tokenIcon, $tokenLabeled } from "../../common/$common.js"
import { $card2, $responsiveFlex } from "../../common/elements/$common.js"
import { $LastAtivity, LAST_ACTIVITY_LABEL_MAP } from "../../components/$LastActivity.js"
import { $CardTable } from "../../components/$common"
import { IChangeSubscription } from "../../components/portfolio/$RouteSubscriptionEditor"
import { $tableHeader } from "../../components/table/$TableColumn.js"
import { $ProfilePerformanceGraph } from "../../components/trade/$ProfilePerformanceGraph.js"
import * as storeDb from "../../const/store.js"
import { $seperator2 } from "../common.js"
import { IUserActivityPageParams } from "../type.js"
import { subgraphClient } from "../../common/graphClient"
import { $DropMultiSelect } from "../../components/form/$Dropdown"
import { pallete } from "@aelea/ui-components-theme"




type ITableRow = {
  summary: IMirrorListSummary
  openPositionList: IPosition[]
  settledPositionList: IPosition[]
  positionList: IPosition[]
  activityTimeframe: IntervalTime
}


export const $Leaderboard = (config: IUserActivityPageParams) => component((
  [modifySubscriber, modifySubscriberTether]: Behavior<IChangeSubscription>,

  [scrollRequest, scrollRequestTether]: Behavior<IQuantumScrollPage>,
  [sortByChange, sortByChangeTether]: Behavior<ISortBy>,

  [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<IntervalTime>,
  [selectCollateralTokenList, selectCollateralTokenListTether]: Behavior<viem.Address[]>,

  [routeChange, routeChangeTether]: Behavior<any, string>,
  [switchIsLong, switchIsLongTether]: Behavior<boolean | undefined>,
) => {

  const { activityTimeframe, collateralTokenList, walletClientQuery, priceTickMapQuery, route } = config

  const sortBy = uiStorage.replayWrite(storeDb.store.leaderboard, sortByChange, 'sortBy')
  const isLong = uiStorage.replayWrite(storeDb.store.leaderboard, switchIsLong, 'isLong')

  const positionListQuery = queryPosition(subgraphClient, { collateralTokenList, activityTimeframe, isLong })



  const tableParams = map(async pageParams => {
    const positionList = await pageParams.positionListQuery
    const pricefeed = await pageParams.priceTickMapQuery

    return { positionList, pricefeed, sortBy: pageParams.sortBy }
  }, combineObject({ sortBy, positionListQuery, priceTickMapQuery }))



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
            select: selectCollateralTokenListTether()
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
                $text(il === undefined ? 'All' : il ? 'Long' : 'Short'),
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
            if (positionList.list.length === 0) {
              return $column(layoutSheet.spacingSmall, style({padding: '30px'}))(
                $text('No positions found'),
                $infoLabel(`Try changing filters or selecting a different markets`),
              )
            }


            const paging = startWith({ offset: 0, pageSize: 20 }, scrollRequest)

            const dataSource: Stream<TablePageResponse<ITableRow>> = map(scroll => {

              const tradeListMap = groupArrayMany(positionList.list, a => a.account)
              const tradeListEntries = Object.values(tradeListMap)

              const filterestPosList: ITableRow[] = tradeListEntries.map(list => {
                const summary = accountSettledPositionListSummary(list)
                const openPositionList = list.filter(isPositionOpen) as IPosition[]
                const settledPositionList = list.filter(isPositionSettled) as IPosition[]
                const activityTimeframe = positionList.filter.activityTimeframe!


                return { summary, openPositionList, settledPositionList, positionList: list, activityTimeframe }
              })

              return pagingQuery(
                { ...params.sortBy, ...scroll },
                filterestPosList,
                (a, b) => params.sortBy.direction === 'desc'
                  ? Number(b.summary.pnl) - Number(a.summary.pnl)
                  : Number(a.summary.pnl) - Number(b.summary.pnl)
              )
            }, paging)
    

            const columns: TableColumn<ITableRow>[] = [
              {
                $head: $text('Trader'),
                gridTemplate: screenUtils.isDesktopScreen ? '160px' : '120px',
                // columnOp: style({ placeContent: 'flex-end' }),
                $bodyCallback: map(pos => {

                  return $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
                    $TraderDisplay({
                      route: config.route,
                      trader: pos.summary.account,
                    })({
                      click: routeChangeTether()
                    }),
                    $TraderRouteDisplay({
                      walletClientQuery,
                      summary: pos.summary,
                      trader: pos.summary.account
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
                    $head: $text('Win / Loss'),
                    gridTemplate: '90px',
                    columnOp: style({ alignItems: 'center', placeContent: 'center' }),
                    $bodyCallback: map((pos: ITableRow) => {
                      return $row(
                        $text(`${pos.summary.winCount} / ${pos.summary.lossCount}`)
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
                sortBy: 'size',
                columnOp: style({ placeContent: 'flex-end' }),
                $bodyCallback: map((pos) => {
                  return $size(pos.summary.size, pos.summary.collateral)
                })
              },

              {
                $head: $tableHeader('PnL $', 'ROI %'),
                gridTemplate: screenUtils.isDesktopScreen ? '120px' : '80px',
                sortBy: 'pnl',
                columnOp: style({ placeContent: 'flex-end' }),
                $bodyCallback: map(tr => {
                  const pnl = map(openPnl => tr.summary.pnl + openPnl, openPositionListPnl(tr.openPositionList))

                  return $column(layoutSheet.spacingTiny, style({ textAlign: 'right' }))(
                    $pnlDisplay(pnl),
                    $seperator2,
                    $text(style({ fontSize: '.85rem' }))(
                      map(pnl => {
                        return readablePercentage(getBasisPoints(pnl, tr.summary.collateral))
                      }, pnl)
                    ),
                  )
                })
              },

              ...screenUtils.isDesktopScreen
                ? [
                  {
                    columnOp: style({ placeContent: 'flex-end' }),
                    $head: $text(map(tf => `Last ${getMappedValue(LAST_ACTIVITY_LABEL_MAP, tf)} activity`, activityTimeframe)),
                    gridTemplate: '140px',
                    $bodyCallback: map((pos: ITableRow) => {

                      return screenUtils.isDesktopScreen
                        ? $ProfilePerformanceGraph({
                          $container: $row(style({ position: 'relative', width: `180px`, height: `80px`, margin: '-16px 0' })),
                          tickCount: 50,
                          priceTickMap: params.pricefeed,
                          positionList: pos.positionList,
                          activityTimeframe: pos.activityTimeframe,
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
      routeChange, modifySubscriber, changeActivityTimeframe, selectCollateralTokenList,
      // unSubscribeSelectedTraders: snapshot((params, trader) => {
      //   const selectedIdx = params.selection.indexOf(trader)
      //   selectedIdx === -1 ? params.selection.push(trader) : params.selection.splice(selectedIdx, 1)
      //   return params.selection
      // }, combineObject({ selection: config.selectedTraders, subscription: config.subscription }), selectTrader),
    }
  ]
})





