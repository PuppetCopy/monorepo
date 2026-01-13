import type { Address } from 'viem'
import { MessageType, type WalletState } from './types.js'

// Re-export types
export { MessageType, type WalletState } from './types.js'

if (typeof window === 'undefined') {
  throw new Error('@puppet/wallet/client requires a browser environment')
}

// Extension communication helpers
let extensionRequestId = 0
const pendingExtensionRequests = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>()

// Listen for extension responses
window.addEventListener('message', event => {
  if (event.source !== window || event.data?.target !== 'puppet-website') return

  const { id, response } = event.data
  if (id !== undefined && pendingExtensionRequests.has(id)) {
    const { resolve, reject } = pendingExtensionRequests.get(id)!
    pendingExtensionRequests.delete(id)
    if (response?.success === false) {
      reject(new Error(response.error || 'Extension request failed'))
    } else {
      resolve(response?.result)
    }
  }
})

export async function sendExtensionMessage<T = unknown>(type: string, payload?: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = extensionRequestId++
    const timeout = setTimeout(() => {
      pendingExtensionRequests.delete(id)
      reject(new Error('Extension request timeout'))
    }, 50)

    pendingExtensionRequests.set(id, {
      resolve: (v: unknown) => {
        clearTimeout(timeout)
        resolve(v as T)
      },
      reject: (e: Error) => {
        clearTimeout(timeout)
        reject(e)
      }
    })

    window.postMessage({ target: 'puppet-extension', id, type, payload }, '*')
  })
}

// Get stored wallet state for a specific owner address (includes privateKey)
export async function getExtensionWalletState(ownerAddress: Address): Promise<WalletState | null> {
  return sendExtensionMessage(MessageType.GET_WALLET_STATE, { ownerAddress })
}

// Set wallet state for a specific owner address (requires all fields)
export async function setExtensionWalletState(ownerAddress: Address, data: WalletState): Promise<void> {
  await sendExtensionMessage(MessageType.SET_WALLET_STATE, { ownerAddress, ...data })
}

// Set the active wallet in the extension (synced with website connection)
export async function setActiveWallet(ownerAddress: Address | null): Promise<void> {
  try {
    await sendExtensionMessage(MessageType.SET_ACTIVE_WALLET, { ownerAddress })
  } catch {
    // Extension not installed, ignore
  }
}

// Clear wallet state for a specific owner
export async function clearExtensionWalletState(ownerAddress: Address): Promise<void> {
  await sendExtensionMessage(MessageType.CLEAR_WALLET_STATE, { ownerAddress })
}

// Clear all extension storage (full reset)
export async function clearAllExtensionStorage(): Promise<void> {
  await sendExtensionMessage(MessageType.CLEAR_ALL)
}
