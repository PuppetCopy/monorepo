import type { IPosition } from '../pages/type'

export function isPositionSettled(trade: IPosition): boolean {
  return trade.settledTimestamp > 0
}

export function isPositionOpen(trade: IPosition): trade is IPosition {
  return trade.lastUpdateTimestamp === 0
}
