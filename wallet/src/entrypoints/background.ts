import type { Address, EIP1193Parameters, Hex, WalletRpcSchema, WalletSendCallsParameters } from 'viem'
import {
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

const PUPPET_URL = import.meta.env.VITE_PUPPET_URL ?? 'http://localhost:3000'
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

interface Subaccount {
  account: Address // Master/controller address
  subaccount: Address
  signerKey: Hex // Session signer private key
  subaccountName: Hex // bytes32 encoded name
}

interface StoredState {
  subaccountMap: Record<Address, Subaccount>
  activeAccount: Address | null
}

const DEFAULT_STATE: StoredState = {
  subaccountMap: {},
  activeAccount: null
}

export default defineBackground(async () => {
  const stored = await chrome.storage.local.get(['puppetState'])
  const state: StoredState = (stored.puppetState as StoredState) ?? DEFAULT_STATE

  function getActiveSubaccountEntry(): Subaccount | null {
    if (!state.activeAccount) return null
    return state.subaccountMap[state.activeAccount] ?? null
  }

  function getActiveSubaccount(): Address | null {
    return getActiveSubaccountEntry()?.subaccount ?? null
  }

  // Open wallet page when extension icon is clicked
  chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: `${PUPPET_URL}/wallet` })
  })

  // Handle all messages
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const handler = message.type ? handleWebsiteMessage(message) : handleRpcRequest(message)

    handler
      .then(result => sendResponse(message.type ? { success: true, result } : { result }))
      .catch(error => {
        console.error('[Puppet] Error:', error.message)
        sendResponse(message.type ? { success: false, error: error.message } : { error: { message: error.message } })
      })

    return true
  })

  // Handle website<->extension messages (subaccount state management)
  async function handleWebsiteMessage(message: { type: string; payload?: unknown }): Promise<unknown> {
    switch (message.type) {
      // Website sends: PUPPET_GET_WALLET_STATE with { ownerAddress }
      // Returns: { smartWalletAddress, subaccountName, privateKey } | null
      case 'PUPPET_GET_WALLET_STATE': {
        const payload = message.payload as { ownerAddress?: string } | undefined
        if (!payload?.ownerAddress) return null
        const account = getAddress(payload.ownerAddress)
        const entry = state.subaccountMap[account]
        if (!entry) return null
        return {
          smartWalletAddress: entry.subaccount,
          subaccountName: entry.subaccountName,
          privateKey: entry.signerKey
        }
      }

      // Website sends: PUPPET_SET_WALLET_STATE with { ownerAddress, smartWalletAddress, subaccountName, privateKey }
      case 'PUPPET_SET_WALLET_STATE': {
        const payload = message.payload as {
          ownerAddress: string
          smartWalletAddress: string
          subaccountName: Hex
          privateKey: Hex
        }
        const account = getAddress(payload.ownerAddress)
        const subaccount = getAddress(payload.smartWalletAddress)

        state.subaccountMap[account] = {
          account,
          subaccount,
          signerKey: payload.privateKey,
          subaccountName: payload.subaccountName
        }
        await chrome.storage.local.set({ puppetState: state })
        return { subaccount }
      }

      // Website sends: PUPPET_SET_ACTIVE_WALLET with { ownerAddress }
      case 'PUPPET_SET_ACTIVE_WALLET': {
        const payload = message.payload as { ownerAddress: string | null }
        const prevSubaccount = getActiveSubaccount()
        state.activeAccount = payload.ownerAddress ? getAddress(payload.ownerAddress) : null
        await chrome.storage.local.set({ puppetState: state })

        // Notify tabs of account change
        const newSubaccount = getActiveSubaccount()
        if (newSubaccount !== prevSubaccount) {
          const tabs = await chrome.tabs.query({})
          for (const tab of tabs) {
            if (!tab.id || !tab.url) continue
            if (new URL(tab.url).origin === PUPPET_URL) continue
            chrome.tabs
              .sendMessage(tab.id, {
                type: 'event',
                event: 'accountsChanged',
                args: [newSubaccount ? [newSubaccount] : []]
              })
              .catch(() => {})
          }
        }
        return { activeAccount: state.activeAccount }
      }

      // Website sends: PUPPET_CLEAR_WALLET_STATE with { ownerAddress }
      case 'PUPPET_CLEAR_WALLET_STATE': {
        const payload = message.payload as { ownerAddress: string }
        const account = getAddress(payload.ownerAddress)

        delete state.subaccountMap[account]
        if (state.activeAccount === account) state.activeAccount = null
        await chrome.storage.local.set({ puppetState: state })
        return null
      }

      case 'PUPPET_CLEAR_ALL': {
        state.subaccountMap = {}
        state.activeAccount = null
        await chrome.storage.local.clear()
        return null
      }

      default:
        throw new Error(`Unknown message type: ${message.type}`)
    }
  }

  // Handle EIP-1193 RPC requests
  async function handleRpcRequest(request: EIP1193Parameters<[...WalletRpcSchema]>): Promise<unknown> {
    const { method, params } = request

    switch (method) {
      case 'eth_requestAccounts':
      case 'eth_accounts': {
        const subaccount = getActiveSubaccount()
        if (!subaccount) {
          chrome.tabs.create({ url: `${PUPPET_URL}/wallet`, active: true })
          throw new Error('Please connect your subaccount on puppet.tech first')
        }
        return [subaccount]
      }

      case 'eth_chainId':
        return toHex(arbitrum.id)

      case 'wallet_switchEthereumChain':
        return null

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
})


