import { empty, map, mergeArray, now, snapshot, startWith } from '@most/core'
import type { Stream } from '@most/types'
import { IntervalTime } from '@puppet-copy/middleware/const'
import { formatFixed, getDuration, parseBps, unixTimestampNow } from '@puppet-copy/middleware/core'
import { $Checkbox, $FieldLabeled } from '@puppet-copy/middleware/ui-components'
import { uiStorage } from '@puppet-copy/middleware/ui-storage'
import type { ISetMatchingRule } from '@puppet-copy/sql/schema'
import {
  $element,
  $node,
  $text,
  attr,
  combineArray,
  combineState,
  component,
  type IBehavior,
  O,
  style,
  stylePseudo,
  switchMap,
  toStream
} from 'aelea/core'
import { $column, $row, spacing } from 'aelea/ui-components'
import { theme } from 'aelea/ui-components-theme'
import type { Address, Hex } from 'viem'
import { $labeledDivider } from '../../common/elements/$common.js'
import { localStore } from '../../const/localStore.js'
import { $ButtonSecondary } from '../form/$Button.js'
import { $Dropdown } from '../form/$Dropdown.js'

export type ISetMatchingRuleEditorDraft = Omit<ISetMatchingRule, 'id'>

export type IMatchRuleEditor = {
  model?: ISetMatchingRule
  traderMatchingKey: Hex
  collateralToken: Address
  trader: Address
  draftMatchingRuleList: Stream<ISetMatchingRuleEditorDraft[]>
}

export type InputStateParams<T> = {
  [P in keyof T]: Stream<T[P]> | T[P]
}

export type InputArrayParams<T extends any[]> = {
  [P in keyof T]: Stream<T[P]>
}

export function combineForm<A, K extends keyof A = keyof A>(state: InputStateParams<A>, defualtState: A): Stream<A> {
  const entries = Object.entries(state) as [keyof A, Stream<A[K]> | A[K]][]

  if (entries.length === 0) {
    return now({} as A)
  }

  const streams = entries.map(([key, stream]) => {
    return startWith(defualtState[key], toStream(stream))
  })

  const zipped = combineArray(
    (...arrgs: A[K][]) => {
      return arrgs.reduce((seed, val, idx) => {
        const key = entries[idx][0]
        seed[key] = val

        return seed
      }, {} as A)
    },
    ...streams
  )

  return zipped
}

