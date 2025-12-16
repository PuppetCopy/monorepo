import { createClient, getStatus as getSqlStatus } from '@puppet/database/client'

// Indexer API (proxy strips /api/indexer prefix)
export const sqlClient = createClient('/api/indexer/sql')

export async function getStatus() {
  return getSqlStatus('/api/indexer')
}
