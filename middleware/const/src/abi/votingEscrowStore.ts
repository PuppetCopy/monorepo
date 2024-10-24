export default [
  {
    type: "constructor",
    inputs: [
      {
        name: "_authority",
        type: "address",
        internalType: "contract IAuthority",
      },
      { name: "_router", type: "address", internalType: "contract Router" },
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
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLockDuration",
    inputs: [{ name: "_user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTokenBalance",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVested",
    inputs: [{ name: "_user", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct VotingEscrowStore.Vested",
        components: [
          { name: "amount", type: "uint256", internalType: "uint256" },
          {
            name: "remainingDuration",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "lastAccruedTime", type: "uint256", internalType: "uint256" },
          { name: "accrued", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "interTransferIn",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
      { name: "_bank", type: "address", internalType: "contract BankStore" },
      { name: "_value", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "lockDurationMap",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "recordTransferIn",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setAccess",
    inputs: [
      { name: "user", type: "address", internalType: "address" },
      { name: "isEnabled", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setLockDuration",
    inputs: [
      { name: "_user", type: "address", internalType: "address" },
      { name: "_duration", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setVested",
    inputs: [
      { name: "_user", type: "address", internalType: "address" },
      {
        name: "_vest",
        type: "tuple",
        internalType: "struct VotingEscrowStore.Vested",
        components: [
          { name: "amount", type: "uint256", internalType: "uint256" },
          {
            name: "remainingDuration",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "lastAccruedTime", type: "uint256", internalType: "uint256" },
          { name: "accrued", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "syncTokenBalance",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "tokenBalanceMap",
    inputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferIn",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
      { name: "_depositor", type: "address", internalType: "address" },
      { name: "_value", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOut",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
      { name: "_receiver", type: "address", internalType: "address" },
      { name: "_value", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "userBalanceMap",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "vestMap",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "remainingDuration", type: "uint256", internalType: "uint256" },
      { name: "lastAccruedTime", type: "uint256", internalType: "uint256" },
      { name: "accrued", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  { type: "error", name: "Access__Unauthorized", inputs: [] },
] as const;
