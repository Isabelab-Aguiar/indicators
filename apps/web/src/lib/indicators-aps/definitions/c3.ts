import type { IndicatorDefinition } from '../types'

export const C3: IndicatorDefinition = {
  code: 'c3',
  shortLabel: 'C3',
  title: 'Cuidado Pré-Natal',
  subtitle: 'Acesso e acompanhamento efetivo no pré-natal',
  description:
    'Avalia o acesso e o acompanhamento efetivo das gestantes em relação aos episódios de cuidados necessários durante o pré-natal.',
  population: 'Gestantes em acompanhamento de pré-natal pela equipe no período avaliado.',
  maxScore: 100,
  criteria: [
    {
      id: 'A',
      points: 10,
      title: '1ª consulta até a 12ª semana',
      description: 'Consulta médica ou de enfermagem realizada até 12 semanas de gestação.',
    },
    {
      id: 'B',
      points: 9,
      title: 'Mínimo de 7 consultas no pré-natal',
      description: 'Consultas presenciais ou remotas por médica(o) ou enfermeira(o).',
    },
    {
      id: 'C',
      points: 9,
      title: 'Mínimo de 7 aferições de pressão arterial',
      description: 'Registros de PA durante a gestação.',
    },
    {
      id: 'D',
      points: 9,
      title: 'Mínimo de 7 registros de peso e altura',
      description: 'Registros simultâneos de peso e altura.',
    },
    {
      id: 'E',
      points: 9,
      title: 'Mínimo de 3 visitas domiciliares (ACS/TACS)',
      description: 'Após a primeira consulta do pré-natal.',
    },
    {
      id: 'F',
      points: 9,
      title: 'Vacina dTpa registrada',
      description: 'Difteria, tétano e coqueluche acelular a partir da 20ª semana.',
    },
    {
      id: 'G',
      points: 9,
      title: 'Testes/exames no 1º trimestre',
      description: 'Sífilis, HIV e hepatites B e C: todos realizados.',
    },
    {
      id: 'H',
      points: 9,
      title: 'Testes/exames no 3º trimestre',
      description: 'Sífilis e HIV: ambos realizados.',
    },
    {
      id: 'I',
      points: 9,
      title: 'Saúde bucal (mín. 1 atividade)',
      description:
        'Por cirurgiã(o) dentista ou TSB durante a gestação. (Equivale ao item K da PNAB)',
    },
  ],
}
