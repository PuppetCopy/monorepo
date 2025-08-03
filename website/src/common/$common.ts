import {
  getMappedValue,
  type ITokenDescription,
  latestPriceMap,
  lst,
  readableDate,
  readableLeverage,
  readablePercentage,
  readablePnl,
  readableUsd,
  toBasisPoints
} from '@puppet-copy/middleware/core'
import {
  getPositionPnlUsd,
  getRoughLiquidationPrice,
  getTokenDescription,
  liquidationWeight
} from '@puppet-copy/middleware/gmx'
import {
  $infoLabel,
  $infoLabeledValue,
  $Link,
  $labeledDivider,
  $Tooltip,
  $tokenIconMap,
  $unknown
} from '@puppet-copy/middleware/ui-components'
import type { IMarket } from '@puppet-copy/sql/schema'
import { $node, $text, component, type INode, nodeEvent, style, styleInline } from 'aelea/core'
import type * as router from 'aelea/router'
import { empty, type IBehavior, type IComposeBehavior, type IStream, map, skipRepeats, toStream } from 'aelea/stream'
import { $column, $icon, $row, $seperator, isDesktopScreen, layoutSheet, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $AccountLabel, $profileAvatar } from '../components/$AccountProfile.js'
import { $seperator2 } from '../pages/common.js'
import { type IPosition, IWalletTab } from '../pages/type.js'
import { isPositionSettled } from '../utils/utils.js'

export const $midContainer = $column(
  style({
    margin: '0 auto',
    maxWidth: '980px',
    padding: `0 ${isDesktopScreen ? '12px' : '0'} 26px`,
    gap: isDesktopScreen ? '50px' : '50px',
    width: '100%'
  })
)

export const $size = (size: bigint, collateral: bigint, $divider = $seperator2) => {
  return $column(spacing.tiny)($text(readableUsd(size)), $divider, $leverage(size, collateral))
}

export const $entry = (pos: IPosition) => {
  const indexDescription = getTokenDescription(pos.indexToken)
  const collateralTokenDescription = getTokenDescription(pos.collateralToken)

  const $label = $node(style({ width: '125px' }))

  return $row(spacing.small, style({ alignItems: 'center' }))(
    $Tooltip({
      // $dropContainer: $defaultDropContainer,
      $content: $column(spacing.default)(
        $infoLabeledValue($label($text('Market Token')), $tokenLabeled(indexDescription)),
        $infoLabeledValue($label($text('Collateral Token')), $tokenLabeled(collateralTokenDescription)),
        isPositionSettled(pos)
          ? $infoLabeledValue(
              $label($text('Close Time')),
              $node(style({ fontSize: '.8rem' }))($text(readableDate(pos.lastUpdateTimestamp)))
            )
          : empty
      ),
      $anchor: $route(indexDescription, false)
    })({}),
    $column(spacing.tiny)(
      $infoLabel($text(pos.isLong ? 'LONG' : 'SHORT')),
      $node(style({ fontSize: '.8rem' }))($text(readableUsd(pos.avgEntryPrice)))
    )
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
        marginLeft: '-15px'
      })($tokenIcon(collateralTokenDescription))
    ),
    displayLabel ? $column($text(`${collateralTokenDescription.symbol}`)) : empty
  )
}

export const $tokenLabeled = (indexDescription: ITokenDescription) => {
  return $row(spacing.small, style({ alignItems: 'center' }))(
    style({ width: '18px', height: '18px' })($tokenIcon(indexDescription)),
    $text(`${indexDescription.symbol}`)
  )
}

export const $tokenTryLabeled = (token: Address, displayLabel = false, size = '18px') => {
  const description = getTokenDescription(token)

  return $row(spacing.small, style({ alignItems: 'center' }))(
    style({ width: size, height: size })($tokenIcon(description)),
    displayLabel ? $text(`${description.symbol}`) : empty
    // $text(style({ fontSize: '1rem' }))(`${description ? description.symbol :  readableAddress(indexToken)}`),
  )
}

export const $tokenIcon = (tokenDesc: ITokenDescription | null) => {
  const $token = tokenDesc ? $tokenIconMap[tokenDesc.symbol] || $unknown : $unknown

  if (!$token) {
    throw new Error('Unable to find matched token')
  }

  return $icon({
    $content: $token,
    svgOps: style({ fill: pallete.message, width: '24px', height: '24px' }),
    viewBox: '0 0 32 32'
  })
}

