// TODO: Replace with actual schema type when matching rules are implemented
type ISubscribeRule = {
  id: string
  blockTimestamp: number
  transactionHash: string
  account: `0x${string}`
  collateralToken: `0x${string}`
  master: `0x${string}`
  masterMatchingKey: `0x${string}`
  allowanceRate: bigint
  throttleActivity: bigint
  expiry: bigint
}

import { getMasterMatchingKey, getUnixTimestamp } from '@puppet/sdk/core'
import { awaitPromises, combine, empty, type IStream, map, op, sampleMap } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $text, component, type INodeCompose, style, styleBehavior } from 'aelea/ui'
import { $row, isDesktopScreen, isMobileScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $caretDown, $icon } from '@/ui-components'
import { $tokenIconByAddress } from '../../common/$common.js'
import { $responsiveFlex } from '../../common/elements/$common.js'
import { $seperator2 } from '../../pages/common.js'
import { $Popover } from '../$Popover.js'
import { $ButtonSecondary } from '../form/$Button.js'
import { $defaultButtonCore } from '../form/$ButtonCore.js'
import { $MatchingRuleEditor, type ISetMatchingRuleEditorDraft } from './$MatchingRuleEditor.js'

interface IMasterMatchingRouteEditor {
  master: Address
  userMatchingRuleQuery: IStream<Promise<ISubscribeRule[]>>
  collateralToken: Address
  draftMatchingRuleList: IStream<ISetMatchingRuleEditorDraft[]>
  $container?: INodeCompose
}

export const $defaultMasterMatchRouteEditorContainer = $row(spacing.small, style({ alignItems: 'center' }))

export const $RouteEditor = (config: IMasterMatchingRouteEditor) =>
  component(
    (
      [popRouteSubscriptionEditor, popRouteSubscriptionEditorTether]: IBehavior<PointerEvent>,
      [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<ISetMatchingRuleEditorDraft[]>
    ) => {
      const masterMatchingKey = getMasterMatchingKey(config.collateralToken, config.master)

      const {
        $container = $defaultMasterMatchRouteEditorContainer,
        draftMatchingRuleList,
        master,
        collateralToken,
        userMatchingRuleQuery
      } = config

      const matchingRule = op(
        userMatchingRuleQuery,
        map(async listQuery => {
          const list = await listQuery
          const match = list.find(mr => getMasterMatchingKey(mr.collateralToken, mr.master) === masterMatchingKey)

          return match
        }),
        awaitPromises
      )

      const borderColorStyle = op(
        combine({ rule: matchingRule, draftList: draftMatchingRuleList }),
        map(params => {
          const hasDraft = params.draftList.some(draft => draft.masterMatchingKey === masterMatchingKey)
          const hasActiveRule = params.rule && params.rule.expiry > getUnixTimestamp()
          if (hasDraft) return { borderColor: `${pallete.indeterminate} !important` }
          if (hasActiveRule) return { borderColor: `${pallete.primary} !important` }
          return null
        })
      )

      return [
        $Popover({
          $container,
          $open: op(
            popRouteSubscriptionEditor,
            sampleMap(match => {
              return $MatchingRuleEditor({
                draftMatchingRuleList,
                model: match,
                masterMatchingKey,
                collateralToken,
                master
              })({
                changeMatchRuleList: changeMatchRuleListTether()
              })
            }, matchingRule)
          ),
          dismiss: changeMatchRuleList,
          $target: $ButtonSecondary({
            $content: $responsiveFlex(style({ alignItems: 'center', gap: isDesktopScreen ? '6px' : '4px' }))(
              $row(style({ alignItems: 'center' }))(
                $tokenIconByAddress(collateralToken, isDesktopScreen ? '38px' : '24px'),
                isMobileScreen
                  ? $icon({
                      $content: $caretDown,
                      width: '12px',
                      svgOps: style({ marginLeft: '4px', minWidth: '8px' }),
                      viewBox: '0 0 32 32'
                    })
                  : empty
              ),
              $seperator2,
              $row(style({ gap: '6px' }))(
                $text('Copy'),
                isDesktopScreen
                  ? $icon({
                      $content: $caretDown,
                      width: '8px',
                      svgOps: style({ marginTop: '2px', minWidth: '8px', marginRight: '8px' }),
                      viewBox: '0 0 32 32'
                    })
                  : empty
              )
            ),
            $container: $defaultButtonCore(
              style({
                color: pallete.message,
                whiteSpace: 'nowrap',
                fill: 'white',
                borderStyle: 'solid',
                alignSelf: 'center',
                fontSize: '.8rem',
                backgroundColor: pallete.background,
                fontWeight: 'bold',
                borderWidth: '1px',
                borderColor: colorAlpha(pallete.foreground, 0.25)
              }),
              isDesktopScreen
                ? style({
                    borderRadius: '100px',
                    padding: '0',
                    height: 'auto'
                  })
                : style({
                    borderRadius: '8px',
                    padding: '4px 8px',
                    height: 'auto'
                  }),
              styleBehavior(borderColorStyle)
            )
          })({
            click: popRouteSubscriptionEditorTether()
          })
        })({}),
        {
          changeMatchRuleList
        }
      ]
    }
  )
