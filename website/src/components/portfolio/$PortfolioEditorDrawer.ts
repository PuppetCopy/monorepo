import { constant, empty, map, mergeArray, skipRepeatsWith, snapshot } from '@most/core'
import type { Stream } from '@most/types'
import { CONTRACT } from '@puppet/middleware/const'
import { $check, $infoLabeledValue, $infoTooltip, $target, $xCross } from '@puppet/middleware/ui-components'
import { getDuration, readableDate, readablePercentage } from '@puppet/middleware/utils'
import { $node, $text, combineState, component, type IBehavior, nodeEvent, O, style, switchMap } from 'aelea/core'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { EIP6963ProviderDetail } from 'mipd'
import { type Address, encodeFunctionData, type Hex } from 'viem'
import { $heading3 } from '../../common/$text.js'
import { $card2, $iconCircular, $responsiveFlex } from '../../common/elements/$common.js'
import { $seperator2 } from '../../pages/common.js'
import type { IComponentPageParams } from '../../pages/type.js'
import { fadeIn } from '../../transitions/enter.js'
import { type IWalletConnected, wallet } from '../../wallet/wallet.js'
import { $profileDisplay } from '../$AccountProfile.js'
import { $ButtonCircular } from '../form/$Button.js'
import { $SubmitBar } from '../form/$SubmitBar.js'
import { DepositEditorAction, type IDepositEditorChange } from './$DepositEditor.js'
import type { IMatchingRuleEditorChange } from './$MatchRuleEditor.js'
import { $RouteDepositEditor } from './$RouteDepositEditor.js'

interface IPortfolioEditorDrawer extends IComponentPageParams {
  depositTokenList: Stream<IDepositEditorChange[]>
  matchRuleList: Stream<IMatchingRuleEditorChange[]>
}

interface IPortfolioRoute {
  collateralToken: Address
  deposit: IDepositEditorChange | null
  matchRuleList: IMatchingRuleEditorChange[]
}

