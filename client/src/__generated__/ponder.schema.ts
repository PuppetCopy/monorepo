import { onchainTable, relations } from "ponder"


export const traderRouteMetric = onchainTable("TraderRouteMetric", t => ({
  id: t.text().primaryKey(),
  matchingKey: t.hex().notNull(),
  account: t.hex().notNull(),
  collateralToken: t.hex().notNull(),
  cumulativeCollateralToken: t.bigint().notNull(),
  cumulativeCollateralUsd: t.bigint().notNull(),
  cumulativeSizeToken: t.bigint().notNull(),
  cumulativeSizeUsd: t.bigint().notNull(),
  maxSizeInTokens: t.bigint().notNull(),
  maxSizeInUsd: t.bigint().notNull(),
  maxCollateralInTokens: t.bigint().notNull(),
  maxCollateralInUsd: t.bigint().notNull(),
  openPnl: t.bigint().notNull(),
  realisedPnl: t.bigint().notNull(),
  pnl: t.bigint().notNull(),
  roi: t.bigint().notNull(),
  interval: t.integer().notNull(),
  lastUpdatedTimestamp: t.integer().notNull(),
  marketList: t.hex().array().notNull(),
}))
export type ITraderRouteMetric = typeof traderRouteMetric.$inferInsert

export const puppetSettle = onchainTable("PuppetSettle", t => ({
  id: t.hex().primaryKey(),
  puppet: t.hex().notNull(),
  amount: t.bigint().notNull(),
  settleId: t.hex().notNull(),
}))
export type IPuppetSettle = typeof settle.$inferInsert

export const puppetSettleRelations = relations(puppetSettle, ({ one }) => ({
  settle: one(settle, { fields: [puppetSettle.settleId], references: [settle.id] }),
}))

export const settle = onchainTable("Settle", t => ({
  id: t.hex().primaryKey(),
  matchingKey: t.hex().notNull(),
  allocationKey: t.hex().notNull(),

  allocationAddress: t.hex().notNull(),
  keeperFeeReceiver: t.hex().notNull(),
  collateralToken: t.hex().notNull(),
  distributionToken: t.hex().notNull(),
  puppet: t.hex().notNull(),

  keeperExecutionFee: t.bigint().notNull(),
  settledBalance: t.bigint().notNull(),
  platformFeeAmount: t.bigint().notNull(),

  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),
}))
export type ISettle = typeof settle.$inferInsert

export const settleRelations = relations(settle, ({ one }) => ({
  puppetSettle: one(puppetSettle, { fields: [settle.id], references: [puppetSettle.settleId] }),
  allocation: one(allocation, { fields: [settle.allocationKey], references: [allocation.allocationKey] }),
}))

export const adjust = onchainTable("Adjust", t => ({
  requestKey: t.hex().primaryKey(),
  allocationKey: t.hex().notNull(),
  matchingKey: t.hex().notNull(),

  allocationAddress: t.hex().notNull(),
  keeperFeeReceiver: t.hex().notNull(),

  keeperExecutionFee: t.bigint().notNull(),
  puppetKeeperExecutionFeeInsolvency: t.bigint().notNull(),
  allocation: t.bigint().notNull(),
  sizeDelta: t.bigint().notNull(),
  traderTargetLeverage: t.bigint().notNull(),

  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),
}))
export type IAdjust = typeof adjust.$inferInsert

export const mirror = onchainTable("Mirror", t => ({
  matchingKey: t.hex().notNull(),
  allocationKey: t.hex().notNull(),
  requestKey: t.hex().notNull(),

  allocationAddress: t.hex().primaryKey(),
  keeperFeeReceiver: t.hex().notNull(),

  keeperExecutionFee: t.bigint().notNull(),
  allocation: t.bigint().notNull(),
  sizeDelta: t.bigint().notNull(),
  traderTargetLeverage: t.bigint().notNull(),

  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),
}))
export type IMirror = typeof mirror.$inferInsert

export const puppetAllocate = onchainTable("PuppetAllocate", t => ({
  id: t.hex().primaryKey(),
  trader: t.hex().notNull(),
  puppet: t.hex().notNull(),
  token: t.hex().notNull(),
  matchingKey: t.hex().notNull(),
  amount: t.bigint().notNull(),

  mirrorPositionId: t.hex().notNull(),
  allocationKey: t.hex().notNull(),
}))
export type IPuppetAllocation = typeof puppetAllocate.$inferInsert

