import knex, { type Knex } from 'knex'

const DATABASE_URL = process.env.DATABASE_URL || ''
const DATABASE_PATH = process.env.DATABASE_PATH || './data/config.sqlite'

let db: Knex | null = null

export function getDb(): Knex {
  if (!db) {
    if (DATABASE_URL) {
      db = knex({
        client: 'pg',
        connection: DATABASE_URL,
        pool: { min: 2, max: 10 },
        acquireConnectionTimeout: 10000,
      })
    } else {
      const { existsSync, mkdirSync } = require('fs')
      const path = require('path')
      const dir = path.dirname(DATABASE_PATH)
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

      db = knex({
        client: 'better-sqlite3',
        connection: { filename: DATABASE_PATH },
        useNullAsDefault: true,
        pool: { min: 0, max: 10 },
      })

      db.raw('PRAGMA foreign_keys = ON').catch(console.error)
    }
  }
  return db
}

export function getConfigDB(): Knex {
  return getDb()
}

export async function closeDb(): Promise<void> {
  if (db) {
    await db.destroy()
    db = null
  }
}

export function isPostgres(): boolean {
  return !!DATABASE_URL
}
