
import { erc20Abi } from "abitype/abis"
import { getMappedValue } from "common-utils"
import { Address } from "viem"
import { readContract } from "viem/actions"
import * as walletLink from "wallet"
import * as PUPPET from "puppet-const"
import * as viem from "viem"



export async function readBalanceOf(
  wallet: walletLink.IClient,
  token: Address,
  user: Address
): Promise<bigint> {

  return walletLink.readContract({
    address: token,
    abi: erc20Abi,
    provider: wallet,
    functionName: 'balanceOf',
    args: [user],
  })
}
