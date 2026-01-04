import { PROVIDER_INFO } from '../lib/provider.js'
import type { EIP1193Provider, EIP6963AnnounceProviderEvent } from '../types.js'

export default defineUnlistedScript(() => {
  let requestId = 0
  const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>()
  const listeners = new Map<string, Set<(...args: unknown[]) => void>>()

  window.addEventListener('message', event => {
    if (event.source !== window || event.data?.target !== 'puppet-inpage') return

    const { id, response, payload } = event.data

    if (id !== undefined && pending.has(id)) {
      const { resolve, reject } = pending.get(id)!
      pending.delete(id)
      response?.error ? reject(new Error(response.error.message)) : resolve(response?.result)
    }

    if (payload?.type === 'event') {
      listeners.get(payload.event)?.forEach(fn => {
        fn(...payload.args)
      })
    }
  })

  const provider: EIP1193Provider = {
    request({ method, params }) {
      return new Promise((resolve, reject) => {
        const id = requestId++
        pending.set(id, { resolve, reject })
        window.postMessage({ target: 'puppet-content', id, payload: { method, params } }, '*')
      })
    },
    on(event, listener) {
      if (!listeners.has(event)) listeners.set(event, new Set())
      listeners.get(event)!.add(listener)
    },
    removeListener(event, listener) {
      listeners.get(event)?.delete(listener)
    }
  }

  const announce = () => {
    window.dispatchEvent(
      new CustomEvent('eip6963:announceProvider', {
        detail: Object.freeze({ info: PROVIDER_INFO, provider })
      }) as EIP6963AnnounceProviderEvent
    )
  }

  window.addEventListener('eip6963:requestProvider', announce)
  announce()
})
