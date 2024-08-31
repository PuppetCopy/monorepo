import { GMX_EventEmitter, handlerContext, Position } from "generated"
import { ADDRESS_ZERO, BASIS_POINTS_DIVISOR, OrderStatus, PLATFORM_STAT_INTERVAL, PRICEFEED_INTERVAL_LIST } from "./const"
import { getAddressItem, getUintItem, getBytes32Item, GmxEvent, getAddressItemList, getBoolItem, getIntItem, toBasisPoints } from "./utils"

GMX_EventEmitter.EventLog1.handler(async ({ event, context }) => {
  if (event.params.eventName == "OraclePriceUpdate") {
    await onOraclePriceUpdate(event, context)
  } else if (event.params.eventName == "PositionIncrease") {
    await onPositionIncrease(event, context)
  } else if (event.params.eventName == "PositionDecrease") {
    await onPositionDecrease(event, context)
  }
  // else if (event.params.eventName == "PositionFeesCollected") {
  //   onPositionFeesInfo(event)
  // } else if (event.params.eventName == "PositionFeesInfo") {
  //   onPositionFeesInfo(event)
  // } else if (event.params.eventName == "OrderCollateralDeltaAmountAutoUpdated") {
  //   onOrderCollateralDeltaAmountAutoUpdated(event)
  // } else if (event.params.eventName == "OrderSizeDeltaAutoUpdated") {
  //   onOrderSizeDeltaAutoUpdated(event)
  // } else if (event.params.eventName == "MarketCreated") {
  //   const marketCreated = dto.createMarketCreated(event)
  //   marketCreated.save()
  // }
})

const orderStatusMap = {
  OrderCreated: OrderStatus.CREATED,
  OrderCancelled: OrderStatus.CANCELLED,
  OrderFrozen: OrderStatus.FROZEN
}

GMX_EventEmitter.EventLog2.handler(async ({ event, context }) => {
  if (event.params.eventName == "OrderCreated") {
    context.RequestPosition.set({
      account: getAddressItem(event, 0),
      receiver: getAddressItem(event, 1),
      callbackContract: getAddressItem(event, 2),
      uiFeeReceiver: getAddressItem(event, 3),
      market: getAddressItem(event, 4),
      initialCollateralToken: getAddressItem(event, 5),

      swapPath: getAddressItemList(event, 0),

      orderType: Number(getUintItem(event, 0)),
      decreasePositionSwapType: getUintItem(event, 1),
      sizeDeltaUsd: getUintItem(event, 2),
      initialCollateralDeltaAmount: getUintItem(event, 3),
      triggerPrice: getUintItem(event, 4),
      acceptablePrice: getUintItem(event, 5),
      executionFee: getUintItem(event, 6),
      callbackGasLimit: getUintItem(event, 7),
      minOutputAmount: getUintItem(event, 8),
      updatedAtBlock: getUintItem(event, 9),

      isLong: getBoolItem(event, 0),
      shouldUnwrapNativeToken: getBoolItem(event, 1),
      isFrozen: getBoolItem(event, 2),
      key: getBytes32Item(event, 0),
      id: getBytes32Item(event, 0)
    })
  }
  // else if (event.params.eventName == "OrderCancelled") {
  //   onOrderCancelled(event)
  // } else if (event.params.eventName == "OrderFrozen") {
  //   onOrderFrozen(event)
  // }

  const orderStatus: number | undefined = orderStatusMap[event.params.eventName as keyof typeof orderStatusMap]
  if (orderStatus) {


  }
})



async function onOraclePriceUpdate(event: GmxEvent, context: handlerContext) {
  const token = getAddressItem(event, 0)
  const price = getUintItem(event, 1)
  const timestamp = getUintItem(event, 2)


  for (let index = 0; index < PRICEFEED_INTERVAL_LIST.length; index++) {
    const interval = PRICEFEED_INTERVAL_LIST[index]

    await updatePriceCandle(interval, timestamp, token, context, price)
  }
}


async function updatePriceCandle(interval: bigint, timestamp: bigint, token: string, context: handlerContext, price: bigint) {
  const timeSlot = (timestamp / interval) * interval
  const id = `${token}:${interval}:${timeSlot}`
  const storedSeed = await context.PriceCandle.get(id)

  if (storedSeed) {
    const seed = { ...storedSeed }

    if (price > seed.h) {
      seed.h = price
    } else if (price < seed.l) {
      seed.l = price
    }

    seed.c = price

    context.PriceCandle.set(seed)
  } else {
    context.PriceCandle.set({
      id,
      token: token,

      interval: interval,
      timestamp: timeSlot,

      o: price,
      h: price,
      l: price,
      c: price
    })
  }

}

