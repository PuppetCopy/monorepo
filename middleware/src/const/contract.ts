import { erc20Abi, type Address } from "viem";
import * as abi from "./abi/__generatedAbi.js";
import addresses from './addresses.json' with { type: "json" };

// gmx v2
import exchangeRouter from "./abi/exchangeRouter.js";
import reader from "./abi/reader.js";
import referralStorage from "./abi/referralStorage.js";
import gmxEventEmitter from "./abi/gmxEventEmitter.js";
import datastore from "./abi/datastore.js";

export const CONTRACT = {
  42161: {
    RouterProxy: {
      address: addresses[42161].RouterProxy as Address,
      abi: [...abi.errorAbi, ...abi.routerAbi, ...abi.routerProxyAbi],
    },

    Dictatorship: {
      address: addresses[42161].Dictatorship as Address,
      abi: abi.dictatorshipAbi,
    },
    PuppetToken: {
      address: addresses[42161].PuppetToken as Address,
      abi: abi.puppetTokenAbi,
    },
    PuppetVoteToken: {
      address: "", // Address not found in addresses.json
      abi: abi.puppetVoteTokenAbi,
    },
    TokenRouter: {
      address: addresses[42161].TokenRouter as Address,
      abi: abi.routerAbi,
    },
    AllocationStore: {
      address: addresses[42161].AllocationStore as Address,
      abi: abi.allocationStoreAbi,
    },

    MatchingRule: {
      address: addresses[42161].MatchingRule as Address,
      abi: abi.matchingRuleAbi,
    },
    MirrorPosition: {
      address: addresses[42161].MirrorPosition as Address,
      abi: abi.mirrorPositionAbi,
    },
    FeeMarketplace: {
      address: addresses[42161].FeeMarketplace as Address,
      abi: abi.feeMarketplaceAbi,
    },


    GMX: {
      address: "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a",
      abi: erc20Abi,
    },
    ReferralStorage: {
      address: '0xe6fab3f0c7199b0d34d7fbe83394fc0e0d06e99d',
      abi: referralStorage,
    },

    // V2
    ReaderV2: {
      address: "0x38d91ED96283d62182Fc6d990C24097A918a4d9b",
      abi: reader,
    },
    ExchangeRouter: {
      address: "0x7C68C7866A64FA2160F78EEaE12217FFbf871fa8",
      abi: exchangeRouter,
    },
    OrderVault: {
      address: "0x31eF83a530Fde1B38EE9A18093A333D8Bbbc40D5",
    },
    Datastore: {
      address: "0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8",
      abi: datastore,
    },
    EventEmitter: {
      address: "0xC8ee91A54287DB53897056e12D9819156D3822Fb",
      abi: gmxEventEmitter,
    },
    CustomError: {
      abi: abi.errorAbi,
    },
  },
} as const;
