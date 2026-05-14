'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'

import { Badge, Card } from '@repo/ui'
import { useC3Analytics } from '@/hooks/use-c3-analytics'
import { C1_DEFINITION } from '@/lib/indicators-aps/c1-data'
import { INDICATOR_LIST } from '@/lib/indicators-aps'

interface IndicatorRow {
  code: string
  shortLabel: string
  title: string
  href: string
  accent: string
}

const ACCENTS: Record<string, string> = {
  c1: 'from-cyan-500/20 to-cyan-500/0 text-cyan-600 dark:text-cyan-400',
  c2: 'from-sky-500/20 to-sky-500/0 text-sky-600 dark:text-sky-400',
  c3: 'from-rose-500/20 to-rose-500/0 text-rose-600 dark:text-rose-400',
  c4: 'from-violet-500/20 to-violet-500/0 text-violet-600 dark:text-violet-400',
  c5: 'from-amber-500/20 to-amber-500/0 text-amber-600 dark:text-amber-400',
  c6: 'from-emerald-500/20 to-emerald-500/0 text-emerald-600 dark:text-emerald-400',
  c7: 'from-pink-500/20 to-pink-500/0 text-pink-600 dark:text-pink-400',
}

function buildRows(): IndicatorRow[] {
  const c1: IndicatorRow = {
    code: C1_DEFINITION.code,
    shortLabel: C1_DEFINITION.shortLabel,
    title: C1_DEFINITION.title,
    href: `/indicadores/${C1_DEFINITION.code}`,
    accent: ACCENTS.c1 ?? '',
  }
  const others = INDICATOR_LIST.map((i) => ({
    code: i.code,
    shortLabel: i.shortLabel,
    title: i.title,
    href: `/indicadores/${i.code}`,
    accent: ACCENTS[i.code] ?? '',
  }))
  return [c1, ...others]
}

export function IndicatorsOverview() {
  const c3 = useC3Analytics()
  const rows = buildRows()

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-sm font-semibold tracking-tight">
            Linhas de cuidado APS
          </h2>
          <p className="text-muted-foreground text-xs">
            Status atual por indicador do Previne Brasil
          </p>
        </div>
        <Link
          href="/indicadores"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-medium transition-colors"
        >
          Ver todos
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {rows.map((row, i) => (
          <IndicatorCard
            key={row.code}
            row={row}
            index={i}
            c3Rate={row.code === 'c3' && !c3.isLoading ? c3.breakdown.avgScore : null}
            isLoading={row.code === 'c3' && c3.isLoading}
          />
        ))}
      </div>
    </section>
  )
}

interface IndicatorCardProps {
  row: IndicatorRow
  index: number
  c3Rate: number | null
  isLoading: boolean
}

function IndicatorCard({ row, index, c3Rate, isLoading }: IndicatorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link href={row.href} className="group block h-full">
        <Card className="border-border/60 relative h-full overflow-hidden p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-50 ${row.accent}`}
          />
          <div className="relative flex h-full flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="rounded-md font-mono text-[10px] uppercase">
                {row.shortLabel}
              </Badge>
              <ArrowUpRight className="text-muted-foreground/60 group-hover:text-foreground h-3.5 w-3.5 shrink-0 transition-colors" />
            </div>
            <div>
              <p className="text-foreground line-clamp-2 text-xs font-semibold leading-snug">
                {row.title}
              </p>
              <CardStatus c3Rate={c3Rate} code={row.code} isLoading={isLoading} />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}

function CardStatus({
  c3Rate,
  code,
  isLoading,
}: {
  c3Rate: number | null
  code: string
  isLoading: boolean
}) {
  if (code === 'c3') {
    if (isLoading) {
      return <div className="bg-muted mt-2 h-4 w-12 animate-pulse rounded" />
    }
    if (c3Rate !== null) {
      return (
        <p className="text-foreground mt-2 text-xl font-bold tabular-nums leading-none">
          {c3Rate.toFixed(1)}
          <span className="text-muted-foreground text-xs font-semibold"> /100</span>
        </p>
      )
    }
  }
  return (
    <div className="mt-2 inline-flex items-center gap-1">
      <Sparkles className="text-muted-foreground/60 h-3 w-3" />
      <span className="text-muted-foreground text-[10px] font-medium">Simulador disponível</span>
    </div>
  )
}
