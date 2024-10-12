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
        name: "logic",
        type: "address",
        internalType: "contract PuppetLogic",
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
        internalType: "struct PuppetRouter.Config",
        components: [
          {
            name: "logic",
            type: "address",
            internalType: "contract PuppetLogic",
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
        name: "ruleParams",
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
        name: "traderList",
        type: "address[]",
        internalType: "address[]",
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
    name: "ReentrancyGuardReentrantCall",
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