async function onPositionIncrease(event: GmxEvent, context: handlerContext) {
  const orderKey = getBytes32Item(event, 0)
  const request = context.RequestPosition.get(orderKey)

  if (!request) {
    context.log.error("PositionRequest not found")
    return
  }

  const positionKey = getBytes32Item(event, 1)

  let positionRef = await context.PositionRef.get(positionKey)

  const sizeInUsd = getUintItem(event, 0)
  const sizeInTokens = getUintItem(event, 1)
  const collateralAmount = getUintItem(event, 2)
  const isLong = getBoolItem(event, 0)

  const collateralTokenPriceMax = getUintItem(event, 10)
  const collateralUsd = collateralAmount * collateralTokenPriceMax

  let position

  if (positionRef) {
    const storedPosition = await context.Position.get(positionRef.position_id)

    if (!storedPosition) {
      context.log.error("Position not found")
      return
    }


    position = {
      ...storedPosition,
      sizeInUsd: storedPosition.sizeInUsd + sizeInUsd,
      sizeInTokens: storedPosition.sizeInTokens + sizeInTokens,
      collateralAmount: storedPosition.collateralAmount + collateralAmount,

      cumulativeSizeUsd: storedPosition.cumulativeSizeUsd + sizeInUsd,
      cumulativeSizeToken: storedPosition.cumulativeSizeToken + sizeInTokens,
      cumulativeCollateralUsd: storedPosition.cumulativeCollateralUsd + collateralUsd,
      cumulativeCollateralToken: storedPosition.cumulativeCollateralToken + collateralAmount,

      maxSizeUsd: storedPosition.maxSizeUsd > storedPosition.sizeInUsd ? storedPosition.maxSizeUsd : storedPosition.sizeInUsd,
      maxSizeToken: storedPosition.maxSizeToken > storedPosition.maxSizeToken ? storedPosition.maxSizeToken : storedPosition.maxSizeToken,
      maxCollateralToken: storedPosition.maxCollateralToken > storedPosition.collateralAmount ? storedPosition.maxCollateralToken : storedPosition.collateralAmount,
      maxCollateralUsd: storedPosition.maxCollateralUsd > collateralUsd ? storedPosition.maxCollateralUsd : collateralUsd
    }
  } else {
    positionRef = { id: positionKey, position_id: orderKey }
    context.PositionRef.set(positionRef)

    position = {
      id: orderKey,
      key: positionKey,

      account: getAddressItem(event, 0),
      market: getAddressItem(event, 1),
      collateralToken: getAddressItem(event, 2),

      sizeInUsd: sizeInUsd,
      sizeInTokens: sizeInTokens,
      collateralAmount: collateralAmount,

      cumulativeSizeUsd: sizeInUsd,
      cumulativeSizeToken: sizeInTokens,
      cumulativeCollateralUsd: collateralUsd,
      cumulativeCollateralToken: collateralAmount,

      maxSizeUsd: sizeInUsd,
      maxSizeToken: sizeInTokens,
      maxCollateralToken: collateralAmount,
      maxCollateralUsd: collateralUsd,

      isLong: isLong,
      realisedPnlUsd: 0n,
      isSettled: false
    }
  }

  context.Position.set(position)

  context.PositionIncrease.set({
    id: orderKey,
    positionKey: position.key,

    account: position.account,
    market: position.market,
    collateralToken: position.collateralToken,

    sizeInUsd: sizeInUsd,
    sizeInTokens: sizeInTokens,
    collateralAmount: collateralAmount,
    borrowingFactor: getUintItem(event, 3),
    fundingFeeAmountPerSize: getUintItem(event, 4),
    longTokenClaimableFundingAmountPerSize: getUintItem(event, 5),
    shortTokenClaimableFundingAmountPerSize: getUintItem(event, 6),
    executionPrice: getUintItem(event, 7),
    indexTokenPriceMax: getUintItem(event, 8),
    indexTokenPriceMin: getUintItem(event, 9),
    collateralTokenPriceMax: collateralTokenPriceMax,
    collateralTokenPriceMin: getUintItem(event, 11),
    sizeDeltaUsd: getUintItem(event, 12),
    sizeDeltaInTokens: getUintItem(event, 13),
    orderType: Number(getUintItem(event, 14)),

    collateralDeltaAmount: getIntItem(event, 0),
    priceImpactUsd: getIntItem(event, 1),
    priceImpactAmount: getIntItem(event, 2),

    isLong: isLong,
    orderKey: position.key,

    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.transaction.transactionIndex,

    position_id: positionRef.id,
  })

}

