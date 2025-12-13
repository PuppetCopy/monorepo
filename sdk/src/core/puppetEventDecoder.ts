// Re-export from @puppet/contracts - the source of truth for event definitions
export { CONTRACT_EVENT_MAP } from '@puppet/contracts/events'

import { CONTRACT_EVENT_MAP } from '@puppet/contracts/events'
import { decodeAbiParameters, type Hex } from 'viem'

export const EVENT_DECODER_MAP = {
  // Account.sol decoders
  [CONTRACT_EVENT_MAP.Account.Deposit.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Account.Deposit.args, data),
  [CONTRACT_EVENT_MAP.Account.Withdraw.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Account.Withdraw.args, data),
  [CONTRACT_EVENT_MAP.Account.SetDepositCapList.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Account.SetDepositCapList.args, data),
  [CONTRACT_EVENT_MAP.Account.UnaccountedBalance.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Account.UnaccountedBalance.args, data),
  [CONTRACT_EVENT_MAP.Account.RecoverUnaccountedTokens.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Account.RecoverUnaccountedTokens.args, data),

  // Rule.sol decoders
  [CONTRACT_EVENT_MAP.Subscribe.Rule.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Subscribe.Rule.args, data),

  // Mirror.sol decoders
  [CONTRACT_EVENT_MAP.Mirror.Match.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Mirror.Match.args, data),
  [CONTRACT_EVENT_MAP.Mirror.Adjust.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Mirror.Adjust.args, data),
  [CONTRACT_EVENT_MAP.Mirror.Close.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Mirror.Close.args, data),

  // Settle.sol decoders
  [CONTRACT_EVENT_MAP.Settle.Settle.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Settle.Settle.args, data),
  [CONTRACT_EVENT_MAP.Settle.CollectAllocationAccountDust.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Settle.CollectAllocationAccountDust.args, data),
  [CONTRACT_EVENT_MAP.Settle.CollectPlatformFees.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Settle.CollectPlatformFees.args, data),
  [CONTRACT_EVENT_MAP.Settle.SetTokenDustThreshold.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Settle.SetTokenDustThreshold.args, data)
} as const
