export default [
  {
    inputs: [{ internalType: "address", name: "_owner", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "enabled", type: "bool" },
    ],
    name: "UpdateAccess",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes4",
        name: "functionSig",
        type: "bytes4",
      },
      { indexed: false, internalType: "bool", name: "enabled", type: "bool" },
    ],
    name: "UpdatePermission",
    type: "event",
  },
  {
    inputs: [
      { internalType: "contract Auth", name: "target", type: "address" },
      { internalType: "address", name: "user", type: "address" },
    ],
    name: "hasAccess",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract Permission", name: "target", type: "address" },
      { internalType: "bytes4", name: "functionSig", type: "bytes4" },
      { internalType: "address", name: "user", type: "address" },
    ],
    name: "hasPermission",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract Auth", name: "target", type: "address" },
      { internalType: "address", name: "user", type: "address" },
    ],
    name: "removeAccess",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract Permission", name: "target", type: "address" },
      { internalType: "bytes4", name: "functionSig", type: "bytes4" },
      { internalType: "address", name: "user", type: "address" },
    ],
    name: "removePermission",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract Auth", name: "target", type: "address" },
      { internalType: "address", name: "user", type: "address" },
    ],
    name: "setAccess",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract Permission", name: "target", type: "address" },
      { internalType: "bytes4", name: "functionSig", type: "bytes4" },
      { internalType: "address", name: "user", type: "address" },
    ],
    name: "setPermission",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
