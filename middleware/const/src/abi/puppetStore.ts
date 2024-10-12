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
        name: "_router",
        type: "address",
        internalType: "contract Router",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allocate",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_matchKey",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_puppet",
        type: "address",
        internalType: "address",
      },
      {
        name: "_allocationAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allocatePuppetList",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_matchKey",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_allocationKey",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_puppetList",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "_allocationList",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
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
    name: "getActivityThrottle",
    inputs: [
      {
        name: "_puppet",
        type: "address",
        internalType: "address",
      },
      {
        name: "_key",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getActivityThrottleList",
    inputs: [
      {
        name: "_key",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "puppetList",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllocation",
    inputs: [
      {
        name: "_matchKey",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_puppet",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllocation",
    inputs: [
      {
        name: "_key",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct PuppetStore.Allocation",
        components: [
          {
            name: "matchKey",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "collateralToken",
            type: "address",
            internalType: "contract IERC20",
          },
          {
            name: "allocated",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "collateral",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "size",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "settled",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "profit",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBalanceAndActivityThrottle",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_matchKey",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_puppet",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "_rule",
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
        name: "_allocationActivity",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_balance",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBalanceAndActivityThrottleList",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_matchKey",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_puppetList",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    outputs: [
      {
        name: "_ruleList",
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
        name: "_activityList",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "_balanceList",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBalanceList",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_accountList",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMatchRule",
    inputs: [
      {
        name: "_key",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_puppet",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
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
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMatchRuleList",
    inputs: [
      {
        name: "_puppet",
        type: "address",
        internalType: "address",
      },
      {
        name: "_matchKeyList",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
    ],
    outputs: [
      {
        name: "",
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
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPuppetRouteRuleList",
    inputs: [
      {
        name: "_puppet",
        type: "address",
        internalType: "address",
      },
      {
        name: "_matchKeyList",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
    ],
    outputs: [
      {
        name: "",
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
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRequestId",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSettledAllocationHash",
    inputs: [
      {
        name: "_hash",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTokenAllowanceCap",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTokenBalance",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserAllocation",
    inputs: [
      {
        name: "_puppet",
        type: "address",
        internalType: "address",
      },
      {
        name: "_key",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserAllocationList",
    inputs: [
      {
        name: "_key",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_puppetList",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    outputs: [
      {
        name: "_allocationList",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserBalance",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_account",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "incrementRequestId",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "interTransferIn",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_bank",
        type: "address",
        internalType: "contract BankStore",
      },
      {
        name: "_value",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "recordTransferIn",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "remove",
    inputs: [
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
    name: "removeAllocation",
    inputs: [
      {
        name: "_key",
        type: "bytes32",
        internalType: "bytes32",
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
    name: "setActivityThrottle",
    inputs: [
      {
        name: "_puppet",
        type: "address",
        internalType: "address",
      },
      {
        name: "_key",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_time",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setAllocation",
    inputs: [
      {
        name: "_key",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_settlement",
        type: "tuple",
        internalType: "struct PuppetStore.Allocation",
        components: [
          {
            name: "matchKey",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "collateralToken",
            type: "address",
            internalType: "contract IERC20",
          },
          {
            name: "allocated",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "collateral",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "size",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "settled",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "profit",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setBalance",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_user",
        type: "address",
        internalType: "address",
      },
      {
        name: "_value",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMatchRule",
    inputs: [
      {
        name: "_key",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_puppet",
        type: "address",
        internalType: "address",
      },
      {
        name: "_rule",
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
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMatchRuleList",
    inputs: [
      {
        name: "_puppet",
        type: "address",
        internalType: "address",
      },
      {
        name: "_matchKeyList",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
      {
        name: "_rules",
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
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setSettledAllocationHash",
    inputs: [
      {
        name: "_hash",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_key",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setTokenAllowanceCap",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_value",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setUserAllocation",
    inputs: [
      {
        name: "_key",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_puppet",
        type: "address",
        internalType: "address",
      },
      {
        name: "_value",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "settle",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_puppet",
        type: "address",
        internalType: "address",
      },
      {
        name: "_settleAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "settleList",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_puppetList",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "_settleAmountList",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "syncTokenBalance",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "tokenBalanceMap",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferIn",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_depositor",
        type: "address",
        internalType: "address",
      },
      {
        name: "_value",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOut",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_receiver",
        type: "address",
        internalType: "address",
      },
      {
        name: "_value",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "error",
    name: "Access__Unauthorized",
    inputs: [],
  },
  {
    type: "error",
    name: "PuppetStore__OverwriteAllocation",
    inputs: [],
  },
  {
    type: "error",
    name: "Store__InvalidLength",
    inputs: [],
  },
] as const;
