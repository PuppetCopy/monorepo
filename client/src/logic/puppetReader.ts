
import { getMappedValue } from "common-utils"
import * as PUPPET from "puppet-middleware-const"
import { Hex } from "viem"
import { readContract } from "viem/actions"
import * as walletLink from "wallet"
import * as viem from "viem"



export default {
  PuppetStore: {
    getUserBalance: (provider: walletLink.IClient, token: viem.Address, puppet: viem.Address, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetStore, functionName: 'getUserBalance', args: [token, puppet] }),
    getMatchRule: (provider: walletLink.IClient, puppet: viem.Address, key: viem.Hex, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetStore, functionName: 'getMatchRule', args: [puppet, key] }),
    getMatchRuleList: (provider: walletLink.IClient, puppet: viem.Address, keyList: viem.Hex[], contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetStore, functionName: 'getMatchRuleList', args: [puppet, keyList] }),
    getUserAllocationList: (provider: walletLink.IClient, key: Hex, puppetList: viem.Address[], contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetStore, functionName: 'getUserAllocationList', args: [key, puppetList] }),
  },
  PuppetLogic: {
    getConfig: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetLogic, functionName: 'config', args: [] }),
  },
}





