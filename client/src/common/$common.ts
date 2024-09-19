import { Behavior, Tether } from "@aelea/core"
import { $text, component, INode, nodeEvent, style, styleInline } from "@aelea/dom"
import * as router from '@aelea/router'
import { $column, $icon, $row, $seperator, layoutSheet, screenUtils } from "@aelea/ui-components"
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import { constant, empty, map, now, skipRepeats } from "@most/core"
import { Stream } from "@most/types"
import { getBasisPoints, getMappedValue, getTimeSince, getTokenUsd, ITokenDescription, lst, readableDate, readableLeverage, readablePercentage, readablePnl, readableUsd, streamOf, switchMap, unixTimestampNow } from "common-utils"
import { TOKEN_ADDRESS_DESCRIPTION_MAP, TOKEN_DESCRIPTION_MAP } from "gmx-middleware-const"
import { getEntryPrice, getMarginFees, getMarketIndexToken, getRoughLiquidationPrice, getTokenDescription, IMarket, IPosition, isPositionSettled, liquidationWeight } from "gmx-middleware-utils"
import { getOpenMpPnL, getParticiapntPortion, getSettledMpPnL, IMirrorPosition, latestPriceMap } from "puppet-middleware-utils"
import { $infoLabel, $infoTooltip, $labeledDivider, $Link, $tokenIconMap, $Tooltip } from "ui-components"
import * as viem from "viem"
import { $AccountLabel, $profileAvatar } from "../components/$AccountProfile.js"
import { $Popover } from "../components/$Popover.js"
import { $ButtonSecondary, $defaultMiniButtonSecondary } from "../components/form/$Button.js"
import { $RouteSubscriptionEditor, IChangeSubscription } from "../components/portfolio/$RouteSubscriptionEditor.js"
import { $seperator2 } from "../pages/common.js"
import { IWalletPageParams, IWalletTab } from "../pages/type.js"
import { $responsiveFlex } from "./elements/$common"
import { $caretDown } from "./elements/$icons"


export const $midContainer = $column(
  style({
    margin: '0 auto',
    maxWidth: '980px', padding: '0px 12px 26px',
    gap: screenUtils.isDesktopScreen ? '50px' : '50px',
    width: '100%',
  })
)


export const $size = (size: bigint, collateral: bigint, $divider = $seperator2) => {
  return $column(layoutSheet.spacingTiny, style({ textAlign: 'right' }))(
    $text(readableUsd(size)),
    $divider,
    $leverage(size, collateral),
  )
}


export const $entry = (mp: IPosition) => {
  const indexToken = getMarketIndexToken(mp.market)
  const indexDescription = getTokenDescription(indexToken)

  return $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
    $Tooltip({
      // $dropContainer: $defaultDropContainer,
      $content: $text(style({ fontSize: '.85rem' }))(getMappedValue(TOKEN_ADDRESS_DESCRIPTION_MAP, getMarketIndexToken(mp.market)).symbol),
      $anchor: $tokenIcon(indexDescription, { width: '36px' }),
    })({}),
    $column(layoutSheet.spacingTiny)(
      $infoLabel($text(style({ fontSize: '.65rem', fontWeight: 'bold' }))((mp.isLong ? 'LONG' : 'SHORT'))),
      $text(style({ fontSize: '.85rem' }))(readableUsd(getEntryPrice(mp, indexDescription))),
    )

  )
}

export const $route = (indexTokenDescription: ITokenDescription, collateralTokenDescription: ITokenDescription, displayLabel = true) => {

  return $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
    $tokenIcon(indexTokenDescription, { width: '36px' }),
    displayLabel
      ? $column(layoutSheet.spacingTiny)(
        $text(style({ fontSize: '1rem' }))(`${indexTokenDescription.symbol}`),
        // $infoLabel($text(style({ fontSize: '.85rem' }))((pos.isLong ? 'Long' : 'Short'))),
      )
      : empty(),
  )
}

