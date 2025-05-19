import { map } from '@most/core'
import type { Stream } from '@most/types'
import type { IntervalTime } from '@puppet/middleware/const'
import { getTokenDescription } from '@puppet/middleware/gmx'
import { $infoLabel, $intermediatePromise } from '@puppet/middleware/ui-components'
import { $text, combineState, component, type IBehavior, style } from 'aelea/core'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import type { EIP6963ProviderDetail } from 'mipd'
import type { Address } from 'viem/accounts'
import { $card, $card2 } from '../../common/elements/$common.js'
import { $TradeRouteTimeline } from '../../components/participant/$ProfilePeformanceTimeline.js'
import type { IMatchingRuleEditorDraft } from '../../components/portfolio/$MatchRuleEditor.js'
import { $RouteDepositEditor, type IDepositEditorDraft } from '../../components/portfolio/$RouteDepositEditor.js'
import { $seperator2 } from '../common.js'
import type { IUserPageParams } from '../type.js'

interface IWalletPuppet extends IUserPageParams {
  draftDepositTokenList: Stream<IDepositEditorDraft[]>
  matchingRuleList: Stream<IMatchingRuleEditorDraft[]>
}

export const $WalletPuppet = (config: IWalletPuppet) =>
  component(
    (
      [changeRoute, _changeRouteTether]: IBehavior<string, string>,
      [modifySubscriber, _modifySubscriberTether]: IBehavior<IMatchingRuleEditorDraft>,
      [changeWallet, _changeWalletTether]: IBehavior<EIP6963ProviderDetail>,

      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<any, IntervalTime>,
      [selectCollateralTokenList, selectCollateralTokenListTether]: IBehavior<Address[]>,

      [changeMatchRuleList, _changeMatchRuleListTether]: IBehavior<IMatchingRuleEditorDraft[]>,
      [changeDepositTokenList, changeDepositTokenListTether]: IBehavior<IDepositEditorDraft[]>
    ) => {
      const { activityTimeframe, draftDepositTokenList: depositTokenList, selectedCollateralTokenList } = config

      const tableParams = map(async (params) => {
        const activityTimeframe = params.activityTimeframe
        // const positionList = await params.positionListQuery
        const collateralTokenList = params.selectedCollateralTokenList

        return { activityTimeframe, collateralTokenList }
      }, combineState({ activityTimeframe, selectedCollateralTokenList }))

      return [
        $card(spacing.big, style({ flex: 1, width: '100%' }))(
          $card2(
            style({
              padding: 0,
              height: isDesktopScreen ? '200px' : '200px',
              position: 'relative',
              margin: isDesktopScreen ? '-36px -36px 0' : '-12px -12px 0px'
            })
          )(
            $TradeRouteTimeline({
              activityTimeframe,
              collateralTokenList,
              draftDepositTokenList: depositTokenList,
              matchingRuleQuery,
              metricsQuery
            })({
              selectCollateralTokenList: selectCollateralTokenListTether(),
              changeActivityTimeframe: changeActivityTimeframeTether()
            })
          ),

          $intermediatePromise({
            $display: map(async (paramsQuery) => {
              const params = await paramsQuery

              if (params.collateralTokenList.length === 0) {
                return $column(spacing.small)(
                  $text('No active collateral tokens selected'),
                  $infoLabel('Select collateral tokens to view activity')
                )
              }

              return $column(spacing.default)(
                ...params.collateralTokenList.map((collateralToken) => {
                  const _tokenDescription = getTokenDescription(collateralToken)

                  return $column(style({ paddingLeft: '16px' }))(
                    $row(
                      spacing.big,
                      style({ padding: '6px 0' })
                    )(
                      $RouteDepositEditor({
                        draftDepositTokenList: depositTokenList,
                        collateralToken,
                        providerClientQuery,
                        walletClientQuery
                      })({
                        changeDepositTokenList: changeDepositTokenListTether()
                      })
                    ),
                    $row(spacing.default)(
                      $seperator2,
                      $column(style({ flex: 1, padding: '12px 0' }))(
                        // ...[].map(modSubsc => {
                        //   const iconColorParams = modSubsc.matchRule
                        //     ? modSubsc.expiry === 0n
                        //       ? { fill: pallete.negative, icon: $xCross, label: isDesktopScreen ? 'Remove' : '-' } : { fill: pallete.message, icon: $target, label: isDesktopScreen ? 'Edit' : '~' }
                        //     : { fill: pallete.positive, icon: $check, label: isDesktopScreen ? 'Add' : '+' }
                        //   return $row(isDesktopScreen ? spacing.big : spacing.default, style({ alignItems: 'center', padding: `14px 0` }))(
                        //     // O(
                        //     //   style({ marginLeft: '-32px', backgroundColor: pallete.horizon, cursor: 'pointer' }),
                        //     //   clickRemoveSubscTether(nodeEvent('click'), constant(modSubsc))
                        //     // )(
                        //     //   $iconCircular($xCross)
                        //     // ),
                        //     $row(
                        //       $text(style({ backgroundColor: colorAlpha(iconColorParams.fill, .1), marginLeft: `-42px`, borderRadius: '6px', padding: isDesktopScreen ? `6px 12px 6px 22px` : `6px 8px 6px 30px`, color: iconColorParams.fill, }))(iconColorParams.label),
                        //     ),
                        //     // switchMap(amount => {
                        //     //   return $text(tokenAmountLabel(routeType.indexToken, amount))
                        //     // }, orchestrator.read('puppetAccountBalance', w3p.account.address, routeType.indexToken)),
                        //     $profileDisplay({
                        //       account: modSubsc.trader,
                        //       // $profileContainer: $defaultBerry(style({ width: '50px' }))
                        //     }),
                        //     $responsiveFlex(spacing.default, style({ flex: 1 }))(
                        //       $infoLabeledValue('Allowance Rate', $text(`${readablePercentage(modSubsc.allowanceRate)}`)),
                        //       $infoLabeledValue('Expiry', readableDate(Number(modSubsc.expiry))),
                        //       $infoLabeledValue('Throttle Duration', $text(`${getDuration(modSubsc.throttleActivity)}`)),
                        //     )
                        //   )
                        // })
                      )
                    ),
                    $seperator2
                  )
                })
              )
            }, tableParams)
          })({})
        ),

        {
          changeWallet,
          changeRoute,
          modifySubscriber,
          changeActivityTimeframe,
          selectCollateralTokenList,
          changeDepositTokenList,
          changeMatchRuleList
        }
      ]
    }
  )
