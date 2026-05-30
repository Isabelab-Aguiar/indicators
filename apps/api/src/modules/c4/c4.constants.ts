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
  A: '≥ 1 consulta nos últimos 6 meses',
  B: '≥ 1 aferição de PA nos últimos 6 meses',
  C: 'Peso e altura registrados em 12 meses',
  D: '≥ 2 visitas do ACS (intervalo ≥ 30d)',
  E: 'Hemoglobina Glicada solicitada em 12 meses',
  F: 'Avaliação dos pés realizada em 12 meses',
}

export const C4_CSV_TEMPLATE = `Nome,A,B,C,D,E,F
Carlos Oliveira,Sim,Sim,Sim,Não,Sim,Não
Maria Lima,1,1,0,1,1,0
José Ferreira,true,true,true,false,true,true`
