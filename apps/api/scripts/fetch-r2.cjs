/* eslint-disable */
const { writeFileSync } = require('node:fs')
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')

async function main() {
  const key = process.argv[2]
  const out = process.argv[3]
  if (!key || !out) {
    console.error('Uso: node scripts/fetch-r2.cjs <storage_key> <output_path>')
    process.exit(1)
  }

  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucket = process.env.R2_BUCKET

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    console.error('R2_ACCOUNT_ID/R2_ACCESS_KEY_ID/R2_SECRET_ACCESS_KEY/R2_BUCKET obrigatórios')
    process.exit(1)
  }

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })

  const res = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
  if (!res.Body) throw new Error(`Body vazio para ${key}`)
  const chunks = []
  for await (const c of res.Body) chunks.push(c)
  const buffer = Buffer.concat(chunks)
  writeFileSync(out, buffer)
  console.log(`Salvo em ${out} (${buffer.length} bytes)`)
}

void main().catch((err) => {
  console.error('Falha ao baixar:', err.message || err)
  process.exitCode = 1
})
