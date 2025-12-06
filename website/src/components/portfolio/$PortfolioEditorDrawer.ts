import { CONTRACT } from '@puppet-copy/middleware/const'
import { getDuration, readableDate, readablePercentage } from '@puppet-copy/middleware/core'
import type { ISetMatchingRule } from '@puppet-copy/sql/schema'
import type { CallInput } from '@rhinestone/sdk'
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
import { type Address, type Chain, encodeFunctionData, erc20Abi, getAddress, type Hex } from 'viem'
import { arbitrum } from 'viem/chains'
import { $check, $infoLabeledValue, $infoTooltip, $intermediatePromise, $target, $xCross } from '@/ui-components'
import { $TraderDisplay } from '../../common/$common.js'
import { $heading3 } from '../../common/$text.js'
import { $card2 } from '../../common/elements/$common.js'
import { $seperator2 } from '../../pages/common.js'
import type { IComponentPageParams } from '../../pages/types.js'
import { fadeIn } from '../../transitions/enter.js'
import wallet, { type IAccountState, restoreAccountKeys } from '../../wallet/wallet.js'
import { $ButtonCircular, $defaultButtonCircularContainer } from '../form/$Button.js'
import { $SubmitBar } from '../form/$SubmitBar.js'
import { BALANCE_ACTION, type BalanceDraft, type IDepositEditorDraft } from './$DepositEditor.js'
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

      const txState = start(null, promiseState(multicastTxQuery))

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

                $intermediatePromise({
                  $display: map(
                    async params => {
                      const resolvedAccount = await params.account
                      if (
                        !resolvedAccount ||
                        (params.depositList.length === 0 && params.matchingRuleList.length === 0)
                      ) {
                        return empty
                      }

                      try {
                        const depositTokens = new Map<Address, bigint>()
                        const calls: Array<{ to: Address; data: Hex }> = []
                        const userRouterCalls: Hex[] = []

                        for (const draft of params.depositList) {
                          if (draft.action === BALANCE_ACTION.DEPOSIT) {
                            const current = depositTokens.get(draft.token) ?? 0n
                            depositTokens.set(draft.token, current + draft.amount)

                            calls.push({
                              to: draft.token,
                              data: encodeFunctionData({
                                abi: erc20Abi,
                                functionName: 'approve',
                                args: [CONTRACT.TokenRouter.address, draft.amount]
                              })
                            })

                            userRouterCalls.push(
                              encodeFunctionData({
                                abi: CONTRACT.UserRouter.abi,
                                functionName: 'deposit',
                                args: [draft.token, draft.amount]
                              })
                            )
                          } else {
                            userRouterCalls.push(
                              encodeFunctionData({
                                abi: CONTRACT.UserRouter.abi,
                                functionName: 'withdraw',
                                args: [draft.token, resolvedAccount.address, draft.amount]
                              })
                            )
                          }
                        }

                        params.matchingRuleList.forEach(matchRule => {
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

                        if (userRouterCalls.length > 0) {
                          calls.push(
                            ...userRouterCalls.map(data => ({
                              to: CONTRACT.UserRouter.address,
                              data
                            }))
                          )
                        }

                        const tokenRequests = Array.from(depositTokens.entries())
                          .filter(([, amount]) => amount > 0n)
                          .map(([token, amount]) => ({ address: token, amount }))

                        if (tokenRequests.length === 0) {
                          return empty
                        }

                        const sourceChainId = params.depositList.find(d => d.action === BALANCE_ACTION.DEPOSIT)?.chainId
                        if (!sourceChainId) {
                          return empty
                        }

                        // Use subaccount address for cost estimation (works in both view and action mode)
                        const cost = await wallet.getIntentCost(
                          {
                            destinationChainId: arbitrum.id,
                            tokenRequests,
                            account: { address: resolvedAccount.subaccountAddress }
                          },
                          true
                        )

                        if (!cost.hasFulfilledAll && cost.totalTokenShortfallInUSD) {
                          return $row(
                            spacing.small,
                            style({
                              padding: '12px 24px',
                              backgroundColor: colorAlpha(pallete.negative, 0.1),
                              borderRadius: '8px',
                              margin: '0 24px'
                            })
                          )(
                            $infoTooltip(
                              $text(`Insufficient balance. Shortfall: $${cost.totalTokenShortfallInUSD.toFixed(2)}`)
                            )
                          )
                        }

                        const totalFee =
                          cost.sponsorFee?.relayerFee && cost.sponsorFee?.rhinestoneFee
                            ? (BigInt(cost.sponsorFee.relayerFee) + BigInt(cost.sponsorFee.rhinestoneFee)).toString()
                            : '0'

                        return $row(
                          spacing.small,
                          style({
                            padding: '12px 24px',
                            fontSize: '.85rem',
                            color: colorAlpha(pallete.foreground, 0.7)
                          })
                        )(
                          $node($text('Estimated fee: ')),
                          $node(style({ fontWeight: 'bold', color: pallete.foreground }))(
                            $text(totalFee === '0' ? 'Free' : `$${(Number(totalFee) / 1e6).toFixed(4)}`)
                          )
                        )
                      } catch (error) {
                        console.error('Failed to fetch intent cost:', error)
                        return empty
                      }
                    },
                    combine({
                      account: wallet.account,
                      depositList: draftDepositTokenList,
                      matchingRuleList: draftMatchingRuleList
                    })
                  )
                }),

                $row(spacing.small, style({ padding: '0 24px', alignItems: 'center' }))(
                  $node(style({ flex: 1, minWidth: 0 }))(),
                  $SubmitBar({
                    $submitContent: $text('Submit'),
                    txQuery: multicastTxQuery,
                    alert: op(
                      combine({ account: wallet.account, depositList: draftDepositTokenList }),
                      switchMap(async ({ account, depositList }) => {
                        const resolvedAccount = await account
                        if (!resolvedAccount) return null

                        // Validate all deposits use the same source chain
                        const deposits = depositList.filter(
                          (draft: BalanceDraft): draft is IDepositEditorDraft => draft.action === BALANCE_ACTION.DEPOSIT
                        )

                        if (deposits.length > 1) {
                          const chainIds = new Set(deposits.map((d: IDepositEditorDraft) => d.chainId))
                          if (chainIds.size > 1) {
                            return 'All deposits must be from the same chain'
                          }
                        }

                        // If there are deposits, allow submission
                        if (deposits.length > 0) return null

                        // Check if user has existing portfolio balances
                        try {
                          const portfolio = await wallet.getPortfolio(resolvedAccount.subaccountAddress)
                          const hasPortfolio = (portfolio?.length ?? 0) > 0
                          return hasPortfolio ? null : 'Deposit funds to proceed'
                        } catch {
                          return 'Deposit funds to proceed'
                        }
                      })
                    )
                  })({
                    submit: requestChangeSubscriptionTether(
                      map(async account => {
                        if (!account?.address) {
                          throw new Error('No connected account')
                        }

                        // Restore keys to memory if in view mode (prompts signature)
                        const activeAccount = await restoreAccountKeys(account)

                        const tokenRouteContractParams = CONTRACT.TokenRouter
                        const calls: CallInput[] = []
                        const userRouterCalls: Hex[] = []
                        const depositByToken = new Map<Address, bigint>()

                        for (const draft of params.draftDepositTokenList) {
                          if (draft.action === BALANCE_ACTION.DEPOSIT) {
                            const current = depositByToken.get(draft.token) ?? 0n
                            depositByToken.set(draft.token, current + draft.amount)

                            calls.push({
                              to: draft.token,
                              data: encodeFunctionData({
                                abi: erc20Abi,
                                functionName: 'approve',
                                args: [tokenRouteContractParams.address, draft.amount]
                              })
                            })

                            userRouterCalls.push(
                              encodeFunctionData({
                                abi: CONTRACT.UserRouter.abi,
                                functionName: 'deposit',
                                args: [draft.token, draft.amount]
                              })
                            )
                          } else {
                            userRouterCalls.push(
                              encodeFunctionData({
                                abi: CONTRACT.UserRouter.abi,
                                functionName: 'withdraw',
                                args: [draft.token, activeAccount.address, draft.amount]
                              })
                            )
                          }
                        }

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

                        if (userRouterCalls.length > 0) {
                          calls.push(
                            ...userRouterCalls.map(data => ({
                              to: CONTRACT.UserRouter.address,
                              data
                            }))
                          )
                        }

                        const depositTokens = Array.from(depositByToken.entries()).filter(([, amount]) => amount > 0n)
                        const subAccount = activeAccount.subaccountAddress

                        // Step 1: Fund subaccount (only if deposits exist)
                        let sourceChain: Chain = wallet.publicClient.chain
                        if (depositTokens.length > 0) {
                          const sourceChainId = params.draftDepositTokenList.find(
                            d => d.action === BALANCE_ACTION.DEPOSIT
                          )?.chainId
                          if (!sourceChainId) {
                            throw new Error('No source chain specified for deposit')
                          }
                          sourceChain = wallet.chainMap[sourceChainId as keyof typeof wallet.chainMap]
                          if (!sourceChain) {
                            throw new Error(`Chain ${sourceChainId} is not supported`)
                          }

                          const fundingCalls = depositTokens.map(([token, amount]) => ({
                            to: token,
                            data: encodeFunctionData({
                              abi: erc20Abi,
                              functionName: 'transfer',
                              args: [subAccount, amount]
                            })
                          }))

                          const fundingTx = await activeAccount.walletClient.sendCalls({
                            account: activeAccount.address,
                            chain: sourceChain,
                            calls: fundingCalls,
                            experimental_fallback: true,
                            forceAtomic: true
                          })

                          await activeAccount.walletClient.waitForCallsStatus({
                            id: fundingTx.id,
                            throwOnFailure: true
                          })

                          // Poll Rhinestone portfolio until balances are indexed
                          const maxAttempts = 30
                          const pollInterval = 1000 // 1 second
                          let attempts = 0

                          while (attempts < maxAttempts) {
                            const portfolio = await wallet.getPortfolio(subAccount, true)
                            const hasExpectedBalances = depositTokens.every(([token, expectedAmount]) => {
                              const normalizedToken = getAddress(token)
                              const portfolioToken = portfolio.find(t =>
                                (t as any).tokenChainBalance?.some(
                                  (c: any) => getAddress(c.tokenAddress) === normalizedToken
                                )
                              )

                              if (!portfolioToken) return false

                              const totalBalance = BigInt(portfolioToken.balances.unlocked || 0)
                              return totalBalance >= expectedAmount
                            })

                            if (hasExpectedBalances) break

                            attempts++
                            if (attempts < maxAttempts) {
                              await new Promise(resolve => setTimeout(resolve, pollInterval))
                            }
                          }

                          if (attempts === maxAttempts) {
                            throw new Error('Timeout waiting for balance update')
                          }
                        }

                        // Step 2: Execute operations via subaccount
                        if (!activeAccount.subAccount || !activeAccount.companionSigner) {
                          throw new Error('Account keys not available')
                        }
                        const tx = await activeAccount.subAccount.sendTransaction({
                          chain: arbitrum,
                          targetChain: sourceChain,
                          calls,
                          tokenRequests: depositTokens.map(([token, amount]) => ({
                            address: token,
                            amount
                          })),
                          signers: {
                            type: 'owner',
                            kind: 'ecdsa',
                            accounts: [activeAccount.companionSigner]
                          }
                        })

                        const transactionResult = await activeAccount.subAccount.waitForExecution(tx)

                        return transactionResult
                      })
                    )
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
