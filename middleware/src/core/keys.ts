import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import type { Address } from 'abitype'
import { concat, encodePacked, getAddress, type Hex, keccak256, slice, toBytes } from 'viem'

// OpenZeppelin Clones creation code components (55 bytes total)
const CLONE_CREATION_PREFIX = '0x3d602d80600a3d3981f3' as const // 10 bytes
const CLONE_RUNTIME_PREFIX = '0x363d3d373d3d3d363d73' as const // 10 bytes
const CLONE_RUNTIME_SUFFIX = '0x5af43d82803e903d91602b57fd5bf3' as const // 15 bytes
const CLONE_BYTECODE_TYPES = ['bytes10', 'bytes10', 'address', 'bytes15'] as const

// CREATE2 prefix
const CREATE2_PREFIX = toBytes('0xff')

// Key encoding types
const TRADER_MATCHING_KEY_TYPES = ['address', 'address'] as const
const ALLOCATION_KEY_TYPES = ['address[]', 'bytes32', 'uint256'] as const

export function getTraderMatchingKey(collateralToken: Address, trader: Address) {
  return keccak256(encodePacked(TRADER_MATCHING_KEY_TYPES, [collateralToken, trader]))
}

export function getAllocationKey(puppetList: Address[], traderMatchingKey: Hex, allocationId: bigint) {
  return keccak256(
    encodePacked(ALLOCATION_KEY_TYPES, [puppetList, traderMatchingKey, allocationId])
  )
}

/**
 * Returns the initialization code hash of the clone of `implementation`.
 * Matches OpenZeppelin Clones.predictDeterministicAddress exactly.
 */
export function initCodeHash(implementation: Address): Hex {
  const bytecode = encodePacked(CLONE_BYTECODE_TYPES, [
    CLONE_CREATION_PREFIX,
    CLONE_RUNTIME_PREFIX,
    implementation,
    CLONE_RUNTIME_SUFFIX
  ])

  return keccak256(bytecode)
}

/**
 * Returns the address when a contract with initialization code hash is deployed with salt by deployer.
 * Uses CREATE2 formula: keccak256(0xff ++ deployer ++ salt ++ initCodeHash)[12:]
 * The deployer is the Account contract which calls Clones.cloneDeterministic.
 */
export function getAllocationAdderess(allocationStoreImplementationHash: Hex, allocationKey: Hex): Address {
  return getAddress(
    slice(
      keccak256(
        concat([CREATE2_PREFIX, PUPPET_CONTRACT_MAP.Account.address, allocationKey, allocationStoreImplementationHash])
      ),
      12
    )
  )
}
