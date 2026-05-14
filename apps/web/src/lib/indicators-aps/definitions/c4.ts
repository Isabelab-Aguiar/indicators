import type { IndicatorDefinition } from '../types'

export const C4: IndicatorDefinition = {
  code: 'c4',
  shortLabel: 'C4',
  title: 'Diabetes',
  subtitle: 'Cuidado da pessoa com diabetes',
  description:
    'Avalia o monitoramento clínico de pessoas com diabetes mellitus quanto a consultas, aferições, exames laboratoriais e cuidado dos pés.',
  population: 'Pessoas com diagnóstico de diabetes vinculadas à equipe.',
  maxScore: 100,
  criteria: [
    {
      id: 'A',
      points: 20,
      title: '≥ 1 consulta em 6 meses',
      description: 'Consulta médica ou de enfermagem realizada nos últimos 6 meses.',
    },
    {
      id: 'B',
      points: 15,
      title: '≥ 1 aferição de PA em 6 meses',
      description: 'Pressão arterial aferida e registrada nos últimos 6 meses.',
    },
    {
      id: 'C',
      points: 15,
      title: 'Peso e altura em 12 meses',
      description: 'Pelo menos um registro simultâneo de peso e altura.',
    },
    {
      id: 'D',
      points: 20,
      title: '≥ 2 visitas do ACS',
      description: 'Duas visitas com intervalo mínimo de 30 dias em 12 meses.',
    },
    {
      id: 'E',
      points: 15,
      title: 'Hemoglobina Glicada',
      description: 'Pelo menos uma solicitação ou avaliação em 12 meses.',
    },
    {
      id: 'F',
      points: 15,
      title: 'Avaliação dos pés',
      description: 'Pelo menos uma avaliação realizada em 12 meses.',
    },
  ],
}
