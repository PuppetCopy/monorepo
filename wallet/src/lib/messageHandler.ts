import type { Address, Hex } from 'viem'
import { getAddress } from 'viem'
import { MessageType } from '../client/types.js'
import type { StoredState } from './state.js'

const PUPPET_URL = import.meta.env.VITE_PUPPET_URL ?? 'http://localhost:3000'

export interface MessageHandlerDeps {
  state: StoredState
  getActiveSubaccount: () => Address | null
  persistState: () => Promise<void>
}

export async function handleWebsiteMessage(
  message: { type: string; payload?: unknown },
  deps: MessageHandlerDeps
): Promise<unknown> {
  const { state, getActiveSubaccount, persistState } = deps

  switch (message.type) {
    case MessageType.GET_WALLET_STATE: {
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

    case MessageType.SET_WALLET_STATE: {
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
      await persistState()
      return { subaccount }
    }

    case MessageType.SET_ACTIVE_WALLET: {
      const payload = message.payload as { ownerAddress: string | null }
      const prevSubaccount = getActiveSubaccount()
      state.activeAccount = payload.ownerAddress ? getAddress(payload.ownerAddress) : null
      await persistState()

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

    case MessageType.CLEAR_WALLET_STATE: {
      const payload = message.payload as { ownerAddress: string }
      const account = getAddress(payload.ownerAddress)

      delete state.subaccountMap[account]
      if (state.activeAccount === account) state.activeAccount = null
      await persistState()
      return null
    }

    case MessageType.CLEAR_ALL: {
      state.subaccountMap = {}
      state.activeAccount = null
      await chrome.storage.local.clear()
      return null
    }

    default:
      throw new Error(`Unknown message type: ${message.type}`)
  }
}
