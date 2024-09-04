import { Client, cacheExchange, fetchExchange } from '@urql/core';

const url = import.meta.env.DEV ? 'http://localhost:8080/v1/graphql' : import.meta.env.VITE_INDEXR_ENDPOINT

export const subgraphClient = new Client({
  url: url,
  exchanges: [cacheExchange, fetchExchange]
})


