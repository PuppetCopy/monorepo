// Re-export from @puppet/contracts - the source of truth for event definitions
export { CONTRACT_EVENT_MAP } from '@puppet/contracts/events'

import { CONTRACT_EVENT_MAP } from '@puppet/contracts/events'
import { decodeAbiParameters, type Hex } from 'viem'

// Creates lookup key from contract name and event hash (matches indexer pattern)
export const eventKey = (contractName: string, eventHash: string) => `${contractName}:${eventHash}`

export const EVENT_DECODER_MAP = {
  // Account.sol decoders
  [eventKey('Account', CONTRACT_EVENT_MAP.Account.Deposit.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Account.Deposit.args, data),
  [eventKey('Account', CONTRACT_EVENT_MAP.Account.Withdraw.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Account.Withdraw.args, data),
  [eventKey('Account', CONTRACT_EVENT_MAP.Account.SetDepositCapList.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Account.SetDepositCapList.args, data),
  [eventKey('Account', CONTRACT_EVENT_MAP.Account.UnaccountedBalance.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Account.UnaccountedBalance.args, data),
  [eventKey('Account', CONTRACT_EVENT_MAP.Account.RecoverUnaccountedTokens.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Account.RecoverUnaccountedTokens.args, data),

  // Subscribe.sol decoders
  [eventKey('Subscribe', CONTRACT_EVENT_MAP.Subscribe.Rule.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Subscribe.Rule.args, data),

  // Allocation.sol decoders
  [eventKey('Allocation', CONTRACT_EVENT_MAP.Allocation.Allocate.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocation.Allocate.args, data),
  [eventKey('Allocation', CONTRACT_EVENT_MAP.Allocation.Utilize.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocation.Utilize.args, data),
  [eventKey('Allocation', CONTRACT_EVENT_MAP.Allocation.Settle.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocation.Settle.args, data),
  [eventKey('Allocation', CONTRACT_EVENT_MAP.Allocation.Realize.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocation.Realize.args, data),
  [eventKey('Allocation', CONTRACT_EVENT_MAP.Allocation.Withdraw.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocation.Withdraw.args, data),

  // FeeMarketplace.sol decoders
  [eventKey('FeeMarketplace', CONTRACT_EVENT_MAP.FeeMarketplace.Deposit.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.FeeMarketplace.Deposit.args, data),
  [eventKey('FeeMarketplace', CONTRACT_EVENT_MAP.FeeMarketplace.AcceptOffer.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.FeeMarketplace.AcceptOffer.args, data),

  // RewardDistributor.sol decoders
  [eventKey('RewardDistributor', CONTRACT_EVENT_MAP.RewardDistributor.Deposit.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.RewardDistributor.Deposit.args, data),
  [eventKey('RewardDistributor', CONTRACT_EVENT_MAP.RewardDistributor.Distribute.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.RewardDistributor.Distribute.args, data),
  [eventKey('RewardDistributor', CONTRACT_EVENT_MAP.RewardDistributor.Claim.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.RewardDistributor.Claim.args, data)
} as const
