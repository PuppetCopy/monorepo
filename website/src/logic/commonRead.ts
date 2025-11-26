import { erc20Abi } from 'abitype/abis'
import type { Address } from 'viem'
import { type IAccountState, wallet } from '../wallet/wallet'

export const tokenBalanceOf = (account: IAccountState, token: Address, target: Address) =>
  wallet.read(account, {
    address: token,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [target]
  })
