import * as PUPPET from '@puppet-copy/middleware/const'
import type { Hex } from 'viem'
import type { Address } from 'viem/accounts'
import { type IAccountState, wallet } from '../wallet/wallet'

const puppetReader = {
  getUserBalance: (accountState: IAccountState, token: Address, user: Address, contractDefs = PUPPET.CONTRACT) =>
    wallet.read(accountState, {
      ...contractDefs.Account,
      functionName: 'userBalanceMap',
      args: [token, user]
    }),
  getUserAllocationList: (
    accountState: IAccountState,
    key: Hex,
    puppetList: Address[],
    contractDefs = PUPPET.CONTRACT
  ) =>
    wallet.read(accountState, {
      ...contractDefs.Account,
      functionName: 'getBalanceList',
      args: [key, puppetList]
    }),
  getMatchRule: (accountState: IAccountState, puppet: Address, key: Hex, contractDefs = PUPPET.CONTRACT) =>
    wallet.read(accountState, { ...contractDefs.Rule, functionName: 'matchingRuleMap', args: [puppet, key] }),
  getMatchRuleList: (accountState: IAccountState, puppet: Address, keyList: Hex[], contractDefs = PUPPET.CONTRACT) =>
    wallet.read(accountState, { ...contractDefs.Rule, functionName: 'getRuleList', args: [puppet, keyList] }),
  getConfig: (accountState: IAccountState, contractDefs = PUPPET.CONTRACT) =>
    wallet.read(accountState, { ...contractDefs.Rule, functionName: 'getConfig', args: [] })
} as const

export default puppetReader
