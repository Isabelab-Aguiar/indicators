import { Inject, Injectable } from '@nestjs/common'
import { desc, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import type * as schema from '../../database/schema'
import { c1Execucoes } from '../../database/schema'
import { C1_THRESHOLDS, C1_URGENCIA_ALERTA_PCT } from './c1.constants'

type Database = NodePgDatabase<typeof schema>

export interface C1AnalyticsData {
  evolucaoMensal: { periodo: string; percentual: number; classificacao: string }[]
  distribuicao: { programada: number; espontanea: number }
  composicaoProgramada: {
    consulta_agendada: number
    consulta_agendada_programada: number
    cuidado_continuado: number
  }
  composicaoEspontanea: {
    escuta_inicial: number
    consulta_no_dia: number
    atendimento_urgencia: number
  }
  tendencia: { atual: number | null; anterior: number | null; variacao: number | null }
  insights: string[]
}

@Injectable()
export class C1AnalyticsService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async getAnalytics(esfId: string): Promise<C1AnalyticsData> {
    const execucoes = await this.db.query.c1Execucoes.findMany({
      where: eq(c1Execucoes.esfId, esfId),
      orderBy: [desc(c1Execucoes.criadoEm)],
      limit: 100,
    })

    const evolucaoMensal = execucoes.map((e) => ({
      periodo: e.periodo,
      percentual: Number(e.percentual),
      classificacao: e.classificacao,
    }))

    const latest = execucoes[0]
    const previous = execucoes[1]

    const breakdown = (latest?.breakdownJson as Record<string, number> | null) ?? {}

    const distribuicao = {
      programada: latest?.programada ?? 0,
      espontanea: latest?.espontanea ?? 0,
    }

    const composicaoProgramada = {
      consulta_agendada: breakdown.consulta_agendada ?? 0,
      consulta_agendada_programada: breakdown.consulta_agendada_programada ?? 0,
      cuidado_continuado: breakdown.cuidado_continuado ?? 0,
    }

    const composicaoEspontanea = {
      escuta_inicial: breakdown.escuta_inicial ?? 0,
      consulta_no_dia: breakdown.consulta_no_dia ?? 0,
      atendimento_urgencia: breakdown.atendimento_urgencia ?? 0,
    }

    const atualPercentual = latest ? Number(latest.percentual) : null
    const anteriorPercentual = previous ? Number(previous.percentual) : null
    const variacao =
      atualPercentual !== null && anteriorPercentual !== null
        ? Math.round((atualPercentual - anteriorPercentual) * 100) / 100
        : null

    const tendencia = { atual: atualPercentual, anterior: anteriorPercentual, variacao }

    const insights = this.buildInsights(latest, composicaoEspontanea, variacao)

    return {
      evolucaoMensal,
      distribuicao,
      composicaoProgramada,
      composicaoEspontanea,
      tendencia,
      insights,
    }
  }

  private buildInsights(
    latest: typeof c1Execucoes.$inferSelect | undefined,
    espontanea: { escuta_inicial: number; consulta_no_dia: number; atendimento_urgencia: number },
    variacao: number | null,
  ): string[] {
    if (!latest) return []

    const p = Number(latest.percentual)
    const insights: string[] = []
    const totalEspontanea =
      espontanea.escuta_inicial + espontanea.consulta_no_dia + espontanea.atendimento_urgencia

    if (p > C1_THRESHOLDS.ALERTA_ACIMA) {
      insights.push('Equipe com baixa abertura à demanda espontânea — percentual acima de 70%')
    } else if (p <= C1_THRESHOLDS.ALERTA_ABAIXO) {
      insights.push('Percentual programado abaixo do recomendado — considerar ampliar agenda')
    } else if (p > C1_THRESHOLDS.OTIMO_MIN && p <= C1_THRESHOLDS.OTIMO_MAX) {
      insights.push('Bom equilíbrio assistencial — dentro da faixa ótima')
    }

    if (totalEspontanea > 0) {
      const urgenciaPct = Math.round((espontanea.atendimento_urgencia / totalEspontanea) * 100)
      if (urgenciaPct >= C1_URGENCIA_ALERTA_PCT) {
        insights.push(`Urgências representam ${urgenciaPct}% da demanda espontânea — avaliar risco`)
      }
    }

    if (variacao !== null) {
      const sinal = variacao > 0 ? 'aumentou' : 'reduziu'
      insights.push(`C1 ${sinal} ${Math.abs(variacao).toFixed(1)} pp vs período anterior`)
    }

    return insights
  }
}
