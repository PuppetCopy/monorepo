
import { getMappedValue } from "@puppet/middleware/utils"
import * as PUPPET from "@puppet/middleware/const"
import { Hex } from "viem"
import { readContract } from "viem/actions"
import * as walletLink from "@puppet/middleware/wallet"
import * as viem from "viem"



export default {
  getUserBalance: (provider: walletLink.IClient, token: viem.Address, puppet: viem.Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
    readContract(provider, { ...contractDefs.AllocationStore, functionName: 'userBalanceMap', args: [token, puppet] }),
  getUserAllocationList: (provider: walletLink.IClient, key: Hex, puppetList: viem.Address[], contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
    readContract(provider, { ...contractDefs.AllocationStore, functionName: 'getBalanceList', args: [key, puppetList] }),
  getMatchRule: (provider: walletLink.IClient, puppet: viem.Address, key: viem.Hex, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
    readContract(provider, { ...contractDefs.MatchingRule, functionName: 'matchingRuleMap', args: [puppet, key] }),
  getMatchRuleList: (provider: walletLink.IClient, puppet: viem.Address, keyList: viem.Hex[], contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
    readContract(provider, { ...contractDefs.MatchingRule, functionName: 'getRuleList', args: [puppet, keyList] }),
  getConfig: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
    readContract(provider, { ...contractDefs.MatchingRule, functionName: 'config', args: [] }),
}





