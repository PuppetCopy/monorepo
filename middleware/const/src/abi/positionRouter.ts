export default [{ "inputs": [{ "internalType": "contract IAuthority", "name": "_authority", "type": "address" }, { "internalType": "contract EventEmitter", "name": "_eventEmitter", "type": "address" }, { "internalType": "contract PositionStore", "name": "_positionStore", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "Auth_Unauthorized", "type": "error" }, { "inputs": [], "name": "InvalidShortString", "type": "error" }, { "inputs": [{ "internalType": "enum GmxPositionUtils.OrderType", "name": "orderType", "type": "uint8" }], "name": "PositionRouter__InvalidOrderType", "type": "error" }, { "inputs": [], "name": "ReentrancyGuardReentrantCall", "type": "error" }, { "inputs": [{ "internalType": "string", "name": "str", "type": "string" }], "name": "StringTooLong", "type": "error" }, { "anonymous": false, "inputs": [], "name": "EIP712DomainChanged", "type": "event" }, { "inputs": [{ "internalType": "bytes32", "name": "key", "type": "bytes32" }, { "components": [{ "components": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "receiver", "type": "address" }, { "internalType": "address", "name": "callbackContract", "type": "address" }, { "internalType": "address", "name": "uiFeeReceiver", "type": "address" }, { "internalType": "address", "name": "market", "type": "address" }, { "internalType": "contract IERC20", "name": "initialCollateralToken", "type": "address" }, { "internalType": "address[]", "name": "swapPath", "type": "address[]" }], "internalType": "struct GmxPositionUtils.Addresses", "name": "addresses", "type": "tuple" }, { "components": [{ "internalType": "enum GmxPositionUtils.OrderType", "name": "orderType", "type": "uint8" }, { "internalType": "enum GmxPositionUtils.DecreasePositionSwapType", "name": "decreasePositionSwapType", "type": "uint8" }, { "internalType": "uint256", "name": "initialCollateralDeltaAmount", "type": "uint256" }, { "internalType": "uint256", "name": "sizeDeltaUsd", "type": "uint256" }, { "internalType": "uint256", "name": "triggerPrice", "type": "uint256" }, { "internalType": "uint256", "name": "acceptablePrice", "type": "uint256" }, { "internalType": "uint256", "name": "executionFee", "type": "uint256" }, { "internalType": "uint256", "name": "callbackGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "minOutputAmount", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAtBlock", "type": "uint256" }], "internalType": "struct GmxPositionUtils.Numbers", "name": "numbers", "type": "tuple" }, { "components": [{ "internalType": "bool", "name": "isLong", "type": "bool" }, { "internalType": "bool", "name": "shouldUnwrapNativeToken", "type": "bool" }, { "internalType": "bool", "name": "isFrozen", "type": "bool" }], "internalType": "struct GmxPositionUtils.Flags", "name": "flags", "type": "tuple" }], "internalType": "struct GmxPositionUtils.Props", "name": "order", "type": "tuple" }, { "internalType": "bytes", "name": "eventData", "type": "bytes" }], "name": "afterOrderCancellation", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "key", "type": "bytes32" }, { "components": [{ "components": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "receiver", "type": "address" }, { "internalType": "address", "name": "callbackContract", "type": "address" }, { "internalType": "address", "name": "uiFeeReceiver", "type": "address" }, { "internalType": "address", "name": "market", "type": "address" }, { "internalType": "contract IERC20", "name": "initialCollateralToken", "type": "address" }, { "internalType": "address[]", "name": "swapPath", "type": "address[]" }], "internalType": "struct GmxPositionUtils.Addresses", "name": "addresses", "type": "tuple" }, { "components": [{ "internalType": "enum GmxPositionUtils.OrderType", "name": "orderType", "type": "uint8" }, { "internalType": "enum GmxPositionUtils.DecreasePositionSwapType", "name": "decreasePositionSwapType", "type": "uint8" }, { "internalType": "uint256", "name": "initialCollateralDeltaAmount", "type": "uint256" }, { "internalType": "uint256", "name": "sizeDeltaUsd", "type": "uint256" }, { "internalType": "uint256", "name": "triggerPrice", "type": "uint256" }, { "internalType": "uint256", "name": "acceptablePrice", "type": "uint256" }, { "internalType": "uint256", "name": "executionFee", "type": "uint256" }, { "internalType": "uint256", "name": "callbackGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "minOutputAmount", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAtBlock", "type": "uint256" }], "internalType": "struct GmxPositionUtils.Numbers", "name": "numbers", "type": "tuple" }, { "components": [{ "internalType": "bool", "name": "isLong", "type": "bool" }, { "internalType": "bool", "name": "shouldUnwrapNativeToken", "type": "bool" }, { "internalType": "bool", "name": "isFrozen", "type": "bool" }], "internalType": "struct GmxPositionUtils.Flags", "name": "flags", "type": "tuple" }], "internalType": "struct GmxPositionUtils.Props", "name": "order", "type": "tuple" }, { "internalType": "bytes", "name": "eventData", "type": "bytes" }], "name": "afterOrderExecution", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "key", "type": "bytes32" }, { "components": [{ "components": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "receiver", "type": "address" }, { "internalType": "address", "name": "callbackContract", "type": "address" }, { "internalType": "address", "name": "uiFeeReceiver", "type": "address" }, { "internalType": "address", "name": "market", "type": "address" }, { "internalType": "contract IERC20", "name": "initialCollateralToken", "type": "address" }, { "internalType": "address[]", "name": "swapPath", "type": "address[]" }], "internalType": "struct GmxPositionUtils.Addresses", "name": "addresses", "type": "tuple" }, { "components": [{ "internalType": "enum GmxPositionUtils.OrderType", "name": "orderType", "type": "uint8" }, { "internalType": "enum GmxPositionUtils.DecreasePositionSwapType", "name": "decreasePositionSwapType", "type": "uint8" }, { "internalType": "uint256", "name": "initialCollateralDeltaAmount", "type": "uint256" }, { "internalType": "uint256", "name": "sizeDeltaUsd", "type": "uint256" }, { "internalType": "uint256", "name": "triggerPrice", "type": "uint256" }, { "internalType": "uint256", "name": "acceptablePrice", "type": "uint256" }, { "internalType": "uint256", "name": "executionFee", "type": "uint256" }, { "internalType": "uint256", "name": "callbackGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "minOutputAmount", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAtBlock", "type": "uint256" }], "internalType": "struct GmxPositionUtils.Numbers", "name": "numbers", "type": "tuple" }, { "components": [{ "internalType": "bool", "name": "isLong", "type": "bool" }, { "internalType": "bool", "name": "shouldUnwrapNativeToken", "type": "bool" }, { "internalType": "bool", "name": "isFrozen", "type": "bool" }], "internalType": "struct GmxPositionUtils.Flags", "name": "flags", "type": "tuple" }], "internalType": "struct GmxPositionUtils.Props", "name": "order", "type": "tuple" }, { "internalType": "bytes", "name": "eventData", "type": "bytes" }], "name": "afterOrderFrozen", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "authority", "outputs": [{ "internalType": "contract IAuthority", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "signatureHash", "type": "bytes4" }, { "internalType": "address", "name": "user", "type": "address" }], "name": "canCall", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "eip712Domain", "outputs": [{ "internalType": "bytes1", "name": "fields", "type": "bytes1" }, { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "version", "type": "string" }, { "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "internalType": "address", "name": "verifyingContract", "type": "address" }, { "internalType": "bytes32", "name": "salt", "type": "bytes32" }, { "internalType": "uint256[]", "name": "extensions", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "key", "type": "bytes32" }], "name": "executeUnhandledExecutionCallback", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "functionSig", "type": "bytes4" }, { "internalType": "address", "name": "user", "type": "address" }], "name": "removePermission", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "contract ExecuteIncreasePositionLogic", "name": "executeIncrease", "type": "address" }, { "internalType": "contract ExecuteDecreasePositionLogic", "name": "executeDecrease", "type": "address" }, { "internalType": "contract ExecuteRevertedAdjustmentLogic", "name": "executeRevertedAdjustment", "type": "address" }], "internalType": "struct PositionRouter.Config", "name": "_config", "type": "tuple" }], "name": "setConfig", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "functionSig", "type": "bytes4" }, { "internalType": "address", "name": "user", "type": "address" }], "name": "setPermission", "outputs": [], "stateMutability": "nonpayable", "type": "function" }] as const