export const $puppetList = (puppets?: Address[], click?: IComposeBehavior<INode, string>) => {
  // const positionMarkPrice = tradeReader.getLatestPrice(now(pos.indexToken))
  // const cumulativeFee = tradeReader.vault.read('cumulativeFundingRates', pos.collateralToken)

  if (!puppets || puppets.length === 0) {
    return $node(style({ fontSize: '.8rem', color: pallete.foreground }))($text('-'))
  }

  return $row(style({ cursor: 'pointer' }))(
    ...puppets.map((account) => {
      if (!click) {
        return style({ marginRight: '-12px', border: '2px solid black' })(
          $profileAvatar({ address: account, size: 25 })
        )
      }

      return click(
        nodeEvent('click'),
        map(() => {
          const url = `/position/${account}`

          history.pushState({}, '', url)
          return url
        })
      )(style({ marginRight: '-12px', border: '2px solid black' })($profileAvatar({ address: account, size: 25 })))
    })
    // $content
  )
}

export const $leverage = (size: bigint, collateral: bigint) => {
  return $node(style({ fontWeight: 'bold', letterSpacing: '0.05em', fontSize: '.8rem' }))(
    $text(readableLeverage(size, collateral))
  )
}

export const $pnlDisplay = (pnlSrc: IStream<bigint> | bigint, bold = true) => {
  const pnl = toStream(pnlSrc)
  const display = map((value) => readablePnl(value), pnl)
  const displayColor = skipRepeats(
    map((value) => {
      return value > 0n ? pallete.positive : value === 0n ? pallete.foreground : pallete.negative
    }, pnl)
  )

  const colorStyle = styleInline(
    map((color) => {
      return { color }
    }, displayColor)
  )

  return $node(colorStyle, style({ fontWeight: bold ? 'bold' : 'normal' }))($text(display))
}

export const $roiDisplay = (roiSrc: IStream<bigint> | bigint, bold = true) => {
  const roi = toStream(roiSrc)
  const display = map((value) => readablePercentage(value), roi)
  const displayColor = skipRepeats(
    map((value) => {
      return value > 0n ? pallete.positive : value === 0n ? pallete.foreground : pallete.negative
    }, roi)
  )

  const colorStyle = styleInline(
    map((color) => {
      return { color }
    }, displayColor)
  )

  return $node(colorStyle, style({ fontWeight: bold ? 'bold' : 'normal' }))($text(display))
}

export const $positionRoi = (pos: IPosition, _puppet?: Address) => {
  const indexToken = pos.indexToken
  const lstIncrease = lst(pos.increaseList)
  const collateralUsd = lstIncrease.collateralTokenPriceMin * pos.maxCollateralInUsd
  const latestPrice = map((pm) => {
    const price = getMappedValue(pm, indexToken)
    return price && typeof price === 'object' && 'max' in price ? price.max : 0n
  }, latestPriceMap)

  const roi = isPositionSettled(pos)
    ? readablePercentage(toBasisPoints(pos.realisedPnlUsd, collateralUsd))
    : map((markPrice) => {
        const delta = getPositionPnlUsd(
          pos.isLong,
          pos.lastUpdate.sizeInUsd,
          pos.lastUpdate.sizeInTokens,
          markPrice as bigint
        )
        return readablePercentage(toBasisPoints(pos.realisedPnlUsd + delta, collateralUsd))
      }, latestPrice)
  return $node(style({ fontSize: '.8rem' }))($text(roi))
}

export function $liquidationSeparator(
  isLong: boolean,
  sizeUsd: bigint,
  sizeInTokens: bigint,
  collateralAmount: bigint,
  markPrice: IStream<bigint>
) {
  const liqWeight = map((price) => {
    const collateralUsd = price * collateralAmount
    const liquidationPrice = getRoughLiquidationPrice(isLong, sizeUsd, sizeInTokens, collateralUsd, collateralAmount)

    return liquidationWeight(isLong, liquidationPrice, price)
  }, markPrice)

  return styleInline(
    map((weight) => {
      return {
        width: '100%',
        background: `linear-gradient(90deg, ${pallete.negative} ${`${weight * 100}%`}, ${pallete.foreground} 0)`
      }
    }, liqWeight)
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
          $node(style({ fontWeight: 'bold' }))($text(indexTokenDescription.symbol)),
          $node(style({ fontSize: '1.1rem', color: pallete.foreground }))(
            $text(`${longTokenDescription.symbol}/${shortTokenDescription.symbol}`)
          )
        )
      : empty
  )
}

