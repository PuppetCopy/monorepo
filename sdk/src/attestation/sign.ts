import type { Address, Hex, TypedDataDomain } from 'viem'
import { concat, keccak256, toHex } from 'viem'
import { signTypedData } from 'viem/accounts'
import type {
  AllocateAttestation,
  AllocateAttestationData,
  SignedWithdraw,
  WithdrawAttestation,
  WithdrawIntent
} from './types.js'

// Hash a list of puppet addresses - matches Solidity's keccak256(abi.encodePacked(puppetList))
export function hashPuppetList(puppetList: Address[]): Hex {
  return keccak256(concat(puppetList))
}

// Hash a list of amounts - matches Solidity's keccak256(abi.encodePacked(amountList))
export function hashAmountList(amountList: bigint[]): Hex {
  return keccak256(concat(amountList.map(a => toHex(a, { size: 32 }))))
}

export interface SignerConfig {
  privateKey: Hex
  allocateAddress: Address
  chainId: number
}

function getAllocateDomain(allocateAddress: Address, chainId: number): TypedDataDomain {
  return { name: 'Puppet Allocate', version: '1', chainId, verifyingContract: allocateAddress }
}

// Sign an AllocateAttestation with a private key
export async function signAllocateAttestation(
  config: SignerConfig,
  data: Omit<AllocateAttestationData, 'puppetListHash' | 'amountListHash'> & {
    puppetList: Address[]
    amountList: bigint[]
  }
): Promise<AllocateAttestation> {
  const puppetListHash = hashPuppetList(data.puppetList)
  const amountListHash = hashAmountList(data.amountList)

  const attestationData: AllocateAttestationData = {
    master: data.master,
    sharePrice: data.sharePrice,
    masterAmount: data.masterAmount,
    puppetListHash,
    amountListHash,
    blockNumber: data.blockNumber,
    blockTimestamp: data.blockTimestamp,
    nonce: data.nonce,
    deadline: data.deadline
  }

  const signature = await signTypedData({
    privateKey: config.privateKey,
    domain: getAllocateDomain(config.allocateAddress, config.chainId),
    types: {
      AllocateAttestation: [
        { name: 'master', type: 'address' },
        { name: 'sharePrice', type: 'uint256' },
        { name: 'masterAmount', type: 'uint256' },
        { name: 'puppetListHash', type: 'bytes32' },
        { name: 'amountListHash', type: 'bytes32' },
        { name: 'blockNumber', type: 'uint256' },
        { name: 'blockTimestamp', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' }
      ]
    },
    primaryType: 'AllocateAttestation',
    message: attestationData
  })

  return { ...attestationData, signature }
}

// Calculate share price from NAV components
// sharePrice = (cashBalance + positionValue) * 1e18 / totalShares
export function calculateSharePrice(cashBalance: bigint, positionValue: bigint, totalShares: bigint): bigint {
  if (totalShares === 0n) {
    // Initial price: 1:1 (1e18 precision)
    return 10n ** 18n
  }
  const totalValue = cashBalance + positionValue
  return (totalValue * 10n ** 18n) / totalShares
}

// Convert amount to shares using share price
// shares = amount * 1e18 / sharePrice
export function toShares(amount: bigint, sharePrice: bigint): bigint {
  return (amount * 10n ** 18n) / sharePrice
}

// Convert shares to amount using share price
// amount = shares * sharePrice / 1e18
export function toAmount(shares: bigint, sharePrice: bigint): bigint {
  return (shares * sharePrice) / 10n ** 18n
}

// ============ Withdraw Intent Model ============

export interface WithdrawSignerConfig {
  privateKey: Hex
  withdrawAddress: Address
  chainId: number // execution chain - signatures bind to this chain
}

const INTENT_TYPES = {
  WithdrawIntent: [
    { name: 'user', type: 'address' },
    { name: 'master', type: 'address' },
    { name: 'token', type: 'address' },
    { name: 'shares', type: 'uint256' },
    { name: 'acceptableSharePrice', type: 'uint256' },
    { name: 'minAmountOut', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' }
  ]
} as const

const ATTESTATION_TYPES = {
  WithdrawAttestation: [
    { name: 'user', type: 'address' },
    { name: 'master', type: 'address' },
    { name: 'token', type: 'address' },
    { name: 'shares', type: 'uint256' },
    { name: 'sharePrice', type: 'uint256' },
    { name: 'blockNumber', type: 'uint256' },
    { name: 'blockTimestamp', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' }
  ]
} as const

function getWithdrawDomain(withdrawAddress: Address, chainId: number): TypedDataDomain {
  return { name: 'Puppet Withdraw', version: '1', chainId, verifyingContract: withdrawAddress }
}

/**
 * Sign a withdrawal intent as user
 * User commits to burning shares with slippage protection
 */
export async function signWithdrawIntent(config: WithdrawSignerConfig, intent: WithdrawIntent): Promise<Hex> {
  return signTypedData({
    privateKey: config.privateKey,
    domain: getWithdrawDomain(config.withdrawAddress, config.chainId),
    types: INTENT_TYPES,
    primaryType: 'WithdrawIntent',
    message: intent
  })
}

/**
 * Sign a withdrawal attestation as attestor
 * Attestor validates intent and provides current price
 */
export async function signWithdrawAttestation(
  config: WithdrawSignerConfig,
  attestation: WithdrawAttestation
): Promise<Hex> {
  return signTypedData({
    privateKey: config.privateKey,
    domain: getWithdrawDomain(config.withdrawAddress, config.chainId),
    types: ATTESTATION_TYPES,
    primaryType: 'WithdrawAttestation',
    message: attestation
  })
}

/**
 * Create attestation from intent + current share price + liveness data
 * Attestor calls this to validate and price the withdrawal
 */
export function createWithdrawAttestation(
  intent: WithdrawIntent,
  sharePrice: bigint,
  blockNumber: bigint,
  blockTimestamp: bigint,
  attestationDeadline: bigint
): WithdrawAttestation {
  return {
    user: intent.user,
    master: intent.master,
    token: intent.token,
    shares: intent.shares,
    sharePrice,
    blockNumber,
    blockTimestamp,
    nonce: intent.nonce,
    deadline: attestationDeadline
  }
}

/**
 * Create a fully signed withdrawal ready for execution
 * Combines user intent signature with attestor validation
 */
export async function createSignedWithdraw(
  userConfig: WithdrawSignerConfig,
  attestorConfig: WithdrawSignerConfig,
  intent: WithdrawIntent,
  sharePrice: bigint,
  blockNumber: bigint,
  blockTimestamp: bigint,
  attestationDeadline: bigint
): Promise<SignedWithdraw> {
  const attestation = createWithdrawAttestation(intent, sharePrice, blockNumber, blockTimestamp, attestationDeadline)

  const [intentSignature, attestationSignature] = await Promise.all([
    signWithdrawIntent(userConfig, intent),
    signWithdrawAttestation(attestorConfig, attestation)
  ])

  return { intent, attestation, intentSignature, attestationSignature }
}
