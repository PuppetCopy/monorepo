import { erc20Abi } from "viem";
import * as abi from "./abi/__generatedAbi.js";

// gmx v2
import exchangeRouter from "./abi/exchangeRouter.js";
import reader from "./abi/reader.js";
import referralStorage from "./abi/referralStorage.js";
import gmxEventEmitter from "./abi/gmxEventEmitter.js";
import datastore from "./abi/datastore.js";

export const CONTRACT = {
  42161: {
    Router: {
      address: "0x4F2B5C8D3E1A7F6C9D5B2A8E4F8C8E0eA8C7",
      abi: [...abi.routerAbi, ...abi.routerProxyAbi],
    },

    Dictatorship: {
      address: "0x583367f217a6684039d378C0a142Cbe17F2FC058",
      abi: abi.dictatorshipAbi,
    },
    PuppetToken: {
      address: "0x2F076BdCE9bf6f118d612Ee6bAa9BCF6266De199",
      abi: abi.puppetTokenAbi,
    },
    PuppetVoteToken: {
      address: "",
      abi: abi.puppetVoteTokenAbi,
    },
    TokenRouter: {
      address: "0xb05Ec3598F5fA2f997B1a79E5e6995a158E8C26D",
      abi: abi.routerAbi,
    },
    AllocationStore: {
      address: "0x2F076BdCE9bf6f118d612Ee6bAa9BCF6266De199",
      abi: abi.allocationStoreAbi,
    },

    MatchingRule: {
      address: "0x1fC2D4aE5E8bA3fE3dF7B6c8D9B1fF8C8E0eA8C7",
      abi: abi.matchingRuleAbi,
    },
    MirrorPosition: {
      address: "0x4F2B5C8D3E1A7F6C9D5B2A8E4F8C8E0eA8C7",
      abi: abi.mirrorPositionAbi,
    },
    FeeMarketplace: {
      address: "0x5F2B5C8D3E1A7F6C9D5B2A8E4F8C8E0eA8C7",
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
