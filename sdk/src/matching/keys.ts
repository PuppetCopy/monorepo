import type { Address, Hex } from 'viem'
import { encodeAbiParameters, keccak256, zeroAddress } from 'viem'

const KEY_PARAMS = [{ type: 'uint8' }, { type: 'address' }, { type: 'address' }] as const

/** Derive subscription key for a specific master */
export const deriveSpecificKey = (version: number, token: Address, master: Address): Hex =>
  keccak256(encodeAbiParameters(KEY_PARAMS, [version, token, master]))

/** Derive wildcard subscription key (any master) */
export const deriveWildcardKey = (version: number, token: Address): Hex =>
  keccak256(encodeAbiParameters(KEY_PARAMS, [version, token, zeroAddress]))
