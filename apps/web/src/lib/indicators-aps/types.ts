export type IndicatorCode = 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7'

export type Classification = 'otimo' | 'bom' | 'suficiente' | 'regular'

export interface Criterion {
  id: string
  points: number
  title: string
  description: string
}

export interface PercentageBand {
  label: string
  range: string
  description: string
}

export interface IndicatorDefinition {
  code: IndicatorCode
  shortLabel: string
  title: string
  subtitle: string
  description: string
  population: string
  maxScore?: number
  criteria?: Criterion[]
  bands?: PercentageBand[]
}

export interface ClassificationInfo {
  key: Classification
  label: string
  shortLabel: string
  range: string
  threshold: number
  badge: 'success' | 'info' | 'warning' | 'destructive'
}
