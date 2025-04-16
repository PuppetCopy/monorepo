import { getMappedValue } from "../utils/index.js";
import { DecodeErrorResultReturnType } from "viem";

const errorMessages = {
  Access__Unauthorized: () => "Access unauthorized.",
  AllocationLogic__AllocationDoesNotExist: () => "Allocation does not exist.",
  AllocationLogic__AllocationStillUtilized: () =>
    "Allocation is still being utilized.",
  AllocationLogic__InvalidListLength: () =>
    "Invalid list length in allocation logic.",
  AllocationLogic__InvalidPuppetListIntegrity: () =>
    "Invalid puppet list integrity in allocation logic.",
  AllocationLogic__PuppetListLimit: () =>
    "Puppet list limit reached in allocation logic.",
  ContributeLogic__InsufficientClaimableReward: ({ accruedReward }) =>
    `Insufficient claimable reward in contribute logic. Accrued reward: ${accruedReward}.`,
  ContributeLogic__InvalidBuybackToken: () =>
    "Invalid buyback token in contribute logic.",
  ExecutionLogic__AllocationDoesNotExist: () =>
    "Allocation does not exist in execution logic.",
  ExecutionLogic__InvalidRequest: ({ positionKey, key }) =>
    `Invalid request in execution logic. Position key: ${positionKey}, Key: ${key}.`,
  ExecutionLogic__MismatchedAmountIn: ({ recordedAmountIn, amountIn }) =>
    `Mismatched amount in execution logic. Recorded amount in: ${recordedAmountIn}, Amount in: ${amountIn}.`,
  ExecutionLogic__PositionDoesNotExist: () =>
    "Position does not exist in execution logic.",
  ExecutionLogic__RequestDoesNotExist: () =>
    "Request does not exist in execution logic.",
  ExecutionLogic__UnexpectedEventData: () =>
    "Unexpected event data in execution logic.",
  ExternalCallUtils__AddressEmptyCode: ({ target }) =>
    `External call to address with empty code. Target: ${target}.`,
  ExternalCallUtils__EmptyReceiver: () => "Empty receiver in external call.",
  ExternalCallUtils__FailedInnerCall: () =>
    "Failed inner call in external call utilities.",
  ExternalCallUtils__SafeERC20FailedOperation: ({ token }) =>
    `SafeERC20 operation failed for token: ${token}.`,
  Permission__Unauthorized: () => "Permission unauthorized.",
  PositionRouter__InvalidOrderType: ({ orderType }) =>
    `Invalid order type in position router. Order type: ${orderType}.`,
  PuppetLogic__AllowanceAboveLimit: ({ allowanceCap }) =>
    `Allowance above limit in puppet logic. Allowance cap: ${allowanceCap}.`,
  PuppetLogic__InsufficientBalance: () =>
    "Insufficient balance in puppet logic.",
  PuppetLogic__InvalidActivityThrottle: ({
    minAllocationActivity,
    maxAllocationActivity,
  }) =>
    `Invalid activity throttle in puppet logic. Min allocation activity: ${minAllocationActivity}, Max allocation activity: ${maxAllocationActivity}.`,
  PuppetLogic__InvalidAllowanceRate: ({ min, max }) =>
    `Invalid allowance rate in puppet logic. Min: ${min}, Max: ${max}.`,
  PuppetLogic__InvalidAmount: () => "Invalid amount in puppet logic.",
  PuppetLogic__InvalidLength: () => "Invalid length in puppet logic.",
  PuppetLogic__TokenNotAllowed: () => "Token not allowed in puppet logic.",
  PuppetStore__OverwriteAllocation: () =>
    "Attempted to overwrite allocation in puppet store.",
  PuppetToken__CoreShareExceedsMining: () =>
    "Core share exceeds mining in puppet token.",
  PuppetToken__ExceededRateLimit: ({ rateLimit, emissionRate }) =>
    `Exceeded rate limit in puppet token. Rate limit: ${rateLimit}, Emission rate: ${emissionRate}.`,
  PuppetToken__InvalidRate: () => "Invalid rate in puppet token.",
  RequestLogic__InvalidAllocationMatchKey: () =>
    "Invalid allocation match key in request logic.",
  RequestLogic__NoAllocation: () => "No allocation in request logic.",
  RequestLogic__PendingExecution: () => "Pending execution in request logic.",
  RequestLogic__ValueNotFound: () => "Value not found in request logic.",
  RewardLogic__NoClaimableAmount: ({ accruedReward }) =>
    `No claimable amount in reward logic. Accrued reward: ${accruedReward}.`,
  Store__InvalidLength: () => "Invalid length in store.",
  Subaccount__UnauthorizedOperator: () =>
    "Unauthorized operator in subaccount.",
  TransferUtils__EmptyHoldingAddress: () =>
    "Empty holding address in transfer utilities.",
  TransferUtils__EmptyTokenTranferGasLimit: ({ token }) =>
    `Empty token transfer gas limit in transfer utilities. Token: ${token}.`,
  TransferUtils__TokenTransferError: ({ token, receiver, amount }) =>
    `Token transfer error in transfer utilities. Token: ${token}, Receiver: ${receiver}, Amount: ${amount}.`,
  VotingEscrowLogic__ExceedMaxTime: () =>
    "Exceeded maximum time in voting escrow logic.",
  VotingEscrowLogic__ExceedingAccruedAmount: ({ accrued }) =>
    `Exceeding accrued amount in voting escrow logic. Accrued: ${accrued}.`,
  VotingEscrowLogic__ZeroAmount: () => "Zero amount in voting escrow logic.",
  VotingEscrow__Unsupported: () => "Unsupported operation in voting escrow.",
}



export function getContractErrorMessage(data: DecodeErrorResultReturnType): string | undefined {
  if (!(data.errorName in errorMessages)) {
    return;
  }

  const errorFunc = getMappedValue(errorMessages, data.errorName);
  const params: any = {};
  const abiItem = data.abiItem

  if ('inputs' in abiItem && abiItem.inputs) {
    const inputs = abiItem.inputs
    if (inputs.length) {
      for (let i = 0; i < inputs.length; i++) {
        const inputName = inputs[i].name;
        if (inputName && data.args) {
          params[inputName] = data.args[i];
        }
      }
    }
  }


  return errorFunc(params);
}