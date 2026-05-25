import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Inject, Logger } from '@nestjs/common'
import type { Job } from 'bullmq'
import { eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import type * as schema from '../../database/schema'
import { c1Execucoes, c1Importacoes } from '../../database/schema'
import { StorageService } from '../storage/storage.service'
import { C1PdfParserService } from './c1-pdf-parser.service'
import { C1ConsolidationService } from './c1-consolidation.service'
import { C1CalculatorService } from './c1-calculator.service'
import { C1ClassificationService } from './c1-classification.service'
import { QUEUE_NAMES } from '@repo/config'

type Database = NodePgDatabase<typeof schema>

interface C1JobData {
  importacaoId: string
  storageKey: string
  esfId: string
  periodo: string
}

@Processor(QUEUE_NAMES.C1_PDF_IMPORT)
export class C1ImportProcessor extends WorkerHost {
  private readonly logger = new Logger(C1ImportProcessor.name)

  constructor(
    @Inject(DATABASE_TOKEN) private readonly db: Database,
    private readonly storage: StorageService,
    private readonly parser: C1PdfParserService,
    private readonly consolidation: C1ConsolidationService,
    private readonly calculator: C1CalculatorService,
    private readonly classification: C1ClassificationService,
  ) {
    super()
  }

  async process(job: Job<C1JobData>): Promise<void> {
    const { importacaoId, storageKey, esfId, periodo } = job.data

    await this.db
      .update(c1Importacoes)
      .set({ status: 'processando', atualizadoEm: new Date() })
      .where(eq(c1Importacoes.id, importacaoId))

    try {
      const buffer = await this.storage.getBuffer(storageKey)
      const parsed = await this.parser.parse(buffer)
      const consolidated = this.consolidation.consolidate([parsed])
      const calcResult = this.calculator.calculate(consolidated)
      const classResult = this.classification.classify(calcResult.percentual)

      const resolvedPeriodo = parsed.periodo !== 'Não identificado' ? parsed.periodo : periodo

      await this.db.insert(c1Execucoes).values({
        importacaoId,
        esfId,
        periodo: resolvedPeriodo,
        programada: calcResult.programada,
        espontanea: calcResult.espontanea,
        total: calcResult.total,
        percentual: String(calcResult.percentual),
        classificacao: classResult.classificacao,
        alerta: classResult.alerta,
        breakdownJson: consolidated.breakdown,
      })

      await this.db
        .update(c1Importacoes)
        .set({ status: 'concluido', atualizadoEm: new Date() })
        .where(eq(c1Importacoes.id, importacaoId))

      this.logger.log(
        `C1 job concluído: importacaoId=${importacaoId} percentual=${calcResult.percentual}%`,
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      this.logger.error(`C1 job falhou: importacaoId=${importacaoId}`, message)

      await this.db
        .update(c1Importacoes)
        .set({ status: 'erro', erroDetalhes: message.slice(0, 2000), atualizadoEm: new Date() })
        .where(eq(c1Importacoes.id, importacaoId))

      throw err
    }
  }
}
