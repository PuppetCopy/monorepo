import { decodeAbiParameters, type Hex } from 'viem'

const CreateOrderParamsAbi = [
  {
    type: 'tuple',
    components: [
      {
        name: 'addresses',
        type: 'tuple',
        components: [
          { name: 'receiver', type: 'address' },
          { name: 'cancellationReceiver', type: 'address' },
          { name: 'callbackContract', type: 'address' },
          { name: 'uiFeeReceiver', type: 'address' },
          { name: 'market', type: 'address' },
          { name: 'initialCollateralToken', type: 'address' },
          { name: 'swapPath', type: 'address[]' }
        ]
      },
      {
        name: 'numbers',
        type: 'tuple',
        components: [
          { name: 'sizeDeltaUsd', type: 'uint256' },
          { name: 'initialCollateralDeltaAmount', type: 'uint256' },
          { name: 'triggerPrice', type: 'uint256' },
          { name: 'acceptablePrice', type: 'uint256' },
          { name: 'executionFee', type: 'uint256' },
          { name: 'callbackGasLimit', type: 'uint256' },
          { name: 'minOutputAmount', type: 'uint256' },
          { name: 'validFromTime', type: 'uint256' }
        ]
      },
      { name: 'orderType', type: 'uint8' },
      { name: 'decreasePositionSwapType', type: 'uint8' },
      { name: 'isLong', type: 'bool' },
      { name: 'shouldUnwrapNativeToken', type: 'bool' },
      { name: 'autoCancel', type: 'bool' },
      { name: 'referralCode', type: 'bytes32' }
    ]
  }
] as const

export function parseCreateOrderParams(calldata: Hex): { token: Hex; amount: bigint } {
  const data = `0x${calldata.slice(10)}` as Hex
  const [params] = decodeAbiParameters(CreateOrderParamsAbi, data)
  return {
    token: params.addresses.initialCollateralToken as Hex,
    amount: params.numbers.initialCollateralDeltaAmount
  }
}
