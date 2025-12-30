import type { ISubscribeRule } from '@puppet/database/schema'
import { type IntervalTime, PUPPET_COLLATERAL_LIST } from '@puppet/sdk/const'
import {
  getDuration,
  getMasterMatchingKey,
  getUnixTimestamp,
  groupManyList,
  readableDate,
  readablePercentage
} from '@puppet/sdk/core'
import { getTokenDescription } from '@puppet/sdk/gmx'
import { awaitPromises, combine, constant, empty, filterNull, type IStream, map, op } from 'aelea/stream'
import { type IBehavior, multicast } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $caretDown, $infoLabel, $infoLabeledValue, $intermediatePromise } from '@/ui-components'
import { $card, $card2, $responsiveFlex } from '../common/elements/$common.js'
import { sqlClient } from '../common/sqlClient.js'
import { $profileDisplay } from '../components/$AccountProfile.js'
import { $SelectCollateralToken } from '../components/$CollateralTokenSelector.js'
import { $ConnectWalletCard } from '../components/$ConnectWalletCard.js'
import { $LastAtivity } from '../components/$LastActivity.js'
import { $Popover } from '../components/$Popover.js'
import { $ButtonCircular, $defaultButtonCircularContainer } from '../components/form/$Button.js'
import type { IDepositEditorDraft } from '../components/portfolio/$DepositEditor.js'
import { $MatchingRuleEditor, type ISetMatchingRuleEditorDraft } from '../components/portfolio/$MatchingRuleEditor.js'
import { $RouteBalanceEditor } from '../components/portfolio/$RouteBalanceEditor.js'
import type { IAccountState } from '../wallet/wallet.js'
import { $seperator2 } from './common.js'
import type { IPageFilterParams } from './types.js'

interface IWalletPuppet extends IPageFilterParams {
  accountQuery: IStream<Promise<IAccountState | null>>
  draftMatchingRuleList: IStream<ISetMatchingRuleEditorDraft[]>
  draftDepositTokenList: IStream<IDepositEditorDraft[]>
  userMatchingRuleQuery: IStream<Promise<ISubscribeRule[]>>
}

