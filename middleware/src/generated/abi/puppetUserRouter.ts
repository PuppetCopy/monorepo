// This file is auto-generated. Do not edit manually.
// Source: forge-artifacts/UserRouter.sol/UserRouter.json

export default [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_account',
        type: 'address',
        internalType: 'contract Account'
      },
      {
        name: '_rule',
        type: 'address',
        internalType: 'contract Rule'
      },
      {
        name: '_feeMarketplace',
        type: 'address',
        internalType: 'contract FeeMarketplace'
      },
      {
        name: '_mirror',
        type: 'address',
        internalType: 'contract Mirror'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'acceptOffer',
    inputs: [
      {
        name: 'feeToken',
        type: 'address',
        internalType: 'contract IERC20'
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'purchaseAmount',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'account',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract Account'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'deposit',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'contract IERC20'
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'depositCrossChain',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'token',
        type: 'address',
        internalType: 'contract IERC20'
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'sourceChainId',
        type: 'uint32',
        internalType: 'uint32'
      },
      {
        name: 'nonce',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'depositRecords',
    inputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32'
      }
    ],
    outputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'token',
        type: 'address',
        internalType: 'contract IERC20'
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'timestamp',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'processed',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'feeMarketplace',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract FeeMarketplace'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'fill',
    inputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32'
      },
      {
        name: 'originData',
        type: 'bytes',
        internalType: 'bytes'
      },
      {
        name: '',
        type: 'bytes',
        internalType: 'bytes'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'getDepositRecord',
    inputs: [
      {
        name: 'depositId',
        type: 'bytes32',
        internalType: 'bytes32'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct UserRouter.DepositRecord',
        components: [
          {
            name: 'user',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'token',
            type: 'address',
            internalType: 'contract IERC20'
          },
          {
            name: 'amount',
            type: 'uint256',
            internalType: 'uint256'
          },
          {
            name: 'timestamp',
            type: 'uint256',
            internalType: 'uint256'
          },
          {
            name: 'processed',
            type: 'bool',
            internalType: 'bool'
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'isDepositProcessed',
    inputs: [
      {
        name: 'depositId',
        type: 'bytes32',
        internalType: 'bytes32'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'mirror',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract Mirror'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'rule',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract Rule'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'setRule',
    inputs: [
      {
        name: '_mirror',
        type: 'address',
        internalType: 'contract Mirror'
      },
      {
        name: '_collateralToken',
        type: 'address',
        internalType: 'contract IERC20'
      },
      {
        name: '_trader',
        type: 'address',
        internalType: 'address'
      },
      {
        name: '_ruleParams',
        type: 'tuple',
        internalType: 'struct Rule.RuleParams',
        components: [
          {
            name: 'allowanceRate',
            type: 'uint256',
            internalType: 'uint256'
          },
          {
            name: 'throttleActivity',
            type: 'uint256',
            internalType: 'uint256'
          },
          {
            name: 'expiry',
            type: 'uint256',
            internalType: 'uint256'
          }
        ]
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'withdraw',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'contract IERC20'
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    name: 'CrossChainDepositFulfilled',
    inputs: [
      {
        name: 'depositId',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32'
      },
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'error',
    name: 'ReentrancyGuardReentrantCall',
    inputs: []
  }
] as const
