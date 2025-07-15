import { constant, empty, map } from '@most/core'
import type { Stream } from '@most/types'
import { type IntervalTime, PUPPET_COLLATERAL_LIST } from '@puppet-copy/middleware/const'
import { getTraderMatchingKey } from '@puppet-copy/middleware/core'
import { getTokenDescription } from '@puppet-copy/middleware/gmx'
import { $caretDown, $infoLabel, $infoLabeledValue, $intermediatePromise } from '@puppet-copy/middleware/ui-components'
import { filterNull, getDuration, readableDate, readablePercentage } from '@puppet-copy/middleware/utils'
import type { IMatchingRule } from '@puppet-copy/sql/schema'
import { $node, $text, combineState, component, type IBehavior, style } from 'aelea/core'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $card, $card2, $responsiveFlex } from '../../common/elements/$common.js'
import { sqlClient } from '../../common/sqlClient.js'
import { $profileDisplay } from '../../components/$AccountProfile.js'
import { $SelectCollateralToken } from '../../components/$CollateralTokenSelector.js'
import { $LastAtivity } from '../../components/$LastActivity.js'
import { $Popover } from '../../components/$Popover.js'
import { $ButtonCircular, $defaultButtonCircularContainer } from '../../components/form/$Button.js'
import type { IDepositEditorDraft } from '../../components/portfolio/$DepositEditor.js'
import { $MatchingRuleEditor, type IMatchingRuleEditorDraft } from '../../components/portfolio/$MatchingRuleEditor.js'
import { $RouteDepositEditor } from '../../components/portfolio/$RouteDepositEditor.js'
import { wallet } from '../../wallet/wallet.js'
import { $seperator2 } from '../common.js'
import type { IPageFilterParams } from '../type.js'

interface IWalletPuppet extends IPageFilterParams {
  draftMatchingRuleList: Stream<IMatchingRuleEditorDraft[]>
  draftDepositTokenList: Stream<IDepositEditorDraft[]>
  userMatchingRuleQuery: Stream<Promise<IMatchingRule[]>>
}

export const $PortfolioPage = ({
  activityTimeframe,
  collateralTokenList,
  userMatchingRuleQuery,
  draftDepositTokenList,
  draftMatchingRuleList
}: IWalletPuppet) =>
  component(
    (
      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<any, IntervalTime>,
      [selectCollateralTokenList, selectCollateralTokenListTether]: IBehavior<Address[]>,
      [changeDepositTokenList, changeDepositTokenListTether]: IBehavior<IDepositEditorDraft[]>,
      [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<IMatchingRuleEditorDraft[]>,
      [popRouteSubscriptionEditor, popRouteSubscriptionEditorTether]: IBehavior<any, Address>
    ) => {
      const settlementListQuery = map(
        async (params) => {
          const address = params.wallet.address
          if (address === undefined) {
            return []
          }

          return await sqlClient.query.puppetSettlement.findMany({
            where: (t, f) =>
              f.and(
                f.eq(t.puppet, address)
                // f.inArray(t.collateralToken, params.collateralTokenList)
              )

            // orderBy: (t, f) => f.expiry.asc(),
            // limit: 100
          })
        },
        combineState({ collateralTokenList, activityTimeframe, wallet: wallet.account })
      )

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
              ),

              $intermediatePromise({
                $display: map(async (params) => {
                  const settlementList = await params.settlementListQuery
                  if (settlementList.length === 0) {
                    return $column(style({ alignItems: 'center' }), spacing.small)(
                      // no activity within the selected timeframe
                      $text(`No matching activity in the last ${getDuration(params.activityTimeframe)}`),
                      $infoLabel($text('Try adjusting filters like Activity timeframe or collateral tokens'))
                    )
                  }

                  // TODO
                  return empty()
                }, combineState({ activityTimeframe, settlementListQuery }))
              })
            )
          ),

          $intermediatePromise({
            $display: map(async (params) => {
              const activeRouteList =
                params.collateralTokenList.length > 0 ? params.collateralTokenList : PUPPET_COLLATERAL_LIST

              const matchingRuleList = await params.userMatchingRuleQuery

              return $column(spacing.default)(
                ...activeRouteList.map((collateralToken) => {
                  const matchingRuleListForToken = matchingRuleList.filter(
                    (rule) => rule.collateralToken === collateralToken
                  )

                  return $column(style({ paddingLeft: '16px' }))(
                    $row(
                      spacing.big
                      // style({ padding: '6px 0' })
                    )(
                      $RouteDepositEditor({
                        draftDepositTokenList,
                        collateralToken
                      })({
                        changeDepositTokenList: changeDepositTokenListTether()
                      })
                    ),
                    $row(spacing.default)(
                      style({ marginBottom: '30px' })($seperator2),
                      $column(style({ flex: 1, padding: '12px 0' }))(
                        $column(spacing.big)(
                          // user did not set any matching rules for this collateral token
                          matchingRuleListForToken.length === 0
                            ? $infoLabel(
                                $text(`No matching rules set for ${getTokenDescription(collateralToken).name}`)
                              )
                            : empty(),
                          ...matchingRuleListForToken.map((rule) => {
                            const traderMatchingKey = getTraderMatchingKey(collateralToken, rule.trader)

                            return $Popover({
                              $open: filterNull(
                                map((trader) => {
                                  if (trader !== rule.trader) {
                                    return null
                                  }

                                  return $MatchingRuleEditor({
                                    draftMatchingRuleList,
                                    model: rule,
                                    traderMatchingKey,
                                    collateralToken,
                                    trader: rule.trader
                                  })({
                                    changeMatchRuleList: changeMatchRuleListTether()
                                  })
                                }, popRouteSubscriptionEditor)
                              ),
                              dismiss: changeMatchRuleList,
                              $target: $row(
                                isDesktopScreen ? spacing.big : spacing.default,
                                style({ alignItems: 'center' })
                              )(
                                $ButtonCircular({
                                  $iconPath: $caretDown,
                                  $container: $defaultButtonCircularContainer(
                                    style({
                                      marginLeft: '-32px',
                                      backgroundColor: pallete.background,
                                      cursor: 'pointer'
                                    })
                                  )
                                })({
                                  click: popRouteSubscriptionEditorTether(constant(rule.trader))
                                }),
                                $profileDisplay({
                                  address: rule.trader
                                }),
                                $responsiveFlex(spacing.default, style({ flex: 1 }))(
                                  $infoLabeledValue(
                                    'Allowance Rate',
                                    $text(`${readablePercentage(rule.allowanceRate)}`)
                                  ),
                                  $infoLabeledValue('Expiry', readableDate(Number(rule.expiry))),
                                  $infoLabeledValue('Throttle Duration', $text(`${getDuration(rule.throttleActivity)}`))
                                )
                              )
                            })({})
                          })
                        )
                      )
                    )
                  )
                })
              )
            }, combineState({ activityTimeframe, collateralTokenList, settlementListQuery, userMatchingRuleQuery }))
          })
        ),

        {
          changeActivityTimeframe,
          selectCollateralTokenList,
          changeDepositTokenList,
          changeMatchRuleList
        }
      ]
    }
  )
