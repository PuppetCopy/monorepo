import type {
  adjust,
  allocation,
  market,
  matchingOrder,
  mirror,
  openPosition,
  oraclePrice,
  positionDecrease,
  positionFeesCollected,
  positionIncrease,
  priceCandle,
  puppetAllocate,
  puppetMatchingRule,
  settle,
  traderRouteLatestMetric,
  traderRouteMetric,
  withdraw
} from './ponder.schema'

export type ITraderRouteMetric = typeof traderRouteMetric.$inferInsert
export type ITraderRouteLatestMetric = typeof traderRouteLatestMetric.$inferInsert & {
  traderRouteMetric: ITraderRouteMetric
}
export type IOpenPosition = typeof openPosition.$inferInsert
export type IPositionIncrease = typeof positionIncrease.$inferInsert
export type IPositionIncreaseWithFee = IPositionIncrease & { feeCollected: IPositionFeesCollected }
export type IPositionDecrease = typeof positionDecrease.$inferInsert
export type IPositionDecreaseWithFee = IPositionDecrease & { feeCollected: IPositionFeesCollected }
export type IPositionFeesCollected = typeof positionFeesCollected.$inferInsert
export type IOraclePrice = typeof oraclePrice.$inferInsert
export type IPriceCandle = typeof priceCandle.$inferInsert
export type IMarket = typeof market.$inferInsert

export type IPuppetSettle = typeof settle.$inferInsert
export type ISettle = typeof settle.$inferInsert
export type IAdjust = typeof adjust.$inferInsert
export type IMirror = typeof mirror.$inferInsert
export type IPuppetAllocation = typeof puppetAllocate.$inferInsert
export type IAllocation = typeof allocation.$inferInsert
export type IMatchingRule = typeof puppetMatchingRule.$inferInsert
export type IWithdraw = typeof withdraw.$inferInsert
export type IKeeperMatchingExeuction = typeof matchingOrder.$inferInsert
