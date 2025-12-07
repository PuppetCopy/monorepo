import { CONTRACT } from '@puppet-copy/middleware/const'
import { getDuration, readableDate, readablePercentage } from '@puppet-copy/middleware/core'
import type { ISetMatchingRule } from '@puppet-copy/sql/schema'
import type { Route } from 'aelea/router'
import {
  awaitPromises,
  combine,
  constant,
  empty,
  filter,
  type IStream,
  map,
  merge,
  op,
  sampleMap,
  skipRepeatsWith,
  start,
  switchMap
} from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { multicast, promiseState } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $column, $row, designSheet, isDesktopScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { type Address, encodeFunctionData, erc20Abi, getAddress, type Hex } from 'viem'
import { $check, $infoLabeledValue, $infoTooltip, $target, $xCross } from '@/ui-components'
import { $TraderDisplay } from '../../common/$common.js'
import { $heading3 } from '../../common/$text.js'
import { $card2 } from '../../common/elements/$common.js'
import { $seperator2 } from '../../pages/common.js'
import type { IComponentPageParams } from '../../pages/types.js'
import { fadeIn } from '../../transitions/enter.js'
import type { IAccountState } from '../../wallet/wallet.js'
import { $ButtonCircular, $defaultButtonCircularContainer } from '../form/$Button.js'
import { $SendTransaction } from '../form/$SendTransaction.js'
import { BALANCE_ACTION, type BalanceDraft } from './$DepositEditor.js'
import type { ISetMatchingRuleEditorDraft } from './$MatchingRuleEditor.js'
import { $RouteBalanceEditor } from './$RouteBalanceEditor.js'

interface IPortfolioRoute {
  collateralToken: Address
  balanceDraft: BalanceDraft | null
  matchingRuleList: ISetMatchingRuleEditorDraft[]
}

interface IPortfolioEditorDrawer extends IComponentPageParams {
  route: Route
  userMatchingRuleQuery: IStream<Promise<ISetMatchingRule[]>>
  draftDepositTokenList: IStream<BalanceDraft[]>
  draftMatchingRuleList: IStream<ISetMatchingRuleEditorDraft[]>
}

