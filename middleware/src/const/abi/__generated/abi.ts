//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Access
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const accessAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setAccess',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  { type: 'error', inputs: [], name: 'Access__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Account
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const accountAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address'
      },
      {
        name: '_accountStore',
        internalType: 'contract AccountStore',
        type: 'address'
      },
      {
        name: '_config',
        internalType: 'struct Account.Config',
        type: 'tuple',
        components: [
          {
            name: 'transferOutGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          }
        ]
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'accountStore',
    outputs: [{ name: '', internalType: 'contract AccountStore', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocationAccountImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' }
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_allocationKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'createAllocationAccount',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_collateralToken',
        internalType: 'contract IERC20',
        type: 'address'
      },
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'depositTokenList',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_allocationAddress', internalType: 'address', type: 'address' },
      { name: '_target', internalType: 'address', type: 'address' },
      { name: '_callData', internalType: 'bytes', type: 'bytes' },
      { name: '_gasLimit', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'execute',
    outputs: [
      { name: 'success', internalType: 'bool', type: 'bool' },
      { name: 'returnData', internalType: 'bytes', type: 'bytes' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_allocationKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getAllocationAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_puppetList', internalType: 'address[]', type: 'address[]' }
    ],
    name: 'getBalanceList',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'getConfig',
    outputs: [
      {
        name: '',
        internalType: 'struct Account.Config',
        type: 'tuple',
        components: [
          {
            name: 'transferOutGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_accountList', internalType: 'address[]', type: 'address[]' },
      { name: '_balanceList', internalType: 'uint256[]', type: 'uint256[]' }
    ],
    name: 'setBalanceList',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_depositTokenList',
        internalType: 'contract IERC20[]',
        type: 'address[]'
      },
      { name: '_depositCapList', internalType: 'uint256[]', type: 'uint256[]' }
    ],
    name: 'setDepositCapList',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_account', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'setUserBalance',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure'
  },
  {
    type: 'function',
    inputs: [
      { name: '_allocationAddress', internalType: 'address', type: 'address' },
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_gasLimit', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferInAllocation',
    outputs: [{ name: '_recordedAmountIn', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferOut',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'unaccountedBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'user', internalType: 'address', type: 'address' }
    ],
    name: 'userBalanceMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_collateralToken',
        internalType: 'contract IERC20',
        type: 'address'
      },
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'error',
    inputs: [{ name: 'depositCap', internalType: 'uint256', type: 'uint256' }],
    name: 'Account__DepositExceedsLimit'
  },
  { type: 'error', inputs: [], name: 'Account__InsufficientBalance' },
  { type: 'error', inputs: [], name: 'Account__InvalidAmount' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'recordedAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'settledAmount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Account__InvalidSettledAmount'
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' }
    ],
    name: 'Account__NoFundsToTransfer'
  },
  { type: 'error', inputs: [], name: 'Account__TokenNotAllowed' },
  { type: 'error', inputs: [], name: 'FailedDeployment' },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'InsufficientBalance'
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AccountStore
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const accountStoreAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address'
      },
      {
        name: '_router',
        internalType: 'contract TokenRouter',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'contract IERC20', type: 'address' }],
    name: 'getTokenBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'contract IERC20', type: 'address' }],
    name: 'recordTransferIn',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setAccess',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'contract IERC20', type: 'address' }],
    name: 'syncTokenBalance',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    name: 'tokenBalanceMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferIn',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'gasLimit', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferOut',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  { type: 'error', inputs: [], name: 'Access__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Access__Unauthorized' },
  { type: 'error', inputs: [], name: 'BankStore__InsufficientBalance' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'TransferUtils__TokenTransferError'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Address
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const addressAbi = [
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AllocationAccount
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const allocationAccountAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_store', internalType: 'contract Access', type: 'address' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_contract', internalType: 'address', type: 'address' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
      { name: '_gasLimit', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'execute',
    outputs: [
      { name: '_success', internalType: 'bool', type: 'bool' },
      { name: '_returnData', internalType: 'bytes', type: 'bytes' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_contract', internalType: 'address', type: 'address' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
      { name: '_ethAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_gasLimit', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'execute',
    outputs: [
      { name: '_success', internalType: 'bool', type: 'bool' },
      { name: '_returnData', internalType: 'bytes', type: 'bytes' }
    ],
    stateMutability: 'payable'
  },
  { type: 'error', inputs: [], name: 'AllocationAccount__InsufficientBalance' },
  {
    type: 'error',
    inputs: [],
    name: 'AllocationAccount__UnauthorizedOperator'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BankStore
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const bankStoreAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'contract IERC20', type: 'address' }],
    name: 'getTokenBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'contract IERC20', type: 'address' }],
    name: 'recordTransferIn',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setAccess',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'contract IERC20', type: 'address' }],
    name: 'syncTokenBalance',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    name: 'tokenBalanceMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferIn',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'gasLimit', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferOut',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  { type: 'error', inputs: [], name: 'Access__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Access__Unauthorized' },
  { type: 'error', inputs: [], name: 'BankStore__InsufficientBalance' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'TransferUtils__TokenTransferError'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Checkpoints
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const checkpointsAbi = [{ type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' }] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Clones
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const clonesAbi = [{ type: 'error', inputs: [], name: 'CloneArgumentsTooLong' }] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CoreContract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const coreContractAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' }
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure'
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const create2Abi = [{ type: 'error', inputs: [], name: 'Create2EmptyBytecode' }] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Dictatorship
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const dictatorshipAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_initialOwner', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_target', internalType: 'contract Access', type: 'address' },
      { name: '_user', internalType: 'address', type: 'address' }
    ],
    name: 'hasAccess',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_target', internalType: 'contract Permission', type: 'address' },
      { name: '_functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' }
    ],
    name: 'hasPermission',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_method', internalType: 'string', type: 'string' },
      { name: '_data', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'logEvent',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_contract',
        internalType: 'contract CoreContract',
        type: 'address'
      }
    ],
    name: 'registerContract',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'registeredContract',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_target', internalType: 'contract Access', type: 'address' },
      { name: '_user', internalType: 'address', type: 'address' }
    ],
    name: 'removeAccess',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_contract',
        internalType: 'contract CoreContract',
        type: 'address'
      }
    ],
    name: 'removeContract',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_target', internalType: 'contract Permission', type: 'address' },
      { name: '_functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: '_user', internalType: 'address', type: 'address' }
    ],
    name: 'removePermission',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_target', internalType: 'contract Access', type: 'address' },
      { name: '_user', internalType: 'address', type: 'address' }
    ],
    name: 'setAccess',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_contract',
        internalType: 'contract CoreContract',
        type: 'address'
      },
      { name: '_config', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_target', internalType: 'contract Permission', type: 'address' },
      { name: '_functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: '_user', internalType: 'address', type: 'address' }
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_gasLimit', internalType: 'uint256', type: 'uint256' }],
    name: 'setTargetCallGasLimit',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetCallGasLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'OwnershipTransferred'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'coreContract',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      { name: 'method', internalType: 'string', type: 'string', indexed: true },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false }
    ],
    name: 'PuppetEventLog'
  },
  {
    type: 'error',
    inputs: [],
    name: 'Dictatorship__ConfigurationUpdateFailed'
  },
  {
    type: 'error',
    inputs: [],
    name: 'Dictatorship__ContractAlreadyInitialized'
  },
  { type: 'error', inputs: [], name: 'Dictatorship__ContractNotRegistered' },
  { type: 'error', inputs: [], name: 'Dictatorship__InvalidCoreContract' },
  { type: 'error', inputs: [], name: 'Dictatorship__InvalidTargetAddress' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner'
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ECDSA
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ecdsaAbi = [
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength'
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EIP712
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const eip712Abi = [
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' }
    ],
    stateMutability: 'view'
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC165
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc165Abi = [
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC1967Utils
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc1967UtilsAbi = [
  {
    type: 'error',
    inputs: [{ name: 'admin', internalType: 'address', type: 'address' }],
    name: 'ERC1967InvalidAdmin'
  },
  {
    type: 'error',
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address' }],
    name: 'ERC1967InvalidBeacon'
  },
  {
    type: 'error',
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address' }],
    name: 'ERC1967InvalidImplementation'
  },
  { type: 'error', inputs: [], name: 'ERC1967NonPayable' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20Abi = [
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Approval'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Transfer'
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC20InsufficientAllowance'
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC20InsufficientBalance'
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover'
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver'
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender'
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20Burnable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20BurnableAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Approval'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Transfer'
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC20InsufficientAllowance'
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC20InsufficientBalance'
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover'
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver'
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender'
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20Votes
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20VotesAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'pos', internalType: 'uint32', type: 'uint32' }
    ],
    name: 'checkpoints',
    outputs: [
      {
        name: '',
        internalType: 'struct Checkpoints.Checkpoint208',
        type: 'tuple',
        components: [
          { name: '_key', internalType: 'uint48', type: 'uint48' },
          { name: '_value', internalType: 'uint208', type: 'uint208' }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'numCheckpoints',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Approval'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'DelegateChanged'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'previousVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'newVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'DelegateVotesChanged'
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Transfer'
  },
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength'
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS'
  },
  {
    type: 'error',
    inputs: [
      { name: 'increasedSupply', internalType: 'uint256', type: 'uint256' },
      { name: 'cap', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC20ExceededSafeSupply'
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC20InsufficientAllowance'
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC20InsufficientBalance'
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover'
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver'
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender'
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender'
  },
  {
    type: 'error',
    inputs: [
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'clock', internalType: 'uint48', type: 'uint48' }
    ],
    name: 'ERC5805FutureLookup'
  },
  { type: 'error', inputs: [], name: 'ERC6372InconsistentClock' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'InvalidAccountNonce'
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'SafeCastOverflowedUintDowncast'
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong'
  },
  {
    type: 'error',
    inputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
    name: 'VotesExpiredSignature'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Error
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const errorAbi = [
  { type: 'error', inputs: [], name: 'Access__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Access__Unauthorized' },
  {
    type: 'error',
    inputs: [{ name: 'depositCap', internalType: 'uint256', type: 'uint256' }],
    name: 'Account__DepositExceedsLimit'
  },
  { type: 'error', inputs: [], name: 'Account__InsufficientBalance' },
  { type: 'error', inputs: [], name: 'Account__InvalidAmount' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'recordedAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'settledAmount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Account__InvalidSettledAmount'
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' }
    ],
    name: 'Account__NoFundsToTransfer'
  },
  { type: 'error', inputs: [], name: 'Account__TokenNotAllowed' },
  { type: 'error', inputs: [], name: 'AllocationAccount__InsufficientBalance' },
  {
    type: 'error',
    inputs: [],
    name: 'AllocationAccount__UnauthorizedOperator'
  },
  { type: 'error', inputs: [], name: 'BankStore__InsufficientBalance' },
  {
    type: 'error',
    inputs: [],
    name: 'Dictatorship__ConfigurationUpdateFailed'
  },
  {
    type: 'error',
    inputs: [],
    name: 'Dictatorship__ContractAlreadyInitialized'
  },
  { type: 'error', inputs: [], name: 'Dictatorship__ContractNotRegistered' },
  { type: 'error', inputs: [], name: 'Dictatorship__InvalidCoreContract' },
  { type: 'error', inputs: [], name: 'Dictatorship__InvalidTargetAddress' },
  {
    type: 'error',
    inputs: [
      { name: 'requested', internalType: 'uint256', type: 'uint256' },
      { name: 'available', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'FeeMarketplace__InsufficientDistributionBalance'
  },
  {
    type: 'error',
    inputs: [{ name: 'accruedReward', internalType: 'uint256', type: 'uint256' }],
    name: 'FeeMarketplace__InsufficientUnlockedBalance'
  },
  { type: 'error', inputs: [], name: 'FeeMarketplace__InvalidAmount' },
  { type: 'error', inputs: [], name: 'FeeMarketplace__InvalidReceiver' },
  { type: 'error', inputs: [], name: 'FeeMarketplace__NotAuctionableToken' },
  { type: 'error', inputs: [], name: 'FeeMarketplace__ZeroDeposit' },
  { type: 'error', inputs: [], name: 'KeeperRouter__FailedRefundExecutionFee' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' }
    ],
    name: 'Mirror__DustTransferFailed'
  },
  {
    type: 'error',
    inputs: [{ name: 'requestKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'Mirror__ExecutionRequestMissing'
  },
  { type: 'error', inputs: [], name: 'Mirror__InitialMustBeIncrease' },
  {
    type: 'error',
    inputs: [
      { name: 'allocation', internalType: 'uint256', type: 'uint256' },
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Mirror__InsufficientAllocationForKeeperFee'
  },
  {
    type: 'error',
    inputs: [
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Mirror__InsufficientGmxExecutionFee'
  },
  {
    type: 'error',
    inputs: [{ name: 'allocationAddress', internalType: 'address', type: 'address' }],
    name: 'Mirror__InvalidAllocation'
  },
  { type: 'error', inputs: [], name: 'Mirror__InvalidCollateralDelta' },
  { type: 'error', inputs: [], name: 'Mirror__InvalidCurrentLeverage' },
  {
    type: 'error',
    inputs: [],
    name: 'Mirror__InvalidKeeperExecutionFeeAmount'
  },
  { type: 'error', inputs: [], name: 'Mirror__InvalidSizeDelta' },
  {
    type: 'error',
    inputs: [
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
      { name: 'allocationAmount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Mirror__KeeperFeeExceedsAdjustmentRatio'
  },
  {
    type: 'error',
    inputs: [
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
      { name: 'allocationAmount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Mirror__KeeperFeeExceedsCostFactor'
  },
  {
    type: 'error',
    inputs: [
      { name: 'totalPaid', internalType: 'uint256', type: 'uint256' },
      { name: 'requiredFee', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Mirror__KeeperFeeNotFullyCovered'
  },
  { type: 'error', inputs: [], name: 'Mirror__NoAdjustmentRequired' },
  { type: 'error', inputs: [], name: 'Mirror__OrderCreationFailed' },
  {
    type: 'error',
    inputs: [{ name: 'allocationAddress', internalType: 'address', type: 'address' }],
    name: 'Mirror__PositionNotFound'
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
      { name: 'positionKey', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'Mirror__PositionNotStalled'
  },
  { type: 'error', inputs: [], name: 'Mirror__PuppetListEmpty' },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'provided', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Mirror__PuppetListMismatch'
  },
  {
    type: 'error',
    inputs: [{ name: 'allocationAddress', internalType: 'address', type: 'address' }],
    name: 'Mirror__TraderCollateralZero'
  },
  {
    type: 'error',
    inputs: [
      { name: 'trader', internalType: 'address', type: 'address' },
      { name: 'positionKey', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'Mirror__TraderPositionNotFound'
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'PuppetVoteToken__Unsupported' },
  {
    type: 'error',
    inputs: [{ name: 'accured', internalType: 'uint256', type: 'uint256' }],
    name: 'RewardDistributor__InsufficientRewards'
  },
  { type: 'error', inputs: [], name: 'RewardDistributor__InvalidAmount' },
  {
    type: 'error',
    inputs: [
      {
        name: 'minAllocationActivity',
        internalType: 'uint256',
        type: 'uint256'
      },
      {
        name: 'maxAllocationActivity',
        internalType: 'uint256',
        type: 'uint256'
      }
    ],
    name: 'Rule__InvalidActivityThrottle'
  },
  {
    type: 'error',
    inputs: [
      { name: 'min', internalType: 'uint256', type: 'uint256' },
      { name: 'max', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Rule__InvalidAllowanceRate'
  },
  {
    type: 'error',
    inputs: [{ name: 'minExpiryDuration', internalType: 'uint256', type: 'uint256' }],
    name: 'Rule__InvalidExpiryDuration'
  },
  {
    type: 'error',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'threshold', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Settle__AmountExceedsDustThreshold'
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'Settle__DustThresholdNotSet'
  },
  {
    type: 'error',
    inputs: [{ name: 'allocationAddress', internalType: 'address', type: 'address' }],
    name: 'Settle__InvalidAllocation'
  },
  {
    type: 'error',
    inputs: [],
    name: 'Settle__InvalidKeeperExecutionFeeAmount'
  },
  {
    type: 'error',
    inputs: [],
    name: 'Settle__InvalidKeeperExecutionFeeReceiver'
  },
  { type: 'error', inputs: [], name: 'Settle__InvalidReceiver' },
  {
    type: 'error',
    inputs: [
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
      { name: 'settledAmount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Settle__KeeperFeeExceedsSettledAmount'
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' }
    ],
    name: 'Settle__NoDustToCollect'
  },
  {
    type: 'error',
    inputs: [
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
      { name: 'maximum', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Settle__PuppetListExceedsMaximum'
  },
  { type: 'error', inputs: [], name: 'TokenRouter__EmptyTokenTranferGasLimit' },
  { type: 'error', inputs: [], name: 'TransferUtils__EmptyHoldingAddress' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'contract IERC20', type: 'address' }],
    name: 'TransferUtils__EmptyTokenTransferGasLimit'
  },
  { type: 'error', inputs: [], name: 'TransferUtils__InvalidReceiver' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'contract IERC20', type: 'address' }],
    name: 'TransferUtils__SafeERC20FailedOperation'
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'TransferUtils__TokenTransferError'
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'TransferUtils__TokenTransferFromError'
  },
  { type: 'error', inputs: [], name: 'VotingEscrow__ExceedMaxTime' },
  {
    type: 'error',
    inputs: [{ name: 'accured', internalType: 'uint256', type: 'uint256' }],
    name: 'VotingEscrow__ExceedingAccruedAmount'
  },
  { type: 'error', inputs: [], name: 'VotingEscrow__ZeroAmount' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const errorsAbi = [
  { type: 'error', inputs: [], name: 'FailedCall' },
  { type: 'error', inputs: [], name: 'FailedDeployment' },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'InsufficientBalance'
  },
  {
    type: 'error',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'MissingPrecompile'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FeeMarketplace
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const feeMarketplaceAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address'
      },
      {
        name: '_protocolToken',
        internalType: 'contract PuppetToken',
        type: 'address'
      },
      {
        name: '_store',
        internalType: 'contract FeeMarketplaceStore',
        type: 'address'
      },
      {
        name: '_config',
        internalType: 'struct FeeMarketplace.Config',
        type: 'tuple',
        components: [
          {
            name: 'transferOutGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'distributionTimeframe',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'burnBasisPoints', internalType: 'uint256', type: 'uint256' }
        ]
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_feeToken', internalType: 'contract IERC20', type: 'address' },
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_purchaseAmount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'acceptOffer',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    name: 'askAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' }
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'collectDistribution',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_feeToken', internalType: 'contract IERC20', type: 'address' },
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'distributionBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'getConfig',
    outputs: [
      {
        name: '',
        internalType: 'struct FeeMarketplace.Config',
        type: 'tuple',
        components: [
          {
            name: 'transferOutGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'distributionTimeframe',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'burnBasisPoints', internalType: 'uint256', type: 'uint256' }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'feeToken', internalType: 'contract IERC20', type: 'address' }],
    name: 'getPendingUnlock',
    outputs: [{ name: 'pending', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'feeToken', internalType: 'contract IERC20', type: 'address' }],
    name: 'getTotalUnlocked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    name: 'lastDistributionTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolToken',
    outputs: [{ name: '', internalType: 'contract PuppetToken', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_feeToken', internalType: 'contract IERC20', type: 'address' }],
    name: 'recordTransferIn',
    outputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_feeToken', internalType: 'contract IERC20', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'setAskPrice',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'store',
    outputs: [
      {
        name: '',
        internalType: 'contract FeeMarketplaceStore',
        type: 'address'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    name: 'unclockedFees',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'error',
    inputs: [
      { name: 'requested', internalType: 'uint256', type: 'uint256' },
      { name: 'available', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'FeeMarketplace__InsufficientDistributionBalance'
  },
  {
    type: 'error',
    inputs: [{ name: 'accruedReward', internalType: 'uint256', type: 'uint256' }],
    name: 'FeeMarketplace__InsufficientUnlockedBalance'
  },
  { type: 'error', inputs: [], name: 'FeeMarketplace__InvalidAmount' },
  { type: 'error', inputs: [], name: 'FeeMarketplace__InvalidReceiver' },
  { type: 'error', inputs: [], name: 'FeeMarketplace__NotAuctionableToken' },
  { type: 'error', inputs: [], name: 'FeeMarketplace__ZeroDeposit' },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FeeMarketplaceStore
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const feeMarketplaceStoreAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address'
      },
      {
        name: '_router',
        internalType: 'contract TokenRouter',
        type: 'address'
      },
      {
        name: '_protocolToken',
        internalType: 'contract PuppetToken',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'contract IERC20', type: 'address' }],
    name: 'getTokenBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolToken',
    outputs: [{ name: '', internalType: 'contract PuppetToken', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'contract IERC20', type: 'address' }],
    name: 'recordTransferIn',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setAccess',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'contract IERC20', type: 'address' }],
    name: 'syncTokenBalance',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    name: 'tokenBalanceMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferIn',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'gasLimit', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferOut',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  { type: 'error', inputs: [], name: 'Access__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Access__Unauthorized' },
  { type: 'error', inputs: [], name: 'BankStore__InsufficientBalance' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'TransferUtils__TokenTransferError'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GmxPositionUtils
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const gmxPositionUtilsAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'COLLATERAL_AMOUNT_KEY',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'DECREASED_AT_TIME',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'INCREASED_AT_TIME',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'SIZE_IN_TOKENS_KEY',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'SIZE_IN_USD_KEY',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IAuthority
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iAuthorityAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'method', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'logEvent',
    outputs: [],
    stateMutability: 'nonpayable'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IBeacon
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iBeaconAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'implementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155ErrorsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC1155InsufficientBalance'
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover'
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC1155InvalidArrayLength'
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator'
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver'
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender'
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' }
    ],
    name: 'ERC1155MissingApprovalForAll'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC165
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc165Abi = [
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1967
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1967Abi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false
      }
    ],
    name: 'AdminChanged'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'BeaconUpgraded'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'Upgraded'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20Abi = [
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Approval'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Transfer'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20ErrorsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC20InsufficientAllowance'
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC20InsufficientBalance'
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover'
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver'
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender'
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Metadata
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20MetadataAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Approval'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Transfer'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Mintable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20MintableAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Approval'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Transfer'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC5267
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc5267Abi = [
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' }
    ],
    stateMutability: 'view'
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC5805
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc5805Abi = [
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'DelegateChanged'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'previousVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'newVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'DelegateVotesChanged'
  },
  {
    type: 'error',
    inputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
    name: 'VotesExpiredSignature'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC6372
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc6372Abi = [
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC721Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc721ErrorsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' }
    ],
    name: 'ERC721IncorrectOwner'
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC721InsufficientApproval'
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidApprover'
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOperator'
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOwner'
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidReceiver'
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidSender'
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC721NonexistentToken'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IGmxExchangeRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iGmxExchangeRouterAbi = [
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'cancelOrder',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'markets', internalType: 'address[]', type: 'address[]' },
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
      { name: 'receiver', internalType: 'address', type: 'address' }
    ],
    name: 'claimAffiliateRewards',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'markets', internalType: 'address[]', type: 'address[]' },
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
      { name: 'receiver', internalType: 'address', type: 'address' }
    ],
    name: 'claimFundingFees',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct GmxPositionUtils.CreateOrderParams',
        type: 'tuple',
        components: [
          {
            name: 'addresses',
            internalType: 'struct GmxPositionUtils.CreateOrderParamsAddresses',
            type: 'tuple',
            components: [
              { name: 'receiver', internalType: 'address', type: 'address' },
              {
                name: 'cancellationReceiver',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'callbackContract',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'uiFeeReceiver',
                internalType: 'address',
                type: 'address'
              },
              { name: 'market', internalType: 'address', type: 'address' },
              {
                name: 'initialCollateralToken',
                internalType: 'contract IERC20',
                type: 'address'
              },
              {
                name: 'swapPath',
                internalType: 'address[]',
                type: 'address[]'
              }
            ]
          },
          {
            name: 'numbers',
            internalType: 'struct GmxPositionUtils.CreateOrderParamsNumbers',
            type: 'tuple',
            components: [
              {
                name: 'sizeDeltaUsd',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'initialCollateralDeltaAmount',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'triggerPrice',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'acceptablePrice',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'executionFee',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'callbackGasLimit',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'minOutputAmount',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'validFromTime',
                internalType: 'uint256',
                type: 'uint256'
              }
            ]
          },
          {
            name: 'orderType',
            internalType: 'enum GmxPositionUtils.OrderType',
            type: 'uint8'
          },
          {
            name: 'decreasePositionSwapType',
            internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
            type: 'uint8'
          },
          { name: 'isLong', internalType: 'bool', type: 'bool' },
          {
            name: 'shouldUnwrapNativeToken',
            internalType: 'bool',
            type: 'bool'
          },
          { name: 'autoCancel', internalType: 'bool', type: 'bool' },
          { name: 'referralCode', internalType: 'bytes32', type: 'bytes32' }
        ]
      }
    ],
    name: 'createOrder',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'sendNativeToken',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'sendTokens',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'sendWnt',
    outputs: [],
    stateMutability: 'payable'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IGmxOracle
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iGmxOracleAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'dataStore', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' }
    ],
    name: 'getStablePrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IGmxOrderCallbackReceiver
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iGmxOrderCallbackReceiverAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'key', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'order',
        internalType: 'struct GmxPositionUtils.Props',
        type: 'tuple',
        components: [
          {
            name: 'addresses',
            internalType: 'struct GmxPositionUtils.Addresses',
            type: 'tuple',
            components: [
              { name: 'account', internalType: 'address', type: 'address' },
              { name: 'receiver', internalType: 'address', type: 'address' },
              {
                name: 'cancellationReceiver',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'callbackContract',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'uiFeeReceiver',
                internalType: 'address',
                type: 'address'
              },
              { name: 'market', internalType: 'address', type: 'address' },
              {
                name: 'initialCollateralToken',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'swapPath',
                internalType: 'address[]',
                type: 'address[]'
              }
            ]
          },
          {
            name: 'numbers',
            internalType: 'struct GmxPositionUtils.Numbers',
            type: 'tuple',
            components: [
              {
                name: 'orderType',
                internalType: 'enum GmxPositionUtils.OrderType',
                type: 'uint8'
              },
              {
                name: 'decreasePositionSwapType',
                internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
                type: 'uint8'
              },
              {
                name: 'sizeDeltaUsd',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'initialCollateralDeltaAmount',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'triggerPrice',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'acceptablePrice',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'executionFee',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'callbackGasLimit',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'minOutputAmount',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'updatedAtTime',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'validFromTime',
                internalType: 'uint256',
                type: 'uint256'
              }
            ]
          },
          {
            name: 'flags',
            internalType: 'struct GmxPositionUtils.Flags',
            type: 'tuple',
            components: [
              { name: 'isLong', internalType: 'bool', type: 'bool' },
              {
                name: 'shouldUnwrapNativeToken',
                internalType: 'bool',
                type: 'bool'
              },
              { name: 'isFrozen', internalType: 'bool', type: 'bool' },
              { name: 'autoCancel', internalType: 'bool', type: 'bool' }
            ]
          }
        ]
      },
      {
        name: 'eventData',
        internalType: 'struct GmxPositionUtils.EventLogData',
        type: 'tuple',
        components: [
          {
            name: 'addressItems',
            internalType: 'struct GmxPositionUtils.AddressItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.AddressKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'address', type: 'address' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.AddressArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'address[]',
                    type: 'address[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'uintItems',
            internalType: 'struct GmxPositionUtils.UintItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.UintKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'uint256', type: 'uint256' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.UintArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'uint256[]',
                    type: 'uint256[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'intItems',
            internalType: 'struct GmxPositionUtils.IntItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.IntKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256', type: 'int256' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.IntArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256[]', type: 'int256[]' }
                ]
              }
            ]
          },
          {
            name: 'boolItems',
            internalType: 'struct GmxPositionUtils.BoolItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.BoolKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool', type: 'bool' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BoolArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool[]', type: 'bool[]' }
                ]
              }
            ]
          },
          {
            name: 'bytes32Items',
            internalType: 'struct GmxPositionUtils.Bytes32Items',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.Bytes32KeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes32', type: 'bytes32' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.Bytes32ArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'bytes32[]',
                    type: 'bytes32[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'bytesItems',
            internalType: 'struct GmxPositionUtils.BytesItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.BytesKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes', type: 'bytes' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BytesArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes[]', type: 'bytes[]' }
                ]
              }
            ]
          },
          {
            name: 'stringItems',
            internalType: 'struct GmxPositionUtils.StringItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.StringKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string', type: 'string' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.StringArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string[]', type: 'string[]' }
                ]
              }
            ]
          }
        ]
      }
    ],
    name: 'afterOrderCancellation',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'key', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'order',
        internalType: 'struct GmxPositionUtils.Props',
        type: 'tuple',
        components: [
          {
            name: 'addresses',
            internalType: 'struct GmxPositionUtils.Addresses',
            type: 'tuple',
            components: [
              { name: 'account', internalType: 'address', type: 'address' },
              { name: 'receiver', internalType: 'address', type: 'address' },
              {
                name: 'cancellationReceiver',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'callbackContract',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'uiFeeReceiver',
                internalType: 'address',
                type: 'address'
              },
              { name: 'market', internalType: 'address', type: 'address' },
              {
                name: 'initialCollateralToken',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'swapPath',
                internalType: 'address[]',
                type: 'address[]'
              }
            ]
          },
          {
            name: 'numbers',
            internalType: 'struct GmxPositionUtils.Numbers',
            type: 'tuple',
            components: [
              {
                name: 'orderType',
                internalType: 'enum GmxPositionUtils.OrderType',
                type: 'uint8'
              },
              {
                name: 'decreasePositionSwapType',
                internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
                type: 'uint8'
              },
              {
                name: 'sizeDeltaUsd',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'initialCollateralDeltaAmount',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'triggerPrice',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'acceptablePrice',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'executionFee',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'callbackGasLimit',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'minOutputAmount',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'updatedAtTime',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'validFromTime',
                internalType: 'uint256',
                type: 'uint256'
              }
            ]
          },
          {
            name: 'flags',
            internalType: 'struct GmxPositionUtils.Flags',
            type: 'tuple',
            components: [
              { name: 'isLong', internalType: 'bool', type: 'bool' },
              {
                name: 'shouldUnwrapNativeToken',
                internalType: 'bool',
                type: 'bool'
              },
              { name: 'isFrozen', internalType: 'bool', type: 'bool' },
              { name: 'autoCancel', internalType: 'bool', type: 'bool' }
            ]
          }
        ]
      },
      {
        name: 'eventData',
        internalType: 'struct GmxPositionUtils.EventLogData',
        type: 'tuple',
        components: [
          {
            name: 'addressItems',
            internalType: 'struct GmxPositionUtils.AddressItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.AddressKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'address', type: 'address' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.AddressArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'address[]',
                    type: 'address[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'uintItems',
            internalType: 'struct GmxPositionUtils.UintItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.UintKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'uint256', type: 'uint256' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.UintArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'uint256[]',
                    type: 'uint256[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'intItems',
            internalType: 'struct GmxPositionUtils.IntItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.IntKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256', type: 'int256' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.IntArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256[]', type: 'int256[]' }
                ]
              }
            ]
          },
          {
            name: 'boolItems',
            internalType: 'struct GmxPositionUtils.BoolItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.BoolKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool', type: 'bool' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BoolArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool[]', type: 'bool[]' }
                ]
              }
            ]
          },
          {
            name: 'bytes32Items',
            internalType: 'struct GmxPositionUtils.Bytes32Items',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.Bytes32KeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes32', type: 'bytes32' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.Bytes32ArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'bytes32[]',
                    type: 'bytes32[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'bytesItems',
            internalType: 'struct GmxPositionUtils.BytesItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.BytesKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes', type: 'bytes' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BytesArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes[]', type: 'bytes[]' }
                ]
              }
            ]
          },
          {
            name: 'stringItems',
            internalType: 'struct GmxPositionUtils.StringItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.StringKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string', type: 'string' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.StringArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string[]', type: 'string[]' }
                ]
              }
            ]
          }
        ]
      }
    ],
    name: 'afterOrderExecution',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'key', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'order',
        internalType: 'struct GmxPositionUtils.Props',
        type: 'tuple',
        components: [
          {
            name: 'addresses',
            internalType: 'struct GmxPositionUtils.Addresses',
            type: 'tuple',
            components: [
              { name: 'account', internalType: 'address', type: 'address' },
              { name: 'receiver', internalType: 'address', type: 'address' },
              {
                name: 'cancellationReceiver',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'callbackContract',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'uiFeeReceiver',
                internalType: 'address',
                type: 'address'
              },
              { name: 'market', internalType: 'address', type: 'address' },
              {
                name: 'initialCollateralToken',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'swapPath',
                internalType: 'address[]',
                type: 'address[]'
              }
            ]
          },
          {
            name: 'numbers',
            internalType: 'struct GmxPositionUtils.Numbers',
            type: 'tuple',
            components: [
              {
                name: 'orderType',
                internalType: 'enum GmxPositionUtils.OrderType',
                type: 'uint8'
              },
              {
                name: 'decreasePositionSwapType',
                internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
                type: 'uint8'
              },
              {
                name: 'sizeDeltaUsd',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'initialCollateralDeltaAmount',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'triggerPrice',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'acceptablePrice',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'executionFee',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'callbackGasLimit',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'minOutputAmount',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'updatedAtTime',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'validFromTime',
                internalType: 'uint256',
                type: 'uint256'
              }
            ]
          },
          {
            name: 'flags',
            internalType: 'struct GmxPositionUtils.Flags',
            type: 'tuple',
            components: [
              { name: 'isLong', internalType: 'bool', type: 'bool' },
              {
                name: 'shouldUnwrapNativeToken',
                internalType: 'bool',
                type: 'bool'
              },
              { name: 'isFrozen', internalType: 'bool', type: 'bool' },
              { name: 'autoCancel', internalType: 'bool', type: 'bool' }
            ]
          }
        ]
      },
      {
        name: 'eventData',
        internalType: 'struct GmxPositionUtils.EventLogData',
        type: 'tuple',
        components: [
          {
            name: 'addressItems',
            internalType: 'struct GmxPositionUtils.AddressItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.AddressKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'address', type: 'address' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.AddressArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'address[]',
                    type: 'address[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'uintItems',
            internalType: 'struct GmxPositionUtils.UintItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.UintKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'uint256', type: 'uint256' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.UintArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'uint256[]',
                    type: 'uint256[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'intItems',
            internalType: 'struct GmxPositionUtils.IntItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.IntKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256', type: 'int256' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.IntArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256[]', type: 'int256[]' }
                ]
              }
            ]
          },
          {
            name: 'boolItems',
            internalType: 'struct GmxPositionUtils.BoolItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.BoolKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool', type: 'bool' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BoolArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool[]', type: 'bool[]' }
                ]
              }
            ]
          },
          {
            name: 'bytes32Items',
            internalType: 'struct GmxPositionUtils.Bytes32Items',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.Bytes32KeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes32', type: 'bytes32' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.Bytes32ArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'bytes32[]',
                    type: 'bytes32[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'bytesItems',
            internalType: 'struct GmxPositionUtils.BytesItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.BytesKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes', type: 'bytes' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BytesArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes[]', type: 'bytes[]' }
                ]
              }
            ]
          },
          {
            name: 'stringItems',
            internalType: 'struct GmxPositionUtils.StringItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.StringKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string', type: 'string' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.StringArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string[]', type: 'string[]' }
                ]
              }
            ]
          }
        ]
      }
    ],
    name: 'afterOrderFrozen',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'key', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'eventData',
        internalType: 'struct GmxPositionUtils.EventLogData',
        type: 'tuple',
        components: [
          {
            name: 'addressItems',
            internalType: 'struct GmxPositionUtils.AddressItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.AddressKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'address', type: 'address' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.AddressArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'address[]',
                    type: 'address[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'uintItems',
            internalType: 'struct GmxPositionUtils.UintItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.UintKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'uint256', type: 'uint256' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.UintArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'uint256[]',
                    type: 'uint256[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'intItems',
            internalType: 'struct GmxPositionUtils.IntItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.IntKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256', type: 'int256' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.IntArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256[]', type: 'int256[]' }
                ]
              }
            ]
          },
          {
            name: 'boolItems',
            internalType: 'struct GmxPositionUtils.BoolItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.BoolKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool', type: 'bool' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BoolArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool[]', type: 'bool[]' }
                ]
              }
            ]
          },
          {
            name: 'bytes32Items',
            internalType: 'struct GmxPositionUtils.Bytes32Items',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.Bytes32KeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes32', type: 'bytes32' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.Bytes32ArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'bytes32[]',
                    type: 'bytes32[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'bytesItems',
            internalType: 'struct GmxPositionUtils.BytesItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.BytesKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes', type: 'bytes' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BytesArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes[]', type: 'bytes[]' }
                ]
              }
            ]
          },
          {
            name: 'stringItems',
            internalType: 'struct GmxPositionUtils.StringItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.StringKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string', type: 'string' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.StringArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string[]', type: 'string[]' }
                ]
              }
            ]
          }
        ]
      }
    ],
    name: 'refundExecutionFee',
    outputs: [],
    stateMutability: 'payable'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IGmxReadDataStore
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iGmxReadDataStoreAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'setKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'value', internalType: 'address', type: 'address' }
    ],
    name: 'addAddress',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'setKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'value', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'addBytes32',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'setKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'addUint',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'setKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'value', internalType: 'address', type: 'address' }
    ],
    name: 'containsAddress',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'setKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'value', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'containsBytes32',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'setKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'containsUint',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getAddressArray',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'setKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getAddressCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'setKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'start', internalType: 'uint256', type: 'uint256' },
      { name: 'end', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'getAddressValuesAt',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getBoolArray',
    outputs: [{ name: '', internalType: 'bool[]', type: 'bool[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getBytes32',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getBytes32Array',
    outputs: [{ name: '', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'setKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getBytes32Count',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'setKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'start', internalType: 'uint256', type: 'uint256' },
      { name: 'end', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'getBytes32ValuesAt',
    outputs: [{ name: '', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getInt',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getIntArray',
    outputs: [{ name: '', internalType: 'int256[]', type: 'int256[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getString',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getStringArray',
    outputs: [{ name: '', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getUintArray',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'setKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getUintCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'setKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'start', internalType: 'uint256', type: 'uint256' },
      { name: 'end', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'getUintValuesAt',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'setKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'value', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'removeBytes32',
    outputs: [],
    stateMutability: 'nonpayable'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IGmxReferralStorage
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iGmxReferralStorageAbi = [
  {
    type: 'function',
    inputs: [{ name: '_code', internalType: 'bytes32', type: 'bytes32' }],
    name: 'codeOwners',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_account', internalType: 'address', type: 'address' }],
    name: 'getTraderReferralInfo',
    outputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'address', type: 'address' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_code', internalType: 'bytes32', type: 'bytes32' },
      { name: '_newAccount', internalType: 'address', type: 'address' }
    ],
    name: 'govSetCodeOwner',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_account', internalType: 'address', type: 'address' }],
    name: 'referrerDiscountShares',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_account', internalType: 'address', type: 'address' }],
    name: 'referrerTiers',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_codeHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_owner', internalType: 'address', type: 'address' }
    ],
    name: 'setCodeOwner',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_referrer', internalType: 'address', type: 'address' },
      { name: '_tierId', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'setReferrerTier',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_tierId', internalType: 'uint256', type: 'uint256' },
      { name: '_totalRebate', internalType: 'uint256', type: 'uint256' },
      { name: '_discountShare', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'setTier',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_account', internalType: 'address', type: 'address' },
      { name: '_code', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'setTraderReferralCode',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_tierLevel', internalType: 'uint256', type: 'uint256' }],
    name: 'tiers',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_account', internalType: 'address', type: 'address' }],
    name: 'traderReferralCodes',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IMulticall3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iMulticall3Abi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' }
        ]
      }
    ],
    name: 'aggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'returnData', internalType: 'bytes[]', type: 'bytes[]' }
    ],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call3[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'allowFailure', internalType: 'bool', type: 'bool' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' }
        ]
      }
    ],
    name: 'aggregate3',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' }
        ]
      }
    ],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call3Value[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'allowFailure', internalType: 'bool', type: 'bool' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' }
        ]
      }
    ],
    name: 'aggregate3Value',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' }
        ]
      }
    ],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' }
        ]
      }
    ],
    name: 'blockAndAggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' }
        ]
      }
    ],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBasefee',
    outputs: [{ name: 'basefee', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'blockNumber', internalType: 'uint256', type: 'uint256' }],
    name: 'getBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBlockNumber',
    outputs: [{ name: 'blockNumber', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChainId',
    outputs: [{ name: 'chainid', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockCoinbase',
    outputs: [{ name: 'coinbase', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockDifficulty',
    outputs: [{ name: 'difficulty', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockGasLimit',
    outputs: [{ name: 'gaslimit', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockTimestamp',
    outputs: [{ name: 'timestamp', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'getEthBalance',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLastBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'requireSuccess', internalType: 'bool', type: 'bool' },
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' }
        ]
      }
    ],
    name: 'tryAggregate',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' }
        ]
      }
    ],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'requireSuccess', internalType: 'bool', type: 'bool' },
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' }
        ]
      }
    ],
    name: 'tryBlockAndAggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' }
        ]
      }
    ],
    stateMutability: 'payable'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IUniswapV3Pool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iUniswapV3PoolAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount', internalType: 'uint128', type: 'uint128' }
    ],
    name: 'burn',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount0Requested', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1Requested', internalType: 'uint128', type: 'uint128' }
    ],
    name: 'collect',
    outputs: [
      { name: 'amount0', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1', internalType: 'uint128', type: 'uint128' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount0Requested', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1Requested', internalType: 'uint128', type: 'uint128' }
    ],
    name: 'collectProtocol',
    outputs: [
      { name: 'amount0', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1', internalType: 'uint128', type: 'uint128' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'fee',
    outputs: [{ name: '', internalType: 'uint24', type: 'uint24' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeGrowthGlobal0X128',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeGrowthGlobal1X128',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'flash',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'observationCardinalityNext',
        internalType: 'uint16',
        type: 'uint16'
      }
    ],
    name: 'increaseObservationCardinalityNext',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'liquidity',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxLiquidityPerTick',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount', internalType: 'uint128', type: 'uint128' },
      { name: 'data', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'mint',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'observations',
    outputs: [
      { name: 'blockTimestamp', internalType: 'uint32', type: 'uint32' },
      { name: 'tickCumulative', internalType: 'int56', type: 'int56' },
      {
        name: 'secondsPerLiquidityCumulativeX128',
        internalType: 'uint160',
        type: 'uint160'
      },
      { name: 'initialized', internalType: 'bool', type: 'bool' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'secondsAgos', internalType: 'uint32[]', type: 'uint32[]' }],
    name: 'observe',
    outputs: [
      { name: 'tickCumulatives', internalType: 'int56[]', type: 'int56[]' },
      {
        name: 'secondsPerLiquidityCumulativeX128s',
        internalType: 'uint160[]',
        type: 'uint160[]'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'positions',
    outputs: [
      { name: '_liquidity', internalType: 'uint128', type: 'uint128' },
      {
        name: 'feeGrowthInside0LastX128',
        internalType: 'uint256',
        type: 'uint256'
      },
      {
        name: 'feeGrowthInside1LastX128',
        internalType: 'uint256',
        type: 'uint256'
      },
      { name: 'tokensOwed0', internalType: 'uint128', type: 'uint128' },
      { name: 'tokensOwed1', internalType: 'uint128', type: 'uint128' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolFees',
    outputs: [
      { name: 'token0', internalType: 'uint128', type: 'uint128' },
      { name: 'token1', internalType: 'uint128', type: 'uint128' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'feeProtocol0', internalType: 'uint8', type: 'uint8' },
      { name: 'feeProtocol1', internalType: 'uint8', type: 'uint8' }
    ],
    name: 'setFeeProtocol',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'slot0',
    outputs: [
      { name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
      { name: 'tick', internalType: 'int24', type: 'int24' },
      { name: 'observationIndex', internalType: 'uint16', type: 'uint16' },
      {
        name: 'observationCardinality',
        internalType: 'uint16',
        type: 'uint16'
      },
      {
        name: 'observationCardinalityNext',
        internalType: 'uint16',
        type: 'uint16'
      },
      { name: 'feeProtocol', internalType: 'uint8', type: 'uint8' },
      { name: 'unlocked', internalType: 'bool', type: 'bool' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' }
    ],
    name: 'snapshotCumulativesInside',
    outputs: [
      { name: 'tickCumulativeInside', internalType: 'int56', type: 'int56' },
      {
        name: 'secondsPerLiquidityInsideX128',
        internalType: 'uint160',
        type: 'uint160'
      },
      { name: 'secondsInside', internalType: 'uint32', type: 'uint32' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'zeroForOne', internalType: 'bool', type: 'bool' },
      { name: 'amountSpecified', internalType: 'int256', type: 'int256' },
      { name: 'sqrtPriceLimitX96', internalType: 'uint160', type: 'uint160' },
      { name: 'data', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'swap',
    outputs: [
      { name: 'amount0', internalType: 'int256', type: 'int256' },
      { name: 'amount1', internalType: 'int256', type: 'int256' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'wordPosition', internalType: 'int16', type: 'int16' }],
    name: 'tickBitmap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'tickSpacing',
    outputs: [{ name: '', internalType: 'int24', type: 'int24' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'tick', internalType: 'int24', type: 'int24' }],
    name: 'ticks',
    outputs: [
      { name: 'liquidityGross', internalType: 'uint128', type: 'uint128' },
      { name: 'liquidityNet', internalType: 'int128', type: 'int128' },
      {
        name: 'feeGrowthOutside0X128',
        internalType: 'uint256',
        type: 'uint256'
      },
      {
        name: 'feeGrowthOutside1X128',
        internalType: 'uint256',
        type: 'uint256'
      },
      { name: 'tickCumulativeOutside', internalType: 'int56', type: 'int56' },
      {
        name: 'secondsPerLiquidityOutsideX128',
        internalType: 'uint160',
        type: 'uint160'
      },
      { name: 'secondsOutside', internalType: 'uint32', type: 'uint32' },
      { name: 'initialized', internalType: 'bool', type: 'bool' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'token0',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'token1',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true
      },
      {
        name: 'amount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Burn'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true
      },
      {
        name: 'amount0',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false
      },
      {
        name: 'amount1',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false
      }
    ],
    name: 'Collect'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'amount0',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false
      },
      {
        name: 'amount1',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false
      }
    ],
    name: 'CollectProtocol'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'paid0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'paid1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Flash'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'observationCardinalityNextOld',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false
      },
      {
        name: 'observationCardinalityNextNew',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false
      }
    ],
    name: 'IncreaseObservationCardinalityNext'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sqrtPriceX96',
        internalType: 'uint160',
        type: 'uint160',
        indexed: false
      },
      { name: 'tick', internalType: 'int24', type: 'int24', indexed: false }
    ],
    name: 'Initialize'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true
      },
      {
        name: 'amount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Mint'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'feeProtocol0Old',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false
      },
      {
        name: 'feeProtocol1Old',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false
      },
      {
        name: 'feeProtocol0New',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false
      },
      {
        name: 'feeProtocol1New',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false
      }
    ],
    name: 'SetFeeProtocol'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'amount0',
        internalType: 'int256',
        type: 'int256',
        indexed: false
      },
      {
        name: 'amount1',
        internalType: 'int256',
        type: 'int256',
        indexed: false
      },
      {
        name: 'sqrtPriceX96',
        internalType: 'uint160',
        type: 'uint160',
        indexed: false
      },
      {
        name: 'liquidity',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false
      },
      { name: 'tick', internalType: 'int24', type: 'int24', indexed: false }
    ],
    name: 'Swap'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IUniswapV3PoolActions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iUniswapV3PoolActionsAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount', internalType: 'uint128', type: 'uint128' }
    ],
    name: 'burn',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount0Requested', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1Requested', internalType: 'uint128', type: 'uint128' }
    ],
    name: 'collect',
    outputs: [
      { name: 'amount0', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1', internalType: 'uint128', type: 'uint128' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'flash',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'observationCardinalityNext',
        internalType: 'uint16',
        type: 'uint16'
      }
    ],
    name: 'increaseObservationCardinalityNext',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount', internalType: 'uint128', type: 'uint128' },
      { name: 'data', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'mint',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'zeroForOne', internalType: 'bool', type: 'bool' },
      { name: 'amountSpecified', internalType: 'int256', type: 'int256' },
      { name: 'sqrtPriceLimitX96', internalType: 'uint160', type: 'uint160' },
      { name: 'data', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'swap',
    outputs: [
      { name: 'amount0', internalType: 'int256', type: 'int256' },
      { name: 'amount1', internalType: 'int256', type: 'int256' }
    ],
    stateMutability: 'nonpayable'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IUniswapV3PoolDerivedState
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iUniswapV3PoolDerivedStateAbi = [
  {
    type: 'function',
    inputs: [{ name: 'secondsAgos', internalType: 'uint32[]', type: 'uint32[]' }],
    name: 'observe',
    outputs: [
      { name: 'tickCumulatives', internalType: 'int56[]', type: 'int56[]' },
      {
        name: 'secondsPerLiquidityCumulativeX128s',
        internalType: 'uint160[]',
        type: 'uint160[]'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' }
    ],
    name: 'snapshotCumulativesInside',
    outputs: [
      { name: 'tickCumulativeInside', internalType: 'int56', type: 'int56' },
      {
        name: 'secondsPerLiquidityInsideX128',
        internalType: 'uint160',
        type: 'uint160'
      },
      { name: 'secondsInside', internalType: 'uint32', type: 'uint32' }
    ],
    stateMutability: 'view'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IUniswapV3PoolEvents
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iUniswapV3PoolEventsAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true
      },
      {
        name: 'amount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Burn'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true
      },
      {
        name: 'amount0',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false
      },
      {
        name: 'amount1',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false
      }
    ],
    name: 'Collect'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'amount0',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false
      },
      {
        name: 'amount1',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false
      }
    ],
    name: 'CollectProtocol'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'paid0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'paid1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Flash'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'observationCardinalityNextOld',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false
      },
      {
        name: 'observationCardinalityNextNew',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false
      }
    ],
    name: 'IncreaseObservationCardinalityNext'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sqrtPriceX96',
        internalType: 'uint160',
        type: 'uint160',
        indexed: false
      },
      { name: 'tick', internalType: 'int24', type: 'int24', indexed: false }
    ],
    name: 'Initialize'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true
      },
      {
        name: 'amount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Mint'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'feeProtocol0Old',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false
      },
      {
        name: 'feeProtocol1Old',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false
      },
      {
        name: 'feeProtocol0New',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false
      },
      {
        name: 'feeProtocol1New',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false
      }
    ],
    name: 'SetFeeProtocol'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'amount0',
        internalType: 'int256',
        type: 'int256',
        indexed: false
      },
      {
        name: 'amount1',
        internalType: 'int256',
        type: 'int256',
        indexed: false
      },
      {
        name: 'sqrtPriceX96',
        internalType: 'uint160',
        type: 'uint160',
        indexed: false
      },
      {
        name: 'liquidity',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false
      },
      { name: 'tick', internalType: 'int24', type: 'int24', indexed: false }
    ],
    name: 'Swap'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IUniswapV3PoolImmutables
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iUniswapV3PoolImmutablesAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'fee',
    outputs: [{ name: '', internalType: 'uint24', type: 'uint24' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxLiquidityPerTick',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'tickSpacing',
    outputs: [{ name: '', internalType: 'int24', type: 'int24' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'token0',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'token1',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IUniswapV3PoolOwnerActions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iUniswapV3PoolOwnerActionsAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount0Requested', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1Requested', internalType: 'uint128', type: 'uint128' }
    ],
    name: 'collectProtocol',
    outputs: [
      { name: 'amount0', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1', internalType: 'uint128', type: 'uint128' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'feeProtocol0', internalType: 'uint8', type: 'uint8' },
      { name: 'feeProtocol1', internalType: 'uint8', type: 'uint8' }
    ],
    name: 'setFeeProtocol',
    outputs: [],
    stateMutability: 'nonpayable'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IUniswapV3PoolState
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iUniswapV3PoolStateAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'feeGrowthGlobal0X128',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeGrowthGlobal1X128',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'liquidity',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'observations',
    outputs: [
      { name: 'blockTimestamp', internalType: 'uint32', type: 'uint32' },
      { name: 'tickCumulative', internalType: 'int56', type: 'int56' },
      {
        name: 'secondsPerLiquidityCumulativeX128',
        internalType: 'uint160',
        type: 'uint160'
      },
      { name: 'initialized', internalType: 'bool', type: 'bool' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'positions',
    outputs: [
      { name: '_liquidity', internalType: 'uint128', type: 'uint128' },
      {
        name: 'feeGrowthInside0LastX128',
        internalType: 'uint256',
        type: 'uint256'
      },
      {
        name: 'feeGrowthInside1LastX128',
        internalType: 'uint256',
        type: 'uint256'
      },
      { name: 'tokensOwed0', internalType: 'uint128', type: 'uint128' },
      { name: 'tokensOwed1', internalType: 'uint128', type: 'uint128' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolFees',
    outputs: [
      { name: 'token0', internalType: 'uint128', type: 'uint128' },
      { name: 'token1', internalType: 'uint128', type: 'uint128' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'slot0',
    outputs: [
      { name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
      { name: 'tick', internalType: 'int24', type: 'int24' },
      { name: 'observationIndex', internalType: 'uint16', type: 'uint16' },
      {
        name: 'observationCardinality',
        internalType: 'uint16',
        type: 'uint16'
      },
      {
        name: 'observationCardinalityNext',
        internalType: 'uint16',
        type: 'uint16'
      },
      { name: 'feeProtocol', internalType: 'uint8', type: 'uint8' },
      { name: 'unlocked', internalType: 'bool', type: 'bool' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'wordPosition', internalType: 'int16', type: 'int16' }],
    name: 'tickBitmap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'tick', internalType: 'int24', type: 'int24' }],
    name: 'ticks',
    outputs: [
      { name: 'liquidityGross', internalType: 'uint128', type: 'uint128' },
      { name: 'liquidityNet', internalType: 'int128', type: 'int128' },
      {
        name: 'feeGrowthOutside0X128',
        internalType: 'uint256',
        type: 'uint256'
      },
      {
        name: 'feeGrowthOutside1X128',
        internalType: 'uint256',
        type: 'uint256'
      },
      { name: 'tickCumulativeOutside', internalType: 'int56', type: 'int56' },
      {
        name: 'secondsPerLiquidityOutsideX128',
        internalType: 'uint160',
        type: 'uint160'
      },
      { name: 'secondsOutside', internalType: 'uint32', type: 'uint32' },
      { name: 'initialized', internalType: 'bool', type: 'bool' }
    ],
    stateMutability: 'view'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IVotes
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iVotesAbi = [
  {
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'DelegateChanged'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'previousVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'newVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'DelegateVotesChanged'
  },
  {
    type: 'error',
    inputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
    name: 'VotesExpiredSignature'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IWNT
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iwntAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Approval'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Transfer'
  },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'TransferFailed'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// KeeperRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const keeperRouterAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address'
      },
      { name: '_account', internalType: 'contract Account', type: 'address' },
      { name: '_ruleContract', internalType: 'contract Rule', type: 'address' },
      { name: '_mirror', internalType: 'contract Mirror', type: 'address' },
      { name: '_settle', internalType: 'contract Settle', type: 'address' },
      {
        name: '_config',
        internalType: 'struct KeeperRouter.Config',
        type: 'tuple',
        components: [
          {
            name: 'mirrorBaseGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'mirrorPerPuppetGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'adjustBaseGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'adjustPerPuppetGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'settleBaseGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'settlePerPuppetGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'fallbackRefundExecutionFeeReceiver',
            internalType: 'address',
            type: 'address'
          }
        ]
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'account',
    outputs: [{ name: '', internalType: 'contract Account', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      {
        name: '',
        internalType: 'struct GmxPositionUtils.Props',
        type: 'tuple',
        components: [
          {
            name: 'addresses',
            internalType: 'struct GmxPositionUtils.Addresses',
            type: 'tuple',
            components: [
              { name: 'account', internalType: 'address', type: 'address' },
              { name: 'receiver', internalType: 'address', type: 'address' },
              {
                name: 'cancellationReceiver',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'callbackContract',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'uiFeeReceiver',
                internalType: 'address',
                type: 'address'
              },
              { name: 'market', internalType: 'address', type: 'address' },
              {
                name: 'initialCollateralToken',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'swapPath',
                internalType: 'address[]',
                type: 'address[]'
              }
            ]
          },
          {
            name: 'numbers',
            internalType: 'struct GmxPositionUtils.Numbers',
            type: 'tuple',
            components: [
              {
                name: 'orderType',
                internalType: 'enum GmxPositionUtils.OrderType',
                type: 'uint8'
              },
              {
                name: 'decreasePositionSwapType',
                internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
                type: 'uint8'
              },
              {
                name: 'sizeDeltaUsd',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'initialCollateralDeltaAmount',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'triggerPrice',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'acceptablePrice',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'executionFee',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'callbackGasLimit',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'minOutputAmount',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'updatedAtTime',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'validFromTime',
                internalType: 'uint256',
                type: 'uint256'
              }
            ]
          },
          {
            name: 'flags',
            internalType: 'struct GmxPositionUtils.Flags',
            type: 'tuple',
            components: [
              { name: 'isLong', internalType: 'bool', type: 'bool' },
              {
                name: 'shouldUnwrapNativeToken',
                internalType: 'bool',
                type: 'bool'
              },
              { name: 'isFrozen', internalType: 'bool', type: 'bool' },
              { name: 'autoCancel', internalType: 'bool', type: 'bool' }
            ]
          }
        ]
      },
      {
        name: '',
        internalType: 'struct GmxPositionUtils.EventLogData',
        type: 'tuple',
        components: [
          {
            name: 'addressItems',
            internalType: 'struct GmxPositionUtils.AddressItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.AddressKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'address', type: 'address' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.AddressArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'address[]',
                    type: 'address[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'uintItems',
            internalType: 'struct GmxPositionUtils.UintItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.UintKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'uint256', type: 'uint256' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.UintArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'uint256[]',
                    type: 'uint256[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'intItems',
            internalType: 'struct GmxPositionUtils.IntItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.IntKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256', type: 'int256' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.IntArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256[]', type: 'int256[]' }
                ]
              }
            ]
          },
          {
            name: 'boolItems',
            internalType: 'struct GmxPositionUtils.BoolItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.BoolKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool', type: 'bool' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BoolArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool[]', type: 'bool[]' }
                ]
              }
            ]
          },
          {
            name: 'bytes32Items',
            internalType: 'struct GmxPositionUtils.Bytes32Items',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.Bytes32KeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes32', type: 'bytes32' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.Bytes32ArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'bytes32[]',
                    type: 'bytes32[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'bytesItems',
            internalType: 'struct GmxPositionUtils.BytesItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.BytesKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes', type: 'bytes' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BytesArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes[]', type: 'bytes[]' }
                ]
              }
            ]
          },
          {
            name: 'stringItems',
            internalType: 'struct GmxPositionUtils.StringItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.StringKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string', type: 'string' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.StringArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string[]', type: 'string[]' }
                ]
              }
            ]
          }
        ]
      }
    ],
    name: 'afterOrderCancellation',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'key', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'order',
        internalType: 'struct GmxPositionUtils.Props',
        type: 'tuple',
        components: [
          {
            name: 'addresses',
            internalType: 'struct GmxPositionUtils.Addresses',
            type: 'tuple',
            components: [
              { name: 'account', internalType: 'address', type: 'address' },
              { name: 'receiver', internalType: 'address', type: 'address' },
              {
                name: 'cancellationReceiver',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'callbackContract',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'uiFeeReceiver',
                internalType: 'address',
                type: 'address'
              },
              { name: 'market', internalType: 'address', type: 'address' },
              {
                name: 'initialCollateralToken',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'swapPath',
                internalType: 'address[]',
                type: 'address[]'
              }
            ]
          },
          {
            name: 'numbers',
            internalType: 'struct GmxPositionUtils.Numbers',
            type: 'tuple',
            components: [
              {
                name: 'orderType',
                internalType: 'enum GmxPositionUtils.OrderType',
                type: 'uint8'
              },
              {
                name: 'decreasePositionSwapType',
                internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
                type: 'uint8'
              },
              {
                name: 'sizeDeltaUsd',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'initialCollateralDeltaAmount',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'triggerPrice',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'acceptablePrice',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'executionFee',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'callbackGasLimit',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'minOutputAmount',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'updatedAtTime',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'validFromTime',
                internalType: 'uint256',
                type: 'uint256'
              }
            ]
          },
          {
            name: 'flags',
            internalType: 'struct GmxPositionUtils.Flags',
            type: 'tuple',
            components: [
              { name: 'isLong', internalType: 'bool', type: 'bool' },
              {
                name: 'shouldUnwrapNativeToken',
                internalType: 'bool',
                type: 'bool'
              },
              { name: 'isFrozen', internalType: 'bool', type: 'bool' },
              { name: 'autoCancel', internalType: 'bool', type: 'bool' }
            ]
          }
        ]
      },
      {
        name: '',
        internalType: 'struct GmxPositionUtils.EventLogData',
        type: 'tuple',
        components: [
          {
            name: 'addressItems',
            internalType: 'struct GmxPositionUtils.AddressItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.AddressKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'address', type: 'address' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.AddressArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'address[]',
                    type: 'address[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'uintItems',
            internalType: 'struct GmxPositionUtils.UintItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.UintKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'uint256', type: 'uint256' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.UintArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'uint256[]',
                    type: 'uint256[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'intItems',
            internalType: 'struct GmxPositionUtils.IntItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.IntKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256', type: 'int256' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.IntArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256[]', type: 'int256[]' }
                ]
              }
            ]
          },
          {
            name: 'boolItems',
            internalType: 'struct GmxPositionUtils.BoolItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.BoolKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool', type: 'bool' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BoolArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool[]', type: 'bool[]' }
                ]
              }
            ]
          },
          {
            name: 'bytes32Items',
            internalType: 'struct GmxPositionUtils.Bytes32Items',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.Bytes32KeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes32', type: 'bytes32' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.Bytes32ArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'bytes32[]',
                    type: 'bytes32[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'bytesItems',
            internalType: 'struct GmxPositionUtils.BytesItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.BytesKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes', type: 'bytes' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BytesArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes[]', type: 'bytes[]' }
                ]
              }
            ]
          },
          {
            name: 'stringItems',
            internalType: 'struct GmxPositionUtils.StringItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.StringKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string', type: 'string' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.StringArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string[]', type: 'string[]' }
                ]
              }
            ]
          }
        ]
      }
    ],
    name: 'afterOrderExecution',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      {
        name: '',
        internalType: 'struct GmxPositionUtils.Props',
        type: 'tuple',
        components: [
          {
            name: 'addresses',
            internalType: 'struct GmxPositionUtils.Addresses',
            type: 'tuple',
            components: [
              { name: 'account', internalType: 'address', type: 'address' },
              { name: 'receiver', internalType: 'address', type: 'address' },
              {
                name: 'cancellationReceiver',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'callbackContract',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'uiFeeReceiver',
                internalType: 'address',
                type: 'address'
              },
              { name: 'market', internalType: 'address', type: 'address' },
              {
                name: 'initialCollateralToken',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'swapPath',
                internalType: 'address[]',
                type: 'address[]'
              }
            ]
          },
          {
            name: 'numbers',
            internalType: 'struct GmxPositionUtils.Numbers',
            type: 'tuple',
            components: [
              {
                name: 'orderType',
                internalType: 'enum GmxPositionUtils.OrderType',
                type: 'uint8'
              },
              {
                name: 'decreasePositionSwapType',
                internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
                type: 'uint8'
              },
              {
                name: 'sizeDeltaUsd',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'initialCollateralDeltaAmount',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'triggerPrice',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'acceptablePrice',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'executionFee',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'callbackGasLimit',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'minOutputAmount',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'updatedAtTime',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'validFromTime',
                internalType: 'uint256',
                type: 'uint256'
              }
            ]
          },
          {
            name: 'flags',
            internalType: 'struct GmxPositionUtils.Flags',
            type: 'tuple',
            components: [
              { name: 'isLong', internalType: 'bool', type: 'bool' },
              {
                name: 'shouldUnwrapNativeToken',
                internalType: 'bool',
                type: 'bool'
              },
              { name: 'isFrozen', internalType: 'bool', type: 'bool' },
              { name: 'autoCancel', internalType: 'bool', type: 'bool' }
            ]
          }
        ]
      },
      {
        name: '',
        internalType: 'struct GmxPositionUtils.EventLogData',
        type: 'tuple',
        components: [
          {
            name: 'addressItems',
            internalType: 'struct GmxPositionUtils.AddressItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.AddressKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'address', type: 'address' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.AddressArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'address[]',
                    type: 'address[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'uintItems',
            internalType: 'struct GmxPositionUtils.UintItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.UintKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'uint256', type: 'uint256' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.UintArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'uint256[]',
                    type: 'uint256[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'intItems',
            internalType: 'struct GmxPositionUtils.IntItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.IntKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256', type: 'int256' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.IntArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256[]', type: 'int256[]' }
                ]
              }
            ]
          },
          {
            name: 'boolItems',
            internalType: 'struct GmxPositionUtils.BoolItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.BoolKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool', type: 'bool' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BoolArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool[]', type: 'bool[]' }
                ]
              }
            ]
          },
          {
            name: 'bytes32Items',
            internalType: 'struct GmxPositionUtils.Bytes32Items',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.Bytes32KeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes32', type: 'bytes32' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.Bytes32ArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'bytes32[]',
                    type: 'bytes32[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'bytesItems',
            internalType: 'struct GmxPositionUtils.BytesItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.BytesKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes', type: 'bytes' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BytesArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes[]', type: 'bytes[]' }
                ]
              }
            ]
          },
          {
            name: 'stringItems',
            internalType: 'struct GmxPositionUtils.StringItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.StringKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string', type: 'string' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.StringArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string[]', type: 'string[]' }
                ]
              }
            ]
          }
        ]
      }
    ],
    name: 'afterOrderFrozen',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' }
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_allocationAccount', internalType: 'address', type: 'address' },
      { name: '_dustToken', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' }
    ],
    name: 'collectAllocationAccountDust',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'getConfig',
    outputs: [
      {
        name: '',
        internalType: 'struct KeeperRouter.Config',
        type: 'tuple',
        components: [
          {
            name: 'mirrorBaseGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'mirrorPerPuppetGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'adjustBaseGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'adjustPerPuppetGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'settleBaseGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'settlePerPuppetGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'fallbackRefundExecutionFeeReceiver',
            internalType: 'address',
            type: 'address'
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'mirror',
    outputs: [{ name: '', internalType: 'contract Mirror', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'key', internalType: 'bytes32', type: 'bytes32' },
      {
        name: '',
        internalType: 'struct GmxPositionUtils.EventLogData',
        type: 'tuple',
        components: [
          {
            name: 'addressItems',
            internalType: 'struct GmxPositionUtils.AddressItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.AddressKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'address', type: 'address' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.AddressArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'address[]',
                    type: 'address[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'uintItems',
            internalType: 'struct GmxPositionUtils.UintItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.UintKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'uint256', type: 'uint256' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.UintArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'uint256[]',
                    type: 'uint256[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'intItems',
            internalType: 'struct GmxPositionUtils.IntItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.IntKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256', type: 'int256' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.IntArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256[]', type: 'int256[]' }
                ]
              }
            ]
          },
          {
            name: 'boolItems',
            internalType: 'struct GmxPositionUtils.BoolItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.BoolKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool', type: 'bool' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BoolArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool[]', type: 'bool[]' }
                ]
              }
            ]
          },
          {
            name: 'bytes32Items',
            internalType: 'struct GmxPositionUtils.Bytes32Items',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.Bytes32KeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes32', type: 'bytes32' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.Bytes32ArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  {
                    name: 'value',
                    internalType: 'bytes32[]',
                    type: 'bytes32[]'
                  }
                ]
              }
            ]
          },
          {
            name: 'bytesItems',
            internalType: 'struct GmxPositionUtils.BytesItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.BytesKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes', type: 'bytes' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BytesArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes[]', type: 'bytes[]' }
                ]
              }
            ]
          },
          {
            name: 'stringItems',
            internalType: 'struct GmxPositionUtils.StringItems',
            type: 'tuple',
            components: [
              {
                name: 'items',
                internalType: 'struct GmxPositionUtils.StringKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string', type: 'string' }
                ]
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.StringArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string[]', type: 'string[]' }
                ]
              }
            ]
          }
        ]
      }
    ],
    name: 'refundExecutionFee',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_callParams',
        internalType: 'struct Mirror.CallPosition',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address'
          },
          {
            name: 'traderRequestKey',
            internalType: 'bytes32',
            type: 'bytes32'
          },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'market', internalType: 'address', type: 'address' },
          {
            name: 'keeperFeeReceiver',
            internalType: 'address',
            type: 'address'
          },
          { name: 'isIncrease', internalType: 'bool', type: 'bool' },
          { name: 'isLong', internalType: 'bool', type: 'bool' },
          { name: 'executionFee', internalType: 'uint256', type: 'uint256' },
          { name: 'collateralDelta', internalType: 'uint256', type: 'uint256' },
          { name: 'sizeDeltaInUsd', internalType: 'uint256', type: 'uint256' },
          { name: 'acceptablePrice', internalType: 'uint256', type: 'uint256' },
          { name: 'triggerPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'allocationId', internalType: 'uint256', type: 'uint256' },
          { name: 'keeperFee', internalType: 'uint256', type: 'uint256' }
        ]
      },
      { name: '_puppetList', internalType: 'address[]', type: 'address[]' }
    ],
    name: 'requestAdjust',
    outputs: [{ name: '_requestKey', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_params',
        internalType: 'struct Mirror.StalledPositionParams',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address'
          },
          { name: 'market', internalType: 'address', type: 'address' },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'isLong', internalType: 'bool', type: 'bool' },
          { name: 'executionFee', internalType: 'uint256', type: 'uint256' },
          { name: 'acceptablePrice', internalType: 'uint256', type: 'uint256' },
          { name: 'allocationId', internalType: 'uint256', type: 'uint256' }
        ]
      },
      { name: '_puppetList', internalType: 'address[]', type: 'address[]' }
    ],
    name: 'requestCloseStalledPosition',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_callParams',
        internalType: 'struct Mirror.CallPosition',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address'
          },
          {
            name: 'traderRequestKey',
            internalType: 'bytes32',
            type: 'bytes32'
          },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'market', internalType: 'address', type: 'address' },
          {
            name: 'keeperFeeReceiver',
            internalType: 'address',
            type: 'address'
          },
          { name: 'isIncrease', internalType: 'bool', type: 'bool' },
          { name: 'isLong', internalType: 'bool', type: 'bool' },
          { name: 'executionFee', internalType: 'uint256', type: 'uint256' },
          { name: 'collateralDelta', internalType: 'uint256', type: 'uint256' },
          { name: 'sizeDeltaInUsd', internalType: 'uint256', type: 'uint256' },
          { name: 'acceptablePrice', internalType: 'uint256', type: 'uint256' },
          { name: 'triggerPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'allocationId', internalType: 'uint256', type: 'uint256' },
          { name: 'keeperFee', internalType: 'uint256', type: 'uint256' }
        ]
      },
      { name: '_puppetList', internalType: 'address[]', type: 'address[]' }
    ],
    name: 'requestOpen',
    outputs: [
      { name: '_allocationAddress', internalType: 'address', type: 'address' },
      { name: '_requestKey', internalType: 'bytes32', type: 'bytes32' }
    ],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'ruleContract',
    outputs: [{ name: '', internalType: 'contract Rule', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'settle',
    outputs: [{ name: '', internalType: 'contract Settle', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_settleParams',
        internalType: 'struct Settle.CallSettle',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address'
          },
          {
            name: 'distributionToken',
            internalType: 'contract IERC20',
            type: 'address'
          },
          {
            name: 'keeperFeeReceiver',
            internalType: 'address',
            type: 'address'
          },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'allocationId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'keeperExecutionFee',
            internalType: 'uint256',
            type: 'uint256'
          }
        ]
      },
      { name: '_puppetList', internalType: 'address[]', type: 'address[]' }
    ],
    name: 'settleAllocation',
    outputs: [
      { name: 'settledBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'distributionAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'platformFeeAmount', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure'
  },
  { type: 'error', inputs: [], name: 'KeeperRouter__FailedRefundExecutionFee' },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mirror
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mirrorAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address'
      },
      {
        name: '_config',
        internalType: 'struct Mirror.Config',
        type: 'tuple',
        components: [
          {
            name: 'gmxExchangeRouter',
            internalType: 'contract IGmxExchangeRouter',
            type: 'address'
          },
          {
            name: 'gmxDataStore',
            internalType: 'contract IGmxReadDataStore',
            type: 'address'
          },
          { name: 'gmxOrderVault', internalType: 'address', type: 'address' },
          { name: 'referralCode', internalType: 'bytes32', type: 'bytes32' },
          {
            name: 'increaseCallbackGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'decreaseCallbackGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'maxPuppetList', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxKeeperFeeToAllocationRatio',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'maxKeeperFeeToAdjustmentRatio',
            internalType: 'uint256',
            type: 'uint256'
          }
        ]
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'allocationAddress', internalType: 'address', type: 'address' }],
    name: 'allocationMap',
    outputs: [{ name: 'totalAmount', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'allocationPuppetList',
    outputs: [{ name: 'puppetAmounts', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' }
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'config',
    outputs: [
      {
        name: 'gmxExchangeRouter',
        internalType: 'contract IGmxExchangeRouter',
        type: 'address'
      },
      {
        name: 'gmxDataStore',
        internalType: 'contract IGmxReadDataStore',
        type: 'address'
      },
      { name: 'gmxOrderVault', internalType: 'address', type: 'address' },
      { name: 'referralCode', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'increaseCallbackGasLimit',
        internalType: 'uint256',
        type: 'uint256'
      },
      {
        name: 'decreaseCallbackGasLimit',
        internalType: 'uint256',
        type: 'uint256'
      },
      { name: 'maxPuppetList', internalType: 'uint256', type: 'uint256' },
      {
        name: 'maxKeeperFeeToAllocationRatio',
        internalType: 'uint256',
        type: 'uint256'
      },
      {
        name: 'maxKeeperFeeToAdjustmentRatio',
        internalType: 'uint256',
        type: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_requestKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_allocationAddress', internalType: 'address', type: 'address' }],
    name: 'getAllocation',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_allocationAddress', internalType: 'address', type: 'address' }],
    name: 'getAllocationPuppetList',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'getConfig',
    outputs: [
      {
        name: '',
        internalType: 'struct Mirror.Config',
        type: 'tuple',
        components: [
          {
            name: 'gmxExchangeRouter',
            internalType: 'contract IGmxExchangeRouter',
            type: 'address'
          },
          {
            name: 'gmxDataStore',
            internalType: 'contract IGmxReadDataStore',
            type: 'address'
          },
          { name: 'gmxOrderVault', internalType: 'address', type: 'address' },
          { name: 'referralCode', internalType: 'bytes32', type: 'bytes32' },
          {
            name: 'increaseCallbackGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'decreaseCallbackGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'maxPuppetList', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxKeeperFeeToAllocationRatio',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'maxKeeperFeeToAdjustmentRatio',
            internalType: 'uint256',
            type: 'uint256'
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_traderMatchingKey', internalType: 'bytes32', type: 'bytes32' },
      { name: '_puppet', internalType: 'address', type: 'address' }
    ],
    name: 'getLastActivityThrottle',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_allocationAddress', internalType: 'address', type: 'address' }],
    name: 'getPosition',
    outputs: [
      {
        name: '',
        internalType: 'struct Mirror.Position',
        type: 'tuple',
        components: [
          { name: 'size', internalType: 'uint256', type: 'uint256' },
          { name: 'traderSize', internalType: 'uint256', type: 'uint256' },
          {
            name: 'traderCollateral',
            internalType: 'uint256',
            type: 'uint256'
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_traderPositionKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getTraderPositionCollateralAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_traderPositionKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getTraderPositionSizeInUsd',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_traderMatchingKey', internalType: 'bytes32', type: 'bytes32' },
      { name: '_puppet', internalType: 'address', type: 'address' }
    ],
    name: 'initializeTraderActivityThrottle',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'traderMatchingKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'puppet', internalType: 'address', type: 'address' }
    ],
    name: 'lastActivityThrottleMap',
    outputs: [{ name: 'lastActivity', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_allocationAddress', internalType: 'address', type: 'address' }],
    name: 'liquidate',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'allocationAddress', internalType: 'address', type: 'address' }],
    name: 'positionMap',
    outputs: [
      { name: 'size', internalType: 'uint256', type: 'uint256' },
      { name: 'traderSize', internalType: 'uint256', type: 'uint256' },
      { name: 'traderCollateral', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_account', internalType: 'contract Account', type: 'address' },
      { name: '_callbackContract', internalType: 'address', type: 'address' },
      {
        name: '_callParams',
        internalType: 'struct Mirror.CallPosition',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address'
          },
          {
            name: 'traderRequestKey',
            internalType: 'bytes32',
            type: 'bytes32'
          },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'market', internalType: 'address', type: 'address' },
          {
            name: 'keeperFeeReceiver',
            internalType: 'address',
            type: 'address'
          },
          { name: 'isIncrease', internalType: 'bool', type: 'bool' },
          { name: 'isLong', internalType: 'bool', type: 'bool' },
          { name: 'executionFee', internalType: 'uint256', type: 'uint256' },
          { name: 'collateralDelta', internalType: 'uint256', type: 'uint256' },
          { name: 'sizeDeltaInUsd', internalType: 'uint256', type: 'uint256' },
          { name: 'acceptablePrice', internalType: 'uint256', type: 'uint256' },
          { name: 'triggerPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'allocationId', internalType: 'uint256', type: 'uint256' },
          { name: 'keeperFee', internalType: 'uint256', type: 'uint256' }
        ]
      },
      { name: '_puppetList', internalType: 'address[]', type: 'address[]' }
    ],
    name: 'requestAdjust',
    outputs: [{ name: '_requestKey', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [{ name: 'requestKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'requestAdjustmentMap',
    outputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
      { name: 'traderIsIncrease', internalType: 'bool', type: 'bool' },
      { name: 'isIncrease', internalType: 'bool', type: 'bool' },
      {
        name: 'traderCollateralDelta',
        internalType: 'uint256',
        type: 'uint256'
      },
      { name: 'traderSizeDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'sizeDelta', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_account', internalType: 'contract Account', type: 'address' },
      {
        name: '_params',
        internalType: 'struct Mirror.StalledPositionParams',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address'
          },
          { name: 'market', internalType: 'address', type: 'address' },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'isLong', internalType: 'bool', type: 'bool' },
          { name: 'executionFee', internalType: 'uint256', type: 'uint256' },
          { name: 'acceptablePrice', internalType: 'uint256', type: 'uint256' },
          { name: 'allocationId', internalType: 'uint256', type: 'uint256' }
        ]
      },
      { name: '_puppetList', internalType: 'address[]', type: 'address[]' },
      { name: '_callbackContract', internalType: 'address', type: 'address' }
    ],
    name: 'requestCloseStalledPosition',
    outputs: [{ name: '_requestKey', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_account', internalType: 'contract Account', type: 'address' },
      { name: '_ruleContract', internalType: 'contract Rule', type: 'address' },
      { name: '_callbackContract', internalType: 'address', type: 'address' },
      {
        name: '_callParams',
        internalType: 'struct Mirror.CallPosition',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address'
          },
          {
            name: 'traderRequestKey',
            internalType: 'bytes32',
            type: 'bytes32'
          },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'market', internalType: 'address', type: 'address' },
          {
            name: 'keeperFeeReceiver',
            internalType: 'address',
            type: 'address'
          },
          { name: 'isIncrease', internalType: 'bool', type: 'bool' },
          { name: 'isLong', internalType: 'bool', type: 'bool' },
          { name: 'executionFee', internalType: 'uint256', type: 'uint256' },
          { name: 'collateralDelta', internalType: 'uint256', type: 'uint256' },
          { name: 'sizeDeltaInUsd', internalType: 'uint256', type: 'uint256' },
          { name: 'acceptablePrice', internalType: 'uint256', type: 'uint256' },
          { name: 'triggerPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'allocationId', internalType: 'uint256', type: 'uint256' },
          { name: 'keeperFee', internalType: 'uint256', type: 'uint256' }
        ]
      },
      { name: '_puppetList', internalType: 'address[]', type: 'address[]' }
    ],
    name: 'requestOpen',
    outputs: [
      { name: '_allocationAddress', internalType: 'address', type: 'address' },
      { name: '_requestKey', internalType: 'bytes32', type: 'bytes32' }
    ],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure'
  },
  {
    type: 'error',
    inputs: [{ name: 'requestKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'Mirror__ExecutionRequestMissing'
  },
  { type: 'error', inputs: [], name: 'Mirror__InitialMustBeIncrease' },
  {
    type: 'error',
    inputs: [
      { name: 'allocation', internalType: 'uint256', type: 'uint256' },
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Mirror__InsufficientAllocationForKeeperFee'
  },
  {
    type: 'error',
    inputs: [
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Mirror__InsufficientGmxExecutionFee'
  },
  {
    type: 'error',
    inputs: [{ name: 'allocationAddress', internalType: 'address', type: 'address' }],
    name: 'Mirror__InvalidAllocation'
  },
  { type: 'error', inputs: [], name: 'Mirror__InvalidCollateralDelta' },
  { type: 'error', inputs: [], name: 'Mirror__InvalidCurrentLeverage' },
  {
    type: 'error',
    inputs: [],
    name: 'Mirror__InvalidKeeperExecutionFeeAmount'
  },
  { type: 'error', inputs: [], name: 'Mirror__InvalidSizeDelta' },
  {
    type: 'error',
    inputs: [
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
      { name: 'allocationAmount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Mirror__KeeperFeeExceedsAdjustmentRatio'
  },
  {
    type: 'error',
    inputs: [
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
      { name: 'allocationAmount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Mirror__KeeperFeeExceedsCostFactor'
  },
  {
    type: 'error',
    inputs: [
      { name: 'totalPaid', internalType: 'uint256', type: 'uint256' },
      { name: 'requiredFee', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Mirror__KeeperFeeNotFullyCovered'
  },
  { type: 'error', inputs: [], name: 'Mirror__NoAdjustmentRequired' },
  { type: 'error', inputs: [], name: 'Mirror__OrderCreationFailed' },
  {
    type: 'error',
    inputs: [{ name: 'allocationAddress', internalType: 'address', type: 'address' }],
    name: 'Mirror__PositionNotFound'
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
      { name: 'positionKey', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'Mirror__PositionNotStalled'
  },
  { type: 'error', inputs: [], name: 'Mirror__PuppetListEmpty' },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'provided', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Mirror__PuppetListMismatch'
  },
  {
    type: 'error',
    inputs: [{ name: 'allocationAddress', internalType: 'address', type: 'address' }],
    name: 'Mirror__TraderCollateralZero'
  },
  {
    type: 'error',
    inputs: [
      { name: 'trader', internalType: 'address', type: 'address' },
      { name: 'positionKey', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'Mirror__TraderPositionNotFound'
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Multicall
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const multicallAbi = [
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode'
  },
  { type: 'error', inputs: [], name: 'FailedCall' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Nonces
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const noncesAbi = [
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'InvalidAccountNonce'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Ownable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ownableAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'OwnershipTransferred'
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner'
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Permission
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const permissionAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' }
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Precision
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const precisionAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'BASIS_POINT_DIVISOR',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'FLOAT_PRECISION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Proxy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const proxyAbi = [{ type: 'fallback', stateMutability: 'payable' }] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PuppetToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const puppetTokenAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Approval'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Transfer'
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC20InsufficientAllowance'
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC20InsufficientBalance'
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover'
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver'
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender'
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PuppetVoteToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const puppetVoteTokenAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' }
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'pos', internalType: 'uint32', type: 'uint32' }
    ],
    name: 'checkpoints',
    outputs: [
      {
        name: '',
        internalType: 'struct Checkpoints.Checkpoint208',
        type: 'tuple',
        components: [
          { name: '_key', internalType: 'uint48', type: 'uint48' },
          { name: '_value', internalType: 'uint208', type: 'uint208' }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'numCheckpoints',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure'
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Approval'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'DelegateChanged'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'previousVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'newVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'DelegateVotesChanged'
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Transfer'
  },
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength'
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS'
  },
  {
    type: 'error',
    inputs: [
      { name: 'increasedSupply', internalType: 'uint256', type: 'uint256' },
      { name: 'cap', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC20ExceededSafeSupply'
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC20InsufficientAllowance'
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC20InsufficientBalance'
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover'
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver'
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender'
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender'
  },
  {
    type: 'error',
    inputs: [
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'clock', internalType: 'uint48', type: 'uint48' }
    ],
    name: 'ERC5805FutureLookup'
  },
  { type: 'error', inputs: [], name: 'ERC6372InconsistentClock' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'InvalidAccountNonce'
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'PuppetVoteToken__Unsupported' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'SafeCastOverflowedUintDowncast'
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong'
  },
  {
    type: 'error',
    inputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
    name: 'VotesExpiredSignature'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ReentrancyGuardTransient
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const reentrancyGuardTransientAbi = [
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RewardDistributor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rewardDistributorAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address'
      },
      {
        name: '_rewardToken',
        internalType: 'contract IERC20',
        type: 'address'
      },
      { name: '_vToken', internalType: 'contract IERC20', type: 'address' },
      { name: '_store', internalType: 'contract RewardStore', type: 'address' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' }
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_user', internalType: 'address', type: 'address' }],
    name: 'claimable',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'cumulativeRewardPerToken',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastDistributionTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingDistribution',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'rewardToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'store',
    outputs: [{ name: '', internalType: 'contract RewardStore', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure'
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalUndistributed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_referralStorage',
        internalType: 'contract IGmxReferralStorage',
        type: 'address'
      },
      { name: '_code', internalType: 'bytes32', type: 'bytes32' },
      { name: '_newOwner', internalType: 'address', type: 'address' }
    ],
    name: 'transferReferralOwnership',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'userRewardMap',
    outputs: [
      {
        name: 'cumulativeRewardCheckpoint',
        internalType: 'uint256',
        type: 'uint256'
      },
      { name: 'accrued', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'vToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view'
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'accured', internalType: 'uint256', type: 'uint256' }],
    name: 'RewardDistributor__InsufficientRewards'
  },
  { type: 'error', inputs: [], name: 'RewardDistributor__InvalidAmount' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RewardStore
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rewardStoreAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address'
      },
      {
        name: '_router',
        internalType: 'contract TokenRouter',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'contract IERC20', type: 'address' }],
    name: 'getTokenBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'contract IERC20', type: 'address' }],
    name: 'recordTransferIn',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setAccess',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'contract IERC20', type: 'address' }],
    name: 'syncTokenBalance',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    name: 'tokenBalanceMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferIn',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'gasLimit', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferOut',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  { type: 'error', inputs: [], name: 'Access__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Access__Unauthorized' },
  { type: 'error', inputs: [], name: 'BankStore__InsufficientBalance' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'TransferUtils__TokenTransferError'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RouterProxy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const routerProxyAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable'
  },
  { type: 'fallback', stateMutability: 'payable' },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setAccess',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_impl', internalType: 'address', type: 'address' }],
    name: 'update',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'Upgraded'
  },
  { type: 'error', inputs: [], name: 'Access__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Access__Unauthorized' },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode'
  },
  {
    type: 'error',
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address' }],
    name: 'ERC1967InvalidImplementation'
  },
  { type: 'error', inputs: [], name: 'ERC1967NonPayable' },
  { type: 'error', inputs: [], name: 'FailedCall' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Rule
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ruleAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address'
      },
      {
        name: '_config',
        internalType: 'struct Rule.Config',
        type: 'tuple',
        components: [
          {
            name: 'minExpiryDuration',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'minAllowanceRate',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'maxAllowanceRate',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'minActivityThrottle',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'maxActivityThrottle',
            internalType: 'uint256',
            type: 'uint256'
          }
        ]
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' }
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'getConfig',
    outputs: [
      {
        name: '',
        internalType: 'struct Rule.Config',
        type: 'tuple',
        components: [
          {
            name: 'minExpiryDuration',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'minAllowanceRate',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'maxAllowanceRate',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'minActivityThrottle',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'maxActivityThrottle',
            internalType: 'uint256',
            type: 'uint256'
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_traderMatchingKey', internalType: 'bytes32', type: 'bytes32' },
      { name: '_puppetList', internalType: 'address[]', type: 'address[]' }
    ],
    name: 'getRuleList',
    outputs: [
      {
        name: '_ruleList',
        internalType: 'struct Rule.RuleParams[]',
        type: 'tuple[]',
        components: [
          { name: 'allowanceRate', internalType: 'uint256', type: 'uint256' },
          {
            name: 'throttleActivity',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'expiry', internalType: 'uint256', type: 'uint256' }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'traderMatchingKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'puppet', internalType: 'address', type: 'address' }
    ],
    name: 'matchingRuleMap',
    outputs: [
      { name: 'allowanceRate', internalType: 'uint256', type: 'uint256' },
      { name: 'throttleActivity', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'mirror', internalType: 'contract Mirror', type: 'address' },
      {
        name: '_collateralToken',
        internalType: 'contract IERC20',
        type: 'address'
      },
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_trader', internalType: 'address', type: 'address' },
      {
        name: '_ruleParams',
        internalType: 'struct Rule.RuleParams',
        type: 'tuple',
        components: [
          { name: 'allowanceRate', internalType: 'uint256', type: 'uint256' },
          {
            name: 'throttleActivity',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'expiry', internalType: 'uint256', type: 'uint256' }
        ]
      }
    ],
    name: 'setRule',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure'
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [
      {
        name: 'minAllocationActivity',
        internalType: 'uint256',
        type: 'uint256'
      },
      {
        name: 'maxAllocationActivity',
        internalType: 'uint256',
        type: 'uint256'
      }
    ],
    name: 'Rule__InvalidActivityThrottle'
  },
  {
    type: 'error',
    inputs: [
      { name: 'min', internalType: 'uint256', type: 'uint256' },
      { name: 'max', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Rule__InvalidAllowanceRate'
  },
  {
    type: 'error',
    inputs: [{ name: 'minExpiryDuration', internalType: 'uint256', type: 'uint256' }],
    name: 'Rule__InvalidExpiryDuration'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SafeCast
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const safeCastAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'int256', type: 'int256' }
    ],
    name: 'SafeCastOverflowedIntDowncast'
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'int256', type: 'int256' }],
    name: 'SafeCastOverflowedIntToUint'
  },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'SafeCastOverflowedUintDowncast'
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'SafeCastOverflowedUintToInt'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Settle
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const settleAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address'
      },
      {
        name: '_config',
        internalType: 'struct Settle.Config',
        type: 'tuple',
        components: [
          {
            name: 'transferOutGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'platformSettleFeeFactor',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'maxKeeperFeeToSettleRatio',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'maxPuppetList', internalType: 'uint256', type: 'uint256' },
          {
            name: 'allocationAccountTransferGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          }
        ]
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' }
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_account', internalType: 'contract Account', type: 'address' },
      { name: '_allocationAccount', internalType: 'address', type: 'address' },
      { name: '_dustToken', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' }
    ],
    name: 'collectAllocationAccountDust',
    outputs: [{ name: '_dustAmount', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_account', internalType: 'contract Account', type: 'address' },
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'collectPlatformFees',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'getConfig',
    outputs: [
      {
        name: '',
        internalType: 'struct Settle.Config',
        type: 'tuple',
        components: [
          {
            name: 'transferOutGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'platformSettleFeeFactor',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'maxKeeperFeeToSettleRatio',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'maxPuppetList', internalType: 'uint256', type: 'uint256' },
          {
            name: 'allocationAccountTransferGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'contract IERC20', type: 'address' }],
    name: 'platformFeeMap',
    outputs: [{ name: 'accumulatedFees', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_tokenDustThresholdList',
        internalType: 'contract IERC20[]',
        type: 'address[]'
      },
      {
        name: '_tokenDustThresholdCapList',
        internalType: 'uint256[]',
        type: 'uint256[]'
      }
    ],
    name: 'setTokenDustThresholdList',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_account', internalType: 'contract Account', type: 'address' },
      { name: '_mirror', internalType: 'contract Mirror', type: 'address' },
      {
        name: '_callParams',
        internalType: 'struct Settle.CallSettle',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address'
          },
          {
            name: 'distributionToken',
            internalType: 'contract IERC20',
            type: 'address'
          },
          {
            name: 'keeperFeeReceiver',
            internalType: 'address',
            type: 'address'
          },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'allocationId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'keeperExecutionFee',
            internalType: 'uint256',
            type: 'uint256'
          }
        ]
      },
      { name: '_puppetList', internalType: 'address[]', type: 'address[]' }
    ],
    name: 'settle',
    outputs: [
      { name: '_settledAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_distributionAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_platformFeeAmount', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure'
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'contract IERC20', type: 'address' }],
    name: 'tokenDustThresholdAmountMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenDustThresholdList',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view'
  },
  { type: 'error', inputs: [], name: 'Mirror__PuppetListEmpty' },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'threshold', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Settle__AmountExceedsDustThreshold'
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'Settle__DustThresholdNotSet'
  },
  {
    type: 'error',
    inputs: [{ name: 'allocationAddress', internalType: 'address', type: 'address' }],
    name: 'Settle__InvalidAllocation'
  },
  {
    type: 'error',
    inputs: [],
    name: 'Settle__InvalidKeeperExecutionFeeAmount'
  },
  {
    type: 'error',
    inputs: [],
    name: 'Settle__InvalidKeeperExecutionFeeReceiver'
  },
  { type: 'error', inputs: [], name: 'Settle__InvalidReceiver' },
  {
    type: 'error',
    inputs: [
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
      { name: 'settledAmount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Settle__KeeperFeeExceedsSettledAmount'
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' }
    ],
    name: 'Settle__NoDustToCollect'
  },
  {
    type: 'error',
    inputs: [
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
      { name: 'maximum', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'Settle__PuppetListExceedsMaximum'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ShortStrings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const shortStringsAbi = [
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Strings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stringsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'length', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'StringsInsufficientHexLength'
  },
  { type: 'error', inputs: [], name: 'StringsInvalidAddressFormat' },
  { type: 'error', inputs: [], name: 'StringsInvalidChar' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Test
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const testAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'IS_TEST',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeArtifacts',
    outputs: [
      {
        name: 'excludedArtifacts_',
        internalType: 'string[]',
        type: 'string[]'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeContracts',
    outputs: [
      {
        name: 'excludedContracts_',
        internalType: 'address[]',
        type: 'address[]'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeSelectors',
    outputs: [
      {
        name: 'excludedSelectors_',
        internalType: 'struct StdInvariant.FuzzSelector[]',
        type: 'tuple[]',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeSenders',
    outputs: [
      {
        name: 'excludedSenders_',
        internalType: 'address[]',
        type: 'address[]'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'failed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetArtifactSelectors',
    outputs: [
      {
        name: 'targetedArtifactSelectors_',
        internalType: 'struct StdInvariant.FuzzArtifactSelector[]',
        type: 'tuple[]',
        components: [
          { name: 'artifact', internalType: 'string', type: 'string' },
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetArtifacts',
    outputs: [
      {
        name: 'targetedArtifacts_',
        internalType: 'string[]',
        type: 'string[]'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetContracts',
    outputs: [
      {
        name: 'targetedContracts_',
        internalType: 'address[]',
        type: 'address[]'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetInterfaces',
    outputs: [
      {
        name: 'targetedInterfaces_',
        internalType: 'struct StdInvariant.FuzzInterface[]',
        type: 'tuple[]',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'artifacts', internalType: 'string[]', type: 'string[]' }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetSelectors',
    outputs: [
      {
        name: 'targetedSelectors_',
        internalType: 'struct StdInvariant.FuzzSelector[]',
        type: 'tuple[]',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetSenders',
    outputs: [
      {
        name: 'targetedSenders_',
        internalType: 'address[]',
        type: 'address[]'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: '', internalType: 'string', type: 'string', indexed: false }],
    name: 'log'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: '', internalType: 'address', type: 'address', indexed: false }],
    name: 'log_address'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false
      }
    ],
    name: 'log_array'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'int256[]',
        type: 'int256[]',
        indexed: false
      }
    ],
    name: 'log_array'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false
      }
    ],
    name: 'log_array'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes', indexed: false }],
    name: 'log_bytes'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32', indexed: false }],
    name: 'log_bytes32'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: '', internalType: 'int256', type: 'int256', indexed: false }],
    name: 'log_int'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'address', type: 'address', indexed: false }
    ],
    name: 'log_named_address'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'val',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false
      }
    ],
    name: 'log_named_array'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'val',
        internalType: 'int256[]',
        type: 'int256[]',
        indexed: false
      }
    ],
    name: 'log_named_array'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'val',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false
      }
    ],
    name: 'log_named_array'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes', type: 'bytes', indexed: false }
    ],
    name: 'log_named_bytes'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes32', type: 'bytes32', indexed: false }
    ],
    name: 'log_named_bytes32'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'int256', type: 'int256', indexed: false },
      {
        name: 'decimals',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'log_named_decimal_int'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'decimals',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'log_named_decimal_uint'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'int256', type: 'int256', indexed: false }
    ],
    name: 'log_named_int'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'string', type: 'string', indexed: false }
    ],
    name: 'log_named_string'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'uint256', type: 'uint256', indexed: false }
    ],
    name: 'log_named_uint'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: '', internalType: 'string', type: 'string', indexed: false }],
    name: 'log_string'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'log_uint'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes', indexed: false }],
    name: 'logs'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TokenRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenRouterAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address'
      },
      {
        name: '_config',
        internalType: 'struct TokenRouter.Config',
        type: 'tuple',
        components: [
          {
            name: 'transferGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          }
        ]
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' }
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'getConfig',
    outputs: [
      {
        name: '',
        internalType: 'struct TokenRouter.Config',
        type: 'tuple',
        components: [
          {
            name: 'transferGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure'
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'TokenRouter__EmptyTokenTranferGasLimit' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'TransferUtils__TokenTransferFromError'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UserRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const userRouterAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_account', internalType: 'contract Account', type: 'address' },
      { name: '_ruleContract', internalType: 'contract Rule', type: 'address' },
      {
        name: '_feeMarketplace',
        internalType: 'contract FeeMarketplace',
        type: 'address'
      },
      { name: '_mirror', internalType: 'contract Mirror', type: 'address' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'feeToken', internalType: 'contract IERC20', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'purchaseAmount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'acceptOffer',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'account',
    outputs: [{ name: '', internalType: 'contract Account', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeMarketplace',
    outputs: [{ name: '', internalType: 'contract FeeMarketplace', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'mirror',
    outputs: [{ name: '', internalType: 'contract Mirror', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'ruleContract',
    outputs: [{ name: '', internalType: 'contract Rule', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'collateralToken',
        internalType: 'contract IERC20',
        type: 'address'
      },
      { name: 'trader', internalType: 'address', type: 'address' },
      {
        name: 'ruleParams',
        internalType: 'struct Rule.RuleParams',
        type: 'tuple',
        components: [
          { name: 'allowanceRate', internalType: 'uint256', type: 'uint256' },
          {
            name: 'throttleActivity',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'expiry', internalType: 'uint256', type: 'uint256' }
        ]
      }
    ],
    name: 'setMatchingRule',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Votes
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const votesAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'DelegateChanged'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'previousVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'newVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'DelegateVotesChanged'
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength'
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS'
  },
  {
    type: 'error',
    inputs: [
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'clock', internalType: 'uint48', type: 'uint48' }
    ],
    name: 'ERC5805FutureLookup'
  },
  { type: 'error', inputs: [], name: 'ERC6372InconsistentClock' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'InvalidAccountNonce'
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'SafeCastOverflowedUintDowncast'
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong'
  },
  {
    type: 'error',
    inputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
    name: 'VotesExpiredSignature'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VotingEscrow
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const votingEscrowAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address'
      },
      {
        name: '_store',
        internalType: 'contract VotingEscrowStore',
        type: 'address'
      },
      { name: '_token', internalType: 'contract PuppetToken', type: 'address' },
      {
        name: '_vToken',
        internalType: 'contract PuppetVoteToken',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAXTIME',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'duration', internalType: 'uint256', type: 'uint256' }],
    name: 'calcDurationMultiplier',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' }
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getClaimable',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'getConfig',
    outputs: [
      {
        name: '',
        internalType: 'struct VotingEscrow.Config',
        type: 'tuple',
        components: [
          {
            name: 'transferOutGasLimit',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'baseMultiplier', internalType: 'uint256', type: 'uint256' }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'duration', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'getVestedBonus',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getVestingCursor',
    outputs: [
      {
        name: 'vested',
        internalType: 'struct VotingEscrow.Vested',
        type: 'tuple',
        components: [
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          {
            name: 'remainingDuration',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'lastAccruedTime', internalType: 'uint256', type: 'uint256' },
          { name: 'accrued', internalType: 'uint256', type: 'uint256' }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'depositor', internalType: 'address', type: 'address' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'duration', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'lock',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'lockDurationMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'store',
    outputs: [{ name: '', internalType: 'contract VotingEscrowStore', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure'
  },
  {
    type: 'function',
    inputs: [],
    name: 'token',
    outputs: [{ name: '', internalType: 'contract PuppetToken', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'vToken',
    outputs: [{ name: '', internalType: 'contract PuppetVoteToken', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'vest',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'vestMap',
    outputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'remainingDuration', internalType: 'uint256', type: 'uint256' },
      { name: 'lastAccruedTime', internalType: 'uint256', type: 'uint256' },
      { name: 'accrued', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'view'
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'VotingEscrow__ExceedMaxTime' },
  {
    type: 'error',
    inputs: [{ name: 'accured', internalType: 'uint256', type: 'uint256' }],
    name: 'VotingEscrow__ExceedingAccruedAmount'
  },
  { type: 'error', inputs: [], name: 'VotingEscrow__ZeroAmount' }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VotingEscrowStore
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const votingEscrowStoreAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address'
      },
      {
        name: '_router',
        internalType: 'contract TokenRouter',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'contract IAuthority', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'contract IERC20', type: 'address' }],
    name: 'getTokenBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'contract IERC20', type: 'address' }],
    name: 'recordTransferIn',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' }
    ],
    name: 'setAccess',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'contract IERC20', type: 'address' }],
    name: 'syncTokenBalance',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    name: 'tokenBalanceMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferIn',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'gasLimit', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferOut',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  { type: 'error', inputs: [], name: 'Access__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Access__Unauthorized' },
  { type: 'error', inputs: [], name: 'BankStore__InsufficientBalance' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'TransferUtils__TokenTransferError'
  }
] as const