export const puppetAllocationRelations = relations(puppetAllocate, ({ one }) => ({
  allocation: one(allocation, { fields: [puppetAllocate.allocationKey], references: [allocation.allocationKey] }),
}))

export const allocation = onchainTable("Allocation", t => ({
  matchingKey: t.hex().notNull(),
  allocationKey: t.hex().notNull(),
  allocationAddress: t.hex().primaryKey(),

  puppet: t.hex().notNull(),
  allocationToken: t.hex().notNull(),

  allocation: t.bigint().notNull(),
  size: t.bigint().notNull(),
  cumulativeKeeperFee: t.bigint().notNull(),
}))
export type IAllocation = typeof allocation.$inferInsert

export const allocationRelations = relations(allocation, ({ many, one }) => ({
  mirror: one(mirror, { fields: [allocation.allocationAddress], references: [mirror.allocationAddress] }),
  settleList: many(settle),
}))

export const puppetMatchingRule = onchainTable("PuppetMatchingRule", t => ({
  id: t.hex().primaryKey(),
  matchingKey: t.hex().notNull(),

  collateralToken: t.hex().notNull(),
  puppet: t.hex().notNull(),
  trader: t.hex().notNull(),

  allowanceRate: t.bigint().notNull(),
  throttleActivity: t.bigint().notNull(),
  expiry: t.bigint().notNull(),
}))
export type IMatchingRule = typeof puppetMatchingRule.$inferInsert

export const deposit = onchainTable("Deposit", t => ({
  id: t.text().primaryKey(),
  collateralToken: t.hex().notNull(),
  user: t.hex().notNull(),
  balance: t.bigint().notNull(),
  amount: t.bigint().notNull(),

  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),
}))

export const withdraw = onchainTable("Withdraw", t => ({
  id: t.text().primaryKey(),
  collateralToken: t.hex().notNull(),
  user: t.hex().notNull(),
  receiver: t.hex().notNull(),
  balance: t.bigint().notNull(),
  amount: t.bigint().notNull(),

  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),
}))
export type IWithdraw = typeof withdraw.$inferInsert;

// ---- GMX derived data ----

export const traderOpenPnl = onchainTable("TraderOpenPnl", t => ({
  positionKey: t.hex().primaryKey(),
  pnl: t.bigint().notNull(),
  account: t.hex().notNull(),
})
)
export type ITraderOpenPnl = typeof traderOpenPnl.$inferInsert

export const positionIncrease = onchainTable("PositionIncrease", t => ({
  orderKey: t.hex().primaryKey(),
  positionKey: t.hex().notNull(),
  matchingKey: t.hex().notNull(),

  market: t.hex().notNull(),
  account: t.hex().notNull(),
  collateralToken: t.hex().notNull(),
  indexToken: t.hex().notNull(),

  sizeInTokens: t.bigint().notNull(),
  sizeInUsd: t.bigint().notNull(),
  collateralAmount: t.bigint().notNull(),
  borrowingFactor: t.bigint().notNull(),
  fundingFeeAmountPerSize: t.bigint().notNull(),
  longTokenClaimableFundingAmountPerSize: t.bigint().notNull(),
  shortTokenClaimableFundingAmountPerSize: t.bigint().notNull(),
  executionPrice: t.bigint().notNull(),
  indexTokenPriceMax: t.bigint().notNull(),
  indexTokenPriceMin: t.bigint().notNull(),
  collateralTokenPriceMax: t.bigint().notNull(),
  collateralTokenPriceMin: t.bigint().notNull(),
  sizeDeltaUsd: t.bigint().notNull(),
  sizeDeltaInTokens: t.bigint().notNull(),
  orderType: t.bigint().notNull(),

  collateralDeltaAmount: t.bigint().notNull(),
  priceImpactUsd: t.bigint().notNull(),
  priceImpactAmount: t.bigint().notNull(),

  isLong: t.boolean().notNull(),

  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),

  feeCollectedId: t.hex().notNull(),
}))
export type IPositionIncrease = typeof positionIncrease.$inferInsert

export const positionIncreaseRelations = relations(positionIncrease, ({ one }) => ({
  feeCollected: one(positionFeesCollected, { fields: [positionIncrease.feeCollectedId], references: [positionFeesCollected.id] }),
}))

