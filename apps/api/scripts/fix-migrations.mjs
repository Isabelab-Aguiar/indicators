import { Pool } from 'pg'
import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const DB_URL = process.env.DATABASE_URL
if (!DB_URL) throw new Error('DATABASE_URL não definida')

const pool = new Pool({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } })

const MIGRATIONS_DIR = join(__dirname, 'src/database/migrations')

const JOURNAL = JSON.parse(readFileSync(join(MIGRATIONS_DIR, 'meta/_journal.json'), 'utf-8'))

function hashMigration(sql) {
  return createHash('sha256').update(sql).digest('hex')
}

async function run() {
  const { rows: registered } = await pool.query(
    'SELECT hash FROM drizzle.__drizzle_migrations',
  )
  const registeredHashes = new Set(registered.map((r) => r.hash))

  console.log(`Migrations registradas no banco: ${registeredHashes.size}`)

  for (const entry of JOURNAL.entries) {
    const sqlPath = join(MIGRATIONS_DIR, `${entry.tag}.sql`)
    let sql
    try {
      sql = readFileSync(sqlPath, 'utf-8')
    } catch {
      console.log(`Arquivo não encontrado: ${entry.tag}.sql — pulando`)
      continue
    }

    const hash = hashMigration(sql)

    if (registeredHashes.has(hash)) {
      console.log(`✓ Já registrada: ${entry.tag}`)
      continue
    }

    console.log(`→ Inserindo registro para: ${entry.tag}`)
    await pool.query(
      'INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [hash, entry.when],
    )
    console.log(`✓ Registrada: ${entry.tag}`)
  }

  console.log('\nPronto! Rode novamente: pnpm drizzle-kit migrate')
  await pool.end()
}

run().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
