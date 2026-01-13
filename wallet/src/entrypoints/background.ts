import type { Address, EIP1193Parameters, WalletRpcSchema } from 'viem'
import { handleWebsiteMessage } from '../lib/messageHandler.js'
import { handleRpcRequest } from '../lib/rpcHandler.js'
import { DEFAULT_STATE, type StoredState, type Subaccount } from '../lib/state.js'

const PUPPET_URL = import.meta.env.VITE_PUPPET_URL ?? 'http://localhost:3000'

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

  async function persistState(): Promise<void> {
    await chrome.storage.local.set({ puppetState: state })
  }

  // Open wallet page when extension icon is clicked
  chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: `${PUPPET_URL}/wallet` })
  })

  // Handle all messages
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const handler = message.type
      ? handleWebsiteMessage(message, { state, getActiveSubaccount, persistState })
      : handleRpcRequest(message as EIP1193Parameters<[...WalletRpcSchema]>, {
          getActiveSubaccount,
          getActiveSubaccountEntry
        })

    handler
      .then(result => {
        sendResponse(message.type ? { success: true, result } : { result })
      })
      .catch(error => {
        console.error('[Puppet] Error:', error.message)
        sendResponse(message.type ? { success: false, error: error.message } : { error: { message: error.message } })
      })

    return true
  })
})