export const $tokenLabeled = (indexDescription: ITokenDescription) => {
  return $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
    $tokenIcon(indexDescription, { width: '36px' }),
    $text(style({ fontSize: '1rem' }))(`${indexDescription.symbol}`),
  )
}


export const $tokenIcon = (tokenDesc: ITokenDescription, IIcon: { width: string } = { width: '24px' }) => {
  const $token = $tokenIconMap[tokenDesc.symbol] || $tokenIconMap[TOKEN_DESCRIPTION_MAP.PUPPET.symbol]

  if (!$token) {
    throw new Error('Unable to find matched token')
  }

  return $icon({
    $content: $token,
    svgOps: style({ fill: pallete.message }),
    viewBox: '0 0 32 32',
    width: IIcon.width
  })
}

export const $sizeAndLiquidation = (mp: IMirrorPosition, puppet?: viem.Address) => {
  const sizeInUsd = getParticiapntPortion(mp, mp.sizeInUsd, puppet)
  const collateralInToken = getParticiapntPortion(mp, mp.collateralAmount, puppet)
  const collateralUsd = getTokenUsd(mp.increaseList[0].collateralTokenPriceMin, collateralInToken)
  const indexToken = getMarketIndexToken(mp.market)
  const latestPrice = map(pm => pm[indexToken].max, latestPriceMap)

  return $column(layoutSheet.spacingTiny, style({ alignItems: 'flex-end' }))(
    $text(readableUsd(sizeInUsd)),
    $liquidationSeparator(mp.isLong, mp.sizeInUsd, mp.sizeInTokens, mp.collateralAmount, latestPrice),
    $leverage(sizeInUsd, collateralUsd),
  )
}


export const $puppetList = (
  puppets?: viem.Address[],
  click?: Tether<INode, string>
) => {

  // const positionMarkPrice = tradeReader.getLatestPrice(now(pos.indexToken))
  // const cumulativeFee = tradeReader.vault.read('cumulativeFundingRates', pos.collateralToken)

  if (!puppets || puppets.length === 0) {
    return $text(style({ fontSize: '0.85rem', color: pallete.foreground }))('-')
  }

  return $row(style({ cursor: 'pointer' }))(
    ...puppets.map(account => {
      if (!click) {
        return style({ marginRight: '-12px', border: '2px solid black' })(
          $profileAvatar({ account, profileSize: 25 })
        )
      }


      return click(nodeEvent('click'), map(() => {
        const url = `/app/profile/puppet/${account}`

        history.pushState({}, '', url)
        return url
      }))(
        style({ marginRight: '-12px', border: '2px solid black' })(
          $profileAvatar({ account, profileSize: 25 })
        )
      )
    }),
    // $content
  )
}

export const $positionPnlAndSize = (mp: IMirrorPosition, puppet?: viem.Address) => {
  return $column(layoutSheet.spacingTiny, style({ textAlign: 'right' }))(
    $positionPnl(mp, puppet),
    $seperator2,
    $positionRoi(mp, puppet),
  )
}

// export const $stake = (processData: Stream<IGmxProcessState>, pos: IPositionMirrorOpen, account: viem.Address) => {
//   // const cumulativeTokenFundingRates = contractReader(GMX.CONTRACT['42161'].Vault)('cumulativeFundingRates', pos.collateralToken)


//   return $column(layoutSheet.spacingTiny, style({ textAlign: 'right' }))(
//     style({ flexDirection: 'row-reverse' })(
//       $infoTooltipLabel(
//         $openPositionPnlBreakdown(pos, ff),
//         $positionSlotPnl(pos, positionMarkPrice, account)
//       )
//     ),
//     $seperator2,
//     style({ fontSize: '.85rem' })($positionSlotRoi(pos, positionMarkPrice, account)),
//   )
// }

export const $leverage = (size: bigint, collateral: bigint) => {
  return $text(style({ fontWeight: 'bold', letterSpacing: '0.05em', fontSize: '0.85rem' }))(readableLeverage(size, collateral))
}

