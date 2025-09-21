// This file is auto-generated. Do not edit manually.
// Source: GMX deployment files from GitHub (main branch)

import datastoreAbi from './abi/gmxDatastore.js'
import eventemitterAbi from './abi/gmxEventEmitter.js'
import exchangerouterAbi from './abi/gmxExchangeRouter.js'
import ordervaultAbi from './abi/gmxOrderVault.js'
// Import generated ABIs
import readerv2Abi from './abi/gmxReaderV2.js'

export const GMX_V2_CONTRACT_MAP = {
  GmxReaderV2: {
    address: '0x65A6CC451BAfF7e7B4FDAb4157763aB4b6b44D0E',
    abi: readerv2Abi
  },
  GmxExchangeRouter: {
    address: '0x87d66368cD08a7Ca42252f5ab44B2fb6d1Fb8d15',
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
  }
} as const
