import { empty, map } from '@most/core'
import type { Stream } from '@most/types'
import { IntervalTime } from '@puppet-copy/middleware/const'
import { $caretDown, $icon, $infoLabel } from '@puppet-copy/middleware/ui-components'
import type { IBehavior } from 'aelea/core'
import { $node, $text, component, style } from 'aelea/core'
import { $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { $Dropdown } from './form/$Dropdown'

export const lastActivityOptionList = [
  {
    value: IntervalTime.DAY,
    label: '24 Hours'
  },
  {
    value: IntervalTime.WEEK,
    label: '7 Days'
  },
  {
    value: IntervalTime.MONTH,
    label: '30 Days'
  },
  {
    value: IntervalTime.YEAR,
    label: '1 Year'
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
        // isDesktopScreen
        // isDesktopScreen
        //   ? $ButtonToggle({
        //       value: activityTimeframe,
        //       optionList: lastActivityOptionList.map((option) => option.value),
        //       $$option: map((value) => {
        //         return $row(
        //           spacing.small,
        //           style({ alignItems: 'center' })
        //         )($text(lastActivityOptionList.find((option) => option.value === value)?.label!))
        //       })
        //     })({
        //       select: changeActivityTimeframeTether()
        //     })
        //   :
        $Dropdown({
          $anchor: $row(
            $node(style({ whiteSpace: 'nowrap', padding: '12px 0px 12px 18px' }))(
              $row(spacing.tiny)(
                isDesktopScreen ? $infoLabel($text('Last Activity:')) : empty(),
                $text(
                  map((tf) => {
                    const selectedOption = lastActivityOptionList.find((option) => option.value === tf)
                    return selectedOption?.label!
                  }, activityTimeframe)
                )
              )
            ),
            $row(style({ alignItems: 'center', cursor: 'pointer', padding: '12px 18px', flex: '1' }))(
              $icon({
                $content: $caretDown,
                width: '12px',
                svgOps: style({ minWidth: '12px', margin: '2px 1px 0' }),
                viewBox: '0 0 32 32'
              })
            )
          ),
          optionList: lastActivityOptionList,
          $$option: map((option) => {
            return $node($text(String(option.label)))
          })
        })({
          select: changeActivityTimeframeTether(map((option) => option.value))
        })
      ),
      { changeActivityTimeframe }
    ]
  })
