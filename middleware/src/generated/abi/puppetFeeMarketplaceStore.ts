// This file is auto-generated. Do not edit manually.
// Generated on: Thu, 21 Aug 2025 21:16:39 GMT
// Source: forge-artifacts/FeeMarketplaceStore.sol/FeeMarketplaceStore.json

export default [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        type: 'address',
        internalType: 'contract IAuthority'
      },
      {
        name: '_router',
        type: 'address',
        internalType: 'contract TokenRouter'
      },
      {
        name: '_protocolToken',
        type: 'address',
        internalType: 'contract PuppetToken'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'authority',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IAuthority'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'burn',
    inputs: [
      {
        name: '_amount',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'canCall',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address'
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
    name: 'getTokenBalance',
    inputs: [
      {
        name: '_token',
        type: 'address',
        internalType: 'contract IERC20'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'protocolToken',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract PuppetToken'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'recordTransferIn',
    inputs: [
      {
        name: '_token',
        type: 'address',
        internalType: 'contract IERC20'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setAccess',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'isEnabled',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'syncTokenBalance',
    inputs: [
      {
        name: '_token',
        type: 'address',
        internalType: 'contract IERC20'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'tokenBalanceMap',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IERC20'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'transferIn',
    inputs: [
      {
        name: '_token',
        type: 'address',
        internalType: 'contract IERC20'
      },
      {
        name: '_depositor',
        type: 'address',
        internalType: 'address'
      },
      {
        name: '_value',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'transferOut',
    inputs: [
      {
        name: 'gasLimit',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: '_token',
        type: 'address',
        internalType: 'contract IERC20'
      },
      {
        name: '_receiver',
        type: 'address',
        internalType: 'address'
      },
      {
        name: '_value',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'error',
    name: 'Access__CallerNotAuthority',
    inputs: []
  },
  {
    type: 'error',
    name: 'Access__Unauthorized',
    inputs: []
  },
  {
    type: 'error',
    name: 'BankStore__InsufficientBalance',
    inputs: []
  },
  {
    type: 'error',
    name: 'ReentrancyGuardReentrantCall',
    inputs: []
  },
  {
    type: 'error',
    name: 'TransferUtils__TokenTransferError',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'contract IERC20'
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256'
      }
    ]
  }
] as const
