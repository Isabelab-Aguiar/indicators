import type { C7CriterionId } from '@repo/types'

export const C7_CRITERION_IDS: C7CriterionId[] = ['A', 'B', 'C', 'D']

export const C7_CRITERION_POINTS: Record<C7CriterionId, number> = {
  A: 20,
  B: 30,
  C: 30,
  D: 20,
}

export const C7_ELIGIBILITY_RANGES: Record<C7CriterionId, { minAge: number; maxAge: number }> = {
  A: { minAge: 25, maxAge: 64 },
  B: { minAge: 9, maxAge: 14 },
  C: { minAge: 14, maxAge: 69 },
  D: { minAge: 50, maxAge: 69 },
}

export const C7_CRITERION_LABELS: Record<C7CriterionId, string> = {
  A: 'Rastreio colo do útero (36m)',
  B: 'Vacina HPV ≥1 dose',
  C: 'Saúde sexual e reprodutiva (12m)',
  D: 'Rastreio mamografia (24m)',
}

export const C7_CSV_TEMPLATE = `Nome,Idade,A,B,C,D
Carla Mendes,32,Sim,Não,Sim,Não
Beatriz Lima,12,Não,Sim,Não,Não
Sandra Rocha,58,Sim,Não,Sim,Sim`
