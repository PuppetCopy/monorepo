export default [
  {
    type: "constructor",
    inputs: [
      {
        name: "_authority",
        type: "address",
        internalType: "contract IAuthority",
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
    name: "setTransferGasLimit",
    inputs: [
      {
        name: "_trasnferGasLimit",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "from",
        type: "address",
        internalType: "address",
      },
      {
        name: "to",
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
    type: "error",
    name: "ExternalCallUtils__AddressEmptyCode",
    inputs: [
      {
        name: "target",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ExternalCallUtils__FailedInnerCall",
    inputs: [],
  },
  {
    type: "error",
    name: "ExternalCallUtils__SafeERC20FailedOperation",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "Permission__Unauthorized",
    inputs: [],
  },
] as const;
