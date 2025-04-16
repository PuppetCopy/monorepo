
import { getMappedValue } from "../utils/index.js"
import * as PUPPET from "../const/index.js"
import { Address } from "viem/accounts"
import { readContract } from "viem/actions"
import * as walletLink from "wallet"



export default {
  PuppetToken: {
    getTotalSupply: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetToken, functionName: 'totalSupply', args: [] }),
    getBalanceOf: (provider: walletLink.IClient, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetToken, functionName: 'balanceOf', args: [user] }),
    getCoreShare: (provider: walletLink.IClient, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetToken, functionName: 'getCoreShare', args: [] }),
    getLimitAmount: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetToken, functionName: 'getEmissionRateLimit', args: [] }),
  },
  PuppetVoteToken: {
    getTotalSupply: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetVoteToken, functionName: 'totalSupply', args: [] }),
    getBalanceOf: (provider: walletLink.IClient, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetVoteToken, functionName: 'balanceOf', args: [user] }),
  },
  ContributeStore: {
    getUserContributionBalance: (provider: walletLink.IClient, token: Address, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.ContributeStore, functionName: 'getUserContributionBalanceMap', args: [token, user] }),
    getCursorBalance: (provider: walletLink.IClient, token: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.ContributeStore, functionName: 'getCursorBalance', args: [token] }),
    getBuybackQuote: (provider: walletLink.IClient, token: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.ContributeStore, functionName: 'getBuybackQuote', args: [token] }),
    getTokenBalance: (provider: walletLink.IClient, token: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.ContributeStore, functionName: 'getTokenBalance', args: [token] }),
  },
  RewardStore: {
    getLastDistributionTimestamp: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.RewardStore, functionName: 'lastDistributionTimestamp', args: [] }),
  },
  VotingEscrowStore: {
    getLockDuration: (provider: walletLink.IClient, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.VotingEscrowStore, functionName: 'getLockDuration', args: [user] }),
    getVested: (provider: walletLink.IClient, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.VotingEscrowStore, functionName: 'getVested', args: [user] }),
  },
  ContributeLogic: {
    getClaimable: (provider: walletLink.IClient, tokenList: Address[], user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.ContributeLogic, functionName: 'getClaimable', args: [tokenList, user] }),
    getConfig: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.ContributeLogic, functionName: 'config', args: [] }),
  },
  VotingEscrowLogic: {
    getClaimable: (provider: walletLink.IClient, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.VotingEscrowLogic, functionName: 'getClaimable', args: [user] }),
    baseMultiplier: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.VotingEscrowLogic, functionName: 'config', args: [] }),
  },
  RewardLogic: {
    getClaimable: (provider: walletLink.IClient, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.RewardLogic, functionName: 'getClaimable', args: [user] }),
    getDistributionTimeframe: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.RewardLogic, functionName: 'config', args: [] }),
    getPendingEmission: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.RewardLogic, functionName: 'getPendingEmission', args: [] }),
  },
  PuppetStore: {
    getClaimable: (provider: walletLink.IClient, token: Address, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetStore, functionName: 'getUserBalance', args: [token, user] }),
  },
}





