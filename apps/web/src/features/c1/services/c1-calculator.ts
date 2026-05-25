import type { C1Classificacao, C1Alerta, C1SimuladorResult } from '../types/c1.types'
import { C1_THRESHOLDS } from '../constants/c1.constants'

export function calcularPercentualC1(programada: number, espontanea: number): number {
  const total = programada + espontanea
  if (total === 0) return 0
  return Math.round((programada / total) * 10000) / 100
}

export function classificarC1(percentual: number): C1Classificacao {
  if (percentual > C1_THRESHOLDS.OTIMO_MIN && percentual <= C1_THRESHOLDS.OTIMO_MAX) return 'otimo'
  if (percentual > C1_THRESHOLDS.BOM_MIN && percentual <= C1_THRESHOLDS.BOM_MAX) return 'bom'
  if (percentual > C1_THRESHOLDS.SUFICIENTE_MIN && percentual <= C1_THRESHOLDS.SUFICIENTE_MAX)
    return 'suficiente'
  return 'regular'
}

export function resolverAlertaC1(percentual: number): C1Alerta {
  if (percentual > C1_THRESHOLDS.ALERTA_ACIMA) return 'acima_70'
  if (percentual <= C1_THRESHOLDS.ALERTA_ABAIXO) return 'abaixo_10'
  return null
}

export function simularC1(programada: number, espontanea: number): C1SimuladorResult {
  const percentual = calcularPercentualC1(programada, espontanea)
  return {
    percentual,
    classificacao: classificarC1(percentual),
    alerta: resolverAlertaC1(percentual),
    total: programada + espontanea,
  }
}
