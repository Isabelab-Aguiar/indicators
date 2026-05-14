export type IndicatorCode = 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7'

export type Classification = 'otimo' | 'bom' | 'suficiente' | 'regular'

export interface Criterion {
  id: string
  points: number
  title: string
  description: string
}

export interface IndicatorDefinition {
  code: IndicatorCode
  shortLabel: string
  title: string
  subtitle: string
  description: string
  population: string
  maxScore: 100
  criteria: Criterion[]
}

export interface ClassificationInfo {
  key: Classification
  label: string
  shortLabel: string
  range: string
  threshold: number
  badge: 'success' | 'info' | 'warning' | 'destructive'
}
