import { Behavior, O, combineObject } from "@aelea/core"
import { $node, $text, component, nodeEvent, style } from "@aelea/dom"
import { $column, $row, layoutSheet, screenUtils } from "@aelea/ui-components"
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import { constant, empty, map, mergeArray, skipRepeats, snapshot } from "@most/core"
import { Stream } from "@most/types"
import { getDuration, getMappedValue, groupArrayMany, readableDate, readablePercentage, readableTokenAmountLabel, switchMap } from "common-utils"
import { EIP6963ProviderDetail } from "mipd"
import { $check, $infoLabel, $infoLabeledValue, $infoTooltip, $infoTooltipLabel, $intermediateText, $target, $xCross } from "ui-components"
import * as viem from "viem"
import * as walletLink from "wallet"
import { $profileDisplay } from "../$AccountProfile.js"
import { $route } from "../../common/$common.js"
import { $heading3 } from "../../common/$text.js"
import { $card2, $iconCircular, $responsiveFlex } from "../../common/elements/$common.js"
import { $seperator2 } from "../../pages/common.js"
import { IComponentPageParams } from "../../pages/type.js"
import { fadeIn } from "../../transitions/enter.js"
import { $ButtonCircular, $ButtonSecondary, $defaultMiniButtonSecondary } from "../form/$Button.js"
import { $SubmitBar } from "../form/$Form"
import { IChangeSubscription } from "./$RouteSubscriptionEditor"
import { getTokenDescription } from "gmx-middleware-utils"
import { $AssetDepositEditor } from "./$AssetDepositEditor"
import puppetReader from "../../logic/puppetReader"
import { $Popover } from "../$Popover"
import * as PUPPET from "puppet-middleware-const"

interface IRouteSubscribeDrawer extends IComponentPageParams {
  modifySubscriber: Stream<IChangeSubscription>
  modifySubscriptionList: Stream<IChangeSubscription[]>
}

