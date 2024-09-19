import { Behavior, replayLatest } from "@aelea/core"
import { $node, $text, component, style } from "@aelea/dom"
import { $column, $row, layoutSheet } from "@aelea/ui-components"
import { pallete } from "@aelea/ui-components-theme"
import { awaitPromises, debounce, empty, map, mergeArray, multicast, now, periodic, sample, snapshot, startWith } from "@most/core"
import { Stream } from "@most/types"
import { applyFactor, combineState, FACTOR_PERCISION, formatFixed, getDuration, getMappedValue, getVestingCursor, parseFixed, parseReadableNumber, readableTokenAmount, readableTokenAmountLabel, readableUnitAmount, switchMap } from "common-utils"
import { ARBITRUM_ADDRESS, TOKEN_DESCRIPTION_MAP } from "gmx-middleware-const"
import { EIP6963ProviderDetail } from "mipd"
import * as PUPPET from "puppet-middleware-const"
import { $ButtonToggle, $defaulButtonToggleContainer, $FieldLabeled, $infoLabeledValue, $infoTooltip, $infoTooltipLabel, $labeledhintAdjustment, intermediateText } from "ui-components"
import { uiStorage } from "ui-storage"
import * as viem from "viem"
import * as walletLink from "wallet"
import { $heading2, $heading3 } from "../common/$text"
import { $labeledDivider } from "../common/elements/$common"
import { store } from "../const/store"
import tokenomicsReader from "../logic/tokenomicsReader"
import { IComponentPageParams } from "../pages/type"
import { $Popover } from "./$Popover"
import { $defaultSliderThumb, $Slider, $sliderDefaultContainer } from "./$Slider"
import { $ButtonSecondary, $defaultMiniButtonSecondary } from "./form/$Button"
import { $SubmitBar } from "./form/$Form"

function calcDurationMultiplier(baseMultiplier: bigint, duration: bigint) {
  const numerator = baseMultiplier * duration ** 2n;

  return numerator / BigInt(PUPPET.MAX_LOCK_SCHEDULE ** 2);
}




interface IVestingDetails extends IComponentPageParams {
  puppetTokenPriceInUsd: Stream<bigint>
}


