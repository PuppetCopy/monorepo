import { createWalletClient, encodeFunctionData, type Hex, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { arbitrum } from 'viem/chains'
import type { TransactionParams } from './types.js'

declare const PUPPET_URL: string
declare const RPC_URL: string

interface WalletState {
  ownerAddress: string | null
  smartWalletAddress: string | null
  privateKey: string | null
}

const BALANCE_OF_SELECTOR = '0x70a08231'
const DEFAULT_STATE: WalletState = { ownerAddress: null, smartWalletAddress: null, privateKey: null }

// ERC-7579 execute mode: single call
const CALL_TYPE_SINGLE = '0x00'
const EXEC_TYPE_DEFAULT = '0x00'

const stored = await chrome.storage.local.get(['walletState'])
let walletState: WalletState = (stored.walletState as WalletState) ?? DEFAULT_STATE

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const handler = message.type ? handleWebsiteMessage(message) : handleRpcRequest(message)

  handler
    .then(result => sendResponse(message.type ? { success: true, result } : { result }))
    .catch(error => {
      console.error(`[Puppet] ${message.type ? 'Website' : 'RPC'} error:`, error.message)
      sendResponse(message.type ? { success: false, error: error.message } : { error: { message: error.message } })
    })

  return true
})

async function handleWebsiteMessage(message: { type: string; payload?: unknown }): Promise<unknown> {
  switch (message.type) {
    case 'PUPPET_SET_ACCOUNT': {
      const account = message.payload as string
      if (!account?.startsWith('0x')) throw new Error('Invalid account address')
      walletState.ownerAddress = account
      await chrome.storage.local.set({ walletState })
      return { account }
    }

    case 'PUPPET_GET_ACCOUNT':
      return { account: getActiveAddress() }

    case 'PUPPET_CLEAR_ACCOUNT':
      walletState = { ...DEFAULT_STATE }
      await chrome.storage.local.set({ walletState })
      return { success: true }

    case 'PUPPET_SET_WALLET_STATE': {
      const prevAddress = getActiveAddress()
      const payload = message.payload as Partial<WalletState>
      if (payload.ownerAddress !== undefined) {
        if (payload.ownerAddress && !payload.ownerAddress.startsWith('0x')) throw new Error('Invalid owner address')
        walletState.ownerAddress = payload.ownerAddress
      }
      if (payload.smartWalletAddress !== undefined) {
        if (payload.smartWalletAddress && !payload.smartWalletAddress.startsWith('0x'))
          throw new Error('Invalid smart wallet address')
        walletState.smartWalletAddress = payload.smartWalletAddress
      }
      if (payload.privateKey !== undefined) {
        if (payload.privateKey && !payload.privateKey.startsWith('0x')) throw new Error('Invalid private key format')
        walletState.privateKey = payload.privateKey
      }
      await chrome.storage.local.set({ walletState })
      const newAddress = getActiveAddress()
      if (newAddress !== prevAddress) {
        const tabs = await chrome.tabs.query({})
        for (const tab of tabs) {
          if (!tab.id || !tab.url) continue
          if (new URL(tab.url).origin === PUPPET_URL) continue
          chrome.tabs
            .sendMessage(tab.id, { type: 'event', event: 'accountsChanged', args: [[newAddress]] })
            .catch(() => {})
        }
      }
      return { walletState: { ...walletState, privateKey: undefined } } // Don't expose private key
    }

    case 'PUPPET_GET_WALLET_STATE':
      return { walletState: { ...walletState, privateKey: undefined } } // Don't expose private key

    default:
      throw new Error(`Unknown message type: ${message.type}`)
  }
}

async function handleRpcRequest(request: { method: string; params?: unknown[] }): Promise<unknown> {
  const { method, params } = request
  const activeAddress = getActiveAddress()

  switch (method) {
    case 'eth_requestAccounts':
      if (!activeAddress) {
        chrome.tabs.create({ url: `${PUPPET_URL}/wallet`, active: true })
        throw new Error('Please connect your wallet on puppet.tech first')
      }
      return [activeAddress]

    case 'eth_accounts':
      return activeAddress ? [activeAddress] : []

    case 'eth_chainId':
      return '0xa4b1'

    case 'wallet_switchEthereumChain':
      return null

    case 'eth_call': {
      const [callParams] = (params || []) as [{ to?: string; data?: string }]
      const { data } = callParams || {}

      if (data?.toLowerCase().startsWith(BALANCE_OF_SELECTOR) && walletState.smartWalletAddress) {
        const queriedAddress = `0x${data.slice(34, 74).toLowerCase()}`
        if (queriedAddress === walletState.smartWalletAddress.toLowerCase()) {
          const actualBalance = BigInt((await rpcCall('eth_call', params)) as string)
          const matchableAmount = 1000_000000n // STUB: 1000 USDC for testing
          return `0x${(actualBalance + matchableAmount).toString(16).padStart(64, '0')}`
        }
      }
      return rpcCall('eth_call', params)
    }

    case 'eth_sendTransaction': {
      if (!walletState.smartWalletAddress) throw new Error('Smart wallet not configured')
      if (!walletState.privateKey) throw new Error('Private key not configured')

      const [txParams] = (params || []) as [TransactionParams]
      if (!txParams?.to) throw new Error('Missing transaction recipient')

      // ERC-7579 ModeCode: callType (1) + execType (1) + unused (4) + modeSelector (4) + modePayload (22)
      const mode = `${CALL_TYPE_SINGLE}${EXEC_TYPE_DEFAULT}${'00'.repeat(30)}`
      const target = txParams.to.slice(2).toLowerCase()
      const value = BigInt(txParams.value ?? '0x0')
        .toString(16)
        .padStart(64, '0')
      const callData = txParams.data?.slice(2) ?? ''

      const account = privateKeyToAccount(walletState.privateKey as Hex)
      const client = createWalletClient({ account, chain: arbitrum, transport: http(RPC_URL) })

      return client.sendTransaction({
        to: walletState.smartWalletAddress as Hex,
        data: encodeFunctionData({
          abi: [
            {
              name: 'execute',
              type: 'function',
              inputs: [
                { name: 'mode', type: 'bytes32' },
                { name: 'executionCalldata', type: 'bytes' }
              ]
            }
          ],
          functionName: 'execute',
          args: [`0x${mode}` as Hex, `0x${target}${value}${callData}` as Hex]
        })
      })
    }

    case 'personal_sign':
    case 'eth_signTypedData_v4':
      throw new Error('Signing not yet implemented')

    default:
      throw new Error(`Unsupported method: ${method}`)
  }
}

function getActiveAddress(): string | null {
  return walletState.smartWalletAddress ?? walletState.ownerAddress
}

async function rpcCall(method: string, params: unknown[] = []): Promise<unknown> {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
  })
  const json = await response.json()
  if (json.error) throw new Error(json.error.message)
  return json.result
}
