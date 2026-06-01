import type { IndicatorDefinition } from '../types'

export const C2: IndicatorDefinition = {
  code: 'c2',
  shortLabel: 'C2',
  title: 'Desenvolvimento Infantil',
  subtitle: 'Cuidado da criança nos primeiros 2 anos',
  description:
    'Avalia o acompanhamento de crianças de 0 a 2 anos quanto a consultas, registros antropométricos, visitas domiciliares e cobertura vacinal.',
  population: 'Crianças de 0 a 2 anos vinculadas à equipe no período.',
  maxScore: 100,
  criteria: [
    {
      id: 'A',
      points: 20,
      title: '1ª consulta até o 30º dia de vida',
      description: 'Primeira consulta médica ou de enfermagem realizada nos primeiros 30 dias.',
    },
    {
      id: 'B',
      points: 20,
      title: '9 ou mais consultas até os 2 anos',
      description: 'Pelo menos nove consultas com médico ou enfermeiro no período.',
    },
    {
      id: 'C',
      points: 20,
      title: '9 ou mais registros de peso e altura',
      description: 'Nove ou mais registros simultâneos de peso e altura.',
    },
    {
      id: 'D',
      points: 20,
      title: '2 ou mais visitas do ACS',
      description: 'Primeira visita até 30 dias e segunda até 6 meses.',
    },
    {
      id: 'E',
      points: 20,
      title: 'Esquema vacinal completo',
      description: 'Vacinas DTP, Hepatite B, Hib, poliomielite, SCR e pneumocócica em dia.',
    },
  ],
}
