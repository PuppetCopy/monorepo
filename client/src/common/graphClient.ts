import { createClient, fetchExchange } from "@urql/core"
import { cacheExchange } from '@urql/exchange-graphcache'
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage'


const storage = makeDefaultStorage({
  idbName: 'graphcache-v3', // The name of the IndexedDB database
  maxAge: 7, // The maximum age of the persisted data in days
})


const cache = cacheExchange({
  storage,
})


export const subgraphClient = createClient({
  url: 'http://localhost:8080/v1/graphql',
  exchanges: [cache, fetchExchange],
  fetchSubscriptions: true,
  requestPolicy: 'cache-and-network',
})


