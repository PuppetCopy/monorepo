import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import {
  getEnableSessionsAction,
  getPermissionId,
  isSessionEnabled,
  type Session as ModuleSession
} from '@rhinestone/module-sdk'
import type { RhinestoneAccount } from '@rhinestone/sdk'
import type { Account, Address, Hex, PublicClient } from 'viem'
import { encodeAbiParameters, toFunctionSelector } from 'viem'

// Policy addresses from PUPPET_CONTRACT_MAP
export const PUPPET_POLICY_ADDRESSES = {
  AllowanceRatePolicy: PUPPET_CONTRACT_MAP.AllowanceRatePolicy.address,
  ThrottlePolicy: PUPPET_CONTRACT_MAP.ThrottlePolicy.address,
  AllowedRecipientPolicy: PUPPET_CONTRACT_MAP.AllowedRecipientPolicy.address
} as const

// ERC20 transfer function selector for action policies
const ERC20_TRANSFER_SELECTOR = toFunctionSelector('transfer(address,uint256)')

/**
 * Encode init data for AllowanceRatePolicy
 * @param allowanceRate - Rate in basis points (0-10000, e.g., 5000 = 50%)
 */
export function encodeAllowanceRateInitData(allowanceRate: number): Hex {
  if (allowanceRate < 0 || allowanceRate > 10000) {
    throw new Error('Allowance rate must be between 0 and 10000 basis points')
  }
  return encodeAbiParameters([{ type: 'uint16' }], [allowanceRate])
}

/**
 * Encode init data for ThrottlePolicy
 * @param throttlePeriod - Minimum time between transfers in seconds
 */
export function encodeThrottleInitData(throttlePeriod: number): Hex {
  if (throttlePeriod < 0) {
    throw new Error('Throttle period must be non-negative')
  }
  return encodeAbiParameters([{ type: 'uint32' }], [throttlePeriod])
}

/**
 * Encode init data for AllowedRecipientPolicy
 * @param recipients - Array of allowed recipient addresses
 */
export function encodeAllowedRecipientInitData(recipients: Address[]): Hex {
  return encodeAbiParameters([{ type: 'address[]' }], [recipients])
}

/**
 * Policy configuration for a puppet's subscription to a master
 */
export interface PuppetPolicyConfig {
  /** Allowance rate in basis points (0-10000) */
  allowanceRate: number
  /** Minimum time between transfers in seconds */
  throttlePeriod: number
  /** Allowed recipient addresses (e.g., master's address, exchange routers) */
  allowedRecipients: Address[]
  /** Collateral token address for the session action */
  collateralToken: Address
}

/**
 * Session owner configuration for ECDSA-based sessions
 */
export interface SessionOwner {
  type: 'ecdsa'
  accounts: Account[]
}

/**
 * Custom policy configuration
 */
interface CustomPolicy {
  type: 'custom'
  address: Address
  initData: Hex
}

/**
 * Session action configuration
 */
interface SessionAction {
  target: Address
  selector: Hex
  policies: CustomPolicy[]
}

/**
 * Session configuration
 */
export interface Session {
  owners: SessionOwner
  actions: SessionAction[]
}

/**
 * Create a session configuration for a puppet following a master
 * This session allows the session key to execute ERC20 transfers on behalf of the puppet
 * with the configured policy constraints.
 */
export function createPuppetSession(sessionOwner: SessionOwner, config: PuppetPolicyConfig): Session {
  // Create action policies for ERC20 transfer on the collateral token
  const actionPolicies: CustomPolicy[] = [
    {
      type: 'custom',
      address: PUPPET_POLICY_ADDRESSES.AllowanceRatePolicy,
      initData: encodeAllowanceRateInitData(config.allowanceRate)
    },
    {
      type: 'custom',
      address: PUPPET_POLICY_ADDRESSES.ThrottlePolicy,
      initData: encodeThrottleInitData(config.throttlePeriod)
    },
    {
      type: 'custom',
      address: PUPPET_POLICY_ADDRESSES.AllowedRecipientPolicy,
      initData: encodeAllowedRecipientInitData(config.allowedRecipients)
    }
  ]

  // Create the action for ERC20 transfer on the collateral token
  const action: SessionAction = {
    target: config.collateralToken,
    selector: ERC20_TRANSFER_SELECTOR,
    policies: actionPolicies
  }

  return {
    owners: sessionOwner,
    actions: [action]
  }
}

/**
 * Build the calldata for enabling a puppet's trading session
 * @returns The call data to enable the session on the smart account
 */
export function buildEnableSessionCall(
  sessionOwner: SessionOwner,
  config: PuppetPolicyConfig
): { to: Address; data: Hex } {
  const session = createPuppetSession(sessionOwner, config)
  const execution = getEnableSessionsAction({ sessions: [session as unknown as ModuleSession] })
  return { to: execution.target, data: execution.callData }
}

/**
 * Get the permission ID for a puppet session
 */
export function getPuppetSessionPermissionId(sessionOwner: SessionOwner, config: PuppetPolicyConfig): Hex {
  const session = createPuppetSession(sessionOwner, config)
  return getPermissionId({ session: session as unknown as ModuleSession })
}

/**
 * Check if a session is enabled for a given permission ID
 */
export async function checkSessionEnabled(
  client: PublicClient,
  accountAddress: Address,
  permissionId: Hex
): Promise<boolean> {
  return isSessionEnabled({ client, account: accountAddress, permissionId })
}

/**
 * Enable a puppet session using the Rhinestone account
 */
export async function enablePuppetSession(
  rhinestoneAccount: RhinestoneAccount,
  sessionOwner: SessionOwner,
  config: PuppetPolicyConfig,
  chain: any
): Promise<{ hashes: Hex[] }> {
  const enableCall = buildEnableSessionCall(sessionOwner, config)

  const result = await rhinestoneAccount.sendTransaction({
    chain,
    calls: [
      {
        to: enableCall.to,
        data: enableCall.data,
        value: 0n
      }
    ]
  })

  const receipt = await rhinestoneAccount.waitForExecution(result)
  const hashes = receipt.receipts.map(r => r.transactionHash)

  return { hashes }
}
