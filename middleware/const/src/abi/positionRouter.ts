export default [
  {
    type: "constructor",
    inputs: [
      {
        name: "_authority",
        type: "address",
        internalType: "contract IAuthority",
      },
      {
        name: "_positionStore",
        type: "address",
        internalType: "contract MirrorPositionStore",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "afterOrderCancellation",
    inputs: [
      { name: "key", type: "bytes32", internalType: "bytes32" },
      {
        name: "order",
        type: "tuple",
        internalType: "struct GmxPositionUtils.Props",
        components: [
          {
            name: "addresses",
            type: "tuple",
            internalType: "struct GmxPositionUtils.Addresses",
            components: [
              { name: "account", type: "address", internalType: "address" },
              { name: "receiver", type: "address", internalType: "address" },
              {
                name: "callbackContract",
                type: "address",
                internalType: "address",
              },
              {
                name: "uiFeeReceiver",
                type: "address",
                internalType: "address",
              },
              { name: "market", type: "address", internalType: "address" },
              {
                name: "initialCollateralToken",
                type: "address",
                internalType: "contract IERC20",
              },
              {
                name: "swapPath",
                type: "address[]",
                internalType: "address[]",
              },
            ],
          },
          {
            name: "numbers",
            type: "tuple",
            internalType: "struct GmxPositionUtils.Numbers",
            components: [
              {
                name: "orderType",
                type: "uint8",
                internalType: "enum GmxPositionUtils.OrderType",
              },
              {
                name: "decreasePositionSwapType",
                type: "uint8",
                internalType: "enum GmxPositionUtils.DecreasePositionSwapType",
              },
              {
                name: "initialCollateralDeltaAmount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "sizeDeltaUsd",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "triggerPrice",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "acceptablePrice",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "executionFee",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "callbackGasLimit",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "minOutputAmount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "updatedAtBlock",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            name: "flags",
            type: "tuple",
            internalType: "struct GmxPositionUtils.Flags",
            components: [
              { name: "isLong", type: "bool", internalType: "bool" },
              {
                name: "shouldUnwrapNativeToken",
                type: "bool",
                internalType: "bool",
              },
              { name: "isFrozen", type: "bool", internalType: "bool" },
            ],
          },
        ],
      },
      { name: "eventData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "afterOrderExecution",
    inputs: [
      { name: "key", type: "bytes32", internalType: "bytes32" },
      {
        name: "order",
        type: "tuple",
        internalType: "struct GmxPositionUtils.Props",
        components: [
          {
            name: "addresses",
            type: "tuple",
            internalType: "struct GmxPositionUtils.Addresses",
            components: [
              { name: "account", type: "address", internalType: "address" },
              { name: "receiver", type: "address", internalType: "address" },
              {
                name: "callbackContract",
                type: "address",
                internalType: "address",
              },
              {
                name: "uiFeeReceiver",
                type: "address",
                internalType: "address",
              },
              { name: "market", type: "address", internalType: "address" },
              {
                name: "initialCollateralToken",
                type: "address",
                internalType: "contract IERC20",
              },
              {
                name: "swapPath",
                type: "address[]",
                internalType: "address[]",
              },
            ],
          },
          {
            name: "numbers",
            type: "tuple",
            internalType: "struct GmxPositionUtils.Numbers",
            components: [
              {
                name: "orderType",
                type: "uint8",
                internalType: "enum GmxPositionUtils.OrderType",
              },
              {
                name: "decreasePositionSwapType",
                type: "uint8",
                internalType: "enum GmxPositionUtils.DecreasePositionSwapType",
              },
              {
                name: "initialCollateralDeltaAmount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "sizeDeltaUsd",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "triggerPrice",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "acceptablePrice",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "executionFee",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "callbackGasLimit",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "minOutputAmount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "updatedAtBlock",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            name: "flags",
            type: "tuple",
            internalType: "struct GmxPositionUtils.Flags",
            components: [
              { name: "isLong", type: "bool", internalType: "bool" },
              {
                name: "shouldUnwrapNativeToken",
                type: "bool",
                internalType: "bool",
              },
              { name: "isFrozen", type: "bool", internalType: "bool" },
            ],
          },
        ],
      },
      { name: "eventData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "afterOrderFrozen",
    inputs: [
      { name: "key", type: "bytes32", internalType: "bytes32" },
      {
        name: "order",
        type: "tuple",
        internalType: "struct GmxPositionUtils.Props",
        components: [
          {
            name: "addresses",
            type: "tuple",
            internalType: "struct GmxPositionUtils.Addresses",
            components: [
              { name: "account", type: "address", internalType: "address" },
              { name: "receiver", type: "address", internalType: "address" },
              {
                name: "callbackContract",
                type: "address",
                internalType: "address",
              },
              {
                name: "uiFeeReceiver",
                type: "address",
                internalType: "address",
              },
              { name: "market", type: "address", internalType: "address" },
              {
                name: "initialCollateralToken",
                type: "address",
                internalType: "contract IERC20",
              },
              {
                name: "swapPath",
                type: "address[]",
                internalType: "address[]",
              },
            ],
          },
          {
            name: "numbers",
            type: "tuple",
            internalType: "struct GmxPositionUtils.Numbers",
            components: [
              {
                name: "orderType",
                type: "uint8",
                internalType: "enum GmxPositionUtils.OrderType",
              },
              {
                name: "decreasePositionSwapType",
                type: "uint8",
                internalType: "enum GmxPositionUtils.DecreasePositionSwapType",
              },
              {
                name: "initialCollateralDeltaAmount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "sizeDeltaUsd",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "triggerPrice",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "acceptablePrice",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "executionFee",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "callbackGasLimit",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "minOutputAmount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "updatedAtBlock",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            name: "flags",
            type: "tuple",
            internalType: "struct GmxPositionUtils.Flags",
            components: [
              { name: "isLong", type: "bool", internalType: "bool" },
              {
                name: "shouldUnwrapNativeToken",
                type: "bool",
                internalType: "bool",
              },
              { name: "isFrozen", type: "bool", internalType: "bool" },
            ],
          },
        ],
      },
      { name: "eventData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allocate",
    inputs: [
      {
        name: "collateralToken",
        type: "address",
        internalType: "contract IERC20",
      },
      { name: "sourceRequestKey", type: "bytes32", internalType: "bytes32" },
      { name: "positionKey", type: "bytes32", internalType: "bytes32" },
      { name: "matchKey", type: "bytes32", internalType: "bytes32" },
      { name: "puppetList", type: "address[]", internalType: "address[]" },
    ],
    outputs: [
      { name: "allocationKey", type: "bytes32", internalType: "bytes32" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "authority",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract IAuthority" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "canCall",
    inputs: [
      { name: "signatureHash", type: "bytes4", internalType: "bytes4" },
      { name: "user", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "config",
    inputs: [],
    outputs: [
      {
        name: "requestLogic",
        type: "address",
        internalType: "contract RequestLogic",
      },
      {
        name: "allocationLogic",
        type: "address",
        internalType: "contract AllocationLogic",
      },
      {
        name: "executionLogic",
        type: "address",
        internalType: "contract ExecutionLogic",
      },
      {
        name: "unhandledCallbackLogic",
        type: "address",
        internalType: "contract UnhandledCallbackLogic",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "eip712Domain",
    inputs: [],
    outputs: [
      { name: "fields", type: "bytes1", internalType: "bytes1" },
      { name: "name", type: "string", internalType: "string" },
      { name: "version", type: "string", internalType: "string" },
      { name: "chainId", type: "uint256", internalType: "uint256" },
      { name: "verifyingContract", type: "address", internalType: "address" },
      { name: "salt", type: "bytes32", internalType: "bytes32" },
      { name: "extensions", type: "uint256[]", internalType: "uint256[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mirror",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct RequestLogic.MirrorPositionParams",
        components: [
          {
            name: "collateralToken",
            type: "address",
            internalType: "contract IERC20",
          },
          {
            name: "sourceRequestKey",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "allocationKey", type: "bytes32", internalType: "bytes32" },
          { name: "trader", type: "address", internalType: "address" },
          { name: "market", type: "address", internalType: "address" },
          { name: "isIncrease", type: "bool", internalType: "bool" },
          { name: "isLong", type: "bool", internalType: "bool" },
          { name: "executionFee", type: "uint256", internalType: "uint256" },
          { name: "collateralDelta", type: "uint256", internalType: "uint256" },
          { name: "sizeDeltaInUsd", type: "uint256", internalType: "uint256" },
          { name: "acceptablePrice", type: "uint256", internalType: "uint256" },
          { name: "triggerPrice", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "multicall",
    inputs: [{ name: "data", type: "bytes[]", internalType: "bytes[]" }],
    outputs: [{ name: "results", type: "bytes[]", internalType: "bytes[]" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setConfig",
    inputs: [{ name: "data", type: "bytes", internalType: "bytes" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setPermission",
    inputs: [
      { name: "functionSig", type: "bytes4", internalType: "bytes4" },
      { name: "user", type: "address", internalType: "address" },
      { name: "isEnabled", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "settle",
    inputs: [
      { name: "key", type: "bytes32", internalType: "bytes32" },
      { name: "puppetList", type: "address[]", internalType: "address[]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  { type: "event", name: "EIP712DomainChanged", inputs: [], anonymous: false },
  {
    type: "error",
    name: "AddressEmptyCode",
    inputs: [{ name: "target", type: "address", internalType: "address" }],
  },
  { type: "error", name: "FailedInnerCall", inputs: [] },
  { type: "error", name: "InvalidShortString", inputs: [] },
  { type: "error", name: "Permission__Unauthorized", inputs: [] },
  { type: "error", name: "ReentrancyGuardReentrantCall", inputs: [] },
  {
    type: "error",
    name: "StringTooLong",
    inputs: [{ name: "str", type: "string", internalType: "string" }],
  },
] as const;
