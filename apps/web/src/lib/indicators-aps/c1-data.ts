import type { ClassificationInfo } from './types'

export interface C1Band {
  key: 'otimo' | 'bom' | 'suficiente' | 'regular'
  label: string
  min: number
  max: number
  badge: ClassificationInfo['badge']
  bar: string
  fill: string
  text: string
  hex: string
}

export const C1_DEFINITION = {
  code: 'c1' as const,
  shortLabel: 'C1',
  title: 'Mais Acesso à APS',
  subtitle: 'Equilíbrio entre demanda programada e espontânea',
  description:
    'Avalia o equilíbrio operacional da equipe entre atendimentos programados e demanda espontânea. Mais não significa melhor: a faixa ótima é entre 50% e 70%.',
  population: 'Atendimentos individuais registrados no e-SUS, excluindo o tipo "Não informado".',
  formula: 'C1 (%) = Programada / (Programada + Espontânea) × 100',
}

export const C1_BANDS: C1Band[] = [
  {
    key: 'regular',
    label: 'Regular (baixa)',
    min: 0,
    max: 10,
    badge: 'destructive',
    bar: 'bg-red-500',
    fill: '#ef4444',
    text: 'text-red-600 dark:text-red-400',
    hex: '#ef4444',
  },
  {
    key: 'suficiente',
    label: 'Suficiente',
    min: 10,
    max: 30,
    badge: 'warning',
    bar: 'bg-amber-500',
    fill: '#f59e0b',
    text: 'text-amber-600 dark:text-amber-400',
    hex: '#f59e0b',
  },
  {
    key: 'bom',
    label: 'Bom',
    min: 30,
    max: 50,
    badge: 'info',
    bar: 'bg-blue-500',
    fill: '#3b82f6',
    text: 'text-blue-600 dark:text-blue-400',
    hex: '#3b82f6',
  },
  {
    key: 'otimo',
    label: 'Ótimo',
    min: 50,
    max: 70,
    badge: 'success',
    bar: 'bg-emerald-500',
    fill: '#10b981',
    text: 'text-emerald-600 dark:text-emerald-400',
    hex: '#10b981',
  },
  {
    key: 'regular',
    label: 'Regular (alta)',
    min: 70,
    max: 100,
    badge: 'destructive',
    bar: 'bg-red-500',
    fill: '#ef4444',
    text: 'text-red-600 dark:text-red-400',
    hex: '#ef4444',
  },
]

export type C1Alert = 'too-high' | 'too-low' | null

export interface C1Classification {
  band: C1Band
  alert: C1Alert
}

export function classifyC1(percent: number): C1Classification {
  if (percent > 70) {
    return { band: C1_BANDS[4], alert: 'too-high' }
  }
  if (percent <= 10) {
    return { band: C1_BANDS[0], alert: 'too-low' }
  }
  if (percent <= 30) return { band: C1_BANDS[1], alert: null }
  if (percent <= 50) return { band: C1_BANDS[2], alert: null }
  return { band: C1_BANDS[3], alert: null }
}

export function computeC1Percent(programada: number, espontanea: number): number {
  const total = programada + espontanea
  if (total <= 0) return 0
  return (programada / total) * 100
}
