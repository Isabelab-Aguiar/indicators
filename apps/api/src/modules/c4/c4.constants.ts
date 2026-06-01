import type { C4CriterionId } from '@repo/types'

export const C4_CRITERION_IDS: C4CriterionId[] = ['A', 'B', 'C', 'D', 'E', 'F']

export const C4_CRITERION_POINTS: Record<C4CriterionId, number> = {
  A: 20,
  B: 15,
  C: 15,
  D: 20,
  E: 15,
  F: 15,
}

export const C4_CRITERION_LABELS: Record<C4CriterionId, string> = {
  A: '1 ou mais consultas nos últimos 6 meses',
  B: '1 ou mais aferições de PA nos últimos 6 meses',
  C: 'Peso e altura registrados em 12 meses',
  D: '2 ou mais visitas do ACS com intervalo de 30 dias',
  E: 'Hemoglobina Glicada solicitada em 12 meses',
  F: 'Avaliação dos pés realizada em 12 meses',
}
