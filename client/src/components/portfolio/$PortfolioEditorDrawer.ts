import { Behavior, O, combineObject } from "@aelea/core"
import { $node, $text, component, nodeEvent, style } from "@aelea/dom"
import { $column, $row, layoutSheet, screenUtils } from "@aelea/ui-components"
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import { constant, empty, map, mergeArray, skipRepeatsWith, snapshot } from "@most/core"
import { Stream } from "@most/types"
import { getDuration, getMappedValue, readableDate, readablePercentage, switchMap } from "../utils/index.js"
import { EIP6963ProviderDetail } from "mipd"
import * as PUPPET from "../const/index.js"
import { PUPPET_ADDRESSES } from "@puppet/contracts"


import { $check, $infoLabeledValue, $infoTooltip, $target, $xCross } from "ui-components"
import * as viem from "viem"
import * as walletLink from "wallet"
import { $profileDisplay } from "../$AccountProfile.js"
import { $heading3 } from "../../common/$text.js"
import { $card2, $iconCircular, $responsiveFlex } from "../../common/elements/$common.js"
import { $seperator2 } from "../../pages/common.js"
import { IComponentPageParams } from "../../pages/type.js"
import { fadeIn } from "../../transitions/enter.js"
import { $ButtonCircular } from "../form/$Button.js"
import { $SubmitBar } from "../form/$SubmitBar.js"
import { DepositEditorAction, IDepositEditorChange } from "./$DepositEditor.js"
import { $RouteDepositEditor } from "./$RouteDepositEditor.js"
import { IMatchRuleEditorChange } from "./$TraderMatchRouteEditor"

interface IPortfolioEditorDrawer extends IComponentPageParams {
  depositTokenList: Stream<IDepositEditorChange[]>
  matchRuleList: Stream<IMatchRuleEditorChange[]>
}

interface IPortfolioRoute {
  collateralToken: viem.Address
  deposit: IDepositEditorChange | null
  matchRuleList: IMatchRuleEditorChange[]
}

