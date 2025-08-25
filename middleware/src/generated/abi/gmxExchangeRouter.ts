// This file is auto-generated. Do not edit manually.
// Generated on: Mon, 25 Aug 2025 10:23:10 GMT
// Source: GMX deployment files from GitHub (v2.2-branch)

export default [
  {
    inputs: [
      {
        internalType: 'contract RoleStore',
        name: '_roleStore',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'msgSender',
        type: 'address'
      },
      {
        internalType: 'string',
        name: 'role',
        type: 'string'
      }
    ],
    name: 'Unauthorized',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'pluginTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'roleStore',
    outputs: [
      {
        internalType: 'contract RoleStore',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const
