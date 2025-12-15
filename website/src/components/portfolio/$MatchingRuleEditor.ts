import type { ISubscribeRule } from '@puppet/database/schema'
import { IntervalTime } from '@puppet/sdk/const'
import { formatFixed, getDuration, getTraderMatchingKey, getUnixTimestamp, parseBps } from '@puppet/sdk/core'
import {
  combine,
  empty,
  type IStream,
  just,
  map,
  merge,
  o,
  sampleMap,
  start,
  switchMap,
  toStream,
  zipMap
} from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $element, $node, $text, attr, component, style, stylePseudo } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { theme } from 'aelea/ui-components-theme'
import type { Address, Hex } from 'viem'
import { $Checkbox, $Dropdown, $FieldLabeled } from '@/ui-components'
import { uiStorage } from '@/ui-storage'
import { $labeledDivider } from '../../common/elements/$common.js'
import { localStore } from '../../const/localStore.js'
import { $ButtonSecondary } from '../form/$Button.js'

export type ISetMatchingRuleEditorDraft = Omit<ISubscribeRule, 'id' | 'blockTimestamp' | 'transactionHash'>

export type IMatchRuleEditor = {
  model?: ISubscribeRule
  traderMatchingKey: Hex
  collateralToken: Address
  trader: Address
  draftMatchingRuleList: IStream<ISetMatchingRuleEditorDraft[]>
}

export type InputStateParams<T> = {
  [P in keyof T]: IStream<T[P]> | T[P]
}

export type InputArrayParams<T extends any[]> = {
  [P in keyof T]: IStream<T[P]>
}

export function combineForm<A, K extends keyof A = keyof A>(state: InputStateParams<A>, defualtState: A): IStream<A> {
  const entries = Object.entries(state) as [keyof A, IStream<A[K]> | A[K]][]

  if (entries.length === 0) {
    return just({} as A)
  }

  const streams = entries.map(([key, stream]) => {
    return start(defualtState[key], toStream(stream))
  })

  const zipped = zipMap(
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
      [inputAllowance, inputAllowanceTether]: IBehavior<string | number, bigint>,
      [inputEndDate, inputEndDateTether]: IBehavior<string, bigint>,
      [changeActivityThrottle, changeActivityThrottleTether]: IBehavior<number, bigint>,
      [clickRemove, clickRemoveTether]: IBehavior<PointerEvent>,
      [changeAdvancedRouteEditorEnabled, changeAdvancedRouteEditorEnabledTether]: IBehavior<boolean>,
      [save, saveTether]: IBehavior<PointerEvent>
    ) => {
      const advancedRouteEditorEnabled = uiStorage.replayWrite(
        localStore.ruleEditor.advancedRouteEditorEnabled,
        changeAdvancedRouteEditorEnabled
      )

      const { model, traderMatchingKey, draftMatchingRuleList, collateralToken, trader } = config

      const defaultDraft = {
        allowanceRate: 1000n,
        throttleActivity: BigInt(IntervalTime.HR),
        expiry: BigInt(getUnixTimestamp() + IntervalTime.YEAR)
      }

      const allowanceRate = model ? start(model.allowanceRate, inputAllowance) : inputAllowance
      const throttleActivity = model ? start(model.throttleActivity, changeActivityThrottle) : changeActivityThrottle
      const expiry = model ? start(model.expiry, inputEndDate) : inputEndDate
      const draft = combineForm({ allowanceRate, throttleActivity, expiry }, defaultDraft)

      const isSubscribed = model && model.expiry > BigInt(getUnixTimestamp())

      return [
        $column(spacing.default, style({ maxWidth: '350px' }))(
          $text('The following rules will apply to this trader whenever he opens and maintain a position'),

          $FieldLabeled({
            label: 'Allocate %',
            value: map(x => (x ? `${formatFixed(4, x) * 100}` : ''), allowanceRate),
            placeholder: `${formatFixed(4, defaultDraft.allowanceRate) * 100}`,
            labelWidth: 150,
            hint: '% Taken from deposited balance every match. lower values reduces risk and allow greater monitoring'
          })({
            change: inputAllowanceTether(map(x => parseBps(Number(x) / 100)))
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
            switchMap(isEnabled => {
              if (!isEnabled) {
                return empty
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
                  value: map(time => {
                    return new Date(Number(time * 1000n)).toISOString().slice(0, 10)
                  }, expiry)
                })({
                  change: inputEndDateTether(
                    map(date => {
                      const parsed = Date.parse(date)
                      return parsed ? BigInt(Math.floor(parsed / 1000)) : BigInt(0)
                    })
                  )
                }),

                $Dropdown({
                  $anchor: $FieldLabeled({
                    label: 'Activity throttle',
                    value: map(o(Number, getDuration), throttleActivity),
                    placeholder: getDuration(Number(model?.throttleActivity || defaultDraft.throttleActivity)),
                    labelWidth: 150,
                    hint: 'Ignore positions that are too close to each other in time'
                  })({}),
                  $container: $row(style({ right: '0', position: 'relative' })),
                  $$option: map(tf => {
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
              disabled: just(!isSubscribed)
            })({
              click: clickRemoveTether()
            }),

            $ButtonSecondary({
              $content: $text('Copy'),
              disabled: map(params => !params.allowanceRate, draft)
            })({
              click: saveTether()
            })
          )
        ),

        {
          changeMatchRuleList: merge(
            sampleMap(
              params => {
                const modelIndex = params.draftMatchingRuleList.findIndex(
                  x => getTraderMatchingKey(x.collateralToken, x.trader) === traderMatchingKey
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
              combine({ draftMatchingRuleList, draft }),
              save
            ),
            sampleMap(
              params => {
                const match = params.draftMatchingRuleList.find(
                  x => getTraderMatchingKey(x.collateralToken, x.trader) === traderMatchingKey
                )

                if (match) {
                  const modelIndex = params.draftMatchingRuleList.findIndex(
                    x => getTraderMatchingKey(x.collateralToken, x.trader) === traderMatchingKey
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
              combine({ draftMatchingRuleList, draft }),
              clickRemove
            )
          )
        }
      ]
    }
  )
