import { Injectable } from '@nestjs/common'
import { C1NormalizationService } from './c1-normalization.service'
import type { C1ParsedPdf } from './c1-pdf-parser.service'

export interface C1Breakdown {
  consulta_agendada: number
  consulta_agendada_programada: number
  cuidado_continuado: number
  escuta_inicial: number
  consulta_no_dia: number
  atendimento_urgencia: number
}

export interface C1ConsolidatedData {
  programada: number
  espontanea: number
  breakdown: C1Breakdown
}

@Injectable()
export class C1ConsolidationService {
  constructor(private readonly normalization: C1NormalizationService) {}

  consolidate(pdfs: C1ParsedPdf[]): C1ConsolidatedData {
    const breakdown: C1Breakdown = {
      consulta_agendada: 0,
      consulta_agendada_programada: 0,
      cuidado_continuado: 0,
      escuta_inicial: 0,
      consulta_no_dia: 0,
      atendimento_urgencia: 0,
    }

    for (const pdf of pdfs) {
      for (const row of pdf.atendimentos) {
        const tipo = this.normalization.normalize(row.tipoRaw)
        if (tipo === 'ignorado') continue
        breakdown[tipo] += row.quantidade
      }
    }

    const programada =
      breakdown.consulta_agendada +
      breakdown.consulta_agendada_programada +
      breakdown.cuidado_continuado

    const espontanea =
      breakdown.escuta_inicial + breakdown.consulta_no_dia + breakdown.atendimento_urgencia

    return { programada, espontanea, breakdown }
  }
}
