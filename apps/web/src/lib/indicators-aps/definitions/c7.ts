import type { IndicatorDefinition } from '../types'

export const C7: IndicatorDefinition = {
  code: 'c7',
  shortLabel: 'C7',
  title: 'Prevenção do Câncer',
  subtitle: 'Saúde da mulher: 9 a 69 anos',
  description:
    'Avalia ações de prevenção e rastreio do câncer do colo do útero e da mama em mulheres elegíveis.',
  population: 'Mulheres de 9 a 69 anos vinculadas à equipe.',
  maxScore: 100,
  criteria: [
    {
      id: 'A',
      points: 20,
      title: 'Rastreio do colo do útero',
      description: 'Pelo menos um rastreio em 36 meses para mulheres de 25 a 64 anos.',
    },
    {
      id: 'B',
      points: 30,
      title: 'Vacina HPV',
      description: 'Pelo menos uma dose para meninas de 9 a 14 anos.',
    },
    {
      id: 'C',
      points: 30,
      title: 'Saúde sexual e reprodutiva',
      description: 'Pelo menos um atendimento em 12 meses para mulheres de 14 a 69 anos.',
    },
    {
      id: 'D',
      points: 20,
      title: 'Rastreio de mama',
      description: 'Pelo menos um rastreio em 24 meses para mulheres de 50 a 69 anos.',
    },
  ],
}
