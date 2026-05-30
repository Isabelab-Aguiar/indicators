'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@repo/ui'

export type ScoreState = 'loading' | 'no-data' | 'score'

export interface IndicatorStatus {
  code: string
  shortLabel: string
  title: string
  href: string
  scoreState: ScoreState
  score: number
  total: number
  isPercent?: boolean
}

export function ScoreDisplay({
  state,
  score,
  isPercent,
}: {
  state: ScoreState
  score: number
  isPercent?: boolean
}) {
  if (state === 'loading') {
    return <div className="bg-muted mt-3 h-7 w-16 animate-pulse rounded-md" />
  }
  if (state === 'no-data') {
    return <p className="text-muted-foreground/50 mt-3 text-[11px] font-medium">sem dados</p>
  }
  return (
    <p className="text-foreground mt-3 text-2xl font-bold tabular-nums leading-none tracking-tight">
      {score.toFixed(1)}
      <span className="text-muted-foreground ml-1 text-[11px] font-semibold">
        {isPercent ? '%' : '/100'}
      </span>
    </p>
  )
}

export function ScoreBar({ state, score }: { state: ScoreState; score: number }) {
  if (state !== 'score') return null
  const color =
    score >= 80
      ? 'bg-emerald-500'
      : score >= 60
        ? 'bg-blue-500'
        : score >= 40
          ? 'bg-amber-500'
          : 'bg-red-500'

  return (
    <div className="bg-muted mt-3 h-1 w-full overflow-hidden rounded-full">
      <motion.div
        className={cn('h-full rounded-full', color)}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(score, 100)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  )
}

export function IndicatorCard({ item, index }: { item: IndicatorStatus; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Link href={item.href} className="group block h-full">
        <div className="border-border bg-card group-hover:bg-accent/30 flex h-full flex-col rounded-2xl border p-4 transition-colors duration-200">
          <div className="flex items-start justify-between gap-2">
            <span className="border-border bg-muted text-foreground inline-flex items-center rounded-lg border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider">
              {item.shortLabel}
            </span>
            <ArrowUpRight className="text-muted-foreground/30 group-hover:text-foreground mt-0.5 h-3.5 w-3.5 shrink-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          <p className="text-foreground mt-3 text-xs font-semibold leading-snug">{item.title}</p>
          <div className="mt-auto">
            <ScoreDisplay state={item.scoreState} score={item.score} isPercent={item.isPercent} />
            <ScoreBar state={item.scoreState} score={item.score} />
            {item.scoreState === 'score' && item.total > 0 && (
              <p className="text-muted-foreground mt-1.5 text-[10px] tabular-nums">
                {item.total} {item.isPercent ? 'execuç.' : `paciente${item.total !== 1 ? 's' : ''}`}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
