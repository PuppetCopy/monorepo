import { erc20Abi } from 'abitype/abis'
import type { Address } from 'viem'
import { wallet } from '../wallet/wallet'

export const tokenBalanceOf = (_account: unknown, token: Address, target: Address) =>
  wallet.read({
    address: token,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [target]
  })
