import { Behavior, combineObject } from "@aelea/core"
import { $node, $text, component, style } from "@aelea/dom"
import { $column, $row, layoutSheet } from "@aelea/ui-components"
import { pallete } from "@aelea/ui-components-theme"
import { map } from "@most/core"
import { ADDRESS_ZERO, IntervalTime, applyFactor, countdownFn, factor, getDenominator, getMappedValue, readableTokenAmount, readableUsd, switchMap } from "common-utils"
import { TOKEN_DESCRIPTION_MAP } from "gmx-middleware-const"
import { EIP6963ProviderDetail } from "mipd"
import * as PUPPET from "puppet-middleware-const"
import { queryPosition } from "puppet-middleware-utils"
import { $ButtonToggle, $defaulButtonToggleContainer, $infoLabeledValue, $infoTooltipLabel, $intermediateMessage } from "ui-components"
import { uiStorage } from "ui-storage"
import * as viem from 'viem'
import { $heading3 } from "../../common/$text"
import { $card, $responsiveFlex } from "../../common/elements/$common"
import { subgraphClient } from "../../common/graphClient"
import { $VestingDetails } from "../../components/$VestingDetails"
import { IChangeSubscription } from "../../components/portfolio/$RouteSubscriptionEditor.js"
import * as storeDb from "../../const/store.js"
import { readBalanceOf, readLockSupply, readTotalEmitted } from "../../logic/commonRead"
import { readPuppetPriceInUsd, } from "../../logic/puppetRead"
import { $seperator2 } from "../common"
import { IPageParams, IUserActivityParams, IWalletTab } from "../type.js"
import { $TraderPage } from "./$Trader.js"
import { $WalletPuppet } from "./$WalletPuppet.js"

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
  },
}


