import { schema as gmxSchema, IPositionDecrease, IPositionIncrease, IPriceCandle, ISchema } from "gmx-middleware-utils"
import { IAccountLastAggregatedStats, ITraderAccount } from "./types.js"


const positionIncrease: ISchema<IPositionIncrease> = {
  ...gmxSchema.positionIncrease
}

const positionDecrease: ISchema<IPositionDecrease> = {
  ...gmxSchema.positionDecrease
}

const traderAccount: ISchema<ITraderAccount> = {
  id: 'string',
  // gbcId: 'uint',

  increaseList: gmxSchema.positionIncrease,
  decreaseList: gmxSchema.positionDecrease,

  __typename: 'TraderAccount',
}

const accountLastAggregatedStats: ISchema<IAccountLastAggregatedStats> = {
  id: 'string',
  account: 'string',

  cumulativeSizeUsd: 'uint',
  cumulativeCollateralUsd: 'uint',
  maxCollateralInUsd: 'uint',
  maxSizeInUsd: 'uint',
  openPnl: 'uint',
  realisedPnl: 'uint',
  pnl: 'uint',
  roi: 'uint',

  blockTimestamp: 'number',
  interval: 'number',
  trader: traderAccount,

  __typename: 'AccountLastAggregatedStats',
}


const priceCandle: ISchema<IPriceCandle> = {
  id: 'string',
  token: 'address',
  c: 'int',
  slotTime: 'number',
  __typename: 'PriceCandle',
}


export const schema = { priceCandle, accountLastAggregatedStats, traderAccount, positionIncrease, positionDecrease }
