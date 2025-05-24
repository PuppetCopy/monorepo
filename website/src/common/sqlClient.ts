import { createClient } from '@puppet-copy/middleware/sql'

const baseUrl = import.meta.env.VITE__INDEXR_ENDPOINT

if (!baseUrl || typeof baseUrl !== 'string') {
  throw new Error('VITE__INDEXR_ENDPOINT is not defined')
}

export const sqlClient = createClient(baseUrl)

export async function getStatus() {
  const response = await fetch(`${baseUrl}/status`, {
    method: 'POST'
  })

  return response.json()
}