export const $PortfolioEditorDrawer = ({
  draftMatchingRuleList,
  draftDepositTokenList,
  userMatchingRuleQuery,
  route
}: IPortfolioEditorDrawer) =>
  component(
    (
      [requestChangeSubscription, requestChangeSubscriptionTether]: IBehavior<IAccountState, any>,
      [clickClose, clickCloseTether]: IBehavior<any>,
      [clickRemoveSubsc, clickRemoveSubscTether]: IBehavior<any, ISetMatchingRuleEditorDraft>,
      [changeDepositTokenList, changeDepositTokenListTether]: IBehavior<BalanceDraft[]>,
      [routeChange, routeChangeTether]: IBehavior<string, string>
    ) => {
      const multicastTxQuery = multicast(requestChangeSubscription)

      const drawerState = combine({ draftMatchingRuleList, draftDepositTokenList, userMatchingRuleQuery })

      const txSuccess = op(
        start(null, promiseState(multicastTxQuery)),
        filter(state => state !== null && 'value' in state && state.value !== null),
        map(() => null)
      )

      const hasContent = op(
        drawerState,
        map(params => params.draftMatchingRuleList.length > 0 || params.draftDepositTokenList.length > 0),
        skipRepeatsWith((a, b) => a === b)
      )

      const $drawerContent = $card2(
        style({
          border: `1px solid ${colorAlpha(pallete.foreground, 0.2)}`,
          padding: '12px 0',
          borderBottom: 'none',
          borderRadius: '20px 20px 0 0'
        })
      )(
        $column(isDesktopScreen ? spacing.default : spacing.small)(
          $row(spacing.small, style({ alignItems: 'center', padding: '0 24px' }))(
            $heading3($text('Portfolio Changes')),
            $infoTooltip(
              $text(
                'The following rules will apply to these traders in your portfolio. \nvisit Profile to view your portfolio'
              )
            ),

            $node(style({ flex: 1 }))(),

            $ButtonCircular({
              $iconPath: $xCross
            })({
              click: clickCloseTether()
            })
          ),

          op(
            drawerState,
            switchMap(params => {
              if (params.draftMatchingRuleList.length === 0 && params.draftDepositTokenList.length === 0) {
                return empty
              }

              const updateList = [...params.draftMatchingRuleList, ...params.draftDepositTokenList]
              const portfolioRouteList: IPortfolioRoute[] = updateList.reduce((acc: IPortfolioRoute[], item) => {
                const collateralToken = 'action' in item ? item.token : item.collateralToken
                const existingRoute = acc.find(
                  route => getAddress(route.collateralToken) === getAddress(collateralToken)
                )

                if (existingRoute) {
                  if ('throttleActivity' in item) {
                    existingRoute.matchingRuleList.push(item)
                  } else if ('action' in item) {
                    existingRoute.balanceDraft = item
                  }
                } else {
                  const newDraft: IPortfolioRoute = {
                    collateralToken,
                    balanceDraft: null,
                    matchingRuleList: []
                  }

                  if ('throttleActivity' in item) {
                    newDraft.matchingRuleList.push(item)
                  } else if ('action' in item) {
                    newDraft.balanceDraft = item
                  }

                  acc.push(newDraft)
                }

                return acc
              }, [])

              return $column(spacing.default)(
                op(
                  userMatchingRuleQuery,
                  awaitPromises,
                  switchMap(userMatchingRuleList => {
                    return $column(
                      spacing.default,
                      designSheet.customScroll,
                      style({
                        overflow: 'auto',
                        maxHeight: '35vh',
                        padding: `0 ${isDesktopScreen ? '24px' : '12px'}`
                      })
                    )(
                      ...portfolioRouteList.map(portfolioRoute => {
                        return $column(style({ paddingLeft: '16px' }))(
                          $row(
                            $RouteBalanceEditor({
                              collateralToken: portfolioRoute.collateralToken,
                              draftDepositTokenList: draftDepositTokenList
                            })({
                              changeDepositTokenList: changeDepositTokenListTether()
                            })
                          ),
                          $row(spacing.default)(
                            style({ marginBottom: '30px' })($seperator2),
                            $column(
                              spacing.default,
                              style({ flex: 1, padding: '8px 0 18px' })
                            )(
                              ...portfolioRoute.matchingRuleList.map(modSubsc => {
                                const userMatchingRule = (userMatchingRuleList as ISetMatchingRule[]).find(
                                  (rule: ISetMatchingRule) =>
                                    rule.collateralToken === portfolioRoute.collateralToken &&
                                    rule.trader === modSubsc.trader
                                )

                                const iconColorParams = userMatchingRule
                                  ? modSubsc.expiry === 0n
                                    ? {
                                        fill: pallete.negative,
                                        icon: $xCross,
                                        label: isDesktopScreen ? 'Remove' : '-'
                                      }
                                    : {
                                        fill: pallete.message,
                                        icon: $target,
                                        label: isDesktopScreen ? 'Edit' : '~'
                                      }
                                  : {
                                      fill: pallete.positive,
                                      icon: $check,
                                      label: isDesktopScreen ? 'Add' : '+'
                                    }

                                return $row(
                                  isDesktopScreen ? spacing.default : spacing.small,
                                  style({ alignItems: 'center', flex: 1 })
                                )(
                                  $ButtonCircular({
                                    $iconPath: $xCross,
                                    $container: $defaultButtonCircularContainer(
                                      style({
                                        marginLeft: '-32px',
                                        backgroundColor: pallete.horizon,
                                        position: 'relative',
                                        cursor: 'pointer'
                                      })
                                    )
                                  })({
                                    click: clickRemoveSubscTether(constant(modSubsc))
                                  }),
                                  $row(
                                    style({
                                      backgroundColor: colorAlpha(iconColorParams.fill, 0.1),
                                      marginLeft: '-28px',
                                      borderRadius: '6px',
                                      padding: isDesktopScreen ? '6px 12px 6px 22px' : '6px 8px 6px 30px',
                                      color: iconColorParams.fill
                                    })
                                  )($text(iconColorParams.label)),

                                  $TraderDisplay({
                                    labelSize: isDesktopScreen ? 1 : 0,
                                    route,
                                    address: modSubsc.trader,
                                    puppetList: []
                                  })({
                                    click: routeChangeTether()
                                  }),
                                  isDesktopScreen ? $node(style({ flex: 1 }))() : empty,
                                  $infoLabeledValue(
                                    'Allowance Rate',
                                    $text(`${readablePercentage(modSubsc.allowanceRate)}`)
                                  ),
                                  $infoLabeledValue(
                                    'Expiry',
                                    modSubsc.expiry > 0n ? readableDate(Number(modSubsc.expiry)) : $text('Never')
                                  ),
                                  $infoLabeledValue(
                                    'Throttle Duration',
                                    $text(`${getDuration(modSubsc.throttleActivity)}`)
                                  )
                                )
                              })
                            )
                          )
                        )
                      })
                    )
                  })
                ),

                $row(spacing.small, style({ padding: '0 24px', alignItems: 'center' }))(
                  $node(style({ flex: 1, minWidth: 0 }))(),
                  $SendTransaction({
                    getCalls: account => {
                      const calls: Array<{ to: Address; data: Hex }> = []

                      for (const draft of params.draftDepositTokenList) {
                        if (draft.action === BALANCE_ACTION.DEPOSIT) {
                          calls.push({
                            to: draft.token,
                            data: encodeFunctionData({
                              abi: erc20Abi,
                              functionName: 'approve',
                              args: [CONTRACT.TokenRouter.address, draft.amount]
                            })
                          })
                          calls.push({
                            to: CONTRACT.UserRouter.address,
                            data: encodeFunctionData({
                              abi: CONTRACT.UserRouter.abi,
                              functionName: 'deposit',
                              args: [draft.token, draft.amount]
                            })
                          })
                        } else {
                          calls.push({
                            to: CONTRACT.UserRouter.address,
                            data: encodeFunctionData({
                              abi: CONTRACT.UserRouter.abi,
                              functionName: 'withdraw',
                              args: [draft.token, account.address, draft.amount]
                            })
                          })
                        }
                      }

                      for (const rule of params.draftMatchingRuleList) {
                        calls.push({
                          to: CONTRACT.UserRouter.address,
                          data: encodeFunctionData({
                            abi: CONTRACT.UserRouter.abi,
                            functionName: 'setMatchingRule',
                            args: [
                              rule.collateralToken,
                              rule.trader,
                              {
                                allowanceRate: rule.allowanceRate,
                                throttleActivity: rule.throttleActivity,
                                expiry: rule.expiry
                              }
                            ]
                          })
                        })
                      }

                      return calls
                    }
                  })({
                    submit: requestChangeSubscriptionTether()
                  })
                )
              )
            })
          )
        )
      )

      return [
        op(
          hasContent,
          switchMap(open => {
            if (!open) return empty
            return fadeIn($drawerContent)
          })
        ),

        {
          routeChange,
          changeMatchRuleList: merge(
            sampleMap(
              (list, subsc) => {
                const idx = list.indexOf(subsc)

                if (idx === -1) {
                  return [list]
                }

                return list.filter((_, i) => i !== idx)
              },
              draftMatchingRuleList,
              clickRemoveSubsc
            ),
            constant([], clickClose),
            constant([], txSuccess)
          ),
          changeDepositTokenList: merge(changeDepositTokenList, constant([], clickClose), constant([], txSuccess))
        }
      ]
    }
  )
