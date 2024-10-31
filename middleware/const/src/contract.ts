import { erc20Abi } from "viem";
import { arbitrum } from "viem/chains";
import allocationLogic from "./abi/allocationLogic.js";
import contributeLogic from "./abi/contributeLogic.js";
import contributeStore from "./abi/contributeStore.js";
import customError from "./abi/customError";
import datastore from "./abi/datastore";
import dictator from "./abi/dictator.js";
import eventEmitter from "./abi/eventEmitter";
import exchangeRouter from "./abi/exchangeRouter";
import executionLogic from "./abi/executionLogic";
import positionRouter from "./abi/positionRouter";
import positionStore from "./abi/positionStore";
import puppetLogic from "./abi/puppetLogic";
import puppetRouter from "./abi/puppetRouter";
import puppetStore from "./abi/puppetStore";
import puppetToken from "./abi/puppetToken.js";
import puppetVoteToken from "./abi/puppetVoteToken.js";
import reader from "./abi/reader";
import referralStorage from "./abi/referralStorage";
import requestLogic from "./abi/requestLogic";
import rewardLogic from "./abi/rewardLogic.js";
import rewardStore from "./abi/rewardStore.js";
import router from "./abi/router.js";
import tokenomicsRouter from "./abi/tokenomicsRouter.js";
import votingEscrowLogic from "./abi/votingEscrowLogic.js";
import votingEscrowStore from "./abi/votingEscrowStore.js";
import unhandledCallbackLogic from "./unhandledCallbackLogic";
import gmxEventEmitter from "./abi/gmxEventEmitter";

export const CONTRACT = {
  [arbitrum.id]: {
    Dictator: {
      address: "0x063930FAF2f579f266BB47892FE42d1011a89435",
      abi: dictator,
    },
    PuppetToken: {
      address: "0x62F386cf1D86001d8ADa7CC7bE21e38D6B540855",
      abi: puppetToken,
    },
    PuppetVoteToken: {
      address: "0xf13b9308d5e193144a06a5eee7310033635b98e4",
      abi: puppetVoteToken,
    },
    Router: {
      address: "0x8387917908Cc152d04BF39c623f4a4DBc24C05B7",
      abi: router,
    },

    PuppetStore: {
      address: "0xd5Ecfc3985098A72fBFE06256ddcDb49Bf2E657c",
      abi: puppetStore,
    },
    PuppetRouter: {
      address: "0xC6C2eBfC112b9703752E4e99E51b4d8B1F84E244",
      abi: puppetRouter,
    },
    PuppetLogic: {
      address: "0x806eD8d1d4e10E5fD8fe8e8B7851434c157E7257",
      abi: puppetLogic,
    },

    ContributeStore: {
      address: "0x206eFEf96Cea6Fe0c6a612A8F7841299e34293F4",
      abi: contributeStore,
    },
    VotingEscrowStore: {
      address: "0xb8b291Fb808A8781f9b1f9A23a783B66ae2E057B",
      abi: votingEscrowStore,
    },
    RewardStore: {
      address: "0x86e52286a8A83727F4dfB3176B59D2cEb13883a9",
      abi: rewardStore,
    },
    ContributeLogic: {
      address: "0xC8b0f054c65168F97E5a3f37910B78964B7D1d60",
      abi: contributeLogic,
    },
    VotingEscrowLogic: {
      address: "0x69DA8323249118562F64f38e27396323Cbe05223",
      abi: votingEscrowLogic,
    },
    RewardLogic: {
      address: "0x00Ea985Cfea1F4045121Dc7392f8B530e267f16E",
      abi: rewardLogic,
    },
    TokenomicsRouter: {
      address: "0xa73dC3EDf189Db626E013c1d1f6921AA63bffb8a",
      abi: tokenomicsRouter,
    },

    PositionStore: {
      address: "0x070c8AC23Eaf7880aBD1D66516ae15a3a6445546",
      abi: positionStore,
    },
    AllocationLogic: {
      address: "0xBEB9BD0bEeC0d6C3295e3681459327530b75deb1",
      abi: allocationLogic,
    },
    RequestLogic: {
      address: "0xb07f2eAF3ec04d0ad84965f9Fa18985dBB34939D",
      abi: requestLogic,
    },
    ExecutionLogic: {
      address: "0x10E097461cC0eb02f119EaDe75332f28E8cd6A59",
      abi: executionLogic,
    },
    UnhandledCallbackLogic: {
      address: "0x387429cd6463427aC327c628773Af4FE90adAF01",
      abi: unhandledCallbackLogic,
    },
    PositionRouter: {
      address: "0x3fBFAbbadE7fBA80C17e020D7d7E376D8Ca4379a",
      abi: positionRouter,
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
      abi: customError,
    },
  },
} as const;
