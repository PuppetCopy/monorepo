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
        name: "_puppetStore",
        type: "address",
        internalType: "contract PuppetStore",
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
    name: "config",
    inputs: [],
    outputs: [
      {
        name: "gmxExchangeRouter",
        type: "address",
        internalType: "contract IGmxExchangeRouter",
      },
      {
        name: "gmxDatastore",
        type: "address",
        internalType: "contract IGmxDatastore",
      },
      { name: "callbackHandler", type: "address", internalType: "address" },
      { name: "gmxFundsReciever", type: "address", internalType: "address" },
      { name: "gmxOrderVault", type: "address", internalType: "address" },
      { name: "referralCode", type: "bytes32", internalType: "bytes32" },
      { name: "callbackGasLimit", type: "uint256", internalType: "uint256" },
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
    outputs: [{ name: "requestKey", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "payable",
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
  { type: "event", name: "EIP712DomainChanged", inputs: [], anonymous: false },
  { type: "error", name: "InvalidShortString", inputs: [] },
  { type: "error", name: "MathOverflowedMulDiv", inputs: [] },
  { type: "error", name: "Permission__Unauthorized", inputs: [] },
  { type: "error", name: "RequestLogic__NoAllocation", inputs: [] },
  { type: "error", name: "RequestLogic__PendingExecution", inputs: [] },
  {
    type: "error",
    name: "StringTooLong",
    inputs: [{ name: "str", type: "string", internalType: "string" }],
  },
] as const;