import { decodeAbiParameters, type Hex, keccak256, parseAbiParameters, toHex } from 'viem'

// Event method hashes
export const METHOD_HASHES_MAP = {
  // Account.sol
  Deposit: keccak256(toHex('Deposit')),
  Withdraw: keccak256(toHex('Withdraw')),
  SetDepositCapList: keccak256(toHex('SetDepositCapList')),

  // Rule.sol
  SetMatchingRule: keccak256(toHex('SetMatchingRule')),

  // Mirror.sol
  RequestOpen: keccak256(toHex('RequestOpen')),
  RequestAdjust: keccak256(toHex('RequestAdjust')),
  RequestCloseStalledPosition: keccak256(toHex('RequestCloseStalledPosition')),
  Execute: keccak256(toHex('Execute')),
  Liquidate: keccak256(toHex('Liquidate')),

  // Settle.sol
  Settle: keccak256(toHex('Settle')),
  CollectAllocationAccountDust: keccak256(toHex('CollectAllocationAccountDust')),
  CollectPlatformFees: keccak256(toHex('CollectPlatformFees')),
  SetTokenDustThreshold: keccak256(toHex('SetTokenDustThreshold')),

  // KeeperRouter.sol
  RefundExecutionFee: keccak256(toHex('RefundExecutionFee'))
} as const

export const EVENT_PARAMS_MAP = {
  // Account.sol events
  Deposit: parseAbiParameters('address, address, address, uint256, uint256'),
  Withdraw: parseAbiParameters('address, address, address, uint256, uint256'),
  SetDepositCapList: parseAbiParameters('address[], uint256[]'),

  // Rule.sol events
  SetMatchingRule: parseAbiParameters('(uint256, uint256, uint256), address, address, address, bytes32'),

  // Mirror.sol events
  RequestOpen: parseAbiParameters(
    '(address, bytes32, address, address, address, bool, bool, uint256, uint256, uint256, uint256, uint256, uint256, uint256), address, bytes32, bytes32, bytes32, uint256, uint256, uint256, uint256[], address[]'
  ),
  RequestAdjust: parseAbiParameters(
    '(address, bytes32, address, address, address, bool, bool, uint256, uint256, uint256, uint256, uint256, uint256, uint256), address, bytes32, bytes32, bytes32, bool, uint256, uint256, uint256, uint256, uint256[]'
  ),
  RequestCloseStalledPosition: parseAbiParameters(
    '(address, address, address, bool, uint256, uint256, uint256), address, bytes32, bytes32'
  ),
  Execute: parseAbiParameters('address, bytes32, bool, bool, uint256, uint256, uint256'),
  Liquidate: parseAbiParameters('address'),

  // Settle.sol events
  Settle: parseAbiParameters(
    '(address, address, address, address, uint256, uint256), address, bytes32, uint256, uint256, uint256, uint256[]'
  ),
  CollectAllocationAccountDust: parseAbiParameters('address, address, address, uint256, uint256'),
  CollectPlatformFees: parseAbiParameters('address, address, uint256'),
  SetTokenDustThreshold: parseAbiParameters('address[], uint256[]'),

  // KeeperRouter.sol events
  RefundExecutionFee: parseAbiParameters('bytes32, uint256')
} as const

export const EVENT_DECODER_MAP = {
  // Account.sol decoders
  [METHOD_HASHES_MAP.Deposit]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.Deposit, data),
  [METHOD_HASHES_MAP.Withdraw]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.Withdraw, data),
  [METHOD_HASHES_MAP.SetDepositCapList]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.SetDepositCapList, data),

  // Rule.sol decoders
  [METHOD_HASHES_MAP.SetMatchingRule]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.SetMatchingRule, data),

  // Mirror.sol decoders
  [METHOD_HASHES_MAP.RequestOpen]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.RequestOpen, data),
  [METHOD_HASHES_MAP.RequestAdjust]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.RequestAdjust, data),
  [METHOD_HASHES_MAP.RequestCloseStalledPosition]: (data: Hex) =>
    decodeAbiParameters(EVENT_PARAMS_MAP.RequestCloseStalledPosition, data),
  [METHOD_HASHES_MAP.Execute]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.Execute, data),
  [METHOD_HASHES_MAP.Liquidate]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.Liquidate, data),

  // Settle.sol decoders
  [METHOD_HASHES_MAP.Settle]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.Settle, data),
  [METHOD_HASHES_MAP.CollectAllocationAccountDust]: (data: Hex) =>
    decodeAbiParameters(EVENT_PARAMS_MAP.CollectAllocationAccountDust, data),
  [METHOD_HASHES_MAP.CollectPlatformFees]: (data: Hex) =>
    decodeAbiParameters(EVENT_PARAMS_MAP.CollectPlatformFees, data),
  [METHOD_HASHES_MAP.SetTokenDustThreshold]: (data: Hex) =>
    decodeAbiParameters(EVENT_PARAMS_MAP.SetTokenDustThreshold, data),

  // KeeperRouter.sol decoders
  [METHOD_HASHES_MAP.RefundExecutionFee]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.RefundExecutionFee, data)
} as const
