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
    name: "contribute",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
      { name: "_user", type: "address", internalType: "address" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "contributeMany",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
      { name: "_userList", type: "address[]", internalType: "address[]" },
      { name: "_valueList", type: "uint256[]", internalType: "uint256[]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getBuybackQuote",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCursor",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCursorBalance",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCursorRate",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
      { name: "_cursor", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPendingCursorReward",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
      { name: "_user", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPendingCursorRewardList",
    inputs: [
      {
        name: "_tokenList",
        type: "address[]",
        internalType: "contract IERC20[]",
      },
      { name: "_user", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
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
    name: "getUserAccruedReward",
    inputs: [{ name: "_user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserContributionBalance",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
      { name: "_user", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserCursor",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
      { name: "_user", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
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
    name: "setBuybackQuote",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
      { name: "_value", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setCursor",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
      { name: "_value", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setCursorBalance",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
      { name: "_value", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setCursorRate",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
      { name: "_cursor", type: "uint256", internalType: "uint256" },
      { name: "_value", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setUserAccruedReward",
    inputs: [
      { name: "_user", type: "address", internalType: "address" },
      { name: "_value", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setUserContributionBalance",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
      { name: "_user", type: "address", internalType: "address" },
      { name: "_value", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setUserCursor",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
      { name: "_user", type: "address", internalType: "address" },
      { name: "_value", type: "uint256", internalType: "uint256" },
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
    name: "updateAccruedReward",
    inputs: [
      { name: "_user", type: "address", internalType: "address" },
      { name: "_value", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateCursorReward",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
      { name: "_user", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateCursorRewardList",
    inputs: [
      {
        name: "_tokenList",
        type: "address[]",
        internalType: "contract IERC20[]",
      },
      { name: "_user", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  { type: "error", name: "Access__Unauthorized", inputs: [] },
] as const;
