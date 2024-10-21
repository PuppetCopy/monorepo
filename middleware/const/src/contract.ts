import { erc20Abi } from "viem";
import { arbitrum } from "viem/chains";
import contributeLogic from "./abi/contributeLogic.js";
import contributeStore from "./abi/contributeStore.js";
import customError from "./abi/customError";
import datastore from "./abi/datastore";
import dictator from "./abi/dictator.js";
import eventEmitter from "./abi/eventEmitter";
import exchangeRouter from "./abi/exchangeRouter";
import positionRouter from "./abi/positionRouter";
import positionStore from "./abi/positionStore";
import puppetLogic from "./abi/puppetLogic";
import puppetRouter from "./abi/puppetRouter";
import puppetStore from "./abi/puppetStore";
import puppetToken from "./abi/puppetToken.js";
import puppetVoteToken from "./abi/puppetVoteToken.js";
import reader from "./abi/reader";
import referralStorage from "./abi/referralStorage";
import rewardLogic from "./abi/rewardLogic.js";
import rewardRouter from "./abi/rewardRouter.js";
import rewardStore from "./abi/rewardStore.js";
import router from "./abi/router.js";
import stubPublicContribute from "./abi/stubPublicContribute.js";
import votingEscrowLogic from "./abi/votingEscrowLogic.js";
import votingEscrowStore from "./abi/votingEscrowStore.js";

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
      address: "0xecC5C0E9D6AdD69b3A90513f03117FE9dBEA6C00",
      abi: puppetStore,
    },
    PuppetRouter: {
      address: "0x6729b1f24B859DaB45EC35bF6f00102E6e6f05E7",
      abi: puppetRouter,
    },
    PuppetLogic: {
      address: "0x7c5b84C0a4D7D565465C0A4121C5833498ED1192",
      abi: puppetLogic,
    },

    ContributeStore: {
      address: "0xD8f35E3F2F58579d0AFC937913539c06932Ca13D",
      abi: contributeStore,
    },
    VotingEscrowStore: {
      address: "0x2A87123506E4459783A449f43224669d53B6EFB0",
      abi: votingEscrowStore,
    },
    RewardStore: {
      address: "0x9e2Ba591081B10612E8Fdf868EC20c3472CC15CF",
      abi: rewardStore,
    },
    VotingEscrowLogic: {
      address: "0xA9233Fb481b6790199F39AE501B05d623Fa85A86",
      abi: votingEscrowLogic,
    },
    ContributeLogic: {
      address: "0x2C78298cd4a7A2312547c94D6F9AABBB8c709A95",
      abi: contributeLogic,
    },
    RewardLogic: {
      address: "0xf560b1f2dE1eb62e93FBA01Ee13578AACB8Fcd52",
      abi: rewardLogic,
    },
    RewardRouter: {
      address: "0x8192468Ab9852391734fA4862581Bb8D96168CE3",
      abi: rewardRouter,
    },
    PositionStore: {
      address: "0x5F5C9d9272b4Bae556e0F83BE2c488B6E77F03EC",
      abi: positionStore,
    },
    PositionRouter: {
      address: "0xe24B30FB459656425c8215eDf555585fc6b1F711",
      abi: positionRouter,
    },

    // TODO: Remove these as they are used for testing
    StubPublicContribute: {
      address: "0x31a193C331773BEA727D8BA92db185597faBfcC5",
      abi: stubPublicContribute,
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
      abi: eventEmitter,
    },
    CustomError: {
      abi: customError,
    },
  },
} as const;
