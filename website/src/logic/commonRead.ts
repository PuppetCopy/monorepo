import { erc20Abi } from 'abitype/abis'
import type { Address } from 'viem'
import wallet from '../wallet/wallet'

export const tokenBalanceOf = (account: Address, token: Address) =>
  wallet.read({
    address: token,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account]
  })
