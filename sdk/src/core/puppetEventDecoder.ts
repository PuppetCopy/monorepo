// Re-export from @puppet/contracts - the source of truth for event definitions
export { CONTRACT_EVENT_MAP } from '@puppet/contracts/events'

import { CONTRACT_EVENT_MAP } from '@puppet/contracts/events'
import { decodeAbiParameters, type Hex } from 'viem'

// Creates lookup key from contract name and event hash (matches indexer pattern)
export const eventKey = (contractName: string, eventHash: string) => `${contractName}:${eventHash}`

export const EVENT_DECODER_MAP = {
  // Allocate.sol decoders
  [eventKey('Allocate', CONTRACT_EVENT_MAP.Allocate.RegisterMasterSubaccount.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocate.RegisterMasterSubaccount.args, data),
  [eventKey('Allocate', CONTRACT_EVENT_MAP.Allocate.ExecuteAllocate.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocate.ExecuteAllocate.args, data),
  [eventKey('Allocate', CONTRACT_EVENT_MAP.Allocate.ExecuteWithdraw.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocate.ExecuteWithdraw.args, data),
  [eventKey('Allocate', CONTRACT_EVENT_MAP.Allocate.DisposeSubaccount.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocate.DisposeSubaccount.args, data),

  // Match.sol decoders
  [eventKey('Match', CONTRACT_EVENT_MAP.Match.SetFilter.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Match.SetFilter.args, data),
  [eventKey('Match', CONTRACT_EVENT_MAP.Match.SetPolicy.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Match.SetPolicy.args, data),

  // Position.sol decoders
  [eventKey('Position', CONTRACT_EVENT_MAP.Position.CreateOrder.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Position.CreateOrder.args, data),
  [eventKey('Position', CONTRACT_EVENT_MAP.Position.SettleOrders.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Position.SettleOrders.args, data),

  // FeeMarketplace.sol decoders
  [eventKey('FeeMarketplace', CONTRACT_EVENT_MAP.FeeMarketplace.Deposit.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.FeeMarketplace.Deposit.args, data),
  [eventKey('FeeMarketplace', CONTRACT_EVENT_MAP.FeeMarketplace.AcceptOffer.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.FeeMarketplace.AcceptOffer.args, data)
} as const
