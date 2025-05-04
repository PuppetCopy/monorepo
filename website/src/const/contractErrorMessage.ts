import { getMappedValue } from '@puppet/middleware/utils'
import type { DecodeErrorResultReturnType } from 'viem'

const errorMessages = {
  VotingEscrowLogic__ZeroAmount: () => 'Zero amount in voting escrow logic.',
  VotingEscrow__Unsupported: () => 'Unsupported operation in voting escrow.'
}

export function getContractErrorMessage(data: DecodeErrorResultReturnType): string | undefined {
  if (!(data.errorName in errorMessages)) {
    return
  }

  const errorFunc = getMappedValue(errorMessages, data.errorName)
  const params: any = {}
  const abiItem = data.abiItem

  if ('inputs' in abiItem && abiItem.inputs) {
    const inputs = abiItem.inputs
    if (inputs.length) {
      for (let i = 0; i < inputs.length; i++) {
        const inputName = inputs[i].name
        if (inputName && data.args) {
          params[inputName] = data.args[i]
        }
      }
    }
  }

  return errorFunc(params)
}
