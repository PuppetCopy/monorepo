import { createClient, getStatus as getSqlStatus } from '@puppet-copy/sql/client'

// Always use the API proxy endpoint
const baseUrl = '/api/sql'

export const sqlClient = createClient(baseUrl)

export async function getStatus() {
  return getSqlStatus(baseUrl)
}
