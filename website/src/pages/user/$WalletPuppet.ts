import { map } from '@most/core'
import type { Stream } from '@most/types'
import type { IntervalTime } from '@puppet/middleware/const'
import { getTokenDescription } from '@puppet/middleware/gmx'
import { $IntermediatePromise, $infoLabel } from '@puppet/middleware/ui-components'
import { type IBehavior, combineState } from 'aelea/core'
import { $text, component, style } from 'aelea/core'
import { $column, $row, layoutSheet } from 'aelea/ui-components'
import type { EIP6963ProviderDetail } from 'mipd'
import type * as viem from 'viem'
import { $card, $card2 } from '../../common/elements/$common.js'
import { $ProfilePeformanceTimeline } from '../../components/participant/$ProfilePeformanceTimeline.js'
import type { IDepositEditorChange } from '../../components/portfolio/$DepositEditor.js'
import { $RouteDepositEditor } from '../../components/portfolio/$RouteDepositEditor.js'
import type { IMatchRuleEditorChange } from '../../components/portfolio/$TraderMatchRouteEditor.js'
import { $seperator2 } from '../common.js'
import type { IUserActivityPageParams } from '../type.js'

interface IWalletPuppet extends IUserActivityPageParams {
  depositTokenList: Stream<IDepositEditorChange[]>
  matchRuleList: Stream<IMatchRuleEditorChange[]>
}

export const $WalletPuppet = (config: IWalletPuppet) =>
  component(
    (
      [changeRoute, changeRouteTether]: Behavior<string, string>,
      [modifySubscriber, modifySubscriberTether]: Behavior<IMatchRuleEditorChange>,
      [changeWallet, changeWalletTether]: Behavior<EIP6963ProviderDetail>,

      [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<any, IntervalTime>,
      [selectMarketTokenList, selectMarketTokenListTether]: Behavior<viem.Address[]>,

      [changeMatchRuleList, changeMatchRuleListTether]: Behavior<IMatchRuleEditorChange[]>,
      [changeDepositTokenList, changeDepositTokenListTether]: Behavior<IDepositEditorChange[]>,
    ) => {
      const {
        activityTimeframe,
        depositTokenList,
        selectedCollateralTokenList
      } = config

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
              height: screenUtils.isDesktopScreen ? '200px' : '200px',
              position: 'relative',
              margin: screenUtils.isDesktopScreen ? `-36px -36px 0` : `-12px -12px 0px`,
            }),
          )(
            $ProfilePeformanceTimeline({ ...config })({
              selectMarketTokenList: selectMarketTokenListTether(),
              changeActivityTimeframe: changeActivityTimeframeTether(),
            }),
          ),

          $IntermediatePromise({
            query: tableParams,
            $$done: map((params) => {
              if (params.collateralTokenList.length === 0) {
                return $column(spacing.small)(
                  $text('No active collateral tokens selected'),
                  $infoLabel(`Select collateral tokens to view activity`),
                )
              }

              return $column(spacing.default)(
                ...params.collateralTokenList.map((collateralToken) => {
                  const tokenDescription = getTokenDescription(collateralToken)

                  return $column(style({ paddingLeft: '16px' }))(
                    $row(
                      spacing.big,
                      style({ padding: '6px 0' }),
                    )(
                      $RouteDepositEditor({
                        depositTokenList,
                        collateralToken,
                        providerClientQuery,
                        walletClientQuery,
                      })({
                        changeWallet: changeWalletTether(),
                        changeDepositTokenList: changeDepositTokenListTether(),
                      }),
                    ),
                    $row(spacing.default)(
                      $seperator2,
                      $column(style({ flex: 1, padding: '12px 0' }))(
                        // ...[].map(modSubsc => {
                        //   const iconColorParams = modSubsc.matchRule
                        //     ? modSubsc.expiry === 0n
                        //       ? { fill: pallete.negative, icon: $xCross, label: screenUtils.isDesktopScreen ? 'Remove' : '-' } : { fill: pallete.message, icon: $target, label: screenUtils.isDesktopScreen ? 'Edit' : '~' }
                        //     : { fill: pallete.positive, icon: $check, label: screenUtils.isDesktopScreen ? 'Add' : '+' }
                        //   return $row(screenUtils.isDesktopScreen ? spacing.big : spacing.default, style({ alignItems: 'center', padding: `14px 0` }))(
                        //     // O(
                        //     //   style({ marginLeft: '-32px', backgroundColor: pallete.horizon, cursor: 'pointer' }),
                        //     //   clickRemoveSubscTether(nodeEvent('click'), constant(modSubsc))
                        //     // )(
                        //     //   $iconCircular($xCross)
                        //     // ),
                        //     $row(
                        //       $text(style({ backgroundColor: colorAlpha(iconColorParams.fill, .1), marginLeft: `-42px`, borderRadius: '6px', padding: screenUtils.isDesktopScreen ? `6px 12px 6px 22px` : `6px 8px 6px 30px`, color: iconColorParams.fill, }))(iconColorParams.label),
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
                      ),
                    ),
                    $seperator2,
                  )
                }),
              )
            }),
          })({}),
        ),

        {
          changeWallet,
          changeRoute,
          modifySubscriber,
          changeActivityTimeframe,
          selectMarketTokenList,
          changeDepositTokenList,
          changeMatchRuleList,
        },
      ]
    },
  )
