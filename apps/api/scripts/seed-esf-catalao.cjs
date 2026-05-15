/* eslint-disable */
const { readFileSync, existsSync } = require('node:fs')
const { resolve } = require('node:path')
const { Pool } = require('pg')
const argon2 = require('argon2')

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
  loadEnvFile()

  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('DATABASE_URL ausente no ambiente')
    process.exit(1)
  }

  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } })
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const esfResult = await client.query(
      `INSERT INTO esfs (name, code)
       VALUES ($1, $2)
       ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      ['ESF CATALAO', '0002243911'],
    )
    const esfId = esfResult.rows[0].id
    console.log(`ESF CATALAO inserida — id: ${esfId}`)

    const passwordHash = await argon2.hash('123456')

    await client.query(
      `INSERT INTO profiles (name, cpf, password_hash, role, status, team, esf_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (cpf) DO UPDATE
         SET name = EXCLUDED.name,
             password_hash = EXCLUDED.password_hash,
             role = EXCLUDED.role,
             status = EXCLUDED.status,
             team = EXCLUDED.team,
             esf_id = EXCLUDED.esf_id`,
      [
        'Gabriella Estefania Fernandes Soares',
        '05189472620',
        passwordHash,
        'nurse',
        'active',
        'INE 0002243911 | CBO 223565',
        esfId,
      ],
    )
    console.log('Profissional Gabriella cadastrada com CPF 051.894.726-20')

    await client.query('COMMIT')
    console.log('Seed concluído com sucesso.')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Falha no seed:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

void main()
