import { type Address, erc20Abi } from 'viem'
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
  Dictatorship: '0x6dB9010e25c1c97c6b78C4eA1d517C93851dFb82',
  PuppetToken: '0x10f7F9e33FaF343F9CfE1c69b177ed86Bc760B4e',
  TokenRouter: '0xB2cD2387f93A8dc25498425b0F60C409d78331E0',
  RouterProxy: '0x2793FF9b6B6CaDe1360427eb53db3E411da9555A',
  AllocationStore: '0x03a7942ec263b4ff08b3cf1b8d821e1ec1401377',
  FeeMarketplaceStore: '0xAf97414983197b30485828ddb3De60134871dBe2',
  FeeMarketplace: '0x1290fE1CC845D9D564183d3d8C65122DCf908ED5',
  MatchingRule: '0x27eb729ce87490251efb912b843f735d8cc48ea8',
  MirrorPosition: '0xcc223421f519cdfe8e570cba22edc4168c57de9d',
  Allocate: '0x7af02f2c8917617d034117bfe93c98740b6fd050',
  Settle: '0xb5c9e474ff4621f3bad1be816dde38999b21920e',
  KeeperRouter: '0x136bb60b7e1f81dbe11128a2567b059c008b8ad3',
  GmxExecutionCallback: '0xE45C136247d0F0D1cfaa43781D05Eb756A75F8F0',
  Router: '0x94e58f4eDb5134C8e6885516857536580dacCc18'
} as const

export const CONTRACT = {
  42161: {
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
  }
} as const
