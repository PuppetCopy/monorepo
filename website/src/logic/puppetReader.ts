import * as PUPPET from '@puppet-copy/middleware/const'
import type { Hex } from 'viem'
import type { Address } from 'viem/accounts'
import { wallet } from '../wallet/wallet'

export default {
  getUserBalance: (token: Address, user: Address, contractDefs = PUPPET.CONTRACT) =>
    wallet.read({
      ...contractDefs.AllocationStore,
      functionName: 'userBalanceMap',
      args: [token, user]
    }),
  getUserAllocationList: (key: Hex, puppetList: Address[], contractDefs = PUPPET.CONTRACT) =>
    wallet.read({
      ...contractDefs.AllocationStore,
      functionName: 'getBalanceList',
      args: [key, puppetList]
    }),
  getMatchRule: (puppet: Address, key: Hex, contractDefs = PUPPET.CONTRACT) =>
    wallet.read({ ...contractDefs.MatchingRule, functionName: 'matchingRuleMap', args: [puppet, key] }),
  getMatchRuleList: (puppet: Address, keyList: Hex[], contractDefs = PUPPET.CONTRACT) =>
    wallet.read({ ...contractDefs.MatchingRule, functionName: 'getRuleList', args: [puppet, keyList] }),
  getConfig: (contractDefs = PUPPET.CONTRACT) =>
    wallet.read({ ...contractDefs.MatchingRule, functionName: 'config', args: [] })
}
