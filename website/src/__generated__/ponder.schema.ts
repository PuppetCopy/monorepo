import { onchainTable, relations } from 'ponder'

export const market = onchainTable('Market', (t) => ({
  indexToken: t.hex().notNull(),
  longToken: t.hex().notNull(),
  shortToken: t.hex().notNull(),
  marketType: t.hex(),

  marketToken: t.hex().primaryKey()
}))

export const oraclePrice = onchainTable('OraclePrice', (t) => ({
  price: t.bigint().notNull(),
  updateTimestamp: t.integer().notNull(),

  token: t.hex().primaryKey()
}))

export const priceCandle = onchainTable('PriceCandle', (t) => ({
  token: t.hex().notNull(),
  interval: t.integer().notNull(),
  slotTime: t.integer().notNull(),
  o: t.bigint().notNull(),
  h: t.bigint().notNull(),
  l: t.bigint().notNull(),
  c: t.bigint().notNull(),

  id: t.text().primaryKey()
}))

export const positionIncrease = onchainTable('PositionIncrease', (t) => ({
  market: t.hex().notNull(),
  account: t.hex().notNull(),
  collateralToken: t.hex().notNull(),
  indexToken: t.hex().notNull(),

  sizeInTokens: t.bigint().notNull(),
  sizeInUsd: t.bigint().notNull(),
  collateralInTokens: t.bigint().notNull(),
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
  increasedAtTime: t.bigint().notNull(),

  collateralDeltaAmount: t.bigint().notNull(),
  priceImpactUsd: t.bigint().notNull(),
  priceImpactAmount: t.bigint().notNull(),

  isLong: t.boolean().notNull(),

  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),

  feeCollectedId: t.hex().notNull(),

  positionKey: t.hex().notNull(),
  traderMatchingKey: t.hex().notNull(),

  orderKey: t.hex().primaryKey()
}))

export const positionIncreaseRelations = relations(positionIncrease, ({ one }) => ({
  feeCollected: one(positionFeesCollected, {
    fields: [positionIncrease.feeCollectedId],
    references: [positionFeesCollected.id]
  })
}))

export const positionDecrease = onchainTable('PositionDecrease', (t) => ({
  market: t.hex().notNull(),
  account: t.hex().notNull(),
  collateralToken: t.hex().notNull(),
  indexToken: t.hex().notNull(),

  sizeInUsd: t.bigint().notNull(),
  sizeInTokens: t.bigint().notNull(),
  collateralInTokens: t.bigint().notNull(),
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
  priceImpactDiffUsd: t.bigint().notNull(),
  orderType: t.bigint().notNull(),
  decreasedAtTime: t.bigint().notNull(),

  priceImpactUsd: t.bigint().notNull(),
  basePnlUsd: t.bigint().notNull(),
  uncappedBasePnlUsd: t.bigint().notNull(),

  isLong: t.boolean().notNull(),

  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),

  feeCollectedId: t.hex().notNull(),

  positionKey: t.hex().notNull(),
  traderMatchingKey: t.hex().notNull(),

  orderKey: t.hex().primaryKey()
}))

export const positionDecreaseRelations = relations(positionDecrease, ({ one }) => ({
  feeCollected: one(positionFeesCollected, {
    fields: [positionDecrease.feeCollectedId],
    references: [positionFeesCollected.id]
  })
}))

export const positionFeesCollected = onchainTable('PositionFeesCollected', (t) => ({
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

  positionKey: t.hex().notNull(),

  id: t.hex().primaryKey()
}))

export const openPosition = onchainTable('OpenPosition', (t) => ({
  pnl: t.bigint().notNull(),
  account: t.hex().notNull(),
  collateralInTokens: t.bigint().notNull(),
  collateralInUsd: t.bigint().notNull(),
  lastUpdatedTimestamp: t.integer().notNull(),

  traderMatchingKey: t.hex().notNull(),

  positionKey: t.hex().primaryKey()
}))

export const traderRouteMetric = onchainTable('TraderRouteMetric', (t) => ({
  account: t.hex().notNull(),
  collateralToken: t.hex().notNull(),

  cumulativeCollateralUsd: t.bigint().notNull(),
  cumulativeSizeUsd: t.bigint().notNull(),
  cumulativeSizeLongUsd: t.bigint().notNull(),
  cumulativeRealisedPnl: t.bigint().notNull(),

  crossOpenSizeInUsd: t.bigint().notNull(),
  crossOpenLongSizeInUsd: t.bigint().notNull(),
  crossOpenCollateralInUsd: t.bigint().notNull(),
  crossOpenPnl: t.bigint().notNull(),

  marketList: t.hex().array().notNull(),
  positionList: t.hex().array().notNull(),

  lastUpdatedTimestamp: t.integer().notNull(),

  traderMatchingKey: t.hex().primaryKey()
}))

