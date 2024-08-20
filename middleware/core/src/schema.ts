import { schema as gmxSchema, ISchema } from "gmx-middleware-utils"
import { IPuppetPosition, ISetRouteType, IAccountSummary } from "./types.js"



// const mirrorReduceSize: ISchema<MirrorReduceSize> = {
//   id: 'string',

//   sizeDelta: 'uint',

//   // blockTimestamp: 'uint',
//   // transactionHash: 'string',

//   __typename: 'MirrorReduceSize',
// }

// const mirrorLink: ISchema<IMirrorLink> = {
//   id: 'string',

//   reduceSizeList: mirrorReduceSize,

//   __typename: 'MirrorLink',
// }

// const mirror: ISchema<IMirrorMatch> = {
//   link: mirrorLink,

//   trader: 'address',
//   puppetList: `address[]`,
//   collateralList: 'uint[]',
//   cumulativeTransactionCost: 'uint',

//   __typename: 'Position',
// }

const puppetPosition: ISchema<Omit<IPuppetPosition, 'puppetTradeRoute'>> = {
  id: 'string',

  collateralToken: 'address',

  trader: 'address',
  subaccount: 'address',
  positionKey: 'string',

  collateral: 'uint',

  // mirror: mirror,
  position: gmxSchema.position,

  __typename: 'PuppetPositionSettled',
}




const setRouteType: ISchema<ISetRouteType> = {
  id: 'string',
  collateralToken: 'address',
  indexToken: 'address',
  isLong: 'bool',
  routeTypeKey: 'string',
  // data: 'string',

  __typename: 'SetRouteType',
}



const accountSummarySeed: ISchema<IAccountSummary> = {
  id: 'string',
  account: 'address',
  interval: 'uint',
  timestamp: 'uint',

  puppets: 'uint',

  cumulativeSizeUsd: 'uint',
  cumulativeCollateralUsd: 'uint',

  maxSizeUsd: 'uint',
  maxCollateralUsd: 'uint',

  pnl: 'uint',
  roi: 'uint',

  winCount: 'uint',
  lossCount: 'uint',
  successRate: 'uint',

  __typename: 'AccountSummarySeed',
}

const AccountSummary: ISchema<IAccountSummary> = {
  ...accountSummarySeed,

  __typename: 'AccountSummary',
}





export const schema = {
  puppetPosition,
  setRouteType, accountSummarySeed, AccountSummary,

  // mirrorReduceSize,

  // mirrorLink, mirror
}
