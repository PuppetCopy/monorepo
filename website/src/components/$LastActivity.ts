import { IntervalTime, PLATFORM_STAT_INTERVAL } from '@puppet/sdk/const'
import { getMappedValue } from '@puppet/sdk/core'
import { type IStream, map } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { $DropSelect } from '@/ui-components'

export const activityOptionLabelMap = {
  [IntervalTime.DAY]: '24 Hours',
  [IntervalTime.WEEK]: '7 Days',
  [IntervalTime.MONTH]: '30 Days',
  [IntervalTime.QUARTER]: '90 Days',
  [IntervalTime.YEAR]: '1 Year'
} as const

export const $LastAtivity = (activityTimeframe: IStream<IntervalTime>) =>
  component(([changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<IntervalTime>) => {
    return [
      $row(
        spacing.default,
        style({ alignItems: 'center' })
      )(
        $DropSelect({
          value: activityTimeframe,
          optionList: PLATFORM_STAT_INTERVAL,
          label: isDesktopScreen ? 'Last Activity:' : undefined,
          $$option: map(tf => $node($text(getMappedValue(activityOptionLabelMap, tf))))
        })({ select: changeActivityTimeframeTether() })
      ),
      { changeActivityTimeframe }
    ]
  })
