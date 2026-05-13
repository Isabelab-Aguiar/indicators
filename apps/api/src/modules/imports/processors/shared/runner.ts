import type { Logger } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { imports } from '../../../../database/schema'
import type * as schema from '../../../../database/schema'
import type { ParsedRecord } from './parsed-record'
import { upsertPregnantWoman } from './upsert'

type Database = NodePgDatabase<typeof schema>

interface RunImportArgs {
  db: Database
  importId: string
  esfId: string
  userId: string
  logger: Logger
  extract: () => Promise<ParsedRecord[]>
}

const MAX_ERROR_SAMPLES = 5

export async function runImport(args: RunImportArgs): Promise<void> {
  const { db, importId, esfId, userId, logger, extract } = args

  await db.update(imports).set({ status: 'processing' }).where(eq(imports.id, importId))

  try {
    const records = await extract()

    let processed = 0
    let failed = 0
    const samples: string[] = []

    for (const [index, record] of records.entries()) {
      try {
        await upsertPregnantWoman(db, record, esfId, userId)
        processed++
      } catch (err) {
        failed++
        const message = err instanceof Error ? err.message : String(err)
        if (samples.length < MAX_ERROR_SAMPLES) {
          samples.push(`Registro ${index + 1} (${record.cpf || 'sem CPF'}): ${message}`)
        }
        logger.warn(`Record ${index + 1} failed: ${message}`)
      }
    }

    const status = failed === 0 ? 'completed' : processed > 0 ? 'partial' : 'failed'
    const errorMessage = samples.length > 0 ? samples.join('\n') : null

    await db
      .update(imports)
      .set({
        status,
        totalRecords: records.length,
        processedRecords: processed,
        failedRecords: failed,
        errorMessage,
        updatedAt: new Date(),
      })
      .where(eq(imports.id, importId))
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    logger.error(`Import ${importId} failed: ${message}`)
    await db
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
