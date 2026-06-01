'use client'

import { useC1Execucoes } from '@/features/c1/hooks/useC1Execucoes'
import { useC2Analytics } from '@/hooks/use-c2-analytics'
import { useC3Analytics } from '@/hooks/use-c3-analytics'
import { useC4Analytics } from '@/hooks/use-c4-analytics'
import { useC5Analytics } from '@/hooks/use-c5-analytics'
import { useC6Analytics } from '@/hooks/use-c6-analytics'
import { useC7Analytics } from '@/hooks/use-c7-analytics'
import { INDICATORS } from '@/lib/indicators-aps'

export interface IndicatorBar {
  code: string
  label: string
  score: number | null
  total: number
  scoreDisplay: number
  shortCode: string
}

export function useAllIndicatorsData(): { isLoading: boolean; data: IndicatorBar[] } {
  const c1 = useC1Execucoes()
  const c2 = useC2Analytics()
  const c3 = useC3Analytics()
  const c4 = useC4Analytics()
  const c5 = useC5Analytics()
  const c6 = useC6Analytics()
  const c7 = useC7Analytics()

  const isLoading =
    c1.isLoading ||
    c2.isLoading ||
    c3.isLoading ||
    c4.isLoading ||
    c5.isLoading ||
    c6.isLoading ||
    c7.isLoading

  const c1Execs = c1.data ?? []
  const c1Score =
    c1Execs.length > 0
      ? Math.round((c1Execs.reduce((s, e) => s + Number(e.percentual), 0) / c1Execs.length) * 10) /
        10
      : null

  const rows = [
    { code: 'c1', score: c1Score, total: c1Execs.length, def: INDICATORS.c1 },
    {
      code: 'c2',
      score: c2.breakdown.total > 0 ? c2.breakdown.avgScore : null,
      total: c2.breakdown.total,
      def: INDICATORS.c2,
    },
    {
      code: 'c3',
      score: c3.breakdown.total > 0 ? c3.breakdown.avgScore : null,
      total: c3.breakdown.total,
      def: INDICATORS.c3,
    },
    {
      code: 'c4',
      score: c4.breakdown.total > 0 ? c4.breakdown.avgScore : null,
      total: c4.breakdown.total,
      def: INDICATORS.c4,
    },
    {
      code: 'c5',
      score: c5.breakdown.total > 0 ? c5.breakdown.avgScore : null,
      total: c5.breakdown.total,
      def: INDICATORS.c5,
    },
    {
      code: 'c6',
      score: c6.breakdown.total > 0 ? c6.breakdown.avgScore : null,
      total: c6.breakdown.total,
      def: INDICATORS.c6,
    },
    {
      code: 'c7',
      score: c7.breakdown.total > 0 ? c7.breakdown.avgScore : null,
      total: c7.breakdown.total,
      def: INDICATORS.c7,
    },
  ]

  const data: IndicatorBar[] = rows.map((r) => ({
    code: r.code,
    label: `${r.def.shortLabel} — ${r.def.title}`,
    score: r.score,
    total: r.total,
    scoreDisplay: r.score ?? 0,
    shortCode: r.code.toUpperCase(),
  }))

  return { isLoading, data }
}
