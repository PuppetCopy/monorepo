import type { Address, PublicClient } from 'viem'
import { getDenominator } from '../../utils/utils.js'
import univ2Pool from './uniV2.abi.js'
import univ3Pool from './uniV3.abi.js'

export async function getUniV3PoolPrice(client: PublicClient, decimals: number, poolAddress: Address) {
  const [sqrtPriceX96] = await client.readContract({
    abi: univ3Pool,
    address: poolAddress,
    functionName: 'slot0'
  })

  const denominator = getDenominator(decimals)
  const price = (sqrtPriceX96 * sqrtPriceX96 * denominator) >> 192n
  return price
}

export async function getUniV2PoolPrice(client: PublicClient, decimals: number, poolAddress: Address) {
  const [reserve0, reserve1] = await client.readContract({
    abi: univ2Pool,
    address: poolAddress,
    functionName: 'getReserves'
  })

  const denominator = getDenominator(decimals)
  const ratio = (reserve1 * denominator) / reserve0

  return ratio
}