export const $pnlDisplay = (
  pnlSrc: Stream<bigint> | bigint,
  bold = true
) => {
  const pnl = streamOf(pnlSrc)
  const display = map(value => readablePnl(value), pnl)
  const displayColor = skipRepeats(map(value => {
    return value > 0n ? pallete.positive : value === 0n ? pallete.foreground : pallete.negative
  }, pnl))

  const colorStyle = styleInline(map(color => {
    return { color }
  }, displayColor))

  const $testStr = $text(colorStyle, style({ fontWeight: bold ? 'bold' : 'normal' }))

  return $testStr(display)
}

export const $PnlPercentageValue = (pnl: Stream<bigint> | bigint, collateral: bigint, colorful = true) => {
  return $column(
    $pnlDisplay(pnl, colorful),
    $seperator2,
    $pnlDisplay(pnl, colorful),
  )
}

export const $positionPnl = (mp: IPosition, puppet?: viem.Address) => {
  const indexToken = getMarketIndexToken(mp.market)
  const latestPrice = map(pm => pm[indexToken].max, latestPriceMap)
  const isSettled = isPositionSettled(mp)

  const value = isSettled
    ? getSettledMpPnL(mp, puppet)
    : map(price => {
      const openPnl = getOpenMpPnL(mp, price, puppet)
      return mp.realisedPnlUsd + openPnl // - mp.position.cumulativeFee
    }, latestPrice)


  const displayColor = skipRepeats(map(value => {
    return value > 0n ? pallete.positive : value === 0n ? pallete.foreground : pallete.negative
  }, streamOf(value)))

  return isSettled
    ? $pnlDisplay(value)
    : $row(style({ alignItems: 'center' }))(
      switchMap(color => {
        return style({ backgroundColor: colorAlpha(color, .1), borderRadius: '50%' })($infoTooltip($openPositionBreakdown(mp), color, '18px'))
      }, displayColor),
      $pnlDisplay(value),
    )
}

export const $positionRoi = (mp: IPosition, puppet?: viem.Address) => {
  const indexToken = getMarketIndexToken(mp.market)
  const lstIncrease = lst(mp.increaseList)
  const collateralUsd = getTokenUsd(lstIncrease.collateralTokenPriceMin, mp.maxCollateralInUsd)
  const latestPrice = map(pm => pm[indexToken].max, latestPriceMap)

  const roi = isPositionSettled(mp)
    ? readablePercentage(getBasisPoints(mp.realisedPnlUsd, collateralUsd))
    : map(markPrice => {
      const delta = getOpenMpPnL(mp, markPrice, puppet)
      return readablePercentage(getBasisPoints(mp.realisedPnlUsd + delta, collateralUsd))
    }, latestPrice)
  return $text(style({ fontSize: '.85rem' }))(roi)
}

export function $liquidationSeparator(isLong: boolean, sizeUsd: bigint, sizeInTokens: bigint, collateralAmount: bigint, markPrice: Stream<bigint>) {
  const liqWeight = map(price => {
    const collateralUsd = getTokenUsd(price, collateralAmount)
    const liquidationPrice = getRoughLiquidationPrice(isLong, sizeUsd, sizeInTokens, collateralUsd, collateralAmount)

    return liquidationWeight(isLong, liquidationPrice, price)
  }, markPrice)

  return styleInline(map((weight) => {
    return { width: '100%', background: `linear-gradient(90deg, ${pallete.negative} ${`${weight * 100}%`}, ${pallete.foreground} 0)` }
  }, liqWeight))(
    $seperator
  )
}

export function $positionTimestamp(pos: IPosition) {
  const timestamp = Number(pos.settledTimestamp || pos.openTimestamp)

  return $column(layoutSheet.spacingTiny)(
    $text(readableDate(timestamp)),
    $row(layoutSheet.spacingSmall)(
      $text(style({ fontSize: '.85rem' }))(getTimeSince(timestamp))
    )
  )
}



