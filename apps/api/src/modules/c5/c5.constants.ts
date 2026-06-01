import type { C5CriterionId } from '@repo/types'

export const C5_CRITERION_IDS: C5CriterionId[] = ['A', 'B', 'C', 'D']

export const C5_CRITERION_POINTS: Record<C5CriterionId, number> = {
  A: 25,
  B: 25,
  C: 25,
  D: 25,
}

export const C5_CRITERION_LABELS: Record<C5CriterionId, string> = {
  A: '1 ou mais consultas nos últimos 6 meses',
  B: '1 ou mais aferições de PA nos últimos 6 meses',
  C: 'Peso e altura registrados em 12 meses',
  D: '2 ou mais visitas do ACS com intervalo de 30 dias',
}
