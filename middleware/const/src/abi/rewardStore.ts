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
    name: "cumulativeRewardPerToken",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "emissionRate",
    inputs: [],
    outputs: [
      { name: "twa", type: "uint256", internalType: "uint256" },
      { name: "timestamp", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEmissionRate",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct RewardStore.EmissionRate",
        components: [
          { name: "twa", type: "uint256", internalType: "uint256" },
          { name: "timestamp", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
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
    name: "getUserRewardCursor",
    inputs: [{ name: "_user", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct RewardStore.UserRewardCursor",
        components: [
          { name: "rewardPerToken", type: "uint256", internalType: "uint256" },
          { name: "accruedReward", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "incrementCumulativePerContribution",
    inputs: [{ name: "_value", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
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
    name: "lastDistributionTimestamp",
    inputs: [],
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
    name: "rewardRate",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
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
    name: "setEmissionRate",
    inputs: [
      {
        name: "_value",
        type: "tuple",
        internalType: "struct RewardStore.EmissionRate",
        components: [
          { name: "twa", type: "uint256", internalType: "uint256" },
          { name: "timestamp", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setLastDistributionTimestamp",
    inputs: [{ name: "_value", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setRewardRate",
    inputs: [{ name: "_value", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setUserRewardCursor",
    inputs: [
      { name: "_user", type: "address", internalType: "address" },
      {
        name: "cursor",
        type: "tuple",
        internalType: "struct RewardStore.UserRewardCursor",
        components: [
          { name: "rewardPerToken", type: "uint256", internalType: "uint256" },
          { name: "accruedReward", type: "uint256", internalType: "uint256" },
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
  { type: "error", name: "Access__Unauthorized", inputs: [] },
] as const;
