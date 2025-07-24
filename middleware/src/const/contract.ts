import { CONTRACTS } from '@gmx-io/sdk/configs/contracts'
import { erc20Abi } from 'viem'
import * as abi from './abi/__generated/abi.js'
import datastore from './abi/datastore.js'
import exchangeRouter from './abi/exchangeRouter.js'
import gmxCustomError from './abi/gmxCustomError.js'
import gmxEventEmitter from './abi/gmxEventEmitter.js'
import reader from './abi/reader.js'
import referralStorage from './abi/referralStorage.js'

import { addresses } from './address.js'

export const CONTRACT = {
  UserRouter: {
    address: addresses.RouterProxy,
    abi: abi.userRouterAbi
  },
  KeeperRouter: {
    address: addresses.KeeperRouter,
    abi: [...abi.keeperRouterAbi, ...abi.routerProxyAbi, ...abi.errorAbi]
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
  Settle: {
    address: addresses.Settle,
    abi: abi.settleAbi
  },
  FeeMarketplace: {
    address: addresses.FeeMarketplace,
    abi: abi.feeMarketplaceAbi
  },

  CustomError: {
    abi: abi.errorAbi
  },

  GMX: {
    address: CONTRACTS[42161].GMX,
    abi: erc20Abi
  },
  ReferralStorage: {
    address: CONTRACTS[42161].ReferralStorage,
    abi: referralStorage
  },

  // V2
  GmxReaderV2: {
    address: CONTRACTS[42161].Reader,
    abi: reader
  },
  GmxExchangeRouter: {
    address: CONTRACTS[42161].Router,
    abi: exchangeRouter
  },
  GmxOrderVault: {
    address: CONTRACTS[42161].OrderVault
  },
  GmxDatastore: {
    address: CONTRACTS[42161].DataStore,
    abi: datastore
  },
  GmxEventEmitter: {
    address: CONTRACTS[42161].EventEmitter,
    abi: gmxEventEmitter
  },
  GmxCustomError: {
    abi: gmxCustomError
  }
} as const
