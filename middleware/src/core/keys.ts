import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import type { Address } from 'abitype'
import { concat, encodePacked, getAddress, type Hex, keccak256, slice, toBytes } from 'viem'

export function getTraderMatchingKey(collateralToken: Address, trader: Address) {
  return keccak256(encodePacked(['address', 'address'], [collateralToken, trader]))
}

export function getAllocationKey(puppetList: Address[], traderMatchingKey: Hex, allocationId: bigint) {
  return keccak256(
    encodePacked(
      ['address[]', 'bytes32', 'uint256'], //
      [puppetList, traderMatchingKey, allocationId]
    )
  )
}

/**
 * Returns the initialization code hash of the clone of `implementation`. https://eips.ethereum.org/EIPS/eip-1167
 * This replicates the `initCodeHash`
 */
export function initCodeHash(implementation: Address): Hex {
  // EIP-1167 minimal proxy bytecode pattern
  // Standard EIP-1167 bytecode: 363d3d373d3d3d363d73[implementation]5af43d82803e903d91602b57fd5bf3
  // NOTE: This differs from the Solidity version which uses a custom proxy pattern

  const bytecode = encodePacked(
    ['bytes10', 'address', 'bytes15'],
    [
      '0x363d3d373d3d3d363d73', // First part of EIP-1167 bytecode
      implementation, // Implementation address (20 bytes)
      '0x5af43d82803e903d91602b57fd5bf3' // Last part of EIP-1167 bytecode
    ]
  )

  return keccak256(bytecode)
}

/**
 * Returns the address when a contract with initialization code hash is deployed with salt by deployer.
 * Uses viem's getContractAddress with CREATE2 opcode.
 */
export function getAllocationAdderess(allocationStoreImplementationHash: Hex, allocationKey: Hex): Address {
  return getAddress(
    slice(
      keccak256(
        concat([toBytes('0xff'), PUPPET_CONTRACT_MAP.Mirror.address, allocationKey, allocationStoreImplementationHash])
      ),
      12
    )
  )
}
