import { decodeAbiParameters, type Hex, keccak256, parseAbiParameters, toHex } from 'viem'

// Event method hashes
export const METHOD_HASHES_MAP = {
  // MatchingRule.sol
  Deposit: keccak256(toHex('Deposit')),
  Withdraw: keccak256(toHex('Withdraw')),
  SetMatchingRule: keccak256(toHex('SetMatchingRule')),

  // MirrorPosition.sol
  RequestOpen: keccak256(toHex('RequestOpen')),
  RequestAdjust: keccak256(toHex('RequestAdjust')),
  RequestCloseStalledPosition: keccak256(toHex('RequestCloseStalledPosition')),
  Execute: keccak256(toHex('Execute')),
  Liquidate: keccak256(toHex('Liquidate')),
  Settle: keccak256(toHex('Settle')),
  CollectDust: keccak256(toHex('CollectDust')),
  SetTokenDustThreshold: keccak256(toHex('SetTokenDustThreshold')),
  StoreUnhandledCallback: keccak256(toHex('StoreUnhandledCallback')),

  // Note: CreateAllocation and UpdateAllocationForKeeperFee events removed since Allocate.sol merged into MirrorPosition

  // Settle.sol
  CollectFees: keccak256(toHex('CollectFees')),

  // KeeperRouter.sol
  RefundExecutionFee: keccak256(toHex('RefundExecutionFee'))
} as const

export const EVENT_PARAMS_MAP = {
  Deposit: parseAbiParameters('address, address, address, uint, uint'),
  Withdraw: parseAbiParameters('address, address, address, uint, uint'),
  SetMatchingRule: parseAbiParameters('address, bytes32, address, address, (uint256, uint256, uint256)'),
  RequestOpen: parseAbiParameters(
    '(address, bytes32, address, address, bool, bool, uint256, uint256, uint256, uint256, uint256, uint256, uint256, address), address[], bytes32, address, uint256, uint256, bytes32, uint256, uint256[]'
  ),
  RequestAdjust: parseAbiParameters(
    '(address, bytes32, address, address, bool, bool, uint256, uint256, uint256, uint256, uint256, uint256, uint256, address), bytes32, address, uint256, uint256, uint256, bytes32, uint256, uint256[]'
  ),
  RequestCloseStalledPosition: parseAbiParameters(
    '(address, bytes32, address, address, bool, bool, uint256, uint256, uint256, uint256, uint256, uint256, uint256, address), address, uint256, bytes32, bytes32'
  ),
  Execute: parseAbiParameters('address, bytes32, uint256, uint256, uint256, uint256'),
  Liquidate: parseAbiParameters('address'),
  Settle: parseAbiParameters(
    '(address, address, address, address, uint256, uint256), bytes32, address, uint256, uint256, uint256, uint256[]'
  ),
  CollectDust: parseAbiParameters('address, address, address, uint256'),
  SetTokenDustThreshold: parseAbiParameters('address[], uint256[]'),
  // Note: CreateAllocation and UpdateAllocationForKeeperFee removed since Allocate.sol merged into MirrorPosition
  CollectFees: parseAbiParameters('address, address, uint256'),
  StoreUnhandledCallback: parseAbiParameters('uint256, bytes, bytes32'),
  RefundExecutionFee: parseAbiParameters('bytes32, uint256')
} as const

export const EVENT_DECODER_MAP = {
  [METHOD_HASHES_MAP.Deposit]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.Deposit, data),
  [METHOD_HASHES_MAP.Withdraw]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.Withdraw, data),
  [METHOD_HASHES_MAP.SetMatchingRule]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.SetMatchingRule, data),
  [METHOD_HASHES_MAP.RequestOpen]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.RequestOpen, data),
  [METHOD_HASHES_MAP.RequestAdjust]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.RequestAdjust, data),
  [METHOD_HASHES_MAP.RequestCloseStalledPosition]: (data: Hex) =>
    decodeAbiParameters(EVENT_PARAMS_MAP.RequestCloseStalledPosition, data),
  [METHOD_HASHES_MAP.Execute]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.Execute, data),
  [METHOD_HASHES_MAP.Liquidate]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.Liquidate, data),
  [METHOD_HASHES_MAP.Settle]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.Settle, data),
  [METHOD_HASHES_MAP.CollectDust]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.CollectDust, data),
  [METHOD_HASHES_MAP.SetTokenDustThreshold]: (data: Hex) =>
    decodeAbiParameters(EVENT_PARAMS_MAP.SetTokenDustThreshold, data),
  // Note: CreateAllocation and UpdateAllocationForKeeperFee decoders removed since Allocate.sol merged into MirrorPosition
  [METHOD_HASHES_MAP.CollectFees]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.CollectFees, data),
  [METHOD_HASHES_MAP.StoreUnhandledCallback]: (data: Hex) =>
    decodeAbiParameters(EVENT_PARAMS_MAP.StoreUnhandledCallback, data),
  [METHOD_HASHES_MAP.RefundExecutionFee]: (data: Hex) => decodeAbiParameters(EVENT_PARAMS_MAP.RefundExecutionFee, data)
} as const
