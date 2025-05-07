import { erc20Abi } from 'abitype/abis'
import type { Address } from 'viem'
import { wallet } from '../wallet/wallet'

export async function readBalanceOf(token: Address, user: Address): Promise<bigint> {
  return wallet.read({
    address: token,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [user]
  })
}
