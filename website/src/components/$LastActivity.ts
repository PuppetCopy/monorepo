import { IntervalTime, PLATFORM_STAT_INTERVAL } from '@puppet-copy/middleware/const'
import { getMappedValue } from '@puppet-copy/middleware/core'
import { $caretDown, $icon, $infoLabel } from '@puppet-copy/middleware/ui-components'
import { $node, $text, component, style } from 'aelea/core'
import { empty, type IBehavior, type IStream, map } from 'aelea/stream'
import { $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { $Dropdown } from './form/$Dropdown'

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
                isDesktopScreen ? $infoLabel($text('Last Activity:')) : empty,
                $text(map(tf => getMappedValue(activityOptionLabelMap, tf), activityTimeframe))
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
          optionList: PLATFORM_STAT_INTERVAL,
          $$option: map(option => {
            return $node($text(activityOptionLabelMap[option]))
          })
        })({
          select: changeActivityTimeframeTether()
        })
      ),
      { changeActivityTimeframe }
    ]
  })
