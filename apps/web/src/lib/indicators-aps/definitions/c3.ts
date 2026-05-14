import type { IndicatorDefinition } from '../types'

export const C3: IndicatorDefinition = {
  code: 'c3',
  shortLabel: 'C3',
  title: 'Cuidado Pré-Natal',
  subtitle: 'Acesso e acompanhamento efetivo no pré-natal',
  description:
    'Avalia o acesso e o acompanhamento efetivo das gestantes em relação aos episódios de cuidados necessários durante o pré-natal.',
  population:
    'Pessoas com condição/problema "gravidez" ativo no PEC vinculadas à equipe no período.',
  maxScore: 100,
  criteria: [
    {
      id: 'A',
      points: 25,
      title: '≥ 6 consultas de pré-natal',
      description:
        'Pelo menos 6 consultas realizadas com médico(a) ou enfermeiro(a) durante a gestação.',
    },
    {
      id: 'B',
      points: 25,
      title: 'Exames: HIV, sífilis e hepatite B',
      description:
        'HIV, sífilis (VDRL) e hepatite B (HBsAg) realizados em pelo menos um trimestre.',
    },
    {
      id: 'C',
      points: 25,
      title: '≥ 1 consulta odontológica',
      description: 'Pelo menos um atendimento odontológico registrado durante a gestação.',
    },
    {
      id: 'D',
      points: 25,
      title: 'Vacina dTpa registrada',
      description: 'Vacina dTpa (difteria, tétano e coqueluche) registrada no e-SUS.',
    },
  ],
}
