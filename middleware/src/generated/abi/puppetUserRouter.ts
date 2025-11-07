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
    name: 'processRhinestoneAction',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'action',
        type: 'uint8',
        internalType: 'uint8'
      },
      {
        name: 'data',
        type: 'bytes',
        internalType: 'bytes'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'processRhinestoneDeposit',
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
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'rhinestoneSettler',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
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
    name: 'setRhinestoneSettler',
    inputs: [
      {
        name: '_rhinestoneSettler',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
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
    name: 'Deposit',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'token',
        type: 'address',
        indexed: true,
        internalType: 'contract IERC20'
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
    type: 'event',
    name: 'RhinestoneSettlerUpdated',
    inputs: [
      {
        name: 'oldSettler',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'newSettler',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'RuleSet',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'trader',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'mirror',
        type: 'address',
        indexed: true,
        internalType: 'contract Mirror'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Withdrawal',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'token',
        type: 'address',
        indexed: true,
        internalType: 'contract IERC20'
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
  },
  {
    type: 'error',
    name: 'SafeERC20FailedOperation',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'address'
      }
    ]
  }
] as const
