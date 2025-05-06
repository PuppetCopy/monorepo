import * as PUPPET from '@puppet/middleware/const'
import { getMappedValue } from '@puppet/middleware/utils'
import type * as walletLink from '@puppet/middleware/wallet'
import { wagmiConfig } from '@puppet/middleware/wallet'
import { readContract } from '@wagmi/core/actions'
import type { Address } from 'viem/accounts'

export default {
  PuppetToken: {
    getTotalSupply: (contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.PuppetToken, functionName: 'totalSupply', args: [] }),
    getBalanceOf: (user: Address, contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.PuppetToken, functionName: 'balanceOf', args: [user] }),
    getCoreShare: (user: Address, contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.PuppetToken, functionName: 'getCoreShare', args: [] }),
    getLimitAmount: (contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.PuppetToken, functionName: 'getEmissionRateLimit', args: [] })
  },
  PuppetVoteToken: {
    getTotalSupply: (contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.PuppetVoteToken, functionName: 'totalSupply', args: [] }),
    getBalanceOf: (user: Address, contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.PuppetVoteToken, functionName: 'balanceOf', args: [user] })
  },
  ContributeStore: {
    getUserContributionBalance: (token: Address, user: Address, contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, {
        ...contractDefs.ContributeStore,
        functionName: 'getUserContributionBalanceMap',
        args: [token, user]
      }),
    getCursorBalance: (token: Address, contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.ContributeStore, functionName: 'getCursorBalance', args: [token] }),
    getBuybackQuote: (token: Address, contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.ContributeStore, functionName: 'getBuybackQuote', args: [token] }),
    getTokenBalance: (token: Address, contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.ContributeStore, functionName: 'getTokenBalance', args: [token] })
  },
  RewardStore: {
    getLastDistributionTimestamp: (contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.RewardStore, functionName: 'lastDistributionTimestamp', args: [] })
  },
  VotingEscrowStore: {
    getLockDuration: (user: Address, contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.VotingEscrowStore, functionName: 'getLockDuration', args: [user] }),
    getVested: (user: Address, contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.VotingEscrowStore, functionName: 'getVested', args: [user] })
  },
  ContributeLogic: {
    getClaimable: (tokenList: Address[], user: Address, contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, {
        ...contractDefs.ContributeLogic,
        functionName: 'getClaimable',
        args: [tokenList, user]
      }),
    getConfig: (contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.ContributeLogic, functionName: 'config', args: [] })
  },
  VotingEscrowLogic: {
    getClaimable: (user: Address, contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.VotingEscrowLogic, functionName: 'getClaimable', args: [user] }),
    baseMultiplier: (contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.VotingEscrowLogic, functionName: 'config', args: [] })
  },
  RewardLogic: {
    getClaimable: (user: Address, contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.RewardLogic, functionName: 'getClaimable', args: [user] }),
    getDistributionTimeframe: (contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.RewardLogic, functionName: 'config', args: [] }),
    getPendingEmission: (contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.RewardLogic, functionName: 'getPendingEmission', args: [] })
  },
  PuppetStore: {
    getClaimable: (token: Address, user: Address, contractDefs = PUPPET.CONTRACT[42161]) =>
      readContract(wagmiConfig, { ...contractDefs.PuppetStore, functionName: 'getUserBalance', args: [token, user] })
  }
}
