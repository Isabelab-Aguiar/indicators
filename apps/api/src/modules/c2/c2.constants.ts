import type { C2CriterionId } from '@repo/types'

export const C2_CRITERION_IDS: C2CriterionId[] = ['A', 'B', 'C', 'D', 'E']

export const C2_CRITERION_POINTS: Record<C2CriterionId, number> = {
  A: 20,
  B: 20,
  C: 20,
  D: 20,
  E: 20,
}

export const C2_CRITERION_LABELS: Record<C2CriterionId, string> = {
  A: '1ª consulta presencial até o 30º dia de vida',
  B: 'Pelo menos 9 consultas presenciais ou remotas até os 2 anos',
  C: 'Pelo menos 9 registros simultâneos de peso e altura até os 2 anos',
  D: '2 visitas domiciliares ACS/TACS (1ª até 30 dias, 2ª até 6 meses)',
  E: 'Vacinas DTP, HepB, Hib, polio, SCR e pneumocócica com doses completas',
}

export const C2_CSV_TEMPLATE = `Nome,A,B,C,D,E
Maria Silva,Sim,Sim,Não,Sim,Sim
João Pereira,1,0,1,1,0
Ana Souza,true,false,true,true,true`