export const $marketLabel = (market: IMarket, showLabel = true) => {
  const indexTokenDescription = getTokenDescription(market.indexToken)
  const longTokenDescription = getTokenDescription(market.longToken)
  const shortTokenDescription = getTokenDescription(market.shortToken)
  const $iconG = $tokenIconMap[indexTokenDescription.symbol]

  return $row(layoutSheet.spacing, style({ cursor: 'pointer', alignItems: 'center', }))(
    $icon({ $content: $iconG, width: '34px', viewBox: '0 0 32 32' }),
    showLabel
      ? $column(layoutSheet.flex)(
        $text(style({ fontWeight: 'bold' }))(indexTokenDescription.symbol),
        $text(style({ fontSize: '.75rem', color: pallete.foreground }))(`${longTokenDescription.symbol}/${shortTokenDescription.symbol}`),
      ) : empty(),
  )
}

export const $marketSmallLabel = (market: IMarket) => {
  const indexTokenDescription = getTokenDescription(market.indexToken)
  const $iconG = $tokenIconMap[indexTokenDescription.symbol]

  return $row(layoutSheet.spacingSmall, style({ cursor: 'pointer', alignItems: 'center', }))(
    $icon({ $content: $iconG, width: '24px', viewBox: '0 0 32 32' }),
    $text(style({ fontWeight: 'bold' }))(indexTokenDescription.symbol),
  )
}


export const $openPositionBreakdown = (mp: IPosition) => {
  // const pendingFundingFee = getFundingFee(mp.entryFundingRate, cumulativeTokenFundingRates, mp.size)
  const totalMarginFee = getMarginFees(mp.cumulativeSizeUsd)

  const updateList = [...mp.increaseList, ...mp.decreaseList].sort((a, b) => a.blockTimestamp - b.blockTimestamp)
  const latestUpdate = lst(updateList)

  const totalPositionFeeAmount = updateList.reduce((acc, next) => acc + next.feeCollected.positionFeeAmount * next.collateralTokenPriceMax, 0n)
  const totalBorrowingFeeAmount = updateList.reduce((acc, next) => acc + next.feeCollected.borrowingFeeAmount * next.collateralTokenPriceMax, 0n)
  const totalFundingFeeAmount = updateList.reduce((acc, next) => acc + next.feeCollected.fundingFeeAmount * next.collateralTokenPriceMax, 0n)


  return $column(layoutSheet.spacingSmall, style({ minWidth: '250px' }))(
    $text('Net breakdown'),

    $row(style({ placeContent: 'space-between' }))(
      $text(style({ color: pallete.foreground, flex: 1 }))('Collateral'),
      $text(readableUsd(latestUpdate.collateralAmount * latestUpdate.collateralTokenPriceMax))
    ),
    $row(style({ placeContent: 'space-between' }))(
      $text(style({ color: pallete.foreground, flex: 1 }))('Open Pnl'),
      $pnlDisplay(getOpenMpPnL(mp, latestUpdate.indexTokenPriceMax))
    ),
    $labeledDivider('Realised'),
    $row(style({ placeContent: 'space-between' }))(
      $text(style({ color: pallete.foreground }))('Position Fee'),
      $pnlDisplay(-totalPositionFeeAmount)
    ),
    $row(style({ placeContent: 'space-between' }))(
      $text(style({ color: pallete.foreground }))('Borrowing Fee'),
      $pnlDisplay(-totalBorrowingFeeAmount)
    ),
    $row(style({ placeContent: 'space-between' }))(
      $text(style({ color: pallete.foreground }))('Funding Fee'),
      $pnlDisplay(-totalFundingFeeAmount)
    ),
    $row(style({ placeContent: 'space-between' }))(
      $text(style({ color: pallete.foreground }))('PnL'),
      // $pnlValue(now(mp.realisedPnl))
      $pnlDisplay(mp.realisedPnlUsd)
    ),
  )
}

