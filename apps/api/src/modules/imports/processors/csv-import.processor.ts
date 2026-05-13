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

    const buffer = Buffer.from(fileBuffer, 'base64')
    const rows = parse(buffer, { columns: true, skip_empty_lines: true, trim: true }) as Record<
      string,
      string
    >[]

    let processed = 0
    let failed = 0

    for (const row of rows) {
      try {
        await this.upsertRow(row, esfId, userId)
        processed++
      } catch (err) {
        failed++
        this.logger.warn(`Row failed: ${String(err)}`)
      }
    }

    const status = failed === 0 ? 'completed' : processed > 0 ? 'partial' : 'failed'

    await this.db
      .update(imports)
      .set({
        status,
        totalRecords: rows.length,
        processedRecords: processed,
        failedRecords: failed,
        updatedAt: new Date(),
      })
      .where(eq(imports.id, importId))
  }

  private async upsertRow(row: Record<string, string>, esfId: string, userId: string) {
    const cpf = row['cpf'] ?? ''
    if (!cpf) throw new Error('CPF obrigatório')

    const existing = await this.db.query.pregnantWomen.findFirst({
      where: (t, { and, eq }) => and(eq(t.cpf, cpf), eq(t.esfId, esfId)),
    })

    const data = {
      esfId,
      cpf,
      name: row['nome'] ?? row['name'] ?? '',
      birthDate: new Date(row['data_nascimento'] ?? row['birth_date'] ?? ''),
      address: row['endereco'] ?? row['address'] ?? '',
      phone: row['telefone'] ?? row['phone'] ?? '',
      microarea: row['microarea'] ?? '',
      updatedBy: userId,
      updatedAt: new Date(),
    }

    if (existing) {
      await this.db.update(pregnantWomen).set(data).where(eq(pregnantWomen.id, existing.id))
    } else {
      await this.db.insert(pregnantWomen).values(data)
    }
  }
}
