import type { IndicatorCode, IndicatorDefinition } from './types'

const C2: IndicatorDefinition = {
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
      title: '≥ 9 consultas até os 2 anos',
      description: 'Pelo menos nove consultas com médica(o) ou enfermeira(o) no período.',
    },
    {
      id: 'C',
      points: 20,
      title: '≥ 9 registros de peso e altura',
      description: 'Nove ou mais registros simultâneos de peso e altura.',
    },
    {
      id: 'D',
      points: 20,
      title: '≥ 2 visitas do ACS',
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

const C3: IndicatorDefinition = {
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

const C4: IndicatorDefinition = {
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

const C5: IndicatorDefinition = {
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
      title: '≥ 1 consulta em 6 meses',
      description: 'Consulta médica ou de enfermagem realizada nos últimos 6 meses.',
    },
    {
      id: 'B',
      points: 25,
      title: '≥ 1 aferição de PA em 6 meses',
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
      title: '≥ 2 visitas do ACS',
      description: 'Duas visitas com intervalo mínimo de 30 dias em 12 meses.',
    },
  ],
}

const C6: IndicatorDefinition = {
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

const C7: IndicatorDefinition = {
  code: 'c7',
  shortLabel: 'C7',
  title: 'Prevenção do Câncer (Mulher)',
  subtitle: 'Mulheres de 9 a 69 anos',
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

export const INDICATORS: Record<IndicatorCode, IndicatorDefinition> = {
  c2: C2,
  c3: C3,
  c4: C4,
  c5: C5,
  c6: C6,
  c7: C7,
}
export const INDICATOR_LIST: IndicatorDefinition[] = [C2, C3, C4, C5, C6, C7]
