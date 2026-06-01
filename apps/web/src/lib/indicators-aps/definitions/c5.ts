import type { IndicatorDefinition } from '../types'

export const C5: IndicatorDefinition = {
  code: 'c5',
  shortLabel: 'C5',
  title: 'Hipertensão',
  subtitle: 'Cuidado da pessoa com hipertensão',
  description:
    'Avalia o monitoramento e o cuidado contínuo de pessoas com hipertensão arterial sistêmica.',
  population: 'Pessoas com diagnóstico de hipertensão vinculadas à equipe.',
  maxScore: 100,
  criteria: [
    {
      id: 'A',
      points: 25,
      title: '1 ou mais consultas em 6 meses',
      description: 'Consulta médica ou de enfermagem realizada nos últimos 6 meses.',
    },
    {
      id: 'B',
      points: 25,
      title: '1 ou mais aferições de PA em 6 meses',
      description: 'Pressão arterial aferida e registrada nos últimos 6 meses.',
    },
    {
      id: 'C',
      points: 25,
      title: 'Peso e altura em 12 meses',
      description: 'Pelo menos um registro simultâneo de peso e altura.',
    },
    {
      id: 'D',
      points: 25,
      title: '2 ou mais visitas do ACS',
      description: 'Duas visitas com intervalo mínimo de 30 dias em 12 meses.',
    },
  ],
}
