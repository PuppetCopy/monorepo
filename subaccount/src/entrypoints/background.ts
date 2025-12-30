import { getAddress, type Hex, toHex } from 'viem'
import { signMessage, signTypedData } from 'viem/accounts'
import { arbitrum } from 'viem/chains'
import type { TransactionParams } from '../types.js'

const BALANCE_OF_SELECTOR = '0x70a08231'

const PUPPET_URL = import.meta.env.VITE_PUPPET_URL ?? 'http://localhost:3000'
const RPC_URL = import.meta.env.VITE_RPC_URL ?? arbitrum.rpcUrls.default.http[0]
const MATCHMAKER_WS_URL = import.meta.env.VITE_MATCHMAKER_WS_URL ?? 'ws://localhost:8080'

interface WalletEntry {
  smartWalletAddress: string
  subaccountName: string
  privateKey: string
}

interface StoredWallets {
  wallets: Record<string, WalletEntry> // keyed by ownerAddress (lowercase)
  activeOwner: string | null
}

const DEFAULT_STORAGE: StoredWallets = {
  wallets: {},
  activeOwner: null
}

interface OrderRequest {
  type: 'order'
  target: Hex
  calldata: Hex
  ownerAddress: Hex
  smartWalletAddress: Hex
  subaccountName: Hex
  privateKey: Hex
  timestamp: number
}

interface MatchmakerResponse {
  success: boolean
  txHash?: Hex
  error?: string
}

