import { createClient, getStatus as getSqlStatus } from '@puppet/database/client'

const baseUrl = '/api/indexer'

export const sqlClient = createClient(baseUrl)

export async function getStatus() {
  return getSqlStatus(baseUrl)
}
