import { erc20Abi } from 'viem'
import { errorAbi } from '../generated/abi/errorAbi.js'
import { GMX_V2_CONTRACT_MAP } from '../generated/contractList.js'
import { PUPPET_CONTRACT_MAP } from '../generated/puppetContracts.js'

export const CONTRACT = {
  // Puppet contracts from generated file
  UserRouter: {
    address: PUPPET_CONTRACT_MAP.UserRouter.address,
    abi: PUPPET_CONTRACT_MAP.UserRouter.abi
  },
  SequencerRouter: {
    address: PUPPET_CONTRACT_MAP.SequencerRouter.address,
    // Combined ABIs for router proxy pattern
    abi: [...PUPPET_CONTRACT_MAP.SequencerRouter.abi, ...PUPPET_CONTRACT_MAP.RouterProxy.abi, ...errorAbi]
  },

  Dictatorship: PUPPET_CONTRACT_MAP.Dictatorship,
  PuppetToken: PUPPET_CONTRACT_MAP.PuppetToken,
  PuppetVoteToken: {
    address: ''
  },
  TokenRouter: PUPPET_CONTRACT_MAP.TokenRouter,
  AccountStore: PUPPET_CONTRACT_MAP.AccountStore,
  Account: PUPPET_CONTRACT_MAP.Account,
  Rule: PUPPET_CONTRACT_MAP.Rule,
  Mirror: PUPPET_CONTRACT_MAP.Mirror,
  Settle: PUPPET_CONTRACT_MAP.Settle,
  FeeMarketplace: PUPPET_CONTRACT_MAP.FeeMarketplace,

  // Custom error ABI
  CustomError: {
    abi: errorAbi
  },

  // GMX contracts from generated file
  GMX: {
    address: GMX_V2_CONTRACT_MAP.GMX.address,
    abi: erc20Abi
  },
  ReferralStorage: GMX_V2_CONTRACT_MAP.ReferralStorage,

  // GMX V2 contracts
  GmxReaderV2: GMX_V2_CONTRACT_MAP.GmxReaderV2,
  GmxExchangeRouter: GMX_V2_CONTRACT_MAP.GmxExchangeRouter,
  GmxOrderVault: GMX_V2_CONTRACT_MAP.GmxOrderVault,
  GmxDatastore: GMX_V2_CONTRACT_MAP.GmxDatastore,
  GmxEventEmitter: GMX_V2_CONTRACT_MAP.GmxEventEmitter,
  GmxCustomError: {
    abi: errorAbi
  }
} as const
