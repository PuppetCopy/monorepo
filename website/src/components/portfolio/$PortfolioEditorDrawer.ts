import {
  awaitPromises,
  constant,
  empty,
  fromPromise,
  map,
  mergeArray,
  skipRepeatsWith,
  snapshot,
  switchLatest
} from '@most/core'
import { remove } from '@most/prelude'
import type { Stream } from '@most/types'
import { CONTRACT } from '@puppet-copy/middleware/const'
import {
  $alert,
  $alertIntermediateTooltip,
  $check,
  $infoLabeledValue,
  $infoTooltip,
  $target,
  $xCross
} from '@puppet-copy/middleware/ui-components'
import { getDuration, readableDate, readablePercentage } from '@puppet-copy/middleware/utils'
import type { IMatchingRule } from '@puppet-copy/sql/schema'
import { getWalletClient } from '@wagmi/core'
import { $node, $text, combineState, component, type IBehavior, style, switchMap } from 'aelea/core'
import type { Route } from 'aelea/router'
import { $column, $row, designSheet, isDesktopScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { EIP6963ProviderDetail } from 'mipd'
import { type Address, encodeFunctionData, erc20Abi, MethodNotFoundRpcError } from 'viem'
import { $TraderDisplay } from '../../common/$common.js'
import { $heading3 } from '../../common/$text.js'
import { $card2 } from '../../common/elements/$common.js'
import { $seperator2 } from '../../pages/common.js'
import type { IComponentPageParams } from '../../pages/type.js'
import { fadeIn } from '../../transitions/enter.js'
import { type IBatchCall, type IWalletConnected, wallet } from '../../wallet/wallet.js'
import { $ButtonCircular, $defaultButtonCircularContainer } from '../form/$Button.js'
import { $SubmitBar } from '../form/$SubmitBar.js'
import type { IDepositEditorDraft } from './$DepositEditor.js'
import { DepositEditorAction } from './$DepositEditor.js'
import type { IMatchingRuleEditorDraft } from './$MatchRuleEditor.js'
import { $RouteDepositEditor } from './$RouteDepositEditor.js'

interface IPortfolioRoute {
  collateralToken: Address
  deposit: IDepositEditorDraft | null
  matchingRuleList: IMatchingRuleEditorDraft[]
}

interface IPortfolioEditorDrawer extends IComponentPageParams {
  route: Route
  userMatchingRuleQuery: Stream<Promise<IMatchingRule[]>>
  draftDepositTokenList: Stream<IDepositEditorDraft[]>
  draftMatchingRuleList: Stream<IMatchingRuleEditorDraft[]>
}

export const $PortfolioEditorDrawer = ({
  draftMatchingRuleList,
  draftDepositTokenList,
  userMatchingRuleQuery,
  route
}: IPortfolioEditorDrawer) =>
  component(
    (
      [requestChangeSubscription, requestChangeSubscriptionTether]: IBehavior<IWalletConnected, any>,
      [clickClose, clickCloseTether]: IBehavior<any>,
      [clickRemoveSubsc, clickRemoveSubscTether]: IBehavior<any, IMatchingRuleEditorDraft>,
      [changeWallet, changeWalletTether]: IBehavior<EIP6963ProviderDetail>,
      [changeDepositTokenList, changeDepositTokenListTether]: IBehavior<IDepositEditorDraft[]>,
      [routeChange, routeChangeTether]: IBehavior<string, string>
    ) => {
      const openDrawerState = skipRepeatsWith((prev, next) => {
        return (
          prev.draftMatchingRuleList === next.draftMatchingRuleList &&
          prev.draftDepositTokenList === next.draftDepositTokenList
        )
      }, combineState({ draftMatchingRuleList, draftDepositTokenList, userMatchingRuleQuery }))

      return [
        fadeIn(
          switchMap((params) => {
            if (params.draftMatchingRuleList.length === 0 && params.draftDepositTokenList.length === 0) {
              return empty()
            }

            const updateList = [...params.draftMatchingRuleList, ...params.draftDepositTokenList]
            const portfolioRouteList: IPortfolioRoute[] = updateList.reduce((acc: IPortfolioRoute[], item) => {
              const collateralToken = 'action' in item ? item.token : item.collateralToken
              const existingRoute = acc.find((route) => route.collateralToken === collateralToken)

              if (existingRoute) {
                if ('throttleActivity' in item) {
                  existingRoute.matchingRuleList.push(item)
                } else if ('token' in item) {
                  existingRoute.deposit = item
                }
              } else {
                const newDraft: IPortfolioRoute = {
                  collateralToken,
                  deposit: null,
                  matchingRuleList: []
                }

                if ('throttleActivity' in item) {
                  newDraft.matchingRuleList.push(item)
                } else if ('token' in item) {
                  newDraft.deposit = item
                }

                acc.push(newDraft)
              }

              return acc
            }, [])

            return $card2(
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

                switchMap((userMatchingRuleList) => {
                  return $column(
                    spacing.default,
                    designSheet.customScroll,
                    style({
                      overflow: 'auto',
                      maxHeight: '35vh',
                      padding: `0 ${isDesktopScreen ? '24px' : '12px'}`
                    })
                  )(
                    ...portfolioRouteList.map((portfolioRoute) => {
                      return $column(style({ paddingLeft: '16px' }))(
                        $row(
                          $RouteDepositEditor({
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
                            ...portfolioRoute.matchingRuleList.map((modSubsc) => {
                              const userMatchingRule = userMatchingRuleList.find(
                                (rule) =>
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
                                isDesktopScreen ? $node(style({ flex: 1 }))() : empty(),
                                $infoLabeledValue(
                                  'Allowance Rate',
                                  $text(`${readablePercentage(modSubsc.allowanceRate)}`)
                                ),
                                $infoLabeledValue('Expiry', readableDate(Number(modSubsc.expiry))),
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
                }, awaitPromises(userMatchingRuleQuery)),

                $row(spacing.small, style({ padding: '0 24px', alignItems: 'center' }))(
                  $node(style({ flex: 1, minWidth: 0 }))(
                    switchLatest(
                      switchMap(
                        async (getWalelt) => {
                          try {
                            const capabilities = await getWalelt.getCapabilities()
                            if (capabilities) {
                              return $text(
                                ...Object.values(capabilities)
                                  .map((cap) => cap.name)
                                  .join(', ')
                              )
                            }
                          } catch (error) {
                            if (error instanceof MethodNotFoundRpcError) {
                              return $row(
                                $alertIntermediateTooltip(
                                  $text('Connected Wallet does not support EIP-5792 yet'),
                                  $text(
                                    'Submittion will display multiple transactions for you to sign.\n\nMore about EIP-5792: https://eips.ethereum.org/EIPS/eip-5792'
                                  )
                                )
                              )
                            }

                            return $row($alert($text('Wallet does not support capabilities')))
                          }
                        },
                        fromPromise(getWalletClient(wallet.wagmiAdapter.wagmiConfig))
                      )
                    )
                  ),
                  $SubmitBar({
                    $submitContent: $text('Submit'),
                    txQuery: requestChangeSubscription
                  })({
                    changeWallet: changeWalletTether(),
                    submit: requestChangeSubscriptionTether(
                      map(async (account) => {
                        const routerContractaParams = CONTRACT[42161].RouterProxy
                        const tokenRouteContractParams = CONTRACT[42161].TokenRouter

                        const callStack: IBatchCall[] = []

                        for (const deposit of params.draftDepositTokenList) {
                          if (deposit.action === DepositEditorAction.DEPOSIT) {
                            callStack.push(
                              {
                                to: deposit.token,
                                data: encodeFunctionData({
                                  abi: erc20Abi,
                                  functionName: 'approve',
                                  args: [tokenRouteContractParams.address, deposit.amount]
                                })
                              },
                              {
                                to: routerContractaParams.address,
                                data: encodeFunctionData({
                                  ...routerContractaParams,
                                  functionName: 'deposit',
                                  args: [deposit.token, deposit.amount]
                                })
                              }
                            )
                          } else {
                            callStack.push({
                              to: routerContractaParams.address,
                              data: encodeFunctionData({
                                ...routerContractaParams,
                                functionName: 'withdraw',
                                args: [deposit.token, account.address, deposit.amount]
                              })
                            })
                          }
                        }

                        callStack.push(
                          ...params.draftMatchingRuleList.map((matchRule) => {
                            return {
                              to: routerContractaParams.address,
                              data: encodeFunctionData({
                                ...routerContractaParams,
                                functionName: 'setMatchingRule',
                                args: [
                                  matchRule.collateralToken,
                                  matchRule.trader,
                                  {
                                    allowanceRate: matchRule.allowanceRate,
                                    throttleActivity: matchRule.throttleActivity,
                                    expiry: matchRule.expiry
                                  }
                                ]
                              })
                            }
                          })
                        )

                        return wallet.writeMany(callStack)
                      })
                    )
                  })
                )
              )
            )
          }, openDrawerState)
        ),

        {
          routeChange,
          changeWallet,
          changeMatchRuleList: mergeArray([
            snapshot(
              (list, subsc) => {
                const idx = list.indexOf(subsc)

                if (idx === -1) {
                  return [list]
                }

                return remove(idx, list)
              },
              draftMatchingRuleList,
              clickRemoveSubsc
            ),
            constant([], clickClose)
          ]),
          changeDepositTokenList: mergeArray([changeDepositTokenList, constant([], clickClose)])
        }
      ]
    }
  )
