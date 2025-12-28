// Re-export from @puppet/contracts - the source of truth for event definitions
export { CONTRACT_EVENT_MAP } from '@puppet/contracts/events'

import { CONTRACT_EVENT_MAP } from '@puppet/contracts/events'
import { decodeAbiParameters, type Hex } from 'viem'

// Creates lookup key from contract name and event hash (matches indexer pattern)
export const eventKey = (contractName: string, eventHash: string) => `${contractName}:${eventHash}`

export const EVENT_DECODER_MAP = {
  // Allocation.sol decoders
  [eventKey('Allocation', CONTRACT_EVENT_MAP.Allocation.CreateSubaccount.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocation.CreateSubaccount.args, data),
  [eventKey('Allocation', CONTRACT_EVENT_MAP.Allocation.ExecuteMasterDeposit.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocation.ExecuteMasterDeposit.args, data),
  [eventKey('Allocation', CONTRACT_EVENT_MAP.Allocation.ExecuteAllocate.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocation.ExecuteAllocate.args, data),
  [eventKey('Allocation', CONTRACT_EVENT_MAP.Allocation.ExecuteAllocateFailed.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocation.ExecuteAllocateFailed.args, data),
  [eventKey('Allocation', CONTRACT_EVENT_MAP.Allocation.ExecuteWithdraw.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocation.ExecuteWithdraw.args, data),
  [eventKey('Allocation', CONTRACT_EVENT_MAP.Allocation.ExecuteOrder.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocation.ExecuteOrder.args, data),

  // FeeMarketplace.sol decoders
  [eventKey('FeeMarketplace', CONTRACT_EVENT_MAP.FeeMarketplace.Deposit.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.FeeMarketplace.Deposit.args, data),
  [eventKey('FeeMarketplace', CONTRACT_EVENT_MAP.FeeMarketplace.AcceptOffer.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.FeeMarketplace.AcceptOffer.args, data)
} as const
