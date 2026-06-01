import type { C6CriterionId } from '@repo/types'

export const C6_CRITERION_IDS: C6CriterionId[] = ['A', 'B', 'C', 'D']

export const C6_CRITERION_POINTS: Record<C6CriterionId, number> = {
  A: 25,
  B: 25,
  C: 25,
  D: 25,
}

export const C6_CRITERION_LABELS: Record<C6CriterionId, string> = {
  A: '1 ou mais consultas em 12 meses',
  B: 'Peso e altura em 12 meses',
  C: '2 ou mais visitas do ACS com intervalo de 30 dias',
  D: 'Vacina Influenza em 12 meses',
}