export const $PortfolioEditorDrawer = (config: IPortfolioEditorDrawer) => component((
  [requestChangeSubscription, requestChangeSubscriptionTether]: Behavior<walletLink.IWalletClient, any>,
  [clickClose, clickCloseTether]: Behavior<any>,
  [clickRemoveSubsc, clickRemoveSubscTether]: Behavior<any, IMatchRuleEditorChange>,
  [changeWallet, changeWalletTether]: Behavior<EIP6963ProviderDetail>,
  [changeDepositTokenList, changeDepositTokenListTether]: Behavior<IDepositEditorChange[]>,
) => {

  const { matchRuleList, providerClientQuery, walletClientQuery, depositTokenList, } = config

  const hasDraft = skipRepeatsWith(draft => draft.matchRuleList.length > 0 || draft.depositTokenList.length > 0, combineObject({ matchRuleList, depositTokenList }))

  return [
    switchMap(params => {

      if (params.matchRuleList.length === 0 && params.depositTokenList.length === 0) {
        return empty()
      }

      const updateList = [...params.matchRuleList, ...params.depositTokenList]
      const portfolioRouteList: IPortfolioRoute[] = updateList.reduce((acc: IPortfolioRoute[], item) => {
        const collateralToken = 'token' in item ? item.token : item.collateralToken
        const existingRoute = acc.find(route => route.collateralToken === collateralToken)

        if (existingRoute) {
          if ('draft' in item) {
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

          if ('draft' in item) {
            newDraft.matchRuleList.push(item)
          } else if ('token' in item) {
            newDraft.deposit = item
          }

          acc.push(newDraft)
        }

        return acc
      }, [])


      return fadeIn($card2(style({ border: `1px solid ${colorAlpha(pallete.foreground, .20)}`, padding: '18px 0', borderBottom: 'none', borderRadius: '20px 20px 0 0' }))(
        $column(layoutSheet.spacing)(
          $row(layoutSheet.spacingSmall, style({ alignItems: 'center', padding: '0 24px' }))(
            $heading3('Portfolio Changes'),
            $infoTooltip('The following rules will apply to these traders in your portfolio. visit Profile to view your portfolio'),

            $node(style({ flex: 1 }))(),

            $ButtonCircular({
              $iconPath: $xCross,
            })({
              click: clickCloseTether()
            })
          ),

          $column(layoutSheet.spacing, style({ overflow: 'auto', maxHeight: '35vh', padding: `0 ${screenUtils.isDesktopScreen ? '24px' : '12px'}` }))(
            ...portfolioRouteList.map(route => {
              return $column(style({ paddingLeft: '16px' }))(
                $row(layoutSheet.spacingBig, style({ padding: '6px 0' }))(
                  $RouteDepositEditor({
                    collateralToken: route.collateralToken,
                    depositTokenList,
                    providerClientQuery,
                    walletClientQuery
                  })({
                    changeDepositTokenList: changeDepositTokenListTether(),
                    changeWallet: changeWalletTether()
                  })
                ),
                $row(layoutSheet.spacing)(
                  $seperator2,
                  $column(style({ flex: 1, padding: '12px 0' }))(
                    ...route.matchRuleList.map(modSubsc => {
                      const iconColorParams = modSubsc.draft
                        ? modSubsc.draft.expiry === 0n
                          ? { fill: pallete.negative, icon: $xCross, label: screenUtils.isDesktopScreen ? 'Remove' : '-' } : { fill: pallete.message, icon: $target, label: screenUtils.isDesktopScreen ? 'Edit' : '~' }
                        : { fill: pallete.positive, icon: $check, label: screenUtils.isDesktopScreen ? 'Add' : '+' }

                      return $row(screenUtils.isDesktopScreen ? layoutSheet.spacingBig : layoutSheet.spacing, style({ alignItems: 'center', padding: `14px 0` }))(
                        O(
                          style({ marginLeft: '-32px', backgroundColor: pallete.horizon, cursor: 'pointer' }),
                          clickRemoveSubscTether(nodeEvent('click'), constant(modSubsc))
                        )(
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
                          $infoLabeledValue('Allowance Rate', $text(`${readablePercentage(modSubsc.draft.allowanceRate)}`)),
                          $infoLabeledValue('Expiry', readableDate(Number(modSubsc.draft.expiry))),
                          $infoLabeledValue('Throttle Duration', $text(`${getDuration(modSubsc.draft.throttleActivity)}`)),
                        )

                      )
                    })
                  )
                ),
                $seperator2,
              )
            })
          ),


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
                map(async (wallet) => {
                  const callStack: viem.Hex[] = []
                  const contractDefs = PUPPET_ADDRESSES[42161].RouterProxy


                  if (params.matchRuleList.length > 0) {
                    callStack.push(
                      ...params.matchRuleList.map((matchRule) => {
                        const ruleParams = {
                          allowanceRate: matchRule.draft.allowanceRate,
                          throttleActivity: matchRule.draft.throttleActivity,
                          expiry: matchRule.draft.expiry,
                        }

                        return viem.encodeFunctionData({
                          ...contractDefs,
                          abi: [...PUPPET_ADDRESSES[42161].CustomError.abi, ...contractDefs.abi],
                          functionName: 'setMatchingRule',
                          args: [matchRule.collateralToken, matchRule.trader, ruleParams]
                        })
                      })
                    )
                  }

                  if (params.depositTokenList.length > 0) {
                    callStack.push(
                      ...params.depositTokenList.map(deposit =>
                        deposit.action === DepositEditorAction.DEPOSIT
                          ? viem.encodeFunctionData({
                            ...contractDefs,
                            abi: [...PUPPET_ADDRESSES[42161].CustomError.abi, ...contractDefs.abi],
                            functionName: 'deposit',
                            args: [deposit.token, deposit.value.amount]
                          })
                          : viem.encodeFunctionData({
                            ...contractDefs,
                            abi: [...PUPPET_ADDRESSES[42161].CustomError.abi, ...contractDefs.abi],
                            functionName: 'withdraw',
                            args: [deposit.token, wallet.account.address, deposit.value.amount]
                          })
                      )
                    )
                  }


                  return walletLink.writeContract({
                    ...contractDefs,
                    walletClient: wallet,
                    functionName: 'multicall',
                    args: [callStack],
                  })
                })
              )
            }),
          )
        )
      ))

    }, hasDraft),

    {
      changeWallet,
      changeMatchRuleList: mergeArray([
        snapshot((list, subsc) => {
          const idx = list.indexOf(subsc)

          if (idx === -1) {
            return list
          }

          list.splice(idx, 1)

          return list
        }, matchRuleList, clickRemoveSubsc),
        constant([], clickClose),
      ]),
      changeDepositTokenList: mergeArray([
        changeDepositTokenList,
        map(x => [], clickClose)
      ]),
    }
  ]
})