export const positionDecrease = onchainTable("PositionDecrease", t => ({
  orderKey: t.hex().primaryKey(),
  positionKey: t.hex().notNull(),
  matchingKey: t.hex().notNull(),

  market: t.hex().notNull(),
  account: t.hex().notNull(),
  collateralToken: t.hex().notNull(),
  indexToken: t.hex().notNull(),

  sizeInUsd: t.bigint().notNull(),
  sizeInTokens: t.bigint().notNull(),
  collateralAmount: t.bigint().notNull(),
  borrowingFactor: t.bigint().notNull(),
  fundingFeeAmountPerSize: t.bigint().notNull(),
  longTokenClaimableFundingAmountPerSize: t.bigint().notNull(),
  shortTokenClaimableFundingAmountPerSize: t.bigint().notNull(),
  executionPrice: t.bigint().notNull(),
  indexTokenPriceMax: t.bigint().notNull(),
  indexTokenPriceMin: t.bigint().notNull(),
  collateralTokenPriceMax: t.bigint().notNull(),
  collateralTokenPriceMin: t.bigint().notNull(),
  sizeDeltaUsd: t.bigint().notNull(),
  sizeDeltaInTokens: t.bigint().notNull(),
  collateralDeltaAmount: t.bigint().notNull(),
  valuesPriceImpactDiffUsd: t.bigint().notNull(),
  orderType: t.bigint().notNull(),

  priceImpactUsd: t.bigint().notNull(),
  basePnlUsd: t.bigint().notNull(),
  uncappedBasePnlUsd: t.bigint().notNull(),

  isLong: t.boolean().notNull(),

  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),

  feeCollectedId: t.hex().notNull(),
}))
export type IPositionDecrease = typeof positionDecrease.$inferInsert

export const positionDecreaseRelations = relations(positionDecrease, ({ one }) => ({
  feeCollected: one(positionFeesCollected, { fields: [positionDecrease.feeCollectedId], references: [positionFeesCollected.id] }),
}))

export const positionFeesCollected = onchainTable("PositionFeesCollected", t => ({
  id: t.hex().primaryKey(),
  positionKey: t.hex().notNull(),
  referralCode: t.hex().notNull(),
  affiliate: t.hex().notNull(),

  collateralTokenPriceMin: t.bigint().notNull(),
  collateralTokenPriceMax: t.bigint().notNull(),
  tradeSizeUsd: t.bigint().notNull(),
  fundingFeeAmount: t.bigint().notNull(),
  claimableLongTokenAmount: t.bigint().notNull(),
  claimableShortTokenAmount: t.bigint().notNull(),
  latestFundingFeeAmountPerSize: t.bigint().notNull(),
  latestLongTokenClaimableFundingAmountPerSize: t.bigint().notNull(),
  latestShortTokenClaimableFundingAmountPerSize: t.bigint().notNull(),
  borrowingFeeUsd: t.bigint().notNull(),
  borrowingFeeAmount: t.bigint().notNull(),
  borrowingFeeReceiverFactor: t.bigint().notNull(),
  borrowingFeeAmountForFeeReceiver: t.bigint().notNull(),
  positionFeeFactor: t.bigint().notNull(),
  protocolFeeAmount: t.bigint().notNull(),
  positionFeeReceiverFactor: t.bigint().notNull(),
  feeReceiverAmount: t.bigint().notNull(),
  feeAmountForPool: t.bigint().notNull(),
  positionFeeAmountForPool: t.bigint().notNull(),
  positionFeeAmount: t.bigint().notNull(),
  totalCostAmount: t.bigint().notNull(),
  uiFeeReceiverFactor: t.bigint().notNull(),
  uiFeeAmount: t.bigint().notNull(),

  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),
})
)
export type IPositionFeesCollected = typeof positionFeesCollected.$inferInsert

export const priceCandle = onchainTable("PriceCandle", t => ({
  id: t.text().primaryKey(),
  token: t.hex().notNull(),
  interval: t.integer().notNull(),
  slotTime: t.integer().notNull(),
  o: t.bigint().notNull(),
  h: t.bigint().notNull(),
  l: t.bigint().notNull(),
  c: t.bigint().notNull(),
}))
export type IPriceCandle = typeof priceCandle.$inferInsert

export const market = onchainTable("Market", t => ({
  id: t.hex().primaryKey(),
  indexToken: t.hex().notNull(),
  longToken: t.hex().notNull(),
  shortToken: t.hex().notNull(),
  marketType: t.hex(),
}))
export type IMarket = typeof market.$inferInsert