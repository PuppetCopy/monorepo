import { erc20Abi } from 'viem'
import * as abi from './abi/__generated/abi.js'
import datastore from './abi/datastore.js'
// gmx v2
import exchangeRouter from './abi/exchangeRouter.js'
import gmxCustomError from './abi/gmxCustomError.js'
import gmxEventEmitter from './abi/gmxEventEmitter.js'
import reader from './abi/reader.js'
import referralStorage from './abi/referralStorage.js'

// Contract addresses for Arbitrum (42161)
const addresses = {
  Dictatorship: '0x583C63CEcb474789331C43da153b1fe5eC0d6CEC',
  PuppetToken: '0x10f7F9e33FaF343F9CfE1c69b177ed86Bc760B4e',
  TokenRouter: '0x796347E2881bE603C4D88ac0103c4A3569BA8b28',
  RouterProxy: '0x34Df3B8042902492451d4Ae87306904bDF8e702a',
  AllocationStore: '0xd29389780e53bb915f64d93c8981d2ca168c2ddc',
  FeeMarketplaceStore: '0xAf97414983197b30485828ddb3De60134871dBe2',
  FeeMarketplace: '0x1290fE1CC845D9D564183d3d8C65122DCf908ED5',
  MatchingRule: '0xaac31987673082034e06e7066726a6bc85dbcf80',
  MirrorPosition: '0xfab9370c2a8f8f69ed7880f5f204e0125c351632',
  Allocate: '0x31b1932248c12029820fd28bde2b49991ed6f178',
  Settle: '0x0c93cb536516bceb4d23ec9464d674c50b417b2d',
  KeeperRouter: '0x3d04f440b4c3c5b56770d7341c1682065bee6593',
  Router: '0x94e58f4eDb5134C8e6885516857536580dacCc18'
} as const

export const CONTRACT = {
  RouterProxy: {
    address: addresses.RouterProxy,
    abi: [...abi.userRouterAbi, ...abi.routerProxyAbi, ...abi.errorAbi]
  },

  Dictatorship: {
    address: addresses.Dictatorship,
    abi: abi.dictatorshipAbi
  },
  PuppetToken: {
    address: addresses.PuppetToken,
    abi: abi.puppetTokenAbi
  },
  PuppetVoteToken: {
    address: '',
    abi: abi.puppetVoteTokenAbi
  },
  TokenRouter: {
    address: addresses.TokenRouter,
    abi: abi.tokenRouterAbi
  },
  AllocationStore: {
    address: addresses.AllocationStore,
    abi: abi.allocationStoreAbi
  },

  MatchingRule: {
    address: addresses.MatchingRule,
    abi: abi.matchingRuleAbi
  },
  MirrorPosition: {
    address: addresses.MirrorPosition,
    abi: abi.mirrorPositionAbi
  },
  Allocate: {
    address: addresses.Allocate,
    abi: abi.allocateAbi
  },
  Settle: {
    address: addresses.Settle,
    abi: abi.settleAbi
  },
  KeeperRouter: {
    address: addresses.KeeperRouter,
    abi: abi.keeperRouterAbi
  },
  FeeMarketplace: {
    address: addresses.FeeMarketplace,
    abi: abi.feeMarketplaceAbi
  },

  CustomError: {
    abi: abi.errorAbi
  },

  GMX: {
    address: '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a',
    abi: erc20Abi
  },
  ReferralStorage: {
    address: '0xe6fab3f0c7199b0d34d7fbe83394fc0e0d06e99d',
    abi: referralStorage
  },

  // V2
  GmxReaderV2: {
    address: '0x38d91ED96283d62182Fc6d990C24097A918a4d9b',
    abi: reader
  },
  GmxExchangeRouter: {
    address: '0x7C68C7866A64FA2160F78EEaE12217FFbf871fa8',
    abi: exchangeRouter
  },
  GmxOrderVault: {
    address: '0x31eF83a530Fde1B38EE9A18093A333D8Bbbc40D5'
  },
  GmxDatastore: {
    address: '0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8',
    abi: datastore
  },
  GmxEventEmitter: {
    address: '0xC8ee91A54287DB53897056e12D9819156D3822Fb',
    abi: gmxEventEmitter
  },
  GmxCustomError: {
    abi: gmxCustomError
  }
} as const
