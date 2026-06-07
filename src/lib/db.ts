import { createClient, type Client } from '@libsql/client'

const globalForDb = globalThis as unknown as {
  tursoClient: Client | undefined
}

function createDbClient(): Client {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (url && authToken) {
    return createClient({ url, authToken })
  }

  // Fallback to local SQLite for development
  return createClient({ url: process.env.DATABASE_URL || 'file:./db/custom.db' })
}

export const db = globalForDb.tursoClient ?? createDbClient()

if (process.env.NODE_ENV !== 'production') globalForDb.tursoClient = db
