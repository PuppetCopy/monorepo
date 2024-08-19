import { schema as gmxSchema, IPosition, IPositionOpen, ISchema } from "gmx-middleware-utils"
import { IMirrorSeed, IMirror, IPuppetPositionOpen, IPuppetPositionSettled, IPuppetTradeRoute, ISubscribeTradeRoute, ISetRouteType, IAccountSummary, IMirrorLink, MirrorReduceSize, IMirrorMatch } from "./types.js"



const mirrorReduceSize: ISchema<MirrorReduceSize> = {
  id: 'string',

  sizeDelta: 'uint',

  // blockTimestamp: 'uint',
  // transactionHash: 'string',

  __typename: 'MirrorReduceSize',
}


const mirrorLink: ISchema<IMirrorLink> = {
  id: 'string',

  reduceSizeList: mirrorReduceSize,

  __typename: 'MirrorLink',
}



const mirror: ISchema<IMirrorMatch> = {
  link: mirrorLink,

  trader: 'address',
  puppetList: `address[]`,
  collateralList: 'uint[]',
  cumulativeTransactionCost: 'uint',

  __typename: 'MirrorMatch',
}


const mirrorPositionOpen: ISchema<IMirrorSeed | IPositionOpen> = {
  ...gmxSchema.positionOpen,

  mirror: mirror,

  blockTimestamp: 'uint',
  transactionHash: 'string',

  __typename: 'PositionOpen',
}

const mirrorPosition: ISchema<IMirror | IPosition> = {
  ...gmxSchema.position,

  mirror: mirror,

  blockTimestamp: 'uint',
  transactionHash: 'string',

  __typename: 'Position',
}

const puppetPositionOpen: ISchema<Omit<IPuppetPositionOpen, 'puppetTradeRoute'>> = {
  id: 'string',
  position: mirrorPositionOpen,
  // puppetTradeRoute: puppetTradeRoute,

  blockTimestamp: 'uint',
  transactionHash: 'string',

  __typename: 'PuppetPositionOpen',
}

const puppetPosition: ISchema<Omit<IPuppetPositionSettled, 'puppetTradeRoute'>> = {
  id: 'string',
  position: mirrorPositionOpen,
  // puppetTradeRoute: puppetTradeRoute,

  blockTimestamp: 'uint',
  transactionHash: 'string',

  __typename: 'PuppetPositionSettled',
}

const subscribeTradeRoute: ISchema<ISubscribeTradeRoute> = {
  id: 'string',

  allowance: 'uint',
  subscriptionExpiry: 'uint',
  trader: 'address',
  puppet: 'address',
  tradeRoute: 'address',
  routeTypeKey: 'string',


  blockTimestamp: 'uint',
  transactionHash: 'string',

  __typename: 'SubscribeTradeRoute',
}

const puppetTradeRoute: ISchema<IPuppetTradeRoute> = {
  id: 'string',
  routeTypeKey: 'string',
  puppet: 'address',
  trader: 'address',
  tradeRoute: 'address',

  settledList: puppetPosition,
  openList: puppetPositionOpen,
  subscribeList: subscribeTradeRoute,

  __typename: 'PuppetTradeRoute',
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
  mirrorPositionOpen,
  mirrorReduceSize,
  mirrorLink, mirrorPosition,

  puppetTradeRoute, puppetPosition, puppetPositionOpen,

  subscribeTradeRoute, setRouteType, accountSummarySeed, AccountSummary,
}

