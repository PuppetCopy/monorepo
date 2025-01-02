import { Behavior, combineObject, replayLatest } from "@aelea/core"
import { $text, component, style } from "@aelea/dom"
import { $column, $row, layoutSheet, screenUtils } from "@aelea/ui-components"
import { map, startWith } from "@most/core"
import { Stream } from "@most/types"
import { pagingQuery } from "common-utils"
import { getTokenDescription } from "gmx-middleware"
import { IntervalTime } from "puppet-const"
import { aggregatePositionList, IMatchRouteStats } from "puppet-middleware"
import { $infoLabel, $IntermediatePromise, $Table, IQuantumScrollPage, ISortBy } from "ui-components"
import * as viem from 'viem'
import { $card, $card2 } from "../../common/elements/$common.js"
import { IMatchRuleEditorChange } from "../../components/portfolio/$MatchRuleEditor"
import { $TraderMatchRouteEditor } from "../../components/portfolio/$TraderMatchRouteEditor"
import { entryColumn, pnlColumn, puppetsColumn, sizeColumn, timeColumn } from "../../components/table/$TableColumn.js"
import { $seperator2 } from "../common"
import { IPageParams, IUserActivityPageParams } from "../type.js"


interface ITraderPage extends IPageParams, IUserActivityPageParams {
  accountRouteStatsListQuery: Stream<Promise<IMatchRouteStats[]>>
}

export const $TraderPage = (config: ITraderPage) => component((
  [changeRoute, changeRouteTether]: Behavior<any, string>,
  [scrollRequest, scrollRequestTether]: Behavior<IQuantumScrollPage>,
  [sortByChange, sortByChangeTether]: Behavior<ISortBy>,
  [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<any, IntervalTime>,
  [selectMarketTokenList, selectMarketTokenListTether]: Behavior<viem.Address[]>,
  [changeMatchRuleList, changeMatchRuleListTether]: Behavior<IMatchRuleEditorChange[]>,
) => {

  const {
    activityTimeframe, selectedCollateralTokenList, accountRouteStatsListQuery, matchRuleList, depositTokenList, pricefeedMapQuery, providerClientQuery, route,
    walletClientQuery
  } = config

  const sortBy = replayLatest(sortByChange, { direction: 'desc', selector: 'openTimestamp' } as const)

  const tableParams = map(async params => {
    const activityTimeframe = params.activityTimeframe
    const matchRouteList = await params.accountRouteStatsListQuery

    return { matchRouteList, sortBy: params.sortBy, activityTimeframe }
  }, combineObject({ sortBy, accountRouteStatsListQuery, activityTimeframe }))


  return [
    $column(layoutSheet.spacingBig)(
      $card(layoutSheet.spacingBig, style({ flex: 1, width: '100%' }))(
        $card2(style({ padding: 0, height: screenUtils.isDesktopScreen ? '200px' : '200px', position: 'relative', margin: screenUtils.isDesktopScreen ? `-36px -36px 0` : `-12px -12px 0px` }))(
          // $ProfilePeformanceTimeline({ ...config })({
          //   selectMarketTokenList: selectMarketTokenListTether(),
          //   changeActivityTimeframe: changeActivityTimeframeTether(),
          // })
        ),

        $IntermediatePromise({
          query: tableParams,
          $$done: map(params => {
            const list = params.matchRouteList
            const paging = startWith({ offset: 0, pageSize: 20 }, scrollRequest)

            if (list.length === 0) {
              return $column(layoutSheet.spacingSmall)(
                $text('No active positions found'),
                $infoLabel(`Try changing the timeframe or selecting a different trade route`),
              )
            }


            return $column(layoutSheet.spacing)(
              ...list.map(route => {

                const positionList = aggregatePositionList([...route.matchRoute.decreaseList, ...route.matchRoute.increaseList])
                const dataSource = map(pageParams => {
                  return pagingQuery({ ...pageParams.paging, ...pageParams.sortBy }, positionList)
                }, combineObject({ sortBy, paging }))

                const collateralTokenDescription = getTokenDescription(route.matchRoute.collateralToken)

                return $column(
                  // style({ padding: '0 0 12px' })($route(collateralTokenDescription)),
                  $TraderMatchRouteEditor({
                    matchRuleList,
                    walletClientQuery,
                    matchRoute: route.matchRoute,
                    trader: route.account
                  })({
                    changeMatchRuleList: changeMatchRuleListTether(),
                  }),
                  $row(
                    style({ marginRight: '26px' })($seperator2),
                    $Table({
                      $container: $column(style({ flex: 1 })),
                      dataSource,
                      sortBy: params.sortBy,
                      columns: [
                        ...screenUtils.isDesktopScreen ? [timeColumn] : [],
                        entryColumn,
                        puppetsColumn(changeRouteTether),
                        sizeColumn(),
                        pnlColumn(),
                      ],
                    })({
                      sortBy: sortByChangeTether(),
                      scrollRequest: scrollRequestTether()
                    })
                  )
                )
              })
            )
          })
        })({}),
      ),
    ),
    { changeRoute, changeActivityTimeframe, selectMarketTokenList, changeMatchRuleList }
  ]
})