export const $MatchingRuleEditor = (config: IMatchRuleEditor) =>
  component(
    (
      [inputAllowance, inputAllowanceTether]: IBehavior<any, bigint>,
      [inputEndDate, inputEndDateTether]: IBehavior<string, bigint>,
      [changeActivityThrottle, changeActivityThrottleTether]: IBehavior<number, bigint>,
      [clickRemove, clickRemoveTether]: IBehavior<any, ISetMatchingRuleEditorDraft>,
      [changeAdvancedRouteEditorEnabled, changeAdvancedRouteEditorEnabledTether]: IBehavior<boolean>,
      [save, saveTether]: IBehavior<PointerEvent, ISetMatchingRuleEditorDraft>
    ) => {
      const advancedRouteEditorEnabled = uiStorage.replayWrite(
        localStore.ruleEditor,
        changeAdvancedRouteEditorEnabled,
        'advancedRouteEditorEnabled'
      )

      const { model, traderMatchingKey, draftMatchingRuleList, collateralToken, trader } = config

      const defaultDraft = {
        allowanceRate: BigInt(1000),
        throttleActivity: BigInt(IntervalTime.HR),
        expiry: BigInt(unixTimestampNow() + IntervalTime.YEAR)
      }

      const allowanceRate = model ? startWith(model.allowanceRate, inputAllowance) : inputAllowance
      const throttleActivity = model
        ? startWith(model.throttleActivity, changeActivityThrottle)
        : changeActivityThrottle
      const expiry = model ? startWith(model.expiry, inputEndDate) : inputEndDate
      const draft = combineForm({ allowanceRate, throttleActivity, expiry }, defaultDraft)

      const isSubscribed = model && model.expiry > BigInt(unixTimestampNow())

      return [
        $column(spacing.default, style({ maxWidth: '350px' }))(
          $text('The following rules will apply to this trader whenever he opens and maintain a position'),

          $FieldLabeled({
            label: 'Allocate %',
            value: map((x) => (x ? `${formatFixed(4, x) * 100}` : ''), allowanceRate),
            placeholder: `${formatFixed(4, defaultDraft.allowanceRate) * 100}`,
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

          $row(
            switchMap((isEnabled) => {
              if (!isEnabled) {
                return empty()
              }

              return $column(spacing.default)(
                $FieldLabeled({
                  label: 'Expiration',
                  labelWidth: 150,
                  $input: $element('input')(
                    attr({
                      type: 'date',
                      value: new Date(Number(defaultDraft.expiry * 1000n)).toISOString().slice(0, 10)
                    }),
                    stylePseudo('::-webkit-calendar-picker-indicator', {
                      filter: theme.name === 'dark' ? 'invert(1)' : ''
                    })
                  ),
                  hint: 'set a date when this rule will expire, default is 1 year',
                  value: map((time) => {
                    return new Date(Number(time * 1000n)).toISOString().slice(0, 10)
                  }, expiry)
                })({
                  change: inputEndDateTether(
                    map((date) => {
                      const parsed = Date.parse(date)
                      return parsed ? BigInt(Math.floor(parsed / 1000)) : BigInt(0)
                    })
                  )
                }),

                $Dropdown({
                  $anchor: $FieldLabeled({
                    label: 'Activity throttle',
                    value: map(O(Number, getDuration), throttleActivity),
                    placeholder: getDuration(Number(model?.throttleActivity || defaultDraft.throttleActivity)),
                    labelWidth: 150,
                    hint: 'Ignore positions that are too close to each other in time'
                  })({}),
                  $container: $row(style({ right: '0', position: 'relative' })),
                  $$option: map((tf) => {
                    return $node($text(getDuration(Number(tf))))
                  }),
                  optionList: [IntervalTime.HR, IntervalTime.HR2, IntervalTime.HR6, IntervalTime.DAY, IntervalTime.WEEK]
                })({
                  select: changeActivityThrottleTether(map(BigInt))
                })
              )
            }, advancedRouteEditorEnabled)
          ),

          $node(),

          $row(style({ placeContent: 'space-between', alignItems: 'center' }))(
            $ButtonSecondary({
              $content: $text('Remove'),
              disabled: now(!isSubscribed)
            })({
              click: clickRemoveTether()
            }),

            $ButtonSecondary({
              $content: $text('Copy'),
              disabled: map((params) => !params.allowanceRate, draft)
            })({
              click: saveTether()
            })
          )
        ),

        {
          changeMatchRuleList: mergeArray([
            snapshot(
              (params) => {
                const modelIndex = params.draftMatchingRuleList.findIndex(
                  (x) => x.traderMatchingKey === traderMatchingKey
                )
                const model = modelIndex > -1 ? params.draftMatchingRuleList[modelIndex] : undefined

                if (model) {
                  params.draftMatchingRuleList[modelIndex] = {
                    ...defaultDraft,
                    ...model,
                    ...params.draft
                  }

                  return [...params.draftMatchingRuleList]
                }

                return [
                  ...params.draftMatchingRuleList,
                  {
                    traderMatchingKey,
                    collateralToken,
                    trader,
                    ...params.draft
                  }
                ]
              },
              combineState({ draftMatchingRuleList, draft }),
              save
            ),
            snapshot(
              (params) => {
                const match = params.draftMatchingRuleList.find((x) => x.traderMatchingKey === traderMatchingKey)

                if (match) {
                  const modelIndex = params.draftMatchingRuleList.findIndex(
                    (x) => x.traderMatchingKey === traderMatchingKey
                  )
                  params.draftMatchingRuleList[modelIndex] = {
                    ...match,
                    expiry: 0n
                  }

                  return [...params.draftMatchingRuleList]
                }

                return [
                  ...params.draftMatchingRuleList,
                  {
                    traderMatchingKey,
                    collateralToken,
                    trader,
                    ...params.draft,
                    expiry: 0n
                  }
                ]
              },
              combineState({ draftMatchingRuleList, draft }),
              clickRemove
            )
          ])
        }
      ]
    }
  )
