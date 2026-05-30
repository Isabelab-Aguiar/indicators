import type { C6CriterionId } from '@repo/types'

export const C6_CRITERION_IDS: C6CriterionId[] = ['A', 'B', 'C', 'D']

export const C6_CRITERION_POINTS: Record<C6CriterionId, number> = {
  A: 25,
  B: 25,
  C: 25,
  D: 25,
}

export const C6_CRITERION_LABELS: Record<C6CriterionId, string> = {
  A: '≥ 1 consulta em 12 meses',
  B: 'Peso e altura em 12 meses',
  C: '≥ 2 visitas do ACS (intervalo ≥ 30d)',
  D: 'Vacina Influenza em 12 meses',
}

export const C6_CSV_TEMPLATE = `Nome,A,B,C,D
Antônia Reis,Sim,Sim,Não,Sim
Manoel Santos,1,1,1,0
Lurdes Pereira,true,true,false,true`
