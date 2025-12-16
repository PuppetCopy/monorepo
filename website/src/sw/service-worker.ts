import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare const self: ServiceWorkerGlobalScope & typeof globalThis

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

let allowlist: RegExp[] | undefined
// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV) allowlist = [/^\/$/]

// to allow work offline - exclude /assets/ from SPA fallback
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('index.html'), {
    allowlist,
    denylist: [/^\/assets\//]
  })
)

// Cache /api/ GET requests - add &refresh=true to force fresh fetch
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  if (!url.pathname.startsWith('/api/')) return

  // Do not cache POST requests (they are typically state-changing)
  if (event.request.method !== 'GET') return

  // Do not cache orchestrator stateful endpoints (write operations)
  const noCachePaths = ['/api/indexer/status', '/api/indexer/sql/db']
  const isNoCache = noCachePaths.some(path => url.pathname.startsWith(path))
  if (isNoCache) return

  const forceRefresh = url.searchParams.get('refresh') === 'true'
  url.searchParams.delete('refresh')

  event.respondWith(
    (async () => {
      const cache = await caches.open('api-cache')
      const cacheKey = new Request(url.href)

      if (!forceRefresh) {
        const cached = await cache.match(cacheKey)
        if (cached) return cached
      }

      const response = await fetch(event.request)

      // Only cache successful responses (200-299 status codes)
      if (response.ok) {
        // For JSON-RPC responses, check for actual errors before caching
        if (response.headers.get('content-type')?.includes('application/json')) {
          // Clone the response for inspection and for caching
          const inspectionClone = response.clone()
          const cacheClone = response.clone()

          try {
            const json = await inspectionClone.json()
            // Only skip caching if there's an explicit error
            // Don't cache JSON-RPC errors or contract execution failures
            const hasRpcError = json.error !== undefined && json.error !== null
            const hasRevertError =
              json.result &&
              typeof json.result === 'object' &&
              'error' in json.result &&
              json.result.error !== undefined &&
              json.result.error !== null

            if (!hasRpcError && !hasRevertError) {
              cache.put(cacheKey, cacheClone)
            }
          } catch {
            // If we can't parse JSON, cache anyway (not an RPC response)
            cache.put(cacheKey, cacheClone)
          }
        } else {
          cache.put(cacheKey, response.clone())
        }
      }

      return response
    })()
  )
})

// Clear api-cache on new service worker activation
self.addEventListener('activate', async () => {
  await caches.delete('api-cache')
})

// Auto update: activate immediately and take control of existing clients
clientsClaim()

// Let the client decide when to promote a waiting SW (via registerSW.reloadCb)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
