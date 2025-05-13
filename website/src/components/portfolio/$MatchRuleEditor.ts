import { empty, map, mergeArray, now, sample, snapshot, startWith } from '@most/core'
import type { Stream } from '@most/types'
import { IntervalTime } from '@puppet/middleware/const'
import { $Checkbox, $FieldLabeled, Optional } from '@puppet/middleware/ui-components'
import { uiStorage } from '@puppet/middleware/ui-storage'
import { formatFixed, getDuration, parseBps, unixTimestampNow } from '@puppet/middleware/utils'
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
  stylePseudo,
  switchMap
} from 'aelea/core'
import { $column, $row, spacing } from 'aelea/ui-components'
import { theme } from 'aelea/ui-components-theme'
import type { Address, Hex, Prettify } from 'viem'
import type { IMatchingRule } from '../../__generated__/ponder.types.js'
import { $labeledDivider } from '../../common/elements/$common.js'
import { localStore } from '../../const/localStore.js'
import { $ButtonSecondary } from '../form/$Button.js'
import { $Dropdown, $defaultSelectContainer } from '../form/$Dropdown.js'

export interface IMatchingRuleEditorChange {
  model: Prettify<Partial<IMatchingRule>>
  matchingKey: Hex
  collateralToken: Address
  trader: Address
}

export type IMatchRuleEditor = {
  matchingRule?: IMatchingRule
  matchingKey: Hex
  collateralToken: Address
  trader: Address
}

export const $MatchRuleEditor = (config: IMatchRuleEditor) =>
  component(
    (
      [inputEndDate, inputEndDateTether]: IBehavior<any, bigint>,
      [inputAllowance, inputAllowanceTether]: IBehavior<any, bigint>,
      [clickRemove, clickRemoveTether]: IBehavior<any, IMatchingRuleEditorChange>,
      [changeActivityThrottle, changeActivityThrottleTether]: IBehavior<number, bigint>,
      [changeAdvancedRouteEditorEnabled, changeAdvancedRouteEditorEnabledTether]: IBehavior<boolean>,
      [saveMatchRule, saveMatchRuleTether]: IBehavior<PointerEvent, IMatchingRuleEditorChange>
    ) => {
      const advancedRouteEditorEnabled = uiStorage.replayWrite(
        localStore.ruleEditor,
        changeAdvancedRouteEditorEnabled,
        'advancedRouteEditorEnabled'
      )

      const { matchingRule, matchingKey, collateralToken, trader } = config

      const placeholderForm = {
        allowanceRate: BigInt(1000),
        throttleActivity: BigInt(IntervalTime.HR),
        expiry: BigInt(unixTimestampNow() + IntervalTime.YEAR)
      }

      const change = combineState({
        matchingKey: now(matchingKey),
        allowanceRate: startWith(matchingRule?.allowanceRate || placeholderForm.allowanceRate, inputAllowance),
        throttleActivity: startWith(
          matchingRule?.throttleActivity || placeholderForm.throttleActivity,
          changeActivityThrottle
        ),
        expiry: startWith(matchingRule?.expiry || placeholderForm.expiry, inputEndDate)
      })

      const isSubscribed = matchingRule && matchingRule.expiry > BigInt(unixTimestampNow())

      return [
        $column(spacing.default, style({ maxWidth: '350px' }))(
          $text('The following rules will apply to this trader whenever he opens and maintain a position'),

          $FieldLabeled({
            label: 'Allocate %',
            value: mergeArray([
              matchingRule?.allowanceRate && matchingRule.allowanceRate !== placeholderForm.allowanceRate
                ? now(matchingRule.allowanceRate)
                : empty(),
              map((x) => (x ? `${formatFixed(4, x) * 100}` : ''), inputAllowance)
            ]),
            placeholder: `${formatFixed(4, matchingRule?.allowanceRate || placeholderForm.allowanceRate) * 100}`,
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
                  placeholder: getDuration(Number(matchingRule?.throttleActivity || placeholderForm.throttleActivity)),
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
              disabled: map((params) => !params.allowanceRate, change)
            })({
              click: saveMatchRuleTether()
            })
          )
        ),

        {
          save: snapshot(
            (draft): IMatchingRuleEditorChange => ({ collateralToken, trader, matchingKey, model: draft }),
            change,
            saveMatchRule
          ),
          remove: snapshot(
            (draft): IMatchingRuleEditorChange => ({
              matchingKey,
              collateralToken,
              trader,
              model: { ...draft, expiry: 0n }
            }),
            change,
            clickRemove
          )
        }
      ]
    }
  )
