
import { erc20Abi } from "abitype/abis"
import { getMappedValue } from "common-utils"
import { Address } from "viem"
import { readContract } from "viem/actions"
import * as walletLink from "wallet"
import * as PUPPET from "puppet-middleware-const"
import * as viem from "viem"



export async function readBalanceOf(
  wallet: walletLink.IClient,
  token: Address,
  address: Address
): Promise<bigint> {

  return walletLink.readContract({
    address: token,
    abi: erc20Abi,
    provider: wallet,
    functionName: 'balanceOf',
    args: [address],
  })
}

export async function readLockSupply(
  provider: walletLink.IClient,
  contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id),
) {
  
  const supply = await readContract(provider, {
    ...contractDefs.VotingEscrow,
    functionName: 'supply',
    args: []
  })

  return supply
}

export async function readTotalEmitted(
  provider: walletLink.IClient,
  contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id),
) {
  
  const puppetSupply = await readContract(provider, {
    ...contractDefs.PuppetToken,
    functionName: 'totalEmitted',
    args: []
  })

  return puppetSupply
}

export async function readUserLockDetails(
  provider: walletLink.IClient,
  address: viem.Address,
  contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id),
) {
  
  const [amount, end] = await readContract(provider, {
    ...contractDefs.VotingEscrow,
    functionName: 'locked',
    args: [address]
  })

  return { amount, end }
}

export async function readUserGeneratedRevenue(
  provider: walletLink.IClient,
  address: viem.Address,
  contractDefs = getMappedValue(PUPPET.CONTRACT, provider.chain.id),
) {
  
  return readContract(provider, {
    ...contractDefs.RewardLogic,
    functionName: 'getAccountGeneratedRevenue',
    args: [contractDefs.Datastore.address, address]
  })
}
