import { createClient, getStatus as getSqlStatus } from '@puppet-copy/sql/client'

const baseUrl = import.meta.env.VITE__INDEXR_ENDPOINT

if (!baseUrl || typeof baseUrl !== 'string') {
  throw new Error('VITE__INDEXR_ENDPOINT is not defined')
}

export const sqlClient = createClient(baseUrl)

export async function getStatus() {
  return getSqlStatus(baseUrl)
}
