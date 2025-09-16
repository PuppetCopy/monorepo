// This file is auto-generated. Do not edit manually.
// Source: Puppet deployments.json and forge-artifacts

import type { Address } from 'viem'

// Import generated ABIs
import dictatorshipAbi from './abi/puppetDictatorship.js'
import puppettokenAbi from './abi/puppetPuppetToken.js'
import tokenrouterAbi from './abi/puppetTokenRouter.js'
import routerproxyAbi from './abi/puppetRouterProxy.js'
import accountstoreAbi from './abi/puppetAccountStore.js'
import feemarketplacestoreAbi from './abi/puppetFeeMarketplaceStore.js'
import feemarketplaceAbi from './abi/puppetFeeMarketplace.js'
import mirrorAbi from './abi/puppetMirror.js'
import settleAbi from './abi/puppetSettle.js'
import sequencerrouterAbi from './abi/puppetSequencerRouter.js'
import userrouterAbi from './abi/puppetUserRouter.js'
import accountAbi from './abi/puppetAccount.js'
import ruleAbi from './abi/puppetRule.js'

export const PUPPET_CONTRACT_MAP = {
  Dictatorship: {
    address: '0x5a5648423e6110e9b4AE94e88bd66F963a5253C2',
    abi: dictatorshipAbi
  },
  PuppetToken: {
    address: '0x10f7F9e33FaF343F9CfE1c69b177ed86Bc760B4e',
    abi: puppettokenAbi
  },
  TokenRouter: {
    address: '0x3Ccfe071124Cb0f6715038485Eb26096C35FE5EE',
    abi: tokenrouterAbi
  },
  RouterProxy: {
    address: '0xB43f1E80164bA23884076b9e816AC28895D76A34',
    abi: routerproxyAbi
  },
  AccountStore: {
    address: '0xcf0365d4A835B5953096c01F3076f32AD3a0A156',
    abi: accountstoreAbi
  },
  FeeMarketplaceStore: {
    address: '0xAf97414983197b30485828ddb3De60134871dBe2',
    abi: feemarketplacestoreAbi
  },
  FeeMarketplace: {
    address: '0x1290fE1CC845D9D564183d3d8C65122DCf908ED5',
    abi: feemarketplaceAbi
  },
  Mirror: {
    address: '0x36492606D772b58361Ee4435160d0f87f171DEFc',
    abi: mirrorAbi
  },
  Settle: {
    address: '0x59229a12F7C81c7515A01BEfC04925534073A156',
    abi: settleAbi
  },
  SequencerRouter: {
    address: '0x451271E19f11423BfBf1FAcb50f54768ca9E99bC',
    abi: sequencerrouterAbi
  },
  UserRouter: {
    address: '0x877b074B4E87EeaD27656a11491D86C9081198a7',
    abi: userrouterAbi
  },
  Account: {
    address: '0x517F50C4b5045bCfB03Fd8DEeFD011275C2e7cDe',
    abi: accountAbi
  },
  Rule: {
    address: '0x9AED6248B5E23F93940C00cbd866D818aAc1BcB2',
    abi: ruleAbi
  }
} as const
