import type { Stream } from '@most/types'
import { type IntervalTime, PUPPET_COLLATERAL_LIST } from '@puppet-copy/middleware/const'
import { getTokenDescription } from '@puppet-copy/middleware/gmx'
import type { IMatchingRule } from '@puppet-copy/sql/schema'
import { $node, combineState, component, type IBehavior, style, switchMap } from 'aelea/core'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import type { Address } from 'viem/accounts'
import { $card, $card2 } from '../../common/elements/$common.js'
import { $SelectCollateralToken } from '../../components/$CollateralTokenSelector.js'
import { $LastAtivity } from '../../components/$LastActivity.js'
import { $RouteDepositEditor, type IDepositEditorDraft } from '../../components/portfolio/$RouteDepositEditor.js'
import { $seperator2 } from '../common.js'
import type { IPageFilterParams } from '../type.js'

interface IWalletPuppet extends IPageFilterParams {
  draftDepositTokenList: Stream<IDepositEditorDraft[]>
  userMatchingRuleQuery: Stream<Promise<IMatchingRule[]>>
}

export const $PortfolioPage = ({
  activityTimeframe,
  collateralTokenList,
  userMatchingRuleQuery,
  draftDepositTokenList
}: IWalletPuppet) =>
  component(
    (
      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<any, IntervalTime>,
      [selectCollateralTokenList, selectCollateralTokenListTether]: IBehavior<Address[]>,
      [changeDepositTokenList, changeDepositTokenListTether]: IBehavior<IDepositEditorDraft[]>
    ) => {
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
            $column(style({ width: '100%', padding: 0, height: '200px', placeContent: 'center' }))(
              $row(
                style({
                  position: 'absolute',
                  top: '14px',
                  left: isDesktopScreen ? '20px' : '12px',
                  right: isDesktopScreen ? '20px' : '12px',
                  alignSelf: 'center',
                  zIndex: 11,
                  alignItems: 'flex-start'
                })
              )(
                $row(style({ flex: 1 }))(
                  $SelectCollateralToken({
                    selectedList: collateralTokenList
                  })({
                    changeCollateralTokenList: selectCollateralTokenListTether()
                  })
                ),

                $row(style({ flex: 1 }))(
                  $node(style({ flex: 1 }))(),

                  $LastAtivity(activityTimeframe)({
                    changeActivityTimeframe: changeActivityTimeframeTether()
                  })
                )
              )
            )
          ),

          switchMap((params) => {
            const activeRouteList =
              params.collateralTokenList.length > 0 ? params.collateralTokenList : PUPPET_COLLATERAL_LIST

            return $column(spacing.default)(
              ...activeRouteList.map((collateralToken) => {
                const _tokenDescription = getTokenDescription(collateralToken)

                return $column(style({ paddingLeft: '16px' }))(
                  $row(
                    spacing.big,
                    style({ padding: '6px 0' })
                  )(
                    $RouteDepositEditor({
                      draftDepositTokenList,
                      collateralToken
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
                  )
                )
              })
            )
          }, combineState({ activityTimeframe, collateralTokenList }))
        ),

        {
          changeActivityTimeframe,
          selectCollateralTokenList,
          changeDepositTokenList
        }
      ]
    }
  )
