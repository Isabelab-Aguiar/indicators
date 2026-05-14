/* eslint-disable */
const { readFileSync, existsSync } = require('node:fs')
const { resolve } = require('node:path')
const { Pool } = require('pg')

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env')
  if (!existsSync(envPath)) return
  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (!match) continue
    const key = match[1]
    let value = match[2]
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
    if (!process.env[key]) process.env[key] = value
  }
}

async function main() {
  const file = process.argv[2]
  if (!file) {
    console.error('Uso: node scripts/apply-migration.cjs <arquivo.sql>')
    process.exit(1)
  }

  loadEnvFile()

  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('DATABASE_URL ausente no ambiente')
    process.exit(1)
  }

  const path = resolve(process.cwd(), file)
  const sql = readFileSync(path, 'utf8')

  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('COMMIT')
    console.log(`Migration aplicada: ${path}`)
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Falha ao aplicar migration:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

void main()