async function onPositionDecrease(event: GmxEvent, context: handlerContext) {
  const orderKey = getBytes32Item(event, 0)
  const positionKey = getBytes32Item(event, 1)

  let positionRef = await context.PositionRef.get(positionKey)


  if (!positionRef) {
    context.log.error("PositionRef not found")
    return
  }

  const storedPosition = await context.Position.get(positionRef?.id)

  if (!storedPosition) {
    context.log.error("Position not found")
    return
  }


  const sizeInUsd = getUintItem(event, 0)
  const sizeInTokens = getUintItem(event, 1)
  const collateralAmount = getUintItem(event, 2)

  const basePnlUsd = getIntItem(event, 1)

  let position

  if (sizeInTokens > 0) {
    position = {
      ...storedPosition,
      sizeInUsd: storedPosition.sizeInUsd - sizeInUsd,
      sizeInTokens: storedPosition.sizeInTokens - sizeInTokens,
      collateralAmount: storedPosition.collateralAmount - collateralAmount,

      realisedPnlUsd: storedPosition.realisedPnlUsd + basePnlUsd,
    }
  } else {
    context.PositionRef.deleteUnsafe(positionKey)

    position = {
      ...storedPosition,
      id: storedPosition.id,
      realisedPnlUsd: storedPosition.realisedPnlUsd + basePnlUsd,
    }

    // context.Position.deleteUnsafe(positionKey)

    for (let index = 0; index < PLATFORM_STAT_INTERVAL.length; index++) {
      const interval = PLATFORM_STAT_INTERVAL[index]
      await updatePlatformPositionStats(context, event, interval, ADDRESS_ZERO, position)
    }
  }

  context.Position.set(position)

  context.PositionDecrease.set({
    id: orderKey,
    // feeCollected_id: orderId,

    account: position.account,
    market: position.market,
    collateralToken: position.collateralToken,

    sizeInUsd: sizeInUsd,
    sizeInTokens: sizeInTokens,
    collateralAmount: collateralAmount,
    borrowingFactor: getUintItem(event, 3),
    fundingFeeAmountPerSize: getUintItem(event, 4),
    longTokenClaimableFundingAmountPerSize: getUintItem(event, 5),
    shortTokenClaimableFundingAmountPerSize: getUintItem(event, 6),
    executionPrice: getUintItem(event, 7),
    indexTokenPriceMax: getUintItem(event, 8),
    indexTokenPriceMin: getUintItem(event, 9),
    collateralTokenPriceMax: getUintItem(event, 10),
    collateralTokenPriceMin: getUintItem(event, 11),
    sizeDeltaUsd: getUintItem(event, 12),
    sizeDeltaInTokens: getUintItem(event, 13),
    collateralDeltaAmount: getUintItem(event, 14),
    valuesPriceImpactDiffUsd: getUintItem(event, 15),
    orderType: Number(getUintItem(event, 16)),

    priceImpactUsd: getIntItem(event, 0),
    basePnlUsd: basePnlUsd,
    uncappedBasePnlUsd: getIntItem(event, 2),

    isLong: getBoolItem(event, 0),

    orderKey: orderKey,
    positionKey: positionKey,

    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.transaction.transactionIndex,

    position_id: positionRef.id,

  })


}



async function updatePlatformPositionStats(context: handlerContext, event: GmxEvent, interval: bigint, account: string, position: Position) {
  const timestamp = (BigInt(event.block.timestamp) / interval) * interval
  const id = `${account}:${interval}`
  const seed = await context.PlatofrmPositionStats.get(id)

  if (seed) {
    context.PlatofrmPositionStats.set({
      id,

      interval,
      timestamp,
      puppets: 0n,

      cumulativeSizeUsd: seed.cumulativeSizeUsd + position.cumulativeSizeUsd,
      cumulativeCollateralUsd: seed.cumulativeCollateralUsd + position.cumulativeCollateralUsd,
      maxSizeUsd: position.maxSizeUsd > seed.maxSizeUsd ? position.maxSizeUsd : seed.maxSizeUsd,
      maxCollateralUsd: position.maxCollateralUsd > seed.maxCollateralUsd ? position.maxCollateralUsd : seed.maxCollateralUsd,
      pnl: seed.pnl + position.realisedPnlUsd,
      roi: toBasisPoints(seed.pnl + position.realisedPnlUsd, seed.maxCollateralUsd),
      winCount: position.realisedPnlUsd > 0 ? seed.winCount + 1n : seed.winCount,
      lossCount: position.realisedPnlUsd < 0 ? seed.lossCount + 1n : seed.lossCount,
      successRate: toBasisPoints(seed.winCount + 1n, seed.winCount + seed.lossCount + 1n)
    })
  } else {

    context.PlatofrmPositionStats.set({
      id,

      interval,
      timestamp,

      puppets: 0n,

      cumulativeSizeUsd: position.cumulativeSizeUsd,
      cumulativeCollateralUsd: position.cumulativeCollateralUsd,
      maxSizeUsd: position.maxSizeUsd,

      maxCollateralUsd: position.maxCollateralUsd,
      pnl: position.realisedPnlUsd,
      roi: toBasisPoints(position.realisedPnlUsd, position.maxCollateralUsd),
      winCount: position.realisedPnlUsd > 0 ? 1n : 0n,
      lossCount: position.realisedPnlUsd < 0 ? 1n : 0n,
      successRate: position.realisedPnlUsd > 0 ? BASIS_POINTS_DIVISOR : 0n
    })



  }


}
