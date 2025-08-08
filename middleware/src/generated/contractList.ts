// This file is auto-generated. Do not edit manually.
// Generated on: 2025-08-08T18:10:59.238Z
// Source: Local GMX deployment files

// Import hardcoded contract ABIs
import { erc20Abi } from 'viem'
import datastoreAbi from './abi/gmxDatastore.js'
import eventemitterAbi from './abi/gmxEventEmitter.js'
import exchangerouterAbi from './abi/gmxExchangeRouter.js'
import ordervaultAbi from './abi/gmxOrderVault.js'
// Import generated ABIs
import readerv2Abi from './abi/gmxReaderV2.js'
import referralStorageAbi from './abi/referralStorage.js'

export const GMX_V2_CONTRACT_MAP = {
  GmxReaderV2: {
    address: '0xcF2845Ab3866842A6b51Fb6a551b92dF58333574',
    abi: readerv2Abi
  },
  GmxExchangeRouter: {
    address: '0x7452c558d45f8afC8c83dAe62C3f8A5BE19c71f6',
    abi: exchangerouterAbi
  },
  GmxOrderVault: {
    address: '0x31eF83a530Fde1B38EE9A18093A333D8Bbbc40D5',
    abi: ordervaultAbi
  },
  GmxDatastore: {
    address: '0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8',
    abi: datastoreAbi
  },
  GmxEventEmitter: {
    address: '0xC8ee91A54287DB53897056e12D9819156D3822Fb',
    abi: eventemitterAbi
  },
  GMX: {
    address: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
    abi: erc20Abi
  },
  ReferralStorage: {
    address: '0xe6fab3F0c7199b0d34d7FbE83394fc0e0D06e99d',
    abi: referralStorageAbi
  }
} as const
