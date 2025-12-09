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

  // Rule.sol decoders
  [CONTRACT_EVENT_MAP.Rule.SetMatchingRule.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Rule.SetMatchingRule.args, data),

  // Mirror.sol decoders
  [CONTRACT_EVENT_MAP.Mirror.RequestOpen.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Mirror.RequestOpen.args, data),
  [CONTRACT_EVENT_MAP.Mirror.RequestAdjust.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Mirror.RequestAdjust.args, data),
  [CONTRACT_EVENT_MAP.Mirror.RequestCloseStalled.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Mirror.RequestCloseStalled.args, data),
  [CONTRACT_EVENT_MAP.Mirror.Execute.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Mirror.Execute.args, data),
  [CONTRACT_EVENT_MAP.Mirror.Liquidate.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Mirror.Liquidate.args, data),

  // Settle.sol decoders
  [CONTRACT_EVENT_MAP.Settle.Settle.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Settle.Settle.args, data),
  [CONTRACT_EVENT_MAP.Settle.CollectAllocationAccountDust.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Settle.CollectAllocationAccountDust.args, data),
  [CONTRACT_EVENT_MAP.Settle.CollectPlatformFees.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Settle.CollectPlatformFees.args, data),
  [CONTRACT_EVENT_MAP.Settle.SetTokenDustThreshold.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.Settle.SetTokenDustThreshold.args, data),

  // SequencerRouter.sol decoders
  [CONTRACT_EVENT_MAP.SequencerRouter.RefundExecutionFee.hash]: (data: Hex) =>
    decodeAbiParameters(CONTRACT_EVENT_MAP.SequencerRouter.RefundExecutionFee.args, data)
} as const
