import { arbitrum } from "viem/chains";
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

export const CONTRACT = {
  [arbitrum.id]: {
    Dictator: {
      address: "0x6474AF87CbF50cbdE88710b3DaF7247A22910AA1",
      abi: dictator,
    },
    EventEmitter: {
      address: "0xfA3fA156d39235994Ed8b87DB6e0cBE74c942C41",
      abi: eventEmitter,
    },
    PuppetToken: {
      address: "0x29e21E47E2a1C4128b789b1b49FEAB91dBD7A80A",
      abi: puppetToken,
    },
    PuppetVoteToken: {
      address: "0xFeDA7274a47e142170824A4AbC8CF6A38033A254",
      abi: puppetVoteToken,
    },
    Router: {
      address: "0xFd5943807B3A9dB50DB8D0DAf4162E68f7139b2C",
      abi: router,
    },

    PuppetStore: {
      address: "0xeA9D224D16E3a35a8EB78ada6BD8D157a5F22aC4",
      abi: puppetStore,
    },
    PuppetRouter: {
      address: "0x402bF957BfFa22936da3bb66809D1e6E841aa059",
      abi: puppetRouter,
    },
    PuppetLogic: {
      address: "0xd58c8E29F36c2f082d0d6f6C3f07a6B7A519B86a",
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
