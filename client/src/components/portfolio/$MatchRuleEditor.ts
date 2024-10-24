import { Behavior, combineObject, O } from "@aelea/core"
import { $element, $node, $text, attr, component, style, stylePseudo } from "@aelea/dom"
import { $column, $row, layoutSheet } from "@aelea/ui-components"
import { empty, map, now, sample, snapshot, startWith } from "@most/core"
import { formatFixed, getDuration, parseBps, switchMap, unixTimestampNow } from "common-utils"
import { IMatchRule } from "puppet-middleware"
import { $Checkbox, $FieldLabeled } from "ui-components"
import { uiStorage } from "ui-storage"
import { theme } from "../../assignThemeSync.js"
import { $labeledDivider } from "../../common/elements/$common.js"
import localStore from "../../const/localStore.js"
import { $ButtonSecondary } from "../form/$Button.js"
import { $defaultSelectContainer, $Dropdown } from "../form/$Dropdown.js"
import { Stream } from "@most/types"
import * as viem from "viem"
import { IntervalTime } from "puppet-const"


export interface IDraftMatchRule {
  expiry: bigint
  allowanceRate: bigint
  throttleActivity: bigint
}

export interface IMatchRuleEditorChange {
  value: IDraftMatchRule
  trader: viem.Address
  collateralToken: viem.Address
  matchRule?: IMatchRule
}


export const $MatchRuleEditor = (matchRule: IMatchRule | undefined) => component((
  [inputEndDate, inputEndDateTether]: Behavior<any, bigint>,
  [inputAllowance, inputAllowanceTether]: Behavior<any, bigint>,
  [clickRemove, clickRemoveTether]: Behavior<any, IDraftMatchRule>,
  [changeActivityThrottle, changeActivityThrottleTether]: Behavior<number, bigint>,
  [changeAdvancedRouteEditorEnabled, changeAdvancedRouteEditorEnabledTether]: Behavior<boolean>,
  [saveMatchRule, saveMatchRuleTether]: Behavior<PointerEvent, IDraftMatchRule>,
) => {

  const advancedRouteEditorEnabled = uiStorage.replayWrite(localStore.ruleEditor, changeAdvancedRouteEditorEnabled, 'advancedRouteEditorEnabled')

  const draft: Stream<IDraftMatchRule> = combineObject({
    allowanceRate: startWith(matchRule?.allowanceRate || BigInt(1000), inputAllowance),
    throttleActivity: startWith(matchRule?.throttleActivity || BigInt(IntervalTime.HR), changeActivityThrottle),
    expiry: startWith(matchRule?.expiry || BigInt(unixTimestampNow() + IntervalTime.YEAR), inputEndDate),
  })

  const isSubscribed = matchRule && matchRule.expiry > BigInt(unixTimestampNow())

  return [
    $column(layoutSheet.spacing, style({ maxWidth: '350px' }))(
      $text('The following rules will apply to this trader whenever he opens and maintain a position'),

      $FieldLabeled({
        label: 'Match Allocation %',
        value: map(x => x ? `${formatFixed(4, x) * 100}` : '', inputAllowance),
        placeholder: `${formatFixed(4, matchRule?.allowanceRate || BigInt(1000)) * 100}`,
        labelWidth: 150,
        hint: `% Taken from deposited balance every match. lower values reduces risk and allow greater monitoring`,
      })({
        change: inputAllowanceTether(
          map(x => parseBps(x / 100))
        )
      }),

      style({ margin: '10px 0' })(
        $labeledDivider(
          $Checkbox({
            value: advancedRouteEditorEnabled,
            label: 'Advanced Rules',
            // validation: now(true),
          })({
            check: changeAdvancedRouteEditorEnabledTether()
          }),
        )
      ),

      switchMap(isEnabled => {

        if (!isEnabled) {
          return empty()
        }

        return $column(layoutSheet.spacing)(

          $Dropdown({
            $selection: $FieldLabeled({
              label: 'Activity throttle',
              value: map(O(Number, getDuration), changeActivityThrottle),
              placeholder: getDuration(Number(matchRule?.throttleActivity || BigInt(IntervalTime.HR))),
              labelWidth: 150,
              hint: `Ignore positions that are too close to each other in time`,
            })({
            }),
            selector: {
              value: now(3600),
              $container: $defaultSelectContainer(style({ right: '0' })),
              $$option: map(option => {
                return $text(getDuration(Number(option)))
              }),
              list: [
                IntervalTime.HR,
                IntervalTime.HR2,
                IntervalTime.HR6,
                IntervalTime.DAY,
                IntervalTime.WEEK
              ]
            }
          })(({
            select: changeActivityThrottleTether(map(BigInt))
          })),

          $FieldLabeled({
            label: 'Expiration',
            labelWidth: 150,
            $input: $element('input')(
              attr({ type: 'date' }),
              stylePseudo('::-webkit-calendar-picker-indicator', { filter: theme.name === 'dark' ? `invert(1)` : '' })
            ),
            hint: 'set a date when this rule will expire, default is 1 year',
            placeholder: 'never',
            value: map(time => {
              return new Date(Number(time * 1000n)).toISOString().slice(0, 10)
            }, inputEndDate),
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
          disabled: map(params => !params.allowanceRate, draft)
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
})