export const $Vest = (config: IVestingDetails) => component((
  [changeWallet, changeWalletTether]: Behavior<EIP6963ProviderDetail>,
  [requestTx, requestTxTether]: Behavior<walletLink.IWalletClient, any>,
  [checkCashoutMode, checkCashoutModeTether]: Behavior<boolean>,
  [changeScheduleFactor, changeScheduleFactorTether]: Behavior<number>,
  [popoverInputAmount, popoverInputAmountTether]: Behavior<string, bigint>,
  [popoverAddWallet, popoverAddWalletTether]: Behavior<any>,
  [popoverWithdrawLocked, popoverWithdrawLockedTether]: Behavior<any>,
  [popoverClickMaxDeposit, popoverClickMaxDepositTether]: Behavior<any>,
  [popoverRequestWithdraw, popoverRequestWithdrawTether]: Behavior<walletLink.IWalletClient, any>,
  [popoverSaveDepositAmount, popoverSaveDepositAmountTether]: Behavior<any, bigint>,
) => {

  const { providerClientQuery, walletClientQuery, puppetTokenPriceInUsd } = config


  const durationBaseMultiplierQuery = replayLatest(multicast(map(async walletQuery => {
    const wallet = await walletQuery

    if (!wallet) return 0n

    return tokenomicsReader.VotingEscrowLogic.baseMultiplier(wallet)
  }, walletClientQuery)))

  const baselineEmissionRateQuery = replayLatest(multicast(map(async walletQuery => {
    const wallet = await walletQuery

    if (!wallet) return 0n

    return tokenomicsReader.ContributeLogic.getConfig(wallet)
  }, walletClientQuery)))

  const claimableContributionQuery = replayLatest(multicast(map(async walletQuery => {
    const wallet = await walletQuery

    if (!wallet) return 0n

    return tokenomicsReader.ContributeLogic.getClaimable(wallet, [ARBITRUM_ADDRESS.USDC, ARBITRUM_ADDRESS.NATIVE_TOKEN], wallet.account.address)
  }, walletClientQuery)))
  const claimableLockRewardQuery = replayLatest(multicast(map(async walletQuery => {
    const wallet = await walletQuery

    if (!wallet) return 0n

    return tokenomicsReader.RewardLogic.getClaimable(wallet, wallet.account.address)
  }, walletClientQuery)))

  const lockAmountQuery = replayLatest(multicast(map(async walletQuery => {
    const wallet = await walletQuery

    if (!wallet) return 0n

    return tokenomicsReader.PuppetVoteToken.getBalanceOf(wallet, wallet.account.address)
  }, walletClientQuery)))

  const lockDurationQuery = replayLatest(multicast(map(async walletQuery => {
    const wallet = await walletQuery

    if (!wallet) return 0n

    return tokenomicsReader.VotingEscrowStore.getLockDuration(wallet, wallet.account.address)
  }, walletClientQuery)))

  const vestedCursorQuery = replayLatest(multicast(snapshot(async walletQuery => {
    const wallet = await walletQuery

    if (!wallet) return null

    const vested = await tokenomicsReader.VotingEscrowStore.getVested(wallet, wallet.account.address)
    return getVestingCursor(vested)
  }, walletClientQuery, periodic(1000))))


  const walletBalance = switchMap(async walletQuery => {
    const wallet = await walletQuery

    if (wallet == null) {
      return 0n
    }

    return tokenomicsReader.PuppetToken.getBalanceOf(wallet, wallet.account.address)
  }, walletClientQuery)


  const cashout = uiStorage.replayWrite(store.earnings, checkCashoutMode, 'cashout')
  const lockSchedule = switchMap(isCashout => {
    if (isCashout) return now(0)

    return mergeArray([
      uiStorage.replayWrite(store.earnings, debounce(250, changeScheduleFactor), 'scheduleFactor'),
      changeScheduleFactor,
    ])
  }, cashout)

  const includeDepositAmount = startWith(0n, popoverSaveDepositAmount)




  const claimableState = replayLatest(multicast(map(async params => {
    const claimableContributionReward = await params.claimableContributionQuery
    const claimableLockReward = await params.claimableLockRewardQuery
    const vested = await params.vestedCursorQuery
    const claimableVestedReward = vested?.accrued ?? 0n

    const totalClaimable = applyFactor(await params.baselineEmissionRateQuery, claimableContributionReward) + claimableLockReward + claimableVestedReward
    const lockAmountDelta = totalClaimable + params.includeDepositAmount
    const lockDurationDelta = BigInt(Math.floor(params.lockSchedule * PUPPET.MAX_LOCK_SCHEDULE))
    const vestedDurationBonusMultiplier = calcDurationMultiplier(await params.durationBaseMultiplierQuery, lockDurationDelta)
    const lockDurationBonusInVest = applyFactor(lockAmountDelta, vestedDurationBonusMultiplier)
    const vestedAmount = vested ? getVestingCursor(vested).accrued : 0n

    const lockAmount = await params.lockAmountQuery
    const lockDuration = await params.lockDurationQuery

    const nextLockAmount = lockAmount + lockAmountDelta
    const nextLockDuration = lockAmount > 0 ? (lockAmount * lockDuration + lockAmountDelta * lockDurationDelta) / nextLockAmount : lockDurationDelta

    return {
      cashout: params.cashout, lockAmount: await params.lockAmountQuery,
      vestedAmount, vested, totalClaimable, lockDuration, nextLockAmount, nextLockDuration, lockAmountDelta,
      claimableContributionReward, claimableLockReward, claimableVestedReward, lockDurationBonusInVest, lockDurationDelta, includeDepositAmount: params.includeDepositAmount
    }
  }, combineState({
    baselineEmissionRateQuery, durationBaseMultiplierQuery, lockSchedule, puppetTokenPriceInUsd, includeDepositAmount,
    claimableContributionQuery, claimableLockRewardQuery, vestedCursorQuery, cashout, lockAmountQuery, lockDurationQuery
  }))))

  // const sliderFactor = mergeArray([
  //   lockSchedule,
  //   changePopoverScheduleFactor
  // ])

  const slideDuration = map(factor => {
    return factor * PUPPET.MAX_LOCK_SCHEDULE
  }, lockSchedule)

  const lockedAmount = awaitPromises(lockAmountQuery)


  // `Voting Power (vePUPPET) Tokens are tokens that were locked minted and distributed to active participants as the protocol generates more revenue. For every dollar of revenue generated through Copy-Trading, earn a corresponding amount in PUPPET tokens.\nThere are 2 options to cater to different types of users:\n\nLock-In: lock your PUPPET for up to two years, Longer lockups yield greater rewards.\n\nCash-Out: For those who prefer immediate returns. immediately receive a portion of their revenue in PUPPET tokens.`

  return [
    $column(layoutSheet.spacing, style({ flex: 1 }))(

      $row(layoutSheet.spacing, style({ placeContent: 'space-between' }))(
        $row(style({ alignItems: 'center' }))(
          $heading3('Voting Power'),
          $infoTooltip(`The amount of PUPPET tokens locked. Granting protocol revenue share and governance voting power.`),
        ),
        $node(style({ flex: 1 }))(),
        $Popover({
          open: map(() => {
            const maxBalance = sample(lockedAmount, popoverClickMaxDeposit)
            const withdrawAmount = mergeArray([popoverInputAmount, maxBalance])

            return $column(layoutSheet.spacing, style({ width: '355px' }))(
              $text('Withdraw locked tokens through vesting. renounce Voting Power and Revenue share.'),
              $row(layoutSheet.spacingSmall, style({ position: 'relative' }))(
                $FieldLabeled({
                  label: 'Amount',
                  value: startWith('', map(amount => readableTokenAmount(TOKEN_DESCRIPTION_MAP.PUPPET, amount), maxBalance)),
                  placeholder: 'Enter amount',
                  hint: map(amount => `Balance: ${readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.PUPPET, amount)}`, lockedAmount),
                })({
                  change: popoverInputAmountTether(
                    map(amount => {
                      return parseFixed(TOKEN_DESCRIPTION_MAP.PUPPET.decimals, parseReadableNumber(amount))
                    })
                  )
                }),
                $ButtonSecondary({
                  $container: $defaultMiniButtonSecondary(style({ position: 'absolute', right: 0, bottom: '28px' })),
                  $content: $text('Max'),
                })({
                  click: popoverClickMaxDepositTether()
                })
              ),

              $SubmitBar({
                disabled: map(amount => amount === 0n, lockedAmount),
                spend: {
                  token: getMappedValue(PUPPET.CONTRACT, 42161).PuppetToken.address,
                  spender: getMappedValue(PUPPET.CONTRACT, 42161).Router.address,
                  amount: lockedAmount
                },
                txQuery: popoverRequestWithdraw,
                walletClientQuery,
                $submitContent: $text('Vest')
              })({
                changeWallet: changeWalletTether(),
                click: popoverRequestWithdrawTether(
                  snapshot(async (amount, wallet) => {
                    const rewardRouterContractDefs = getMappedValue(PUPPET.CONTRACT, wallet.chain.id).RewardRouter

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
            disabled: map(amount => amount === 0n, lockedAmount),
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

            return readableTokenAmount(TOKEN_DESCRIPTION_MAP.PUPPET, params.nextLockAmount)
          }, claimableState),
          $val: $text(switchMap(async amount => readableTokenAmount(TOKEN_DESCRIPTION_MAP.PUPPET, await amount), lockAmountQuery)),
        })
      ),
      style({ placeContent: 'space-between' })(
        $labeledhintAdjustment({
          tooltip: 'The amount of time your tokens are locked. Locking additional tokens with a different duration will average the lockup duration.',
          label: 'Lock Duration',
          color: now(pallete.positive),
          change: switchMap(async (paramsQuery) => {
            const params = await paramsQuery
            if (params.cashout) return ''

            return getDuration(Number(params.nextLockDuration))
          }, claimableState),
          $val: $text(
            switchMap(async durationQuery => {
              return getDuration(Number(await durationQuery))
            }, lockDurationQuery)
          ),
        })
      ),
      style({ placeContent: 'space-between' })(
        $labeledhintAdjustment({
          tooltip: `The vested amount increases either receiving locking duration bonus as vested tokens or vesting existing locked tokens.  `,
          label: 'Vested',
          color: now(pallete.positive),
          change: switchMap(async (paramsQuery) => {
            const params = await paramsQuery
            if (params.lockDurationBonusInVest == 0n) return ''

            return readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.PUPPET, params.vestedAmount + params.lockDurationBonusInVest)
          }, claimableState),
          $val: $text(
            switchMap(async vestedQuery => {
              const vested = await vestedQuery
              if (vested === null) return '0'

              return readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.PUPPET, vested.amount - vested.accrued)
            }, vestedCursorQuery)
          ),
        })
      ),


      $node(),

      $labeledDivider(
        $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
          $infoTooltip('lock PUPPET for up to two years, Longer lockups yield greater rewards. different duration will average the lockup duration.'),
          $ButtonToggle({
            $container: $defaulButtonToggleContainer(style({ placeSelf: 'center' })),
            options: [false, true],
            selected: cashout,
            $$option: map(isCashout => {
              if (isCashout) {
                return $text('Cash-Out')
              }

              return $text('Lock-In')
            }),
          })({
            select: checkCashoutModeTether()
          }),
          $infoTooltip(`Receive the claimable amount directly to wallet.`),
        ),
        false
      ),

      $node(),

      $column(layoutSheet.spacing)(

        switchMap(isCashout => {
          if (isCashout) return empty()

          const walletLockAmount = startWith(0n, popoverSaveDepositAmount)
          return $column(layoutSheet.spacing)(
            $row(layoutSheet.spacingBig)(
              $infoTooltipLabel(
                'The bonus % applied to the total claimable amount. the bonus amount will undergo vesting and released over the picked duration',
                'Vesting Bonus'
              ),
              $Slider({
                $container: $sliderDefaultContainer(style({ flex: 1 })),
                // color: map(val => colorAlpha(pallete.positive, val), slideDuration),
                disabled: map(val => val === true, cashout),
                value: lockSchedule,
                $thumb: $defaultSliderThumb(style({ width: '60px', height: '32px' }))(
                  $text(style({ fontWeight: 'bold' }))(
                    switchMap((durationMultiplier) => {
                      return map(duration => {
                        const factor = formatFixed(FACTOR_PERCISION, durationMultiplier) * ((duration ** 2 / PUPPET.MAX_LOCK_SCHEDULE ** 2) * 100)

                        return `${readableUnitAmount(factor)}%`
                      }, slideDuration)
                    }, awaitPromises(durationBaseMultiplierQuery))
                  )
                )
              })({
                change: changeScheduleFactorTether(),
              }),
            ),
            $row(layoutSheet.spacingBig, style({ placeContent: 'space-between' }))(
              $infoTooltipLabel(
                'Include wallet tokens to Lock-In together with claimable rewards if present',
                'Wallet'
              ),

              $row(layoutSheet.spacing, style({ alignItems: 'center' }))(
                $Popover({
                  open: map(() => {
                    const maxBalance = sample(walletBalance, popoverClickMaxDeposit)

                    return $column(layoutSheet.spacing)(
                      $row(layoutSheet.spacingSmall, style({ position: 'relative' }))(
                        $FieldLabeled({
                          label: 'Amount',
                          value: startWith('', map(amount => readableTokenAmount(TOKEN_DESCRIPTION_MAP.PUPPET, amount), maxBalance)),
                          placeholder: 'Enter amount',
                          hint: map(amount => `Balance: ${readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.PUPPET, amount)}`, walletBalance),
                        })({
                          change: popoverInputAmountTether(
                            map(amount => {
                              return parseFixed(TOKEN_DESCRIPTION_MAP.PUPPET.decimals, parseReadableNumber(amount))
                            })
                          )
                        }),
                        $ButtonSecondary({
                          $container: $defaultMiniButtonSecondary(style({ position: 'absolute', right: 0, bottom: '28px' })),
                          $content: $text('Max'),
                        })({
                          click: popoverClickMaxDepositTether()
                        })
                      ),

                      $row(
                        $node(style({ flex: 1 }))(),
                        $ButtonSecondary({
                          $content: $text('Save'),
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
                    disabled: map(amount => amount === 0n, walletBalance),
                    $content: $text('Add')
                  })({
                    click: popoverAddWalletTether()
                  }),
                  dismiss: popoverSaveDepositAmount
                })({}),
                $text(style({ placeContent: 'space-between' }))(map(amount => readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.PUPPET, amount), walletLockAmount))
              )
            )
          )
        }, cashout),

        style({ placeContent: 'space-between' })(
          $infoLabeledValue(
            $text('Claimable'),

            $text(style({ placeContent: 'space-between', fontWeight: 'bold', color: pallete.positive }))(intermediateText(
              map(async params => {
                return '+' + readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.PUPPET, params.totalClaimable)
              }, awaitPromises(claimableState))
            )),
          )
        ),


        // style({ placeContent: 'space-between' })(
        //   $infoLabeledValue(
        //     $text('Copy-Trading'),

        //     $text(style({ placeContent: 'space-between', color: pallete.positive }))(intermediateText(
        //       map(async amount => {
        //         return '+' + readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.PUPPET, await amount)
        //       }, claimableContributionRewardQuery)
        //     )),
        //   )
        // ),

        // style({ placeContent: 'space-between' })(
        //   $infoLabeledValue(
        //     $text('Vested releases'),
        //     $text(style({ placeContent: 'space-between', color: pallete.positive }))(intermediateText(
        //       map(async amount => {
        //         return '+' + readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.PUPPET, await amount)
        //       }, vestedAccruedQuery)
        //     ))
        //   )
        // ),

        // style({ placeContent: 'space-between' })(
        //   $infoLabeledValue(
        //     $text('Voting Power emissions'),

        //     $text(style({ placeContent: 'space-between', color: pallete.positive }))(intermediateText(
        //       map(async amount => {
        //         return '+' + readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.PUPPET, await amount)
        //       }, claimableLockRewardQuery)
        //     )),
        //   )
        // ),




      ),


      $SubmitBar({
        disabled: map(params => params.lockAmountDelta === 0n, awaitPromises(claimableState)),
        spend: {
          token: getMappedValue(PUPPET.CONTRACT, 42161).PuppetToken.address,
          spender: getMappedValue(PUPPET.CONTRACT, 42161).Router.address,
          amount: awaitPromises(claimableContributionQuery)
        },
        $container: $row(style({ width: '415px' })),
        txQuery: requestTx,
        walletClientQuery,
        $submitContent: $text(map(mode => mode ? 'Cash-Out' : `Lock-In`, cashout))
      })({
        changeWallet: changeWalletTether(),
        click: requestTxTether(
          snapshot(async (paramsQuery, wallet) => {
            const params = await paramsQuery
            const callStack: viem.Hex[] = []

            const rewardRouterContractDefs = getMappedValue(PUPPET.CONTRACT, wallet.chain.id).RewardRouter


            if (params.claimableContributionReward > 0) {
              callStack.push(
                viem.encodeFunctionData({
                  ...rewardRouterContractDefs,
                  functionName: 'claimContribution',
                  args: [[ARBITRUM_ADDRESS.USDC, ARBITRUM_ADDRESS.NATIVE_TOKEN], wallet.account.address, params.claimableContributionReward]
                })
              )
            }

            if (params.claimableLockReward > 0) {
              callStack.push(
                viem.encodeFunctionData({
                  ...rewardRouterContractDefs,
                  functionName: 'claimEmission',
                  args: [wallet.account.address, params.claimableLockReward]
                })
              )
            }

            if (params.claimableVestedReward > 0) {
              callStack.push(
                viem.encodeFunctionData({
                  ...rewardRouterContractDefs,
                  functionName: 'claimVested',
                  args: [wallet.account.address, params.claimableVestedReward]
                })
              )
            }

            if (params.lockDurationDelta > 0) {
              callStack.push(
                viem.encodeFunctionData({
                  ...rewardRouterContractDefs,
                  functionName: 'lock',
                  args: [params.lockAmountDelta, params.lockDurationDelta]
                })
              )
            }


            const writeQuery = walletLink.writeContract({
              ...rewardRouterContractDefs,
              walletClient: wallet,
              functionName: 'multicall',
              args: [callStack],
            })

            return writeQuery
          }, claimableState)
        )
      })

    ),

    {
      changeWallet,
    }
  ]
})


