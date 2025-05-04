import * as PUPPET from '@puppet/middleware/const'
import { getMappedValue } from '@puppet/middleware/utils'
import * as walletLink from '@puppet/middleware/wallet'
import { erc20Abi } from 'abitype/abis'
import type { Address } from 'viem'
import * as viem from 'viem'
import { readContract } from 'viem/actions'

export async function readBalanceOf(wallet: walletLink.IClient, token: Address, user: Address): Promise<bigint> {
  return walletLink.readContract({
    address: token,
    abi: erc20Abi,
    provider: wallet,
    functionName: 'balanceOf',
    args: [user],
  })
}
