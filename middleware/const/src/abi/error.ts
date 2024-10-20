export default [
  {
    type: "event",
    name: "TransferUtils__TokenTransferReverted",
    inputs: [
      {
        name: "reason",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "returndata",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "Access__Unauthorized", inputs: [] },
  {
    type: "error",
    name: "AllocationLogic__AllocationDoesNotExist",
    inputs: [],
  },
  {
    type: "error",
    name: "AllocationLogic__AllocationStillUtilized",
    inputs: [],
  },
  { type: "error", name: "AllocationLogic__InvalidListLength", inputs: [] },
  {
    type: "error",
    name: "AllocationLogic__InvalidPuppetListIntegrity",
    inputs: [],
  },
  { type: "error", name: "AllocationLogic__PuppetListLimit", inputs: [] },
  {
    type: "error",
    name: "ContributeLogic__InsufficientClaimableReward",
    inputs: [
      { name: "accruedReward", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "ContributeLogic__InvalidBuybackToken", inputs: [] },
  {
    type: "error",
    name: "CoreContract__Unauthorized",
    inputs: [
      { name: "contractName", type: "string", internalType: "string" },
      { name: "version", type: "string", internalType: "string" },
    ],
  },
  { type: "error", name: "Dictator__ConfigurationUpdateFailed", inputs: [] },
  { type: "error", name: "Dictator__ContractAlreadyInitialized", inputs: [] },
  { type: "error", name: "Dictator__ContractNotInitialized", inputs: [] },
  { type: "error", name: "ExecutionLogic__AllocationDoesNotExist", inputs: [] },
  {
    type: "error",
    name: "ExecutionLogic__InvalidRequest",
    inputs: [
      { name: "positionKey", type: "bytes32", internalType: "bytes32" },
      { name: "key", type: "bytes32", internalType: "bytes32" },
    ],
  },
  {
    type: "error",
    name: "ExecutionLogic__MismatchedAmountIn",
    inputs: [
      { name: "recordedAmountIn", type: "uint256", internalType: "uint256" },
      { name: "amountIn", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "ExecutionLogic__PositionDoesNotExist", inputs: [] },
  { type: "error", name: "ExecutionLogic__RequestDoesNotExist", inputs: [] },
  { type: "error", name: "ExecutionLogic__UnexpectedEventData", inputs: [] },
  {
    type: "error",
    name: "ExternalCallUtils__AddressEmptyCode",
    inputs: [{ name: "target", type: "address", internalType: "address" }],
  },
  { type: "error", name: "ExternalCallUtils__EmptyReceiver", inputs: [] },
  { type: "error", name: "ExternalCallUtils__FailedInnerCall", inputs: [] },
  {
    type: "error",
    name: "ExternalCallUtils__SafeERC20FailedOperation",
    inputs: [{ name: "token", type: "address", internalType: "address" }],
  },
  { type: "error", name: "Permission__Unauthorized", inputs: [] },
  {
    type: "error",
    name: "PositionRouter__InvalidOrderType",
    inputs: [
      {
        name: "orderType",
        type: "uint8",
        internalType: "enum GmxPositionUtils.OrderType",
      },
    ],
  },
  {
    type: "error",
    name: "PuppetLogic__AllowanceAboveLimit",
    inputs: [
      { name: "allowanceCap", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "PuppetLogic__InsufficientBalance", inputs: [] },
  {
    type: "error",
    name: "PuppetLogic__InvalidActivityThrottle",
    inputs: [
      {
        name: "minAllocationActivity",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "maxAllocationActivity",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "PuppetLogic__InvalidAllowanceRate",
    inputs: [
      { name: "min", type: "uint256", internalType: "uint256" },
      { name: "max", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "PuppetLogic__InvalidAmount", inputs: [] },
  { type: "error", name: "PuppetLogic__InvalidLength", inputs: [] },
  { type: "error", name: "PuppetLogic__TokenNotAllowed", inputs: [] },
  { type: "error", name: "PuppetStore__OverwriteAllocation", inputs: [] },
  { type: "error", name: "PuppetToken__CoreShareExceedsMining", inputs: [] },
  {
    type: "error",
    name: "PuppetToken__ExceededRateLimit",
    inputs: [
      { name: "rateLimit", type: "uint256", internalType: "uint256" },
      { name: "emissionRate", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "PuppetToken__InvalidRate", inputs: [] },
  {
    type: "error",
    name: "RequestLogic__InvalidAllocationMatchKey",
    inputs: [],
  },
  { type: "error", name: "RequestLogic__NoAllocation", inputs: [] },
  { type: "error", name: "RequestLogic__PendingExecution", inputs: [] },
  { type: "error", name: "RequestLogic__ValueNotFound", inputs: [] },
  {
    type: "error",
    name: "RewardLogic__NoClaimableAmount",
    inputs: [
      { name: "accruedReward", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "Store__InvalidLength", inputs: [] },
  { type: "error", name: "Subaccount__UnauthorizedOperator", inputs: [] },
  { type: "error", name: "TransferUtils__EmptyHoldingAddress", inputs: [] },
  {
    type: "error",
    name: "TransferUtils__EmptyTokenTranferGasLimit",
    inputs: [{ name: "token", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "TransferUtils__TokenTransferError",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "receiver", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "VotingEscrowLogic__ExceedMaxTime", inputs: [] },
  {
    type: "error",
    name: "VotingEscrowLogic__ExceedingAccruedAmount",
    inputs: [{ name: "accrued", type: "uint256", internalType: "uint256" }],
  },
  { type: "error", name: "VotingEscrowLogic__ZeroAmount", inputs: [] },
  { type: "error", name: "VotingEscrow__Unsupported", inputs: [] },
] as const;
