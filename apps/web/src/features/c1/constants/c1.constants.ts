import type { C1Classificacao } from '../types/c1.types'

export const C1_THRESHOLDS = {
  OTIMO_MIN: 50,
  OTIMO_MAX: 70,
  BOM_MIN: 30,
  BOM_MAX: 50,
  SUFICIENTE_MIN: 10,
  SUFICIENTE_MAX: 30,
  ALERTA_ACIMA: 70,
  ALERTA_ABAIXO: 10,
} as const

export const C1_CLASSIFICACAO_LABELS: Record<C1Classificacao, string> = {
  otimo: 'Ótimo',
  bom: 'Bom',
  suficiente: 'Suficiente',
  regular: 'Regular',
}

export const C1_CLASSIFICACAO_COLORS: Record<C1Classificacao, string> = {
  otimo: '#22c55e',
  bom: '#3b82f6',
  suficiente: '#eab308',
  regular: '#ef4444',
}

export const C1_CLASSIFICACAO_BADGE: Record<C1Classificacao, string> = {
  otimo: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  bom: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  suficiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  regular: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export const C1_ALERTA_LABELS: Record<string, string> = {
  acima_70: 'Baixa abertura à demanda espontânea',
  abaixo_10: 'Equipe operando quase exclusivamente com demanda espontânea',
}

export const C1_TIPOS_PROGRAMADA = [
  'consulta_agendada',
  'consulta_agendada_programada',
  'cuidado_continuado',
] as const

export const C1_TIPOS_ESPONTANEA = [
  'escuta_inicial',
  'consulta_no_dia',
  'atendimento_urgencia',
] as const

export const C1_TIPO_LABELS: Record<string, string> = {
  consulta_agendada: 'Consulta Agendada',
  consulta_agendada_programada: 'Agendada Programada',
  cuidado_continuado: 'Cuidado Continuado',
  escuta_inicial: 'Escuta Inicial / Orientação',
  consulta_no_dia: 'Consulta no Dia',
  atendimento_urgencia: 'Atendimento Urgência',
}

export const C1_GAUGE_SEGMENTS = [
  { label: 'Regular', min: 0, max: 10, color: '#ef4444' },
  { label: 'Suficiente', min: 10, max: 30, color: '#eab308' },
  { label: 'Bom', min: 30, max: 50, color: '#3b82f6' },
  { label: 'Ótimo', min: 50, max: 70, color: '#22c55e' },
  { label: 'Regular', min: 70, max: 100, color: '#ef4444' },
] as const

export const C1_POLL_INTERVAL_MS = 2000

export const C1_CHART_COLORS = {
  programada: '#3b82f6',
  espontanea: '#a855f7',
  evolucao: '#3b82f6',
  espontanea_escuta: '#a855f7',
  espontanea_dia: '#ec4899',
  espontanea_urgencia: '#f97316',
  referencia_otimo_min: '#22c55e',
  referencia_otimo_max: '#ef4444',
} as const

export const C1_KPI_ACCENTS = {
  programada: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  espontanea: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  positivo: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  negativo: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  alerta: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  sem_alerta: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
} as const

export const C1_INSIGHT_META = {
  'baixa abertura': { type: 'danger', label: 'Alerta' },
  Urgências: { type: 'danger', label: 'Alerta' },
  'Bom equilíbrio': { type: 'success', label: 'Positivo' },
  C1: { type: 'info', label: 'Tendência' },
} as const

export type C1InsightType = 'danger' | 'success' | 'info' | 'default'

export const C1_PAGE_SIZE = 20

export const C1_PERIODO_PADRAO = 'Não identificado'
