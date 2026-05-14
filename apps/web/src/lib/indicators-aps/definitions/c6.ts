import type { IndicatorDefinition } from '../types'

export const C6: IndicatorDefinition = {
  code: 'c6',
  shortLabel: 'C6',
  title: 'Pessoa Idosa',
  subtitle: 'Cuidado da pessoa idosa (≥ 60 anos)',
  description:
    'Avalia o cuidado integral à pessoa idosa quanto a consultas, registros antropométricos, visitas e imunização.',
  population: 'Pessoas com 60 anos ou mais vinculadas à equipe.',
  maxScore: 100,
  criteria: [
    {
      id: 'A',
      points: 25,
      title: '≥ 1 consulta em 12 meses',
      description: 'Consulta médica ou de enfermagem realizada nos últimos 12 meses.',
    },
    {
      id: 'B',
      points: 25,
      title: 'Peso e altura em 12 meses',
      description: 'Pelo menos um registro simultâneo de peso e altura.',
    },
    {
      id: 'C',
      points: 25,
      title: '≥ 2 visitas do ACS',
      description: 'Duas visitas com intervalo mínimo de 30 dias em 12 meses.',
    },
    {
      id: 'D',
      points: 25,
      title: 'Vacina Influenza',
      description: 'Pelo menos uma dose em 12 meses.',
    },
  ],
}
