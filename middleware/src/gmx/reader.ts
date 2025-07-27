import type { Hex, PublicClient } from 'viem'
import { readContract } from 'viem/actions'
import { CONTRACT } from '../const/contract.js'
import { getPositionCollateralAmountKey, getPositionSizeInUsdKey } from '../gmx/gmxUtils.js'

export async function getTraderSize(client: PublicClient, positionKey: Hex) {
  return readContract(client, {
    address: CONTRACT.GmxDatastore.address,
    abi: CONTRACT.GmxDatastore.abi,
    functionName: 'getUint',
    args: [getPositionSizeInUsdKey(positionKey)]
  })
}

export async function getTraderCollateral(client: PublicClient, positionKey: Hex) {
  return readContract(client, {
    address: CONTRACT.GmxDatastore.address,
    abi: CONTRACT.GmxDatastore.abi,
    functionName: 'getUint',
    args: [getPositionCollateralAmountKey(positionKey)]
  })
}

// export async function isPositionStalled(
//   client: PublicClient,
//   trader: Address,
//   market: Address,
//   collateralToken: Address,
//   isLong: boolean,
//   allocationAddress: Address
// ) {
//   return readContract(client, {
//     address: CONTRACT.Mirror.address as Address,
//     abi: CONTRACT.Mirror.abi,
//     functionName: 'is',
//     args: [trader, market, collateralToken, isLong, allocationAddress]
//   })
// }
