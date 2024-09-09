import { Behavior, combineObject, replayLatest } from "@aelea/core"
import { $node, $text, component, style } from "@aelea/dom"
import { $column, $row, layoutSheet } from "@aelea/ui-components"
import { pallete } from "@aelea/ui-components-theme"
import { awaitPromises, debounce, map, mergeArray, multicast, now, periodic, snapshot } from "@most/core"
import { Stream } from "@most/types"
import { applyFactor, combineState, getDuration, getMappedValue, getVestingCursor, readableTokenAmountLabel, readableUnitAmount, switchMap, unixTimestampNow } from "common-utils"
import { ARBITRUM_ADDRESS, TOKEN_DESCRIPTION_MAP } from "gmx-middleware-const"
import { EIP6963ProviderDetail } from "mipd"
import * as PUPPET from "puppet-middleware-const"
import { $ButtonToggle, $defaulButtonToggleContainer, $infoLabeledValue, $infoTooltip, $infoTooltipLabel, $labeledhintAdjustment, intermediateText } from "ui-components"
import { uiStorage } from "ui-storage"
import * as viem from "viem"
import * as walletLink from "wallet"
import { $heading2 } from "../common/$text"
import { $labeledDivider } from "../common/elements/$common"
import { store } from "../const/store"
import tokenomicsReader from "../logic/tokenomicsReader"
import { IComponentPageParams } from "../pages/type"
import { $defaultSliderThumb, $Slider } from "./$Slider"
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

    return tokenomicsReader.ContributeLogic.baselineEmissionRate(wallet)
  }, walletClientQuery)))

  const claimableContributionQuery = replayLatest(multicast(map(async walletQuery => {
    const wallet = await walletQuery

    if (!wallet) return 0n

    return tokenomicsReader.ContributeLogic.claimable(wallet, [ARBITRUM_ADDRESS.USDC, ARBITRUM_ADDRESS.NATIVE_TOKEN], wallet.account.address)
  }, walletClientQuery)))
  const claimableLockRewardQuery = replayLatest(multicast(map(async walletQuery => {
    const wallet = await walletQuery

    if (!wallet) return 0n

    return tokenomicsReader.RewardLogic.claimable(wallet, wallet.account.address)
  }, walletClientQuery)))

  const lockAmountQuery = replayLatest(multicast(map(async walletQuery => {
    const wallet = await walletQuery

    if (!wallet) return 0n

    return tokenomicsReader.PuppetVoteToken.balanceOf(wallet, wallet.account.address)
  }, walletClientQuery)))

  const lockDurationQuery = replayLatest(multicast(map(async walletQuery => {
    const wallet = await walletQuery

    if (!wallet) return 0n

    return tokenomicsReader.VotingEscrowStore.lockDuration(wallet, wallet.account.address)
  }, walletClientQuery)))

  const vestedCursorQuery = replayLatest(multicast(snapshot(async walletQuery => {
    const wallet = await walletQuery

    if (!wallet) return null

    const vested = await tokenomicsReader.VotingEscrowStore.vested(wallet, wallet.account.address)
    return getVestingCursor(vested)
  }, walletClientQuery, periodic(1000))))





  const cashout = uiStorage.replayWrite(store.earnings, checkCashoutMode, 'cashout')
  const lockSchedule = switchMap(isCashout => {
    if (isCashout) return now(0)

    return mergeArray([
      uiStorage.replayWrite(store.earnings, debounce(250, changeScheduleFactor), 'scheduleFactor'),
      changeScheduleFactor,
    ])
  }, cashout)




  const claimableState = replayLatest(multicast(map(async params => {
    const claimableContributionReward = await params.claimableContributionQuery
    const claimableLockReward = await params.claimableLockRewardQuery
    const vested = await params.vestedCursorQuery
    const claimableVestedReward = vested?.accrued ?? 0n

    const totalClaimable = applyFactor(await params.baselineEmissionRateQuery, claimableContributionReward) + claimableLockReward + claimableVestedReward
    const lockDurationDelta = BigInt(Math.floor(params.lockSchedule * PUPPET.MAX_LOCK_SCHEDULE))
    const vestedDurationBonusMultiplier = calcDurationMultiplier(await params.durationBaseMultiplierQuery, lockDurationDelta)
    const lockDurationBonusInVest = applyFactor(totalClaimable, vestedDurationBonusMultiplier)
    const vestedAmount = vested ? getVestingCursor(vested).accrued : 0n

    const lockAmount = await params.lockAmountQuery
    const lockDuration = await params.lockDurationQuery

    const nextLockAmount = lockAmount + totalClaimable
    const nextLockDuration = lockAmount > 0 ? (lockAmount * lockDuration + totalClaimable * lockDurationDelta) / nextLockAmount : lockDurationDelta


    return {
      cashout: params.cashout, lockAmount: await params.lockAmountQuery,
      vestedAmount, vested, totalClaimable, lockDuration, nextLockAmount, nextLockDuration,
      claimableContributionReward, claimableLockReward, claimableVestedReward, lockDurationBonusInVest, lockDurationDelta
    }
  }, combineState({
    baselineEmissionRateQuery, durationBaseMultiplierQuery, lockSchedule, puppetTokenPriceInUsd,
    claimableContributionQuery, claimableLockRewardQuery, vestedCursorQuery, cashout, lockAmountQuery, lockDurationQuery
  }))))

  // const sliderFactor = mergeArray([
  //   lockSchedule,
  //   changePopoverScheduleFactor
  // ])

  const slideDuration = map(factor => {
    return factor * PUPPET.MAX_LOCK_SCHEDULE
  }, lockSchedule)



  return [
    $column(layoutSheet.spacing, style({ flex: 1 }))(

      style({ alignItems: 'center' })(
        $row(
          $heading2('Locked'),
          $infoTooltip(`Tokens are minted and distributed to active participants as the protocol generates more revenue. For every dollar of revenue generated through Copy-Trading, earn a corresponding amount in PUPPET tokens.\nThere are 2 options to cater to different types of users:\n\nLock-In: lock your PUPPET for up to two years, Longer lockups yield greater rewards.\n\nCash-Out: For those who prefer immediate returns. immediately receive a portion of their revenue in PUPPET tokens`)

          // style({ placeContent: 'space-between' })(
          //   $infoLabeledValue(
          //     $text('Switch Plan'),
          //     $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(


          //       $Popover({
          //         open: map(params => {
          //           const initMaintainState = take(1, map(maintain => maintain || maintain === null, compoundMode))
          //           const popoverMaintainSchedule = mergeArray([initMaintainState, changePopoverMaintainSchedule])

          //           return $column(layoutSheet.spacing, style({ width: '350px' }))(
          //             $ButtonToggle({
          //               $container: $defaulButtonToggleContainer(style({ placeSelf: 'center' })),
          //               options: [true, false],
          //               selected: popoverMaintainSchedule,
          //               $$option: map(value => $text(value ? 'Compound' : 'Custom')),
          //             })({
          //               select: changePopoverMaintainScheduleTether()
          //             }),

          //             switchMap(maintain => {
          //               if (maintain) {
          //                 return $column(layoutSheet.spacing)(
          //                   $text('Maximize rewards by compounding new rewards and maintaining 2 year lockup. this will increase your vested rewards and voting power emissions.'),

          //                   // $element('ul')(layoutSheet.spacing, style({}))(
          //                   //   $element('li')(style({ marginBottom: '10px' }))(
          //                   //     $text(`Copy-trading`)
          //                   //   ),
          //                   //   $element('li')(style({ marginBottom: '10px' }))(
          //                   //     $text(`Voting Power emissions`)
          //                   //   ),
          //                   //   $element('li')(style({ marginBottom: '10px' }))(
          //                   //     $text(`Vested releases`)
          //                   //   ),
          //                   // ),


          //                   $row(layoutSheet.spacing, style({ alignItems: 'center' }))(
          //                     // $text('You can switch plan at any time.'),
          //                     $node(style({ flex: 1 }))(),
          //                     $ButtonSecondary({
          //                       $content: $text('Save')
          //                     })({
          //                       click: savePopoverLockScheduleTether(
          //                         checkCompoundModeTether(constant(true))
          //                       )
          //                     }),
          //                   )
          //                 )
          //               }

          //               const sliderFactor = mergeArray([
          //                 lockSchedule,
          //                 changePopoverScheduleFactor
          //               ])

          //               const slideDuration = map(factor => {
          //                 return factor * PUPPET.MAX_LOCK_SCHEDULE
          //               }, sliderFactor)

          //               return $column(layoutSheet.spacing)(
          //                 $text('Set a custom duration for the claimable rewards. this plan will adjust average your lockup duration'),


          //                 // $Checkbox({ label: 'Claim Lock Rewards', value: claimLockRewards })({
          //                 //   check: toggleClaimRevenueRewardTether()
          //                 // }),
          //                 // $Checkbox({ label: 'Copy-Trading', value: compoundLockReward })({
          //                 //   check: changeCompoundLockRewardTether()
          //                 // }),
          //                 // $Checkbox({ label: 'Voting Power emissions', value: compoundLockReward })({
          //                 //   check: changeCompoundLockRewardTether()
          //                 // }),
          //                 // // $Checkbox({ label: 'Claim Vested Rewards', value: claimLockRewards })({
          //                 // //   check: toggleClaimRevenueRewardTether()
          //                 // // }),
          //                 // $Checkbox({ label: 'Vested releases', value: compoundVestedReward })({
          //                 //   check: changeCompoundVestedRewardTether()
          //                 // }),

          //                 $Slider({
          //                   color: map(val => colorAlpha(pallete.positive, val), sliderFactor),
          //                   disabled: map(val => val === true, compoundMode),
          //                   value: sliderFactor,
          //                   $thumb: $defaultSliderThumb(style({ width: '60px' }))(
          //                     $text(map(duration => {
          //                       return `${readableUnitAmount((duration ** 2 / PUPPET.MAX_LOCK_SCHEDULE ** 2) * 100)}%`
          //                     }, slideDuration))
          //                   )
          //                 })({
          //                   change: changePopoverScheduleFactorTether(),
          //                 }),
          //                 // $Slider({
          //                 //   color: map(val => colorAlpha(pallete.positive, val), sliderFactor),
          //                 //   disabled: map(val => val === true, maintainSchedule),
          //                 //   value: sliderFactor,
          //                 // })({
          //                 //   change: changePopoverScheduleFactorTether(),
          //                 // }),

          //                 $row(layoutSheet.spacing, style({ alignItems: 'center' }))(
          //                   $row(style({ alignItems: 'center' }))(
          //                     $node(style({ flex: 1 }))(
          //                       $infoLabeledValue(
          //                         'Duration',
          //                         $text(map(time => getDuration(time), slideDuration))
          //                       )
          //                     )
          //                   ),
          //                   $node(style({ flex: 1 }))(),

          //                   $ButtonSecondary({
          //                     $content: $text('Save')
          //                   })({
          //                     click: savePopoverLockScheduleTether(
          //                       changeScheduleFactorTether(sample(changePopoverScheduleFactor)),
          //                       checkCompoundModeTether(constant(false))
          //                     )
          //                   }),
          //                 )
          //               )
          //             }, popoverMaintainSchedule),

          //           )
          //         }, overlayClick),
          //         dismiss: savePopoverLockSchedule,
          //         $target: $ButtonSecondary({
          //           $container: $defaultMiniButtonSecondary,
          //           $content: switchMap(maintain => {
          //             if (maintain === null) {
          //               return $text(style({ color: pallete.indeterminate }))('None')
          //             }

          //             return $text(maintain ? 'Compound' : 'Custom')
          //           }, compoundMode)
          //         })({
          //           click: overlayClickTether()
          //         })
          //       })({
          //         // overlayClick: overlayClickTether()
          //       }),

          //     ),
          //   )
          // ),
        )
      ),



      style({ placeContent: 'space-between' })(
        $labeledhintAdjustment({
          tooltip: `Voting Power is the amount of voting power you have in the governance system. higher Voting Power tokens yield more rewards.`,
          label: 'Voting Power',
          color: now(pallete.positive),
          change: switchMap(async (paramsQuery) => {
            const params = await paramsQuery
            if (params.cashout) return ''

            return readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.vePUPPET, params.nextLockAmount)
          }, claimableState),
          $val: $text(
            switchMap(async amount => {
              return readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.vePUPPET, await amount)
            }, lockAmountQuery)
          ),
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
          $infoTooltip('Lock additional tokens. different duration will average the lockup duration.'),
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
          $infoTooltip(`Receive the claimable tokens directly to your wallet.`),
        ),
        false
      ),

      $node(),

      $infoLabeledValue(
        $text('Duration'),

        $column(style({ width: '100%', marginLeft: '30px' }))(
          $Slider({
            $container: $defaultSliderThumb(style({ flex: 1 })),
            // color: map(val => colorAlpha(pallete.positive, val), slideDuration),
            disabled: map(val => val === true, cashout),
            value: lockSchedule,
            $thumb: $defaultSliderThumb(style({ width: '60px' }))(
              $text(
                switchMap((durationMultiplier) => {
                  return map(duration => {
                    durationMultiplier
                    return `${readableUnitAmount((duration ** 2 / PUPPET.MAX_LOCK_SCHEDULE ** 2) * 100)}%`
                  }, slideDuration)
                }, awaitPromises(durationBaseMultiplierQuery))
              )
            )
          })({
            change: changeScheduleFactorTether(),
          })
        ),
      ),

      $column(layoutSheet.spacing)(
        style({ placeContent: 'space-between' })(
          $infoLabeledValue(
            $text('Claimable'),

            $text(style({ placeContent: 'space-between', color: pallete.positive }))(intermediateText(
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
        disabled: map(params => params.totalClaimable === 0n, awaitPromises(claimableState)),
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
                  args: [params.totalClaimable, params.lockDuration]
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


