import { empty, map, mergeArray, now, snapshot, startWith } from '@most/core'
import type { Stream } from '@most/types'
import { IntervalTime } from '@puppet-copy/middleware/const'
import { $Checkbox, $FieldLabeled } from '@puppet-copy/middleware/ui-components'
import { uiStorage } from '@puppet-copy/middleware/ui-storage'
import { formatFixed, getDuration, parseBps, unixTimestampNow } from '@puppet-copy/middleware/utils'
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
import type { Address, Hex } from 'viem'
import type { IMatchingRule } from '../../__generated__/ponder.types.js'
import { $labeledDivider } from '../../common/elements/$common.js'
import { localStore } from '../../const/localStore.js'
import { $ButtonSecondary } from '../form/$Button.js'
import { $Dropdown, $defaultSelectContainer } from '../form/$Dropdown.js'

export interface IMatchingRuleEditorDraft {
  allowanceRate: bigint
  throttleActivity: bigint
  expiry: bigint
  traderMatchingKey: Hex
  collateralToken: Address
  trader: Address
  model?: IMatchingRule
}

export type IMatchRuleEditor = {
  model?: IMatchingRule
  traderMatchingKey: Hex
  collateralToken: Address
  trader: Address
  draftMatchingRuleList: Stream<IMatchingRuleEditorDraft[]>
}

// TODO: decouple list handling from editor
export const $MatchRuleEditor = (config: IMatchRuleEditor) =>
  component(
    (
      [inputEndDate, inputEndDateTether]: IBehavior<any, bigint>,
      [inputAllowance, inputAllowanceTether]: IBehavior<any, bigint>,
      [clickRemove, clickRemoveTether]: IBehavior<any, IMatchingRuleEditorDraft>,
      [changeActivityThrottle, changeActivityThrottleTether]: IBehavior<number, bigint>,
      [changeAdvancedRouteEditorEnabled, changeAdvancedRouteEditorEnabledTether]: IBehavior<boolean>,
      [save, saveTether]: IBehavior<PointerEvent, IMatchingRuleEditorDraft>
    ) => {
      const advancedRouteEditorEnabled = uiStorage.replayWrite(
        localStore.ruleEditor,
        changeAdvancedRouteEditorEnabled,
        'advancedRouteEditorEnabled'
      )

      const { model, traderMatchingKey, draftMatchingRuleList, collateralToken, trader } = config

      const placeholderForm = {
        allowanceRate: BigInt(1000),
        throttleActivity: BigInt(IntervalTime.HR),
        expiry: BigInt(unixTimestampNow() + IntervalTime.YEAR)
      }

      const draft = combineState({
        allowanceRate: startWith(model?.allowanceRate || placeholderForm.allowanceRate, inputAllowance),
        throttleActivity: startWith(
          model?.throttleActivity || placeholderForm.throttleActivity,
          changeActivityThrottle
        ),
        expiry: startWith(model?.expiry || placeholderForm.expiry, inputEndDate)
      })

      const isSubscribed = model && model.expiry > BigInt(unixTimestampNow())

      return [
        $column(spacing.default, style({ maxWidth: '350px' }))(
          $text('The following rules will apply to this trader whenever he opens and maintain a position'),

          $FieldLabeled({
            label: 'Allocate %',
            value: mergeArray([
              model?.allowanceRate && model.allowanceRate !== placeholderForm.allowanceRate
                ? now(model.allowanceRate)
                : empty(),
              map((x) => (x ? `${formatFixed(4, x) * 100}` : ''), inputAllowance)
            ]),
            placeholder: `${formatFixed(4, model?.allowanceRate || placeholderForm.allowanceRate) * 100}`,
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
                $anchor: $FieldLabeled({
                  label: 'Activity throttle',
                  value: map(O(Number, getDuration), changeActivityThrottle),
                  placeholder: getDuration(Number(model?.throttleActivity || placeholderForm.throttleActivity)),
                  labelWidth: 150,
                  hint: 'Ignore positions that are too close to each other in time'
                })({}),
                $container: $defaultSelectContainer(style({ right: '0' })),
                $$option: map((tf) => {
                  return $node($text(getDuration(Number(tf))))
                }),
                optionList: [IntervalTime.HR, IntervalTime.HR2, IntervalTime.HR6, IntervalTime.DAY, IntervalTime.WEEK]
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
                    ...model,
                    ...params
                  }

                  return [...params.draftMatchingRuleList]
                }

                return [
                  ...params.draftMatchingRuleList,
                  {
                    traderMatchingKey,
                    trader,
                    collateralToken,
                    ...params.draft
                  }
                ]
              },
              combineState({ draftMatchingRuleList, draft }),
              save
            ),
            snapshot(
              (params) => {
                const modelIndex = params.draftMatchingRuleList.findIndex(
                  (x) => x.traderMatchingKey === traderMatchingKey
                )
                if (modelIndex > -1) {
                  params.draftMatchingRuleList.splice(modelIndex, 1)
                }
                return params.draftMatchingRuleList
              },
              combineState({ draftMatchingRuleList, draft }),
              clickRemove
            )
          ])
        }
      ]
    }
  )
