import { createClient } from '@puppet/sql/client'

// Always use the API proxy endpoint
const baseUrl = '/api/sql'

export const sqlClient = createClient(baseUrl)

export interface IndexerStatus {
  arbitrum: {
    id: number
    block: {
      number: number
      timestamp: number
    } | null
  }
}

export async function getStatus(): Promise<IndexerStatus> {
  const response = await fetch('/api/status')
  return response.json()
}
