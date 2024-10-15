import { $text, component, nodeEvent, style, styleBehavior } from "@aelea/dom"
import { $row, layoutSheet } from "@aelea/ui-components"
import { pallete } from "@aelea/ui-components-theme"
import { constant, map } from "@most/core"
import { $anchor, $infoTooltipLabel } from "ui-components"
import * as store from "../const/localStore.js"
import { Behavior } from "@aelea/core"
import * as GMX from "gmx-middleware-const"
import { Stream } from "@most/types"
import { IntervalTime } from "common-utils"


export const LAST_ACTIVITY_LABEL_MAP = {
  [IntervalTime.DAY]: '24h',
  [IntervalTime.WEEK]: '7d',
  [IntervalTime.MONTH]: '28d',
  [IntervalTime.YEAR]: '14w',
}

export const $LastAtivity = (activityTimeframe: Stream<IntervalTime>) => component((
  [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<any, IntervalTime>,
) => {
  
  const options = Object.entries(LAST_ACTIVITY_LABEL_MAP)

  return [

    $row(layoutSheet.spacing, style({ alignItems: 'center' }))(
      $infoTooltipLabel('Open and Settled position filtered from the time they were opened', 'Last Activity:'),
      $row(layoutSheet.spacing)(
        ...options.map(([interval, label]) => {
          return $anchor(
            styleBehavior(map(tf => tf === Number(interval) ? ({ color: pallete.primary }) : null, activityTimeframe)),
            changeActivityTimeframeTether(nodeEvent('click'), constant(Number(interval)))
          )(
            $text(label)
          )
        }),
      ),
    ),


    { changeActivityTimeframe }
  ]
})