
import { getMappedValue } from "common-utils"
import * as PUPPET from "puppet-middleware-const"
import { Address } from "viem/accounts"
import { readContract } from "viem/actions"
import * as walletLink from "wallet"



export default {
  PuppetToken: {
    totalSupply: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetToken, functionName: 'totalSupply', args: [] }),
    balanceOf: (provider: walletLink.IClient, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetToken, functionName: 'balanceOf', args: [user] }),
    coreShare: (provider: walletLink.IClient, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetToken, functionName: 'getCoreShare', args: [] }),
    limitAmount: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetToken, functionName: 'getLimitAmount', args: [] }),
  },
  PuppetVoteToken: {
    totalSupply: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetVoteToken, functionName: 'totalSupply', args: [] }),
    balanceOf: (provider: walletLink.IClient, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetVoteToken, functionName: 'balanceOf', args: [user] }),
  },
  ContributeStore: {
    userGeneratedRevenue: (provider: walletLink.IClient, token: Address, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.ContributeStore, functionName: 'getUserContributionBalanceMap', args: [token, user] }),
    tokenContribution: (provider: walletLink.IClient, token: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.ContributeStore, functionName: 'getCursorBalance', args: [token] }),
    buybackQuote: (provider: walletLink.IClient, token: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.ContributeStore, functionName: 'getBuybackQuote', args: [token] }),
    tokenBalance: (provider: walletLink.IClient, token: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.ContributeStore, functionName: 'getTokenBalance', args: [token] }),
  },
  RewardStore: {
    tokenBalance: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.RewardStore, functionName: 'lastDistributionTimestamp', args: [] }),
  },
  VotingEscrowStore: {
    lockDuration: (provider: walletLink.IClient, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.VotingEscrowStore, functionName: 'getLockDuration', args: [user] }),
    vested: (provider: walletLink.IClient, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.VotingEscrowStore, functionName: 'getVested', args: [user] }),
  },
  ContributeLogic: {
    claimable: (provider: walletLink.IClient, tokenList: Address[], user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.ContributeLogic, functionName: 'getClaimable', args: [tokenList, user] }),
    baselineEmissionRate: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.ContributeLogic, functionName: 'config', args: [] }),
  },
  VotingEscrowLogic: {
    claimable: (provider: walletLink.IClient, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.VotingEscrowLogic, functionName: 'getClaimable', args: [user] }),
    baseMultiplier: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.VotingEscrowLogic, functionName: 'config', args: [] }),
  },
  RewardLogic: {
    claimable: (provider: walletLink.IClient, user: Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.RewardLogic, functionName: 'getClaimable', args: [user] }),
    distributionTimeframe: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.RewardLogic, functionName: 'config', args: [] }),
    pendingEmission: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.RewardLogic, functionName: 'getPendingEmission', args: [] }),
  }
}





