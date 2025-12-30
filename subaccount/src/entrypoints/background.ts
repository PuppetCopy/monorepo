import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import { GMX_V2_CONTRACT_MAP } from '@puppet/contracts/gmx'
import { CALL_INTENT, type CallIntent } from '@puppet/sdk/matching'
import {
  createPublicClient,
  encodeAbiParameters,
  getAddress,
  type Hex,
  http,
  keccak256,
  parseAbiParameters,
  toHex
} from 'viem'
import { signMessage, signTypedData } from 'viem/accounts'
import { arbitrum } from 'viem/chains'
import { parseCreateOrderParams } from '../lib/gmx.js'
import type { TransactionParams } from '../types.js'

const GMX_EXCHANGE_ROUTER = GMX_V2_CONTRACT_MAP.GmxExchangeRouter.address
const ALLOCATION_ADDRESS = PUPPET_CONTRACT_MAP.Allocation.address
const BALANCE_OF_SELECTOR = '0x70a08231'

const PUPPET_URL = import.meta.env.VITE_PUPPET_URL ?? 'http://localhost:3000'
const RPC_URL = import.meta.env.VITE_RPC_URL ?? arbitrum.rpcUrls.default.http[0]
const MATCHMAKER_WS_URL = import.meta.env.VITE_MATCHMAKER_WS_URL ?? 'ws://localhost:8080'

interface WalletState {
  ownerAddress: string | null
  smartWalletAddress: string | null
  subaccountName: string | null
  privateKey: string | null
}

const DEFAULT_STATE: WalletState = {
  ownerAddress: null,
  smartWalletAddress: null,
  subaccountName: null,
  privateKey: null
}

interface OrderRequest {
  type: 'order'
  intent: CallIntent
  signature: Hex
  target: Hex
  calldata: Hex
}

interface MatchmakerResponse {
  success: boolean
  txHash?: Hex
  error?: string
}

export default defineBackground(async () => {
  const stored = await chrome.storage.local.get(['walletState'])
  let walletState: WalletState = (stored.walletState as WalletState) ?? DEFAULT_STATE

  const publicClient = createPublicClient({ chain: arbitrum, transport: http(RPC_URL) })

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
      case 'PUPPET_GET_WALLET_KEY':
        return walletState.privateKey

      case 'PUPPET_CLEAR_WALLET_STATE':
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
        if (payload.subaccountName !== undefined) {
          walletState.subaccountName = payload.subaccountName
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
        return { walletState: { ...walletState, privateKey: undefined } }
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
        throw new Error('TEST: eth_sendTransaction intercepted')
        if (!walletState.smartWalletAddress) throw new Error('Smart wallet not configured')
        if (!walletState.ownerAddress) throw new Error('Owner address not configured')
        if (!walletState.privateKey) throw new Error('Private key not configured')
        if (!walletState.subaccountName) throw new Error('Subaccount name not configured')

        const [txParams] = (params || []) as [TransactionParams]
        if (!txParams?.to) throw new Error('Missing transaction recipient')

        const target = getAddress(txParams.to)
        const calldata = (txParams.data ?? '0x') as Hex

        if (target === GMX_EXCHANGE_ROUTER) {
          return handleGmxOrder(target, calldata)
        }

        throw new Error('Unsupported venue')
      }

      case 'personal_sign': {
        if (!walletState.privateKey) {
          chrome.tabs.create({ url: `${PUPPET_URL}/wallet` })
          throw new Error('Please connect your wallet on Puppet first')
        }
        const [message] = (params || []) as [Hex]
        return signMessage({ privateKey: walletState.privateKey as Hex, message: { raw: message } })
      }

      case 'eth_signTypedData_v4': {
        if (!walletState.privateKey) {
          chrome.tabs.create({ url: `${PUPPET_URL}/wallet` })
          throw new Error('Please connect your wallet on Puppet first')
        }
        const [, typedDataJson] = (params || []) as [string, string]
        const typedData = JSON.parse(typedDataJson)
        return signTypedData({
          privateKey: walletState.privateKey as Hex,
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

  async function handleGmxOrder(target: Hex, calldata: Hex): Promise<Hex> {
    // Parse CreateOrderParams from calldata to extract token and amount
    const { token, amount } = parseCreateOrderParams(calldata)

    // Get nonce from Allocation contract
    const matchingKey = getMatchingKey(token, walletState.smartWalletAddress as Hex, walletState.subaccountName as Hex)
    const nonce = await getNonce(matchingKey)

    // Build CallIntent
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 300) // 5 minutes
    const intent: CallIntent = {
      account: walletState.ownerAddress as Hex,
      subaccount: walletState.smartWalletAddress as Hex,
      subaccountName: walletState.subaccountName as Hex,
      token,
      amount,
      deadline,
      nonce
    }

    const signature = await signTypedData({
      ...CALL_INTENT,
      privateKey: walletState.privateKey as Hex,
      message: intent
    })

    const response = await submitToMatchmaker({
      type: 'order',
      intent,
      signature,
      target,
      calldata
    })

    if (!response.success || !response.txHash) {
      throw new Error(response.error || 'Matchmaker failed to execute order')
    }

    return response.txHash
  }

  function getMatchingKey(token: Hex, subaccount: Hex, name: Hex): Hex {
    return keccak256(encodeAbiParameters(parseAbiParameters('address, address, bytes32'), [token, subaccount, name]))
  }

  async function getNonce(matchingKey: Hex): Promise<bigint> {
    const result = await publicClient.readContract({
      address: ALLOCATION_ADDRESS,
      abi: [
        {
          name: 'nonceMap',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: 'matchingKey', type: 'bytes32' }],
          outputs: [{ name: '', type: 'uint256' }]
        }
      ],
      functionName: 'nonceMap',
      args: [matchingKey]
    })
    return result as bigint
  }

  async function submitToMatchmaker(request: OrderRequest): Promise<MatchmakerResponse> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(MATCHMAKER_WS_URL)
      const timeout = setTimeout(() => {
        ws.close()
        reject(new Error('Matchmaker timeout'))
      }, 30000)

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            ...request,
            intent: {
              ...request.intent,
              amount: request.intent.amount.toString(),
              deadline: request.intent.deadline.toString(),
              nonce: request.intent.nonce.toString()
            }
          })
        )
      }

      ws.onmessage = event => {
        clearTimeout(timeout)
        ws.close()
        try {
          const response = JSON.parse(event.data as string) as MatchmakerResponse
          resolve(response)
        } catch {
          reject(new Error('Invalid matchmaker response'))
        }
      }

      ws.onerror = () => {
        clearTimeout(timeout)
        reject(new Error('Matchmaker connection failed'))
      }
    })
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
})
