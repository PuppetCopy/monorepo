import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

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

// Cache portfolio responses for 10 minutes to reduce orchestrator load
registerRoute(
  ({ url, request }) =>
    request.method === 'GET' &&
    url.pathname.startsWith('/api/orchestrator/accounts/') &&
    url.pathname.endsWith('/portfolio'),
  new StaleWhileRevalidate({
    cacheName: 'portfolio-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 10,
        purgeOnQuotaError: true
      })
    ]
  })
)

// Auto update: activate immediately and take control of existing clients
clientsClaim()

// Let the client decide when to promote a waiting SW (via registerSW.reloadCb)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
