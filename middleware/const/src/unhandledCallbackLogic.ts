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
        internalType: "contract PositionStore",
      },
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
    name: "storeUnhandledCallback",
    inputs: [
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
      { name: "key", type: "bytes32", internalType: "bytes32" },
      { name: "eventData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  { type: "event", name: "EIP712DomainChanged", inputs: [], anonymous: false },
  { type: "error", name: "InvalidShortString", inputs: [] },
  { type: "error", name: "Permission__Unauthorized", inputs: [] },
  {
    type: "error",
    name: "StringTooLong",
    inputs: [{ name: "str", type: "string", internalType: "string" }],
  },
] as const;
