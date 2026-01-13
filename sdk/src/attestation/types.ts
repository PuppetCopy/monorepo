import type { Address, Hex } from 'viem'

export interface AllocateAttestationData {
  master: Address
  sharePrice: bigint
  masterAmount: bigint
  puppetListHash: Hex
  amountListHash: Hex
  blockNumber: bigint
  blockTimestamp: bigint
  nonce: bigint
  deadline: bigint
}

export interface AllocateAttestation extends AllocateAttestationData {
  signature: Hex
}

// ============ Withdraw Intent Model ============

/**
 * User's withdrawal intent - commits to burning shares with slippage protection
 * User signs this to create the commitment
 */
export interface WithdrawIntent {
  user: Address
  master: Address
  token: Address
  shares: bigint // shares to burn
  acceptableSharePrice: bigint // min share price user will accept
  minAmountOut: bigint // slippage protection on output amount
  nonce: bigint // user-controlled nonce
  deadline: bigint // intent expiry
}

/**
 * Attestor's validation - confirms intent and provides current price
 * Attestor signs this after validating user has shares and calculating amount from NAV
 */
export interface WithdrawAttestation {
  user: Address // must match intent
  master: Address // must match intent
  token: Address // must match intent
  shares: bigint // must match intent
  sharePrice: bigint // current NAV-based share price
  blockNumber: bigint // liveness: block number when attested
  blockTimestamp: bigint // liveness: block timestamp when attested
  nonce: bigint // must match intent
  deadline: bigint // attestation expiry
}

/**
 * Complete signed withdrawal ready for execution
 */
export interface SignedWithdraw {
  intent: WithdrawIntent
  attestation: WithdrawAttestation
  intentSignature: Hex
  attestationSignature: Hex
}
