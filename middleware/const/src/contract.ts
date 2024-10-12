import { arbitrum } from "viem/chains";
import contractAddress from "contracts/deployments/addresses.json";

import contributeLogic from "./abi/contributeLogic.js";
import contributeStore from "./abi/contributeStore.js";
import puppetStore from "./abi/puppetStore";
import dictator from "./abi/dictator.js";
import eventEmitter from "./abi/eventEmitter.js";
import puppetToken from "./abi/puppetToken.js";
import puppetVoteToken from "./abi/puppetVoteToken.js";
import rewardLogic from "./abi/rewardLogic.js";
import rewardRouter from "./abi/rewardRouter.js";
import rewardStore from "./abi/rewardStore.js";
import router from "./abi/router.js";
import votingEscrowLogic from "./abi/votingEscrowLogic.js";
import votingEscrowStore from "./abi/votingEscrowStore.js";
import stubPublicContribute from "./abi/stubPublicContribute.js";
import positionStore from "./abi/positionStore";
import puppetRouter from "./abi/puppetRouter";
import positionRouter from "./abi/positionRouter";
import puppetLogic from "./abi/puppetLogic";
import { Address } from "viem";

export const CONTRACT = {
  [arbitrum.id]: {
    Dictator: {
      address: contractAddress[42161].Dictator as Address,
      abi: dictator,
    },
    EventEmitter: {
      address: contractAddress[42161].EventEmitter as Address,
      abi: eventEmitter,
    },
    PuppetToken: {
      address: contractAddress[42161].PuppetToken as Address,
      abi: puppetToken,
    },
    PuppetVoteToken: {
      address: contractAddress[42161].PuppetVoteToken as Address,
      abi: puppetVoteToken,
    },
    Router: {
      address: contractAddress[42161].Router as Address,
      abi: router,
    },

    PuppetStore: {
      address: contractAddress[42161].PuppetStore as Address,
      abi: puppetStore,
    },
    PuppetRouter: {
      address: contractAddress[42161].PuppetRouter as Address,
      abi: puppetRouter,
    },
    PuppetLogic: {
      address: contractAddress[42161].PuppetLogic as Address,
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
  },
} as const;
