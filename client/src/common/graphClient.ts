import { Client, cacheExchange, fetchExchange } from '@urql/core';

export const subgraphClient = new Client({
  url: import.meta.env.VITE_INDEXR_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange]
})
