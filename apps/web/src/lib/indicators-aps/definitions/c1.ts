import type { IndicatorDefinition } from '../types'

export const C1: IndicatorDefinition = {
  code: 'c1',
  shortLabel: 'C1',
  title: 'Mais Acesso à APS',
  subtitle: 'Equilíbrio entre demanda programada e espontânea',
  description:
    'Avalia o percentual de consultas programadas em relação ao total de atendimentos individuais da equipe APS. O objetivo é manter um equilíbrio saudável que garanta tanto o cuidado continuado quanto a abertura para demanda espontânea.',
  population:
    'Todos os atendimentos individuais registrados no e-SUS pela equipe no período avaliado.',
  bands: [
    {
      label: 'Ótimo',
      range: '50% a 70%',
      description:
        'Equilíbrio ideal. A equipe mantém agenda programada sem fechar espaço para urgências e demandas espontâneas.',
    },
    {
      label: 'Bom',
      range: '30% a 50% ou 70% a 90%',
      description:
        'Perfil aceitável com leve desvio do equilíbrio ideal. Recomenda-se revisão da organização da agenda.',
    },
    {
      label: 'Suficiente',
      range: '10% a 30% ou 90% a 100%',
      description:
        'Desequilíbrio significativo entre os tipos de demanda. Necessita de atenção e reorganização da agenda.',
    },
    {
      label: 'Regular',
      range: 'Abaixo de 10%',
      description:
        'Quase ausência de atendimentos programados. A equipe opera predominantemente em demanda espontânea.',
    },
  ],
}
