import { empty, map, skipRepeats } from '@most/core'
import type { Stream } from '@most/types'
import { ADDRESS_ZERO, TOKEN_ADDRESS_DESCRIPTION_MAP } from '@puppet/middleware/const'
import { type IPosition, isPositionSettled, latestPriceMap } from '@puppet/middleware/core'
import {
  type IMarket,
  getMarketIndexToken,
  getPositionPnlUsd,
  getRoughLiquidationPrice,
  getTokenDescription,
  liquidationWeight,
} from '@puppet/middleware/gmx'
import {
  $Link,
  $Tooltip,
  $infoLabel,
  $infoLabeledValue,
  $labeledDivider,
  $tokenIconMap,
} from '@puppet/middleware/ui-components'
import {
  type ITokenDescription,
  getBasisPoints,
  getMappedValue,
  getSafeMappedValue,
  getTokenUsd,
  lst,
  readableDate,
  readableLeverage,
  readablePercentage,
  readablePnl,
  readableUsd,
  streamOf,
} from '@puppet/middleware/utils'
import type { Behavior, Tether } from 'aelea/core'
import { $text, type INode, component, nodeEvent, style, styleInline } from 'aelea/core'
import type * as router from 'aelea/router'
import { $column, $icon, $row, $seperator, layoutSheet, screenUtils } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type * as viem from 'viem'
import { $AccountLabel, $profileAvatar } from '../components/$AccountProfile.js'
import { $seperator2 } from '../pages/common.js'
import { IWalletTab } from '../pages/type.js'

export const $midContainer = $column(
  style({
    margin: '0 auto',
    maxWidth: '980px',
    padding: `0 ${screenUtils.isDesktopScreen ? '12px' : '0'} 26px`,
    gap: screenUtils.isDesktopScreen ? '50px' : '50px',
    width: '100%',
  }),
)

export const $size = (size: bigint, collateral: bigint, $divider = $seperator2) => {
  return $column(spacing.defaultTiny, style({ textAlign: 'right' }))(
    $text(readableUsd(size)),
    $divider,
    $leverage(size, collateral),
  )
}

export const $entry = (pos: IPosition) => {
  const indexToken = getMarketIndexToken(pos.market)
  const indexDescription = getTokenDescription(indexToken)
  const collateralTokenDescription = getTokenDescription(pos.collateralToken)

  const $label = $text(style({ width: '125px' }))

  return $row(spacing.small, style({ alignItems: 'center' }))(
    $Tooltip({
      // $dropContainer: $defaultDropContainer,
      $content: $column(spacing.default)(
        $infoLabeledValue($label('Market Token'), $tokenLabeled(indexDescription)),
        $infoLabeledValue($label('Collateral Token'), $tokenLabeled(collateralTokenDescription)),
        isPositionSettled(pos)
          ? $infoLabeledValue(
              $label('Close Time'),
              $text(style({ fontSize: '.85rem' }))(readableDate(pos.settledTimestamp)),
            )
          : empty(),
      ),
      $anchor: $route(indexDescription, false),
    })({}),
    $column(spacing.defaultTiny)(
      $infoLabel($text(style({ fontSize: '.65rem', fontWeight: 'bold' }))(pos.isLong ? 'LONG' : 'SHORT')),
      $text(style({ fontSize: '.85rem' }))(readableUsd(pos.avgEntryPrice)),
    ),
  )
}

export const $route = (collateralTokenDescription: ITokenDescription, displayLabel = true) => {
  return $row(spacing.small, style({ alignItems: 'center', position: 'relative' }))(
    $row(
      // style({
      //   width: '38px', height: '34x'
      // })(
      //   $tokenIcon(indexTokenDescription)
      // ),
      style({
        width: '32px',
        height: '34x',
        marginLeft: `-15px`,
      })($tokenIcon(collateralTokenDescription)),
    ),
    displayLabel
      ? $column(spacing.defaultTiny)($text(style({ fontSize: '1rem' }))(`${collateralTokenDescription.symbol}`))
      : empty(),
  )
}

export const $tokenLabeled = (indexDescription: ITokenDescription) => {
  return $row(spacing.small, style({ alignItems: 'center' }))(
    style({ width: '18px', height: '18px' })($tokenIcon(indexDescription)),
    $text(style({ fontSize: '1rem' }))(`${indexDescription.symbol}`),
  )
}

export const $tokenTryLabeled = (token: viem.Address) => {
  const description = getSafeMappedValue(TOKEN_ADDRESS_DESCRIPTION_MAP, token, ADDRESS_ZERO)

  return $row(
    spacing.small,
    style({ alignItems: 'center' }),
  )(
    style({ width: '18px', height: '18px' })($tokenIcon(description)),
    // $text(style({ fontSize: '1rem' }))(`${description ? description.symbol :  shortenAddress(indexToken)}`),
  )
}

