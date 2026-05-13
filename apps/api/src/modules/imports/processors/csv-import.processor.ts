import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Inject, Logger } from '@nestjs/common'
import type { Job } from 'bullmq'
import { parse } from 'csv-parse/sync'
import { eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../../database/database.module'
import { imports, pregnantWomen } from '../../../database/schema'
import type * as schema from '../../../database/schema'
import { QUEUE_NAMES } from '@repo/config'

type Database = NodePgDatabase<typeof schema>

interface CsvJobData {
  importId: string
  fileBuffer: string
  esfId: string
  userId: string
}

const CPF_FIELDS = ['cpf', 'cpf do cidadao', 'cpf cidadao'] as const
const NAME_FIELDS = ['nome', 'name', 'cidadao', 'nome do cidadao', 'nome completo'] as const
const BIRTH_FIELDS = ['data nascimento', 'birth date', 'data de nascimento', 'nascimento'] as const
const ADDRESS_FIELDS = ['endereco', 'address', 'endereco completo', 'logradouro'] as const
const PHONE_FIELDS = ['telefone', 'phone', 'telefones', 'celular', 'telefone(s)'] as const
const MICROAREA_FIELDS = ['microarea', 'micro area'] as const

function normalize(key: string): string {
  return key
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[_\-.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function pickField(row: Record<string, string>, candidates: readonly string[]): string {
  const normalized: Record<string, string> = {}
  for (const k of Object.keys(row)) normalized[normalize(k)] = row[k] ?? ''
  for (const c of candidates) {
    const value = normalized[normalize(c)]
    if (value !== undefined && value !== '') return value
  }
  return ''
}

function parseBirthDate(value: string): Date {
  const trimmed = value.trim()
  if (!trimmed) throw new Error('Data de nascimento obrigatória')
  const brMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (brMatch) return new Date(`${brMatch[3]}-${brMatch[2]}-${brMatch[1]}T00:00:00Z`)
  const date = new Date(trimmed)
  if (isNaN(date.getTime())) throw new Error(`Data inválida: "${value}"`)
  return date
}

function detectDelimiter(buffer: Buffer): ',' | ';' {
  const firstLine = buffer.toString('utf8', 0, 4096).split(/\r?\n/)[0] ?? ''
  const commas = (firstLine.match(/,/g) ?? []).length
  const semicolons = (firstLine.match(/;/g) ?? []).length
  return semicolons > commas ? ';' : ','
}

@Processor(QUEUE_NAMES.IMPORT)
export class CsvImportProcessor extends WorkerHost {
  private readonly logger = new Logger(CsvImportProcessor.name)

  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {
    super()
  }

  async process(job: Job<CsvJobData>): Promise<void> {
    if (job.name !== 'process-csv') return

    const { importId, fileBuffer, esfId, userId } = job.data

    await this.db.update(imports).set({ status: 'processing' }).where(eq(imports.id, importId))

    try {
      const buffer = Buffer.from(fileBuffer, 'base64')
      const delimiter = detectDelimiter(buffer)
      const rows = parse(buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true,
        delimiter,
        relax_column_count: true,
        relax_quotes: true,
      }) as Record<string, string>[]

      let processed = 0
      let failed = 0
      const rowErrors: string[] = []

      for (const [index, row] of rows.entries()) {
        try {
          await this.upsertRow(row, esfId, userId)
          processed++
        } catch (err) {
          failed++
          const message = err instanceof Error ? err.message : String(err)
          if (rowErrors.length < 5) rowErrors.push(`Linha ${index + 2}: ${message}`)
          this.logger.warn(`Row ${index + 2} failed: ${message}`)
        }
      }

      const status = failed === 0 ? 'completed' : processed > 0 ? 'partial' : 'failed'
      const errorMessage = rowErrors.length > 0 ? rowErrors.join('\n') : null

      await this.db
        .update(imports)
        .set({
          status,
          totalRecords: rows.length,
          processedRecords: processed,
          failedRecords: failed,
          errorMessage,
          updatedAt: new Date(),
        })
        .where(eq(imports.id, importId))
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      this.logger.error(`Import ${importId} failed: ${message}`)
      await this.db
        .update(imports)
        .set({
          status: 'failed',
          errorMessage: message.slice(0, 1000),
          updatedAt: new Date(),
        })
        .where(eq(imports.id, importId))
      throw err
    }
  }

  private async upsertRow(row: Record<string, string>, esfId: string, userId: string) {
    const cpf = pickField(row, CPF_FIELDS)
    if (!cpf) throw new Error('CPF não encontrado nas colunas do CSV')

    const data = {
      esfId,
      cpf,
      name: pickField(row, NAME_FIELDS),
      birthDate: parseBirthDate(pickField(row, BIRTH_FIELDS)),
      address: pickField(row, ADDRESS_FIELDS),
      phone: pickField(row, PHONE_FIELDS),
      microarea: pickField(row, MICROAREA_FIELDS) || 'Não informada',
      updatedBy: userId,
      updatedAt: new Date(),
    }

    const existing = await this.db.query.pregnantWomen.findFirst({
      where: (t, { and, eq }) => and(eq(t.cpf, cpf), eq(t.esfId, esfId)),
    })

    if (existing) {
      await this.db.update(pregnantWomen).set(data).where(eq(pregnantWomen.id, existing.id))
    } else {
      await this.db.insert(pregnantWomen).values(data)
    }
  }
}
