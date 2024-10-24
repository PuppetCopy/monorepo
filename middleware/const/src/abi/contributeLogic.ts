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
        name: "_rewardToken",
        type: "address",
        internalType: "contract IERC20Mintable",
      },
      {
        name: "_store",
        type: "address",
        internalType: "contract ContributeStore",
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
    name: "buyback",
    inputs: [
      { name: "token", type: "address", internalType: "contract IERC20" },
      { name: "depositor", type: "address", internalType: "address" },
      { name: "receiver", type: "address", internalType: "address" },
      { name: "revenueAmount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "claim",
    inputs: [
      {
        name: "tokenList",
        type: "address[]",
        internalType: "contract IERC20[]",
      },
      { name: "user", type: "address", internalType: "address" },
      { name: "receiver", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "config",
    inputs: [],
    outputs: [
      {
        name: "baselineEmissionRate",
        type: "uint256",
        internalType: "uint256",
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
    name: "getClaimable",
    inputs: [
      {
        name: "tokenList",
        type: "address[]",
        internalType: "contract IERC20[]",
      },
      { name: "user", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCursorRewardList",
    inputs: [
      {
        name: "tokenList",
        type: "address[]",
        internalType: "contract IERC20[]",
      },
      { name: "user", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "rewardToken",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract IERC20Mintable" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setBuybackQuote",
    inputs: [
      { name: "token", type: "address", internalType: "contract IERC20" },
      { name: "value", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
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
  { type: "event", name: "EIP712DomainChanged", inputs: [], anonymous: false },
  {
    type: "error",
    name: "ContributeLogic__InsufficientClaimableReward",
    inputs: [
      { name: "accruedReward", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "ContributeLogic__InvalidBuybackToken", inputs: [] },
  { type: "error", name: "InvalidShortString", inputs: [] },
  { type: "error", name: "MathOverflowedMulDiv", inputs: [] },
  { type: "error", name: "Permission__Unauthorized", inputs: [] },
  {
    type: "error",
    name: "StringTooLong",
    inputs: [{ name: "str", type: "string", internalType: "string" }],
  },
] as const;
