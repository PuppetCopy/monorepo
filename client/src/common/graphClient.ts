import { Client, cacheExchange, fetchExchange } from '@urql/core';




export const subgraphClient = new Client({
  url: 'http://localhost:8080/v1/graphql',
  exchanges: [cacheExchange, fetchExchange]
})


