import { Behavior, combineObject, replayLatest } from "@aelea/core"
import { $node, $text, component, style } from "@aelea/dom"
import { $column, $row, layoutSheet } from "@aelea/ui-components"
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import { combine, constant, map, mergeArray, multicast, now, sample, snapshot, startWith, take } from "@most/core"
import { Stream } from "@most/types"
import { BASIS_POINTS_DIVISOR, IntervalTime, combineState, filterNull, getMappedValue, readableDate, readableTokenAmountLabel, switchMap, unixTimestampNow } from "common-utils"
import { ARBITRUM_ADDRESS } from "gmx-middleware-const"
import { getTokenDescription } from "gmx-middleware-utils"
import { EIP6963ProviderDetail } from "mipd"
import * as PUPPET from "puppet-middleware-const"
import { $ButtonToggle, $defaulButtonToggleContainer, $hintAdjustment, $infoLabeledValue, $intermediateMessage } from "ui-components"
import { uiStorage } from "ui-storage"
import * as viem from "viem"
import * as walletLink from "wallet"
import { $heading3 } from "../common/$text"
import { store } from "../const/store"
import { readUserGeneratedRevenue, readUserLockDetails } from "../logic/commonRead.js"
import { IComponentPageParams, SelectedOption } from "../pages/type"
import { $Popover } from "./$Popover"
import { $Slider } from "./$Slider"
import { $ButtonSecondary, $defaultMiniButtonSecondary } from "./form/$Button"
import { $SubmitBar } from "./form/$Form"




interface IVestingDetails extends IComponentPageParams {
  puppetTokenPriceInUsd: Stream<bigint>
}