interface ITraderDisplay {
  trader: viem.Address
  route: router.Route,
  puppets: viem.Address[]
}
export const $TraderDisplay = (config: ITraderDisplay) => component((
  [click, clickTether]: Behavior<any, viem.Address>,
) => {

  const { route, trader } = config

  return [
    $Link({
      $content: $row(layoutSheet.spacingSmall, style({ alignItems: 'center', textDecoration: 'none' }))(
        $profileAvatar({ ...config, account: trader }),
        $column(style({ gap: '3px' }))(
          $AccountLabel(trader),
          config.puppets.length > 0
            ? $row(style({ alignItems: 'center' }))(
              ...config.puppets.map(account => {

                return style({ marginRight: '-12px', border: '2px solid black' })(
                  $profileAvatar({ account, profileSize: 25 })
                )
              }),
              $text(style({ gap: '8px', marginLeft: '16px' }))(`${config.puppets.length}`)
            )
            : $row(style({ alignItems: 'center' }))(
              $text(style({ color: pallete.foreground, fontSize: '.75em' }))(`0 puppets`)
            )

        )
      ),
      route: route.create({ fragment: 'baseRoute' }),
      url: `/app/profile/${IWalletTab.TRADER.toLowerCase()}/${trader}`
    })({ click: clickTether() }),

    { click }
  ]
})



interface ITraderRouteDisplay extends IWalletPageParams {
  trader: viem.Address
  selectedCollateralTokenList: Stream<viem.Address[]>
  collateralTokenList: viem.Address[]
}
export const $TraderRouteDisplay = (config: ITraderRouteDisplay) => component((
  [popRouteSubscriptionEditor, popRouteSubscriptionEditorTether]: Behavior<any, bigint>,
  [modifySubscribeList, modifySubscribeListTether]: Behavior<IChangeSubscription>,
) => {

  const { walletClientQuery, trader, selectedCollateralTokenList, collateralTokenList } = config

  const puppetSubscriptionParams = switchMap(async walletQuery => {
    const wallet = await walletQuery

    if (wallet === null) {
      return 0n
    }


    // puppetReader.PuppetStore.getAllocationRuleList(wallet, getRuleKey())

    // const expiry = await readPuppetSubscriptionExpiry(wallet, wallet.account.address, trader, '0x', '0x', false)

    return 0n
  }, walletClientQuery)

  return [
    $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
      $Popover({
        open: map(expiry => {
          return $RouteSubscriptionEditor({ expiry, trader, walletClientQuery, selectedCollateralTokenList: now(collateralTokenList) })({
            modifySubscriber: modifySubscribeListTether()
          })
        }, popRouteSubscriptionEditor),
        dismiss: modifySubscribeList,
        $target: switchMap(expiry => {
          return $ButtonSecondary({
            $content: $responsiveFlex(style({ alignItems: 'center', gap: '6px' }))(
              $row(style({ alignItems: 'center' }))(
                ...collateralTokenList.map(account => {

                  return style({})(
                    $tokenIcon(getTokenDescription(account), { width: '25px' })
                  )
                }),
              ),
              $seperator2,

              $row(style({ gap: '8px' }))(
                $row(
                  $text(`Copy`),
                  $icon({ $content: $caretDown, width: '18px', svgOps: style({ marginTop: '1px', minWidth: '18px' }), viewBox: '0 0 32 32' }),
                )
              ),

            ),
            $container: $defaultMiniButtonSecondary(style({ borderRadius: '16px', padding: '8px', height: 'auto', borderColor: Number(expiry) > unixTimestampNow() ? pallete.primary : colorAlpha(pallete.foreground, .25) }))
          })({
            click: popRouteSubscriptionEditorTether(constant(expiry))
          })
        }, puppetSubscriptionParams)
      })({})
    ),


    { modifySubscribeList }
  ]
})


