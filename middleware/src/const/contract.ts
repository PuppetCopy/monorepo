import { PUPPET_CONTRACT_MAP, puppetErrorAbi } from '@puppet/contracts'
import { gmxErrorAbi } from '@puppet/contracts/gmx'
import { erc20Abi } from 'viem'
import referralStorageAbi from '../generated/abi/referralStorage.js'

// Re-export core contracts directly - consumers should import from @puppet/contracts
export { PUPPET_CONTRACT_MAP, puppetErrorAbi } from '@puppet/contracts'
export { GMX_V2_CONTRACT_MAP, gmxErrorAbi } from '@puppet/contracts/gmx'

// Middleware-specific contract configurations (combined ABIs for routers, custom addresses)
export const CONTRACT = {
  // Router contracts with combined ABIs
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

  // Custom error ABIs
  CustomError: {
    abi: puppetErrorAbi
  },
  GmxCustomError: {
    abi: gmxErrorAbi
  },

  // External contracts not in core
  GMX: {
    address: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
    abi: erc20Abi
  },
  ReferralStorage: {
    address: '0xe6fab3F0c7199b0d34d7FbE83394fc0e0D06e99d',
    abi: referralStorageAbi
  }
} as const
