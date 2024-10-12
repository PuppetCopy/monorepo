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
        name: "_eventEmitter",
        type: "address",
        internalType: "contract EventEmitter",
      },
      {
        name: "_store",
        type: "address",
        internalType: "contract PuppetStore",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "authority",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IAuthority",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "canCall",
    inputs: [
      {
        name: "signatureHash",
        type: "bytes4",
        internalType: "bytes4",
      },
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "config",
    inputs: [],
    outputs: [
      {
        name: "minExpiryDuration",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "minAllowanceRate",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "maxAllowanceRate",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "minAllocationActivity",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "maxAllocationActivity",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "deposit",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "eip712Domain",
    inputs: [],
    outputs: [
      {
        name: "fields",
        type: "bytes1",
        internalType: "bytes1",
      },
      {
        name: "name",
        type: "string",
        internalType: "string",
      },
      {
        name: "version",
        type: "string",
        internalType: "string",
      },
      {
        name: "chainId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "verifyingContract",
        type: "address",
        internalType: "address",
      },
      {
        name: "salt",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "extensions",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "remove",
    inputs: [
      {
        name: "functionSig",
        type: "bytes4",
        internalType: "bytes4",
      },
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "set",
    inputs: [
      {
        name: "functionSig",
        type: "bytes4",
        internalType: "bytes4",
      },
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setConfig",
    inputs: [
      {
        name: "_config",
        type: "tuple",
        internalType: "struct PuppetLogic.Config",
        components: [
          {
            name: "minExpiryDuration",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "minAllowanceRate",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxAllowanceRate",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "minAllocationActivity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxAllocationActivity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tokenAllowanceList",
            type: "address[]",
            internalType: "contract IERC20[]",
          },
          {
            name: "tokenAllowanceAmountList",
            type: "uint256[]",
            internalType: "uint256[]",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMatchRule",
    inputs: [
      {
        name: "collateralToken",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "ruleParams",
        type: "tuple",
        internalType: "struct PuppetStore.MatchRule",
        components: [
          {
            name: "allowanceRate",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "throttleActivity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "expiry",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
      {
        name: "puppet",
        type: "address",
        internalType: "address",
      },
      {
        name: "trader",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMatchRuleList",
    inputs: [
      {
        name: "collateralTokenList",
        type: "address[]",
        internalType: "contract IERC20[]",
      },
      {
        name: "traderList",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "ruleParamList",
        type: "tuple[]",
        internalType: "struct PuppetStore.MatchRule[]",
        components: [
          {
            name: "allowanceRate",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "throttleActivity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "expiry",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
      {
        name: "puppet",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "receiver",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "EIP712DomainChanged",
    inputs: [],
    anonymous: false,
  },
  {
    type: "error",
    name: "InvalidShortString",
    inputs: [],
  },
  {
    type: "error",
    name: "Permission__Unauthorized",
    inputs: [],
  },
  {
    type: "error",
    name: "PuppetLogic__AllowanceAboveLimit",
    inputs: [
      {
        name: "allowanceCap",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "PuppetLogic__InsufficientBalance",
    inputs: [],
  },
  {
    type: "error",
    name: "PuppetLogic__InvalidActivityThrottle",
    inputs: [
      {
        name: "minAllocationActivity",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "maxAllocationActivity",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "PuppetLogic__InvalidAllowanceRate",
    inputs: [
      {
        name: "min",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "max",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "PuppetLogic__InvalidAmount",
    inputs: [],
  },
  {
    type: "error",
    name: "PuppetLogic__InvalidLength",
    inputs: [],
  },
  {
    type: "error",
    name: "PuppetLogic__TokenNotAllowed",
    inputs: [],
  },
  {
    type: "error",
    name: "StringTooLong",
    inputs: [
      {
        name: "str",
        type: "string",
        internalType: "string",
      },
    ],
  },
] as const;