export const $VestingDetails = (config: IVestingDetails) => component((
  [changeWallet, changeWalletTether]: Behavior<EIP6963ProviderDetail>,

  [overlayClick, overlayClickTether]: Behavior<any>,
  [requestTx, requestTxTether]: Behavior<walletLink.IWalletClient, any>,

  [changePopoverScheduleFactor, changePopoverScheduleFactorTether]: Behavior<any, number>,
  [changePopoverMaintainSchedule, changePopoverMaintainScheduleTether]: Behavior<boolean>,
  [savePopoverLockSchedule, savePopoverLockScheduleTether]: Behavior<any>,

    
  [checkMaintainSchedule, checkMaintainScheduleTether]: Behavior<any, boolean | null>,
  [changeScheduleFactor, changeScheduleFactorTether]: Behavior<number>,
  [changeOptionMode, changeOptionModeTether]: Behavior<SelectedOption>,
  [toggleClaimRevenueReward, toggleClaimRevenueRewardTether]: Behavior<boolean>,
) => {

  const { providerClientQuery, walletClientQuery, puppetTokenPriceInUsd } = config

  const lockDetails = replayLatest(multicast(map(async walletQuery => {
    const wallet = await walletQuery

    if (!wallet) return { amount: 0n, end: 0n }

    return readUserLockDetails(wallet, wallet?.account.address)
  }, walletClientQuery)))


  const userGeneratedRevenueInUsdQuery = map(async walletQuery => {
    const wallet = await walletQuery
    if (!wallet) return 0n

    return await readUserGeneratedRevenue(wallet, wallet.account.address)
  }, walletClientQuery)



  const readVestingLockSchedule = switchMap(async lock => (await lock).end, lockDetails)

  const maintainSchedule = uiStorage.replayWrite(store.wallet, checkMaintainSchedule, 'maintainSchedule')
  const claimRevenueReward = uiStorage.replayWrite(store.wallet, toggleClaimRevenueReward, 'claimRevenue')
  const option = uiStorage.replayWrite(store.wallet, changeOptionMode, 'option')

  const lockSchedule: Stream<number | null> = switchMap(isMax => {
    if (isMax) {
      return now(unixTimestampNow() + PUPPET.MAX_LOCKUP_SCHEDULE)
    }

    return startWith(null, map(Number, changeScheduleFactor)) 
  }, maintainSchedule)


  const maxRewardTokenAmount = map(params => {
    const rewardAmount = 100000000000000000000n

    return rewardAmount
  }, combineObject({ puppetTokenPriceInUsd, userGeneratedRevenueInUsdQuery }))


  const vestingState = combineState({ maintainSchedule, lockSchedule, claimRevenueReward, option, puppetTokenPriceInUsd })



  return [
    $column(layoutSheet.spacing, style({ flex: 1 }))(
      $heading3('Vesting Schedule'),
      style({ placeContent: 'space-between' })(
        $infoLabeledValue(
          $text('Locked'),
          $intermediateMessage(
            map(async lockQuery => {
              return readableTokenAmountLabel(PUPPET.PUPPET_TOKEN_DESCRIPTION, (await lockQuery).amount)
            }, lockDetails)
          ),
        )
      ),
      style({ placeContent: 'space-between' })(
        $infoLabeledValue(
          $text('Schedule'),
          $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
            $hintAdjustment({
              change: map(readableDate, filterNull(lockSchedule)),
              val: map(val => {
                if (val === 0n) {
                  return 'None'
                }

                return readableDate(Number(val))
              }, readVestingLockSchedule),
            }),
            
            $Popover({
              open: map(params => {
                const initMaintainState = take(1, map(maintain => maintain || maintain === null, maintainSchedule))
                const popoverMaintainSchedule = mergeArray([initMaintainState, changePopoverMaintainSchedule])

                return $column(layoutSheet.spacing, style({ width: '350px' }))(
                  $ButtonToggle({
                    $container: $defaulButtonToggleContainer(style({ placeSelf: 'center' })),
                    options: [true, false],
                    selected: popoverMaintainSchedule,
                    $$option: map(value => $text(value ? 'Maximize' : 'Short Term')),
                  })({
                    select: changePopoverMaintainScheduleTether()
                  }),
 
                  switchMap(maintain => {
                    if (maintain) {
                      return $column(layoutSheet.spacing)(
                        $text('Maximize your rewards and voting power, this will re-lock your tokens for 2 years every time you claim your rewards.'),
                        $text('You can switch to short term any time.'),

                        $row(layoutSheet.spacing, style({ alignItems: 'center' }))(
                          $node(style({ flex: 1 }))(),
                          $ButtonSecondary({
                            $content: $text('Save')
                          })({ 
                            click: savePopoverLockScheduleTether(
                              checkMaintainScheduleTether(constant(true))
                            )
                          }),
                        )
                      )
                    }

                    const sliderFactor = mergeArray([
                      map(val => {
                        if (val === 0n) {
                          return 0.5
                        }

                        const durationElapsed = unixTimestampNow() - Number(val)

                        return Number(PUPPET.MAX_LOCKUP_SCHEDULE) / durationElapsed
                      }, readVestingLockSchedule),
                      changePopoverScheduleFactor
                    ])

                    const slideDate = map(factor => {
                      const duration = factor * Number(PUPPET.MAX_LOCKUP_SCHEDULE)
                      const time = Math.floor((unixTimestampNow() + duration) / IntervalTime.DAY7) * IntervalTime.DAY7
                      return time
                    }, sliderFactor)

                    return $column(layoutSheet.spacing)(
                      $text('Lock your tokens for up to maxium of 2 years. rewards and voting power will decay with time.'),
                      $Slider({
                        color: map(val => colorAlpha(pallete.positive, val), sliderFactor),
                        disabled: map(val => val === true, maintainSchedule),
                        value: sliderFactor,
                      })({
                        change: changePopoverScheduleFactorTether(),
                      }),

                      $row(layoutSheet.spacing, style({ alignItems: 'center' }))(
                        $row(style({ alignItems: 'center' }))(
                          $node(style({ flex: 1 }))(
                            $infoLabeledValue(
                              'End Date:',
                              $text(map(time => readableDate(time), slideDate))
                            )
                          )
                        ),
                        $node(style({ flex: 1 }))(),
                      
                        $ButtonSecondary({
                          $content: $text('Save')
                        })({ 
                          click: savePopoverLockScheduleTether(
                            changeScheduleFactorTether(sample(slideDate)),
                            checkMaintainScheduleTether(constant(false))
                          )
                        }),
                      )
                    )
                  }, popoverMaintainSchedule),

                )
              }, overlayClick),
              dismiss: savePopoverLockSchedule,
              $target: $ButtonSecondary({
                $container: $defaultMiniButtonSecondary,
                $content: switchMap(maintain => {
                  if (maintain === null) {
                    return $text(style({ color: pallete.indeterminate }))('None')
                  }

                  return $text(maintain ? 'Maximize' : 'Short Term')
                }, maintainSchedule)
              })({
                click: overlayClickTether()
              })
            })({
              // overlayClick: overlayClickTether()
            }),
            
          ),
        )
      ),

      style({ placeContent: 'space-between' })(
        $infoLabeledValue(
          $text('Lock Revenue'),
          $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
            // $Checkbox({ label: 'Claim', value: claimRevenueReward })({
            //   check: toggleClaimRevenueRewardTether()
            // }),
            $text(style({ color: pallete.positive }))('+' + readableTokenAmountLabel(getTokenDescription(ARBITRUM_ADDRESS.USDC), 23000000n)),
          )
        )
      ),
      
      
      // $seperator2,

      // style({ placeContent: 'space-between' })(
      //   $infoLabeledValue(
      //     $infoTooltipLabel(
      //       $text('Reinvest your rewards to compound your earnings and increase your voting power.'),
      //       $text('Contributed Revenue')
      //     ),
      //     // readUserGeneratedRevenue()
      //     $intermediateMessage(
      //       map(async amountQuery => {
      //         const amount = await amountQuery
      //         return readableTokenAmountLabel(getTokenDescription(ARBITRUM_ADDRESS.USDC), amount)
      //       }, userGeneratedRevenueInUsdQuery)
      //     ),
      //   ),
      // ),

      $row(style({ placeContent: 'center' }))(
        $ButtonToggle({
        // $container: $defaulButtonToggleContainer(style({ flexDirection: 'column', placeSelf: 'center' })),
          options: [SelectedOption.LOCK, SelectedOption.EXIT],
          selected: option,
          $$option: combine((selected, value) => {
          // userGeneratedRevenueInUsdQuery

            const rewardAmount = readableTokenAmountLabel(PUPPET.PUPPET_TOKEN_DESCRIPTION, 100000000000000000000n)

            return $row(layoutSheet.spacingSmall)(
              $text(String(value)),
              $text(style({ color: pallete.positive, opacity: selected === value ? '' : '.5' }))(
                rewardAmount
              )
            // $pnlDisplay(10n ** 30n * 15n) : style({ opacity: .25 })($pnlDisplay(10n ** 30n * 15n))
            )
          }, option),
        })({
          select: changeOptionModeTether()
        })
      ),
      // style({ placeContent: 'space-between' })( 
      //   $infoLabeledValue(
      //     $infoTooltipLabel(
      //       $text('Reinvest your rewards to compound your earnings and increase your voting power.'),
      //       $text('Reward')
      //     ),
      //     $ButtonToggle({
      //       // $container: $defaulButtonToggleContainer(style({ flexDirection: 'column', placeSelf: 'center' })),
      //       options: [SelectedOption.LOCK, SelectedOption.EXIT],
      //       selected: option,
      //       $$option: combine((selected, value) => {
      //         // userGeneratedRevenueInUsdQuery

      //         const rewardAmount = readableTokenAmountLabel(PUPPET.PUPPET_TOKEN_DESCRIPTION, 134270000000000000000n)

      //         return $row(layoutSheet.spacingSmall)(
      //           $text(String(value)),
      //           $text(style({ color: pallete.positive, opacity: selected === value ? '' : '.5' }))(
      //             rewardAmount
      //           )
      //           // $pnlDisplay(10n ** 30n * 15n) : style({ opacity: .25 })($pnlDisplay(10n ** 30n * 15n))
      //         )
      //       }, option),
      //     })({
      //       select: changeOptionModeTether()
      //     }),
      //   ),
      // ),

      $SubmitBar({
        $container: $row(style({ width: '415px' })),
        txQuery: requestTx,
        walletClientQuery,
        $content: $text(map(params => {
          const lockLabel = params.maintainSchedule ? ' & Lock' : ''

          return `Claim${lockLabel}`
        }, vestingState))
      })({
        changeWallet: changeWalletTether(),
        click: requestTxTether(
          snapshot((params, wallet) => {

            const contractDefs = getMappedValue(PUPPET.CONTRACT, wallet.chain.id)

            if (params.option === SelectedOption.EXIT) {
              const writeQuery = walletLink.writeContract({
                ...contractDefs.RewardRouter,
                functionName: 'exit',
                args: [params.puppetTokenPriceInUsd],
                walletClient: wallet
              })
              
              return writeQuery
            }

            const acceptablePrice = params.puppetTokenPriceInUsd * 10200n / BASIS_POINTS_DIVISOR

            const lock = viem.encodeFunctionData({
              ...contractDefs.RewardRouter,
              functionName: 'lock',
              args: [BigInt(params.lockSchedule || 0n), acceptablePrice]
            })

            const writeQuery = walletLink.writeContract({
              ...contractDefs.RewardRouter,
              walletClient: wallet,
              functionName: 'multicall',
              args: [[
                lock
              ]],
            })

            return writeQuery
          }, vestingState)
        )
      })


    
    ),

    {
      changeWallet,
    }
  ]
})


