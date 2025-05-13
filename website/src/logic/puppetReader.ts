import * as PUPPET from '@puppet/middleware/const'

import type { Hex } from 'viem'
import { wallet } from '../wallet/wallet'

export default {
  getUserBalance: (token: Address, puppet: Address, contractDefs = PUPPET.CONTRACT[42161]) =>
    wallet.read({
      ...contractDefs.AllocationStore,
      functionName: 'userBalanceMap',
      args: [token, puppet]
    }),
  getUserAllocationList: (key: Hex, puppetList: Address[], contractDefs = PUPPET.CONTRACT[42161]) =>
    wallet.read({
      ...contractDefs.AllocationStore,
      functionName: 'getBalanceList',
      args: [key, puppetList]
    }),
  getMatchRule: (puppet: Address, key: Hex, contractDefs = PUPPET.CONTRACT[42161]) =>
    wallet.read({ ...contractDefs.MatchingRule, functionName: 'matchingRuleMap', args: [puppet, key] }),
  getMatchRuleList: (puppet: Address, keyList: Hex[], contractDefs = PUPPET.CONTRACT[42161]) =>
    wallet.read({ ...contractDefs.MatchingRule, functionName: 'getRuleList', args: [puppet, keyList] }),
  getConfig: (contractDefs = PUPPET.CONTRACT[42161]) =>
    wallet.read({ ...contractDefs.MatchingRule, functionName: 'config', args: [] })
}
