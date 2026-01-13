// Re-export from @puppet/contracts - the source of truth for event definitions
export { CONTRACT_EVENT_MAP } from '@puppet/contracts/events'

import { CONTRACT_EVENT_MAP } from '@puppet/contracts/events'
import { decodeAbiParameters, type Hex } from 'viem'

// Creates lookup key from contract name and event hash (matches indexer pattern)
export const eventKey = (contractName: string, eventHash: string) => `${contractName}:${eventHash}`

export const EVENT_DECODER_MAP = {
  // Allocate.sol decoders
  [eventKey('Allocate', CONTRACT_EVENT_MAP.Allocate.Allocate.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Allocate.Allocate.args, data),

  // Registry.sol decoders
  [eventKey('Registry', CONTRACT_EVENT_MAP.Registry.CreateMaster.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Registry.CreateMaster.args, data),
  [eventKey('Registry', CONTRACT_EVENT_MAP.Registry.SetTokenCap.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Registry.SetTokenCap.args, data),

  // Match.sol decoders
  [eventKey('Match', CONTRACT_EVENT_MAP.Match.SetFilter.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Match.SetFilter.args, data),
  [eventKey('Match', CONTRACT_EVENT_MAP.Match.SetPolicy.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Match.SetPolicy.args, data),
  [eventKey('Match', CONTRACT_EVENT_MAP.Match.Throttle.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Match.Throttle.args, data),

  // Call.sol (Position) decoders
  [eventKey('Call', CONTRACT_EVENT_MAP.Call.MasterPreCall.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Call.MasterPreCall.args, data),
  [eventKey('Call', CONTRACT_EVENT_MAP.Call.MasterPostCall.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Call.MasterPostCall.args, data),
  [eventKey('Call', CONTRACT_EVENT_MAP.Call.SettleOrders.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Call.SettleOrders.args, data),
  [eventKey('Call', CONTRACT_EVENT_MAP.Call.SetStage.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Call.SetStage.args, data),

  // Withdraw.sol decoders
  [eventKey('Withdraw', CONTRACT_EVENT_MAP.Withdraw.Withdraw.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Withdraw.Withdraw.args, data),

  // TokenRouter.sol decoders
  [eventKey('TokenRouter', CONTRACT_EVENT_MAP.TokenRouter.Transfer.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.TokenRouter.Transfer.args, data),

  // FeeMarketplace.sol decoders
  [eventKey('FeeMarketplace', CONTRACT_EVENT_MAP.FeeMarketplace.Deposit.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.FeeMarketplace.Deposit.args, data),
  [eventKey('FeeMarketplace', CONTRACT_EVENT_MAP.FeeMarketplace.AcceptOffer.hash)]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.FeeMarketplace.AcceptOffer.args, data)
} as const
