'use client'

import Link from 'next/link'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import { cn } from '@repo/ui'
import { useC2Analytics } from '@/hooks/use-c2-analytics'
import { useC3Analytics } from '@/hooks/use-c3-analytics'
import { useC4Analytics } from '@/hooks/use-c4-analytics'
import { useC5Analytics } from '@/hooks/use-c5-analytics'
import { useC6Analytics } from '@/hooks/use-c6-analytics'
import { useC7Analytics } from '@/hooks/use-c7-analytics'
import { useC1Execucoes } from '@/features/c1/hooks/useC1Execucoes'
import { INDICATORS } from '@/lib/indicators-aps'
import {
  IndicatorRowCard,
  scoreColor,
  classLabel,
  type IndicatorRowItem,
} from './indicator-row-card'

function buildRows(
  c1: ReturnType<typeof useC1Execucoes>,
  c2: ReturnType<typeof useC2Analytics>,
  c3: ReturnType<typeof useC3Analytics>,
  c4: ReturnType<typeof useC4Analytics>,
  c5: ReturnType<typeof useC5Analytics>,
  c6: ReturnType<typeof useC6Analytics>,
  c7: ReturnType<typeof useC7Analytics>,
): IndicatorRowItem[] {
  const c1Execs = c1.data ?? []
  const c1Score =
    c1Execs.length > 0
      ? Math.round((c1Execs.reduce((s, e) => s + Number(e.percentual), 0) / c1Execs.length) * 10) /
        10
      : null

  return [
    {
      code: 'c1',
      shortLabel: INDICATORS.c1.shortLabel,
      title: INDICATORS.c1.title,
      subtitle: INDICATORS.c1.subtitle,
      href: '/indicadores/c1',
      score: c1Score,
      total: c1Execs.length,
      isLoading: c1.isLoading,
    },
    {
      code: 'c2',
      shortLabel: INDICATORS.c2.shortLabel,
      title: INDICATORS.c2.title,
      subtitle: INDICATORS.c2.subtitle,
      href: '/indicadores/c2',
      score: c2.breakdown.total > 0 ? c2.breakdown.avgScore : null,
      total: c2.breakdown.total,
      isLoading: c2.isLoading,
    },
    {
      code: 'c3',
      shortLabel: INDICATORS.c3.shortLabel,
      title: INDICATORS.c3.title,
      subtitle: INDICATORS.c3.subtitle,
      href: '/indicadores/c3',
      score: c3.breakdown.total > 0 ? c3.breakdown.avgScore : null,
      total: c3.breakdown.total,
      isLoading: c3.isLoading,
    },
    {
      code: 'c4',
      shortLabel: INDICATORS.c4.shortLabel,
      title: INDICATORS.c4.title,
      subtitle: INDICATORS.c4.subtitle,
      href: '/indicadores/c4',
      score: c4.breakdown.total > 0 ? c4.breakdown.avgScore : null,
      total: c4.breakdown.total,
      isLoading: c4.isLoading,
    },
    {
      code: 'c5',
      shortLabel: INDICATORS.c5.shortLabel,
      title: INDICATORS.c5.title,
      subtitle: INDICATORS.c5.subtitle,
      href: '/indicadores/c5',
      score: c5.breakdown.total > 0 ? c5.breakdown.avgScore : null,
      total: c5.breakdown.total,
      isLoading: c5.isLoading,
    },
    {
      code: 'c6',
      shortLabel: INDICATORS.c6.shortLabel,
      title: INDICATORS.c6.title,
      subtitle: INDICATORS.c6.subtitle,
      href: '/indicadores/c6',
      score: c6.breakdown.total > 0 ? c6.breakdown.avgScore : null,
      total: c6.breakdown.total,
      isLoading: c6.isLoading,
    },
    {
      code: 'c7',
      shortLabel: INDICATORS.c7.shortLabel,
      title: INDICATORS.c7.title,
      subtitle: INDICATORS.c7.subtitle,
      href: '/indicadores/c7',
      score: c7.breakdown.total > 0 ? c7.breakdown.avgScore : null,
      total: c7.breakdown.total,
      isLoading: c7.isLoading,
    },
  ]
}

function GlobalScoreHero({ avg, withData }: { avg: number | null; withData: IndicatorRowItem[] }) {
  const colors = avg !== null ? scoreColor(avg) : null
  const loaded = withData.filter((r) => r.score !== null).length

  return (
    <div className="from-card to-card/60 border-border/50 overflow-hidden rounded-2xl border bg-gradient-to-br p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
            Média geral Previne Brasil
          </p>
          {avg !== null && colors ? (
            <>
              <p className={cn('mt-1 text-4xl font-bold tabular-nums tracking-tight', colors.text)}>
                {avg.toFixed(1)}
                <span className="text-muted-foreground ml-1 text-base font-normal">pts</span>
              </p>
              <span
                className={cn(
                  'mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  colors.bg,
                  colors.text,
                )}
              >
                <TrendingUp className="h-3 w-3" />
                {classLabel(avg)}
              </span>
            </>
          ) : (
            <p className="text-muted-foreground mt-2 text-sm">Sem dados ainda</p>
          )}
        </div>

        <div className="text-right">
          <p className="text-muted-foreground text-xs">Indicadores</p>
          <p className="text-foreground text-2xl font-bold tabular-nums">
            {loaded}
            <span className="text-muted-foreground text-sm font-normal">/7</span>
          </p>
          <p className="text-muted-foreground text-[10px]">com dados</p>
        </div>
      </div>

      {/* Mini barras dos indicadores */}
      {withData.length > 0 && (
        <div className="mt-4 grid grid-cols-7 gap-1">
          {withData.map((item) => {
            const c = item.score !== null ? scoreColor(item.score) : null
            return (
              <div key={item.code} className="flex flex-col items-center gap-1">
                <div className="bg-muted h-8 w-full overflow-hidden rounded-md">
                  {item.score !== null && c ? (
                    <div
                      className={cn('w-full rounded-md transition-all', c.bar)}
                      style={{
                        height: `${Math.max(10, item.score)}%`,
                        marginTop: `${100 - Math.max(10, item.score)}%`,
                      }}
                    />
                  ) : (
                    <div className="h-full w-full animate-pulse" />
                  )}
                </div>
                <span className="text-muted-foreground font-mono text-[9px] font-bold uppercase">
                  {item.shortLabel}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function CareLinesSummary() {
  const c1 = useC1Execucoes()
  const c2 = useC2Analytics()
  const c3 = useC3Analytics()
  const c4 = useC4Analytics()
  const c5 = useC5Analytics()
  const c6 = useC6Analytics()
  const c7 = useC7Analytics()

  const rows = buildRows(c1, c2, c3, c4, c5, c6, c7)
  const withData = rows.filter((r) => r.score !== null)
  const globalAvg =
    withData.length > 0
      ? Math.round((withData.reduce((s, r) => s + r.score!, 0) / withData.length) * 10) / 10
      : null

  return (
    <section className="space-y-4">
      <GlobalScoreHero avg={globalAvg} withData={rows} />

      <div className="flex items-center justify-between px-1">
        <h2 className="text-foreground text-sm font-semibold tracking-tight">Linhas de cuidado</h2>
        <Link
          href="/indicadores"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-medium transition-colors"
        >
          Ver todos
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="border-border/40 divide-border/40 divide-y overflow-hidden rounded-2xl border">
        {rows.map((item, i) => (
          <IndicatorRowCard key={item.code} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
