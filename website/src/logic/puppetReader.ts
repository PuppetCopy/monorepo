import * as PUPPET from '@puppet/middleware/const'
import { wagmiConfig } from '@puppet/middleware/wallet'
import { readContract } from '@wagmi/core/actions'
import type * as viem from 'viem'
import type { Hex } from 'viem'

export default {
  getUserBalance: (token: viem.Address, puppet: viem.Address, contractDefs = PUPPET.CONTRACT[42161]) =>
    readContract(wagmiConfig, {
      ...contractDefs.AllocationStore,
      functionName: 'userBalanceMap',
      args: [token, puppet]
    }),
  getUserAllocationList: (key: Hex, puppetList: viem.Address[], contractDefs = PUPPET.CONTRACT[42161]) =>
    readContract(wagmiConfig, {
      ...contractDefs.AllocationStore,
      functionName: 'getBalanceList',
      args: [key, puppetList]
    }),
  getMatchRule: (puppet: viem.Address, key: viem.Hex, contractDefs = PUPPET.CONTRACT[42161]) =>
    readContract(wagmiConfig, { ...contractDefs.MatchingRule, functionName: 'matchingRuleMap', args: [puppet, key] }),
  getMatchRuleList: (puppet: viem.Address, keyList: viem.Hex[], contractDefs = PUPPET.CONTRACT[42161]) =>
    readContract(wagmiConfig, { ...contractDefs.MatchingRule, functionName: 'getRuleList', args: [puppet, keyList] }),
  getConfig: (contractDefs = PUPPET.CONTRACT[42161]) =>
    readContract(wagmiConfig, { ...contractDefs.MatchingRule, functionName: 'config', args: [] })
}
