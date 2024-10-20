import { Behavior, combineObject, replayLatest } from "@aelea/core"
import { $text, component, style } from "@aelea/dom"
import { $column, layoutSheet, screenUtils } from "@aelea/ui-components"
import { map, startWith } from "@most/core"
import { IntervalTime, pagingQuery } from "common-utils"
import { $IntermediatePromise, $Table, $infoLabel, IQuantumScrollPage, ISortBy } from "ui-components"
import * as viem from 'viem'
import { $card, $card2 } from "../../common/elements/$common.js"
import { $ProfilePeformanceTimeline } from "../../components/participant/$ProfilePeformanceTimeline.js"
import { IChangeMatchRule } from "../../components/portfolio/$TraderMatchRouteEditor.js"
import { entryColumn, pnlColumn, puppetsColumn, sizeColumn, timeColumn } from "../../components/table/$TableColumn.js"
import { IUserPositionPageParams } from "../type.js"


export const $TraderPage = (config: IUserPositionPageParams) => component((
  [changeRoute, changeRouteTether]: Behavior<any, string>,
  [scrollRequest, scrollRequestTether]: Behavior<IQuantumScrollPage>,
  [sortByChange, sortByChangeTether]: Behavior<ISortBy>,


  [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<any, IntervalTime>,
  [selectMarketTokenList, selectMarketTokenListTether]: Behavior<viem.Address[]>,

  [modifySubscribeList, modifySubscribeListTether]: Behavior<IChangeMatchRule>,
) => {

  const { activityTimeframe, selectedCollateralTokenList, positionListQuery } = config

  const sortBy = replayLatest(sortByChange, { direction: 'desc', selector: 'openTimestamp' } as const)

  const tableParams = map(async params => {
    const activityTimeframe = params.activityTimeframe
    const positionList = await params.positionListQuery

    return { positionList, sortBy: params.sortBy, activityTimeframe }
  }, combineObject({ sortBy, positionListQuery, activityTimeframe }))


  return [
    $column(layoutSheet.spacingBig)(
      $card(layoutSheet.spacingBig, style({ flex: 1, width: '100%' }))(
        $card2(style({ padding: 0, height: screenUtils.isDesktopScreen ? '200px' : '200px', position: 'relative', margin: screenUtils.isDesktopScreen ? `-36px -36px 0` : `-12px -12px 0px` }))(
          $ProfilePeformanceTimeline({ ...config })({
            selectMarketTokenList: selectMarketTokenListTether(),
            changeActivityTimeframe: changeActivityTimeframeTether(),
          })
        ),

        $IntermediatePromise({
          query: tableParams,
          $$done: map(params => {
            const list = params.positionList
            const paging = startWith({ offset: 0, pageSize: 20 }, scrollRequest)

            if (list.length === 0) {
              return $column(layoutSheet.spacingSmall)(
                $text('No active positions found'),
                $infoLabel(`Try changing the timeframe or selecting a different trade route`),
              )
            }

            const dataSource = map(pageParams => {
              return pagingQuery({ ...pageParams.paging, ...pageParams.sortBy }, list)
            }, combineObject({ sortBy, paging }))

            return $Table({
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
          })
        })({}),
      ),
    ),
    { changeRoute, changeActivityTimeframe, selectMarketTokenList, modifySubscribeList }
  ]
})


