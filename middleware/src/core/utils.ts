import { type Address, parseAbiParameters } from 'abitype'
import { encodeAbiParameters, type Hex, keccak256 } from 'viem'
import { getMarketIndexToken, getTokenDescription } from '../gmx/gmxUtils.js'
import { type IPriceCandle, type IPricefeedMap, OrderType } from '../gmx/types.js'
import { factor } from '../utils/mathUtils.js'
import { getMappedValue, unixTimestampNow } from '../utils/utils.js'

export function mapArrayBy<A, B extends string | symbol | number, R>(
  list: readonly A[],
  mapKey: (v: A) => B,
  mapValue: (v: A) => R
) {
  const gmap = {} as { [P in B]: R }

  for (const item of list) {
    const key = mapKey(item)
    gmap[key] = mapValue(item)
  }

  return gmap
}

// export function isUpdateIncrease(update: IPositionIncrease | IPositionDecrease): update is IPositionIncrease {
//   return update.orderType === OrderType.MarketIncrease || update.orderType === OrderType.LimitIncrease
// }

// export function isUpdateDecrease(update: IPositionIncrease | IPositionDecrease): update is IPositionDecrease {
//   return (
//     update.orderType === OrderType.MarketDecrease ||
//     update.orderType === OrderType.LimitDecrease ||
//     update.orderType === OrderType.Liquidation ||
//     update.orderType === OrderType.StopLossDecrease
//   )
// }

// export function isCloseUpdate(update: IPositionIncrease | IPositionDecrease): boolean {
//   return update.sizeInTokens === 0n
// }

// export function getLatestPriceFeedPrice(priceFeed: IPricefeedMap, token: Address): IPriceCandle {
//   const feed = getMappedValue(priceFeed, token)

//   if (feed.length === 0) {
//     throw new Error('Price feed not found')
//   }

//   // get the latest price based on timestamp from unsorted array
//   return feed[0]
// }

// export function isMirrorPosition(mp: IPosition): mp is IPosition {
//   return 'mirror' in mp && mp.mirror !== null
// }

// export function getPuppetShare(puppetList: IPuppetPosition[], puppet: Address): bigint {
//   const position = puppetList.find((p) => p.account === puppet)

//   if (!position) throw new Error('Puppet not found')

//   return position.collateral
// }

// export function getParticiapntCollateral(mp: IPosition, puppet?: Address): bigint {
//   return puppet ? getPuppetShare(mp.puppetList, puppet) : mp.maxCollateralInUsd
// }

// export function getParticiapntPortion(mp: IPosition, totalAmount: bigint, puppet?: Address): bigint {
//   const share = getParticiapntCollateral(mp, puppet)

//   return getPortion(mp.maxCollateralInUsd, share, totalAmount)
// }

// export function getSettledMpPnL(mp: IPosition, puppet?: Address): bigint {
//   const realisedPnl = getParticiapntPortion(mp, mp.realisedPnlUsd, puppet)

//   return realisedPnl
// }

// export function getPortion(supply: bigint, share: bigint, amount: bigint): bigint {
//   if (supply === 0n || amount === 0n) return amount

//   if (share === 0n) {
//     return amount
//   }
//   return (amount * share) / supply
// }

// export function getVestingCursor(vested: IVested): IVested {
//   const now = BigInt(unixTimestampNow())
//   const timeElapsed = now - vested.lastAccruedTime
//   const accruedDelta =
//     timeElapsed >= vested.remainingDuration ? vested.amount : (timeElapsed * vested.amount) / vested.remainingDuration

//   vested.remainingDuration =
//     timeElapsed >= vested.remainingDuration ? 0n : vested.remainingDuration - BigInt(timeElapsed)
//   vested.amount -= accruedDelta
//   vested.accrued += accruedDelta

//   vested.lastAccruedTime = now

//   return vested
// }

export function getMatchKey(collateralToken: Address, trader: Address) {
  return keccak256(encodeAbiParameters(parseAbiParameters('address, address'), [collateralToken, trader]))
}

export function getAllocationKey(puppetList: Address[], traderMatchingKey: Hex, allocationId: bigint) {
  return keccak256(
    encodeAbiParameters(parseAbiParameters('address[], bytes32, uint256'), [
      puppetList,
      traderMatchingKey,
      allocationId
    ])
  )
}
