import type { Address, EIP1193Parameters, Hex, WalletRpcSchema, WalletSendCallsParameters } from 'viem'
import {
  createPublicClient,
  createWalletClient,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  getAddress,
  hexToBigInt,
  http,
  isHex,
  toHex
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { arbitrum } from 'viem/chains'
import type { Subaccount } from './state.js'

const RPC_URL = import.meta.env.VITE_RPC_URL ?? arbitrum.rpcUrls.default.http[0]

/** ERC-7579 execute ABI - @link https://eips.ethereum.org/EIPS/eip-7579 */
const executeAbi = [
  {
    name: 'execute',
    type: 'function',
    inputs: [
      { name: 'mode', type: 'bytes32' },
      { name: 'executionCalldata', type: 'bytes' }
    ],
    outputs: [],
    stateMutability: 'payable'
  }
] as const

/** ERC-7579 ModeCode - CALLTYPE_SINGLE with EXECTYPE_DEFAULT */
const MODE_SINGLE = '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex

/** ERC-7579 ModeCode - CALLTYPE_BATCH with EXECTYPE_DEFAULT */
const MODE_BATCH = '0x0100000000000000000000000000000000000000000000000000000000000000' as Hex

export interface RpcHandlerDeps {
  getActiveSubaccount: () => Address | null
  getActiveSubaccountEntry: () => Subaccount | null
}

export async function handleRpcRequest(
  request: EIP1193Parameters<[...WalletRpcSchema]>,
  deps: RpcHandlerDeps
): Promise<unknown> {
  const { method, params } = request
  const { getActiveSubaccount, getActiveSubaccountEntry } = deps

  switch (method) {
    case 'eth_requestAccounts':
    case 'eth_accounts': {
      const subaccount = getActiveSubaccount()
      if (!subaccount) {
        throw new Error('No subaccount configured')
      }
      return [subaccount]
    }

    case 'eth_chainId':
      return toHex(arbitrum.id)

    case 'wallet_switchEthereumChain':
      return null

    case 'eth_estimateGas': {
      const entry = getActiveSubaccountEntry()
      if (!entry) throw new Error('No subaccount configured')

      const [txParams] = params as [{ to?: string; data?: Hex; value?: Hex | bigint }]
      if (!txParams?.to) throw new Error('Missing transaction recipient')

      const target = getAddress(txParams.to)
      const calldata = txParams.data ?? ('0x' as const)
      const value = isHex(txParams.value) ? hexToBigInt(txParams.value) : (txParams.value ?? 0n)

      // Build ERC-7579 execute() calldata (same as sendTransaction)
      const executionCalldata = encodePacked(['address', 'uint256', 'bytes'], [target, value, calldata])
      const executeCalldata = encodeFunctionData({
        abi: executeAbi,
        functionName: 'execute',
        args: [MODE_SINGLE, executionCalldata]
      })

      const client = createPublicClient({ chain: arbitrum, transport: http(RPC_URL) })

      const gas = await client.estimateGas({
        account: entry.subaccount,
        to: entry.subaccount,
        data: executeCalldata,
        value
      })

      return toHex(gas)
    }

    case 'eth_sendTransaction': {
      const entry = getActiveSubaccountEntry()
      if (!entry) throw new Error('No subaccount configured')

      const [txParams] = params
      if (!txParams?.to) throw new Error('Missing transaction recipient')

      const target = getAddress(txParams.to)
      const calldata = txParams.data ?? ('0x' as const)
      const value = isHex(txParams.value) ? hexToBigInt(txParams.value) : (txParams.value ?? 0n)

      // Build ERC-7579 execute() calldata
      const executionCalldata = encodePacked(['address', 'uint256', 'bytes'], [target, value, calldata])
      const executeCalldata = encodeFunctionData({
        abi: executeAbi,
        functionName: 'execute',
        args: [MODE_SINGLE, executionCalldata]
      })

      // Sign and submit with stored signer key
      const signer = privateKeyToAccount(entry.signerKey)
      const client = createWalletClient({
        account: signer,
        chain: arbitrum,
        transport: http(RPC_URL)
      })

      const txHash = await client.sendTransaction({
        to: entry.subaccount,
        data: executeCalldata,
        value
      })

      return txHash
    }

    case 'wallet_sendCalls': {
      const entry = getActiveSubaccountEntry()
      if (!entry) throw new Error('No subaccount configured')

      const [callsParams] = (params ?? []) as WalletSendCallsParameters
      if (!callsParams?.calls?.length) throw new Error('No calls provided')

      let totalValue = 0n
      const calls = callsParams.calls.map(call => {
        if (!call.to) throw new Error('Missing call target')
        const value = call.value ? hexToBigInt(call.value) : 0n
        totalValue += value
        return {
          target: getAddress(call.to),
          value,
          callData: (call.data ?? '0x') as Hex
        }
      })

      // Build ERC-7579 batch execute() calldata
      const executionCalldata = encodeAbiParameters(
        [
          {
            type: 'tuple[]',
            components: [
              { name: 'target', type: 'address' },
              { name: 'value', type: 'uint256' },
              { name: 'callData', type: 'bytes' }
            ]
          }
        ],
        [calls]
      )
      const executeCalldata = encodeFunctionData({
        abi: executeAbi,
        functionName: 'execute',
        args: [MODE_BATCH, executionCalldata]
      })

      const signer = privateKeyToAccount(entry.signerKey)
      const client = createWalletClient({
        account: signer,
        chain: arbitrum,
        transport: http(RPC_URL)
      })

      const txHash = await client.sendTransaction({
        to: entry.subaccount,
        data: executeCalldata,
        value: totalValue
      })

      return { id: txHash }
    }

    case 'personal_sign':
    case 'eth_sign':
    case 'eth_signTypedData_v4':
    case 'eth_signTransaction':
      throw new Error('Signing not supported')

    default:
      throw new Error(`Unsupported method: ${method}`)
  }
}
