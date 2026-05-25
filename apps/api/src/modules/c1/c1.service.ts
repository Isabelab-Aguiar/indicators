import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import type { Queue } from 'bullmq'
import { and, desc, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import type * as schema from '../../database/schema'
import { c1Execucoes, c1Importacoes } from '../../database/schema'
import { StorageService } from '../storage/storage.service'
import { C1AnalyticsService } from './c1-analytics.service'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { QUEUE_NAMES } from '@repo/config'
import type { C1FilterDto } from './dto/c1-filter.dto'

type Database = NodePgDatabase<typeof schema>

@Injectable()
export class C1Service {
  constructor(
    @Inject(DATABASE_TOKEN) private readonly db: Database,
    @InjectQueue(QUEUE_NAMES.C1_PDF_IMPORT) private readonly queue: Queue,
    private readonly storage: StorageService,
    private readonly analytics: C1AnalyticsService,
  ) {}

  async importarPdf(file: Express.Multer.File, periodo: string, tenant: TenantContextPayload) {
    if (!file) throw new BadRequestException('Arquivo PDF não recebido')

    const [importacao] = await this.db
      .insert(c1Importacoes)
      .values({
        esfId: tenant.esfId,
        periodo,
        arquivoNome: file.originalname,
        arquivoUrl: '',
        status: 'pendente',
      })
      .returning()

    const storageKey = `c1/${tenant.esfId}/${importacao.id}.pdf`

    try {
      await this.storage.put(storageKey, file.buffer, 'application/pdf')

      const arquivoUrl = storageKey

      await this.db
        .update(c1Importacoes)
        .set({ arquivoUrl, atualizadoEm: new Date() })
        .where(eq(c1Importacoes.id, importacao.id))

      await this.queue.add(
        'process-c1-pdf',
        { importacaoId: importacao.id, storageKey, esfId: tenant.esfId, periodo },
        { attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      await this.db
        .update(c1Importacoes)
        .set({ status: 'erro', erroDetalhes: message.slice(0, 2000), atualizadoEm: new Date() })
        .where(eq(c1Importacoes.id, importacao.id))
      throw new InternalServerErrorException(`Falha ao enfileirar importação: ${message}`)
    }

    return { importacaoId: importacao.id, status: 'pendente' }
  }

  async findAllExecucoes(tenant: TenantContextPayload, filters: C1FilterDto) {
    const isAdmin = tenant.isAdmin && filters.all === 'true'

    const rows = await this.db.query.c1Execucoes.findMany({
      where: isAdmin ? undefined : eq(c1Execucoes.esfId, tenant.esfId),
      orderBy: [desc(c1Execucoes.criadoEm)],
      limit: 200,
    })

    return rows
      .filter((r) => !filters.periodo || r.periodo === filters.periodo)
      .filter((r) => !filters.classificacao || r.classificacao === filters.classificacao)
      .filter((r) => !filters.alerta || r.alerta === filters.alerta)
  }

  async findExecucaoById(id: string, tenant: TenantContextPayload) {
    const row = await this.db.query.c1Execucoes.findFirst({
      where: and(eq(c1Execucoes.id, id), eq(c1Execucoes.esfId, tenant.esfId)),
    })
    if (!row) throw new NotFoundException('Execução não encontrada')
    return row
  }

  async findImportacaoById(id: string, tenant: TenantContextPayload) {
    const row = await this.db.query.c1Importacoes.findFirst({
      where: and(eq(c1Importacoes.id, id), eq(c1Importacoes.esfId, tenant.esfId)),
    })
    if (!row) throw new NotFoundException('Importação não encontrada')
    return row
  }

  getAnalytics(tenant: TenantContextPayload) {
    return this.analytics.getAnalytics(tenant.esfId)
  }

  async exportarCsv(tenant: TenantContextPayload): Promise<string> {
    const rows = await this.db.query.c1Execucoes.findMany({
      where: eq(c1Execucoes.esfId, tenant.esfId),
      orderBy: [desc(c1Execucoes.criadoEm)],
      limit: 1000,
    })

    const header = 'Período,Programada,Espontânea,Percentual (%),Classificação,Alerta,Data'
    const lines = rows.map((r) =>
      [
        r.periodo,
        r.programada,
        r.espontanea,
        r.percentual,
        r.classificacao,
        r.alerta ?? '',
        r.criadoEm ? new Date(r.criadoEm).toLocaleDateString('pt-BR') : '',
      ].join(','),
    )
    return [header, ...lines].join('\n')
  }

  async deleteExecucao(id: string, tenant: TenantContextPayload) {
    await this.findExecucaoById(id, tenant)
    await this.db
      .delete(c1Execucoes)
      .where(and(eq(c1Execucoes.id, id), eq(c1Execucoes.esfId, tenant.esfId)))
    return { deleted: true }
  }
}
