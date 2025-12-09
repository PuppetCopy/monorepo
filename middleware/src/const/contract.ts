import { PUPPET_CONTRACT_MAP, puppetErrorAbi } from '@puppet/contracts'
import { GMX_V2_CONTRACT_MAP, gmxErrorAbi } from '@puppet/contracts/gmx'
import { erc20Abi } from 'viem'
import referralStorageAbi from '../generated/abi/referralStorage.js'

export const CONTRACT = {
  // Puppet contracts from generated file
  UserRouter: {
    address: PUPPET_CONTRACT_MAP.RouterProxy.address,
    abi: [...PUPPET_CONTRACT_MAP.UserRouter.abi, ...PUPPET_CONTRACT_MAP.RouterProxy.abi, ...puppetErrorAbi] as const,
    chainId: PUPPET_CONTRACT_MAP.UserRouter.chainId
  },
  SequencerRouter: {
    address: PUPPET_CONTRACT_MAP.SequencerRouter.address,
    // Combined ABIs for router proxy pattern
    abi: [...PUPPET_CONTRACT_MAP.SequencerRouter.abi, ...puppetErrorAbi, ...gmxErrorAbi]
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
    abi: puppetErrorAbi
  },

  // GMX contracts from generated file
  GMX: {
    address: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
    abi: erc20Abi
  },
  ReferralStorage: {
    address: '0xe6fab3F0c7199b0d34d7FbE83394fc0e0D06e99d',
    abi: referralStorageAbi
  },

  // GMX V2 contracts
  // GmxReaderV2: GMX_V2_CONTRACT_MAP.GmxReaderV2,
  // GmxExchangeRouter: GMX_V2_CONTRACT_MAP.GmxExchangeRouter,
  // GmxOrderVault: GMX_V2_CONTRACT_MAP.GmxOrderVault,
  GmxDatastore: GMX_V2_CONTRACT_MAP.GmxDatastore,
  GmxEventEmitter: GMX_V2_CONTRACT_MAP.GmxEventEmitter,
  GmxCustomError: {
    abi: gmxErrorAbi
  }
} as const
