// This file is auto-generated. Do not edit manually.
// Source: Puppet deployments.json and forge-artifacts

import accountAbi from './abi/puppetAccount.js'
import accountstoreAbi from './abi/puppetAccountStore.js'
// Import generated ABIs
import dictatorshipAbi from './abi/puppetDictatorship.js'
import feemarketplaceAbi from './abi/puppetFeeMarketplace.js'
import feemarketplacestoreAbi from './abi/puppetFeeMarketplaceStore.js'
import mirrorAbi from './abi/puppetMirror.js'
import puppettokenAbi from './abi/puppetPuppetToken.js'
import routerproxyAbi from './abi/puppetRouterProxy.js'
import ruleAbi from './abi/puppetRule.js'
import sequencerrouterAbi from './abi/puppetSequencerRouter.js'
import settleAbi from './abi/puppetSettle.js'
import tokenrouterAbi from './abi/puppetTokenRouter.js'
import userrouterAbi from './abi/puppetUserRouter.js'

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
    address: '0xc7Fb87E6Eb9bcE66ca32acb01B99cAF70cfE5DB0',
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
    address: '0xDfcfA30D3950ae4E94C869798276A06B167Bd5f1',
    abi: mirrorAbi
  },
  Settle: {
    address: '0x96F9fE6293ac6ED89c16e37177665a4904c3fe9f',
    abi: settleAbi
  },
  SequencerRouter: {
    address: '0xaF02B24e394d73b62efaB84f4c231D7cE1acCB85',
    abi: sequencerrouterAbi
  },
  UserRouter: {
    address: '0xD65A4bD84Ae0B2434cF539ef5589b2C63a848BCf',
    abi: userrouterAbi
  },
  Account: {
    address: '0x40Fc327E61c0B55945585FD255FEC42F4C2e833e',
    abi: accountAbi
  },
  Rule: {
    address: '0xb7C104b156A2933161a4Cb92B4981858258de649',
    abi: ruleAbi
  }
} as const
