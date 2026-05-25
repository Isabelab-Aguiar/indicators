import type { ClassificationInfo, IndicatorDefinition } from './types'

export const CLASSIFICATIONS: ClassificationInfo[] = [
  {
    key: 'otimo',
    label: 'Ótimo',
    shortLabel: 'Ótimo',
    range: '≥ 80 pontos',
    threshold: 80,
    badge: 'success',
  },
  {
    key: 'bom',
    label: 'Bom',
    shortLabel: 'Bom',
    range: '≥ 60 e < 80',
    threshold: 60,
    badge: 'info',
  },
  {
    key: 'suficiente',
    label: 'Suficiente',
    shortLabel: 'Suficiente',
    range: '≥ 40 e < 60',
    threshold: 40,
    badge: 'warning',
  },
  {
    key: 'regular',
    label: 'Regular',
    shortLabel: 'Regular',
    range: '< 40 pontos',
    threshold: 0,
    badge: 'destructive',
  },
]

export function classifyScore(score: number): ClassificationInfo {
  return (
    CLASSIFICATIONS.find((c) => score >= c.threshold) ?? CLASSIFICATIONS[CLASSIFICATIONS.length - 1]
  )
}

export function computeScore(
  indicator: IndicatorDefinition,
  achieved: ReadonlySet<string>,
): number {
  if (!indicator.criteria) return 0
  return indicator.criteria.reduce((total, c) => (achieved.has(c.id) ? total + c.points : total), 0)
}