export const $marketSmallLabel = (market: IMarket) => {
  const indexTokenDescription = getTokenDescription(market.indexToken)
  const $iconG = $tokenIconMap[indexTokenDescription.symbol]

  return $row(spacing.small, style({ cursor: 'pointer', alignItems: 'center' }))(
    $icon({ $content: $iconG, width: '24px', viewBox: '0 0 32 32' }),
    $node(style({ fontWeight: 'bold' }))($text(indexTokenDescription.symbol))
  )
}

export const $openPositionBreakdown = (pos: IPosition) => {
  const indexToken = pos.indexToken
  const latestPrice = map((pm: any) => {
    const price = pm[indexToken]
    return price && typeof price === 'object' && 'max' in price ? price.max : 0n
  }, latestPriceMap)

  // const updateList = [...pos.increaseList, ...pos.decreaseList].sort((a, b) => a.blockTimestamp - b.blockTimestamp)
  // TODO: Fix fee collection - need to include feeCollected relation in query
  const totalPositionFeeAmount = 0n // updateList.reduce((acc, next) => acc + next.feeCollected.positionFeeAmount * next.collateralTokenPriceMax, 0n)
  const totalBorrowingFeeAmount = 0n // updateList.reduce((acc, next) => acc + next.feeCollected.borrowingFeeAmount * next.collateralTokenPriceMax, 0n)
  const totalFundingFeeAmount = 0n // updateList.reduce((acc, next) => acc + next.feeCollected.fundingFeeAmount * next.collateralTokenPriceMax, 0n)

  const latestUpdate = pos.lastUpdate

  return $column(spacing.small, style({ minWidth: '250px' }))(
    $text('Net breakdown'),

    $row(style({ placeContent: 'space-between' }))(
      $node(style({ color: pallete.foreground, flex: 1 }))($text('Collateral')),
      $text(readableUsd(latestUpdate.collateralInTokens * latestUpdate.collateralTokenPriceMax))
    ),
    $row(style({ placeContent: 'space-between' }))(
      $node(style({ color: pallete.foreground, flex: 1 }))($text('Open Pnl')),
      $pnlDisplay(
        map((markPrice) => {
          return getPositionPnlUsd(pos.isLong, pos.lastUpdate.sizeInUsd, pos.lastUpdate.sizeInTokens, markPrice)
        }, latestPrice)
      )
    ),

    $labeledDivider('Realised'),
    $row(style({ placeContent: 'space-between' }))(
      $node(style({ color: pallete.foreground }))($text('Margin Fee')),
      $pnlDisplay(-totalPositionFeeAmount)
    ),
    $row(style({ placeContent: 'space-between' }))(
      $node(style({ color: pallete.foreground }))($text('Borrowing Fee')),
      $pnlDisplay(-totalBorrowingFeeAmount)
    ),
    $row(style({ placeContent: 'space-between' }))(
      $node(style({ color: pallete.foreground }))($text('Funding Fee')),
      $pnlDisplay(-totalFundingFeeAmount)
    ),
    $row(style({ placeContent: 'space-between' }))(
      $node(style({ color: pallete.foreground }))($text('Realised Pnl')),
      // $pnlValue(now(mp.realisedPnl))
      $pnlDisplay(pos.realisedPnlUsd)
    )
  )
}

interface ITraderDisplay {
  address: Address
  route: router.Route
  puppetList: Address[]
  labelSize?: number
  profileSize?: number
}
export const $TraderDisplay = (config: ITraderDisplay) =>
  component(([click, clickTether]: IBehavior<any, Address>) => {
    const { route, address, puppetList, labelSize, profileSize } = config

    return [
      $Link({
        $content: $row(spacing.small, style({ alignItems: 'center', textDecoration: 'none' }))(
          $profileAvatar({ address, size: profileSize }),
          labelSize === undefined || labelSize > 0
            ? $column(style({ gap: '3px' }))(
                $AccountLabel({
                  address,
                  primarySize: labelSize
                }),
                puppetList.length > 0
                  ? $row(style({ alignItems: 'center' }))(
                      ...puppetList.map((puppet) => {
                        return style({ marginRight: '-12px', border: '2px solid black' })(
                          $profileAvatar({ address: puppet, size: 25 })
                        )
                      }),
                      $node(style({ gap: '8px', marginLeft: '16px', fontSize: '.8rem' }))($text(`${puppetList.length}`))
                    )
                  : $row(style({ alignItems: 'center' }))(
                      $node(style({ color: pallete.foreground, fontSize: '.8rem' }))($text('0 puppets'))
                    )
              )
            : empty
        ),
        route: route.create({ fragment: 'baseRoute' }),
        url: `/${IWalletTab.TRADER.toLowerCase()}/${address}`
      })({ click: clickTether() }),

      { click }
    ]
  })
