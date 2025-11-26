import { CONTRACT } from '@puppet-copy/middleware/const'
import { getDuration, readableDate, readablePercentage, readableTokenAmountLabel } from '@puppet-copy/middleware/core'
import { getTokenDescription } from '@puppet-copy/middleware/gmx'
import type { ISetMatchingRule } from '@puppet-copy/sql/schema'
import type { Route } from 'aelea/router'
import {
  awaitPromises,
  combine,
  constant,
  empty,
  type IStream,
  map,
  merge,
  op,
  sampleMap,
  skipRepeatsWith,
  switchLatest,
  switchMap
} from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $column, $row, designSheet, isDesktopScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { EIP6963ProviderDetail } from 'mipd'
import { type Address, encodeFunctionData, erc20Abi, type Hex } from 'viem'
import { $check, $infoLabeledValue, $infoTooltip, $target, $xCross } from '@/ui-components'
import { $TraderDisplay } from '../../common/$common.js'
import { $heading3 } from '../../common/$text.js'
import { $card2 } from '../../common/elements/$common.js'
import { $seperator2 } from '../../pages/common.js'
import type { IComponentPageParams } from '../../pages/types.js'
import { executeIntentAfterFunding, type IAccountState, type IBatchCall, wallet } from '../../wallet/wallet.js'
import { $ButtonCircular, $defaultButtonCircularContainer } from '../form/$Button.js'
import { $SubmitBar } from '../form/$SubmitBar.js'
import type { IDepositEditorDraft } from './$DepositEditor.js'
import { DEPOSIT_EDITOR_ACTION } from './$DepositEditor.js'
import type { ISetMatchingRuleEditorDraft } from './$MatchingRuleEditor.js'
import { $RouteDepositEditor } from './$RouteDepositEditor.js'

interface IPortfolioRoute {
  collateralToken: Address
  deposit: IDepositEditorDraft | null
  matchingRuleList: ISetMatchingRuleEditorDraft[]
}