export const $WalletPage = (config: IPageParams & IUserActivityParams) => component((
  [changeRoute, changeRouteTether]: Behavior<string, string>,
  [selectProfileMode, selectProfileModeTether]: Behavior<IWalletTab>,
  [modifySubscriber, modifySubscriberTether]: Behavior<IChangeSubscription>,

  [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<any, IntervalTime>,
  [selectCollateralTokenList, selectCollateralTokenListTether]: Behavior<viem.Address[]>,

  [changeWallet, changeWalletTether]: Behavior<any, EIP6963ProviderDetail | null>,
) => {

  const {
    route, walletClientQuery, providerClientQuery,
    activityTimeframe, collateralTokenList, pricefeedMapQuery 
  } = config

  const profileMode = uiStorage.replayWrite(storeDb.store.wallet, selectProfileMode, 'selectedTab')


  const puppetTokenPriceInUsd = switchMap(async providerQuery => {
    const provider = await providerQuery

    return await readPuppetPriceInUsd(provider)
  }, providerClientQuery)



  return [

    $column(layoutSheet.spacingBig)(
      $node(),

      // $row(style({ flex: 1, placeContent: 'center' }))(
      //   $IntermediateConnectButton({
      //     walletClientQuery,
      //     $$display: map(wallet => {
      //       // return empty()
      //       return $ButtonSecondary({
      //         $content: $text('Disconnect')
      //       })({
      //         click: changeWalletTether(constant(null))
      //       })
      //     })
      //   })({
      //     changeWallet: changeWalletTether()
      //   }),
      // ),

      $row(
        $node(style({ flex: 1 }))(),
        $ButtonToggle({
          $container: $defaulButtonToggleContainer(style({ alignSelf: 'center', })),
          selected: profileMode,
          options: [IWalletTab.EARN, IWalletTab.PUPPET, IWalletTab.TRADER],
          $$option: map(option => {
            return $text(optionDisplay[option].label)
          })
        })({ select: selectProfileModeTether() }),
        $node(style({ flex: 1 }))(),
      ),

      // switchMap(params => {
      //   const address = switchMap(async walletQuery => {
      //     return (await walletQuery)?.account.address || ADDRESS_ZERO
      //   }, walletClientQuery)

      //   if (params.profileMode === IWalletTab.PUPPET) {
      //     const puppetTradeRouteListQuery = queryPuppetTradeRoute(subgraphClient, { address, activityTimeframe, collateralToken })
          
      //     const settledPositionListQuery = map(async tradeRoute => {
      //       return (await tradeRoute).map(x => x.settledList).flatMap(pp => pp.map(x => x.position))
      //     }, puppetTradeRouteListQuery)
      //     const openPositionListQuery = map(async tradeRoute => {
      //       return (await tradeRoute).map(x => x.openList).flatMap(pp => pp.map(x => x.position))
      //     }, puppetTradeRouteListQuery)

      //     return $WalletPuppet({
      //       walletClientQuery, route, pricefeedMapQuery, positionListQuery, puppetTradeRouteListQuery,
      //       activityTimeframe, collateralTokenList, routeTypeListQuery, providerClientQuery,
      //     })({
      //       changeRoute: changeRouteTether(),
      //       modifySubscriber: modifySubscriberTether(),
      //       changeActivityTimeframe: changeActivityTimeframeTether(),
      //       selectCollateralTokenList: selectCollateralTokenListTether(),
      //     })
      //   } else if (params.profileMode === IWalletTab.TRADER) {
      //     const settledPositionListQuery = queryPosition(subgraphClient, { activityTimeframe, collateralTokenList, address })
      //     const openPositionListQuery = queryPosition(subgraphClient, { address, collateralTokenList })

      //     return $column(layoutSheet.spacingTiny)(
      //       $TraderPage({ ...config, positionListQuery })({ 
      //         changeActivityTimeframe: changeActivityTimeframeTether(),
      //       })
      //     ) 
      //   }


      //   return $card(layoutSheet.spacingBig)(
          
      //     $responsiveFlex(layoutSheet.spacingBig)(

      //       $VestingDetails({ ...config, puppetTokenPriceInUsd })({
      //         changeWallet: changeWalletTether()
      //       }),
            
      //       $seperator2,
      //       $column(layoutSheet.spacing, style({ flex: 1 }))(
      //         $heading3('Protocol Flywheel'),
      //         style({ placeContent: 'space-between' })(
      //           $infoLabeledValue(
      //             'Price',
      //             $intermediateMessage(
      //               map(async puppetPrice => {
      //                 const price = puppetPrice * getDenominator(24)

      //                 return readableUsd(price)
      //               }, puppetTokenPriceInUsd)
      //             )
      //           )
      //         ),
      //         style({ placeContent: 'space-between' })(
      //           $infoLabeledValue(
      //             $infoTooltipLabel('This week revenue amount that will be distributed anyone who locked their PUPPET', 'Current Revenue'),
      //             $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
      //               $text(style({ color: pallete.foreground, fontSize: '.75rem' }))(`($36,137)`),
      //               $text(`21,383 / Week`)
      //             ),
      //           )
      //         ),
      //         style({ placeContent: 'space-between' })(
      //           $infoLabeledValue(
      //             $infoTooltipLabel('Total amount of PUPPET that has been emitted over the lifetime of the protocol. Each subsequent year, the number of new tokens minted will decrease by about 16%,', 'Total Emitted'),
      //             $intermediateMessage(
      //               map(async providerQuery => {
      //                 const provider = await providerQuery
      //                 const puppetSupply = readTotalEmitted(provider)

      //                 return readableTokenAmount(TOKEN_DESCRIPTION_MAP.PUPPET, await puppetSupply)
      //               }, providerClientQuery)
      //             ),
      //           )
      //         ),
      //         // style({ placeContent: 'space-between' })(
      //         //   $infoLabeledValue(
      //         //     $infoTooltipLabel('The total value of all PUPPET in circulation', 'Market Cap'),
      //         //     $text('10,000,000'),
      //         //   )
      //         // ),
      //         $seperator2,
      //         style({ placeContent: 'space-between' })(
      //           $infoLabeledValue(
      //             $text('Average lock time'),
      //             $intermediateMessage(
      //               map(async providerQuery => {
      //                 const provider = await providerQuery
      //                 const contractMap = getMappedValue(PUPPET.CONTRACT, provider.chain.id)
      //                 const puppetBalanceInVeContract = readBalanceOf(provider, contractMap.PuppetToken.address, contractMap.VotingEscrow.address)
      //                 const lockedSupply = readLockSupply(provider)
      //                 const globalLockFactor = factor(await lockedSupply, await puppetBalanceInVeContract)
      //                 const globalLockTimespan = applyFactor(globalLockFactor, BigInt(PUPPET.MAX_LOCKUP_SCHEDULE))

      //                 return countdownFn(PUPPET.MAX_LOCKUP_SCHEDULE, PUPPET.MAX_LOCKUP_SCHEDULE - Number(globalLockTimespan))
      //               }, providerClientQuery)
      //             ),
      //           )
      //         ),
      //         style({ placeContent: 'space-between' })(
      //           $infoLabeledValue(
      //             $text('Exit / Lock'),
      //             $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
      //               $text(style({ color: pallete.foreground, fontSize: '.75rem' }))(`(66% Lock)`),
      //               $text(`14,112 / 28,654`)
      //             ),
      //           )
      //         ),
      //       ),
            
      //     ),
      //   )
      // }, combineObject({ profileMode }))


    ),

    {
      modifySubscriber, changeActivityTimeframe, selectCollateralTokenList, changeRoute, changeWallet
    }
  ]
})