export const $RouteSubscriptionDrawer = (config: IRouteSubscribeDrawer) => component((
  [requestChangeSubscription, requestChangeSubscriptionTether]: Behavior<walletLink.IWalletClient, any>,
  [clickClose, clickCloseTether]: Behavior<any>,
  [clickRemoveSubsc, clickRemoveSubscTether]: Behavior<any, IChangeSubscription>,
  [openDepositPopover, openDepositPopoverTether]: Behavior<any>,
  [requestDepositAsset, requestDepositAssetTether]: Behavior<Promise<bigint>>, // delta amount
  [changeWallet, changeWalletTether]: Behavior<EIP6963ProviderDetail>,
) => {

  const { modifySubscriber, modifySubscriptionList, providerClientQuery, walletClientQuery, } = config

  const openIfEmpty = skipRepeats(map(l => l.length > 0, modifySubscriptionList))








  return [
    switchMap(isOpen => {
      if (!isOpen) {
        return empty()
      }

      return fadeIn($card2(style({ border: `1px solid ${colorAlpha(pallete.foreground, .20)}`, padding: '18px 0', borderBottom: 'none', borderRadius: '20px 20px 0 0' }))(
        $column(layoutSheet.spacing)(
          $row(layoutSheet.spacingSmall, style({ alignItems: 'center', padding: '0 24px' }))(
            $heading3('Matching Rules'),
            $infoTooltip('The following rules will apply to these traders in your portfolio. visit Profile to view your portfolio'),

            $node(style({ flex: 1 }))(),

            $ButtonCircular({
              $iconPath: $xCross,
            })({
              click: clickCloseTether()
            })
          ),

          switchMap(params => {
            const collateralGroupList = Object.entries(groupArrayMany(params.modifySubscriptionList, x => x.collateralToken)) as [viem.Hex, IChangeSubscription[]][]

            return $column(layoutSheet.spacing, style({ overflow: 'auto', maxHeight: '35vh', padding: `0 ${screenUtils.isDesktopScreen ? '24px' : '12px'}` }))(
              ...collateralGroupList.map(([collateralToken, subscList]) => {

                const initialDepositAmountQuery = map(async walletQuery => {
                  const wallet = await walletQuery

                  if (wallet === null) {
                    return 0n
                  }

                  return puppetReader.PuppetStore.getUserBalance(wallet, collateralToken, wallet.account.address)
                }, walletClientQuery)

                const depositAmountQuery = mergeArray([
                  initialDepositAmountQuery,
                  map(async params => {
                    return await params.initialDepositAmountQuery + await params.requestDepositAsset
                  }, combineObject({ initialDepositAmountQuery, requestDepositAsset }))
                ])

                const collateralTokenDescription = getTokenDescription(collateralToken)


                return $column(style({ paddingLeft: '16px' }))(
                  $row(layoutSheet.spacingBig, style({ padding: '6px 0' }))(
                    $route(collateralTokenDescription),
                    $Popover({
                      open: map(() => {
                        return $AssetDepositEditor({
                          providerClientQuery,
                          walletClientQuery,
                          token: collateralToken
                        })({
                          requestDepositAsset: requestDepositAssetTether(),
                        })
                      }, openDepositPopover),
                      $target: $row(layoutSheet.spacing)(
                        $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
                          $infoLabel('Balance'),
                          $intermediateText(map(async amount => readableTokenAmountLabel(collateralTokenDescription, await amount), depositAmountQuery))
                        ),
                        $ButtonSecondary({
                          $container: $defaultMiniButtonSecondary,
                          $content: $text('Deposit')
                        })({
                          click: openDepositPopoverTether()
                        })
                      )
                    })({}),
                  ),
                  $row(layoutSheet.spacing)(
                    $seperator2,
                    $column(style({ flex: 1, padding: '12px 0' }))(
                      ...subscList.map(modSubsc => {
                        const iconColorParams = modSubsc.matchRule
                          ? modSubsc.expiry === 0n
                            ? { fill: pallete.negative, icon: $xCross, label: screenUtils.isDesktopScreen ? 'Remove' : '-' } : { fill: pallete.message, icon: $target, label: screenUtils.isDesktopScreen ? 'Edit' : '~' }
                          : { fill: pallete.positive, icon: $check, label: screenUtils.isDesktopScreen ? 'Add' : '+' }

                        return $row(screenUtils.isDesktopScreen ? layoutSheet.spacingBig : layoutSheet.spacing, style({ alignItems: 'center', padding: `14px 0` }))(
                          O(style({ marginLeft: '-32px', backgroundColor: pallete.horizon, cursor: 'pointer' }), clickRemoveSubscTether(nodeEvent('click'), constant(modSubsc)))(
                            $iconCircular($xCross)
                          ),
                          $row(
                            $text(style({ backgroundColor: colorAlpha(iconColorParams.fill, .1), marginLeft: `-42px`, borderRadius: '6px', padding: screenUtils.isDesktopScreen ? `6px 12px 6px 22px` : `6px 8px 6px 30px`, color: iconColorParams.fill, }))(iconColorParams.label),
                          ),

                          // switchMap(amount => {
                          //   return $text(tokenAmountLabel(routeType.indexToken, amount))
                          // }, orchestrator.read('puppetAccountBalance', w3p.account.address, routeType.indexToken)),

                          $profileDisplay({
                            account: modSubsc.trader,
                            // $profileContainer: $defaultBerry(style({ width: '50px' }))
                          }),

                          $responsiveFlex(layoutSheet.spacing, style({ flex: 1 }))(
                            $infoLabeledValue('Expiry', readableDate(Number(modSubsc.expiry))),
                            $infoLabeledValue('Allowance Rate', $text(`${readablePercentage(modSubsc.allowanceRate)}`)),
                            $infoLabeledValue('Throttle Duration', $text(`${getDuration(modSubsc.throttleActivity)}`)),
                          )

                        )
                      })
                    )
                  ),
                  $seperator2,
                )
              })
            )
          }, combineObject({ modifySubscriptionList })),


          $row(layoutSheet.spacingSmall, style({ placeContent: 'space-between', padding: '0 24px' }))(
            $node(),
            $SubmitBar({
              walletClientQuery,
              $submitContent: $text(screenUtils.isDesktopScreen ? 'Save Changes' : 'Save'),
              txQuery: requestChangeSubscription,
              // alert: validationError
            })({
              changeWallet: changeWalletTether(),
              click: requestChangeSubscriptionTether(
                snapshot(async (matchRuleList, wallet) => {
                  const collateralTokenList = matchRuleList.map(x => x.collateralToken)
                  const ruleParamList = matchRuleList.map(x => ({
                    allowanceRate: x.allowanceRate,
                    throttleActivity: x.throttleActivity,
                    expiry: x.expiry,
                  }))
                  const traderList = matchRuleList.map(x => x.trader)

                  return walletLink.writeContract({
                    ...getMappedValue(PUPPET.CONTRACT, wallet.chain.id).PuppetRouter,
                    abi: [...PUPPET.errorAbi.default, ...PUPPET.CONTRACT[42161].PuppetRouter.abi],
                    walletClient: wallet,
                    functionName: 'setMatchRuleList',
                    args: [collateralTokenList, ruleParamList, traderList]
                  })
                }, modifySubscriptionList)
              )
            }),
          )
        )
      ))

    }, openIfEmpty),

    {
      changeWallet,
      modifySubscriptionList: mergeArray([
        snapshot((list, modify) => {
          const index = list.findIndex(x =>
            x.trader === modify.trader
          )
          const newList = [...list]

          if (index === -1) {
            newList.push(modify)
            return newList
          }

          newList[index] = modify
          return newList
        }, modifySubscriptionList, modifySubscriber),
        snapshot((list, subsc) => {
          const idx = list.indexOf(subsc)

          if (idx === -1) {
            return list
          }

          list.splice(idx, 1)

          return list
        }, modifySubscriptionList, clickRemoveSubsc),
        constant([], clickClose)
      ])
    }
  ]
})





