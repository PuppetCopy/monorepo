import { constant, map } from '@most/core'
import type { Stream } from '@most/types'
import { IntervalTime } from '@puppet/middleware/const'
import { $anchor, $infoTooltipLabel } from '@puppet/middleware/ui-components'
import type { IBehavior } from 'aelea/core'
import { $text, component, nodeEvent, style, styleBehavior } from 'aelea/core'
import { $row, layoutSheet } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'

export const LAST_ACTIVITY_LABEL_MAP = {
  [IntervalTime.DAY]: '24h',
  [IntervalTime.WEEK]: '7d',
  [IntervalTime.MONTH]: '28d',
  [IntervalTime.YEAR]: '14w'
}

export const $LastAtivity = (activityTimeframe: Stream<IntervalTime>) =>
  component(([changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<any, IntervalTime>) => {
    const options = Object.entries(LAST_ACTIVITY_LABEL_MAP)

    return [
      $row(spacing.default, style({ alignItems: 'center' }))(
        $infoTooltipLabel('Open and Settled position filtered from the time they were opened', 'Last Activity:'),
        $row(spacing.default)(
          ...options.map(([interval, label]) => {
            return $anchor(
              styleBehavior(
                map((tf) => (tf === Number(interval) ? { color: pallete.primary } : null), activityTimeframe)
              ),
              changeActivityTimeframeTether(nodeEvent('click'), constant(Number(interval)))
            )($text(label))
          })
        )
      ),

      { changeActivityTimeframe }
    ]
  })
