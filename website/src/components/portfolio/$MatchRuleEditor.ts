import { empty, map, now, sample, snapshot, startWith } from '@most/core'
import type { Stream } from '@most/types'
import { IntervalTime } from '@puppet/middleware/const'
import type { IMatchRule } from '@puppet/middleware/core'
import { $Checkbox, $FieldLabeled } from '@puppet/middleware/ui-components'
import { uiStorage } from '@puppet/middleware/ui-storage'
import { formatFixed, getDuration, parseBps, switchMap, unixTimestampNow } from '@puppet/middleware/utils'
import {
  $element,
  $node,
  $text,
  attr,
  combineState,
  component,
  type IBehavior,
  O,
  style,
  stylePseudo
} from 'aelea/core'
import { $column, $row, layoutSheet, spacing } from 'aelea/ui-components'
import { theme } from 'aelea/ui-components-theme'
import { $labeledDivider } from '../../common/elements/$common.js'
import { localStore } from '../../const/localStore.js'
import { $ButtonSecondary } from '../form/$Button.js'
import { $Dropdown, $defaultSelectContainer } from '../form/$Dropdown.js'

export type IMatchingRule = {
  puppet: `0x${string}`
  allowanceRate: bigint
  throttleActivity: bigint
  expiry: bigint
}

export interface IDraftMatchRule {
  expiry: bigint
  allowanceRate: bigint
  throttleActivity: bigint
}

export const $MatchRuleEditor = (matchRule: IMatchingRule | undefined) =>
  component(
    (
      [inputEndDate, inputEndDateTether]: IBehavior<any, bigint>,
      [inputAllowance, inputAllowanceTether]: IBehavior<any, bigint>,
      [clickRemove, clickRemoveTether]: IBehavior<any, IDraftMatchRule>,
      [changeActivityThrottle, changeActivityThrottleTether]: IBehavior<number, bigint>,
      [changeAdvancedRouteEditorEnabled, changeAdvancedRouteEditorEnabledTether]: IBehavior<boolean>,
      [saveMatchRule, saveMatchRuleTether]: IBehavior<PointerEvent, IDraftMatchRule>
    ) => {
      const advancedRouteEditorEnabled = uiStorage.replayWrite(
        localStore.ruleEditor,
        changeAdvancedRouteEditorEnabled,
        'advancedRouteEditorEnabled'
      )

      const draft: Stream<IDraftMatchRule> = combineState({
        allowanceRate: startWith(matchRule?.allowanceRate || BigInt(1000), inputAllowance),
        throttleActivity: startWith(matchRule?.throttleActivity || BigInt(IntervalTime.HR), changeActivityThrottle),
        expiry: startWith(matchRule?.expiry || BigInt(unixTimestampNow() + IntervalTime.YEAR), inputEndDate)
      })

      const isSubscribed = matchRule && matchRule.expiry > BigInt(unixTimestampNow())

      return [
        $column(spacing.default, style({ maxWidth: '350px' }))(
          $text('The following rules will apply to this trader whenever he opens and maintain a position'),

          $FieldLabeled({
            label: 'Allocate %',
            value: map((x) => (x ? `${formatFixed(4, x) * 100}` : ''), inputAllowance),
            placeholder: `${formatFixed(4, matchRule?.allowanceRate || BigInt(1000)) * 100}`,
            labelWidth: 150,
            hint: '% Taken from deposited balance every match. lower values reduces risk and allow greater monitoring'
          })({
            change: inputAllowanceTether(map((x) => parseBps(x / 100)))
          }),

          style({ margin: '10px 0' })(
            $labeledDivider(
              $Checkbox({
                value: advancedRouteEditorEnabled,
                label: 'Advanced Rules'
                // validation: now(true),
              })({
                check: changeAdvancedRouteEditorEnabledTether()
              })
            )
          ),

          switchMap((isEnabled) => {
            if (!isEnabled) {
              return empty()
            }

            return $column(spacing.default)(
              $Dropdown({
                $selection: $FieldLabeled({
                  label: 'Activity throttle',
                  value: map(O(Number, getDuration), changeActivityThrottle),
                  placeholder: getDuration(Number(matchRule?.throttleActivity || BigInt(IntervalTime.HR))),
                  labelWidth: 150,
                  hint: 'Ignore positions that are too close to each other in time'
                })({}),
                selector: {
                  value: now(3600),
                  $container: $defaultSelectContainer(style({ right: '0' })),
                  $$option: map((option) => {
                    return $node($text(getDuration(Number(option))))
                  }),
                  list: [IntervalTime.HR, IntervalTime.HR2, IntervalTime.HR6, IntervalTime.DAY, IntervalTime.WEEK]
                }
              })({
                select: changeActivityThrottleTether(map(BigInt))
              }),

              $FieldLabeled({
                label: 'Expiration',
                labelWidth: 150,
                $input: $element('input')(
                  attr({ type: 'date' }),
                  stylePseudo('::-webkit-calendar-picker-indicator', {
                    filter: theme.name === 'dark' ? 'invert(1)' : ''
                  })
                ),
                hint: 'set a date when this rule will expire, default is 1 year',
                placeholder: 'never',
                value: map((time) => {
                  return new Date(Number(time * 1000n)).toISOString().slice(0, 10)
                }, inputEndDate)
              })({
                change: inputEndDateTether()
              })
            )
          }, advancedRouteEditorEnabled),

          $node(),

          $row(style({ placeContent: 'space-between', alignItems: 'center' }))(
            $ButtonSecondary({
              $content: $text('Remove'),
              disabled: now(!isSubscribed)
            })({
              click: clickRemoveTether()
            }),

            $ButtonSecondary({
              $content: $text('Subscribe'),
              disabled: map((params) => !params.allowanceRate, draft)
            })({
              click: saveMatchRuleTether()
            })
          )
        ),

        {
          save: sample(draft, saveMatchRule),
          remove: snapshot((draft): IDraftMatchRule => ({ ...draft, expiry: 0n }), draft, clickRemove)
        }
      ]
    }
  )
