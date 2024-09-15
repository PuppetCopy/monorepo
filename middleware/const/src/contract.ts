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
      address: "0xECaC4151bF1d17eEC1e3b9bd3bc4a6f2e50E0AFA",
      abi: dictator,
    },
    EventEmitter: {
      address: "0x3E62bDfCB20e8253478fe79981d46514949D2cF0",
      abi: eventEmitter,
    },
    PuppetToken: {
      address: "0x5FeCb50777A594149D3e4A96C48CD1c0032c9972",
      abi: puppetToken,
    },
    PuppetVoteToken: {
      address: "0x9e40F0fee198AD9A3b97275606336d923d7197d8",
      abi: puppetVoteToken,
    },
    Router: {
      address: "0x039597eF5b22cC810676512aA23394c95119a312",
      abi: router,
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
      abi: rewardLogic
    },
    RewardRouter: {
      address: "0x8192468Ab9852391734fA4862581Bb8D96168CE3",
      abi: rewardRouter,
    },
    PuppetStore: {
      address: "0x75236b405F460245999F70bc06978AB2B4116920",
      abi: puppetStore,
    },
    PositionStore: {
      address: "0x5F5C9d9272b4Bae556e0F83BE2c488B6E77F03EC",
      abi: positionStore,
    },
    PuppetRouter: {
      address: "0x8F7d6b64264968D7b61DebbEAE6331af230fa860",
      abi: puppetRouter
    },
    PositionRouter: {
      address: "0xe24B30FB459656425c8215eDf555585fc6b1F711",
      abi: positionRouter
    },
    PuppetLogic: {
      address: "0x3E0894BE6984Ff281e0dd142F3606734F7A9CE94",
      abi: puppetLogic,
    },

    // TODO: Remove these as they are used for testing
    StubPublicContribute: {
      address: "0x31a193C331773BEA727D8BA92db185597faBfcC5",
      abi: stubPublicContribute,
    },
  },
} as const;
