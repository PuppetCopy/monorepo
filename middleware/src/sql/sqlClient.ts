import type { QueryWithTypings } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/pg-proxy/driver'
import type { ReadonlyDrizzle } from 'ponder'
import superjson from 'superjson'
import * as schema from './__generated__/ponder.schema.js'

export type ISqlClient = ReadonlyDrizzle<typeof schema>

export const createClient = (baseUrl: string): ISqlClient =>
  drizzle(
    async (sql, params, _, typings) => {
      const response = await fetch(getUrl(baseUrl, 'db', { sql, params, typings }))

      if (response.ok === false) {
        const error = new Error(await response.text())
        error.stack = undefined
        throw error
      }

      const result = await response.json()

      return {
        ...result,
        rows: result.rows.map((row: object) => Object.values(row))
      }
    },
    { schema, casing: 'snake_case' }
  ) as any

export async function getStatus(baseUrl: string) {
  const response = await fetch(getUrl(baseUrl, 'status'), {
    method: 'POST'
  })

  return response.json()
}

function getUrl(baseUrl: string, method: 'live' | 'db' | 'status', query?: QueryWithTypings) {
  const url = new URL(baseUrl)
  url.pathname = `${url.pathname}/${method}`
  if (query) {
    url.searchParams.set('sql', superjson.stringify(query))
  }
  return url
}
