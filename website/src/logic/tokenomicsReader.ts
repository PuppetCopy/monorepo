import { CONTRACT } from '@puppet-copy/middleware/const'
import type { Address } from 'viem/accounts'
import { wallet } from '../wallet/wallet'

export default {
  PuppetToken: {
    getTotalSupply: (contractDefs = CONTRACT[42161]) =>
      wallet.read({ ...contractDefs.PuppetToken, functionName: 'totalSupply', args: [] }),
    getBalanceOf: (user: Address, contractDefs = CONTRACT[42161]) =>
      wallet.read({ ...contractDefs.PuppetToken, functionName: 'balanceOf', args: [user] })
    // getCoreShare: (user: Address, contractDefs = CONTRACT[42161]) =>
    //   readContract({ ...contractDefs.PuppetToken, functionName: 'getCoreShare', args: [] }),
    // getLimitAmount: (contractDefs = CONTRACT[42161]) =>
    //   readContract({ ...contractDefs.PuppetToken, functionName: 'getEmissionRateLimit', args: [] })
  }
  // PuppetVoteToken: {
  //   getTotalSupply: (contractDefs = CONTRACT[42161]) =>
  //     readContract({ ...contractDefs.PuppetVoteToken, functionName: 'totalSupply', args: [] }),
  //   getBalanceOf: (user: Address, contractDefs = CONTRACT[42161]) =>
  //     readContract({ ...contractDefs.PuppetVoteToken, functionName: 'balanceOf', args: [user] })
  // },
  // ContributeStore: {
  //   getUserContributionBalance: (token: Address, user: Address, contractDefs = CONTRACT[42161]) =>
  //     readContract({
  //       ...contractDefs.ContributeStore,
  //       functionName: 'getUserContributionBalanceMap',
  //       args: [token, user]
  //     }),
  //   getCursorBalance: (token: Address, contractDefs = CONTRACT[42161]) =>
  //     readContract({ ...contractDefs.ContributeStore, functionName: 'getCursorBalance', args: [token] }),
  //   getBuybackQuote: (token: Address, contractDefs = CONTRACT[42161]) =>
  //     readContract({ ...contractDefs.ContributeStore, functionName: 'getBuybackQuote', args: [token] }),
  //   getTokenBalance: (token: Address, contractDefs = CONTRACT[42161]) =>
  //     readContract({ ...contractDefs.ContributeStore, functionName: 'getTokenBalance', args: [token] })
  // },
  // RewardStore: {
  //   getLastDistributionTimestamp: (contractDefs = CONTRACT[42161]) =>
  //     readContract({ ...contractDefs.RewardStore, functionName: 'lastDistributionTimestamp', args: [] })
  // },
  // VotingEscrowStore: {
  //   getLockDuration: (user: Address, contractDefs = CONTRACT[42161]) =>
  //     readContract({ ...contractDefs.VotingEscrowStore, functionName: 'getLockDuration', args: [user] }),
  //   getVested: (user: Address, contractDefs = CONTRACT[42161]) =>
  //     readContract({ ...contractDefs.VotingEscrowStore, functionName: 'getVested', args: [user] })
  // },
  // ContributeLogic: {
  //   getClaimable: (tokenList: Address[], user: Address, contractDefs = CONTRACT[42161]) =>
  //     readContract({
  //       ...contractDefs.ContributeLogic,
  //       functionName: 'getClaimable',
  //       args: [tokenList, user]
  //     }),
  //   getConfig: (contractDefs = CONTRACT[42161]) =>
  //     readContract({ ...contractDefs.ContributeLogic, functionName: 'config', args: [] })
  // },
  // VotingEscrowLogic: {
  //   getClaimable: (user: Address, contractDefs = CONTRACT[42161]) =>
  //     readContract({ ...contractDefs.VotingEscrowLogic, functionName: 'getClaimable', args: [user] }),
  //   baseMultiplier: (contractDefs = CONTRACT[42161]) =>
  //     readContract({ ...contractDefs.VotingEscrowLogic, functionName: 'config', args: [] })
  // },
  // RewardLogic: {
  //   getClaimable: (user: Address, contractDefs = CONTRACT[42161]) =>
  //     readContract({ ...contractDefs.RewardLogic, functionName: 'getClaimable', args: [user] }),
  //   getDistributionTimeframe: (contractDefs = CONTRACT[42161]) =>
  //     readContract({ ...contractDefs.RewardLogic, functionName: 'config', args: [] }),
  //   getPendingEmission: (contractDefs = CONTRACT[42161]) =>
  //     readContract({ ...contractDefs.RewardLogic, functionName: 'getPendingEmission', args: [] })
  // },
  // PuppetStore: {
  //   getClaimable: (token: Address, user: Address, contractDefs = CONTRACT[42161]) =>
  //     readContract({ ...contractDefs.PuppetStore, functionName: 'getUserBalance', args: [token, user] })
  // }
}