interface IPortfolioEditorDrawer extends IComponentPageParams {
  route: Route
  userMatchingRuleQuery: IStream<Promise<ISetMatchingRule[]>>
  draftDepositTokenList: IStream<IDepositEditorDraft[]>
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
      [changeWallet, changeWalletTether]: IBehavior<EIP6963ProviderDetail>,
      [changeDepositTokenList, changeDepositTokenListTether]: IBehavior<IDepositEditorDraft[]>,
      [routeChange, routeChangeTether]: IBehavior<string, string>
    ) => {
      const openDrawerState = skipRepeatsWith((prev, next) => {
        return (
          prev.draftMatchingRuleList === next.draftMatchingRuleList &&
          prev.draftDepositTokenList === next.draftDepositTokenList
        )
      }, combine({ draftMatchingRuleList, draftDepositTokenList, userMatchingRuleQuery }))

      return [
        op(
          openDrawerState,
          switchMap(params => {
            if (params.draftMatchingRuleList.length === 0 && params.draftDepositTokenList.length === 0) {
              return empty
            }

            const depositSummary = params.draftDepositTokenList.reduce((acc, deposit) => {
              const current = acc.get(deposit.token) ?? 0n
              acc.set(deposit.token, current + deposit.amount)
              return acc
            }, new Map<Address, bigint>())

            const updateList = [...params.draftMatchingRuleList, ...params.draftDepositTokenList]
            const portfolioRouteList: IPortfolioRoute[] = updateList.reduce((acc: IPortfolioRoute[], item) => {
              const collateralToken = 'action' in item ? item.token : item.collateralToken
              const existingRoute = acc.find(route => route.collateralToken === collateralToken)

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
                  depositSummary.size > 0
                    ? switchLatest(
                        map((account: IAccountState | null) => {
                          if (!account) return $node()

                          const [token, amount] = depositSummary.entries().next().value as [Address, bigint]
                          const tokenDesc = getTokenDescription(token)
                          const readableAmount = readableTokenAmountLabel(tokenDesc, amount)
                          const smartAccount = account.account.getAddress() as Address

                          return $column(spacing.tiny, style({ textAlign: 'right', fontSize: '.85rem' }))(
                            $text(`Fund required: ${readableAmount}`),
                            $text(`Send to smart account: ${smartAccount}`)
                          )
                        }, awaitPromises(wallet.account))
                      )
                    : $node(),
                  $SubmitBar({
                    $submitContent: $text('Submit'),
                    txQuery: requestChangeSubscription
                  })({
                    changeWallet: changeWalletTether(),
                    submit: requestChangeSubscriptionTether(
                      map(async account => {
                        if (!account?.address) {
                          throw new Error('No connected account')
                        }

                        const tokenRouteContractParams = CONTRACT.TokenRouter
                        const callStack: IBatchCall[] = []
                        const userRouterCalls: Hex[] = [] // Collect UserRouter calls for multicall
                        const depositByToken = new Map<Address, bigint>()

                        for (const deposit of params.draftDepositTokenList) {
                          if (deposit.action === DEPOSIT_EDITOR_ACTION.DEPOSIT) {
                            const current = depositByToken.get(deposit.token) ?? 0n
                            depositByToken.set(deposit.token, current + deposit.amount)

                            // Approve call goes to the callStack directly
                            callStack.push({
                              to: deposit.token,
                              abi: erc20Abi,
                              data: encodeFunctionData({
                                abi: erc20Abi,
                                functionName: 'approve',
                                args: [tokenRouteContractParams.address, deposit.amount]
                              })
                            })

                            // Deposit call will be batched in multicall
                            userRouterCalls.push(
                              encodeFunctionData({
                                abi: CONTRACT.UserRouter.abi,
                                functionName: 'deposit',
                                args: [deposit.token, deposit.amount]
                              })
                            )
                          } else {
                            // Withdraw call will be batched in multicall
                            userRouterCalls.push(
                              encodeFunctionData({
                                abi: CONTRACT.UserRouter.abi,
                                functionName: 'withdraw',
                                args: [deposit.token, account.address, deposit.amount]
                              })
                            )
                          }
                        }

                        // Add setMatchingRule calls to be batched
                        params.draftMatchingRuleList.forEach(matchRule => {
                          userRouterCalls.push(
                            encodeFunctionData({
                              abi: CONTRACT.UserRouter.abi,
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
                          )
                        })

                        // If we have UserRouter calls, batch them with multicall
                        if (userRouterCalls.length > 0) {
                          callStack.push({
                            to: CONTRACT.UserRouter.address,
                            abi: CONTRACT.UserRouter.abi,
                            data: encodeFunctionData({
                              abi: CONTRACT.UserRouter.abi,
                              functionName: 'multicall',
                              args: [userRouterCalls]
                            })
                          })
                        }

                        const depositTokens = Array.from(depositByToken.entries())
                        if (depositTokens.length === 0) {
                          return wallet.writeMany(account, callStack)
                        }

                        if (depositTokens.length > 1) {
                          throw new Error('Multiple deposit tokens are not yet supported in 1-click flow')
                        }

                        const [fundingToken, fundingAmount] = depositTokens[0]

                        return executeIntentAfterFunding(account, {
                          fundingToken,
                          fundingAmount,
                          calls: callStack,
                          tokenRequests: [{ address: fundingToken, amount: fundingAmount }]
                        })
                      })
                    )
                  })
                )
              )
            )
          })
          // fadeIn
        ),

        {
          routeChange,
          changeWallet,
          changeMatchRuleList: merge(
            sampleMap(
              (list, subsc) => {
                const idx = list.indexOf(subsc)

                if (idx === -1) {
                  return [list]
                }

                // return remove(idx, list)
                return list.filter((_, i) => i !== idx)
              },
              draftMatchingRuleList,
              clickRemoveSubsc
            ),
            constant([], clickClose)
          ),
          changeDepositTokenList: merge(changeDepositTokenList, constant([], clickClose))
        }
      ]
    }
  )
