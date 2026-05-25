export type C1Classificacao = 'otimo' | 'bom' | 'suficiente' | 'regular'
export type C1ImportacaoStatus = 'pendente' | 'processando' | 'concluido' | 'erro'
export type C1Alerta = 'acima_70' | 'abaixo_10' | null

export interface C1Breakdown {
  consulta_agendada: number
  consulta_agendada_programada: number
  cuidado_continuado: number
  escuta_inicial: number
  consulta_no_dia: number
  atendimento_urgencia: number
}

export interface C1Execucao {
  id: string
  importacaoId: string
  esfId: string
  periodo: string
  programada: number
  espontanea: number
  total: number
  percentual: string
  classificacao: C1Classificacao
  alerta: C1Alerta
  breakdownJson: C1Breakdown | null
  criadoEm: string
}

export interface C1Importacao {
  id: string
  esfId: string
  periodo: string
  arquivoNome: string
  arquivoUrl: string
  status: C1ImportacaoStatus
  erroDetalhes: string | null
  criadoEm: string
  atualizadoEm: string
}

export interface C1ImportarResponse {
  importacaoId: string
  status: C1ImportacaoStatus
}

export interface C1AnalyticsData {
  evolucaoMensal: { periodo: string; percentual: number; classificacao: C1Classificacao }[]
  distribuicao: { programada: number; espontanea: number }
  composicaoProgramada: {
    consulta_agendada: number
    consulta_agendada_programada: number
    cuidado_continuado: number
  }
  composicaoEspontanea: {
    escuta_inicial: number
    consulta_no_dia: number
    atendimento_urgencia: number
  }
  tendencia: { atual: number | null; anterior: number | null; variacao: number | null }
  insights: string[]
}

export interface C1SimuladorState {
  programada: number
  espontanea: number
}

export interface C1SimuladorResult {
  percentual: number
  classificacao: C1Classificacao
  alerta: C1Alerta
  total: number
}