export const $tokenIcon = (tokenDesc: ITokenDescription | null) => {
  const $token = tokenDesc
    ? $tokenIconMap[tokenDesc.symbol] || $tokenIconMap[ADDRESS_ZERO]
    : $tokenIconMap[ADDRESS_ZERO]

  if (!$token) {
    throw new Error('Unable to find matched token')
  }

  return $icon({
    $content: $token,
    svgOps: style({ fill: pallete.message, width: '24px', height: '24px' }),
    viewBox: '0 0 32 32',
  })
}

export const $puppetList = (puppets?: viem.Address[], click?: Tether<INode, string>) => {
  // const positionMarkPrice = tradeReader.getLatestPrice(now(pos.indexToken))
  // const cumulativeFee = tradeReader.vault.read('cumulativeFundingRates', pos.collateralToken)

  if (!puppets || puppets.length === 0) {
    return $text(style({ fontSize: '0.85rem', color: pallete.foreground }))('-')
  }

  return $row(style({ cursor: 'pointer' }))(
    ...puppets.map((account) => {
      if (!click) {
        return style({ marginRight: '-12px', border: '2px solid black' })($profileAvatar({ account, profileSize: 25 }))
      }

      return click(
        nodeEvent('click'),
        map(() => {
          const url = `/app/profile/position/${account}`

          history.pushState({}, '', url)
          return url
        }),
      )(style({ marginRight: '-12px', border: '2px solid black' })($profileAvatar({ account, profileSize: 25 })))
    }),
    // $content
  )
}

export const $leverage = (size: bigint, collateral: bigint) => {
  return $text(style({ fontWeight: 'bold', letterSpacing: '0.05em', fontSize: '0.85rem' }))(
    readableLeverage(size, collateral),
  )
}

export const $pnlDisplay = (pnlSrc: Stream<bigint> | bigint, bold = true) => {
  const pnl = streamOf(pnlSrc)
  const display = map((value) => readablePnl(value), pnl)
  const displayColor = skipRepeats(
    map((value) => {
      return value > 0n ? pallete.positive : value === 0n ? pallete.foreground : pallete.negative
    }, pnl),
  )

  const colorStyle = styleInline(
    map((color) => {
      return { color }
    }, displayColor),
  )

  const $testStr = $text(colorStyle, style({ fontWeight: bold ? 'bold' : 'normal' }))

  return $testStr(display)
}

export const $roiDisplay = (roiSrc: Stream<bigint> | bigint, bold = true) => {
  const roi = streamOf(roiSrc)
  const display = map((value) => readablePercentage(value), roi)
  const displayColor = skipRepeats(
    map((value) => {
      return value > 0n ? pallete.positive : value === 0n ? pallete.foreground : pallete.negative
    }, roi),
  )

  const colorStyle = styleInline(
    map((color) => {
      return { color }
    }, displayColor),
  )

  const $testStr = $text(colorStyle, style({ fontWeight: bold ? 'bold' : 'normal' }))

  return $testStr(display)
}

export const $positionRoi = (pos: IPosition, puppet?: viem.Address) => {
  const indexToken = getMarketIndexToken(pos.market)
  const lstIncrease = lst(pos.increaseList)
  const collateralUsd = getTokenUsd(lstIncrease.collateralTokenPriceMin, pos.maxCollateralInUsd)
  const latestPrice = map((pm) => getMappedValue(pm, indexToken).max, latestPriceMap)

  const roi = isPositionSettled(pos)
    ? readablePercentage(getBasisPoints(pos.realisedPnlUsd, collateralUsd))
    : map((markPrice) => {
        const delta = getPositionPnlUsd(pos.isLong, pos.lastUpdate.sizeInUsd, pos.lastUpdate.sizeInTokens, markPrice)
        return readablePercentage(getBasisPoints(pos.realisedPnlUsd + delta, collateralUsd))
      }, latestPrice)
  return $text(style({ fontSize: '.85rem' }))(roi)
}

export function $liquidationSeparator(
  isLong: boolean,
  sizeUsd: bigint,
  sizeInTokens: bigint,
  collateralAmount: bigint,
  markPrice: Stream<bigint>,
) {
  const liqWeight = map((price) => {
    const collateralUsd = getTokenUsd(price, collateralAmount)
    const liquidationPrice = getRoughLiquidationPrice(isLong, sizeUsd, sizeInTokens, collateralUsd, collateralAmount)

    return liquidationWeight(isLong, liquidationPrice, price)
  }, markPrice)

  return styleInline(
    map((weight) => {
      return {
        width: '100%',
        background: `linear-gradient(90deg, ${pallete.negative} ${`${weight * 100}%`}, ${pallete.foreground} 0)`,
      }
    }, liqWeight),
  )($seperator)
}

