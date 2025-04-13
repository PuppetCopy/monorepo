import { onchainTable, relations } from "ponder"

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

export const positionIncrease = onchainTable("PositionIncrease", t => ({
  id: t.hex().primaryKey(),
  market: t.hex().notNull(),
  account: t.hex().notNull(),
  collateralToken: t.hex().notNull(),
  positionKey: t.hex().notNull(),

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

  blockNumber: t.integer().notNull(),
  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),

  feeCollectedId: t.hex().notNull(),
  traderRouteId: t.hex().notNull(),
  mirrorPositionId: t.hex().notNull(),
}))
export type IPositionIncrease = typeof positionIncrease.$inferInsert


export const positionIncreaseRelations = relations(positionIncrease, ({ one }) => ({
  feeCollected: one(positionFeesCollected, { fields: [positionIncrease.feeCollectedId], references: [positionFeesCollected.id] }),
  traderRoute: one(traderRoute, { fields: [positionIncrease.traderRouteId], references: [traderRoute.id] }),
  mirrorPosition: one(mirrorPosition, { fields: [positionIncrease.mirrorPositionId], references: [mirrorPosition.id] }),
}))

export const positionDecrease = onchainTable("PositionDecrease", t => ({
  id: t.hex().primaryKey(),
  market: t.hex().notNull(),
  account: t.hex().notNull(),
  collateralToken: t.hex().notNull(),
  positionKey: t.hex().notNull(),

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

  blockNumber: t.integer().notNull(),
  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),

  feeCollectedId: t.hex().notNull(),
  mirrorPositionId: t.hex().notNull(),
  traderRouteId: t.hex().notNull(),
}))
export type IPositionDecrease = typeof positionDecrease.$inferInsert

export const positionDecreaseRelations = relations(positionDecrease, ({ one }) => ({
  feeCollected: one(positionFeesCollected, { fields: [positionDecrease.feeCollectedId], references: [positionFeesCollected.id] }),
  traderRoute: one(traderRoute, { fields: [positionDecrease.traderRouteId], references: [traderRoute.id] }),
  mirrorPosition: one(mirrorPosition, { fields: [positionDecrease.mirrorPositionId], references: [mirrorPosition.id] }),
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

  blockNumber: t.integer().notNull(),
  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),
})
)
export type IPositionFeesCollected = typeof positionFeesCollected.$inferInsert


export const puppetProfile = onchainTable("PuppetProfile", t => ({
  id: t.hex().primaryKey(),
  token: t.hex().notNull(),
  balance: t.bigint().notNull(),
  allocated: t.bigint().notNull(),
  gbcTokenId: t.integer(),
}))
export type IPuppetUser = typeof puppetProfile.$inferInsert

export const traderUser = onchainTable("TraderUser", t => ({
  id: t.hex().primaryKey(),
  gbcTokenId: t.hex(),
}))
export type ITraderUser = typeof puppetProfile.$inferInsert


export const puppetAllocation = onchainTable("PuppetAllocation", t => ({
  id: t.hex().primaryKey(),
  trader: t.hex().notNull(),
  puppet: t.hex().notNull(),
  token: t.hex().notNull(),
  matchingKey: t.hex().notNull(),
  amount: t.bigint().notNull(),

  mirrorPositionId: t.hex().notNull(),
  settlementId: t.hex().notNull(),
}))
export type IPuppetAllocation = typeof puppetAllocation.$inferInsert

export const puppetAllocationRelations = relations(puppetAllocation, ({ one }) => ({
  settlement: one(settlement, { fields: [puppetAllocation.settlementId], references: [settlement.id] }),
  mirrorPosition: one(mirrorPosition, { fields: [puppetAllocation.mirrorPositionId], references: [mirrorPosition.id] }),
}))

export const settlement = onchainTable("Settlement", t => ({
  id: t.hex().primaryKey(),
  puppet: t.hex().notNull(),
  collateralToken: t.hex().notNull(),
  matchingKey: t.hex().notNull(),
  allocated: t.bigint().notNull(),
  settled: t.bigint().notNull(),
  puppetContribution: t.bigint().notNull(),
  traderPerformanceContribution: t.bigint().notNull(),
  transactionCost: t.bigint().notNull(),
  profit: t.bigint().notNull(),

  blockNumber: t.integer().notNull(),
  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),

  traderRouteId: t.hex().notNull(),
  mirrorPositionId: t.hex().notNull(),
}))
export type ISettlement = typeof settlement.$inferInsert

export const settlementRelations = relations(settlement, ({ one, many }) => ({
  traderRoute: one(traderRoute, { fields: [settlement.traderRouteId], references: [traderRoute.id] }),
  mirrorPosition: one(mirrorPosition, { fields: [settlement.mirrorPositionId], references: [mirrorPosition.id] }),
}))

export const mirrorPosition = onchainTable("MirrorPosition", t => ({
  id: t.hex().primaryKey(),
  trader: t.hex().notNull(),
  keeperFeeReceiver: t.hex().notNull(),
  matchingKey: t.hex().notNull(),

  size: t.bigint().notNull(),
  allocation: t.bigint().notNull(),
  cumulativeKeeperFee: t.bigint().notNull(),

  blockNumber: t.integer().notNull(),
  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),
})
)
export type IMirrorPosition = typeof mirrorPosition.$inferInsert

export const mirrorPositionRelations = relations(mirrorPosition, ({ many }) => ({
  increaseList: many(positionIncrease),
  decreaseList: many(positionDecrease),
  settlementList: many(settlement),
}))


export const traderOpenPnl = onchainTable("TraderOpenPnl", t => ({
  id: t.hex().primaryKey(),
  pnl: t.bigint().notNull(),
  account: t.hex().notNull(),
})
)
export type ITraderOpenPnl = typeof traderOpenPnl.$inferInsert


export const traderRouteMetric = onchainTable("TraderRouteMetric", t => ({
  id: t.text().primaryKey(),
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
  syncTimestamp: t.integer().notNull(),
  marketList: t.hex().array().notNull(),
  longShortRatio: t.bigint().notNull(),

  traderRouteId: t.hex().notNull(),
}))
export type ITraderRouteMetric = typeof traderRouteMetric.$inferInsert

export const traderRouteMetricRelations = relations(traderRouteMetric, ({ one }) => ({
  traderRoute: one(traderRoute, { fields: [traderRouteMetric.traderRouteId], references: [traderRoute.id] }),
}))

export const traderRoute = onchainTable("TraderRoute", t => ({
  id: t.hex().primaryKey(),
  account: t.hex().notNull(),
  collateralToken: t.hex().notNull(),
}))
export type ITraderRoute = typeof traderRoute.$inferInsert

export const traderRouteRelations = relations(traderRoute, ({ many, one }) => ({
  profile: one(traderUser, { fields: [traderRoute.account], references: [traderUser.id] }),
  increaseList: many(positionIncrease),
  decreaseList: many(positionDecrease),
  // settlementList: many(settlement),
  statsList: many(traderRouteMetric),
}))


