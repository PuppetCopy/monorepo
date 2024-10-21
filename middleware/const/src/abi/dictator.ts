export default [
  {
    type: "constructor",
    inputs: [{ name: "_owner", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "contractAccessMap",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasAccess",
    inputs: [
      { name: "target", type: "address", internalType: "contract Access" },
      { name: "user", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasPermission",
    inputs: [
      { name: "target", type: "address", internalType: "contract Permission" },
      { name: "functionSig", type: "bytes4", internalType: "bytes4" },
      { name: "user", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initContract",
    inputs: [
      {
        name: "target",
        type: "address",
        internalType: "contract CoreContract",
      },
      { name: "config", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "logEvent",
    inputs: [
      { name: "method", type: "string", internalType: "string" },
      { name: "name", type: "string", internalType: "string" },
      { name: "version", type: "string", internalType: "string" },
      { name: "data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "removeAccess",
    inputs: [
      { name: "target", type: "address", internalType: "contract Access" },
      { name: "user", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeContractAccess",
    inputs: [
      {
        name: "target",
        type: "address",
        internalType: "contract CoreContract",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removePermission",
    inputs: [
      { name: "target", type: "address", internalType: "contract Permission" },
      { name: "functionSig", type: "bytes4", internalType: "bytes4" },
      { name: "user", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setAccess",
    inputs: [
      { name: "target", type: "address", internalType: "contract Access" },
      { name: "user", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setConfig",
    inputs: [
      {
        name: "target",
        type: "address",
        internalType: "contract CoreContract",
      },
      { name: "config", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setPermission",
    inputs: [
      { name: "target", type: "address", internalType: "contract Permission" },
      { name: "functionSig", type: "bytes4", internalType: "bytes4" },
      { name: "user", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "AddContractAccess",
    inputs: [
      {
        name: "target",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LogEvent",
    inputs: [
      {
        name: "operator",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "method",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      { name: "name", type: "string", indexed: false, internalType: "string" },
      {
        name: "version",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      { name: "data", type: "bytes", indexed: false, internalType: "bytes" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RemoveContractAccess",
    inputs: [
      {
        name: "target",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SetConfig",
    inputs: [
      {
        name: "target",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      { name: "config", type: "bytes", indexed: false, internalType: "bytes" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "UpdateAccess",
    inputs: [
      {
        name: "target",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      { name: "enabled", type: "bool", indexed: false, internalType: "bool" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "UpdatePermission",
    inputs: [
      {
        name: "target",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "functionSig",
        type: "bytes4",
        indexed: false,
        internalType: "bytes4",
      },
      { name: "enabled", type: "bool", indexed: false, internalType: "bool" },
    ],
    anonymous: false,
  },
  { type: "error", name: "Dictator__ConfigurationUpdateFailed", inputs: [] },
  { type: "error", name: "Dictator__ContractAlreadyInitialized", inputs: [] },
  { type: "error", name: "Dictator__ContractNotInitialized", inputs: [] },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
  },
] as const;
