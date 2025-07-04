import {
  awaitPromises,
  constant,
  debounce,
  empty,
  map,
  mergeArray,
  multicast,
  now,
  periodic,
  sample,
  snapshot,
  startWith
} from '@most/core'
import * as PUPPET from '@puppet-copy/middleware/const'
import {
  $ButtonToggle,
  $defaulButtonToggleContainer,
  $FieldLabeled,
  $infoLabeledValue,
  $infoTooltip,
  $infoTooltipLabel,
  $labeledhintAdjustment,
  intermediateText
} from '@puppet-copy/middleware/ui-components'
import { uiStorage } from '@puppet-copy/middleware/ui-storage'
import {
  applyFactor,
  formatFixed,
  getDuration,
  getMappedValue,
  parseFixed,
  parseReadableNumber,
  readableTokenAmount,
  readableTokenAmountLabel,
  readableUnitAmount
} from '@puppet-copy/middleware/utils'
import { $node, $text, combineState, component, type IBehavior, replayLatest, style, switchMap } from 'aelea/core'
import { $column, $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { EIP6963ProviderDetail } from 'mipd'
import type { Address } from 'viem/accounts'
import { encodeFunctionData } from 'viem/utils'
import { $heading3 } from '../../common/$text.js'
import { $card, $labeledDivider, $responsiveFlex } from '../../common/elements/$common.js'
import { $IntermediateConnectButton } from '../../components/$ConnectWallet.js'
import { $Popover } from '../../components/$Popover.js'
import { $defaultSliderThumb, $Slider, $sliderDefaultContainer } from '../../components/$Slider.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../../components/form/$Button.js'
import { $SubmitBar } from '../../components/form/$SubmitBar.js'
import type { IDepositEditorDraft } from '../../components/portfolio/$DepositEditor.js'
import type { IMatchingRuleEditorDraft } from '../../components/portfolio/$MatchingRuleEditor.js'
import { localStore } from '../../const/localStore.js'
import tokenomicsReader from '../../logic/tokenomicsReader.js'
import { wallet } from '../../wallet/wallet.js'
import { IWalletTab } from '../type.js'
import { $WalletPuppet } from './$PortfolioPuppet.js'

const optionDisplay = {
  [IWalletTab.EARN]: {
    label: 'Earn',
    url: '/earn'
  },
  [IWalletTab.PUPPET]: {
    label: 'Puppet',
    url: '/puppet'
  },
  [IWalletTab.TRADER]: {
    label: 'Trader',
    url: '/trader'
  }
}

interface IWalletPageParams {}

export const $PortfolioPage = ({
  draftDepositTokenList,
  draftMatchingRuleList,
  matchingRuleQuery
}: IWalletPageParams) =>
  component(
    (
      [changeRoute, changeRouteTether]: IBehavior<string, string>,
      [selectProfileMode, selectProfileModeTether]: IBehavior<IWalletTab>,

      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<any, PUPPET.IntervalTime>,
      [selectCollateralTokenList, selectCollateralTokenListTether]: IBehavior<Address[]>,

      [changeWallet, changeWalletTether]: IBehavior<any, EIP6963ProviderDetail | null>,

      [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<IMatchingRuleEditorDraft[]>,
      [changeDepositTokenList, changeDepositTokenListTether]: IBehavior<IDepositEditorDraft[]>,

      [requestTx, requestTxTether]: IBehavior<IWalletClient, any>,
      [checkCashoutMode, checkCashoutModeTether]: IBehavior<boolean>,
      [changeScheduleFactor, changeScheduleFactorTether]: IBehavior<number>,
      [popoverInputAmount, popoverInputAmountTether]: IBehavior<string, bigint>,
      [popoverAddWallet, popoverAddWalletTether]: IBehavior<any>,
      [popoverWithdrawLocked, popoverWithdrawLockedTether]: IBehavior<any>,
      [popoverClickMaxDeposit, popoverClickMaxDepositTether]: IBehavior<any>,
      [popoverRequestWithdraw, popoverRequestWithdrawTether]: IBehavior<IWalletClient, any>,
      [popoverSaveDepositAmount, popoverSaveDepositAmountTether]: IBehavior<any, bigint>
    ) => {
      const profileMode = uiStorage.replayWrite(localStore.wallet, selectProfileMode, 'selectedTab')

      const puppetTokenPriceInUsd = switchMap(async (providerQuery) => {
        const _provider = await providerQuery

        return 0n
      }, wallet.account)

      const durationBaseMultiplierQuery = replayLatest(
        multicast(
          map(async (walletQuery) => {
            const wallet = await walletQuery

            if (!wallet) return 0n

            return tokenomicsReader.VotingEscrowLogic.baseMultiplier(wallet)
          }, wallet.account)
        )
      )

      const baselineEmissionRateQuery = replayLatest(
        multicast(
          map(async (walletQuery) => {
            const wallet = await walletQuery

            if (!wallet) return 0n

            return tokenomicsReader.ContributeLogic.getConfig(wallet)
          }, wallet.account)
        )
      )

      const claimableContributionQuery = replayLatest(
        multicast(
          map(async (walletQuery) => {
            const wallet = await walletQuery

            if (!wallet) return 0n

            return tokenomicsReader.ContributeLogic.getClaimable(
              wallet,
              [PUPPET.ARBITRUM_ADDRESS.USDC, PUPPET.ARBITRUM_ADDRESS.NATIVE_TOKEN],
              wallet.account.address
            )
          }, wallet.account)
        )
      )
      const claimableLockRewardQuery = replayLatest(
        multicast(
          map(async (walletQuery) => {
            const wallet = await walletQuery

            if (!wallet) return 0n

            return tokenomicsReader.RewardLogic.getClaimable(wallet, wallet.address)
          }, wallet.account)
        )
      )

      const lockAmountQuery = replayLatest(
        multicast(
          map(async (walletQuery) => {
            const wallet = await walletQuery

            if (!wallet) return 0n

            return tokenomicsReader.PuppetVoteToken.getBalanceOf(wallet, wallet.address)
          }, wallet.account)
        )
      )

      const lockDurationQuery = replayLatest(
        multicast(
          map(async (walletQuery) => {
            const wallet = await walletQuery

            if (!wallet) return 0n

            return tokenomicsReader.VotingEscrowStore.getLockDuration(wallet, wallet.account.address)
          }, wallet.account)
        )
      )

      const vestedCursorQuery = replayLatest(
        multicast(
          snapshot(
            async (walletQuery) => {
              const wallet = await walletQuery

              if (!wallet) return null

              const vested = await tokenomicsReader.VotingEscrowStore.getVested(wallet, wallet.account.address)
              return getVestingCursor(vested)
            },

            periodic(1000)
          )
        )
      )

      const walletBalance = switchMap(async (walletQuery) => {
        const wallet = await walletQuery

        if (wallet == null) {
          return 0n
        }

        return tokenomicsReader.PuppetToken.getBalanceOf(wallet, wallet.account.address)
      }, wallet.account)

      const cashout = uiStorage.replayWrite(localStore.earnings, checkCashoutMode, 'cashout')
      const lockSchedule = switchMap((isCashout) => {
        if (isCashout) return now(0)

        return mergeArray([
          uiStorage.replayWrite(localStore.earnings, debounce(250, changeScheduleFactor), 'scheduleFactor'),
          changeScheduleFactor
        ])
      }, cashout)

      const includeDepositAmount = startWith(0n, popoverSaveDepositAmount)

      const claimableState = replayLatest(
        multicast(
          map(
            async (params) => {
              const claimableContributionReward = await params.claimableContributionQuery
              const claimableLockReward = await params.claimableLockRewardQuery
              const vested = await params.vestedCursorQuery
              const claimableVestedReward = vested?.accrued ?? 0n

              const totalClaimable =
                applyFactor(await params.baselineEmissionRateQuery, claimableContributionReward) +
                claimableLockReward +
                claimableVestedReward
              const lockAmountDelta = totalClaimable + params.includeDepositAmount
              const lockDurationDelta = BigInt(Math.floor(params.lockSchedule * PUPPET.MAX_LOCK_SCHEDULE))
              const vestedDurationBonusMultiplier = calcDurationMultiplier(
                await params.durationBaseMultiplierQuery,
                lockDurationDelta
              )
              const lockDurationBonusInVest = applyFactor(lockAmountDelta, vestedDurationBonusMultiplier)
              const vestedAmount = vested ? getVestingCursor(vested).accrued : 0n

              const lockAmount = await params.lockAmountQuery
              const lockDuration = await params.lockDurationQuery

              const nextLockAmount = lockAmount + lockAmountDelta
              const nextLockDuration =
                lockAmount > 0
                  ? (lockAmount * lockDuration + lockAmountDelta * lockDurationDelta) / nextLockAmount
                  : lockDurationDelta

              return {
                cashout: params.cashout,
                lockAmount: await params.lockAmountQuery,
                vestedAmount,
                vested,
                totalClaimable,
                lockDuration,
                nextLockAmount,
                nextLockDuration,
                lockAmountDelta,
                claimableContributionReward,
                claimableLockReward,
                claimableVestedReward,
                lockDurationBonusInVest,
                lockDurationDelta,
                includeDepositAmount: params.includeDepositAmount
              }
            },
            combineState({
              baselineEmissionRateQuery,
              durationBaseMultiplierQuery,
              lockSchedule,
              puppetTokenPriceInUsd,
              includeDepositAmount,
              claimableContributionQuery,
              claimableLockRewardQuery,
              vestedCursorQuery,
              cashout,
              lockAmountQuery,
              lockDurationQuery
            })
          )
        )
      )

      // const sliderFactor = mergeArray([
      //   lockSchedule,
      //   changePopoverScheduleFactor
      // ])

      const slideDuration = map((factor) => {
        return factor * PUPPET.MAX_LOCK_SCHEDULE
      }, lockSchedule)

      const lockedAmount = awaitPromises(lockAmountQuery)

      return [
        $column(spacing.big)(
          $node(),

          $row(style({ flex: 1, placeContent: 'center' }))(
            $IntermediateConnectButton({
              $$display: map((_wallet) => {
                // return empty()
                return $ButtonSecondary({
                  $content: $text('Disconnect')
                })({
                  click: changeWalletTether(constant(null))
                })
              })
            })({
              changeWallet: changeWalletTether()
            })
          ),

          $row(
            $node(style({ flex: 1 }))(),
            $ButtonToggle({
              $container: $defaulButtonToggleContainer(style({ alignSelf: 'center' })),
              value: profileMode,
              optionList: [IWalletTab.PUPPET, IWalletTab.TRADER],
              $$option: map((option) => {
                return $text(optionDisplay[option].label)
              })
            })({ select: selectProfileModeTether() }),
            $node(style({ flex: 1 }))()
          ),

          switchMap((params) => {
            const _address = switchMap(async (walletQuery) => {
              return (await walletQuery)?.account.address || PUPPET.ADDRESS_ZERO
            }, wallet.account)

            if (params.profileMode === IWalletTab.PUPPET) {
              // return $text('Puppet')
              // const puppetTradeRouteListQuery = queryPuppetTradeRoute(subgraphClient, { address, activityTimeframe, collateralToken })

              return $WalletPuppet({
                route,
                pricefeedMapQuery,
                activityTimeframe,
                selectedCollateralTokenList,
                providerClientQuery,
                matchingRuleList,
                draftDepositTokenList: depositTokenList
              })({
                changeWallet: changeWalletTether(),
                changeRoute: changeRouteTether(),
                changeActivityTimeframe: changeActivityTimeframeTether(),
                selectCollateralTokenList: selectCollateralTokenListTether(),
                changeDepositTokenList: changeDepositTokenListTether(),
                changeMatchRuleList: changeMatchRuleListTether()
              })
            }
            if (params.profileMode === IWalletTab.TRADER) {
              return $text('Trader (WIP)')
              // const settledPositionListQuery = queryPosition(subgraphClient, { activityTimeframe, collateralTokenList, address })
              // const openPositionListQuery = queryPosition(subgraphClient, { address, collateralTokenList })

              // return $column(spacing.tiny)(
              //   $TraderPage({ ...config, positionListQuery })({
              //     changeActivityTimeframe: changeActivityTimeframeTether(),
              //   })
              // )
            }

            return $column(spacing.big)(
              // $row(spacing.big, style({ alignItems: 'flex-end' }))(
              //   $metricRow(
              //     $Popover({
              //       open: map(() => {
              //         const maxBalance = sample(lockedAmount, popoverClickMaxDeposit)
              //         const withdrawAmount = mergeArray([popoverInputAmount, maxBalance])

              //         return $column(spacing.default, style({ width: '355px' }))(
              //           $text('Withdraw locked tokens through vesting. renounce Voting Power and Revenue share.'),
              //           $row(spacing.small, style({ position: 'relative' }))(
              //             $FieldLabeled({
              //               label: 'Amount',
              //               value: startWith('', map(amount => readableTokenAmount(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, amount), maxBalance)),
              //               placeholder: 'Enter amount',
              //               hint: map(amount => `Balance: ${readableTokenAmountLabel(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, amount)}`, lockedAmount),
              //             })({
              //               change: popoverInputAmountTether(
              //                 map(amount => {
              //                   return parseFixed(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET.decimals, parseReadableNumber(amount))
              //                 })
              //               )
              //             }),
              //             $ButtonSecondary({
              //               $container: $defaultMiniButtonSecondary(style({ position: 'absolute', right: 0, bottom: '28px' })),
              //               $content: $text('Max'),
              //             })({
              //               click: popoverClickMaxDepositTether()
              //             })
              //           ),

              //           $SubmitBar({
              //             disabled: map(amount => amount === 0n, lockedAmount),
              //             spend: {
              //               token: getMappedValue(PUPPET.CONTRACT, 42161).PuppetToken.address,
              //               spender: getMappedValue(PUPPET.CONTRACT, 42161).Router.address,
              //               amount: lockedAmount
              //             },
              //             txQuery: popoverRequestWithdraw,
              //
              //             $submitContent: $text('Vest')
              //           })({
              //             changeWallet: changeWalletTether(),
              //             click: popoverRequestWithdrawTether(
              //               snapshot(async (amount, wallet) => {
              //                 const rewardRouterContractDefs = getMappedValue(PUPPET.CONTRACT, wallet.chain.id).TokenomicsRouter

              //                 return walletLink.writeContract({
              //                   ...rewardRouterContractDefs,
              //                   walletClient: wallet,
              //                   functionName: 'vest',
              //                   args: [amount, wallet.account.address]
              //                 })
              //               }, withdrawAmount)
              //             )
              //           })
              //         )
              //       }, popoverWithdrawLocked),
              //       $target: $ButtonSecondary({
              //         $container: $defaultMiniButtonSecondary,
              //         disabled: map(amount => amount === 0n, lockedAmount),
              //         $content: $text('Withdraw')
              //       })({
              //         click: popoverWithdrawLockedTether()
              //       }),
              //       dismiss: popoverSaveDepositAmount
              //     })({}),
              //     $labeledhintAdjustment({
              //       color: now(pallete.positive),
              //       change: switchMap(async (paramsQuery) => {
              //         const params = await paramsQuery
              //         if (params.cashout) return ''

              //         return readableTokenAmount(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, params.nextLockAmount)
              //       }, claimableState),
              //       $val: $text(switchMap(async amount => readableTokenAmount(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, await amount), lockAmountQuery)),
              //     }),
              //     $metricLabel($text('Voting Power'))
              //   ),
              //   // $metricRow(
              //   //   $heading2(intermediateText(
              //   //     map(async summaryQuery => {
              //   //       const summary = await summaryQuery

              //   //       return readableLeverage(summary.avgSize, summary.avgCollateral)
              //   //     }, metricsQuery)
              //   //   )),
              //   //   $metricLabel($text('Avg Leverage'))
              //   // )
              // ),

              $card(
                spacing.big,
                style({ maxWidth: '600px', width: '100%', alignSelf: 'center' })
              )(
                $responsiveFlex(spacing.big)(
                  $column(spacing.default, style({ flex: 1 }))(
                    $row(spacing.default, style({ placeContent: 'space-between' }))(
                      $row(style({ alignItems: 'center' }))(
                        $heading3($text('Voting Power')),
                        $infoTooltip(
                          'The amount of PUPPET tokens locked. Granting protocol revenue share and governance voting power.'
                        )
                      ),
                      $node(style({ flex: 1 }))(),
                      $Popover({
                        $open: map(() => {
                          const maxBalance = sample(lockedAmount, popoverClickMaxDeposit)
                          const withdrawAmount = mergeArray([popoverInputAmount, maxBalance])

                          return $column(spacing.default, style({ width: '355px' }))(
                            $text('Withdraw locked tokens through vesting. renounce Voting Power and Revenue share.'),
                            $row(spacing.small, style({ position: 'relative' }))(
                              $FieldLabeled({
                                label: 'Amount',
                                value: startWith(
                                  '',
                                  map(
                                    (amount) => readableTokenAmount(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, amount),
                                    maxBalance
                                  )
                                ),
                                placeholder: 'Enter amount',
                                hint: map(
                                  (amount) =>
                                    `Balance: ${readableTokenAmountLabel(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, amount)}`,
                                  lockedAmount
                                )
                              })({
                                change: popoverInputAmountTether(
                                  map((amount) => {
                                    return parseFixed(
                                      PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET.decimals,
                                      parseReadableNumber(amount)
                                    )
                                  })
                                )
                              }),
                              $ButtonSecondary({
                                $container: $defaultMiniButtonSecondary(
                                  style({ position: 'absolute', right: 0, bottom: '28px' })
                                ),
                                $content: $text('Max')
                              })({
                                click: popoverClickMaxDepositTether()
                              })
                            ),

                            $SubmitBar({
                              disabled: map((amount) => amount === 0n, lockedAmount),
                              spend: {
                                token: getMappedValue(PUPPET.CONTRACT, 42161).PuppetToken.address,
                                spender: getMappedValue(PUPPET.CONTRACT, 42161).Router.address,
                                amount: lockedAmount
                              },
                              txQuery: popoverRequestWithdraw,

                              $submitContent: $text('Vest')
                            })({
                              changeWallet: changeWalletTether(),
                              submit: popoverRequestWithdrawTether(
                                snapshot(async (amount, wallet) => {
                                  const rewardRouterContractDefs = getMappedValue(
                                    PUPPET.CONTRACT,
                                    wallet.chain.id
                                  ).TokenomicsRouter

                                  return walletLink.writeContract({
                                    ...rewardRouterContractDefs,
                                    walletClient: wallet,
                                    functionName: 'vest',
                                    args: [amount, wallet.account.address]
                                  })
                                }, withdrawAmount)
                              )
                            })
                          )
                        }, popoverWithdrawLocked),
                        $target: $ButtonSecondary({
                          $container: $defaultMiniButtonSecondary,
                          disabled: map((amount) => amount === 0n, lockedAmount),
                          $content: $text('Withdraw')
                        })({
                          click: popoverWithdrawLockedTether()
                        }),
                        dismiss: popoverSaveDepositAmount
                      })({}),
                      $labeledhintAdjustment({
                        color: now(pallete.positive),
                        change: switchMap(async (paramsQuery) => {
                          const params = await paramsQuery
                          if (params.cashout) return ''

                          return readableTokenAmount(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, params.nextLockAmount)
                        }, claimableState),
                        $val: $text(
                          switchMap(
                            async (amount) =>
                              readableTokenAmount(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, await amount),
                            lockAmountQuery
                          )
                        )
                      })
                    ),
                    style({ placeContent: 'space-between' })(
                      $labeledhintAdjustment({
                        tooltip:
                          'The amount of time your tokens are locked. Locking additional tokens with a different duration will average the lockup duration.',
                        label: 'Lock Duration',
                        color: now(pallete.positive),
                        change: switchMap(async (paramsQuery) => {
                          const params = await paramsQuery
                          if (params.cashout) return ''

                          return getDuration(Number(params.nextLockDuration))
                        }, claimableState),
                        $val: $text(
                          switchMap(async (durationQuery) => {
                            return getDuration(Number(await durationQuery))
                          }, lockDurationQuery)
                        )
                      })
                    ),
                    style({ placeContent: 'space-between' })(
                      $labeledhintAdjustment({
                        tooltip:
                          'The vested amount increases either receiving locking duration bonus as vested tokens or vesting existing locked tokens.  ',
                        label: 'Vested',
                        color: now(pallete.positive),
                        change: switchMap(async (paramsQuery) => {
                          const params = await paramsQuery
                          if (params.lockDurationBonusInVest === 0n) return ''

                          return readableTokenAmountLabel(
                            PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET,
                            params.vestedAmount + params.lockDurationBonusInVest
                          )
                        }, claimableState),
                        $val: $text(
                          switchMap(async (vestedQuery) => {
                            const vested = await vestedQuery
                            if (vested === null) return '0'

                            return readableTokenAmountLabel(
                              PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET,
                              vested.amount - vested.accrued
                            )
                          }, vestedCursorQuery)
                        )
                      })
                    ),

                    $node(),

                    $labeledDivider(
                      $row(spacing.default, style({ alignItems: 'center' }))(
                        $infoTooltip(
                          'lock PUPPET for up to two years, Longer lockups yield greater rewards. different duration will average the lockup duration.'
                        ),
                        $ButtonToggle({
                          $container: $defaulButtonToggleContainer(style({ placeSelf: 'center' })),
                          optionList: [false, true],
                          value: cashout,
                          $$option: map((isCashout) => {
                            if (isCashout) {
                              return $text('Cash-Out')
                            }

                            return $text('Lock-In')
                          })
                        })({
                          select: checkCashoutModeTether()
                        }),
                        $infoTooltip('Receive the claimable amount directly to wallet.')
                      ),
                      false
                    ),

                    $node(),

                    $column(spacing.default)(
                      switchMap((isCashout) => {
                        if (isCashout) return empty()

                        const walletLockAmount = startWith(0n, popoverSaveDepositAmount)
                        return $column(spacing.default)(
                          $row(spacing.big)(
                            $infoTooltipLabel(
                              'The bonus % applied to the total claimable amount. the bonus amount will undergo vesting and released over the picked duration',
                              'Vesting Bonus'
                            ),
                            $Slider({
                              $container: $sliderDefaultContainer(style({ flex: 1 })),
                              // color: map(val => colorAlpha(pallete.positive, val), slideDuration),
                              disabled: map((val) => val === true, cashout),
                              value: lockSchedule,
                              $thumb: $defaultSliderThumb(style({ width: '60px', height: '32px' }))(
                                $text(style({ fontWeight: 'bold' }))(
                                  switchMap((durationMultiplier) => {
                                    return map((duration) => {
                                      const factor =
                                        formatFixed(PUPPET.USD_DECIMALS, durationMultiplier) *
                                        ((duration ** 2 / PUPPET.MAX_LOCK_SCHEDULE ** 2) * 100)

                                      return `${readableUnitAmount(factor)}%`
                                    }, slideDuration)
                                  }, awaitPromises(durationBaseMultiplierQuery))
                                )
                              )
                            })({
                              change: changeScheduleFactorTether()
                            })
                          ),
                          $row(spacing.big, style({ placeContent: 'space-between' }))(
                            $infoTooltipLabel(
                              'Include wallet tokens to Lock-In together with claimable rewards if present',
                              'Wallet'
                            ),

                            $row(spacing.default, style({ alignItems: 'center' }))(
                              $Popover({
                                $open: map(() => {
                                  const maxBalance = sample(walletBalance, popoverClickMaxDeposit)

                                  return $column(spacing.default)(
                                    $row(spacing.small, style({ position: 'relative' }))(
                                      $FieldLabeled({
                                        label: 'Amount',
                                        value: startWith(
                                          '',
                                          map(
                                            (amount) =>
                                              readableTokenAmount(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, amount),
                                            maxBalance
                                          )
                                        ),
                                        placeholder: 'Enter amount',
                                        hint: map(
                                          (amount) =>
                                            `Balance: ${readableTokenAmountLabel(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, amount)}`,
                                          walletBalance
                                        )
                                      })({
                                        change: popoverInputAmountTether(
                                          map((amount) => {
                                            return parseFixed(
                                              PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET.decimals,
                                              parseReadableNumber(amount)
                                            )
                                          })
                                        )
                                      }),
                                      $ButtonSecondary({
                                        $container: $defaultMiniButtonSecondary(
                                          style({ position: 'absolute', right: 0, bottom: '28px' })
                                        ),
                                        $content: $text('Max')
                                      })({
                                        click: popoverClickMaxDepositTether()
                                      })
                                    ),

                                    $row(
                                      $node(style({ flex: 1 }))(),
                                      $ButtonSecondary({
                                        $content: $text('Save')
                                      })({
                                        click: popoverSaveDepositAmountTether(
                                          sample(mergeArray([popoverInputAmount, maxBalance]))
                                        )
                                      })
                                    )
                                  )
                                }, popoverAddWallet),
                                $target: $ButtonSecondary({
                                  $container: $defaultMiniButtonSecondary,
                                  disabled: map((amount) => amount === 0n, walletBalance),
                                  $content: $text('Add')
                                })({
                                  click: popoverAddWalletTether()
                                }),
                                dismiss: popoverSaveDepositAmount
                              })({}),
                              $text(style({ placeContent: 'space-between' }))(
                                map(
                                  (amount) =>
                                    readableTokenAmountLabel(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, amount),
                                  walletLockAmount
                                )
                              )
                            )
                          )
                        )
                      }, cashout),

                      style({ placeContent: 'space-between' })(
                        $infoLabeledValue(
                          $text('Claimable'),

                          $text(style({ placeContent: 'space-between', fontWeight: 'bold', color: pallete.positive }))(
                            intermediateText(
                              map(async (params) => {
                                return (
                                  '+' +
                                  readableTokenAmountLabel(
                                    PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET,
                                    params.totalClaimable
                                  )
                                )
                              }, awaitPromises(claimableState))
                            )
                          )
                        )
                      )

                      // style({ placeContent: 'space-between' })(
                      //   $infoLabeledValue(
                      //     $text('Copy-Trading'),

                      //     $text(style({ placeContent: 'space-between', color: pallete.positive }))(intermediateText(
                      //       map(async amount => {
                      //         return '+' + readableTokenAmountLabel(TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, await amount)
                      //       }, claimableContributionRewardQuery)
                      //     )),
                      //   )
                      // ),

                      // style({ placeContent: 'space-between' })(
                      //   $infoLabeledValue(
                      //     $text('Vested releases'),
                      //     $text(style({ placeContent: 'space-between', color: pallete.positive }))(intermediateText(
                      //       map(async amount => {
                      //         return '+' + readableTokenAmountLabel(TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, await amount)
                      //       }, vestedAccruedQuery)
                      //     ))
                      //   )
                      // ),

                      // style({ placeContent: 'space-between' })(
                      //   $infoLabeledValue(
                      //     $text('Voting Power emissions'),

                      //     $text(style({ placeContent: 'space-between', color: pallete.positive }))(intermediateText(
                      //       map(async amount => {
                      //         return '+' + readableTokenAmountLabel(TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, await amount)
                      //       }, claimableLockRewardQuery)
                      //     )),
                      //   )
                      // ),
                    ),

                    $SubmitBar({
                      disabled: map((params) => params.lockAmountDelta === 0n, awaitPromises(claimableState)),
                      spend: {
                        token: getMappedValue(PUPPET.CONTRACT, 42161).PuppetToken.address,
                        spender: getMappedValue(PUPPET.CONTRACT, 42161).Router.address,
                        amount: awaitPromises(claimableContributionQuery)
                      },
                      $container: $row,
                      txQuery: requestTx,

                      $submitContent: $text(map((mode) => (mode ? 'Cash-Out' : 'Lock-In'), cashout))
                    })({
                      changeWallet: changeWalletTether(),
                      submit: requestTxTether(
                        snapshot(async (paramsQuery, wallet) => {
                          const params = await paramsQuery
                          const callStack: Hex[] = []

                          const contractDefs = getMappedValue(PUPPET.CONTRACT, wallet.chain.id).TokenomicsRouter

                          if (params.claimableContributionReward > 0) {
                            callStack.push(
                              encodeFunctionData({
                                ...contractDefs,
                                functionName: 'claimContribution',
                                args: [
                                  [PUPPET.ARBITRUM_ADDRESS.USDC, PUPPET.ARBITRUM_ADDRESS.NATIVE_TOKEN],
                                  wallet.account.address,
                                  params.claimableContributionReward
                                ]
                              })
                            )
                          }

                          if (params.claimableLockReward > 0) {
                            callStack.push(
                              encodeFunctionData({
                                ...contractDefs,
                                functionName: 'claimEmission',
                                args: [wallet.account.address, params.claimableLockReward]
                              })
                            )
                          }

                          if (params.claimableVestedReward > 0) {
                            callStack.push(
                              encodeFunctionData({
                                ...contractDefs,
                                functionName: 'claimVested',
                                args: [wallet.account.address, params.claimableVestedReward]
                              })
                            )
                          }

                          if (params.lockDurationDelta > 0) {
                            callStack.push(
                              encodeFunctionData({
                                ...contractDefs,
                                functionName: 'lock',
                                args: [params.lockAmountDelta, params.lockDurationDelta]
                              })
                            )
                          }

                          const writeQuery = walletLink.writeContract({
                            ...contractDefs,
                            walletClient: wallet,
                            functionName: 'multicall',
                            args: [callStack]
                          })

                          return writeQuery
                        }, claimableState)
                      )
                    })
                  )

                  // $seperator2,
                  // $column(spacing.default, style({ flex: 1 }))(
                  //   $row(style({ alignItems: 'center' }))(
                  //     $heading3('Protocol Flywheel'),
                  //     $infoTooltip(`Puppet's smart contracts integrate a simple emissions model. Tokens are minted and rewarded as the protocol's revenue grows, aligning token supply with actual usage.\nFor every dollar of revenue generated through Copy-Trading, earn a corresponding amount in PUPPET tokens.`),
                  //   ),
                  //   // style({ placeContent: 'space-between' })(
                  //   //   $infoLabeledValue(
                  //   //     'Price',
                  //   //     $intermediateText(
                  //   //       map(async puppetPrice => {
                  //   //         const price = puppetPrice * getDenominator(24)

                  //   //         return readableUsd(price)
                  //   //       }, puppetTokenPriceInUsd)
                  //   //     )
                  //   //   )
                  //   // ),
                  //   style({ placeContent: 'space-between' })(
                  //     $infoLabeledValue(
                  //       $infoTooltipLabel(`Protocol revenue from Copy-trading is used to buy back PUPPET tokens. This is done through public contract auctions. The bought-back tokens are then distributed to lockers based on proportionally to their Voting Power`, 'Revenue Bought-back'),
                  //       $row(spacing.small, style({ alignItems: 'center' }))(
                  //         // $text(style({ color: pallete.foreground, fontSize: '1.1rem' }))(readableTokenAmount(TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, BigInt(1e18))),
                  //         $text(readableTokenAmountLabel(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, BigInt(1e18)))
                  //       ),
                  //     )
                  //   ),
                  //   style({ placeContent: 'space-between' })(
                  //     $infoLabeledValue(
                  //       $infoTooltipLabel(`Tokens are minted and distributed to active participants as the protocol generates more revenue. This ensures that the token supply directly reflects the protocol's growth and usage`, 'Total Rewarded'),
                  //       $intermediateText(
                  //         map(async providerQuery => {
                  //           const provider = await providerQuery
                  //           const puppetSupply = tokenomics.PuppetToken.getTotalSupply(provider)

                  //           return readableTokenAmount(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, await puppetSupply - PUPPET.INITIAL_SUPPLY)
                  //         }, providerClientQuery)
                  //       ),
                  //     )
                  //   ),
                  //   // style({ placeContent: 'space-between' })(
                  //   //   $infoLabeledValue(
                  //   //     $infoTooltipLabel('The total value of all PUPPET in circulation', 'Market Cap'),
                  //   //     $text('10,000,000'),
                  //   //   )
                  //   // ),
                  //   $seperator2,
                  //   style({ placeContent: 'space-between' })(
                  //     $infoLabeledValue(
                  //       $text('Locked In (vePUPPET)'),
                  //       $intermediateText(
                  //         map(async providerQuery => {
                  //           const provider = await providerQuery
                  //           // const totalSupply = await tokenomics.PuppetToken.totalSupply(provider)
                  //           const vTokenSupply = await tokenomics.PuppetVoteToken.getTotalSupply(provider)

                  //           return `${readableTokenAmount(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, vTokenSupply)}`
                  //         }, providerClientQuery)
                  //       ),
                  //     )
                  //   )
                  // ),
                )
              )
            )
          }, combineState({ profileMode })),

          $node()

          // $ContributionTooling(config)({})
        ),

        {
          changeActivityTimeframe,
          selectCollateralTokenList,
          changeRoute,
          changeWallet,
          changeMatchRuleList,
          changeDepositTokenList
        }
      ]
    }
  )

// function $ContributionTooling(config: IPageParams) {
//   return component((
//     [inputDepositAmount, inputDepositAmountTether]: IBehavior<string, bigint>,
//     [submitContribute, submitContributeTether]: IBehavior<walletLink.IWalletClient, any>,

//     [inputBuybackAmount, inputBuybackAmountTether]: IBehavior<string, bigint>,
//     [submitBuyback, submitBuybackTether]: IBehavior<walletLink.IWalletClient, any>

//   ) => {

//     const walletBalance = switchMap(async (walletQuery) => {
//       const wallet = await walletQuery

//       if (wallet == null) {
//         return 0n
//       }

//       return readAddressTokenBalance(wallet, PUPPET.ARBITRUM_ADDRESS.USDC, wallet.account.address)
//     }, config.wallet.account)

//     const contributedUsdcQuery = switchMap(async (wallet.account) => {
//       const wallet = await wallet.account

//       if (wallet == null) {
//         return 0n
//       }

//       return tokenomics.ContributeStore.getCursorBalance(wallet, PUPPET.ARBITRUM_ADDRESS.USDC)
//     }, config.wallet.account)

//     const usdcBuybackQuote = map(async (wallet.account) => {
//       const wallet = await wallet.account

//       if (wallet == null) {
//         return 0n
//       }

//       return tokenomics.ContributeStore.getBuybackQuote(wallet, PUPPET.ARBITRUM_ADDRESS.USDC)
//     }, config.wallet.account)

//     return [
//       $card(spacing.big, style({ placeSelf: 'center', maxWidth: '600px', width: '100%', flex: 1 }))(
//         $heading2('Contribution Tooling (Testnet)'),
//         $seperator2,

//         $column(spacing.default)(
//           $text('Contribute USDC to the Protocol'),
//           $FieldLabeled({
//             label: 'Amount',
//             placeholder: 'Enter amount',
//             hint: map(amount => `Balance: ${readableTokenAmountLabel(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.USDC, amount)}`, walletBalance),
//           })({
//             change: inputDepositAmountTether(map(value => {
//               return parseFixed(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.USDC.decimals, value)
//             }))
//           })
//         ),

//         $SubmitBar({
//           spend: {
//             token: PUPPET.ARBITRUM_ADDRESS.USDC,
//             spender: getMappedValue(PUPPET.CONTRACT, 42161).Router.address,
//           },
//           txQuery: submitContribute,
//           wallet.account: config.
//           $submitContent: $text('User Contribute USDC'),
//         })({
//           // changeWallet: changeWalletTether(),
//           click: submitContributeTether(
//             snapshot(async (params, wallet) => {
//               return walletLink.writeContract({
//                 ...getMappedValue(PUPPET.CONTRACT, wallet.chain.id).StubPublicContribute,
//                 walletClient: wallet,
//                 functionName: 'contribute',
//                 args: [PUPPET.ARBITRUM_ADDRESS.USDC, params.inputDepositAmount] as const
//               })
//             }, combineState({ inputDepositAmount }))
//           )
//         }),

//         $seperator2,
//         $text('Swap your PUPPET tokens in return for USDC accrued from contributions'),

//         $infoLabeledValue(
//           $text('Accrued USDC for sale'),
//           $text(map(amount => `${readableTokenAmountLabel(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.USDC, amount)}`, contributedUsdcQuery))
//         ),
//         $infoLabeledValue(
//           $text('Offered Quote'),
//           $intermediateText(
//             map(async (durationQuery) => {
//               return readableTokenAmountLabel(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.PUPPET, await durationQuery)
//             }, usdcBuybackQuote)
//           )
//         ),

//         $column(spacing.default)(
//           $FieldLabeled({
//             label: 'Amount',
//             placeholder: 'Enter amount'
//           })({
//             change: inputBuybackAmountTether(map(value => {
//               return parseFixed(PUPPET.TOKEN_SYMBOL_DESCRIPTION_MAP.USDC.decimals, parseReadableNumber(value))
//             }))
//           })
//         ),

//         $SubmitBar({
//           spend: {
//             token: getMappedValue(PUPPET.CONTRACT, 42161).PuppetToken.address,
//             spender: getMappedValue(PUPPET.CONTRACT, 42161).Router.address,
//           },
//           txQuery: submitBuyback,
//           wallet.account: config.
//           $submitContent: $text('Buyback'),
//         })({
//           // changeWallet: changeWalletTether(),
//           click: submitBuybackTether(
//             snapshot(async (params, wallet) => {

//               return walletLink.writeContract({
//                 ...getMappedValue(PUPPET.CONTRACT, wallet.chain.id).TokenomicsRouter,
//                 walletClient: wallet,
//                 functionName: 'buyback',
//                 args: [PUPPET.ARBITRUM_ADDRESS.USDC, wallet.account.address, params.inputBuybackAmount]
//               })
//             }, combineState({ inputBuybackAmount }))
//           )
//         })

//       ),
//     ]
//   })
// }

function calcDurationMultiplier(baseMultiplier: bigint, duration: bigint) {
  const numerator = baseMultiplier * duration ** 2n

  return numerator / BigInt(PUPPET.MAX_LOCK_SCHEDULE ** 2)
}
