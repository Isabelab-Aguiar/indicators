import type { C5CriterionId } from '@repo/types'

export const C5_CRITERION_IDS: C5CriterionId[] = ['A', 'B', 'C', 'D']

export const C5_CRITERION_POINTS: Record<C5CriterionId, number> = {
  A: 25,
  B: 25,
  C: 25,
  D: 25,
}

export const C5_CRITERION_LABELS: Record<C5CriterionId, string> = {
  A: '≥ 1 consulta nos últimos 6 meses',
  B: '≥ 1 aferição de PA nos últimos 6 meses',
  C: 'Peso e altura registrados em 12 meses',
  D: '≥ 2 visitas do ACS (intervalo ≥ 30d)',
}

export const C5_CSV_TEMPLATE = `Nome,A,B,C,D
Ana Costa,Sim,Sim,Sim,Não
Pedro Alves,1,1,1,1
Rosa Martins,true,false,true,true`
