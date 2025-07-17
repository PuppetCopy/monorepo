//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Access
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const accessAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'Access__CallerNotAuthority' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Address
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const addressAbi = [
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Allocate
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const allocateAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address',
      },
      {
        name: '_allocationStore',
        internalType: 'contract AllocationStore',
        type: 'address',
      },
      {
        name: '_config',
        internalType: 'struct Allocate.Config',
        type: 'tuple',
        components: [
          {
            name: 'transferOutGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxPuppetList', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxKeeperFeeToAllocationRatio',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxKeeperFeeToAdjustmentRatio',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'gmxOrderVault', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocationAccountImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'allocationMap',
    outputs: [
      { name: 'totalAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'allocationPuppetList',
    outputs: [
      { name: 'puppetAmounts', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocationStore',
    outputs: [
      { name: '', internalType: 'contract AllocationStore', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_params',
        internalType: 'struct Allocate.CallAllocation',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address',
          },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'puppetList', internalType: 'address[]', type: 'address[]' },
          { name: 'allocationId', internalType: 'uint256', type: 'uint256' },
          { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
          {
            name: 'keeperFeeReceiver',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    name: 'collectKeeperFee',
    outputs: [
      { name: '_allocationAddress', internalType: 'address', type: 'address' },
      { name: '_nextAllocated', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_matchingRule',
        internalType: 'contract MatchingRule',
        type: 'address',
      },
      {
        name: '_params',
        internalType: 'struct Allocate.CallAllocation',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address',
          },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'puppetList', internalType: 'address[]', type: 'address[]' },
          { name: 'allocationId', internalType: 'uint256', type: 'uint256' },
          { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
          {
            name: 'keeperFeeReceiver',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    name: 'createAllocation',
    outputs: [
      { name: '_allocationAddress', internalType: 'address', type: 'address' },
      { name: '_allocated', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_allocationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getAllocation',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getConfig',
    outputs: [
      {
        name: '',
        internalType: 'struct Allocate.Config',
        type: 'tuple',
        components: [
          {
            name: 'transferOutGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxPuppetList', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxKeeperFeeToAllocationRatio',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxKeeperFeeToAdjustmentRatio',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'gmxOrderVault', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_allocationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getPuppetAllocationList',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_traderMatchingKey', internalType: 'bytes32', type: 'bytes32' },
      { name: '_puppet', internalType: 'address', type: 'address' },
    ],
    name: 'initializeTraderActivityThrottle',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'traderMatchingKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'puppet', internalType: 'address', type: 'address' },
    ],
    name: 'lastActivityThrottleMap',
    outputs: [
      { name: 'lastActivity', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocation', internalType: 'uint256', type: 'uint256' },
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__InsufficientAllocationForKeeperFee',
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'Allocation__InvalidAllocation',
  },
  {
    type: 'error',
    inputs: [],
    name: 'Allocation__InvalidKeeperExecutionFeeAmount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
      { name: 'allocationAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__KeeperFeeExceedsAdjustmentRatio',
  },
  {
    type: 'error',
    inputs: [
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
      { name: 'allocationAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__KeeperFeeExceedsCostFactor',
  },
  {
    type: 'error',
    inputs: [
      { name: 'totalPaid', internalType: 'uint256', type: 'uint256' },
      { name: 'requiredFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__KeeperFeeNotFullyCovered',
  },
  { type: 'error', inputs: [], name: 'Allocation__PuppetListEmpty' },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__PuppetListMismatch',
  },
  { type: 'error', inputs: [], name: 'FailedDeployment' },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AllocationAccount
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const allocationAccountAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_store', internalType: 'contract Access', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contract', internalType: 'address', type: 'address' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
      { name: '_gasLimit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'execute',
    outputs: [
      { name: '_success', internalType: 'bool', type: 'bool' },
      { name: '_returnData', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contract', internalType: 'address', type: 'address' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
      { name: '_ethAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_gasLimit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'execute',
    outputs: [
      { name: '_success', internalType: 'bool', type: 'bool' },
      { name: '_returnData', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'payable',
  },
  { type: 'error', inputs: [], name: 'AllocationAccount__InsufficientBalance' },
  {
    type: 'error',
    inputs: [],
    name: 'AllocationAccount__UnauthorizedOperator',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AllocationStore
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const allocationStoreAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address',
      },
      {
        name: '_router',
        internalType: 'contract TokenRouter',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_userList', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'getBalanceList',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'getTokenBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'recordTransferIn',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_accountList', internalType: 'address[]', type: 'address[]' },
      { name: '_balanceList', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'setBalanceList',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_account', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setUserBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'syncTokenBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    name: 'tokenBalanceMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferIn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'gasLimit', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferOut',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'userBalanceMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  { type: 'error', inputs: [], name: 'Access__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Access__Unauthorized' },
  { type: 'error', inputs: [], name: 'BankStore__InsufficientBalance' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TransferUtils__TokenTransferError',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BankStore
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const bankStoreAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'getTokenBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'recordTransferIn',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'syncTokenBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    name: 'tokenBalanceMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferIn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'gasLimit', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferOut',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'Access__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Access__Unauthorized' },
  { type: 'error', inputs: [], name: 'BankStore__InsufficientBalance' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TransferUtils__TokenTransferError',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BaseScript
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const baseScriptAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'IS_SCRIPT',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNextCreateAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'count', internalType: 'uint256', type: 'uint256' }],
    name: 'getNextCreateAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BasicSetup
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const basicSetupAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'IS_TEST',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeArtifacts',
    outputs: [
      {
        name: 'excludedArtifacts_',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeContracts',
    outputs: [
      {
        name: 'excludedContracts_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeSenders',
    outputs: [
      {
        name: 'excludedSenders_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'failed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'setUp',
    outputs: [],
    stateMutability: 'nonpayable',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetArtifacts',
    outputs: [
      {
        name: 'targetedArtifacts_',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetContracts',
    outputs: [
      {
        name: 'targetedContracts_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
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
          { name: 'artifacts', internalType: 'string[]', type: 'string[]' },
        ],
      },
    ],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetSenders',
    outputs: [
      {
        name: 'targetedSenders_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_address',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'int256[]',
        type: 'int256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_bytes32',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_named_address',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_named_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_named_bytes32',
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
        indexed: false,
      },
    ],
    name: 'log_named_decimal_int',
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
        indexed: false,
      },
    ],
    name: 'log_named_decimal_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_named_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_named_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_named_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'logs',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Checkpoints
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const checkpointsAbi = [
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Clones
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const clonesAbi = [
  { type: 'error', inputs: [], name: 'CloneArgumentsTooLong' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CoreContract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const coreContractAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const create2Abi = [
  { type: 'error', inputs: [], name: 'Create2EmptyBytecode' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DeployBase
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const deployBaseAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'IS_SCRIPT',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNextCreateAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'count', internalType: 'uint256', type: 'uint256' }],
    name: 'getNextCreateAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'run',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DeployPosition
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const deployPositionAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'IS_SCRIPT',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNextCreateAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'count', internalType: 'uint256', type: 'uint256' }],
    name: 'getNextCreateAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'run',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'matchingRule',
        internalType: 'contract MatchingRule',
        type: 'address',
      },
      { name: 'settle', internalType: 'contract Settle', type: 'address' },
    ],
    name: 'setupUpkeepingConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DeployUserRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const deployUserRouterAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'IS_SCRIPT',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNextCreateAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'count', internalType: 'uint256', type: 'uint256' }],
    name: 'getNextCreateAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'run',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Dictatorship
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const dictatorshipAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_initialOwner', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_target', internalType: 'contract Access', type: 'address' },
      { name: '_user', internalType: 'address', type: 'address' },
    ],
    name: 'hasAccess',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_target', internalType: 'contract Permission', type: 'address' },
      { name: '_functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'hasPermission',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_method', internalType: 'string', type: 'string' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'logEvent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_target',
        internalType: 'contract CoreContract',
        type: 'address',
      },
    ],
    name: 'registerContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'registeredContract',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_target', internalType: 'contract Access', type: 'address' },
      { name: '_user', internalType: 'address', type: 'address' },
    ],
    name: 'removeAccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_target',
        internalType: 'contract CoreContract',
        type: 'address',
      },
    ],
    name: 'removeContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_target', internalType: 'contract Permission', type: 'address' },
      { name: '_functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: '_user', internalType: 'address', type: 'address' },
    ],
    name: 'removePermission',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_target', internalType: 'contract Access', type: 'address' },
      { name: '_user', internalType: 'address', type: 'address' },
    ],
    name: 'setAccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_target',
        internalType: 'contract CoreContract',
        type: 'address',
      },
      { name: '_config', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_target', internalType: 'contract Permission', type: 'address' },
      { name: '_functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: '_user', internalType: 'address', type: 'address' },
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_gasLimit', internalType: 'uint256', type: 'uint256' }],
    name: 'settargetCallGasLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetCallGasLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'method', internalType: 'string', type: 'string', indexed: true },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'PuppetEventLog',
  },
  {
    type: 'error',
    inputs: [],
    name: 'Dictatorship__ConfigurationUpdateFailed',
  },
  {
    type: 'error',
    inputs: [],
    name: 'Dictatorship__ContractAlreadyInitialized',
  },
  { type: 'error', inputs: [], name: 'Dictatorship__ContractNotRegistered' },
  { type: 'error', inputs: [], name: 'Dictatorship__InvalidTargetAddress' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ECDSA
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ecdsaAbi = [
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
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
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
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
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC1967Utils
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc1967UtilsAbi = [
  {
    type: 'error',
    inputs: [{ name: 'admin', internalType: 'address', type: 'address' }],
    name: 'ERC1967InvalidAdmin',
  },
  {
    type: 'error',
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address' }],
    name: 'ERC1967InvalidBeacon',
  },
  {
    type: 'error',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1967InvalidImplementation',
  },
  { type: 'error', inputs: [], name: 'ERC1967NonPayable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20Abi = [
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
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
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20Burnable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20BurnableAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
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
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'pos', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'checkpoints',
    outputs: [
      {
        name: '',
        internalType: 'struct Checkpoints.Checkpoint208',
        type: 'tuple',
        components: [
          { name: '_key', internalType: 'uint48', type: 'uint48' },
          { name: '_value', internalType: 'uint208', type: 'uint208' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
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
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'numCheckpoints',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DelegateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'previousVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateVotesChanged',
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
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
  {
    type: 'error',
    inputs: [
      { name: 'increasedSupply', internalType: 'uint256', type: 'uint256' },
      { name: 'cap', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20ExceededSafeSupply',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'clock', internalType: 'uint48', type: 'uint48' },
    ],
    name: 'ERC5805FutureLookup',
  },
  { type: 'error', inputs: [], name: 'ERC6372InconsistentClock' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
  {
    type: 'error',
    inputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
    name: 'VotesExpiredSignature',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Error
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const errorAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'returndata',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'TransferUtils__TokenTransferReverted',
  },
  { type: 'error', inputs: [], name: 'Access__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Access__Unauthorized' },
  { type: 'error', inputs: [], name: 'AllocationAccount__InsufficientBalance' },
  {
    type: 'error',
    inputs: [],
    name: 'AllocationAccount__UnauthorizedOperator',
  },
  {
    type: 'error',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'threshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__AmountExceedsDustThreshold',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'Allocation__DustThresholdNotSet',
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'Allocation__DustTransferFailed',
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocation', internalType: 'uint256', type: 'uint256' },
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__InsufficientAllocationForKeeperFee',
  },
  {
    type: 'error',
    inputs: [
      { name: 'puppetIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'unpaidAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'puppetAllocation', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__InsufficientFundsForKeeperFee',
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'Allocation__InvalidAllocation',
  },
  {
    type: 'error',
    inputs: [],
    name: 'Allocation__InvalidKeeperExecutionFeeAmount',
  },
  {
    type: 'error',
    inputs: [],
    name: 'Allocation__InvalidKeeperExecutionFeeReceiver',
  },
  { type: 'error', inputs: [], name: 'Allocation__InvalidReceiver' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'recordedAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'settledAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__InvalidSettledAmount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
      { name: 'allocationAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__KeeperFeeExceedsAdjustmentRatio',
  },
  {
    type: 'error',
    inputs: [
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
      { name: 'allocationAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__KeeperFeeExceedsCostFactor',
  },
  {
    type: 'error',
    inputs: [
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
      { name: 'settledAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__KeeperFeeExceedsSettledAmount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'totalPaid', internalType: 'uint256', type: 'uint256' },
      { name: 'requiredFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__KeeperFeeNotFullyCovered',
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'Allocation__NoDustToCollect',
  },
  { type: 'error', inputs: [], name: 'Allocation__PuppetListEmpty' },
  {
    type: 'error',
    inputs: [
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
      { name: 'maximum', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__PuppetListExceedsMaximum',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__PuppetListMismatch',
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'Allocation__SettlementTransferFailed',
  },
  { type: 'error', inputs: [], name: 'BankStore__InsufficientBalance' },
  {
    type: 'error',
    inputs: [
      { name: 'contractName', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
    ],
    name: 'CoreContract__Unauthorized',
  },
  {
    type: 'error',
    inputs: [],
    name: 'Dictatorship__ConfigurationUpdateFailed',
  },
  {
    type: 'error',
    inputs: [],
    name: 'Dictatorship__ContractAlreadyInitialized',
  },
  { type: 'error', inputs: [], name: 'Dictatorship__ContractNotRegistered' },
  {
    type: 'error',
    inputs: [],
    name: 'Dictatorship__CoreContractConfigCallFailed',
  },
  {
    type: 'error',
    inputs: [],
    name: 'Dictatorship__CoreContractInitConfigNotSet',
  },
  { type: 'error', inputs: [], name: 'Dictatorship__EmptyConfiguration' },
  { type: 'error', inputs: [], name: 'Dictatorship__InvalidCoreContract' },
  { type: 'error', inputs: [], name: 'Dictatorship__InvalidTargetAddress' },
  { type: 'error', inputs: [], name: 'Dictatorship__InvalidUserAddress' },
  {
    type: 'error',
    inputs: [
      { name: 'requested', internalType: 'uint256', type: 'uint256' },
      { name: 'available', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'FeeMarketplace__InsufficientDistributionBalance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'accruedReward', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'FeeMarketplace__InsufficientUnlockedBalance',
  },
  { type: 'error', inputs: [], name: 'FeeMarketplace__InvalidAmount' },
  { type: 'error', inputs: [], name: 'FeeMarketplace__InvalidReceiver' },
  { type: 'error', inputs: [], name: 'FeeMarketplace__NotAuctionableToken' },
  { type: 'error', inputs: [], name: 'FeeMarketplace__ZeroDeposit' },
  { type: 'error', inputs: [], name: 'KeeperRouter__FailedRefundExecutionFee' },
  {
    type: 'error',
    inputs: [
      { name: 'allowanceCap', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MatchingRule__AllowanceAboveLimit',
  },
  { type: 'error', inputs: [], name: 'MatchingRule__InsufficientBalance' },
  {
    type: 'error',
    inputs: [
      {
        name: 'minAllocationActivity',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'maxAllocationActivity',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'MatchingRule__InvalidActivityThrottle',
  },
  {
    type: 'error',
    inputs: [
      { name: 'min', internalType: 'uint256', type: 'uint256' },
      { name: 'max', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MatchingRule__InvalidAllowanceRate',
  },
  { type: 'error', inputs: [], name: 'MatchingRule__InvalidAmount' },
  {
    type: 'error',
    inputs: [
      { name: 'minExpiryDuration', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MatchingRule__InvalidExpiryDuration',
  },
  { type: 'error', inputs: [], name: 'MatchingRule__TokenNotAllowed' },
  {
    type: 'error',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'threshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MirrorPosition__AmountExceedsDustThreshold',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'MirrorPosition__DustThresholdNotSet',
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'MirrorPosition__DustTransferFailed',
  },
  {
    type: 'error',
    inputs: [{ name: 'requestKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'MirrorPosition__ExecutionRequestMissing',
  },
  { type: 'error', inputs: [], name: 'MirrorPosition__InitialMustBeIncrease' },
  {
    type: 'error',
    inputs: [
      { name: 'allocation', internalType: 'uint256', type: 'uint256' },
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MirrorPosition__InsufficientAllocationForKeeperFee',
  },
  {
    type: 'error',
    inputs: [
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MirrorPosition__InsufficientGmxExecutionFee',
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'MirrorPosition__InvalidAllocation',
  },
  { type: 'error', inputs: [], name: 'MirrorPosition__InvalidAllocationId' },
  { type: 'error', inputs: [], name: 'MirrorPosition__InvalidCollateralDelta' },
  { type: 'error', inputs: [], name: 'MirrorPosition__InvalidCurrentLeverage' },
  {
    type: 'error',
    inputs: [],
    name: 'MirrorPosition__InvalidKeeperExecutionFeeAmount',
  },
  {
    type: 'error',
    inputs: [],
    name: 'MirrorPosition__InvalidKeeperExecutionFeeReceiver',
  },
  { type: 'error', inputs: [], name: 'MirrorPosition__InvalidReceiver' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'recordedAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'settledAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MirrorPosition__InvalidSettledAmount',
  },
  { type: 'error', inputs: [], name: 'MirrorPosition__InvalidSizeDelta' },
  {
    type: 'error',
    inputs: [],
    name: 'MirrorPosition__KeeperExecutionFeeNotFullyCovered',
  },
  {
    type: 'error',
    inputs: [
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
      { name: 'allocationAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MirrorPosition__KeeperFeeExceedsCostFactor',
  },
  {
    type: 'error',
    inputs: [
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
      { name: 'settledAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MirrorPosition__KeeperFeeExceedsSettledAmount',
  },
  { type: 'error', inputs: [], name: 'MirrorPosition__NoAdjustmentRequired' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'MirrorPosition__NoDustToCollect',
  },
  { type: 'error', inputs: [], name: 'MirrorPosition__OrderCreationFailed' },
  {
    type: 'error',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'MirrorPosition__PositionNotFound',
  },
  { type: 'error', inputs: [], name: 'MirrorPosition__PuppetListEmpty' },
  {
    type: 'error',
    inputs: [
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
      { name: 'maximum', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MirrorPosition__PuppetListExceedsMaximum',
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'MirrorPosition__SettlementTransferFailed',
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'MirrorPosition__TraderCollateralZero',
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__InvalidFunctionSignature' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'PuppetVoteToken__Unsupported' },
  {
    type: 'error',
    inputs: [{ name: 'accured', internalType: 'uint256', type: 'uint256' }],
    name: 'RewardDistributor__InsufficientRewards',
  },
  { type: 'error', inputs: [], name: 'RewardDistributor__InvalidAmount' },
  { type: 'error', inputs: [], name: 'TokenRouter__EmptyTokenTranferGasLimit' },
  { type: 'error', inputs: [], name: 'TransferUtils__EmptyHoldingAddress' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'TransferUtils__EmptyTokenTransferGasLimit',
  },
  { type: 'error', inputs: [], name: 'TransferUtils__InvalidReceiver' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'TransferUtils__SafeERC20FailedOperation',
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TransferUtils__TokenTransferError',
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TransferUtils__TokenTransferFromError',
  },
  { type: 'error', inputs: [], name: 'VotingEscrow__ExceedMaxTime' },
  {
    type: 'error',
    inputs: [{ name: 'accured', internalType: 'uint256', type: 'uint256' }],
    name: 'VotingEscrow__ExceedingAccruedAmount',
  },
  { type: 'error', inputs: [], name: 'VotingEscrow__ZeroAmount' },
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
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'MissingPrecompile',
  },
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
        type: 'address',
      },
      {
        name: '_protocolToken',
        internalType: 'contract PuppetToken',
        type: 'address',
      },
      {
        name: '_store',
        internalType: 'contract FeeMarketplaceStore',
        type: 'address',
      },
      {
        name: '_config',
        internalType: 'struct FeeMarketplace.Config',
        type: 'tuple',
        components: [
          {
            name: 'transferOutGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'distributionTimeframe',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'burnBasisPoints', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_feeToken', internalType: 'contract IERC20', type: 'address' },
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_purchaseAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'acceptOffer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    name: 'askAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'collectDistribution',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_feeToken', internalType: 'contract IERC20', type: 'address' },
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'distributionBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
            type: 'uint256',
          },
          {
            name: 'distributionTimeframe',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'burnBasisPoints', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'feeToken', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'getPendingUnlock',
    outputs: [{ name: 'pending', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'feeToken', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'getTotalUnlocked',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    name: 'lastDistributionTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolToken',
    outputs: [
      { name: '', internalType: 'contract PuppetToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_feeToken', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'recordTransferIn',
    outputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_feeToken', internalType: 'contract IERC20', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setAskPrice',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'store',
    outputs: [
      {
        name: '',
        internalType: 'contract FeeMarketplaceStore',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    name: 'unclockedFees',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'error',
    inputs: [
      { name: 'requested', internalType: 'uint256', type: 'uint256' },
      { name: 'available', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'FeeMarketplace__InsufficientDistributionBalance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'accruedReward', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'FeeMarketplace__InsufficientUnlockedBalance',
  },
  { type: 'error', inputs: [], name: 'FeeMarketplace__InvalidAmount' },
  { type: 'error', inputs: [], name: 'FeeMarketplace__InvalidReceiver' },
  { type: 'error', inputs: [], name: 'FeeMarketplace__NotAuctionableToken' },
  { type: 'error', inputs: [], name: 'FeeMarketplace__ZeroDeposit' },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
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
        type: 'address',
      },
      {
        name: '_router',
        internalType: 'contract TokenRouter',
        type: 'address',
      },
      {
        name: '_protocolToken',
        internalType: 'contract PuppetToken',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'getTokenBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolToken',
    outputs: [
      { name: '', internalType: 'contract PuppetToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'recordTransferIn',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'syncTokenBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    name: 'tokenBalanceMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferIn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'gasLimit', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferOut',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'Access__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Access__Unauthorized' },
  { type: 'error', inputs: [], name: 'BankStore__InsufficientBalance' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TransferUtils__TokenTransferError',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FeeMarketplaceTest
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const feeMarketplaceTestAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'IS_TEST',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeArtifacts',
    outputs: [
      {
        name: 'excludedArtifacts_',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeContracts',
    outputs: [
      {
        name: 'excludedContracts_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeSenders',
    outputs: [
      {
        name: 'excludedSenders_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'failed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'setUp',
    outputs: [],
    stateMutability: 'nonpayable',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetArtifacts',
    outputs: [
      {
        name: 'targetedArtifacts_',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetContracts',
    outputs: [
      {
        name: 'targetedContracts_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
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
          { name: 'artifacts', internalType: 'string[]', type: 'string[]' },
        ],
      },
    ],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetSenders',
    outputs: [
      {
        name: 'targetedSenders_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testBurnAddressReceipt',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testBuyAndBurnSuccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testCollectDistribution',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testCollectDistributionInsufficientBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testCollectDistributionInvalidAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testCollectDistributionInvalidReceiver',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testConfigUpdate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testDepositUpdatesState',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testExactTimeUnlock',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testFullLifecycle',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testMaxPurchase',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testMultipleDeposits',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testPartialBurnWithDistribution',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testPartialUnlock',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testSmallAmountPrecision',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testUnauthorizedAccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testZeroBuybackQuote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testZeroDepositReverts',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_address',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'int256[]',
        type: 'int256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_bytes32',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_named_address',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_named_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_named_bytes32',
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
        indexed: false,
      },
    ],
    name: 'log_named_decimal_int',
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
        indexed: false,
      },
    ],
    name: 'log_named_decimal_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_named_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_named_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_named_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'logs',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ForkTestBase
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const forkTestBaseAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'IS_TEST',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocate',
    outputs: [{ name: '', internalType: 'contract Allocate', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocationStore',
    outputs: [
      { name: '', internalType: 'contract AllocationStore', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dictator',
    outputs: [
      { name: '', internalType: 'contract Dictatorship', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeArtifacts',
    outputs: [
      {
        name: 'excludedArtifacts_',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeContracts',
    outputs: [
      {
        name: 'excludedContracts_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeSenders',
    outputs: [
      {
        name: 'excludedSenders_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'failed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeMarketplace',
    outputs: [
      { name: '', internalType: 'contract FeeMarketplace', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeMarketplaceStore',
    outputs: [
      {
        name: '',
        internalType: 'contract FeeMarketplaceStore',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isRPCAvailable',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isSetupComplete',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'keeper',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'keeperRouter',
    outputs: [
      { name: '', internalType: 'contract KeeperRouter', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'matchingRule',
    outputs: [
      { name: '', internalType: 'contract MatchingRule', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'mirrorPosition',
    outputs: [
      { name: '', internalType: 'contract MirrorPosition', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'puppet1',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'puppet2',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'puppetToken',
    outputs: [
      { name: '', internalType: 'contract PuppetToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'settle',
    outputs: [{ name: '', internalType: 'contract Settle', type: 'address' }],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetArtifacts',
    outputs: [
      {
        name: 'targetedArtifacts_',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetContracts',
    outputs: [
      {
        name: 'targetedContracts_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
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
          { name: 'artifacts', internalType: 'string[]', type: 'string[]' },
        ],
      },
    ],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetSenders',
    outputs: [
      {
        name: 'targetedSenders_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tokenRouter',
    outputs: [
      { name: '', internalType: 'contract TokenRouter', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'trader',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'userRouter',
    outputs: [
      { name: '', internalType: 'contract UserRouter', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_address',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'int256[]',
        type: 'int256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_bytes32',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_named_address',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_named_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_named_bytes32',
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
        indexed: false,
      },
    ],
    name: 'log_named_decimal_int',
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
        indexed: false,
      },
    ],
    name: 'log_named_decimal_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_named_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_named_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_named_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'logs',
  },
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SIZE_IN_USD_KEY',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IAuthority
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iAuthorityAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'method', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'logEvent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
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
    stateMutability: 'view',
  },
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
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
  },
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
    stateMutability: 'view',
  },
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
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20Abi = [
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
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
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
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
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Metadata
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20MetadataAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
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
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Mintable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20MintableAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
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
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
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
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DelegateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'previousVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateVotesChanged',
  },
  {
    type: 'error',
    inputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
    name: 'VotesExpiredSignature',
  },
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
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
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
  },
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
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'markets', internalType: 'address[]', type: 'address[]' },
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'claimAffiliateRewards',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'markets', internalType: 'address[]', type: 'address[]' },
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'claimFundingFees',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'payable',
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
                type: 'address',
              },
              {
                name: 'callbackContract',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'uiFeeReceiver',
                internalType: 'address',
                type: 'address',
              },
              { name: 'market', internalType: 'address', type: 'address' },
              {
                name: 'initialCollateralToken',
                internalType: 'contract IERC20',
                type: 'address',
              },
              {
                name: 'swapPath',
                internalType: 'address[]',
                type: 'address[]',
              },
            ],
          },
          {
            name: 'numbers',
            internalType: 'struct GmxPositionUtils.CreateOrderParamsNumbers',
            type: 'tuple',
            components: [
              {
                name: 'sizeDeltaUsd',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'initialCollateralDeltaAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'triggerPrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'acceptablePrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'executionFee',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'callbackGasLimit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minOutputAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'validFromTime',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
          {
            name: 'orderType',
            internalType: 'enum GmxPositionUtils.OrderType',
            type: 'uint8',
          },
          {
            name: 'decreasePositionSwapType',
            internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
            type: 'uint8',
          },
          { name: 'isLong', internalType: 'bool', type: 'bool' },
          {
            name: 'shouldUnwrapNativeToken',
            internalType: 'bool',
            type: 'bool',
          },
          { name: 'autoCancel', internalType: 'bool', type: 'bool' },
          { name: 'referralCode', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'createOrder',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sendNativeToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sendTokens',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sendWnt',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IGmxOracle
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iGmxOracleAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'dataStore', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'getStablePrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
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
                type: 'address',
              },
              {
                name: 'callbackContract',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'uiFeeReceiver',
                internalType: 'address',
                type: 'address',
              },
              { name: 'market', internalType: 'address', type: 'address' },
              {
                name: 'initialCollateralToken',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'swapPath',
                internalType: 'address[]',
                type: 'address[]',
              },
            ],
          },
          {
            name: 'numbers',
            internalType: 'struct GmxPositionUtils.Numbers',
            type: 'tuple',
            components: [
              {
                name: 'orderType',
                internalType: 'enum GmxPositionUtils.OrderType',
                type: 'uint8',
              },
              {
                name: 'decreasePositionSwapType',
                internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
                type: 'uint8',
              },
              {
                name: 'sizeDeltaUsd',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'initialCollateralDeltaAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'triggerPrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'acceptablePrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'executionFee',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'callbackGasLimit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minOutputAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'updatedAtTime',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'validFromTime',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
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
                type: 'bool',
              },
              { name: 'isFrozen', internalType: 'bool', type: 'bool' },
              { name: 'autoCancel', internalType: 'bool', type: 'bool' },
            ],
          },
        ],
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
                  { name: 'value', internalType: 'address', type: 'address' },
                ],
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
                    type: 'address[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'uint256', type: 'uint256' },
                ],
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
                    type: 'uint256[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'int256', type: 'int256' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.IntArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256[]', type: 'int256[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bool', type: 'bool' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BoolArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool[]', type: 'bool[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bytes32', type: 'bytes32' },
                ],
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
                    type: 'bytes32[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bytes', type: 'bytes' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BytesArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes[]', type: 'bytes[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'string', type: 'string' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.StringArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string[]', type: 'string[]' },
                ],
              },
            ],
          },
        ],
      },
    ],
    name: 'afterOrderCancellation',
    outputs: [],
    stateMutability: 'nonpayable',
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
                type: 'address',
              },
              {
                name: 'callbackContract',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'uiFeeReceiver',
                internalType: 'address',
                type: 'address',
              },
              { name: 'market', internalType: 'address', type: 'address' },
              {
                name: 'initialCollateralToken',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'swapPath',
                internalType: 'address[]',
                type: 'address[]',
              },
            ],
          },
          {
            name: 'numbers',
            internalType: 'struct GmxPositionUtils.Numbers',
            type: 'tuple',
            components: [
              {
                name: 'orderType',
                internalType: 'enum GmxPositionUtils.OrderType',
                type: 'uint8',
              },
              {
                name: 'decreasePositionSwapType',
                internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
                type: 'uint8',
              },
              {
                name: 'sizeDeltaUsd',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'initialCollateralDeltaAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'triggerPrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'acceptablePrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'executionFee',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'callbackGasLimit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minOutputAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'updatedAtTime',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'validFromTime',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
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
                type: 'bool',
              },
              { name: 'isFrozen', internalType: 'bool', type: 'bool' },
              { name: 'autoCancel', internalType: 'bool', type: 'bool' },
            ],
          },
        ],
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
                  { name: 'value', internalType: 'address', type: 'address' },
                ],
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
                    type: 'address[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'uint256', type: 'uint256' },
                ],
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
                    type: 'uint256[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'int256', type: 'int256' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.IntArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256[]', type: 'int256[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bool', type: 'bool' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BoolArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool[]', type: 'bool[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bytes32', type: 'bytes32' },
                ],
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
                    type: 'bytes32[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bytes', type: 'bytes' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BytesArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes[]', type: 'bytes[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'string', type: 'string' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.StringArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string[]', type: 'string[]' },
                ],
              },
            ],
          },
        ],
      },
    ],
    name: 'afterOrderExecution',
    outputs: [],
    stateMutability: 'nonpayable',
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
                type: 'address',
              },
              {
                name: 'callbackContract',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'uiFeeReceiver',
                internalType: 'address',
                type: 'address',
              },
              { name: 'market', internalType: 'address', type: 'address' },
              {
                name: 'initialCollateralToken',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'swapPath',
                internalType: 'address[]',
                type: 'address[]',
              },
            ],
          },
          {
            name: 'numbers',
            internalType: 'struct GmxPositionUtils.Numbers',
            type: 'tuple',
            components: [
              {
                name: 'orderType',
                internalType: 'enum GmxPositionUtils.OrderType',
                type: 'uint8',
              },
              {
                name: 'decreasePositionSwapType',
                internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
                type: 'uint8',
              },
              {
                name: 'sizeDeltaUsd',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'initialCollateralDeltaAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'triggerPrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'acceptablePrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'executionFee',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'callbackGasLimit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minOutputAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'updatedAtTime',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'validFromTime',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
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
                type: 'bool',
              },
              { name: 'isFrozen', internalType: 'bool', type: 'bool' },
              { name: 'autoCancel', internalType: 'bool', type: 'bool' },
            ],
          },
        ],
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
                  { name: 'value', internalType: 'address', type: 'address' },
                ],
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
                    type: 'address[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'uint256', type: 'uint256' },
                ],
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
                    type: 'uint256[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'int256', type: 'int256' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.IntArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256[]', type: 'int256[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bool', type: 'bool' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BoolArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool[]', type: 'bool[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bytes32', type: 'bytes32' },
                ],
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
                    type: 'bytes32[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bytes', type: 'bytes' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BytesArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes[]', type: 'bytes[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'string', type: 'string' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.StringArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string[]', type: 'string[]' },
                ],
              },
            ],
          },
        ],
      },
    ],
    name: 'afterOrderFrozen',
    outputs: [],
    stateMutability: 'nonpayable',
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
                  { name: 'value', internalType: 'address', type: 'address' },
                ],
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
                    type: 'address[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'uint256', type: 'uint256' },
                ],
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
                    type: 'uint256[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'int256', type: 'int256' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.IntArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256[]', type: 'int256[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bool', type: 'bool' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BoolArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool[]', type: 'bool[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bytes32', type: 'bytes32' },
                ],
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
                    type: 'bytes32[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bytes', type: 'bytes' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BytesArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes[]', type: 'bytes[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'string', type: 'string' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.StringArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string[]', type: 'string[]' },
                ],
              },
            ],
          },
        ],
      },
    ],
    name: 'refundExecutionFee',
    outputs: [],
    stateMutability: 'payable',
  },
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_account', internalType: 'address', type: 'address' }],
    name: 'getTraderReferralInfo',
    outputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_code', internalType: 'bytes32', type: 'bytes32' },
      { name: '_newAccount', internalType: 'address', type: 'address' },
    ],
    name: 'govSetCodeOwner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_account', internalType: 'address', type: 'address' }],
    name: 'referrerDiscountShares',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_account', internalType: 'address', type: 'address' }],
    name: 'referrerTiers',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_codeHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_owner', internalType: 'address', type: 'address' },
    ],
    name: 'setCodeOwner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_referrer', internalType: 'address', type: 'address' },
      { name: '_tierId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setReferrerTier',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tierId', internalType: 'uint256', type: 'uint256' },
      { name: '_totalRebate', internalType: 'uint256', type: 'uint256' },
      { name: '_discountShare', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setTier',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_account', internalType: 'address', type: 'address' },
      { name: '_code', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'setTraderReferralCode',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_tierLevel', internalType: 'uint256', type: 'uint256' }],
    name: 'tiers',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_account', internalType: 'address', type: 'address' }],
    name: 'traderReferralCodes',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
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
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'returnData', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    stateMutability: 'payable',
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
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate3',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
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
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate3Value',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
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
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
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
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBasefee',
    outputs: [{ name: 'basefee', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'blockNumber', internalType: 'uint256', type: 'uint256' }],
    name: 'getBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBlockNumber',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChainId',
    outputs: [{ name: 'chainid', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockCoinbase',
    outputs: [{ name: 'coinbase', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockDifficulty',
    outputs: [{ name: 'difficulty', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockGasLimit',
    outputs: [{ name: 'gaslimit', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockTimestamp',
    outputs: [{ name: 'timestamp', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'getEthBalance',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLastBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
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
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'tryAggregate',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
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
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
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
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
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
      { name: 'amount', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'burn',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount0Requested', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1Requested', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'collect',
    outputs: [
      { name: 'amount0', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount0Requested', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1Requested', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'collectProtocol',
    outputs: [
      { name: 'amount0', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'fee',
    outputs: [{ name: '', internalType: 'uint24', type: 'uint24' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeGrowthGlobal0X128',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeGrowthGlobal1X128',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'flash',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'observationCardinalityNext',
        internalType: 'uint16',
        type: 'uint16',
      },
    ],
    name: 'increaseObservationCardinalityNext',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'liquidity',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxLiquidityPerTick',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount', internalType: 'uint128', type: 'uint128' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mint',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
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
        type: 'uint160',
      },
      { name: 'initialized', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'secondsAgos', internalType: 'uint32[]', type: 'uint32[]' },
    ],
    name: 'observe',
    outputs: [
      { name: 'tickCumulatives', internalType: 'int56[]', type: 'int56[]' },
      {
        name: 'secondsPerLiquidityCumulativeX128s',
        internalType: 'uint160[]',
        type: 'uint160[]',
      },
    ],
    stateMutability: 'view',
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
        type: 'uint256',
      },
      {
        name: 'feeGrowthInside1LastX128',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'tokensOwed0', internalType: 'uint128', type: 'uint128' },
      { name: 'tokensOwed1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolFees',
    outputs: [
      { name: 'token0', internalType: 'uint128', type: 'uint128' },
      { name: 'token1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'feeProtocol0', internalType: 'uint8', type: 'uint8' },
      { name: 'feeProtocol1', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'setFeeProtocol',
    outputs: [],
    stateMutability: 'nonpayable',
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
        type: 'uint16',
      },
      {
        name: 'observationCardinalityNext',
        internalType: 'uint16',
        type: 'uint16',
      },
      { name: 'feeProtocol', internalType: 'uint8', type: 'uint8' },
      { name: 'unlocked', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
    ],
    name: 'snapshotCumulativesInside',
    outputs: [
      { name: 'tickCumulativeInside', internalType: 'int56', type: 'int56' },
      {
        name: 'secondsPerLiquidityInsideX128',
        internalType: 'uint160',
        type: 'uint160',
      },
      { name: 'secondsInside', internalType: 'uint32', type: 'uint32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'zeroForOne', internalType: 'bool', type: 'bool' },
      { name: 'amountSpecified', internalType: 'int256', type: 'int256' },
      { name: 'sqrtPriceLimitX96', internalType: 'uint160', type: 'uint160' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'swap',
    outputs: [
      { name: 'amount0', internalType: 'int256', type: 'int256' },
      { name: 'amount1', internalType: 'int256', type: 'int256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'wordPosition', internalType: 'int16', type: 'int16' }],
    name: 'tickBitmap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tickSpacing',
    outputs: [{ name: '', internalType: 'int24', type: 'int24' }],
    stateMutability: 'view',
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
        type: 'uint256',
      },
      {
        name: 'feeGrowthOutside1X128',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'tickCumulativeOutside', internalType: 'int56', type: 'int56' },
      {
        name: 'secondsPerLiquidityOutsideX128',
        internalType: 'uint160',
        type: 'uint160',
      },
      { name: 'secondsOutside', internalType: 'uint32', type: 'uint32' },
      { name: 'initialized', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token0',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token1',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Burn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'Collect',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'CollectProtocol',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'paid0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'paid1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Flash',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'observationCardinalityNextOld',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false,
      },
      {
        name: 'observationCardinalityNextNew',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false,
      },
    ],
    name: 'IncreaseObservationCardinalityNext',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sqrtPriceX96',
        internalType: 'uint160',
        type: 'uint160',
        indexed: false,
      },
      { name: 'tick', internalType: 'int24', type: 'int24', indexed: false },
    ],
    name: 'Initialize',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Mint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'feeProtocol0Old',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'feeProtocol1Old',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'feeProtocol0New',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'feeProtocol1New',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'SetFeeProtocol',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
      {
        name: 'sqrtPriceX96',
        internalType: 'uint160',
        type: 'uint160',
        indexed: false,
      },
      {
        name: 'liquidity',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      { name: 'tick', internalType: 'int24', type: 'int24', indexed: false },
    ],
    name: 'Swap',
  },
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
      { name: 'amount', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'burn',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount0Requested', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1Requested', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'collect',
    outputs: [
      { name: 'amount0', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'flash',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'observationCardinalityNext',
        internalType: 'uint16',
        type: 'uint16',
      },
    ],
    name: 'increaseObservationCardinalityNext',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount', internalType: 'uint128', type: 'uint128' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mint',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'zeroForOne', internalType: 'bool', type: 'bool' },
      { name: 'amountSpecified', internalType: 'int256', type: 'int256' },
      { name: 'sqrtPriceLimitX96', internalType: 'uint160', type: 'uint160' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'swap',
    outputs: [
      { name: 'amount0', internalType: 'int256', type: 'int256' },
      { name: 'amount1', internalType: 'int256', type: 'int256' },
    ],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IUniswapV3PoolDerivedState
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iUniswapV3PoolDerivedStateAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'secondsAgos', internalType: 'uint32[]', type: 'uint32[]' },
    ],
    name: 'observe',
    outputs: [
      { name: 'tickCumulatives', internalType: 'int56[]', type: 'int56[]' },
      {
        name: 'secondsPerLiquidityCumulativeX128s',
        internalType: 'uint160[]',
        type: 'uint160[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
    ],
    name: 'snapshotCumulativesInside',
    outputs: [
      { name: 'tickCumulativeInside', internalType: 'int56', type: 'int56' },
      {
        name: 'secondsPerLiquidityInsideX128',
        internalType: 'uint160',
        type: 'uint160',
      },
      { name: 'secondsInside', internalType: 'uint32', type: 'uint32' },
    ],
    stateMutability: 'view',
  },
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
        indexed: true,
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Burn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'Collect',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'CollectProtocol',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'paid0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'paid1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Flash',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'observationCardinalityNextOld',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false,
      },
      {
        name: 'observationCardinalityNextNew',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false,
      },
    ],
    name: 'IncreaseObservationCardinalityNext',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sqrtPriceX96',
        internalType: 'uint160',
        type: 'uint160',
        indexed: false,
      },
      { name: 'tick', internalType: 'int24', type: 'int24', indexed: false },
    ],
    name: 'Initialize',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Mint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'feeProtocol0Old',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'feeProtocol1Old',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'feeProtocol0New',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'feeProtocol1New',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'SetFeeProtocol',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
      {
        name: 'sqrtPriceX96',
        internalType: 'uint160',
        type: 'uint160',
        indexed: false,
      },
      {
        name: 'liquidity',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      { name: 'tick', internalType: 'int24', type: 'int24', indexed: false },
    ],
    name: 'Swap',
  },
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'fee',
    outputs: [{ name: '', internalType: 'uint24', type: 'uint24' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxLiquidityPerTick',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tickSpacing',
    outputs: [{ name: '', internalType: 'int24', type: 'int24' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token0',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token1',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
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
      { name: 'amount1Requested', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'collectProtocol',
    outputs: [
      { name: 'amount0', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'feeProtocol0', internalType: 'uint8', type: 'uint8' },
      { name: 'feeProtocol1', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'setFeeProtocol',
    outputs: [],
    stateMutability: 'nonpayable',
  },
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeGrowthGlobal1X128',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'liquidity',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
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
        type: 'uint160',
      },
      { name: 'initialized', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
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
        type: 'uint256',
      },
      {
        name: 'feeGrowthInside1LastX128',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'tokensOwed0', internalType: 'uint128', type: 'uint128' },
      { name: 'tokensOwed1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolFees',
    outputs: [
      { name: 'token0', internalType: 'uint128', type: 'uint128' },
      { name: 'token1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'view',
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
        type: 'uint16',
      },
      {
        name: 'observationCardinalityNext',
        internalType: 'uint16',
        type: 'uint16',
      },
      { name: 'feeProtocol', internalType: 'uint8', type: 'uint8' },
      { name: 'unlocked', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'wordPosition', internalType: 'int16', type: 'int16' }],
    name: 'tickBitmap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
        type: 'uint256',
      },
      {
        name: 'feeGrowthOutside1X128',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'tickCumulativeOutside', internalType: 'int56', type: 'int56' },
      {
        name: 'secondsPerLiquidityOutsideX128',
        internalType: 'uint160',
        type: 'uint160',
      },
      { name: 'secondsOutside', internalType: 'uint32', type: 'uint32' },
      { name: 'initialized', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
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
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DelegateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'previousVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateVotesChanged',
  },
  {
    type: 'error',
    inputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
    name: 'VotesExpiredSignature',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IWNT
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iwntAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
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
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TransferFailed',
  },
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
        type: 'address',
      },
      {
        name: '_mirrorPosition',
        internalType: 'contract MirrorPosition',
        type: 'address',
      },
      {
        name: '_matchingRule',
        internalType: 'contract MatchingRule',
        type: 'address',
      },
      { name: '_allocate', internalType: 'contract Allocate', type: 'address' },
      { name: '_settle', internalType: 'contract Settle', type: 'address' },
      {
        name: '_config',
        internalType: 'struct KeeperRouter.Config',
        type: 'tuple',
        components: [
          {
            name: 'mirrorBaseGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'mirrorPerPuppetGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'adjustBaseGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'adjustPerPuppetGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'fallbackRefundExecutionFeeReceiver',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
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
                type: 'address',
              },
              {
                name: 'callbackContract',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'uiFeeReceiver',
                internalType: 'address',
                type: 'address',
              },
              { name: 'market', internalType: 'address', type: 'address' },
              {
                name: 'initialCollateralToken',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'swapPath',
                internalType: 'address[]',
                type: 'address[]',
              },
            ],
          },
          {
            name: 'numbers',
            internalType: 'struct GmxPositionUtils.Numbers',
            type: 'tuple',
            components: [
              {
                name: 'orderType',
                internalType: 'enum GmxPositionUtils.OrderType',
                type: 'uint8',
              },
              {
                name: 'decreasePositionSwapType',
                internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
                type: 'uint8',
              },
              {
                name: 'sizeDeltaUsd',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'initialCollateralDeltaAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'triggerPrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'acceptablePrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'executionFee',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'callbackGasLimit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minOutputAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'updatedAtTime',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'validFromTime',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
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
                type: 'bool',
              },
              { name: 'isFrozen', internalType: 'bool', type: 'bool' },
              { name: 'autoCancel', internalType: 'bool', type: 'bool' },
            ],
          },
        ],
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
                  { name: 'value', internalType: 'address', type: 'address' },
                ],
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
                    type: 'address[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'uint256', type: 'uint256' },
                ],
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
                    type: 'uint256[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'int256', type: 'int256' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.IntArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256[]', type: 'int256[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bool', type: 'bool' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BoolArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool[]', type: 'bool[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bytes32', type: 'bytes32' },
                ],
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
                    type: 'bytes32[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bytes', type: 'bytes' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BytesArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes[]', type: 'bytes[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'string', type: 'string' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.StringArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string[]', type: 'string[]' },
                ],
              },
            ],
          },
        ],
      },
    ],
    name: 'afterOrderCancellation',
    outputs: [],
    stateMutability: 'nonpayable',
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
                type: 'address',
              },
              {
                name: 'callbackContract',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'uiFeeReceiver',
                internalType: 'address',
                type: 'address',
              },
              { name: 'market', internalType: 'address', type: 'address' },
              {
                name: 'initialCollateralToken',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'swapPath',
                internalType: 'address[]',
                type: 'address[]',
              },
            ],
          },
          {
            name: 'numbers',
            internalType: 'struct GmxPositionUtils.Numbers',
            type: 'tuple',
            components: [
              {
                name: 'orderType',
                internalType: 'enum GmxPositionUtils.OrderType',
                type: 'uint8',
              },
              {
                name: 'decreasePositionSwapType',
                internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
                type: 'uint8',
              },
              {
                name: 'sizeDeltaUsd',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'initialCollateralDeltaAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'triggerPrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'acceptablePrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'executionFee',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'callbackGasLimit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minOutputAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'updatedAtTime',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'validFromTime',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
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
                type: 'bool',
              },
              { name: 'isFrozen', internalType: 'bool', type: 'bool' },
              { name: 'autoCancel', internalType: 'bool', type: 'bool' },
            ],
          },
        ],
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
                  { name: 'value', internalType: 'address', type: 'address' },
                ],
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
                    type: 'address[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'uint256', type: 'uint256' },
                ],
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
                    type: 'uint256[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'int256', type: 'int256' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.IntArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256[]', type: 'int256[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bool', type: 'bool' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BoolArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool[]', type: 'bool[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bytes32', type: 'bytes32' },
                ],
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
                    type: 'bytes32[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bytes', type: 'bytes' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BytesArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes[]', type: 'bytes[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'string', type: 'string' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.StringArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string[]', type: 'string[]' },
                ],
              },
            ],
          },
        ],
      },
    ],
    name: 'afterOrderExecution',
    outputs: [],
    stateMutability: 'nonpayable',
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
                type: 'address',
              },
              {
                name: 'callbackContract',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'uiFeeReceiver',
                internalType: 'address',
                type: 'address',
              },
              { name: 'market', internalType: 'address', type: 'address' },
              {
                name: 'initialCollateralToken',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'swapPath',
                internalType: 'address[]',
                type: 'address[]',
              },
            ],
          },
          {
            name: 'numbers',
            internalType: 'struct GmxPositionUtils.Numbers',
            type: 'tuple',
            components: [
              {
                name: 'orderType',
                internalType: 'enum GmxPositionUtils.OrderType',
                type: 'uint8',
              },
              {
                name: 'decreasePositionSwapType',
                internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
                type: 'uint8',
              },
              {
                name: 'sizeDeltaUsd',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'initialCollateralDeltaAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'triggerPrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'acceptablePrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'executionFee',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'callbackGasLimit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minOutputAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'updatedAtTime',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'validFromTime',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
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
                type: 'bool',
              },
              { name: 'isFrozen', internalType: 'bool', type: 'bool' },
              { name: 'autoCancel', internalType: 'bool', type: 'bool' },
            ],
          },
        ],
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
                  { name: 'value', internalType: 'address', type: 'address' },
                ],
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
                    type: 'address[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'uint256', type: 'uint256' },
                ],
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
                    type: 'uint256[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'int256', type: 'int256' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.IntArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256[]', type: 'int256[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bool', type: 'bool' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BoolArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool[]', type: 'bool[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bytes32', type: 'bytes32' },
                ],
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
                    type: 'bytes32[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bytes', type: 'bytes' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BytesArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes[]', type: 'bytes[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'string', type: 'string' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.StringArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string[]', type: 'string[]' },
                ],
              },
            ],
          },
        ],
      },
    ],
    name: 'afterOrderFrozen',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocate',
    outputs: [{ name: '', internalType: 'contract Allocate', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_allocationAccount', internalType: 'address', type: 'address' },
      { name: '_dustToken', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
    ],
    name: 'collectDust',
    outputs: [{ name: 'dustAmount', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
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
            type: 'uint256',
          },
          {
            name: 'mirrorPerPuppetGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'adjustBaseGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'adjustPerPuppetGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'fallbackRefundExecutionFeeReceiver',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'matchingRule',
    outputs: [
      { name: '', internalType: 'contract MatchingRule', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'mirrorPosition',
    outputs: [
      { name: '', internalType: 'contract MirrorPosition', type: 'address' },
    ],
    stateMutability: 'view',
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
                  { name: 'value', internalType: 'address', type: 'address' },
                ],
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
                    type: 'address[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'uint256', type: 'uint256' },
                ],
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
                    type: 'uint256[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'int256', type: 'int256' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.IntArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'int256[]', type: 'int256[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bool', type: 'bool' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BoolArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bool[]', type: 'bool[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bytes32', type: 'bytes32' },
                ],
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
                    type: 'bytes32[]',
                  },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'bytes', type: 'bytes' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.BytesArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'bytes[]', type: 'bytes[]' },
                ],
              },
            ],
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
                  { name: 'value', internalType: 'string', type: 'string' },
                ],
              },
              {
                name: 'arrayItems',
                internalType: 'struct GmxPositionUtils.StringArrayKeyValue[]',
                type: 'tuple[]',
                components: [
                  { name: 'key', internalType: 'string', type: 'string' },
                  { name: 'value', internalType: 'string[]', type: 'string[]' },
                ],
              },
            ],
          },
        ],
      },
    ],
    name: 'refundExecutionFee',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_allocParams',
        internalType: 'struct Allocate.CallAllocation',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address',
          },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'puppetList', internalType: 'address[]', type: 'address[]' },
          { name: 'allocationId', internalType: 'uint256', type: 'uint256' },
          { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
          {
            name: 'keeperFeeReceiver',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
      {
        name: '_callParams',
        internalType: 'struct MirrorPosition.CallPosition',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address',
          },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'market', internalType: 'address', type: 'address' },
          { name: 'isIncrease', internalType: 'bool', type: 'bool' },
          { name: 'isLong', internalType: 'bool', type: 'bool' },
          { name: 'executionFee', internalType: 'uint256', type: 'uint256' },
          { name: 'collateralDelta', internalType: 'uint256', type: 'uint256' },
          { name: 'sizeDeltaInUsd', internalType: 'uint256', type: 'uint256' },
          { name: 'acceptablePrice', internalType: 'uint256', type: 'uint256' },
          { name: 'triggerPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'requestKey', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'requestAdjust',
    outputs: [
      { name: '_requestKey', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_allocParams',
        internalType: 'struct Allocate.CallAllocation',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address',
          },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'puppetList', internalType: 'address[]', type: 'address[]' },
          { name: 'allocationId', internalType: 'uint256', type: 'uint256' },
          { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
          {
            name: 'keeperFeeReceiver',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
      {
        name: '_callParams',
        internalType: 'struct MirrorPosition.CallPosition',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address',
          },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'market', internalType: 'address', type: 'address' },
          { name: 'isIncrease', internalType: 'bool', type: 'bool' },
          { name: 'isLong', internalType: 'bool', type: 'bool' },
          { name: 'executionFee', internalType: 'uint256', type: 'uint256' },
          { name: 'collateralDelta', internalType: 'uint256', type: 'uint256' },
          { name: 'sizeDeltaInUsd', internalType: 'uint256', type: 'uint256' },
          { name: 'acceptablePrice', internalType: 'uint256', type: 'uint256' },
          { name: 'triggerPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'requestKey', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'requestMirror',
    outputs: [
      { name: '_allocationAddress', internalType: 'address', type: 'address' },
      { name: '_requestKey', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'settle',
    outputs: [{ name: '', internalType: 'contract Settle', type: 'address' }],
    stateMutability: 'view',
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
            type: 'address',
          },
          {
            name: 'distributionToken',
            internalType: 'contract IERC20',
            type: 'address',
          },
          {
            name: 'keeperFeeReceiver',
            internalType: 'address',
            type: 'address',
          },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'allocationId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'keeperExecutionFee',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
      { name: '_puppetList', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'settleAllocation',
    outputs: [
      { name: 'settledBalance', internalType: 'uint256', type: 'uint256' },
      { name: 'distributionAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'platformFeeAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  { type: 'error', inputs: [], name: 'KeeperRouter__FailedRefundExecutionFee' },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MatchingRule
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const matchingRuleAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address',
      },
      {
        name: '_store',
        internalType: 'contract AllocationStore',
        type: 'address',
      },
      {
        name: '_config',
        internalType: 'struct MatchingRule.Config',
        type: 'tuple',
        components: [
          {
            name: 'transferOutGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'minExpiryDuration',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'minAllowanceRate',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxAllowanceRate',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'minActivityThrottle',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxActivityThrottle',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_collateralToken',
        internalType: 'contract IERC20',
        type: 'address',
      },
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getConfig',
    outputs: [
      {
        name: '',
        internalType: 'struct MatchingRule.Config',
        type: 'tuple',
        components: [
          {
            name: 'transferOutGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'minExpiryDuration',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'minAllowanceRate',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxAllowanceRate',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'minActivityThrottle',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxActivityThrottle',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_traderMatchingKey', internalType: 'bytes32', type: 'bytes32' },
      { name: '_puppetList', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'getRuleList',
    outputs: [
      {
        name: '_ruleList',
        internalType: 'struct MatchingRule.Rule[]',
        type: 'tuple[]',
        components: [
          { name: 'allowanceRate', internalType: 'uint256', type: 'uint256' },
          {
            name: 'throttleActivity',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'expiry', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'traderMatchingKey', internalType: 'bytes32', type: 'bytes32' },
      { name: 'puppet', internalType: 'address', type: 'address' },
    ],
    name: 'matchingRuleMap',
    outputs: [
      { name: 'allowanceRate', internalType: 'uint256', type: 'uint256' },
      { name: 'throttleActivity', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'allocate', internalType: 'contract Allocate', type: 'address' },
      {
        name: '_collateralToken',
        internalType: 'contract IERC20',
        type: 'address',
      },
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_trader', internalType: 'address', type: 'address' },
      {
        name: '_ruleParams',
        internalType: 'struct MatchingRule.Rule',
        type: 'tuple',
        components: [
          { name: 'allowanceRate', internalType: 'uint256', type: 'uint256' },
          {
            name: 'throttleActivity',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'expiry', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'setRule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_tokenAllowanceList',
        internalType: 'contract IERC20[]',
        type: 'address[]',
      },
      {
        name: '_tokenDustThresholdCapList',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
    ],
    name: 'setTokenAllowanceList',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'store',
    outputs: [
      { name: '', internalType: 'contract AllocationStore', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenAllowanceList',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_collateralToken',
        internalType: 'contract IERC20',
        type: 'address',
      },
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [
      { name: 'allowanceCap', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MatchingRule__AllowanceAboveLimit',
  },
  { type: 'error', inputs: [], name: 'MatchingRule__InsufficientBalance' },
  {
    type: 'error',
    inputs: [
      {
        name: 'minAllocationActivity',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'maxAllocationActivity',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'MatchingRule__InvalidActivityThrottle',
  },
  {
    type: 'error',
    inputs: [
      { name: 'min', internalType: 'uint256', type: 'uint256' },
      { name: 'max', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MatchingRule__InvalidAllowanceRate',
  },
  { type: 'error', inputs: [], name: 'MatchingRule__InvalidAmount' },
  {
    type: 'error',
    inputs: [
      { name: 'minExpiryDuration', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MatchingRule__InvalidExpiryDuration',
  },
  { type: 'error', inputs: [], name: 'MatchingRule__TokenNotAllowed' },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MirrorPosition
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mirrorPositionAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_authority',
        internalType: 'contract IAuthority',
        type: 'address',
      },
      {
        name: '_config',
        internalType: 'struct MirrorPosition.Config',
        type: 'tuple',
        components: [
          {
            name: 'gmxExchangeRouter',
            internalType: 'contract IGmxExchangeRouter',
            type: 'address',
          },
          { name: 'gmxOrderVault', internalType: 'address', type: 'address' },
          { name: 'referralCode', internalType: 'bytes32', type: 'bytes32' },
          {
            name: 'increaseCallbackGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'decreaseCallbackGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'fallbackRefundExecutionFeeReceiver',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_requestKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getConfig',
    outputs: [
      {
        name: '',
        internalType: 'struct MirrorPosition.Config',
        type: 'tuple',
        components: [
          {
            name: 'gmxExchangeRouter',
            internalType: 'contract IGmxExchangeRouter',
            type: 'address',
          },
          { name: 'gmxOrderVault', internalType: 'address', type: 'address' },
          { name: 'referralCode', internalType: 'bytes32', type: 'bytes32' },
          {
            name: 'increaseCallbackGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'decreaseCallbackGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'fallbackRefundExecutionFeeReceiver',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_allocationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getPosition',
    outputs: [
      {
        name: '',
        internalType: 'struct MirrorPosition.Position',
        type: 'tuple',
        components: [
          { name: 'size', internalType: 'uint256', type: 'uint256' },
          { name: 'traderSize', internalType: 'uint256', type: 'uint256' },
          {
            name: 'traderCollateral',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_requestKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRequestAdjustment',
    outputs: [
      {
        name: '',
        internalType: 'struct MirrorPosition.RequestAdjustment',
        type: 'tuple',
        components: [
          {
            name: 'allocationAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'traderIsIncrease', internalType: 'bool', type: 'bool' },
          {
            name: 'traderTargetLeverage',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'traderCollateralDelta',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'traderSizeDelta', internalType: 'uint256', type: 'uint256' },
          { name: 'sizeDelta', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_allocationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'liquidate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'positionMap',
    outputs: [
      { name: 'size', internalType: 'uint256', type: 'uint256' },
      { name: 'traderSize', internalType: 'uint256', type: 'uint256' },
      { name: 'traderCollateral', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_params',
        internalType: 'struct MirrorPosition.CallPosition',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address',
          },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'market', internalType: 'address', type: 'address' },
          { name: 'isIncrease', internalType: 'bool', type: 'bool' },
          { name: 'isLong', internalType: 'bool', type: 'bool' },
          { name: 'executionFee', internalType: 'uint256', type: 'uint256' },
          { name: 'collateralDelta', internalType: 'uint256', type: 'uint256' },
          { name: 'sizeDeltaInUsd', internalType: 'uint256', type: 'uint256' },
          { name: 'acceptablePrice', internalType: 'uint256', type: 'uint256' },
          { name: 'triggerPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'requestKey', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: '_allocationAddress', internalType: 'address', type: 'address' },
      { name: '_allocation', internalType: 'uint256', type: 'uint256' },
      { name: '_callbackContract', internalType: 'address', type: 'address' },
    ],
    name: 'requestAdjust',
    outputs: [
      { name: '_requestKey', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'requestKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'requestAdjustmentMap',
    outputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
      { name: 'traderIsIncrease', internalType: 'bool', type: 'bool' },
      {
        name: 'traderTargetLeverage',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'traderCollateralDelta',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'traderSizeDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'sizeDelta', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_params',
        internalType: 'struct MirrorPosition.CallPosition',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address',
          },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'market', internalType: 'address', type: 'address' },
          { name: 'isIncrease', internalType: 'bool', type: 'bool' },
          { name: 'isLong', internalType: 'bool', type: 'bool' },
          { name: 'executionFee', internalType: 'uint256', type: 'uint256' },
          { name: 'collateralDelta', internalType: 'uint256', type: 'uint256' },
          { name: 'sizeDeltaInUsd', internalType: 'uint256', type: 'uint256' },
          { name: 'acceptablePrice', internalType: 'uint256', type: 'uint256' },
          { name: 'triggerPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'requestKey', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: '_allocationAddress', internalType: 'address', type: 'address' },
      { name: '_allocation', internalType: 'uint256', type: 'uint256' },
      { name: '_callbackContract', internalType: 'address', type: 'address' },
    ],
    name: 'requestMirror',
    outputs: [
      { name: '_requestKey', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unhandledCallbackListId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'unhandledCallbackListSequenceId',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'unhandledCallbackMap',
    outputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'key', internalType: 'bytes32', type: 'bytes32' },
      { name: 'error', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'error',
    inputs: [{ name: 'requestKey', internalType: 'bytes32', type: 'bytes32' }],
    name: 'MirrorPosition__ExecutionRequestMissing',
  },
  { type: 'error', inputs: [], name: 'MirrorPosition__InitialMustBeIncrease' },
  {
    type: 'error',
    inputs: [
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MirrorPosition__InsufficientGmxExecutionFee',
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'MirrorPosition__InvalidAllocation',
  },
  { type: 'error', inputs: [], name: 'MirrorPosition__InvalidCollateralDelta' },
  { type: 'error', inputs: [], name: 'MirrorPosition__InvalidCurrentLeverage' },
  { type: 'error', inputs: [], name: 'MirrorPosition__InvalidSizeDelta' },
  { type: 'error', inputs: [], name: 'MirrorPosition__NoAdjustmentRequired' },
  { type: 'error', inputs: [], name: 'MirrorPosition__OrderCreationFailed' },
  {
    type: 'error',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'MirrorPosition__PositionNotFound',
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'MirrorPosition__TraderCollateralZero',
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockErc20Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: 'decimals_', internalType: 'uint8', type: 'uint8' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
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
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockGmxExchangeRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockGmxExchangeRouterAbi = [
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'cancelOrder',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address[]', type: 'address[]' },
      { name: '', internalType: 'address[]', type: 'address[]' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'claimAffiliateRewards',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address[]', type: 'address[]' },
      { name: '', internalType: 'address[]', type: 'address[]' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'claimFundingFees',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'payable',
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
                type: 'address',
              },
              {
                name: 'callbackContract',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'uiFeeReceiver',
                internalType: 'address',
                type: 'address',
              },
              { name: 'market', internalType: 'address', type: 'address' },
              {
                name: 'initialCollateralToken',
                internalType: 'contract IERC20',
                type: 'address',
              },
              {
                name: 'swapPath',
                internalType: 'address[]',
                type: 'address[]',
              },
            ],
          },
          {
            name: 'numbers',
            internalType: 'struct GmxPositionUtils.CreateOrderParamsNumbers',
            type: 'tuple',
            components: [
              {
                name: 'sizeDeltaUsd',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'initialCollateralDeltaAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'triggerPrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'acceptablePrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'executionFee',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'callbackGasLimit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minOutputAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'validFromTime',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
          {
            name: 'orderType',
            internalType: 'enum GmxPositionUtils.OrderType',
            type: 'uint8',
          },
          {
            name: 'decreasePositionSwapType',
            internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
            type: 'uint8',
          },
          { name: 'isLong', internalType: 'bool', type: 'bool' },
          {
            name: 'shouldUnwrapNativeToken',
            internalType: 'bool',
            type: 'bool',
          },
          { name: 'autoCancel', internalType: 'bool', type: 'bool' },
          { name: 'referralCode', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'createOrder',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'orderCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'orders',
    outputs: [
      {
        name: 'addresses',
        internalType: 'struct GmxPositionUtils.CreateOrderParamsAddresses',
        type: 'tuple',
        components: [
          { name: 'receiver', internalType: 'address', type: 'address' },
          {
            name: 'cancellationReceiver',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'callbackContract',
            internalType: 'address',
            type: 'address',
          },
          { name: 'uiFeeReceiver', internalType: 'address', type: 'address' },
          { name: 'market', internalType: 'address', type: 'address' },
          {
            name: 'initialCollateralToken',
            internalType: 'contract IERC20',
            type: 'address',
          },
          { name: 'swapPath', internalType: 'address[]', type: 'address[]' },
        ],
      },
      {
        name: 'numbers',
        internalType: 'struct GmxPositionUtils.CreateOrderParamsNumbers',
        type: 'tuple',
        components: [
          { name: 'sizeDeltaUsd', internalType: 'uint256', type: 'uint256' },
          {
            name: 'initialCollateralDeltaAmount',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'triggerPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'acceptablePrice', internalType: 'uint256', type: 'uint256' },
          { name: 'executionFee', internalType: 'uint256', type: 'uint256' },
          {
            name: 'callbackGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'minOutputAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'validFromTime', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'orderType',
        internalType: 'enum GmxPositionUtils.OrderType',
        type: 'uint8',
      },
      {
        name: 'decreasePositionSwapType',
        internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
        type: 'uint8',
      },
      { name: 'isLong', internalType: 'bool', type: 'bool' },
      { name: 'shouldUnwrapNativeToken', internalType: 'bool', type: 'bool' },
      { name: 'autoCancel', internalType: 'bool', type: 'bool' },
      { name: 'referralCode', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sendNativeToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sendTokens',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sendWnt',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'orderId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
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
                type: 'address',
              },
              {
                name: 'callbackContract',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'uiFeeReceiver',
                internalType: 'address',
                type: 'address',
              },
              { name: 'market', internalType: 'address', type: 'address' },
              {
                name: 'initialCollateralToken',
                internalType: 'contract IERC20',
                type: 'address',
              },
              {
                name: 'swapPath',
                internalType: 'address[]',
                type: 'address[]',
              },
            ],
          },
          {
            name: 'numbers',
            internalType: 'struct GmxPositionUtils.CreateOrderParamsNumbers',
            type: 'tuple',
            components: [
              {
                name: 'sizeDeltaUsd',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'initialCollateralDeltaAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'triggerPrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'acceptablePrice',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'executionFee',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'callbackGasLimit',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minOutputAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'validFromTime',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
          {
            name: 'orderType',
            internalType: 'enum GmxPositionUtils.OrderType',
            type: 'uint8',
          },
          {
            name: 'decreasePositionSwapType',
            internalType: 'enum GmxPositionUtils.DecreasePositionSwapType',
            type: 'uint8',
          },
          { name: 'isLong', internalType: 'bool', type: 'bool' },
          {
            name: 'shouldUnwrapNativeToken',
            internalType: 'bool',
            type: 'bool',
          },
          { name: 'autoCancel', internalType: 'bool', type: 'bool' },
          { name: 'referralCode', internalType: 'bytes32', type: 'bytes32' },
        ],
        indexed: false,
      },
    ],
    name: 'OrderCreated',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockUniswapV3Pool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockUniswapV3PoolAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'initialSqrtPriceX96', internalType: 'uint160', type: 'uint160' },
      { name: '_token0', internalType: 'address', type: 'address' },
      { name: '_token1', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'burn',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount0Requested', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1Requested', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'collect',
    outputs: [
      { name: 'amount0', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount0Requested', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1Requested', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'collectProtocol',
    outputs: [
      { name: 'amount0', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'fee',
    outputs: [{ name: '', internalType: 'uint24', type: 'uint24' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeGrowthGlobal0X128',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeGrowthGlobal1X128',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'flash',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'observationCardinalityNext',
        internalType: 'uint16',
        type: 'uint16',
      },
    ],
    name: 'increaseObservationCardinalityNext',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'liquidity',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxLiquidityPerTick',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount', internalType: 'uint128', type: 'uint128' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mint',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
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
        type: 'uint160',
      },
      { name: 'initialized', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint32[]', type: 'uint32[]' }],
    name: 'observe',
    outputs: [
      { name: '', internalType: 'int56[]', type: 'int56[]' },
      { name: '', internalType: 'uint160[]', type: 'uint160[]' },
    ],
    stateMutability: 'pure',
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
        type: 'uint256',
      },
      {
        name: 'feeGrowthInside1LastX128',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'tokensOwed0', internalType: 'uint128', type: 'uint128' },
      { name: 'tokensOwed1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolFees',
    outputs: [
      { name: '_token0', internalType: 'uint128', type: 'uint128' },
      { name: '_token1', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'feeProtocol0', internalType: 'uint8', type: 'uint8' },
      { name: 'feeProtocol1', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'setFeeProtocol',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_ratio', internalType: 'uint256', type: 'uint256' }],
    name: 'setSqrtPriceX96',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'slot0',
    outputs: [
      { name: '_sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
      { name: 'tick', internalType: 'int24', type: 'int24' },
      { name: 'observationIndex', internalType: 'uint16', type: 'uint16' },
      {
        name: 'observationCardinality',
        internalType: 'uint16',
        type: 'uint16',
      },
      {
        name: 'observationCardinalityNext',
        internalType: 'uint16',
        type: 'uint16',
      },
      { name: 'feeProtocol', internalType: 'uint8', type: 'uint8' },
      { name: '_unlocked', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
    ],
    name: 'snapshotCumulativesInside',
    outputs: [
      { name: 'tickCumulativeInside', internalType: 'int56', type: 'int56' },
      {
        name: 'secondsPerLiquidityInsideX128',
        internalType: 'uint160',
        type: 'uint160',
      },
      { name: 'secondsInside', internalType: 'uint32', type: 'uint32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sqrtPriceX96',
    outputs: [{ name: '', internalType: 'uint160', type: 'uint160' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'zeroForOne', internalType: 'bool', type: 'bool' },
      { name: 'amountSpecified', internalType: 'int256', type: 'int256' },
      { name: 'sqrtPriceLimitX96', internalType: 'uint160', type: 'uint160' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'swap',
    outputs: [
      { name: 'amount0', internalType: 'int256', type: 'int256' },
      { name: 'amount1', internalType: 'int256', type: 'int256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'wordPosition', internalType: 'int16', type: 'int16' }],
    name: 'tickBitmap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tickSpacing',
    outputs: [{ name: '', internalType: 'int24', type: 'int24' }],
    stateMutability: 'view',
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
        type: 'uint256',
      },
      {
        name: 'feeGrowthOutside1X128',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'tickCumulativeOutside', internalType: 'int56', type: 'int56' },
      {
        name: 'secondsPerLiquidityOutsideX128',
        internalType: 'uint160',
        type: 'uint160',
      },
      { name: 'secondsOutside', internalType: 'uint32', type: 'uint32' },
      { name: 'initialized', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token0',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token1',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unlocked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Burn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'Collect',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'CollectProtocol',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'paid0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'paid1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Flash',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'observationCardinalityNextOld',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false,
      },
      {
        name: 'observationCardinalityNextNew',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false,
      },
    ],
    name: 'IncreaseObservationCardinalityNext',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sqrtPriceX96',
        internalType: 'uint160',
        type: 'uint160',
        indexed: false,
      },
      { name: 'tick', internalType: 'int24', type: 'int24', indexed: false },
    ],
    name: 'Initialize',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tickLower',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'tickUpper',
        internalType: 'int24',
        type: 'int24',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Mint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sqrtPriceX96',
        internalType: 'uint160',
        type: 'uint160',
        indexed: false,
      },
    ],
    name: 'PoolInitialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'feeProtocol0Old',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'feeProtocol1Old',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'feeProtocol0New',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'feeProtocol1New',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'SetFeeProtocol',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
      {
        name: 'sqrtPriceX96',
        internalType: 'uint160',
        type: 'uint160',
        indexed: false,
      },
      {
        name: 'liquidity',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      { name: 'tick', internalType: 'int24', type: 'int24', indexed: false },
    ],
    name: 'Swap',
  },
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
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  { type: 'error', inputs: [], name: 'FailedCall' },
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
    stateMutability: 'view',
  },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Permission
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const permissionAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FLOAT_PRECISION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Proxy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const proxyAbi = [
  { type: 'fallback', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PuppetToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const puppetTokenAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
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
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
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
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'pos', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'checkpoints',
    outputs: [
      {
        name: '',
        internalType: 'struct Checkpoints.Checkpoint208',
        type: 'tuple',
        components: [
          { name: '_key', internalType: 'uint48', type: 'uint48' },
          { name: '_value', internalType: 'uint208', type: 'uint208' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
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
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'numCheckpoints',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DelegateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'previousVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateVotesChanged',
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
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
  {
    type: 'error',
    inputs: [
      { name: 'increasedSupply', internalType: 'uint256', type: 'uint256' },
      { name: 'cap', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20ExceededSafeSupply',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'clock', internalType: 'uint48', type: 'uint48' },
    ],
    name: 'ERC5805FutureLookup',
  },
  { type: 'error', inputs: [], name: 'ERC6372InconsistentClock' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'PuppetVoteToken__Unsupported' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
  {
    type: 'error',
    inputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
    name: 'VotesExpiredSignature',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ReentrancyGuardTransient
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const reentrancyGuardTransientAbi = [
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
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
        type: 'address',
      },
      {
        name: '_rewardToken',
        internalType: 'contract IERC20',
        type: 'address',
      },
      { name: '_vToken', internalType: 'contract IERC20', type: 'address' },
      { name: '_store', internalType: 'contract RewardStore', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_user', internalType: 'address', type: 'address' }],
    name: 'claimable',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cumulativeRewardPerToken',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastDistributionTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingDistribution',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rewardToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'store',
    outputs: [
      { name: '', internalType: 'contract RewardStore', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalUndistributed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_referralStorage',
        internalType: 'contract IGmxReferralStorage',
        type: 'address',
      },
      { name: '_code', internalType: 'bytes32', type: 'bytes32' },
      { name: '_newOwner', internalType: 'address', type: 'address' },
    ],
    name: 'transferReferralOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'userRewardMap',
    outputs: [
      {
        name: 'cumulativeRewardCheckpoint',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'accrued', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'vToken',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  {
    type: 'error',
    inputs: [{ name: 'accured', internalType: 'uint256', type: 'uint256' }],
    name: 'RewardDistributor__InsufficientRewards',
  },
  { type: 'error', inputs: [], name: 'RewardDistributor__InvalidAmount' },
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
        type: 'address',
      },
      {
        name: '_router',
        internalType: 'contract TokenRouter',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'getTokenBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'recordTransferIn',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'syncTokenBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    name: 'tokenBalanceMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferIn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'gasLimit', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferOut',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'Access__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Access__Unauthorized' },
  { type: 'error', inputs: [], name: 'BankStore__InsufficientBalance' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TransferUtils__TokenTransferError',
  },
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
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'fallback', stateMutability: 'payable' },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_impl', internalType: 'address', type: 'address' }],
    name: 'update',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  { type: 'error', inputs: [], name: 'Access__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Access__Unauthorized' },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1967InvalidImplementation',
  },
  { type: 'error', inputs: [], name: 'ERC1967NonPayable' },
  { type: 'error', inputs: [], name: 'FailedCall' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SafeCast
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const safeCastAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'int256', type: 'int256' },
    ],
    name: 'SafeCastOverflowedIntDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'int256', type: 'int256' }],
    name: 'SafeCastOverflowedIntToUint',
  },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'SafeCastOverflowedUintToInt',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Script
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const scriptAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'IS_SCRIPT',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
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
        type: 'address',
      },
      {
        name: '_allocationStore',
        internalType: 'contract AllocationStore',
        type: 'address',
      },
      {
        name: '_config',
        internalType: 'struct Settle.Config',
        type: 'tuple',
        components: [
          {
            name: 'transferOutGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'platformSettleFeeFactor',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxKeeperFeeToSettleRatio',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxPuppetList', internalType: 'uint256', type: 'uint256' },
          {
            name: 'allocationAccountTransferGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocationStore',
    outputs: [
      { name: '', internalType: 'contract AllocationStore', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_allocationAccount',
        internalType: 'contract AllocationAccount',
        type: 'address',
      },
      { name: '_dustToken', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
    ],
    name: 'collectDust',
    outputs: [
      { name: '_dustAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'collectFees',
    outputs: [],
    stateMutability: 'nonpayable',
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
            type: 'uint256',
          },
          {
            name: 'platformSettleFeeFactor',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxKeeperFeeToSettleRatio',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxPuppetList', internalType: 'uint256', type: 'uint256' },
          {
            name: 'allocationAccountTransferGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'platformFeeMap',
    outputs: [
      { name: 'accumulatedFees', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_tokenDustThresholdList',
        internalType: 'contract IERC20[]',
        type: 'address[]',
      },
      {
        name: '_tokenDustThresholdCapList',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
    ],
    name: 'setTokenDustThresholdList',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_allocate', internalType: 'contract Allocate', type: 'address' },
      {
        name: '_callParams',
        internalType: 'struct Settle.CallSettle',
        type: 'tuple',
        components: [
          {
            name: 'collateralToken',
            internalType: 'contract IERC20',
            type: 'address',
          },
          {
            name: 'distributionToken',
            internalType: 'contract IERC20',
            type: 'address',
          },
          {
            name: 'keeperFeeReceiver',
            internalType: 'address',
            type: 'address',
          },
          { name: 'trader', internalType: 'address', type: 'address' },
          { name: 'allocationId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'keeperExecutionFee',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
      { name: '_puppetList', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'settle',
    outputs: [
      { name: '_settledAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_distributionAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_platformFeeAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'tokenDustThresholdAmountMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenDustThresholdList',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'error',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'threshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__AmountExceedsDustThreshold',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'Allocation__DustThresholdNotSet',
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'Allocation__DustTransferFailed',
  },
  {
    type: 'error',
    inputs: [
      { name: 'allocationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'Allocation__InvalidAllocation',
  },
  {
    type: 'error',
    inputs: [],
    name: 'Allocation__InvalidKeeperExecutionFeeAmount',
  },
  {
    type: 'error',
    inputs: [],
    name: 'Allocation__InvalidKeeperExecutionFeeReceiver',
  },
  { type: 'error', inputs: [], name: 'Allocation__InvalidReceiver' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'recordedAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'settledAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__InvalidSettledAmount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'keeperFee', internalType: 'uint256', type: 'uint256' },
      { name: 'settledAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__KeeperFeeExceedsSettledAmount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'Allocation__NoDustToCollect',
  },
  { type: 'error', inputs: [], name: 'Allocation__PuppetListEmpty' },
  {
    type: 'error',
    inputs: [
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
      { name: 'maximum', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'Allocation__PuppetListExceedsMaximum',
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'Allocation__SettlementTransferFailed',
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ShortStrings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const shortStringsAbi = [
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// StdAssertions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stdAssertionsAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'failed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_address',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'int256[]',
        type: 'int256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_bytes32',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_named_address',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_named_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_named_bytes32',
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
        indexed: false,
      },
    ],
    name: 'log_named_decimal_int',
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
        indexed: false,
      },
    ],
    name: 'log_named_decimal_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_named_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_named_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_named_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'logs',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// StdInvariant
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stdInvariantAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'excludeArtifacts',
    outputs: [
      {
        name: 'excludedArtifacts_',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeContracts',
    outputs: [
      {
        name: 'excludedContracts_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeSenders',
    outputs: [
      {
        name: 'excludedSenders_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetArtifacts',
    outputs: [
      {
        name: 'targetedArtifacts_',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetContracts',
    outputs: [
      {
        name: 'targetedContracts_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
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
          { name: 'artifacts', internalType: 'string[]', type: 'string[]' },
        ],
      },
    ],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetSenders',
    outputs: [
      {
        name: 'targetedSenders_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Strings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stringsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'length', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'StringsInsufficientHexLength',
  },
  { type: 'error', inputs: [], name: 'StringsInvalidAddressFormat' },
  { type: 'error', inputs: [], name: 'StringsInvalidChar' },
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeArtifacts',
    outputs: [
      {
        name: 'excludedArtifacts_',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeContracts',
    outputs: [
      {
        name: 'excludedContracts_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeSenders',
    outputs: [
      {
        name: 'excludedSenders_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'failed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetArtifacts',
    outputs: [
      {
        name: 'targetedArtifacts_',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetContracts',
    outputs: [
      {
        name: 'targetedContracts_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
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
          { name: 'artifacts', internalType: 'string[]', type: 'string[]' },
        ],
      },
    ],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetSenders',
    outputs: [
      {
        name: 'targetedSenders_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_address',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'int256[]',
        type: 'int256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_bytes32',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_named_address',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_named_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_named_bytes32',
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
        indexed: false,
      },
    ],
    name: 'log_named_decimal_int',
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
        indexed: false,
      },
    ],
    name: 'log_named_decimal_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_named_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_named_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_named_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'logs',
  },
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
        type: 'address',
      },
      {
        name: '_config',
        internalType: 'struct TokenRouter.Config',
        type: 'tuple',
        components: [
          {
            name: 'transferGasLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
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
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'TokenRouter__EmptyTokenTranferGasLimit' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TransferUtils__TokenTransferFromError',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TradingForkTest
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tradingForkTestAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'IS_TEST',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocate',
    outputs: [{ name: '', internalType: 'contract Allocate', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocationStore',
    outputs: [
      { name: '', internalType: 'contract AllocationStore', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dictator',
    outputs: [
      { name: '', internalType: 'contract Dictatorship', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeArtifacts',
    outputs: [
      {
        name: 'excludedArtifacts_',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeContracts',
    outputs: [
      {
        name: 'excludedContracts_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeSenders',
    outputs: [
      {
        name: 'excludedSenders_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'failed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeMarketplace',
    outputs: [
      { name: '', internalType: 'contract FeeMarketplace', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeMarketplaceStore',
    outputs: [
      {
        name: '',
        internalType: 'contract FeeMarketplaceStore',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isRPCAvailable',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isSetupComplete',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'keeper',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'keeperRouter',
    outputs: [
      { name: '', internalType: 'contract KeeperRouter', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'matchingRule',
    outputs: [
      { name: '', internalType: 'contract MatchingRule', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'mirrorPosition',
    outputs: [
      { name: '', internalType: 'contract MirrorPosition', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'puppet1',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'puppet2',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'puppetToken',
    outputs: [
      { name: '', internalType: 'contract PuppetToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'setUp',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'settle',
    outputs: [{ name: '', internalType: 'contract Settle', type: 'address' }],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetArtifacts',
    outputs: [
      {
        name: 'targetedArtifacts_',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetContracts',
    outputs: [
      {
        name: 'targetedContracts_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
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
          { name: 'artifacts', internalType: 'string[]', type: 'string[]' },
        ],
      },
    ],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetSenders',
    outputs: [
      {
        name: 'targetedSenders_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testCompleteMirrorToSettlement',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testGasAnalysisReport',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testLiveGmxPositionMirror',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tokenRouter',
    outputs: [
      { name: '', internalType: 'contract TokenRouter', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'trader',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'userRouter',
    outputs: [
      { name: '', internalType: 'contract UserRouter', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_address',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'int256[]',
        type: 'int256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_bytes32',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_named_address',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_named_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_named_bytes32',
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
        indexed: false,
      },
    ],
    name: 'log_named_decimal_int',
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
        indexed: false,
      },
    ],
    name: 'log_named_decimal_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_named_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_named_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_named_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'logs',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TradingTest
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tradingTestAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'IS_TEST',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeArtifacts',
    outputs: [
      {
        name: 'excludedArtifacts_',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeContracts',
    outputs: [
      {
        name: 'excludedContracts_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'excludeSenders',
    outputs: [
      {
        name: 'excludedSenders_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'failed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'setUp',
    outputs: [],
    stateMutability: 'nonpayable',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetArtifacts',
    outputs: [
      {
        name: 'targetedArtifacts_',
        internalType: 'string[]',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetContracts',
    outputs: [
      {
        name: 'targetedContracts_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
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
          { name: 'artifacts', internalType: 'string[]', type: 'string[]' },
        ],
      },
    ],
    stateMutability: 'view',
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
          { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetSenders',
    outputs: [
      {
        name: 'targetedSenders_',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testCollectDust',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testDecreasePosition',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testDustThresholdTooHigh',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testEmptyPuppetList',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testExpiredRule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testMultipleTraders',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testRequestAdjustSuccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testRequestMirrorInsufficientFunds',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testRequestMirrorSuccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testSettleSuccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'testThrottleActivity',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_address',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'int256[]',
        type: 'int256[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'val',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'log_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_bytes32',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'log_named_address',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
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
        indexed: false,
      },
    ],
    name: 'log_named_array',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'log_named_bytes',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'log_named_bytes32',
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
        indexed: false,
      },
    ],
    name: 'log_named_decimal_int',
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
        indexed: false,
      },
    ],
    name: 'log_named_decimal_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'log_named_int',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_named_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'string', type: 'string', indexed: false },
      { name: 'val', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_named_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'log_string',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'log_uint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'logs',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UserRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const userRouterAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_matchingRule',
        internalType: 'contract MatchingRule',
        type: 'address',
      },
      {
        name: '_feeMarketplace',
        internalType: 'contract FeeMarketplace',
        type: 'address',
      },
      { name: '_allocate', internalType: 'contract Allocate', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'feeToken', internalType: 'contract IERC20', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'purchaseAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'acceptOffer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allocate',
    outputs: [{ name: '', internalType: 'contract Allocate', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeMarketplace',
    outputs: [
      { name: '', internalType: 'contract FeeMarketplace', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'matchingRule',
    outputs: [
      { name: '', internalType: 'contract MatchingRule', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'collateralToken',
        internalType: 'contract IERC20',
        type: 'address',
      },
      { name: 'trader', internalType: 'address', type: 'address' },
      {
        name: 'ruleParams',
        internalType: 'struct MatchingRule.Rule',
        type: 'tuple',
        components: [
          { name: 'allowanceRate', internalType: 'uint256', type: 'uint256' },
          {
            name: 'throttleActivity',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'expiry', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'setMatchingRule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Vm
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const vmAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'access',
        internalType: 'struct VmSafe.AccessListItem[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'storageKeys', internalType: 'bytes32[]', type: 'bytes32[]' },
        ],
      },
    ],
    name: 'accessList',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'accesses',
    outputs: [
      { name: 'readSlots', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'writeSlots', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'activeFork',
    outputs: [{ name: 'forkId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    name: 'addr',
    outputs: [{ name: 'keyAddr', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'allowCheatcodes',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'maxDelta', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertApproxEqAbs',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'maxDelta', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertApproxEqAbs',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'maxDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertApproxEqAbs',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'maxDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertApproxEqAbs',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'maxDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertApproxEqAbsDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'maxDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertApproxEqAbsDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'maxDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertApproxEqAbsDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'maxDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertApproxEqAbsDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'maxPercentDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertApproxEqRel',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'maxPercentDelta', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertApproxEqRel',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'maxPercentDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertApproxEqRel',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'maxPercentDelta', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertApproxEqRel',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'maxPercentDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertApproxEqRelDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'maxPercentDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertApproxEqRelDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'maxPercentDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertApproxEqRelDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'maxPercentDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertApproxEqRelDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'right', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256[]', type: 'int256[]' },
      { name: 'right', internalType: 'int256[]', type: 'int256[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'address', type: 'address' },
      { name: 'right', internalType: 'address', type: 'address' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'string', type: 'string' },
      { name: 'right', internalType: 'string', type: 'string' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'address[]', type: 'address[]' },
      { name: 'right', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'address[]', type: 'address[]' },
      { name: 'right', internalType: 'address[]', type: 'address[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bool', type: 'bool' },
      { name: 'right', internalType: 'bool', type: 'bool' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'address', type: 'address' },
      { name: 'right', internalType: 'address', type: 'address' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'right', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bool[]', type: 'bool[]' },
      { name: 'right', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256[]', type: 'int256[]' },
      { name: 'right', internalType: 'int256[]', type: 'int256[]' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes32', type: 'bytes32' },
      { name: 'right', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'right', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes', type: 'bytes' },
      { name: 'right', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes32', type: 'bytes32' },
      { name: 'right', internalType: 'bytes32', type: 'bytes32' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'string[]', type: 'string[]' },
      { name: 'right', internalType: 'string[]', type: 'string[]' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'right', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes', type: 'bytes' },
      { name: 'right', internalType: 'bytes', type: 'bytes' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bool[]', type: 'bool[]' },
      { name: 'right', internalType: 'bool[]', type: 'bool[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'right', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'string[]', type: 'string[]' },
      { name: 'right', internalType: 'string[]', type: 'string[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'string', type: 'string' },
      { name: 'right', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'right', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bool', type: 'bool' },
      { name: 'right', internalType: 'bool', type: 'bool' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertEqDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertEqDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEqDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEqDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'condition', internalType: 'bool', type: 'bool' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertFalse',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'condition', internalType: 'bool', type: 'bool' }],
    name: 'assertFalse',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
    ],
    name: 'assertGe',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertGe',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertGe',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertGe',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertGeDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertGeDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertGeDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertGeDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
    ],
    name: 'assertGt',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertGt',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertGt',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertGt',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertGtDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertGtDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertGtDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertGtDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertLe',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertLe',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
    ],
    name: 'assertLe',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertLe',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertLeDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertLeDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertLeDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertLeDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
    ],
    name: 'assertLt',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertLt',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertLt',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertLt',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertLtDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertLtDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertLtDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertLtDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'right', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256[]', type: 'int256[]' },
      { name: 'right', internalType: 'int256[]', type: 'int256[]' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bool', type: 'bool' },
      { name: 'right', internalType: 'bool', type: 'bool' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'right', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bool', type: 'bool' },
      { name: 'right', internalType: 'bool', type: 'bool' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bool[]', type: 'bool[]' },
      { name: 'right', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes', type: 'bytes' },
      { name: 'right', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'address[]', type: 'address[]' },
      { name: 'right', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'right', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bool[]', type: 'bool[]' },
      { name: 'right', internalType: 'bool[]', type: 'bool[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'string', type: 'string' },
      { name: 'right', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'address[]', type: 'address[]' },
      { name: 'right', internalType: 'address[]', type: 'address[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'string', type: 'string' },
      { name: 'right', internalType: 'string', type: 'string' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'address', type: 'address' },
      { name: 'right', internalType: 'address', type: 'address' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes32', type: 'bytes32' },
      { name: 'right', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes', type: 'bytes' },
      { name: 'right', internalType: 'bytes', type: 'bytes' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'right', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'address', type: 'address' },
      { name: 'right', internalType: 'address', type: 'address' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes32', type: 'bytes32' },
      { name: 'right', internalType: 'bytes32', type: 'bytes32' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'string[]', type: 'string[]' },
      { name: 'right', internalType: 'string[]', type: 'string[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'right', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'string[]', type: 'string[]' },
      { name: 'right', internalType: 'string[]', type: 'string[]' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256[]', type: 'int256[]' },
      { name: 'right', internalType: 'int256[]', type: 'int256[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'right', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertNotEqDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEqDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertNotEqDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEqDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'condition', internalType: 'bool', type: 'bool' }],
    name: 'assertTrue',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'condition', internalType: 'bool', type: 'bool' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertTrue',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'condition', internalType: 'bool', type: 'bool' }],
    name: 'assume',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'assumeNoRevert',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'potentialReverts',
        internalType: 'struct VmSafe.PotentialRevert[]',
        type: 'tuple[]',
        components: [
          { name: 'reverter', internalType: 'address', type: 'address' },
          { name: 'partialMatch', internalType: 'bool', type: 'bool' },
          { name: 'revertData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'assumeNoRevert',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'potentialRevert',
        internalType: 'struct VmSafe.PotentialRevert',
        type: 'tuple',
        components: [
          { name: 'reverter', internalType: 'address', type: 'address' },
          { name: 'partialMatch', internalType: 'bool', type: 'bool' },
          { name: 'revertData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'assumeNoRevert',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'blob', internalType: 'bytes', type: 'bytes' }],
    name: 'attachBlob',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'signedDelegation',
        internalType: 'struct VmSafe.SignedDelegation',
        type: 'tuple',
        components: [
          { name: 'v', internalType: 'uint8', type: 'uint8' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
          { name: 'implementation', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'attachDelegation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newBlobBaseFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'blobBaseFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'hashes', internalType: 'bytes32[]', type: 'bytes32[]' }],
    name: 'blobhashes',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'char', internalType: 'string', type: 'string' }],
    name: 'breakpoint',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'char', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'bool', type: 'bool' },
    ],
    name: 'breakpoint',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'broadcast',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'signer', internalType: 'address', type: 'address' }],
    name: 'broadcast',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    name: 'broadcast',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    name: 'broadcastRawTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newChainId', internalType: 'uint256', type: 'uint256' }],
    name: 'chainId',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clearMockedCalls',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'source', internalType: 'address', type: 'address' },
      { name: 'target', internalType: 'address', type: 'address' },
    ],
    name: 'cloneAccount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'closeFile',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newCoinbase', internalType: 'address', type: 'address' }],
    name: 'coinbase',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'initCodeHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'computeCreate2Address',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'initCodeHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'deployer', internalType: 'address', type: 'address' },
    ],
    name: 'computeCreate2Address',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'deployer', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'computeCreateAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'subject', internalType: 'string', type: 'string' },
      { name: 'search', internalType: 'string', type: 'string' },
    ],
    name: 'contains',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'cool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'slot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'coolSlot',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'string', type: 'string' },
      { name: 'to', internalType: 'string', type: 'string' },
    ],
    name: 'copyFile',
    outputs: [{ name: 'copied', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
    ],
    name: 'copyStorage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'recursive', internalType: 'bool', type: 'bool' },
    ],
    name: 'createDir',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'urlOrAlias', internalType: 'string', type: 'string' }],
    name: 'createFork',
    outputs: [{ name: 'forkId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'urlOrAlias', internalType: 'string', type: 'string' },
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createFork',
    outputs: [{ name: 'forkId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'urlOrAlias', internalType: 'string', type: 'string' },
      { name: 'txHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'createFork',
    outputs: [{ name: 'forkId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'urlOrAlias', internalType: 'string', type: 'string' },
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createSelectFork',
    outputs: [{ name: 'forkId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'urlOrAlias', internalType: 'string', type: 'string' },
      { name: 'txHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'createSelectFork',
    outputs: [{ name: 'forkId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'urlOrAlias', internalType: 'string', type: 'string' }],
    name: 'createSelectFork',
    outputs: [{ name: 'forkId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'walletLabel', internalType: 'string', type: 'string' }],
    name: 'createWallet',
    outputs: [
      {
        name: 'wallet',
        internalType: 'struct VmSafe.Wallet',
        type: 'tuple',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'publicKeyX', internalType: 'uint256', type: 'uint256' },
          { name: 'publicKeyY', internalType: 'uint256', type: 'uint256' },
          { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    name: 'createWallet',
    outputs: [
      {
        name: 'wallet',
        internalType: 'struct VmSafe.Wallet',
        type: 'tuple',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'publicKeyX', internalType: 'uint256', type: 'uint256' },
          { name: 'publicKeyY', internalType: 'uint256', type: 'uint256' },
          { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
      { name: 'walletLabel', internalType: 'string', type: 'string' },
    ],
    name: 'createWallet',
    outputs: [
      {
        name: 'wallet',
        internalType: 'struct VmSafe.Wallet',
        type: 'tuple',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'publicKeyX', internalType: 'uint256', type: 'uint256' },
          { name: 'publicKeyY', internalType: 'uint256', type: 'uint256' },
          { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'newBalance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'deal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'snapshotId', internalType: 'uint256', type: 'uint256' }],
    name: 'deleteSnapshot',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deleteSnapshots',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'snapshotId', internalType: 'uint256', type: 'uint256' }],
    name: 'deleteStateSnapshot',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deleteStateSnapshots',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'artifactPath', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'deployCode',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'artifactPath', internalType: 'string', type: 'string' },
      { name: 'constructorArgs', internalType: 'bytes', type: 'bytes' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'deployCode',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'artifactPath', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'deployCode',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'artifactPath', internalType: 'string', type: 'string' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'deployCode',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'artifactPath', internalType: 'string', type: 'string' },
      { name: 'constructorArgs', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'deployCode',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'artifactPath', internalType: 'string', type: 'string' },
      { name: 'constructorArgs', internalType: 'bytes', type: 'bytes' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'deployCode',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'artifactPath', internalType: 'string', type: 'string' }],
    name: 'deployCode',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'artifactPath', internalType: 'string', type: 'string' },
      { name: 'constructorArgs', internalType: 'bytes', type: 'bytes' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'deployCode',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'mnemonic', internalType: 'string', type: 'string' },
      { name: 'derivationPath', internalType: 'string', type: 'string' },
      { name: 'index', internalType: 'uint32', type: 'uint32' },
      { name: 'language', internalType: 'string', type: 'string' },
    ],
    name: 'deriveKey',
    outputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'mnemonic', internalType: 'string', type: 'string' },
      { name: 'index', internalType: 'uint32', type: 'uint32' },
      { name: 'language', internalType: 'string', type: 'string' },
    ],
    name: 'deriveKey',
    outputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'mnemonic', internalType: 'string', type: 'string' },
      { name: 'index', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'deriveKey',
    outputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'mnemonic', internalType: 'string', type: 'string' },
      { name: 'derivationPath', internalType: 'string', type: 'string' },
      { name: 'index', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'deriveKey',
    outputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newDifficulty', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'difficulty',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pathToStateJson', internalType: 'string', type: 'string' },
    ],
    name: 'dumpState',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'ensNamehash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'envAddress',
    outputs: [{ name: 'value', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
    ],
    name: 'envAddress',
    outputs: [{ name: 'value', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'envBool',
    outputs: [{ name: 'value', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
    ],
    name: 'envBool',
    outputs: [{ name: 'value', internalType: 'bool[]', type: 'bool[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'envBytes',
    outputs: [{ name: 'value', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
    ],
    name: 'envBytes',
    outputs: [{ name: 'value', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
    ],
    name: 'envBytes32',
    outputs: [{ name: 'value', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'envBytes32',
    outputs: [{ name: 'value', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'envExists',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
    ],
    name: 'envInt',
    outputs: [{ name: 'value', internalType: 'int256[]', type: 'int256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'envInt',
    outputs: [{ name: 'value', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'int256[]', type: 'int256[]' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'int256[]', type: 'int256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'bool', type: 'bool' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'address', type: 'address' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'string[]', type: 'string[]' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'int256', type: 'int256' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'string', type: 'string' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'bool[]', type: 'bool[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
    ],
    name: 'envString',
    outputs: [{ name: 'value', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'envString',
    outputs: [{ name: 'value', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'envUint',
    outputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
    ],
    name: 'envUint',
    outputs: [{ name: 'value', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'newRuntimeBytecode', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'etch',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'fromBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'toBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'topics', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'eth_getLogs',
    outputs: [
      {
        name: 'logs',
        internalType: 'struct VmSafe.EthGetLogs[]',
        type: 'tuple[]',
        components: [
          { name: 'emitter', internalType: 'address', type: 'address' },
          { name: 'topics', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
          { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'blockNumber', internalType: 'uint64', type: 'uint64' },
          { name: 'transactionHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'transactionIndex', internalType: 'uint64', type: 'uint64' },
          { name: 'logIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'removed', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'exists',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'msgValue', internalType: 'uint256', type: 'uint256' },
      { name: 'gas', internalType: 'uint64', type: 'uint64' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'expectCall',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'msgValue', internalType: 'uint256', type: 'uint256' },
      { name: 'gas', internalType: 'uint64', type: 'uint64' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'count', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'expectCall',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'msgValue', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'count', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'expectCall',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'expectCall',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'count', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'expectCall',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'msgValue', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'expectCall',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'msgValue', internalType: 'uint256', type: 'uint256' },
      { name: 'minGas', internalType: 'uint64', type: 'uint64' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'expectCallMinGas',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'msgValue', internalType: 'uint256', type: 'uint256' },
      { name: 'minGas', internalType: 'uint64', type: 'uint64' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'count', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'expectCallMinGas',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'bytecode', internalType: 'bytes', type: 'bytes' },
      { name: 'deployer', internalType: 'address', type: 'address' },
    ],
    name: 'expectCreate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'bytecode', internalType: 'bytes', type: 'bytes' },
      { name: 'deployer', internalType: 'address', type: 'address' },
    ],
    name: 'expectCreate2',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'expectEmit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'checkTopic1', internalType: 'bool', type: 'bool' },
      { name: 'checkTopic2', internalType: 'bool', type: 'bool' },
      { name: 'checkTopic3', internalType: 'bool', type: 'bool' },
      { name: 'checkData', internalType: 'bool', type: 'bool' },
    ],
    name: 'expectEmit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'count', internalType: 'uint64', type: 'uint64' }],
    name: 'expectEmit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'checkTopic1', internalType: 'bool', type: 'bool' },
      { name: 'checkTopic2', internalType: 'bool', type: 'bool' },
      { name: 'checkTopic3', internalType: 'bool', type: 'bool' },
      { name: 'checkData', internalType: 'bool', type: 'bool' },
      { name: 'count', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'expectEmit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'checkTopic1', internalType: 'bool', type: 'bool' },
      { name: 'checkTopic2', internalType: 'bool', type: 'bool' },
      { name: 'checkTopic3', internalType: 'bool', type: 'bool' },
      { name: 'checkData', internalType: 'bool', type: 'bool' },
      { name: 'emitter', internalType: 'address', type: 'address' },
    ],
    name: 'expectEmit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'emitter', internalType: 'address', type: 'address' }],
    name: 'expectEmit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'emitter', internalType: 'address', type: 'address' },
      { name: 'count', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'expectEmit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'checkTopic1', internalType: 'bool', type: 'bool' },
      { name: 'checkTopic2', internalType: 'bool', type: 'bool' },
      { name: 'checkTopic3', internalType: 'bool', type: 'bool' },
      { name: 'checkData', internalType: 'bool', type: 'bool' },
      { name: 'emitter', internalType: 'address', type: 'address' },
      { name: 'count', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'expectEmit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'expectEmitAnonymous',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'emitter', internalType: 'address', type: 'address' }],
    name: 'expectEmitAnonymous',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'checkTopic0', internalType: 'bool', type: 'bool' },
      { name: 'checkTopic1', internalType: 'bool', type: 'bool' },
      { name: 'checkTopic2', internalType: 'bool', type: 'bool' },
      { name: 'checkTopic3', internalType: 'bool', type: 'bool' },
      { name: 'checkData', internalType: 'bool', type: 'bool' },
      { name: 'emitter', internalType: 'address', type: 'address' },
    ],
    name: 'expectEmitAnonymous',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'checkTopic0', internalType: 'bool', type: 'bool' },
      { name: 'checkTopic1', internalType: 'bool', type: 'bool' },
      { name: 'checkTopic2', internalType: 'bool', type: 'bool' },
      { name: 'checkTopic3', internalType: 'bool', type: 'bool' },
      { name: 'checkData', internalType: 'bool', type: 'bool' },
    ],
    name: 'expectEmitAnonymous',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'revertData', internalType: 'bytes4', type: 'bytes4' }],
    name: 'expectPartialRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'revertData', internalType: 'bytes4', type: 'bytes4' },
      { name: 'reverter', internalType: 'address', type: 'address' },
    ],
    name: 'expectPartialRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'reverter', internalType: 'address', type: 'address' },
      { name: 'count', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'expectRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'revertData', internalType: 'bytes4', type: 'bytes4' },
      { name: 'reverter', internalType: 'address', type: 'address' },
    ],
    name: 'expectRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'revertData', internalType: 'bytes', type: 'bytes' },
      { name: 'count', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'expectRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'count', internalType: 'uint64', type: 'uint64' }],
    name: 'expectRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'revertData', internalType: 'bytes', type: 'bytes' },
      { name: 'reverter', internalType: 'address', type: 'address' },
    ],
    name: 'expectRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'revertData', internalType: 'bytes4', type: 'bytes4' },
      { name: 'reverter', internalType: 'address', type: 'address' },
      { name: 'count', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'expectRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'revertData', internalType: 'bytes4', type: 'bytes4' }],
    name: 'expectRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'revertData', internalType: 'bytes', type: 'bytes' },
      { name: 'reverter', internalType: 'address', type: 'address' },
      { name: 'count', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'expectRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'reverter', internalType: 'address', type: 'address' }],
    name: 'expectRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'revertData', internalType: 'bytes4', type: 'bytes4' },
      { name: 'count', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'expectRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'revertData', internalType: 'bytes', type: 'bytes' }],
    name: 'expectRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'expectRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'min', internalType: 'uint64', type: 'uint64' },
      { name: 'max', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'expectSafeMemory',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'min', internalType: 'uint64', type: 'uint64' },
      { name: 'max', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'expectSafeMemoryCall',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newBasefee', internalType: 'uint256', type: 'uint256' }],
    name: 'fee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'commandInput', internalType: 'string[]', type: 'string[]' },
    ],
    name: 'ffi',
    outputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'version', internalType: 'string', type: 'string' }],
    name: 'foundryVersionAtLeast',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'version', internalType: 'string', type: 'string' }],
    name: 'foundryVersionCmp',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'fsMetadata',
    outputs: [
      {
        name: 'metadata',
        internalType: 'struct VmSafe.FsMetadata',
        type: 'tuple',
        components: [
          { name: 'isDir', internalType: 'bool', type: 'bool' },
          { name: 'isSymlink', internalType: 'bool', type: 'bool' },
          { name: 'length', internalType: 'uint256', type: 'uint256' },
          { name: 'readOnly', internalType: 'bool', type: 'bool' },
          { name: 'modified', internalType: 'uint256', type: 'uint256' },
          { name: 'accessed', internalType: 'uint256', type: 'uint256' },
          { name: 'created', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'code', internalType: 'bytes', type: 'bytes' }],
    name: 'getArtifactPathByCode',
    outputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'deployedCode', internalType: 'bytes', type: 'bytes' }],
    name: 'getArtifactPathByDeployedCode',
    outputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBlobBaseFee',
    outputs: [
      { name: 'blobBaseFee', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBlobhashes',
    outputs: [{ name: 'hashes', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBlockNumber',
    outputs: [{ name: 'height', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBlockTimestamp',
    outputs: [{ name: 'timestamp', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'contractName', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint64', type: 'uint64' },
      {
        name: 'txType',
        internalType: 'enum VmSafe.BroadcastTxType',
        type: 'uint8',
      },
    ],
    name: 'getBroadcast',
    outputs: [
      {
        name: '',
        internalType: 'struct VmSafe.BroadcastTxSummary',
        type: 'tuple',
        components: [
          { name: 'txHash', internalType: 'bytes32', type: 'bytes32' },
          {
            name: 'txType',
            internalType: 'enum VmSafe.BroadcastTxType',
            type: 'uint8',
          },
          { name: 'contractAddress', internalType: 'address', type: 'address' },
          { name: 'blockNumber', internalType: 'uint64', type: 'uint64' },
          { name: 'success', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'contractName', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'getBroadcasts',
    outputs: [
      {
        name: '',
        internalType: 'struct VmSafe.BroadcastTxSummary[]',
        type: 'tuple[]',
        components: [
          { name: 'txHash', internalType: 'bytes32', type: 'bytes32' },
          {
            name: 'txType',
            internalType: 'enum VmSafe.BroadcastTxType',
            type: 'uint8',
          },
          { name: 'contractAddress', internalType: 'address', type: 'address' },
          { name: 'blockNumber', internalType: 'uint64', type: 'uint64' },
          { name: 'success', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'contractName', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint64', type: 'uint64' },
      {
        name: 'txType',
        internalType: 'enum VmSafe.BroadcastTxType',
        type: 'uint8',
      },
    ],
    name: 'getBroadcasts',
    outputs: [
      {
        name: '',
        internalType: 'struct VmSafe.BroadcastTxSummary[]',
        type: 'tuple[]',
        components: [
          { name: 'txHash', internalType: 'bytes32', type: 'bytes32' },
          {
            name: 'txType',
            internalType: 'enum VmSafe.BroadcastTxType',
            type: 'uint8',
          },
          { name: 'contractAddress', internalType: 'address', type: 'address' },
          { name: 'blockNumber', internalType: 'uint64', type: 'uint64' },
          { name: 'success', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'chainAlias', internalType: 'string', type: 'string' }],
    name: 'getChain',
    outputs: [
      {
        name: 'chain',
        internalType: 'struct VmSafe.Chain',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'chainId', internalType: 'uint256', type: 'uint256' },
          { name: 'chainAlias', internalType: 'string', type: 'string' },
          { name: 'rpcUrl', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'chainId', internalType: 'uint256', type: 'uint256' }],
    name: 'getChain',
    outputs: [
      {
        name: 'chain',
        internalType: 'struct VmSafe.Chain',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'chainId', internalType: 'uint256', type: 'uint256' },
          { name: 'chainAlias', internalType: 'string', type: 'string' },
          { name: 'rpcUrl', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'artifactPath', internalType: 'string', type: 'string' }],
    name: 'getCode',
    outputs: [
      { name: 'creationBytecode', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'artifactPath', internalType: 'string', type: 'string' }],
    name: 'getDeployedCode',
    outputs: [
      { name: 'runtimeBytecode', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'contractName', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'getDeployment',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'contractName', internalType: 'string', type: 'string' }],
    name: 'getDeployment',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'contractName', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'getDeployments',
    outputs: [
      {
        name: 'deployedAddresses',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFoundryVersion',
    outputs: [{ name: 'version', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getLabel',
    outputs: [{ name: 'currentLabel', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'elementSlot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getMappingKeyAndParentOf',
    outputs: [
      { name: 'found', internalType: 'bool', type: 'bool' },
      { name: 'key', internalType: 'bytes32', type: 'bytes32' },
      { name: 'parent', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'mappingSlot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getMappingLength',
    outputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'mappingSlot', internalType: 'bytes32', type: 'bytes32' },
      { name: 'idx', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getMappingSlotAt',
    outputs: [{ name: 'value', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getNonce',
    outputs: [{ name: 'nonce', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'wallet',
        internalType: 'struct VmSafe.Wallet',
        type: 'tuple',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'publicKeyX', internalType: 'uint256', type: 'uint256' },
          { name: 'publicKeyY', internalType: 'uint256', type: 'uint256' },
          { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getNonce',
    outputs: [{ name: 'nonce', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRecordedLogs',
    outputs: [
      {
        name: 'logs',
        internalType: 'struct VmSafe.Log[]',
        type: 'tuple[]',
        components: [
          { name: 'topics', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
          { name: 'emitter', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStateDiff',
    outputs: [{ name: 'diff', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStateDiffJson',
    outputs: [{ name: 'diff', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWallets',
    outputs: [
      { name: 'wallets', internalType: 'address[]', type: 'address[]' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'input', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'indexOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'interceptInitcode',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'context',
        internalType: 'enum VmSafe.ForgeContext',
        type: 'uint8',
      },
    ],
    name: 'isContext',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'isDir',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'isFile',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'isPersistent',
    outputs: [{ name: 'persistent', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'keyExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'keyExistsJson',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'keyExistsToml',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'newLabel', internalType: 'string', type: 'string' },
    ],
    name: 'label',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastCallGas',
    outputs: [
      {
        name: 'gas',
        internalType: 'struct VmSafe.Gas',
        type: 'tuple',
        components: [
          { name: 'gasLimit', internalType: 'uint64', type: 'uint64' },
          { name: 'gasTotalUsed', internalType: 'uint64', type: 'uint64' },
          { name: 'gasMemoryUsed', internalType: 'uint64', type: 'uint64' },
          { name: 'gasRefunded', internalType: 'int64', type: 'int64' },
          { name: 'gasRemaining', internalType: 'uint64', type: 'uint64' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'slot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'load',
    outputs: [{ name: 'data', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pathToAllocsJson', internalType: 'string', type: 'string' },
    ],
    name: 'loadAllocs',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'makePersistent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account0', internalType: 'address', type: 'address' },
      { name: 'account1', internalType: 'address', type: 'address' },
    ],
    name: 'makePersistent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'makePersistent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account0', internalType: 'address', type: 'address' },
      { name: 'account1', internalType: 'address', type: 'address' },
      { name: 'account2', internalType: 'address', type: 'address' },
    ],
    name: 'makePersistent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes4', type: 'bytes4' },
      { name: 'returnData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mockCall',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'msgValue', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'returnData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mockCall',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'returnData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mockCall',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'msgValue', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes4', type: 'bytes4' },
      { name: 'returnData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mockCall',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes4', type: 'bytes4' },
      { name: 'revertData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mockCallRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'msgValue', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes4', type: 'bytes4' },
      { name: 'revertData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mockCallRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'msgValue', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'revertData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mockCallRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'revertData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mockCallRevert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'msgValue', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'returnData', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'mockCalls',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'returnData', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'mockCalls',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callee', internalType: 'address', type: 'address' },
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mockFunction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'noAccessList',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    name: 'parseAddress',
    outputs: [
      { name: 'parsedValue', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    name: 'parseBool',
    outputs: [{ name: 'parsedValue', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    name: 'parseBytes',
    outputs: [{ name: 'parsedValue', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    name: 'parseBytes32',
    outputs: [
      { name: 'parsedValue', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    name: 'parseInt',
    outputs: [{ name: 'parsedValue', internalType: 'int256', type: 'int256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    name: 'parseJson',
    outputs: [{ name: 'abiEncodedData', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJson',
    outputs: [{ name: 'abiEncodedData', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonAddressArray',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonBoolArray',
    outputs: [{ name: '', internalType: 'bool[]', type: 'bool[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonBytes',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonBytes32',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonBytes32Array',
    outputs: [{ name: '', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonBytesArray',
    outputs: [{ name: '', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonInt',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonIntArray',
    outputs: [{ name: '', internalType: 'int256[]', type: 'int256[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonKeys',
    outputs: [{ name: 'keys', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonString',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonStringArray',
    outputs: [{ name: '', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'typeDescription', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonType',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
      { name: 'typeDescription', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonType',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
      { name: 'typeDescription', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonTypeArray',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonUintArray',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseToml',
    outputs: [{ name: 'abiEncodedData', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'toml', internalType: 'string', type: 'string' }],
    name: 'parseToml',
    outputs: [{ name: 'abiEncodedData', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlAddressArray',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlBoolArray',
    outputs: [{ name: '', internalType: 'bool[]', type: 'bool[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlBytes',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlBytes32',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlBytes32Array',
    outputs: [{ name: '', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlBytesArray',
    outputs: [{ name: '', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlInt',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlIntArray',
    outputs: [{ name: '', internalType: 'int256[]', type: 'int256[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlKeys',
    outputs: [{ name: 'keys', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlString',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlStringArray',
    outputs: [{ name: '', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'typeDescription', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlType',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
      { name: 'typeDescription', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlType',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
      { name: 'typeDescription', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlTypeArray',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlUintArray',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    name: 'parseUint',
    outputs: [
      { name: 'parsedValue', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pauseGasMetering',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pauseTracing',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address' },
      { name: 'txOrigin', internalType: 'address', type: 'address' },
    ],
    name: 'prank',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address' },
      { name: 'txOrigin', internalType: 'address', type: 'address' },
      { name: 'delegateCall', internalType: 'bool', type: 'bool' },
    ],
    name: 'prank',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address' },
      { name: 'delegateCall', internalType: 'bool', type: 'bool' },
    ],
    name: 'prank',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'msgSender', internalType: 'address', type: 'address' }],
    name: 'prank',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newPrevrandao', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'prevrandao',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newPrevrandao', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'prevrandao',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'projectRoot',
    outputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'promptText', internalType: 'string', type: 'string' }],
    name: 'prompt',
    outputs: [{ name: 'input', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'promptText', internalType: 'string', type: 'string' }],
    name: 'promptAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'promptText', internalType: 'string', type: 'string' }],
    name: 'promptSecret',
    outputs: [{ name: 'input', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'promptText', internalType: 'string', type: 'string' }],
    name: 'promptSecretUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'promptText', internalType: 'string', type: 'string' }],
    name: 'promptUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    name: 'publicKeyP256',
    outputs: [
      { name: 'publicKeyX', internalType: 'uint256', type: 'uint256' },
      { name: 'publicKeyY', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'randomAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'randomBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'len', internalType: 'uint256', type: 'uint256' }],
    name: 'randomBytes',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'randomBytes4',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'randomBytes8',
    outputs: [{ name: '', internalType: 'bytes8', type: 'bytes8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'randomInt',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'bits', internalType: 'uint256', type: 'uint256' }],
    name: 'randomInt',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'randomUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'bits', internalType: 'uint256', type: 'uint256' }],
    name: 'randomUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'min', internalType: 'uint256', type: 'uint256' },
      { name: 'max', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'randomUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'readCallers',
    outputs: [
      {
        name: 'callerMode',
        internalType: 'enum VmSafe.CallerMode',
        type: 'uint8',
      },
      { name: 'msgSender', internalType: 'address', type: 'address' },
      { name: 'txOrigin', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'maxDepth', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'readDir',
    outputs: [
      {
        name: 'entries',
        internalType: 'struct VmSafe.DirEntry[]',
        type: 'tuple[]',
        components: [
          { name: 'errorMessage', internalType: 'string', type: 'string' },
          { name: 'path', internalType: 'string', type: 'string' },
          { name: 'depth', internalType: 'uint64', type: 'uint64' },
          { name: 'isDir', internalType: 'bool', type: 'bool' },
          { name: 'isSymlink', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'maxDepth', internalType: 'uint64', type: 'uint64' },
      { name: 'followLinks', internalType: 'bool', type: 'bool' },
    ],
    name: 'readDir',
    outputs: [
      {
        name: 'entries',
        internalType: 'struct VmSafe.DirEntry[]',
        type: 'tuple[]',
        components: [
          { name: 'errorMessage', internalType: 'string', type: 'string' },
          { name: 'path', internalType: 'string', type: 'string' },
          { name: 'depth', internalType: 'uint64', type: 'uint64' },
          { name: 'isDir', internalType: 'bool', type: 'bool' },
          { name: 'isSymlink', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'readDir',
    outputs: [
      {
        name: 'entries',
        internalType: 'struct VmSafe.DirEntry[]',
        type: 'tuple[]',
        components: [
          { name: 'errorMessage', internalType: 'string', type: 'string' },
          { name: 'path', internalType: 'string', type: 'string' },
          { name: 'depth', internalType: 'uint64', type: 'uint64' },
          { name: 'isDir', internalType: 'bool', type: 'bool' },
          { name: 'isSymlink', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'readFile',
    outputs: [{ name: 'data', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'readFileBinary',
    outputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'readLine',
    outputs: [{ name: 'line', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'linkPath', internalType: 'string', type: 'string' }],
    name: 'readLink',
    outputs: [{ name: 'targetPath', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'record',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recordLogs',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    name: 'rememberKey',
    outputs: [{ name: 'keyAddr', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'mnemonic', internalType: 'string', type: 'string' },
      { name: 'derivationPath', internalType: 'string', type: 'string' },
      { name: 'count', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'rememberKeys',
    outputs: [
      { name: 'keyAddrs', internalType: 'address[]', type: 'address[]' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'mnemonic', internalType: 'string', type: 'string' },
      { name: 'derivationPath', internalType: 'string', type: 'string' },
      { name: 'language', internalType: 'string', type: 'string' },
      { name: 'count', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'rememberKeys',
    outputs: [
      { name: 'keyAddrs', internalType: 'address[]', type: 'address[]' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'recursive', internalType: 'bool', type: 'bool' },
    ],
    name: 'removeDir',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'removeFile',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'input', internalType: 'string', type: 'string' },
      { name: 'from', internalType: 'string', type: 'string' },
      { name: 'to', internalType: 'string', type: 'string' },
    ],
    name: 'replace',
    outputs: [{ name: 'output', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resetGasMetering',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'resetNonce',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resumeGasMetering',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resumeTracing',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'snapshotId', internalType: 'uint256', type: 'uint256' }],
    name: 'revertTo',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'snapshotId', internalType: 'uint256', type: 'uint256' }],
    name: 'revertToAndDelete',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'snapshotId', internalType: 'uint256', type: 'uint256' }],
    name: 'revertToState',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'snapshotId', internalType: 'uint256', type: 'uint256' }],
    name: 'revertToStateAndDelete',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'revokePersistent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'revokePersistent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newHeight', internalType: 'uint256', type: 'uint256' }],
    name: 'roll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'txHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'rollFork',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'forkId', internalType: 'uint256', type: 'uint256' },
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'rollFork',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'blockNumber', internalType: 'uint256', type: 'uint256' }],
    name: 'rollFork',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'forkId', internalType: 'uint256', type: 'uint256' },
      { name: 'txHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'rollFork',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'urlOrAlias', internalType: 'string', type: 'string' },
      { name: 'method', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'string', type: 'string' },
    ],
    name: 'rpc',
    outputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'method', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'string', type: 'string' },
    ],
    name: 'rpc',
    outputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'rpcAlias', internalType: 'string', type: 'string' }],
    name: 'rpcUrl',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rpcUrlStructs',
    outputs: [
      {
        name: 'urls',
        internalType: 'struct VmSafe.Rpc[]',
        type: 'tuple[]',
        components: [
          { name: 'key', internalType: 'string', type: 'string' },
          { name: 'url', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rpcUrls',
    outputs: [
      { name: 'urls', internalType: 'string[2][]', type: 'string[2][]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'forkId', internalType: 'uint256', type: 'uint256' }],
    name: 'selectFork',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'values', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'serializeAddress',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'address', type: 'address' },
    ],
    name: 'serializeAddress',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'values', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'serializeBool',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'bool', type: 'bool' },
    ],
    name: 'serializeBool',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'values', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'serializeBytes',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'serializeBytes',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'values', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'serializeBytes32',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'serializeBytes32',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'int256', type: 'int256' },
    ],
    name: 'serializeInt',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'values', internalType: 'int256[]', type: 'int256[]' },
    ],
    name: 'serializeInt',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'string', type: 'string' },
    ],
    name: 'serializeJson',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'typeDescription', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'serializeJsonType',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'typeDescription', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'serializeJsonType',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'values', internalType: 'string[]', type: 'string[]' },
    ],
    name: 'serializeString',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'string', type: 'string' },
    ],
    name: 'serializeString',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'serializeUint',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'serializeUint',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'serializeUintToHex',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'overwrite', internalType: 'bool', type: 'bool' },
    ],
    name: 'setArbitraryStorage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'setArbitraryStorage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'setBlockhash',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'string', type: 'string' },
    ],
    name: 'setEnv',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'newNonce', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'setNonce',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'newNonce', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'setNonceUnsafe',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'array', internalType: 'uint256[]', type: 'uint256[]' }],
    name: 'shuffle',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'digest', internalType: 'bytes32', type: 'bytes32' }],
    name: 'sign',
    outputs: [
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address' },
      { name: 'digest', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'sign',
    outputs: [
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'wallet',
        internalType: 'struct VmSafe.Wallet',
        type: 'tuple',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'publicKeyX', internalType: 'uint256', type: 'uint256' },
          { name: 'publicKeyY', internalType: 'uint256', type: 'uint256' },
          { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'digest', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'sign',
    outputs: [
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
      { name: 'digest', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'sign',
    outputs: [
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
      { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'signAndAttachDelegation',
    outputs: [
      {
        name: 'signedDelegation',
        internalType: 'struct VmSafe.SignedDelegation',
        type: 'tuple',
        components: [
          { name: 'v', internalType: 'uint8', type: 'uint8' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
          { name: 'implementation', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
      { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
      { name: 'nonce', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'signAndAttachDelegation',
    outputs: [
      {
        name: 'signedDelegation',
        internalType: 'struct VmSafe.SignedDelegation',
        type: 'tuple',
        components: [
          { name: 'v', internalType: 'uint8', type: 'uint8' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
          { name: 'implementation', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'wallet',
        internalType: 'struct VmSafe.Wallet',
        type: 'tuple',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'publicKeyX', internalType: 'uint256', type: 'uint256' },
          { name: 'publicKeyY', internalType: 'uint256', type: 'uint256' },
          { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'digest', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'signCompact',
    outputs: [
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 'vs', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address' },
      { name: 'digest', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'signCompact',
    outputs: [
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 'vs', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'digest', internalType: 'bytes32', type: 'bytes32' }],
    name: 'signCompact',
    outputs: [
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 'vs', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
      { name: 'digest', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'signCompact',
    outputs: [
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 'vs', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
      { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'signDelegation',
    outputs: [
      {
        name: 'signedDelegation',
        internalType: 'struct VmSafe.SignedDelegation',
        type: 'tuple',
        components: [
          { name: 'v', internalType: 'uint8', type: 'uint8' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
          { name: 'implementation', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
      { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
      { name: 'nonce', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'signDelegation',
    outputs: [
      {
        name: 'signedDelegation',
        internalType: 'struct VmSafe.SignedDelegation',
        type: 'tuple',
        components: [
          { name: 'v', internalType: 'uint8', type: 'uint8' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
          { name: 'implementation', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
      { name: 'digest', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'signP256',
    outputs: [
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'skipTest', internalType: 'bool', type: 'bool' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'skip',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'skipTest', internalType: 'bool', type: 'bool' }],
    name: 'skip',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'duration', internalType: 'uint256', type: 'uint256' }],
    name: 'sleep',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'snapshot',
    outputs: [{ name: 'snapshotId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'group', internalType: 'string', type: 'string' },
      { name: 'name', internalType: 'string', type: 'string' },
    ],
    name: 'snapshotGasLastCall',
    outputs: [{ name: 'gasUsed', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'snapshotGasLastCall',
    outputs: [{ name: 'gasUsed', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'snapshotState',
    outputs: [{ name: 'snapshotId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'snapshotValue',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'group', internalType: 'string', type: 'string' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'snapshotValue',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'array', internalType: 'uint256[]', type: 'uint256[]' }],
    name: 'sort',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'input', internalType: 'string', type: 'string' },
      { name: 'delimiter', internalType: 'string', type: 'string' },
    ],
    name: 'split',
    outputs: [{ name: 'outputs', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'startBroadcast',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'signer', internalType: 'address', type: 'address' }],
    name: 'startBroadcast',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    name: 'startBroadcast',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'startDebugTraceRecording',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'startMappingRecording',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'msgSender', internalType: 'address', type: 'address' }],
    name: 'startPrank',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address' },
      { name: 'delegateCall', internalType: 'bool', type: 'bool' },
    ],
    name: 'startPrank',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address' },
      { name: 'txOrigin', internalType: 'address', type: 'address' },
    ],
    name: 'startPrank',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address' },
      { name: 'txOrigin', internalType: 'address', type: 'address' },
      { name: 'delegateCall', internalType: 'bool', type: 'bool' },
    ],
    name: 'startPrank',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'startSnapshotGas',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'group', internalType: 'string', type: 'string' },
      { name: 'name', internalType: 'string', type: 'string' },
    ],
    name: 'startSnapshotGas',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'startStateDiffRecording',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stopAndReturnDebugTraceRecording',
    outputs: [
      {
        name: 'step',
        internalType: 'struct VmSafe.DebugStep[]',
        type: 'tuple[]',
        components: [
          { name: 'stack', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'memoryInput', internalType: 'bytes', type: 'bytes' },
          { name: 'opcode', internalType: 'uint8', type: 'uint8' },
          { name: 'depth', internalType: 'uint64', type: 'uint64' },
          { name: 'isOutOfGas', internalType: 'bool', type: 'bool' },
          { name: 'contractAddr', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stopAndReturnStateDiff',
    outputs: [
      {
        name: 'accountAccesses',
        internalType: 'struct VmSafe.AccountAccess[]',
        type: 'tuple[]',
        components: [
          {
            name: 'chainInfo',
            internalType: 'struct VmSafe.ChainInfo',
            type: 'tuple',
            components: [
              { name: 'forkId', internalType: 'uint256', type: 'uint256' },
              { name: 'chainId', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'kind',
            internalType: 'enum VmSafe.AccountAccessKind',
            type: 'uint8',
          },
          { name: 'account', internalType: 'address', type: 'address' },
          { name: 'accessor', internalType: 'address', type: 'address' },
          { name: 'initialized', internalType: 'bool', type: 'bool' },
          { name: 'oldBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'newBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'deployedCode', internalType: 'bytes', type: 'bytes' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
          { name: 'reverted', internalType: 'bool', type: 'bool' },
          {
            name: 'storageAccesses',
            internalType: 'struct VmSafe.StorageAccess[]',
            type: 'tuple[]',
            components: [
              { name: 'account', internalType: 'address', type: 'address' },
              { name: 'slot', internalType: 'bytes32', type: 'bytes32' },
              { name: 'isWrite', internalType: 'bool', type: 'bool' },
              {
                name: 'previousValue',
                internalType: 'bytes32',
                type: 'bytes32',
              },
              { name: 'newValue', internalType: 'bytes32', type: 'bytes32' },
              { name: 'reverted', internalType: 'bool', type: 'bool' },
            ],
          },
          { name: 'depth', internalType: 'uint64', type: 'uint64' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stopBroadcast',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stopExpectSafeMemory',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stopMappingRecording',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stopPrank',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'group', internalType: 'string', type: 'string' },
      { name: 'name', internalType: 'string', type: 'string' },
    ],
    name: 'stopSnapshotGas',
    outputs: [{ name: 'gasUsed', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'stopSnapshotGas',
    outputs: [{ name: 'gasUsed', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stopSnapshotGas',
    outputs: [{ name: 'gasUsed', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'slot', internalType: 'bytes32', type: 'bytes32' },
      { name: 'value', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'store',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'string', type: 'string' }],
    name: 'toBase64',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    name: 'toBase64',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'string', type: 'string' }],
    name: 'toBase64URL',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    name: 'toBase64URL',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'input', internalType: 'string', type: 'string' }],
    name: 'toLowercase',
    outputs: [{ name: 'output', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'address', type: 'address' }],
    name: 'toString',
    outputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'toString',
    outputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'bytes', type: 'bytes' }],
    name: 'toString',
    outputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'bool', type: 'bool' }],
    name: 'toString',
    outputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'int256', type: 'int256' }],
    name: 'toString',
    outputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'bytes32', type: 'bytes32' }],
    name: 'toString',
    outputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'input', internalType: 'string', type: 'string' }],
    name: 'toUppercase',
    outputs: [{ name: 'output', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'forkId', internalType: 'uint256', type: 'uint256' },
      { name: 'txHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'transact',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'txHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'transact',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'input', internalType: 'string', type: 'string' }],
    name: 'trim',
    outputs: [{ name: 'output', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'commandInput', internalType: 'string[]', type: 'string[]' },
    ],
    name: 'tryFfi',
    outputs: [
      {
        name: 'result',
        internalType: 'struct VmSafe.FfiResult',
        type: 'tuple',
        components: [
          { name: 'exitCode', internalType: 'int32', type: 'int32' },
          { name: 'stdout', internalType: 'bytes', type: 'bytes' },
          { name: 'stderr', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newGasPrice', internalType: 'uint256', type: 'uint256' }],
    name: 'txGasPrice',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unixTime',
    outputs: [
      { name: 'milliseconds', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'slot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'warmSlot',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newTimestamp', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'warp',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'string', type: 'string' },
    ],
    name: 'writeFile',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'writeFileBinary',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
    ],
    name: 'writeJson',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'path', internalType: 'string', type: 'string' },
    ],
    name: 'writeJson',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'string', type: 'string' },
    ],
    name: 'writeLine',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
    ],
    name: 'writeToml',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'path', internalType: 'string', type: 'string' },
    ],
    name: 'writeToml',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VmSafe
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const vmSafeAbi = [
  {
    type: 'function',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'accesses',
    outputs: [
      { name: 'readSlots', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'writeSlots', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    name: 'addr',
    outputs: [{ name: 'keyAddr', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'maxDelta', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertApproxEqAbs',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'maxDelta', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertApproxEqAbs',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'maxDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertApproxEqAbs',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'maxDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertApproxEqAbs',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'maxDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertApproxEqAbsDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'maxDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertApproxEqAbsDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'maxDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertApproxEqAbsDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'maxDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertApproxEqAbsDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'maxPercentDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertApproxEqRel',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'maxPercentDelta', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertApproxEqRel',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'maxPercentDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertApproxEqRel',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'maxPercentDelta', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertApproxEqRel',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'maxPercentDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertApproxEqRelDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'maxPercentDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertApproxEqRelDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'maxPercentDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertApproxEqRelDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'maxPercentDelta', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertApproxEqRelDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'right', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256[]', type: 'int256[]' },
      { name: 'right', internalType: 'int256[]', type: 'int256[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'address', type: 'address' },
      { name: 'right', internalType: 'address', type: 'address' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'string', type: 'string' },
      { name: 'right', internalType: 'string', type: 'string' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'address[]', type: 'address[]' },
      { name: 'right', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'address[]', type: 'address[]' },
      { name: 'right', internalType: 'address[]', type: 'address[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bool', type: 'bool' },
      { name: 'right', internalType: 'bool', type: 'bool' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'address', type: 'address' },
      { name: 'right', internalType: 'address', type: 'address' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'right', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bool[]', type: 'bool[]' },
      { name: 'right', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256[]', type: 'int256[]' },
      { name: 'right', internalType: 'int256[]', type: 'int256[]' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes32', type: 'bytes32' },
      { name: 'right', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'right', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes', type: 'bytes' },
      { name: 'right', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes32', type: 'bytes32' },
      { name: 'right', internalType: 'bytes32', type: 'bytes32' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'string[]', type: 'string[]' },
      { name: 'right', internalType: 'string[]', type: 'string[]' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'right', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes', type: 'bytes' },
      { name: 'right', internalType: 'bytes', type: 'bytes' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bool[]', type: 'bool[]' },
      { name: 'right', internalType: 'bool[]', type: 'bool[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'right', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'string[]', type: 'string[]' },
      { name: 'right', internalType: 'string[]', type: 'string[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'string', type: 'string' },
      { name: 'right', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'right', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bool', type: 'bool' },
      { name: 'right', internalType: 'bool', type: 'bool' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
    ],
    name: 'assertEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertEqDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertEqDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEqDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertEqDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'condition', internalType: 'bool', type: 'bool' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertFalse',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'condition', internalType: 'bool', type: 'bool' }],
    name: 'assertFalse',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
    ],
    name: 'assertGe',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertGe',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertGe',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertGe',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertGeDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertGeDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertGeDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertGeDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
    ],
    name: 'assertGt',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertGt',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertGt',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertGt',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertGtDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertGtDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertGtDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertGtDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertLe',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertLe',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
    ],
    name: 'assertLe',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertLe',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertLeDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertLeDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertLeDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertLeDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
    ],
    name: 'assertLt',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertLt',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertLt',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertLt',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertLtDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertLtDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertLtDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertLtDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'right', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256[]', type: 'int256[]' },
      { name: 'right', internalType: 'int256[]', type: 'int256[]' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bool', type: 'bool' },
      { name: 'right', internalType: 'bool', type: 'bool' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'right', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bool', type: 'bool' },
      { name: 'right', internalType: 'bool', type: 'bool' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bool[]', type: 'bool[]' },
      { name: 'right', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes', type: 'bytes' },
      { name: 'right', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'address[]', type: 'address[]' },
      { name: 'right', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'right', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bool[]', type: 'bool[]' },
      { name: 'right', internalType: 'bool[]', type: 'bool[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'string', type: 'string' },
      { name: 'right', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'address[]', type: 'address[]' },
      { name: 'right', internalType: 'address[]', type: 'address[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'string', type: 'string' },
      { name: 'right', internalType: 'string', type: 'string' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'address', type: 'address' },
      { name: 'right', internalType: 'address', type: 'address' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes32', type: 'bytes32' },
      { name: 'right', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes', type: 'bytes' },
      { name: 'right', internalType: 'bytes', type: 'bytes' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'right', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'address', type: 'address' },
      { name: 'right', internalType: 'address', type: 'address' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes32', type: 'bytes32' },
      { name: 'right', internalType: 'bytes32', type: 'bytes32' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'string[]', type: 'string[]' },
      { name: 'right', internalType: 'string[]', type: 'string[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'right', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'string[]', type: 'string[]' },
      { name: 'right', internalType: 'string[]', type: 'string[]' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256[]', type: 'int256[]' },
      { name: 'right', internalType: 'int256[]', type: 'int256[]' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'right', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
    ],
    name: 'assertNotEq',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertNotEqDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'int256', type: 'int256' },
      { name: 'right', internalType: 'int256', type: 'int256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEqDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assertNotEqDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'left', internalType: 'uint256', type: 'uint256' },
      { name: 'right', internalType: 'uint256', type: 'uint256' },
      { name: 'decimals', internalType: 'uint256', type: 'uint256' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertNotEqDecimal',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'condition', internalType: 'bool', type: 'bool' }],
    name: 'assertTrue',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'condition', internalType: 'bool', type: 'bool' },
      { name: 'error', internalType: 'string', type: 'string' },
    ],
    name: 'assertTrue',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'condition', internalType: 'bool', type: 'bool' }],
    name: 'assume',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'assumeNoRevert',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'potentialReverts',
        internalType: 'struct VmSafe.PotentialRevert[]',
        type: 'tuple[]',
        components: [
          { name: 'reverter', internalType: 'address', type: 'address' },
          { name: 'partialMatch', internalType: 'bool', type: 'bool' },
          { name: 'revertData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'assumeNoRevert',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'potentialRevert',
        internalType: 'struct VmSafe.PotentialRevert',
        type: 'tuple',
        components: [
          { name: 'reverter', internalType: 'address', type: 'address' },
          { name: 'partialMatch', internalType: 'bool', type: 'bool' },
          { name: 'revertData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'assumeNoRevert',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'blob', internalType: 'bytes', type: 'bytes' }],
    name: 'attachBlob',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'signedDelegation',
        internalType: 'struct VmSafe.SignedDelegation',
        type: 'tuple',
        components: [
          { name: 'v', internalType: 'uint8', type: 'uint8' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
          { name: 'implementation', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'attachDelegation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'char', internalType: 'string', type: 'string' }],
    name: 'breakpoint',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'char', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'bool', type: 'bool' },
    ],
    name: 'breakpoint',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'broadcast',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'signer', internalType: 'address', type: 'address' }],
    name: 'broadcast',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    name: 'broadcast',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    name: 'broadcastRawTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'closeFile',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'initCodeHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'computeCreate2Address',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'initCodeHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'deployer', internalType: 'address', type: 'address' },
    ],
    name: 'computeCreate2Address',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'deployer', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'computeCreateAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'subject', internalType: 'string', type: 'string' },
      { name: 'search', internalType: 'string', type: 'string' },
    ],
    name: 'contains',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'string', type: 'string' },
      { name: 'to', internalType: 'string', type: 'string' },
    ],
    name: 'copyFile',
    outputs: [{ name: 'copied', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
    ],
    name: 'copyStorage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'recursive', internalType: 'bool', type: 'bool' },
    ],
    name: 'createDir',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'walletLabel', internalType: 'string', type: 'string' }],
    name: 'createWallet',
    outputs: [
      {
        name: 'wallet',
        internalType: 'struct VmSafe.Wallet',
        type: 'tuple',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'publicKeyX', internalType: 'uint256', type: 'uint256' },
          { name: 'publicKeyY', internalType: 'uint256', type: 'uint256' },
          { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    name: 'createWallet',
    outputs: [
      {
        name: 'wallet',
        internalType: 'struct VmSafe.Wallet',
        type: 'tuple',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'publicKeyX', internalType: 'uint256', type: 'uint256' },
          { name: 'publicKeyY', internalType: 'uint256', type: 'uint256' },
          { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
      { name: 'walletLabel', internalType: 'string', type: 'string' },
    ],
    name: 'createWallet',
    outputs: [
      {
        name: 'wallet',
        internalType: 'struct VmSafe.Wallet',
        type: 'tuple',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'publicKeyX', internalType: 'uint256', type: 'uint256' },
          { name: 'publicKeyY', internalType: 'uint256', type: 'uint256' },
          { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'artifactPath', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'deployCode',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'artifactPath', internalType: 'string', type: 'string' },
      { name: 'constructorArgs', internalType: 'bytes', type: 'bytes' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'deployCode',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'artifactPath', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'deployCode',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'artifactPath', internalType: 'string', type: 'string' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'deployCode',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'artifactPath', internalType: 'string', type: 'string' },
      { name: 'constructorArgs', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'deployCode',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'artifactPath', internalType: 'string', type: 'string' },
      { name: 'constructorArgs', internalType: 'bytes', type: 'bytes' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'deployCode',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'artifactPath', internalType: 'string', type: 'string' }],
    name: 'deployCode',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'artifactPath', internalType: 'string', type: 'string' },
      { name: 'constructorArgs', internalType: 'bytes', type: 'bytes' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'deployCode',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'mnemonic', internalType: 'string', type: 'string' },
      { name: 'derivationPath', internalType: 'string', type: 'string' },
      { name: 'index', internalType: 'uint32', type: 'uint32' },
      { name: 'language', internalType: 'string', type: 'string' },
    ],
    name: 'deriveKey',
    outputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'mnemonic', internalType: 'string', type: 'string' },
      { name: 'index', internalType: 'uint32', type: 'uint32' },
      { name: 'language', internalType: 'string', type: 'string' },
    ],
    name: 'deriveKey',
    outputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'mnemonic', internalType: 'string', type: 'string' },
      { name: 'index', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'deriveKey',
    outputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'mnemonic', internalType: 'string', type: 'string' },
      { name: 'derivationPath', internalType: 'string', type: 'string' },
      { name: 'index', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'deriveKey',
    outputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'ensNamehash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'envAddress',
    outputs: [{ name: 'value', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
    ],
    name: 'envAddress',
    outputs: [{ name: 'value', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'envBool',
    outputs: [{ name: 'value', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
    ],
    name: 'envBool',
    outputs: [{ name: 'value', internalType: 'bool[]', type: 'bool[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'envBytes',
    outputs: [{ name: 'value', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
    ],
    name: 'envBytes',
    outputs: [{ name: 'value', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
    ],
    name: 'envBytes32',
    outputs: [{ name: 'value', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'envBytes32',
    outputs: [{ name: 'value', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'envExists',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
    ],
    name: 'envInt',
    outputs: [{ name: 'value', internalType: 'int256[]', type: 'int256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'envInt',
    outputs: [{ name: 'value', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'int256[]', type: 'int256[]' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'int256[]', type: 'int256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'bool', type: 'bool' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'address', type: 'address' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'string[]', type: 'string[]' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'int256', type: 'int256' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'string', type: 'string' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
      { name: 'defaultValue', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'envOr',
    outputs: [{ name: 'value', internalType: 'bool[]', type: 'bool[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
    ],
    name: 'envString',
    outputs: [{ name: 'value', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'envString',
    outputs: [{ name: 'value', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'envUint',
    outputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'delim', internalType: 'string', type: 'string' },
    ],
    name: 'envUint',
    outputs: [{ name: 'value', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'fromBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'toBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'topics', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'eth_getLogs',
    outputs: [
      {
        name: 'logs',
        internalType: 'struct VmSafe.EthGetLogs[]',
        type: 'tuple[]',
        components: [
          { name: 'emitter', internalType: 'address', type: 'address' },
          { name: 'topics', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
          { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'blockNumber', internalType: 'uint64', type: 'uint64' },
          { name: 'transactionHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'transactionIndex', internalType: 'uint64', type: 'uint64' },
          { name: 'logIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'removed', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'exists',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'commandInput', internalType: 'string[]', type: 'string[]' },
    ],
    name: 'ffi',
    outputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'version', internalType: 'string', type: 'string' }],
    name: 'foundryVersionAtLeast',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'version', internalType: 'string', type: 'string' }],
    name: 'foundryVersionCmp',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'fsMetadata',
    outputs: [
      {
        name: 'metadata',
        internalType: 'struct VmSafe.FsMetadata',
        type: 'tuple',
        components: [
          { name: 'isDir', internalType: 'bool', type: 'bool' },
          { name: 'isSymlink', internalType: 'bool', type: 'bool' },
          { name: 'length', internalType: 'uint256', type: 'uint256' },
          { name: 'readOnly', internalType: 'bool', type: 'bool' },
          { name: 'modified', internalType: 'uint256', type: 'uint256' },
          { name: 'accessed', internalType: 'uint256', type: 'uint256' },
          { name: 'created', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'code', internalType: 'bytes', type: 'bytes' }],
    name: 'getArtifactPathByCode',
    outputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'deployedCode', internalType: 'bytes', type: 'bytes' }],
    name: 'getArtifactPathByDeployedCode',
    outputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBlobBaseFee',
    outputs: [
      { name: 'blobBaseFee', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBlockNumber',
    outputs: [{ name: 'height', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBlockTimestamp',
    outputs: [{ name: 'timestamp', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'contractName', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint64', type: 'uint64' },
      {
        name: 'txType',
        internalType: 'enum VmSafe.BroadcastTxType',
        type: 'uint8',
      },
    ],
    name: 'getBroadcast',
    outputs: [
      {
        name: '',
        internalType: 'struct VmSafe.BroadcastTxSummary',
        type: 'tuple',
        components: [
          { name: 'txHash', internalType: 'bytes32', type: 'bytes32' },
          {
            name: 'txType',
            internalType: 'enum VmSafe.BroadcastTxType',
            type: 'uint8',
          },
          { name: 'contractAddress', internalType: 'address', type: 'address' },
          { name: 'blockNumber', internalType: 'uint64', type: 'uint64' },
          { name: 'success', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'contractName', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'getBroadcasts',
    outputs: [
      {
        name: '',
        internalType: 'struct VmSafe.BroadcastTxSummary[]',
        type: 'tuple[]',
        components: [
          { name: 'txHash', internalType: 'bytes32', type: 'bytes32' },
          {
            name: 'txType',
            internalType: 'enum VmSafe.BroadcastTxType',
            type: 'uint8',
          },
          { name: 'contractAddress', internalType: 'address', type: 'address' },
          { name: 'blockNumber', internalType: 'uint64', type: 'uint64' },
          { name: 'success', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'contractName', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint64', type: 'uint64' },
      {
        name: 'txType',
        internalType: 'enum VmSafe.BroadcastTxType',
        type: 'uint8',
      },
    ],
    name: 'getBroadcasts',
    outputs: [
      {
        name: '',
        internalType: 'struct VmSafe.BroadcastTxSummary[]',
        type: 'tuple[]',
        components: [
          { name: 'txHash', internalType: 'bytes32', type: 'bytes32' },
          {
            name: 'txType',
            internalType: 'enum VmSafe.BroadcastTxType',
            type: 'uint8',
          },
          { name: 'contractAddress', internalType: 'address', type: 'address' },
          { name: 'blockNumber', internalType: 'uint64', type: 'uint64' },
          { name: 'success', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'chainAlias', internalType: 'string', type: 'string' }],
    name: 'getChain',
    outputs: [
      {
        name: 'chain',
        internalType: 'struct VmSafe.Chain',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'chainId', internalType: 'uint256', type: 'uint256' },
          { name: 'chainAlias', internalType: 'string', type: 'string' },
          { name: 'rpcUrl', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'chainId', internalType: 'uint256', type: 'uint256' }],
    name: 'getChain',
    outputs: [
      {
        name: 'chain',
        internalType: 'struct VmSafe.Chain',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'chainId', internalType: 'uint256', type: 'uint256' },
          { name: 'chainAlias', internalType: 'string', type: 'string' },
          { name: 'rpcUrl', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'artifactPath', internalType: 'string', type: 'string' }],
    name: 'getCode',
    outputs: [
      { name: 'creationBytecode', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'artifactPath', internalType: 'string', type: 'string' }],
    name: 'getDeployedCode',
    outputs: [
      { name: 'runtimeBytecode', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'contractName', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'getDeployment',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'contractName', internalType: 'string', type: 'string' }],
    name: 'getDeployment',
    outputs: [
      { name: 'deployedAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'contractName', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'getDeployments',
    outputs: [
      {
        name: 'deployedAddresses',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFoundryVersion',
    outputs: [{ name: 'version', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getLabel',
    outputs: [{ name: 'currentLabel', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'elementSlot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getMappingKeyAndParentOf',
    outputs: [
      { name: 'found', internalType: 'bool', type: 'bool' },
      { name: 'key', internalType: 'bytes32', type: 'bytes32' },
      { name: 'parent', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'mappingSlot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getMappingLength',
    outputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'mappingSlot', internalType: 'bytes32', type: 'bytes32' },
      { name: 'idx', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getMappingSlotAt',
    outputs: [{ name: 'value', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getNonce',
    outputs: [{ name: 'nonce', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'wallet',
        internalType: 'struct VmSafe.Wallet',
        type: 'tuple',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'publicKeyX', internalType: 'uint256', type: 'uint256' },
          { name: 'publicKeyY', internalType: 'uint256', type: 'uint256' },
          { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getNonce',
    outputs: [{ name: 'nonce', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRecordedLogs',
    outputs: [
      {
        name: 'logs',
        internalType: 'struct VmSafe.Log[]',
        type: 'tuple[]',
        components: [
          { name: 'topics', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
          { name: 'emitter', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStateDiff',
    outputs: [{ name: 'diff', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStateDiffJson',
    outputs: [{ name: 'diff', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWallets',
    outputs: [
      { name: 'wallets', internalType: 'address[]', type: 'address[]' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'input', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'indexOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'context',
        internalType: 'enum VmSafe.ForgeContext',
        type: 'uint8',
      },
    ],
    name: 'isContext',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'isDir',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'isFile',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'keyExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'keyExistsJson',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'keyExistsToml',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'newLabel', internalType: 'string', type: 'string' },
    ],
    name: 'label',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastCallGas',
    outputs: [
      {
        name: 'gas',
        internalType: 'struct VmSafe.Gas',
        type: 'tuple',
        components: [
          { name: 'gasLimit', internalType: 'uint64', type: 'uint64' },
          { name: 'gasTotalUsed', internalType: 'uint64', type: 'uint64' },
          { name: 'gasMemoryUsed', internalType: 'uint64', type: 'uint64' },
          { name: 'gasRefunded', internalType: 'int64', type: 'int64' },
          { name: 'gasRemaining', internalType: 'uint64', type: 'uint64' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'slot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'load',
    outputs: [{ name: 'data', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    name: 'parseAddress',
    outputs: [
      { name: 'parsedValue', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    name: 'parseBool',
    outputs: [{ name: 'parsedValue', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    name: 'parseBytes',
    outputs: [{ name: 'parsedValue', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    name: 'parseBytes32',
    outputs: [
      { name: 'parsedValue', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    name: 'parseInt',
    outputs: [{ name: 'parsedValue', internalType: 'int256', type: 'int256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    name: 'parseJson',
    outputs: [{ name: 'abiEncodedData', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJson',
    outputs: [{ name: 'abiEncodedData', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonAddressArray',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonBoolArray',
    outputs: [{ name: '', internalType: 'bool[]', type: 'bool[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonBytes',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonBytes32',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonBytes32Array',
    outputs: [{ name: '', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonBytesArray',
    outputs: [{ name: '', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonInt',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonIntArray',
    outputs: [{ name: '', internalType: 'int256[]', type: 'int256[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonKeys',
    outputs: [{ name: 'keys', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonString',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonStringArray',
    outputs: [{ name: '', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'typeDescription', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonType',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
      { name: 'typeDescription', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonType',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
      { name: 'typeDescription', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonTypeArray',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseJsonUintArray',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseToml',
    outputs: [{ name: 'abiEncodedData', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'toml', internalType: 'string', type: 'string' }],
    name: 'parseToml',
    outputs: [{ name: 'abiEncodedData', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlAddressArray',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlBoolArray',
    outputs: [{ name: '', internalType: 'bool[]', type: 'bool[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlBytes',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlBytes32',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlBytes32Array',
    outputs: [{ name: '', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlBytesArray',
    outputs: [{ name: '', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlInt',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlIntArray',
    outputs: [{ name: '', internalType: 'int256[]', type: 'int256[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlKeys',
    outputs: [{ name: 'keys', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlString',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlStringArray',
    outputs: [{ name: '', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'typeDescription', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlType',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
      { name: 'typeDescription', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlType',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
      { name: 'typeDescription', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlTypeArray',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'toml', internalType: 'string', type: 'string' },
      { name: 'key', internalType: 'string', type: 'string' },
    ],
    name: 'parseTomlUintArray',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    name: 'parseUint',
    outputs: [
      { name: 'parsedValue', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pauseGasMetering',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pauseTracing',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'projectRoot',
    outputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'promptText', internalType: 'string', type: 'string' }],
    name: 'prompt',
    outputs: [{ name: 'input', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'promptText', internalType: 'string', type: 'string' }],
    name: 'promptAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'promptText', internalType: 'string', type: 'string' }],
    name: 'promptSecret',
    outputs: [{ name: 'input', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'promptText', internalType: 'string', type: 'string' }],
    name: 'promptSecretUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'promptText', internalType: 'string', type: 'string' }],
    name: 'promptUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    name: 'publicKeyP256',
    outputs: [
      { name: 'publicKeyX', internalType: 'uint256', type: 'uint256' },
      { name: 'publicKeyY', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'randomAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'randomBool',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'len', internalType: 'uint256', type: 'uint256' }],
    name: 'randomBytes',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'randomBytes4',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'randomBytes8',
    outputs: [{ name: '', internalType: 'bytes8', type: 'bytes8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'randomInt',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'bits', internalType: 'uint256', type: 'uint256' }],
    name: 'randomInt',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'randomUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'bits', internalType: 'uint256', type: 'uint256' }],
    name: 'randomUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'min', internalType: 'uint256', type: 'uint256' },
      { name: 'max', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'randomUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'maxDepth', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'readDir',
    outputs: [
      {
        name: 'entries',
        internalType: 'struct VmSafe.DirEntry[]',
        type: 'tuple[]',
        components: [
          { name: 'errorMessage', internalType: 'string', type: 'string' },
          { name: 'path', internalType: 'string', type: 'string' },
          { name: 'depth', internalType: 'uint64', type: 'uint64' },
          { name: 'isDir', internalType: 'bool', type: 'bool' },
          { name: 'isSymlink', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'maxDepth', internalType: 'uint64', type: 'uint64' },
      { name: 'followLinks', internalType: 'bool', type: 'bool' },
    ],
    name: 'readDir',
    outputs: [
      {
        name: 'entries',
        internalType: 'struct VmSafe.DirEntry[]',
        type: 'tuple[]',
        components: [
          { name: 'errorMessage', internalType: 'string', type: 'string' },
          { name: 'path', internalType: 'string', type: 'string' },
          { name: 'depth', internalType: 'uint64', type: 'uint64' },
          { name: 'isDir', internalType: 'bool', type: 'bool' },
          { name: 'isSymlink', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'readDir',
    outputs: [
      {
        name: 'entries',
        internalType: 'struct VmSafe.DirEntry[]',
        type: 'tuple[]',
        components: [
          { name: 'errorMessage', internalType: 'string', type: 'string' },
          { name: 'path', internalType: 'string', type: 'string' },
          { name: 'depth', internalType: 'uint64', type: 'uint64' },
          { name: 'isDir', internalType: 'bool', type: 'bool' },
          { name: 'isSymlink', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'readFile',
    outputs: [{ name: 'data', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'readFileBinary',
    outputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'readLine',
    outputs: [{ name: 'line', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'linkPath', internalType: 'string', type: 'string' }],
    name: 'readLink',
    outputs: [{ name: 'targetPath', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'record',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recordLogs',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    name: 'rememberKey',
    outputs: [{ name: 'keyAddr', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'mnemonic', internalType: 'string', type: 'string' },
      { name: 'derivationPath', internalType: 'string', type: 'string' },
      { name: 'count', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'rememberKeys',
    outputs: [
      { name: 'keyAddrs', internalType: 'address[]', type: 'address[]' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'mnemonic', internalType: 'string', type: 'string' },
      { name: 'derivationPath', internalType: 'string', type: 'string' },
      { name: 'language', internalType: 'string', type: 'string' },
      { name: 'count', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'rememberKeys',
    outputs: [
      { name: 'keyAddrs', internalType: 'address[]', type: 'address[]' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'recursive', internalType: 'bool', type: 'bool' },
    ],
    name: 'removeDir',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'path', internalType: 'string', type: 'string' }],
    name: 'removeFile',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'input', internalType: 'string', type: 'string' },
      { name: 'from', internalType: 'string', type: 'string' },
      { name: 'to', internalType: 'string', type: 'string' },
    ],
    name: 'replace',
    outputs: [{ name: 'output', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resetGasMetering',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resumeGasMetering',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resumeTracing',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'urlOrAlias', internalType: 'string', type: 'string' },
      { name: 'method', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'string', type: 'string' },
    ],
    name: 'rpc',
    outputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'method', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'string', type: 'string' },
    ],
    name: 'rpc',
    outputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'rpcAlias', internalType: 'string', type: 'string' }],
    name: 'rpcUrl',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rpcUrlStructs',
    outputs: [
      {
        name: 'urls',
        internalType: 'struct VmSafe.Rpc[]',
        type: 'tuple[]',
        components: [
          { name: 'key', internalType: 'string', type: 'string' },
          { name: 'url', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rpcUrls',
    outputs: [
      { name: 'urls', internalType: 'string[2][]', type: 'string[2][]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'values', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'serializeAddress',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'address', type: 'address' },
    ],
    name: 'serializeAddress',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'values', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'serializeBool',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'bool', type: 'bool' },
    ],
    name: 'serializeBool',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'values', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'serializeBytes',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'serializeBytes',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'values', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'serializeBytes32',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'serializeBytes32',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'int256', type: 'int256' },
    ],
    name: 'serializeInt',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'values', internalType: 'int256[]', type: 'int256[]' },
    ],
    name: 'serializeInt',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'string', type: 'string' },
    ],
    name: 'serializeJson',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'typeDescription', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'serializeJsonType',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'typeDescription', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'serializeJsonType',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'values', internalType: 'string[]', type: 'string[]' },
    ],
    name: 'serializeString',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'string', type: 'string' },
    ],
    name: 'serializeString',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'serializeUint',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'serializeUint',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'objectKey', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'serializeUintToHex',
    outputs: [{ name: 'json', internalType: 'string', type: 'string' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'overwrite', internalType: 'bool', type: 'bool' },
    ],
    name: 'setArbitraryStorage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'setArbitraryStorage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'value', internalType: 'string', type: 'string' },
    ],
    name: 'setEnv',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'array', internalType: 'uint256[]', type: 'uint256[]' }],
    name: 'shuffle',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'digest', internalType: 'bytes32', type: 'bytes32' }],
    name: 'sign',
    outputs: [
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address' },
      { name: 'digest', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'sign',
    outputs: [
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'wallet',
        internalType: 'struct VmSafe.Wallet',
        type: 'tuple',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'publicKeyX', internalType: 'uint256', type: 'uint256' },
          { name: 'publicKeyY', internalType: 'uint256', type: 'uint256' },
          { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'digest', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'sign',
    outputs: [
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
      { name: 'digest', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'sign',
    outputs: [
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
      { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'signAndAttachDelegation',
    outputs: [
      {
        name: 'signedDelegation',
        internalType: 'struct VmSafe.SignedDelegation',
        type: 'tuple',
        components: [
          { name: 'v', internalType: 'uint8', type: 'uint8' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
          { name: 'implementation', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
      { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
      { name: 'nonce', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'signAndAttachDelegation',
    outputs: [
      {
        name: 'signedDelegation',
        internalType: 'struct VmSafe.SignedDelegation',
        type: 'tuple',
        components: [
          { name: 'v', internalType: 'uint8', type: 'uint8' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
          { name: 'implementation', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'wallet',
        internalType: 'struct VmSafe.Wallet',
        type: 'tuple',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'publicKeyX', internalType: 'uint256', type: 'uint256' },
          { name: 'publicKeyY', internalType: 'uint256', type: 'uint256' },
          { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'digest', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'signCompact',
    outputs: [
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 'vs', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address' },
      { name: 'digest', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'signCompact',
    outputs: [
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 'vs', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'digest', internalType: 'bytes32', type: 'bytes32' }],
    name: 'signCompact',
    outputs: [
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 'vs', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
      { name: 'digest', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'signCompact',
    outputs: [
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 'vs', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
      { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'signDelegation',
    outputs: [
      {
        name: 'signedDelegation',
        internalType: 'struct VmSafe.SignedDelegation',
        type: 'tuple',
        components: [
          { name: 'v', internalType: 'uint8', type: 'uint8' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
          { name: 'implementation', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
      { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
      { name: 'nonce', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'signDelegation',
    outputs: [
      {
        name: 'signedDelegation',
        internalType: 'struct VmSafe.SignedDelegation',
        type: 'tuple',
        components: [
          { name: 'v', internalType: 'uint8', type: 'uint8' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
          { name: 'implementation', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'privateKey', internalType: 'uint256', type: 'uint256' },
      { name: 'digest', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'signP256',
    outputs: [
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'duration', internalType: 'uint256', type: 'uint256' }],
    name: 'sleep',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'array', internalType: 'uint256[]', type: 'uint256[]' }],
    name: 'sort',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'input', internalType: 'string', type: 'string' },
      { name: 'delimiter', internalType: 'string', type: 'string' },
    ],
    name: 'split',
    outputs: [{ name: 'outputs', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'startBroadcast',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'signer', internalType: 'address', type: 'address' }],
    name: 'startBroadcast',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'privateKey', internalType: 'uint256', type: 'uint256' }],
    name: 'startBroadcast',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'startDebugTraceRecording',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'startMappingRecording',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'startStateDiffRecording',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stopAndReturnDebugTraceRecording',
    outputs: [
      {
        name: 'step',
        internalType: 'struct VmSafe.DebugStep[]',
        type: 'tuple[]',
        components: [
          { name: 'stack', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'memoryInput', internalType: 'bytes', type: 'bytes' },
          { name: 'opcode', internalType: 'uint8', type: 'uint8' },
          { name: 'depth', internalType: 'uint64', type: 'uint64' },
          { name: 'isOutOfGas', internalType: 'bool', type: 'bool' },
          { name: 'contractAddr', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stopAndReturnStateDiff',
    outputs: [
      {
        name: 'accountAccesses',
        internalType: 'struct VmSafe.AccountAccess[]',
        type: 'tuple[]',
        components: [
          {
            name: 'chainInfo',
            internalType: 'struct VmSafe.ChainInfo',
            type: 'tuple',
            components: [
              { name: 'forkId', internalType: 'uint256', type: 'uint256' },
              { name: 'chainId', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'kind',
            internalType: 'enum VmSafe.AccountAccessKind',
            type: 'uint8',
          },
          { name: 'account', internalType: 'address', type: 'address' },
          { name: 'accessor', internalType: 'address', type: 'address' },
          { name: 'initialized', internalType: 'bool', type: 'bool' },
          { name: 'oldBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'newBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'deployedCode', internalType: 'bytes', type: 'bytes' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
          { name: 'reverted', internalType: 'bool', type: 'bool' },
          {
            name: 'storageAccesses',
            internalType: 'struct VmSafe.StorageAccess[]',
            type: 'tuple[]',
            components: [
              { name: 'account', internalType: 'address', type: 'address' },
              { name: 'slot', internalType: 'bytes32', type: 'bytes32' },
              { name: 'isWrite', internalType: 'bool', type: 'bool' },
              {
                name: 'previousValue',
                internalType: 'bytes32',
                type: 'bytes32',
              },
              { name: 'newValue', internalType: 'bytes32', type: 'bytes32' },
              { name: 'reverted', internalType: 'bool', type: 'bool' },
            ],
          },
          { name: 'depth', internalType: 'uint64', type: 'uint64' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stopBroadcast',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stopMappingRecording',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'string', type: 'string' }],
    name: 'toBase64',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    name: 'toBase64',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'string', type: 'string' }],
    name: 'toBase64URL',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    name: 'toBase64URL',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'input', internalType: 'string', type: 'string' }],
    name: 'toLowercase',
    outputs: [{ name: 'output', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'address', type: 'address' }],
    name: 'toString',
    outputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'toString',
    outputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'bytes', type: 'bytes' }],
    name: 'toString',
    outputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'bool', type: 'bool' }],
    name: 'toString',
    outputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'int256', type: 'int256' }],
    name: 'toString',
    outputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'bytes32', type: 'bytes32' }],
    name: 'toString',
    outputs: [
      { name: 'stringifiedValue', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'input', internalType: 'string', type: 'string' }],
    name: 'toUppercase',
    outputs: [{ name: 'output', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'input', internalType: 'string', type: 'string' }],
    name: 'trim',
    outputs: [{ name: 'output', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'commandInput', internalType: 'string[]', type: 'string[]' },
    ],
    name: 'tryFfi',
    outputs: [
      {
        name: 'result',
        internalType: 'struct VmSafe.FfiResult',
        type: 'tuple',
        components: [
          { name: 'exitCode', internalType: 'int32', type: 'int32' },
          { name: 'stdout', internalType: 'bytes', type: 'bytes' },
          { name: 'stderr', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unixTime',
    outputs: [
      { name: 'milliseconds', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'string', type: 'string' },
    ],
    name: 'writeFile',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'writeFileBinary',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
    ],
    name: 'writeJson',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'path', internalType: 'string', type: 'string' },
    ],
    name: 'writeJson',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'data', internalType: 'string', type: 'string' },
    ],
    name: 'writeLine',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'path', internalType: 'string', type: 'string' },
      { name: 'valueKey', internalType: 'string', type: 'string' },
    ],
    name: 'writeToml',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'json', internalType: 'string', type: 'string' },
      { name: 'path', internalType: 'string', type: 'string' },
    ],
    name: 'writeToml',
    outputs: [],
    stateMutability: 'nonpayable',
  },
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
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
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DelegateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'previousVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateVotesChanged',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
  {
    type: 'error',
    inputs: [
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'clock', internalType: 'uint48', type: 'uint48' },
    ],
    name: 'ERC5805FutureLookup',
  },
  { type: 'error', inputs: [], name: 'ERC6372InconsistentClock' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
  {
    type: 'error',
    inputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
    name: 'VotesExpiredSignature',
  },
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
        type: 'address',
      },
      {
        name: '_store',
        internalType: 'contract VotingEscrowStore',
        type: 'address',
      },
      { name: '_token', internalType: 'contract PuppetToken', type: 'address' },
      {
        name: '_vToken',
        internalType: 'contract PuppetVoteToken',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAXTIME',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'duration', internalType: 'uint256', type: 'uint256' }],
    name: 'calcDurationMultiplier',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signatureHash', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getClaimable',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
            type: 'uint256',
          },
          { name: 'baseMultiplier', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'duration', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getVestedBonus',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
            type: 'uint256',
          },
          { name: 'lastAccruedTime', internalType: 'uint256', type: 'uint256' },
          { name: 'accrued', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'depositor', internalType: 'address', type: 'address' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'duration', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'lock',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'lockDurationMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
    name: 'setConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSig', internalType: 'bytes4', type: 'bytes4' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPermission',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'store',
    outputs: [
      { name: '', internalType: 'contract VotingEscrowStore', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token',
    outputs: [
      { name: '', internalType: 'contract PuppetToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'vToken',
    outputs: [
      { name: '', internalType: 'contract PuppetVoteToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'vest',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'vestMap',
    outputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'remainingDuration', internalType: 'uint256', type: 'uint256' },
      { name: 'lastAccruedTime', internalType: 'uint256', type: 'uint256' },
      { name: 'accrued', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  { type: 'error', inputs: [], name: 'Permission__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Permission__Unauthorized' },
  { type: 'error', inputs: [], name: 'VotingEscrow__ExceedMaxTime' },
  {
    type: 'error',
    inputs: [{ name: 'accured', internalType: 'uint256', type: 'uint256' }],
    name: 'VotingEscrow__ExceedingAccruedAmount',
  },
  { type: 'error', inputs: [], name: 'VotingEscrow__ZeroAmount' },
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
        type: 'address',
      },
      {
        name: '_router',
        internalType: 'contract TokenRouter',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract IAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'canCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'getTokenBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'recordTransferIn',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAccess',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'syncTokenBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    name: 'tokenBalanceMap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_depositor', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferIn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'gasLimit', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferOut',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'Access__CallerNotAuthority' },
  { type: 'error', inputs: [], name: 'Access__Unauthorized' },
  { type: 'error', inputs: [], name: 'BankStore__InsufficientBalance' },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TransferUtils__TokenTransferError',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// stdError
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stdErrorAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'arithmeticError',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'assertionError',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'divisionError',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'encodeStorageError',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'enumConversionError',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'indexOOBError',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'memOverflowError',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'popError',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'zeroVarError',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// stdStorageSafe
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stdStorageSafeAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'who', internalType: 'address', type: 'address', indexed: false },
      { name: 'fsig', internalType: 'bytes4', type: 'bytes4', indexed: false },
      {
        name: 'keysHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'slot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SlotFound',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'who', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'slot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'WARNING_UninitedSlot',
  },
] as const
