'use client'

import { useC3Analytics } from '@/hooks/use-c3-analytics'
import { useC5Analytics } from '@/hooks/use-c5-analytics'
import { useC6Analytics } from '@/hooks/use-c6-analytics'
import { useC7Analytics } from '@/hooks/use-c7-analytics'
import { useC1Execucoes } from '@/features/c1/hooks/useC1Execucoes'
import { INDICATORS } from '@/lib/indicators-aps'
import { SectionHeader } from './section-header'
import { IndicatorCard, type ScoreState, type IndicatorStatus } from './indicator-card'

function scoreState(isLoading: boolean, total: number): ScoreState {
  if (isLoading) return 'loading'
  if (total === 0) return 'no-data'
  return 'score'
}

export function IndicatorsOverview() {
  const c1Execucoes = useC1Execucoes()
  const c3 = useC3Analytics()
  const c5 = useC5Analytics()
  const c6 = useC6Analytics()
  const c7 = useC7Analytics()

  const c1Execs = c1Execucoes.data ?? []
  const c1AvgPct =
    c1Execs.length > 0
      ? Math.round((c1Execs.reduce((s, e) => s + Number(e.percentual), 0) / c1Execs.length) * 10) /
        10
      : 0

  const items: IndicatorStatus[] = [
    {
      code: 'c1',
      shortLabel: INDICATORS.c1.shortLabel,
      title: INDICATORS.c1.title,
      href: '/indicadores/c1',
      scoreState: scoreState(c1Execucoes.isLoading, c1Execs.length),
      score: c1AvgPct,
      total: c1Execs.length,
      isPercent: true,
    },
    {
      code: 'c2',
      shortLabel: INDICATORS.c2.shortLabel,
      title: INDICATORS.c2.title,
      href: '/indicadores/c2',
      scoreState: 'no-data',
      score: 0,
      total: 0,
    },
    {
      code: 'c3',
      shortLabel: INDICATORS.c3.shortLabel,
      title: INDICATORS.c3.title,
      href: '/indicadores/c3',
      scoreState: scoreState(c3.isLoading, c3.breakdown.total),
      score: c3.breakdown.avgScore,
      total: c3.breakdown.total,
    },
    {
      code: 'c4',
      shortLabel: INDICATORS.c4.shortLabel,
      title: INDICATORS.c4.title,
      href: '/indicadores/c4',
      scoreState: 'no-data',
      score: 0,
      total: 0,
    },
    {
      code: 'c5',
      shortLabel: INDICATORS.c5.shortLabel,
      title: INDICATORS.c5.title,
      href: '/indicadores/c5',
      scoreState: scoreState(c5.isLoading, c5.breakdown.total),
      score: c5.breakdown.avgScore,
      total: c5.breakdown.total,
    },
    {
      code: 'c6',
      shortLabel: INDICATORS.c6.shortLabel,
      title: INDICATORS.c6.title,
      href: '/indicadores/c6',
      scoreState: scoreState(c6.isLoading, c6.breakdown.total),
      score: c6.breakdown.avgScore,
      total: c6.breakdown.total,
    },
    {
      code: 'c7',
      shortLabel: INDICATORS.c7.shortLabel,
      title: INDICATORS.c7.title,
      href: '/indicadores/c7',
      scoreState: scoreState(c7.isLoading, c7.breakdown.total),
      score: c7.breakdown.avgScore,
      total: c7.breakdown.total,
    },
  ]

  return (
    <section className="space-y-3">
      <SectionHeader
        title="Linhas de cuidado APS"
        description="Score médio por indicador do Previne Brasil"
        actionLabel="Ver todos"
        actionHref="/indicadores"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {items.map((item, i) => (
          <IndicatorCard key={item.code} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