export const traderRouteLatestMetric = onchainTable('TraderRouteLatestMetric', (t) => ({
  account: t.hex().notNull(),
  collateralToken: t.hex().notNull(),

  settledSizeInUsd: t.bigint().notNull(),
  settledSizeLongInUsd: t.bigint().notNull(),
  settledCollateralInUsd: t.bigint().notNull(),

  sizeUsd: t.bigint().notNull(),
  collateralUsd: t.bigint().notNull(),
  longUsd: t.bigint().notNull(),
  longShortRatio: t.bigint().notNull(),

  realisedPnl: t.bigint().notNull(),
  pnl: t.bigint().notNull(),
  realisedRoi: t.bigint().notNull(),
  roi: t.bigint().notNull(),

  pnlList: t.bigint().array().notNull(),
  pnlTimestampList: t.integer().array().notNull(),
  matchedPuppetList: t.hex().array().notNull(),

  interval: t.integer().notNull(),
  lastUpdatedTimestamp: t.integer().notNull(),

  traderMatchingKey: t.hex().notNull(),

  id: t.text().primaryKey()
}))

export const traderRouteLatestMetricRelations = relations(traderRouteLatestMetric, ({ one }) => ({
  traderRouteMetric: one(traderRouteMetric, {
    fields: [traderRouteLatestMetric.traderMatchingKey],
    references: [traderRouteMetric.traderMatchingKey]
  })
}))

export const puppetSettle = onchainTable('PuppetSettle', (t) => ({
  puppet: t.hex().notNull(),
  amount: t.bigint().notNull(),
  settleId: t.hex().notNull(),

  id: t.hex().primaryKey()
}))

export const puppetSettleRelations = relations(puppetSettle, ({ one }) => ({
  settle: one(settle, { fields: [puppetSettle.settleId], references: [settle.id] })
}))

export const settle = onchainTable('Settle', (t) => ({
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

  traderMatchingKey: t.hex().notNull(),
  allocationKey: t.hex().notNull(),

  id: t.hex().primaryKey()
}))

export const settleRelations = relations(settle, ({ one }) => ({
  puppetSettle: one(puppetSettle, { fields: [settle.id], references: [puppetSettle.settleId] }),
  allocation: one(allocation, { fields: [settle.allocationKey], references: [allocation.allocationKey] })
}))

export const adjust = onchainTable('Adjust', (t) => ({
  allocationAddress: t.hex().notNull(),
  keeperFeeReceiver: t.hex().notNull(),

  keeperExecutionFee: t.bigint().notNull(),
  puppetKeeperExecutionFeeInsolvency: t.bigint().notNull(),
  allocation: t.bigint().notNull(),
  sizeDelta: t.bigint().notNull(),
  traderTargetLeverage: t.bigint().notNull(),

  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),

  allocationKey: t.hex().notNull(),
  traderMatchingKey: t.hex().notNull(),

  requestKey: t.hex().primaryKey()
}))

export const mirror = onchainTable('Mirror', (t) => ({
  keeperFeeReceiver: t.hex().notNull(),

  keeperExecutionFee: t.bigint().notNull(),
  allocation: t.bigint().notNull(),
  sizeDelta: t.bigint().notNull(),
  traderTargetLeverage: t.bigint().notNull(),

  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),

  traderMatchingKey: t.hex().notNull(),
  allocationKey: t.hex().notNull(),
  requestKey: t.hex().notNull(),

  allocationAddress: t.hex().primaryKey()
}))

export const puppetAllocate = onchainTable('PuppetAllocate', (t) => ({
  trader: t.hex().notNull(),
  puppet: t.hex().notNull(),
  token: t.hex().notNull(),
  traderMatchingKey: t.hex().notNull(),
  amount: t.bigint().notNull(),

  mirrorPositionId: t.hex().notNull(),
  allocationKey: t.hex().notNull(),

  id: t.hex().primaryKey()
}))

export const puppetAllocationRelations = relations(puppetAllocate, ({ one }) => ({
  allocation: one(allocation, { fields: [puppetAllocate.allocationKey], references: [allocation.allocationKey] })
}))

export const allocation = onchainTable('Allocation', (t) => ({
  puppet: t.hex().notNull(),
  allocationToken: t.hex().notNull(),

  allocation: t.bigint().notNull(),
  size: t.bigint().notNull(),
  cumulativeKeeperFee: t.bigint().notNull(),

  traderMatchingKey: t.hex().notNull(),
  allocationKey: t.hex().notNull(),

  allocationAddress: t.hex().primaryKey()
}))

export const allocationRelations = relations(allocation, ({ many, one }) => ({
  mirror: one(mirror, { fields: [allocation.allocationAddress], references: [mirror.allocationAddress] }),
  settleList: many(settle)
}))

export const puppetMatchingRule = onchainTable('PuppetMatchingRule', (t) => ({
  collateralToken: t.hex().notNull(),
  puppet: t.hex().notNull(),
  trader: t.hex().notNull(),

  allowanceRate: t.bigint().notNull(),
  throttleActivity: t.bigint().notNull(),
  expiry: t.bigint().notNull(),

  traderMatchingKey: t.hex().notNull(),

  id: t.hex().primaryKey()
}))

export const deposit = onchainTable('Deposit', (t) => ({
  collateralToken: t.hex().notNull(),
  user: t.hex().notNull(),
  balance: t.bigint().notNull(),
  amount: t.bigint().notNull(),

  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),

  id: t.text().primaryKey()
}))

export const withdraw = onchainTable('Withdraw', (t) => ({
  collateralToken: t.hex().notNull(),
  user: t.hex().notNull(),
  receiver: t.hex().notNull(),
  balance: t.bigint().notNull(),
  amount: t.bigint().notNull(),

  blockTimestamp: t.integer().notNull(),
  transactionHash: t.hex().notNull(),

  id: t.text().primaryKey()
}))
