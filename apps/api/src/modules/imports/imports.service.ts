import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import type { Queue } from 'bullmq'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import { imports } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { StorageService } from '../storage/storage.service'
import { QUEUE_NAMES } from '@repo/config'

type Database = NodePgDatabase<typeof schema>
type ImportType = 'csv' | 'pdf'

const JOB_NAMES = { csv: 'process-csv', pdf: 'process-pdf' } as const

@Injectable()
export class ImportsService {
  constructor(
    @Inject(DATABASE_TOKEN) private readonly db: Database,
    @InjectQueue(QUEUE_NAMES.IMPORT) private readonly importQueue: Queue,
    private readonly storage: StorageService,
  ) {}

  queueCsvImport(file: Express.Multer.File, tenant: TenantContextPayload) {
    return this.queueImport('csv', file, tenant)
  }

  queuePdfImport(file: Express.Multer.File, tenant: TenantContextPayload) {
    return this.queueImport('pdf', file, tenant)
  }

  private async queueImport(
    type: ImportType,
    file: Express.Multer.File,
    tenant: TenantContextPayload,
  ) {
    const [record] = await this.db
      .insert(imports)
      .values({
        esfId: tenant.esfId,
        type,
        fileName: file.originalname,
        status: 'pending',
        userId: tenant.userId,
      })
      .returning()

    const storageKey = `imports/${tenant.esfId}/${record.id}.${type}`

    try {
      await this.storage.put(storageKey, file.buffer, file.mimetype)

      await this.db
        .update(imports)
        .set({ storageKey, updatedAt: new Date() })
        .where(eq(imports.id, record.id))

      await this.importQueue.add(JOB_NAMES[type], {
        importId: record.id,
        storageKey,
        esfId: tenant.esfId,
        userId: tenant.userId,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      await this.db
        .update(imports)
        .set({ status: 'failed', errorMessage: message.slice(0, 1000), updatedAt: new Date() })
        .where(eq(imports.id, record.id))
      throw err instanceof Error && 'getStatus' in err
        ? err
        : new InternalServerErrorException(`Falha ao enfileirar importão: ${message}`)
    }

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

  async remove(id: string, tenant: TenantContextPayload) {
    const record = await this.findById(id, tenant)
    if (record.storageKey) {
      try {
        await this.storage.delete(record.storageKey)
      } catch {
        // Object may already be gone; proceed with DB cleanup either way.
      }
    }
    await this.db.delete(imports).where(and(eq(imports.id, id), eq(imports.esfId, tenant.esfId)))
    return { deleted: true }
  }
}