export const $PortfolioEditorDrawer = (config: IPortfolioEditorDrawer) =>
  component(
    (
      [requestChangeSubscription, requestChangeSubscriptionTether]: IBehavior<IWalletConnected, any>,
      [clickClose, clickCloseTether]: IBehavior<any>,
      [clickRemoveSubsc, clickRemoveSubscTether]: IBehavior<any, IMatchingRuleEditorChange>,
      [changeWallet, changeWalletTether]: IBehavior<EIP6963ProviderDetail>,
      [changeDepositTokenList, changeDepositTokenListTether]: IBehavior<IDepositEditorChange[]>
    ) => {
      const { matchRuleList, depositTokenList } = config

      const openDrawerState = skipRepeatsWith((prev, next) => {
        const prevCount = prev.matchRuleList.length + prev.depositTokenList.length
        const nextCount = next.matchRuleList.length + next.depositTokenList.length
        return prevCount > 0 && nextCount > 0
      }, combineState({ matchRuleList, depositTokenList }))

      return [
        switchMap((params) => {
          if (params.matchRuleList.length === 0 && params.depositTokenList.length === 0) {
            return empty()
          }

          const updateList = [...params.matchRuleList, ...params.depositTokenList]
          const portfolioRouteList: IPortfolioRoute[] = updateList.reduce((acc: IPortfolioRoute[], item) => {
            const collateralToken = 'token' in item ? item.token : item.collateralToken
            const existingRoute = acc.find((route) => route.collateralToken === collateralToken)

            if (existingRoute) {
              if ('throttleActivity' in item) {
                existingRoute.matchRuleList.push(item)
              } else if ('token' in item) {
                existingRoute.deposit = item
              }
            } else {
              const newDraft: IPortfolioRoute = {
                collateralToken,
                deposit: null,
                matchRuleList: []
              }

              if ('throttleActivity' in item) {
                newDraft.matchRuleList.push(item)
              } else if ('token' in item) {
                newDraft.deposit = item
              }

              acc.push(newDraft)
            }

            return acc
          }, [])

          return fadeIn(
            $card2(
              style({
                border: `1px solid ${colorAlpha(pallete.foreground, 0.2)}`,
                padding: '18px 0',
                borderBottom: 'none',
                borderRadius: '20px 20px 0 0'
              })
            )(
              $column(spacing.default)(
                $row(spacing.small, style({ alignItems: 'center', padding: '0 24px' }))(
                  $heading3($text('Portfolio Changes')),
                  $infoTooltip(
                    'The following rules will apply to these traders in your portfolio. visit Profile to view your portfolio'
                  ),

                  $node(style({ flex: 1 }))(),

                  $ButtonCircular({
                    $iconPath: $xCross
                  })({
                    click: clickCloseTether()
                  })
                ),

                $column(
                  spacing.default,
                  style({
                    overflow: 'auto',
                    maxHeight: '35vh',
                    padding: `0 ${isDesktopScreen ? '24px' : '12px'}`
                  })
                )(
                  ...portfolioRouteList.map((route) => {
                    return $column(style({ paddingLeft: '16px' }))(
                      $row(
                        spacing.big,
                        style({ padding: '6px 0' })
                      )(
                        $RouteDepositEditor({
                          collateralToken: route.collateralToken,
                          depositTokenList
                        })({
                          changeDepositTokenList: changeDepositTokenListTether(),
                          changeWallet: changeWalletTether()
                        })
                      ),
                      $row(spacing.default)(
                        $seperator2,
                        $column(style({ flex: 1, padding: '12px 0' }))(
                          ...route.matchRuleList.map((modSubsc) => {
                            const iconColorParams = modSubsc
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
                              isDesktopScreen ? spacing.big : spacing.default,
                              style({ alignItems: 'center', padding: '14px 0' })
                            )(
                              O(
                                style({ marginLeft: '-32px', backgroundColor: pallete.horizon, cursor: 'pointer' }),
                                clickRemoveSubscTether(nodeEvent('click'), constant(modSubsc))
                              )($iconCircular($xCross)),
                              $row(
                                style({
                                  backgroundColor: colorAlpha(iconColorParams.fill, 0.1),
                                  marginLeft: '-42px',
                                  borderRadius: '6px',
                                  padding: isDesktopScreen ? '6px 12px 6px 22px' : '6px 8px 6px 30px',
                                  color: iconColorParams.fill
                                })
                              )($text(iconColorParams.label)),

                              // switchMap(amount => {
                              //   return $text(tokenAmountLabel(routeType.indexToken, amount))
                              // }, orchestrator.read('puppetAccountBalance', w3p.account.address, routeType.indexToken)),

                              $profileDisplay({
                                account: modSubsc.trader
                                // $profileContainer: $defaultBerry(style({ width: '50px' }))
                              }),

                              $responsiveFlex(spacing.default, style({ flex: 1 }))(
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
                            )
                          })
                        )
                      ),
                      $seperator2
                    )
                  })
                ),

                $row(spacing.small, style({ placeContent: 'space-between', padding: '0 24px' }))(
                  $node(),
                  $SubmitBar({
                    $submitContent: $text(isDesktopScreen ? 'Save Changes' : 'Save'),
                    txQuery: requestChangeSubscription
                    // alert: validationError
                  })({
                    changeWallet: changeWalletTether(),
                    submit: requestChangeSubscriptionTether(
                      map(async (account) => {
                        const callStack: Hex[] = []
                        const contractDefs = CONTRACT[42161].RouterProxy

                        if (params.matchRuleList.length > 0) {
                          callStack.push(
                            ...params.matchRuleList.map((matchRule) => {
                              const ruleParams = {
                                allowanceRate: matchRule.allowanceRate,
                                throttleActivity: matchRule.throttleActivity,
                                expiry: matchRule.expiry
                              }

                              return encodeFunctionData({
                                ...contractDefs,
                                functionName: 'setMatchingRule',
                                args: [matchRule.collateralToken, matchRule.trader, ruleParams]
                              })
                            })
                          )
                        }

                        if (params.depositTokenList.length > 0) {
                          callStack.push(
                            ...params.depositTokenList.map((deposit) =>
                              deposit.action === DepositEditorAction.DEPOSIT
                                ? encodeFunctionData({
                                    ...contractDefs,
                                    functionName: 'deposit',
                                    args: [deposit.token, deposit.value.amount]
                                  })
                                : encodeFunctionData({
                                    ...contractDefs,
                                    functionName: 'withdraw',
                                    args: [deposit.token, account.address, deposit.value.amount]
                                  })
                            )
                          )
                        }

                        return wallet.write({
                          ...contractDefs,
                          functionName: 'multicall',
                          args: [callStack]
                        })
                      })
                    )
                  })
                )
              )
            )
          )
        }, openDrawerState),

        {
          changeWallet,
          changeMatchRuleList: mergeArray([
            snapshot(
              (list, subsc) => {
                const idx = list.indexOf(subsc)

                if (idx === -1) {
                  return list
                }

                list.splice(idx, 1)

                return list
              },
              matchRuleList,
              clickRemoveSubsc
            ),
            constant([], clickClose)
          ]),
          changeDepositTokenList: mergeArray([changeDepositTokenList, constant([], clickClose)])
        }
      ]
    }
  )
