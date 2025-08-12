import { groupListMap, periodicRun } from '@puppet-copy/middleware/core'
import type { ISimpleOraclePrice } from '@puppet-copy/middleware/gmx'
import { map, op } from 'aelea/stream'
import { multicast } from 'aelea/stream-extended'
import type { Address } from 'viem'

// Arbitrum URL: https://arbitrum-api.gmxinfra.io/signed_prices/latest
// Avalanche URL: https://avalanche-api.gmxinfra.io/signed_prices/latest
interface IGmxSignedPriceData {
  id: string // "4003688959"
  minBlockNumber: number // null
  minBlockHash: string | null // null
  oracleDecimals: number | null // null
  tokenSymbol: string // "ETH"
  tokenAddress: Address // "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
  minPrice: number | null // null
  maxPrice: number | null // null
  signer: string | null // null
  signature: string | null // null
  signatureWithoutBlockHash: string | null // null
  createdAt: string // "2025-07-28T19:30:24.419Z"
  minBlockTimestamp: number | null // 1753731023 (seconds - Unix timestamp)
  oracleKeeperKey: string // "realtimeFeed"
  maxBlockTimestamp: number // 1753731023 (seconds - Unix timestamp)
  maxBlockNumber: number // null
  maxBlockHash: string // null
  maxPriceFull: string // "3791200513446191" (price with full precision)
  minPriceFull: string // "3791014710710536" (price with full precision)
  oracleKeeperRecordId: string | null // null
  oracleKeeperFetchType: string // "ws"
  oracleType: string // "realtimeFeed2"
  blob: string // "0x00094baebfda9b87..." (binary data)
}

async function querySignedPrices(): Promise<IGmxSignedPriceData[]> {
  try {
    const response = await fetch('https://arbitrum-api.gmxinfra.io/signed_prices/latest')

    if (!response.ok) {
      throw new Error(`GMX signed prices API error! status: ${response.status}`)
    }

    const data = (await response.json()) as { signedPrices: IGmxSignedPriceData[] }
    return data.signedPrices || []
  } catch (error) {
    console.error('Error fetching GMX signed prices:', error)
    return []
  }
}

// Signed Prices from GMX API
export const latestPriceMap = op(
  periodicRun({
    startImmediate: true,
    interval: 2500,
    actionOp: map(async () => {
      const newLocal = await querySignedPrices()
      return groupListMap(newLocal, 'tokenAddress', (item): ISimpleOraclePrice => {
        const timestampMs = (item.minBlockTimestamp || item.maxBlockTimestamp) * 1000
        return {
          source: 'GMX API',
          token: item.tokenAddress,
          price: BigInt(item.maxPriceFull), // Use max price as the single price
          timestamp: timestampMs
        }
      })
    })
  }),
  multicast
)
