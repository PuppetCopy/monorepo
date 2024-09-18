import { schema as gmxSchema, IPriceCandle, ISchema } from "gmx-middleware-utils"
import { ILeaderboardPosition, IMirrorPosition } from "./types.js"


// const puppetPosition: ISchema<IPuppetPosition> = {
//   id: 'string',
//   key: 'string',
//   positionKey: 'string',

//   account: 'address',
//   market: 'address',
//   collateralToken: 'address',

//   collateral: 'uint',

//   __typename: 'PuppetPosition',
// }

const mirrorPosition: ISchema<IMirrorPosition> = {
  ...gmxSchema.position,

  // position: gmxSchema.position,
  // puppetList: 'string[]',
  // collateralList: 'uint[]',

  __typename: 'Position',
}

const leaderboardPosition: ISchema<ILeaderboardPosition> = {
  account: 'address',
  market: 'address',
  collateralToken: 'address',

  maxSizeInUsd: 'uint',
  maxCollateralInUsd: 'uint',
  maxSizeInTokens: 'uint',
  realisedPnlUsd: 'int',
  sizeInTokens: 'uint',
  sizeInUsd: 'uint',

  isLong: 'bool',

  openTimestamp: 'number',
  // settledTimestamp: 'number',

  __typename: 'Position',
}


const priceCandle: ISchema<IPriceCandle> = {
  id: 'string',
  token: 'address',
  c: 'int',
  timestamp: 'number',
  __typename: 'PriceCandle',
}


export const schema = { priceCandle, mirrorPosition, leaderboardPosition }
