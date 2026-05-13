import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import type { Queue } from 'bullmq'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import { imports } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { QUEUE_NAMES } from '@repo/config'

type Database = NodePgDatabase<typeof schema>

@Injectable()
export class ImportsService {
  constructor(
    @Inject(DATABASE_TOKEN) private readonly db: Database,
    @InjectQueue(QUEUE_NAMES.IMPORT) private readonly importQueue: Queue,
  ) {}

  async queueCsvImport(file: Express.Multer.File, tenant: TenantContextPayload) {
    const [record] = await this.db
      .insert(imports)
      .values({
        esfId: tenant.esfId,
        type: 'csv',
        fileName: file.originalname,
        status: 'pending',
        userId: tenant.userId,
      })
      .returning()

    await this.importQueue.add('process-csv', {
      importId: record.id,
      fileBuffer: file.buffer.toString('base64'),
      esfId: tenant.esfId,
      userId: tenant.userId,
    })

    return { importId: record.id, status: 'pending' }
  }

  async queuePdfImport(file: Express.Multer.File, tenant: TenantContextPayload) {
    const [record] = await this.db
      .insert(imports)
      .values({
        esfId: tenant.esfId,
        type: 'pdf',
        fileName: file.originalname,
        status: 'pending',
        userId: tenant.userId,
      })
      .returning()

    await this.importQueue.add('process-pdf', {
      importId: record.id,
      fileBuffer: file.buffer.toString('base64'),
      esfId: tenant.esfId,
      userId: tenant.userId,
    })

    return { importId: record.id, status: 'pending' }
  }

  async findAll(tenant: TenantContextPayload) {
    return this.db.query.imports.findMany({
      where: eq(imports.esfId, tenant.esfId),
      orderBy: (t, { desc }) => [desc(t.createdAt)],
    })
  }

  async findById(id: string, tenant: TenantContextPayload) {
    const record = await this.db.query.imports.findFirst({
      where: and(eq(imports.id, id), eq(imports.esfId, tenant.esfId)),
    })

    if (!record) throw new NotFoundException('Importação não encontrada')
    return record
  }
}
