import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Inject, Logger } from '@nestjs/common'
import type { Job } from 'bullmq'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../../database/database.module'
import type * as schema from '../../../database/schema'
import { StorageService } from '../../storage/storage.service'
import { extractCsvRecords } from './csv-extractor'
import { extractPdfRecords } from './pdf-extractor'
import { runImport } from './shared/runner'
import { QUEUE_NAMES } from '@repo/config'

type Database = NodePgDatabase<typeof schema>

interface JobData {
  importId: string
  storageKey: string
  esfId: string
  userId: string
}

@Processor(QUEUE_NAMES.IMPORT)
export class ImportProcessor extends WorkerHost {
  private readonly logger = new Logger(ImportProcessor.name)

  constructor(
    @Inject(DATABASE_TOKEN) private readonly db: Database,
    private readonly storage: StorageService,
  ) {
    super()
  }

  async process(job: Job<JobData>): Promise<void> {
    const extract = this.extractorFor(job.name)
    if (!extract) {
      this.logger.warn(`Unknown job name: ${job.name}`)
      return
    }

    await runImport({
      db: this.db,
      importId: job.data.importId,
      esfId: job.data.esfId,
      userId: job.data.userId,
      logger: this.logger,
      extract: async () => {
        const buffer = await this.storage.getBuffer(job.data.storageKey)
        return extract(buffer)
      },
    })
  }

  private extractorFor(jobName: string) {
    if (jobName === 'process-csv') return extractCsvRecords
    if (jobName === 'process-pdf') return extractPdfRecords
    return null
  }
}