export const $marketLabel = (market: IMarket, showLabel = true) => {
  const indexTokenDescription = getTokenDescription(market.indexToken)
  const longTokenDescription = getTokenDescription(market.longToken)
  const shortTokenDescription = getTokenDescription(market.shortToken)
  const $iconG = $tokenIconMap[indexTokenDescription.symbol]

  return $row(spacing.default, style({ cursor: 'pointer', alignItems: 'center' }))(
    $icon({ $content: $iconG, width: '34px', viewBox: '0 0 32 32' }),
    showLabel
      ? $column(layoutSheet.flex)(
          $text(style({ fontWeight: 'bold' }))(indexTokenDescription.symbol),
          $text(style({ fontSize: '.75rem', color: pallete.foreground }))(
            `${longTokenDescription.symbol}/${shortTokenDescription.symbol}`,
          ),
        )
      : empty(),
  )
}

export const $marketSmallLabel = (market: IMarket) => {
  const indexTokenDescription = getTokenDescription(market.indexToken)
  const $iconG = $tokenIconMap[indexTokenDescription.symbol]

  return $row(spacing.small, style({ cursor: 'pointer', alignItems: 'center' }))(
    $icon({ $content: $iconG, width: '24px', viewBox: '0 0 32 32' }),
    $text(style({ fontWeight: 'bold' }))(indexTokenDescription.symbol),
  )
}

export const $openPositionBreakdown = (pos: IPosition) => {
  const indexToken = getMarketIndexToken(pos.market)
  const latestPrice = map((pm) => pm[indexToken].max, latestPriceMap)

  const updateList = [...pos.increaseList, ...pos.decreaseList].sort((a, b) => a.blockTimestamp - b.blockTimestamp)
  const totalPositionFeeAmount = updateList.reduce(
    (acc, next) => acc + next.feeCollected.positionFeeAmount * next.collateralTokenPriceMax,
    0n,
  )
  const totalBorrowingFeeAmount = updateList.reduce(
    (acc, next) => acc + next.feeCollected.borrowingFeeAmount * next.collateralTokenPriceMax,
    0n,
  )
  const totalFundingFeeAmount = updateList.reduce(
    (acc, next) => acc + next.feeCollected.fundingFeeAmount * next.collateralTokenPriceMax,
    0n,
  )

  const latestUpdate = pos.lastUpdate

  return $column(spacing.small, style({ minWidth: '250px' }))(
    $text('Net breakdown'),

    $row(style({ placeContent: 'space-between' }))(
      $text(style({ color: pallete.foreground, flex: 1 }))('Collateral'),
      $text(readableUsd(latestUpdate.collateralAmount * latestUpdate.collateralTokenPriceMax)),
    ),
    $row(style({ placeContent: 'space-between' }))(
      $text(style({ color: pallete.foreground, flex: 1 }))('Open Pnl'),
      $pnlDisplay(
        map((markPrice) => {
          return getPositionPnlUsd(pos.isLong, pos.lastUpdate.sizeInUsd, pos.lastUpdate.sizeInTokens, markPrice)
        }, latestPrice),
      ),
    ),

    $labeledDivider('Realised'),
    $row(style({ placeContent: 'space-between' }))(
      $text(style({ color: pallete.foreground }))('Margin Fee'),
      $pnlDisplay(-totalPositionFeeAmount),
    ),
    $row(style({ placeContent: 'space-between' }))(
      $text(style({ color: pallete.foreground }))('Borrowing Fee'),
      $pnlDisplay(-totalBorrowingFeeAmount),
    ),
    $row(style({ placeContent: 'space-between' }))(
      $text(style({ color: pallete.foreground }))('Funding Fee'),
      $pnlDisplay(-totalFundingFeeAmount),
    ),
    $row(style({ placeContent: 'space-between' }))(
      $text(style({ color: pallete.foreground }))('Realised Pnl'),
      // $pnlValue(now(mp.realisedPnl))
      $pnlDisplay(pos.realisedPnlUsd),
    ),
  )
}

interface ITraderDisplay {
  trader: viem.Address
  route: router.Route
  puppetList: viem.Address[]
  labelSize?: string
  profileSize?: number
}
export const $TraderDisplay = (config: ITraderDisplay) =>
  component(([click, clickTether]: Behavior<any, viem.Address>) => {
    const { route, trader, puppetList } = config

    return [
      $Link({
        $content: $row(spacing.small, style({ alignItems: 'center', textDecoration: 'none' }))(
          $profileAvatar({ ...config, account: trader }),
          $column(style({ gap: '3px' }))(
            $AccountLabel(trader),
            puppetList.length > 0
              ? $row(style({ alignItems: 'center' }))(
                  ...puppetList.map((puppet) => {
                    return style({ marginRight: '-12px', border: '2px solid black' })(
                      $profileAvatar({ account: puppet, profileSize: 25 }),
                    )
                  }),
                  $text(style({ gap: '8px', marginLeft: '16px', fontSize: '.85em' }))(`${puppetList.length}`),
                )
              : $row(style({ alignItems: 'center' }))(
                  $text(style({ color: pallete.foreground, fontSize: '.85em' }))(`0 puppets`),
                ),
          ),
        ),
        route: route.create({ fragment: 'baseRoute' }),
        url: `/app/profile/${IWalletTab.TRADER.toLowerCase()}/${trader}`,
      })({ click: clickTether() }),

      { click },
    ]
  })