export const $PortfolioPage = ({
  accountQuery,
  activityTimeframe,
  collateralTokenList,
  indexTokenList,
  userMatchingRuleQuery,
  draftDepositTokenList,
  draftMatchingRuleList
}: IWalletPuppet) =>
  component(
    (
      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<any, IntervalTime>,
      [selectCollateralTokenList, selectCollateralTokenListTether]: IBehavior<Address[]>,
      [selectIndexTokenList, selectIndexTokenListTether]: IBehavior<Address[]>,
      [changeDepositTokenList, changeDepositTokenListTether]: IBehavior<IDepositEditorDraft[]>,
      [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<ISetMatchingRuleEditorDraft[]>,
      [popRouteSubscriptionEditor, popRouteSubscriptionEditorTether]: IBehavior<any, Address>
    ) => {
      const positionLinkMapQuery = op(
        combine({ activityTimeframe, collateralTokenList, wallet: awaitPromises(accountQuery) }),
        map(async params => {
          if (!params.wallet) {
            return null
          }

          const address = params.wallet.address
          const startActivityTimeframe = getUnixTimestamp() - params.activityTimeframe

          const result = await sqlClient.query.position.findMany({
            where: (t, f) =>
              f.and(
                f.eq(t.puppet, address),
                f.gte(t.createdAt, startActivityTimeframe),
                params.collateralTokenList.length > 0
                  ? f.inArray(t.collateralToken, params.collateralTokenList)
                  : undefined
              ),
            columns: {
              masterMatchingKey: true,
              master: true,
              collateralToken: true,
              allocationAddress: true,
              createdAt: true,
              amount: true,
              createdTxHash: true
            },
            with: {
              mirror__Match: {
                columns: {
                  master: true,
                  sizeDelta: true,
                  requestKey: true,
                  isLong: true,
                  market: true
                },
                with: {
                  positionList: {
                    columns: {
                      amount: true,
                      puppet: true
                    }
                  },
                  mirror__AdjustList: {
                    columns: {
                      sizeDelta: true
                    }
                  },
                  settle__SettleList: {
                    columns: {
                      distributedAmount: true,
                      platformFeeAmount: true,
                      nextBalanceList: true,
                      transactionHash: true,
                      blockTimestamp: true
                    }
                  }
                }
              }
            }
          })

          return groupManyList(result, 'masterMatchingKey')
        })
      )

      // const matchingRuleQuery = map(async (params) => {
      //   const ruleList = params.collateralTokenList.map((collateralToken) => {
      //     const address = params.wallet.address

      //     if (address === undefined) return null

      //     return wallet.read({
      //       ...CONTRACT.Rule,
      //       functionName: 'getRuleList',
      //       args: [collateralToken, address]
      //     })
      //   })

      //   return Promise.all(ruleList)
      // }, combine({ collateralTokenList, wallet: wallet.account }))

      const displayParams = multicast(
        combine({
          accountQuery,
          userMatchingRuleQuery,
          positionLinkMapQuery,
          activityTimeframe,
          collateralTokenList
        })
      )

      return [
        $intermediatePromise({
          $display: map(async params => {
            const account = await params.accountQuery

            if (!account) {
              return $column(
                spacing.big,
                style({ padding: '24px', maxWidth: '600px', margin: '0 auto', width: '100%' })
              )($ConnectWalletCard({}))
            }

            const positionMap = await params.positionLinkMapQuery
            const matchingRuleList = await params.userMatchingRuleQuery
            const activeRouteList =
              params.collateralTokenList.length > 0 ? params.collateralTokenList : PUPPET_COLLATERAL_LIST

            const $activityStatus =
              positionMap === null
                ? empty
                : Object.keys(positionMap).length === 0
                  ? $column(style({ alignItems: 'center' }), spacing.small)(
                      $text(`No matching activity in the last ${getDuration(params.activityTimeframe)}`),
                      $infoLabel($text('Try adjusting filters like Activity timeframe or collateral tokens'))
                    )
                  : empty

            return $column(spacing.default)(
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

                    $activityStatus
                  )
                ),

                $column(spacing.default)(
                  ...activeRouteList.map(collateralToken => {
                    const matchingRuleListForToken = matchingRuleList.filter(
                      rule => rule.collateralToken === collateralToken
                    )

                    return $column(style({ paddingLeft: '16px' }))(
                      $row(
                        spacing.big
                        // style({ padding: '6px 0' })
                      )(
                        $RouteBalanceEditor({
                          draftDepositTokenList,
                          accountQuery,
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
                              : empty,
                            ...matchingRuleListForToken.map(rule => {
                              const masterMatchingKey = getMasterMatchingKey(collateralToken, rule.master)

                              const mirrorLinkList = positionMap?.[masterMatchingKey] || []

                              return $column(
                                $Popover({
                                  $open: filterNull(
                                    map(master => {
                                      if (master !== rule.master) {
                                        return null
                                      }

                                      return $MatchingRuleEditor({
                                        draftMatchingRuleList,
                                        model: rule,
                                        masterMatchingKey,
                                        collateralToken,
                                        master: rule.master
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
                                      click: popRouteSubscriptionEditorTether(constant(rule.master))
                                    }),
                                    $profileDisplay({
                                      address: rule.master
                                    }),
                                    $responsiveFlex(spacing.default, style({ flex: 1 }))(
                                      $infoLabeledValue(
                                        'Allowance Rate',
                                        $text(`${readablePercentage(rule.allowanceRate)}`)
                                      ),
                                      $infoLabeledValue('Expiry', readableDate(Number(rule.expiry))),
                                      $infoLabeledValue(
                                        'Throttle Duration',
                                        $text(`${getDuration(rule.throttleActivity)}`)
                                      )
                                    )
                                  )
                                })({}),
                                $text(
                                  `(${mirrorLinkList.length}) ${getTokenDescription(collateralToken).name} - ${
                                    rule.master
                                  }`
                                )
                              )
                            })
                          )
                        )
                      )
                    )
                  })
                )
              )
            )
          }, displayParams)
        }),

        {
          changeActivityTimeframe,
          selectCollateralTokenList,
          selectIndexTokenList,
          changeDepositTokenList,
          changeMatchRuleList
        }
      ]
    }
  )
