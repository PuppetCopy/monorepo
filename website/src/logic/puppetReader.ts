import * as PUPPET from '@puppet/middleware/const'
import type * as viem from 'viem'
import type { Hex } from 'viem'
import { wallet } from '../wallet/wallet'

export default {
  getUserBalance: (token: viem.Address, puppet: viem.Address, contractDefs = PUPPET.CONTRACT[42161]) =>
    wallet.read({
      ...contractDefs.AllocationStore,
      functionName: 'userBalanceMap',
      args: [token, puppet]
    }),
  getUserAllocationList: (key: Hex, puppetList: viem.Address[], contractDefs = PUPPET.CONTRACT[42161]) =>
    wallet.read({
      ...contractDefs.AllocationStore,
      functionName: 'getBalanceList',
      args: [key, puppetList]
    }),
  getMatchRule: (puppet: viem.Address, key: viem.Hex, contractDefs = PUPPET.CONTRACT[42161]) =>
    wallet.read({ ...contractDefs.MatchingRule, functionName: 'matchingRuleMap', args: [puppet, key] }),
  getMatchRuleList: (puppet: viem.Address, keyList: viem.Hex[], contractDefs = PUPPET.CONTRACT[42161]) =>
    wallet.read({ ...contractDefs.MatchingRule, functionName: 'getRuleList', args: [puppet, keyList] }),
  getConfig: (contractDefs = PUPPET.CONTRACT[42161]) =>
    wallet.read({ ...contractDefs.MatchingRule, functionName: 'config', args: [] })
}
