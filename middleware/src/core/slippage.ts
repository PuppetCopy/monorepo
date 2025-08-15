/**
 * Calculate slippage in basis points for a position
 *
 * For longs: execution price < current price is favorable (buying cheaper)
 * For shorts: execution price > current price is favorable (selling higher)
 *
 * @param isLong - Whether the position is long or short
 * @param executionPrice - The price at which the order was executed
 * @param currentPrice - The current market price
 * @returns Slippage in basis points (positive = favorable, negative = unfavorable)
 */
export function calculateSlippageBps(isLong: boolean, executionPrice: bigint, currentPrice: bigint): bigint {
  return isLong
    ? ((executionPrice - currentPrice) * 10000n) / currentPrice
    : ((currentPrice - executionPrice) * 10000n) / executionPrice
}

/**
 * Check if the current price is favorable for execution
 *
 * @param isLong - Whether the position is long or short
 * @param executionPrice - The price at which the order was executed
 * @param currentPrice - The current market price
 * @returns true if the price is favorable for execution
 */
export function isFavorablePrice(isLong: boolean, executionPrice: bigint, currentPrice: bigint): boolean {
  const slippageBps = calculateSlippageBps(isLong, executionPrice, currentPrice)
  return slippageBps >= 0n
}

/**
 * Calculate total slippage impact including collateral price movements
 *
 * @param indexSlippageBps - Slippage on the index token
 * @param collateralSlippageBps - Slippage on the collateral token (0 for USD collateral)
 * @param leverage - Position leverage (e.g., 2n for 2x)
 * @returns Combined slippage impact in basis points
 */
export function calculateCombinedSlippage(
  indexSlippageBps: bigint,
  collateralSlippageBps: bigint,
  leverage = 1n
): bigint {
  // Index slippage is amplified by leverage
  const leveragedIndexSlippage = indexSlippageBps * leverage

  // Collateral slippage affects the entire position value
  // For a leveraged position, collateral movement has outsized impact
  return leveragedIndexSlippage + collateralSlippageBps
}

/**
 * Maximum acceptable slippage in basis points
 */
export const MAX_SLIPPAGE_BPS = 500n // 5%

/**
 * Check if combined slippage is within acceptable bounds
 */
export function isSlippageAcceptable(slippageBps: bigint): boolean {
  return slippageBps > -MAX_SLIPPAGE_BPS
}
