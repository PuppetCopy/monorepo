import { type Address, createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

const ensClient = createPublicClient({
  chain: mainnet,
  batch: {
    multicall: {
      batchSize: 50,
      wait: 50
    }
  },
  transport: http('/api/rpc?network=ethereum')
})

// In-memory cache for ENS names
// Map<Address, string | null> - null means we tried but found no ENS name
const ensCache = new Map<Address, string | null>()

/**
 * Resolve a single ENS name for an address
 * Returns null if no ENS name is found
 * Results are cached in memory
 */
export async function resolveEnsName(address: Address): Promise<string | null> {
  // Check cache first
  if (ensCache.has(address)) {
    return ensCache.get(address)!
  }

  try {
    // Use viem's getEnsName for reverse resolution
    const ensName = await ensClient.getEnsName({
      address: address as `0x${string}`
    })

    // Cache the result (even if null)
    ensCache.set(address, ensName)

    return ensName
  } catch (error) {
    console.warn(`Failed to resolve ENS for ${address}:`, error)
    // Cache null to avoid repeated failures
    ensCache.set(address, null)
    return null
  }
}

/**
 * Resolve ENS names for multiple addresses in parallel
 * Returns a Map of addresses to their ENS names (or null)
 */
export async function resolveEnsNames(addresses: Address[]): Promise<Map<Address, string | null>> {
  const results = new Map<Address, string | null>()

  // Filter out duplicates
  const uniqueAddresses = [...new Set(addresses)]

  // Resolve all in parallel (viem will batch them automatically)
  await Promise.all(
    uniqueAddresses.map(async address => {
      const ensName = await resolveEnsName(address)
      results.set(address, ensName)
    })
  )

  return results
}

/**
 * Resolve ENS address from ENS name
 * Returns null if the name is invalid or doesn't resolve
 */
export async function resolveEnsAddress(name: string): Promise<Address | null> {
  try {
    const normalizedName = normalize(name)
    const address = await ensClient.getEnsAddress({
      name: normalizedName
    })

    return address
  } catch (error) {
    console.warn(`Failed to resolve ENS address for ${name}:`, error)
    return null
  }
}

/**
 * Clear the ENS cache (useful for testing or forcing refresh)
 */
export function clearEnsCache() {
  ensCache.clear()
}

/**
 * Get cache size for debugging
 */
export function getEnsCacheSize(): number {
  return ensCache.size
}
