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
    name: "createSubaccount",
    inputs: [
      { name: "_key", type: "bytes32", internalType: "bytes32" },
      { name: "_account", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "", type: "address", internalType: "contract Subaccount" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getRequestAdjustment",
    inputs: [{ name: "_key", type: "bytes32", internalType: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct PositionStore.RequestAdjustment",
        components: [
          { name: "allocationKey", type: "bytes32", internalType: "bytes32" },
          {
            name: "sourceRequestKey",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "matchKey", type: "bytes32", internalType: "bytes32" },
          { name: "sizeDelta", type: "uint256", internalType: "uint256" },
          { name: "transactionCost", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSubaccount",
    inputs: [{ name: "_key", type: "bytes32", internalType: "bytes32" }],
    outputs: [
      { name: "", type: "address", internalType: "contract Subaccount" },
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
    name: "getUnhandledCallback",
    inputs: [{ name: "_key", type: "bytes32", internalType: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct PositionStore.UnhandledCallback",
        components: [
          {
            name: "order",
            type: "tuple",
            internalType: "struct GmxPositionUtils.Props",
            components: [
              {
                name: "addresses",
                type: "tuple",
                internalType: "struct GmxPositionUtils.Addresses",
                components: [
                  { name: "account", type: "address", internalType: "address" },
                  {
                    name: "receiver",
                    type: "address",
                    internalType: "address",
                  },
                  {
                    name: "callbackContract",
                    type: "address",
                    internalType: "address",
                  },
                  {
                    name: "uiFeeReceiver",
                    type: "address",
                    internalType: "address",
                  },
                  { name: "market", type: "address", internalType: "address" },
                  {
                    name: "initialCollateralToken",
                    type: "address",
                    internalType: "contract IERC20",
                  },
                  {
                    name: "swapPath",
                    type: "address[]",
                    internalType: "address[]",
                  },
                ],
              },
              {
                name: "numbers",
                type: "tuple",
                internalType: "struct GmxPositionUtils.Numbers",
                components: [
                  {
                    name: "orderType",
                    type: "uint8",
                    internalType: "enum GmxPositionUtils.OrderType",
                  },
                  {
                    name: "decreasePositionSwapType",
                    type: "uint8",
                    internalType:
                      "enum GmxPositionUtils.DecreasePositionSwapType",
                  },
                  {
                    name: "initialCollateralDeltaAmount",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "sizeDeltaUsd",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "triggerPrice",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "acceptablePrice",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "executionFee",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "callbackGasLimit",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "minOutputAmount",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "updatedAtBlock",
                    type: "uint256",
                    internalType: "uint256",
                  },
                ],
              },
              {
                name: "flags",
                type: "tuple",
                internalType: "struct GmxPositionUtils.Flags",
                components: [
                  { name: "isLong", type: "bool", internalType: "bool" },
                  {
                    name: "shouldUnwrapNativeToken",
                    type: "bool",
                    internalType: "bool",
                  },
                  { name: "isFrozen", type: "bool", internalType: "bool" },
                ],
              },
            ],
          },
          { name: "eventData", type: "bytes", internalType: "bytes" },
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
    name: "recordTransferIn",
    inputs: [
      { name: "_token", type: "address", internalType: "contract IERC20" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeRequestAdjustment",
    inputs: [{ name: "_key", type: "bytes32", internalType: "bytes32" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeRequestDecrease",
    inputs: [{ name: "_key", type: "bytes32", internalType: "bytes32" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeUnhandledCallback",
    inputs: [{ name: "_key", type: "bytes32", internalType: "bytes32" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "requestAdjustmentMap",
    inputs: [{ name: "requestKey", type: "bytes32", internalType: "bytes32" }],
    outputs: [
      { name: "allocationKey", type: "bytes32", internalType: "bytes32" },
      { name: "sourceRequestKey", type: "bytes32", internalType: "bytes32" },
      { name: "matchKey", type: "bytes32", internalType: "bytes32" },
      { name: "sizeDelta", type: "uint256", internalType: "uint256" },
      { name: "transactionCost", type: "uint256", internalType: "uint256" },
    ],
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
    name: "setRequestAdjustment",
    inputs: [
      { name: "_key", type: "bytes32", internalType: "bytes32" },
      {
        name: "_ra",
        type: "tuple",
        internalType: "struct PositionStore.RequestAdjustment",
        components: [
          { name: "allocationKey", type: "bytes32", internalType: "bytes32" },
          {
            name: "sourceRequestKey",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "matchKey", type: "bytes32", internalType: "bytes32" },
          { name: "sizeDelta", type: "uint256", internalType: "uint256" },
          { name: "transactionCost", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setUnhandledCallback",
    inputs: [
      {
        name: "_order",
        type: "tuple",
        internalType: "struct GmxPositionUtils.Props",
        components: [
          {
            name: "addresses",
            type: "tuple",
            internalType: "struct GmxPositionUtils.Addresses",
            components: [
              { name: "account", type: "address", internalType: "address" },
              { name: "receiver", type: "address", internalType: "address" },
              {
                name: "callbackContract",
                type: "address",
                internalType: "address",
              },
              {
                name: "uiFeeReceiver",
                type: "address",
                internalType: "address",
              },
              { name: "market", type: "address", internalType: "address" },
              {
                name: "initialCollateralToken",
                type: "address",
                internalType: "contract IERC20",
              },
              {
                name: "swapPath",
                type: "address[]",
                internalType: "address[]",
              },
            ],
          },
          {
            name: "numbers",
            type: "tuple",
            internalType: "struct GmxPositionUtils.Numbers",
            components: [
              {
                name: "orderType",
                type: "uint8",
                internalType: "enum GmxPositionUtils.OrderType",
              },
              {
                name: "decreasePositionSwapType",
                type: "uint8",
                internalType: "enum GmxPositionUtils.DecreasePositionSwapType",
              },
              {
                name: "initialCollateralDeltaAmount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "sizeDeltaUsd",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "triggerPrice",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "acceptablePrice",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "executionFee",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "callbackGasLimit",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "minOutputAmount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "updatedAtBlock",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            name: "flags",
            type: "tuple",
            internalType: "struct GmxPositionUtils.Flags",
            components: [
              { name: "isLong", type: "bool", internalType: "bool" },
              {
                name: "shouldUnwrapNativeToken",
                type: "bool",
                internalType: "bool",
              },
              { name: "isFrozen", type: "bool", internalType: "bool" },
            ],
          },
        ],
      },
      { name: "_key", type: "bytes32", internalType: "bytes32" },
      { name: "_eventData", type: "bytes", internalType: "bytes" },
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
    name: "unhandledCallbackMap",
    inputs: [{ name: "positionKey", type: "bytes32", internalType: "bytes32" }],
    outputs: [
      {
        name: "order",
        type: "tuple",
        internalType: "struct GmxPositionUtils.Props",
        components: [
          {
            name: "addresses",
            type: "tuple",
            internalType: "struct GmxPositionUtils.Addresses",
            components: [
              { name: "account", type: "address", internalType: "address" },
              { name: "receiver", type: "address", internalType: "address" },
              {
                name: "callbackContract",
                type: "address",
                internalType: "address",
              },
              {
                name: "uiFeeReceiver",
                type: "address",
                internalType: "address",
              },
              { name: "market", type: "address", internalType: "address" },
              {
                name: "initialCollateralToken",
                type: "address",
                internalType: "contract IERC20",
              },
              {
                name: "swapPath",
                type: "address[]",
                internalType: "address[]",
              },
            ],
          },
          {
            name: "numbers",
            type: "tuple",
            internalType: "struct GmxPositionUtils.Numbers",
            components: [
              {
                name: "orderType",
                type: "uint8",
                internalType: "enum GmxPositionUtils.OrderType",
              },
              {
                name: "decreasePositionSwapType",
                type: "uint8",
                internalType: "enum GmxPositionUtils.DecreasePositionSwapType",
              },
              {
                name: "initialCollateralDeltaAmount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "sizeDeltaUsd",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "triggerPrice",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "acceptablePrice",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "executionFee",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "callbackGasLimit",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "minOutputAmount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "updatedAtBlock",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            name: "flags",
            type: "tuple",
            internalType: "struct GmxPositionUtils.Flags",
            components: [
              { name: "isLong", type: "bool", internalType: "bool" },
              {
                name: "shouldUnwrapNativeToken",
                type: "bool",
                internalType: "bool",
              },
              { name: "isFrozen", type: "bool", internalType: "bool" },
            ],
          },
        ],
      },
      { name: "eventData", type: "bytes", internalType: "bytes" },
    ],
    stateMutability: "view",
  },
  { type: "error", name: "Access__Unauthorized", inputs: [] },
] as const;
