import * as PUPPET from '@puppet/middleware/const'
import { getMappedValue } from '@puppet/middleware/utils'
import { wagmiConfig } from '@puppet/middleware/wallet'
import { readContract } from '@wagmi/core/actions'
import { erc20Abi } from 'abitype/abis'
import type { Address } from 'viem'
import * as viem from 'viem'

export async function readBalanceOf(token: Address, user: Address): Promise<bigint> {
  return readContract(wagmiConfig, {
    address: token,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [user]
  })
}
