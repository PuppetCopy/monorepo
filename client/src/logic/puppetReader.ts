
import { getMappedValue } from "common-utils"
import * as PUPPET from "puppet-middleware-const"
import { Hex } from "viem"
import { readContract } from "viem/actions"
import * as walletLink from "wallet"



export default {
  PuppetStore: {
    getAllocationRule: (provider: walletLink.IClient, key: Hex, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetStore, functionName: 'getAllocationRule', args: [key] }),
    getAllocationRuleList: (provider: walletLink.IClient, keyList: Hex[], contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetStore, functionName: 'getAllocationRuleList', args: [keyList] }),
  },
  PuppetLogic: {
    getConfig: (provider: walletLink.IClient, contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id)) =>
      readContract(provider, { ...contractDefs.PuppetLogic, functionName: 'config', args: [] }),
  },
}





