// This file is auto-generated. Do not edit manually.
// Generated on: 2025-08-08T17:59:34.309Z
// Source: forge-artifacts/Dictatorship.sol/Dictatorship.json

export default [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_initialOwner',
        type: 'address',
        internalType: 'address'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'hasAccess',
    inputs: [
      {
        name: '_target',
        type: 'address',
        internalType: 'contract Access'
      },
      {
        name: '_user',
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
    name: 'hasPermission',
    inputs: [
      {
        name: '_target',
        type: 'address',
        internalType: 'contract Permission'
      },
      {
        name: '_functionSig',
        type: 'bytes4',
        internalType: 'bytes4'
      },
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
    name: 'logEvent',
    inputs: [
      {
        name: '_method',
        type: 'string',
        internalType: 'string'
      },
      {
        name: '_data',
        type: 'bytes',
        internalType: 'bytes'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'owner',
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
    name: 'registerContract',
    inputs: [
      {
        name: '_contract',
        type: 'address',
        internalType: 'contract CoreContract'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'registeredContract',
    inputs: [
      {
        name: '',
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
    name: 'removeAccess',
    inputs: [
      {
        name: '_target',
        type: 'address',
        internalType: 'contract Access'
      },
      {
        name: '_user',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'removeContract',
    inputs: [
      {
        name: '_contract',
        type: 'address',
        internalType: 'contract CoreContract'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'removePermission',
    inputs: [
      {
        name: '_target',
        type: 'address',
        internalType: 'contract Permission'
      },
      {
        name: '_functionSig',
        type: 'bytes4',
        internalType: 'bytes4'
      },
      {
        name: '_user',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setAccess',
    inputs: [
      {
        name: '_target',
        type: 'address',
        internalType: 'contract Access'
      },
      {
        name: '_user',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setConfig',
    inputs: [
      {
        name: '_contract',
        type: 'address',
        internalType: 'contract CoreContract'
      },
      {
        name: '_config',
        type: 'bytes',
        internalType: 'bytes'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setPermission',
    inputs: [
      {
        name: '_target',
        type: 'address',
        internalType: 'contract Permission'
      },
      {
        name: '_functionSig',
        type: 'bytes4',
        internalType: 'bytes4'
      },
      {
        name: '_user',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setTargetCallGasLimit',
    inputs: [
      {
        name: '_gasLimit',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'targetCallGasLimit',
    inputs: [],
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
    name: 'transferOwnership',
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'PuppetEventLog',
    inputs: [
      {
        name: 'coreContract',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'method',
        type: 'string',
        indexed: true,
        internalType: 'string'
      },
      {
        name: 'data',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes'
      }
    ],
    anonymous: false
  },
  {
    type: 'error',
    name: 'Dictatorship__ConfigurationUpdateFailed',
    inputs: []
  },
  {
    type: 'error',
    name: 'Dictatorship__ContractAlreadyInitialized',
    inputs: []
  },
  {
    type: 'error',
    name: 'Dictatorship__ContractNotRegistered',
    inputs: []
  },
  {
    type: 'error',
    name: 'Dictatorship__InvalidCoreContract',
    inputs: []
  },
  {
    type: 'error',
    name: 'Dictatorship__InvalidTargetAddress',
    inputs: []
  },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address'
      }
    ]
  }
] as const
