import { createClient, type Client } from '@libsql/client'

const globalForDb = globalThis as unknown as {
  tursoClient: Client | undefined
}

function createDbClient(): Client {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (url && authToken) {
    console.log('[DB] Connecting to Turso cloud database:', url)
    return createClient({ url, authToken })
  }

  // Fallback to local SQLite for development
  const localUrl = process.env.DATABASE_URL || 'file:./db/custom.db'
  console.log('[DB] Connecting to local SQLite:', localUrl)
  return createClient({ url: localUrl })
}

export const db = globalForDb.tursoClient ?? createDbClient()

if (process.env.NODE_ENV !== 'production') globalForDb.tursoClient = db
