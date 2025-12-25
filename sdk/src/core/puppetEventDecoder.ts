// Re-export from @puppet/contracts - the source of truth for event definitions
export { CONTRACT_EVENT_MAP } from '@puppet/contracts/events'

import { CONTRACT_EVENT_MAP } from '@puppet/contracts/events'
import { decodeAbiParameters, type Hex } from 'viem'

// Creates lookup key from contract name and event hash (matches indexer pattern)
export const eventKey = (contractName: string, eventHash: string) => `${contractName}:${eventHash}`

export const EVENT_DECODER_MAP = {
  // Allocation.sol decoders
  [eventKey('Allocation', CONTRACT_EVENT_MAP.Allocation.Action.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocation.Action.args, data),
  [eventKey('Allocation', CONTRACT_EVENT_MAP.Allocation.Allocate.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocation.Allocate.args, data),
  [eventKey('Allocation', CONTRACT_EVENT_MAP.Allocation.Settle.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocation.Settle.args, data),
  [eventKey('Allocation', CONTRACT_EVENT_MAP.Allocation.Withdraw.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocation.Withdraw.args, data),

  // FeeMarketplace.sol decoders
  [eventKey('FeeMarketplace', CONTRACT_EVENT_MAP.FeeMarketplace.Deposit.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.FeeMarketplace.Deposit.args, data),
  [eventKey('FeeMarketplace', CONTRACT_EVENT_MAP.FeeMarketplace.AcceptOffer.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.FeeMarketplace.AcceptOffer.args, data)
} as const