export default defineBackground(async () => {
  const stored = await chrome.storage.local.get(['storedWallets'])
  const storage: StoredWallets = (stored.storedWallets as StoredWallets) ?? DEFAULT_STORAGE

  function getActiveEntry(): (WalletEntry & { ownerAddress: string }) | null {
    if (!storage.activeOwner) return null
    const entry = storage.wallets[storage.activeOwner.toLowerCase()]
    if (!entry) return null
    return { ...entry, ownerAddress: storage.activeOwner }
  }

  // Open wallet page when extension icon is clicked
  chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: `${PUPPET_URL}/wallet` })
  })

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
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
      // Get wallet entry for a specific owner address
      case 'PUPPET_GET_WALLET_STATE': {
        const payload = message.payload as { ownerAddress?: string } | undefined
        const ownerAddress = payload?.ownerAddress?.toLowerCase()
        if (!ownerAddress) return null
        const entry = storage.wallets[ownerAddress]
        if (!entry) return null
        return { ...entry, privateKey: undefined }
      }

      // Get the private key for a specific owner (used for session derivation)
      case 'PUPPET_GET_WALLET_KEY': {
        const payload = message.payload as { ownerAddress?: string } | undefined
        const ownerAddress = payload?.ownerAddress?.toLowerCase()
        if (!ownerAddress) return null
        return storage.wallets[ownerAddress]?.privateKey ?? null
      }

      // Set wallet entry for a specific owner (requires all fields)
      case 'PUPPET_SET_WALLET_STATE': {
        const payload = message.payload as { ownerAddress: string } & WalletEntry
        if (!payload.ownerAddress?.startsWith('0x')) throw new Error('Invalid owner address')
        if (!payload.smartWalletAddress?.startsWith('0x')) throw new Error('Invalid smart wallet address')
        if (!payload.subaccountName) throw new Error('Missing subaccount name')
        if (!payload.privateKey?.startsWith('0x')) throw new Error('Invalid private key format')

        const key = payload.ownerAddress.toLowerCase()
        const entry: WalletEntry = {
          smartWalletAddress: payload.smartWalletAddress,
          subaccountName: payload.subaccountName,
          privateKey: payload.privateKey
        }

        storage.wallets[key] = entry
        await chrome.storage.local.set({ storedWallets: storage })

        return { ...entry, privateKey: undefined }
      }

      // Set active wallet (based on website connection)
      case 'PUPPET_SET_ACTIVE_WALLET': {
        const payload = message.payload as { ownerAddress: string | null }
        const prevAddress = getActiveAddress()
        storage.activeOwner = payload.ownerAddress?.toLowerCase() ?? null
        await chrome.storage.local.set({ storedWallets: storage })

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
        return { activeOwner: storage.activeOwner }
      }

      // Clear wallet entry for a specific owner
      case 'PUPPET_CLEAR_WALLET_STATE': {
        const payload = message.payload as { ownerAddress: string }
        if (!payload.ownerAddress?.startsWith('0x')) throw new Error('Invalid owner address')

        const key = payload.ownerAddress.toLowerCase()
        delete storage.wallets[key]
        if (storage.activeOwner === key) storage.activeOwner = null

        await chrome.storage.local.set({ storedWallets: storage })
        return null
      }

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
        return toHex(arbitrum.id)

      case 'wallet_switchEthereumChain':
        return null

      case 'eth_call': {
        const [callParams] = (params || []) as [{ to?: string; data?: string }]
        const { data } = callParams || {}
        const activeEntry = getActiveEntry()

        if (data?.toLowerCase().startsWith(BALANCE_OF_SELECTOR) && activeEntry?.smartWalletAddress) {
          const queriedAddress = `0x${data.slice(34, 74).toLowerCase()}`
          if (queriedAddress === activeEntry.smartWalletAddress.toLowerCase()) {
            const actualBalance = BigInt((await rpcCall('eth_call', params)) as string)
            const matchableAmount = 1000_000000n // STUB: 1000 USDC for testing
            return `0x${(actualBalance + matchableAmount).toString(16).padStart(64, '0')}`
          }
        }
        return rpcCall('eth_call', params)
      }

      case 'eth_sendTransaction': {
        const activeEntry = getActiveEntry()
        if (!activeEntry)
          throw new Error('No active wallet configured. Please set up your session on puppet.tech first.')

        const [txParams] = (params || []) as [TransactionParams]
        if (!txParams?.to) throw new Error('Missing transaction recipient')

        const target = getAddress(txParams.to)
        const calldata = (txParams.data ?? '0x') as Hex

        return handleOrder(target, calldata, activeEntry)
      }

      case 'personal_sign': {
        const activeEntry = getActiveEntry()
        if (!activeEntry?.privateKey) {
          chrome.tabs.create({ url: `${PUPPET_URL}/wallet` })
          throw new Error('Please connect your wallet on Puppet first')
        }
        const [message] = (params || []) as [Hex]
        return signMessage({ privateKey: activeEntry.privateKey as Hex, message: { raw: message } })
      }

      case 'eth_signTypedData_v4': {
        const activeEntry = getActiveEntry()
        if (!activeEntry?.privateKey) {
          chrome.tabs.create({ url: `${PUPPET_URL}/wallet` })
          throw new Error('Please connect your wallet on Puppet first')
        }
        const [, typedDataJson] = (params || []) as [string, string]
        const typedData = JSON.parse(typedDataJson)
        return signTypedData({
          privateKey: activeEntry.privateKey as Hex,
          domain: typedData.domain,
          types: typedData.types,
          primaryType: typedData.primaryType,
          message: typedData.message
        })
      }

      default:
        return rpcCall(method, params)
    }
  }

  async function handleOrder(target: Hex, calldata: Hex, entry: WalletEntry & { ownerAddress: string }): Promise<Hex> {
    const response = await submitToMatchmaker({
      type: 'order',
      target,
      calldata,
      ownerAddress: entry.ownerAddress as Hex,
      smartWalletAddress: entry.smartWalletAddress as Hex,
      subaccountName: entry.subaccountName as Hex,
      privateKey: entry.privateKey as Hex,
      timestamp: Date.now()
    })

    if (!response.success || !response.txHash) {
      throw new Error(response.error || 'Matchmaker failed to execute order')
    }

    return response.txHash
  }

  // Persistent WebSocket connection to matchmaker
  let ws: WebSocket | null = null
  let requestId = 0
  const pendingRequests = new Map<number, { resolve: (r: MatchmakerResponse) => void; reject: (e: Error) => void }>()

  function connectMatchmaker() {
    if (ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING) return

    ws = new WebSocket(MATCHMAKER_WS_URL)

    ws.onopen = () => {
      console.log('[Puppet] Matchmaker connected')
    }

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data as string) as MatchmakerResponse & { id?: number }
        if (data.id !== undefined && pendingRequests.has(data.id)) {
          const { resolve } = pendingRequests.get(data.id)!
          pendingRequests.delete(data.id)
          resolve(data)
        }
      } catch {
        console.error('[Puppet] Invalid matchmaker message')
      }
    }

    ws.onclose = () => {
      console.log('[Puppet] Matchmaker disconnected, reconnecting...')
      setTimeout(connectMatchmaker, 3000)
    }

    ws.onerror = () => {
      ws?.close()
    }
  }

  // Connect on startup
  connectMatchmaker()

  async function submitToMatchmaker(request: OrderRequest): Promise<MatchmakerResponse> {
    return new Promise((resolve, reject) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        reject(new Error('Matchmaker not connected'))
        return
      }

      const id = requestId++
      const timeout = setTimeout(() => {
        pendingRequests.delete(id)
        reject(new Error('Matchmaker timeout'))
      }, 500)

      pendingRequests.set(id, {
        resolve: (r: MatchmakerResponse) => {
          clearTimeout(timeout)
          resolve(r)
        },
        reject: (e: Error) => {
          clearTimeout(timeout)
          reject(e)
        }
      })

      ws.send(JSON.stringify({ ...request, id }))
    })
  }

  function getActiveAddress(): string | null {
    const entry = getActiveEntry()
    return entry?.smartWalletAddress ?? entry?.ownerAddress ?? null
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
})
