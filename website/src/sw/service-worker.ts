/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

// Define the caching strategy
// const immutableApiCacheStrategy = new CacheFirst({
//   cacheName: 'api-immutable-cache', // Use one cache for both GET/POST or separate if needed
//   plugins: [
//     new ExpirationPlugin({
//       maxAgeSeconds: 365 * 24 * 60 * 60
//     }),
//   ],
// });

// // Cache POST API requests for immutable data
// // Note: Caching POST requests assumes the combination of URL and request body
// // results in an immutable response for your specific use case.
// registerRoute(
//   ({ url }) => url.pathname.startsWith('/sql/'), // Match requests starting with /sql/
//   immutableApiCacheStrategy, // Use the same strategy
//   'GET'
// );

// to allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))

self.skipWaiting()
clientsClaim()
