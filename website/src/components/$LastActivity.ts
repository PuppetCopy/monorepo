import { map } from '@most/core'
import type { Stream } from '@most/types'
import { IntervalTime } from '@puppet/middleware/const'
import { $ButtonToggle } from '@puppet/middleware/ui-components'
import type { IBehavior } from 'aelea/core'
import { $text, component, style } from 'aelea/core'
import { $row, spacing } from 'aelea/ui-components'

export const lastActivityOptionList = [
  {
    value: IntervalTime.DAY,
    label: '24h'
  },
  {
    value: IntervalTime.WEEK,
    label: '7d'
  },
  {
    value: IntervalTime.MONTH,
    label: '28d'
  },
  {
    value: IntervalTime.YEAR,
    label: '14w'
  }
]

export const $LastAtivity = (activityTimeframe: Stream<IntervalTime>) =>
  component(([changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<any, IntervalTime>) => {
    return [
      $row(
        spacing.default,
        style({ alignItems: 'center' })
      )(
        // $infoTooltipLabel('Open and Settled position filtered from the time they were opened', 'Last Activity:'),
        $ButtonToggle({
          value: activityTimeframe,
          optionList: lastActivityOptionList.map((option) => option.value),
          $$option: map((value) => {
            return $row(
              spacing.small,
              style({ alignItems: 'center' })
            )($text(lastActivityOptionList.find((option) => option.value === value)?.label!))
          })
        })({
          select: changeActivityTimeframeTether()
        })
        // $Dropdown({
        //   $selection: switchMap((tf) => {
        //     const selectedOption = lastActivityOptionList.find((option) => option.value === tf)
        //     return $node($text(selectedOption?.label!))
        //   }, activityTimeframe),
        //   optionList: lastActivityOptionList,
        //   $$option: map((option) => {
        //     return $node($text(String(option.label)))
        //   })
        // })({
        //   select: changeActivityTimeframeTether(map((option) => option.value))
        // })
      ),
      { changeActivityTimeframe }
    ]
  })
