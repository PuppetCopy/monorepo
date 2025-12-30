import type { Address, PublicClient } from 'viem'
import { erc20Abi } from 'viem'

/** Query puppet balances on-chain for a given token using multicall */
export async function getPuppetBalances(
  client: PublicClient,
  token: Address,
  puppets: Address[]
): Promise<Map<Address, bigint>> {
  if (puppets.length === 0) return new Map()

  const results = await client.multicall({
    contracts: puppets.map(puppet => ({
      address: token,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [puppet]
    }))
  })

  const balanceMap = new Map<Address, bigint>()

  for (let i = 0; i < puppets.length; i++) {
    const result = results[i]
    if (result.status === 'success') {
      const balance = result.result as bigint
      if (balance > 0n) {
        balanceMap.set(puppets[i], balance)
      }
    }
  }

  return balanceMap
}
