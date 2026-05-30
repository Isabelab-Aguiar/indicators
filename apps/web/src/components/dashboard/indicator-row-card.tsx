'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@repo/ui'

export interface IndicatorRowItem {
  code: string
  shortLabel: string
  title: string
  subtitle: string
  href: string
  score: number | null
  total: number
  isLoading: boolean
}

export function scoreColor(score: number) {
  if (score >= 80) return { bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' }
  if (score >= 60) return { bar: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' }
  if (score >= 40) return { bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' }
  return { bar: 'bg-red-500', text: 'text-red-600 dark:text-red-400' }
}

export function classLabel(score: number) {
  if (score >= 80) return 'Ótimo'
  if (score >= 60) return 'Bom'
  if (score >= 40) return 'Suficiente'
  return 'Regular'
}

function ScoreBar({
  item,
  index,
  colors,
}: {
  item: IndicatorRowItem
  index: number
  colors: ReturnType<typeof scoreColor>
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
          <motion.div
            className={cn('h-full rounded-full', colors.bar)}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(item.score!, 100)}%` }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 + 0.15 }}
          />
        </div>
        <span className={cn('w-8 text-right text-xs font-bold tabular-nums', colors.text)}>
          {item.score!.toFixed(0)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className={cn('text-[10px] font-semibold', colors.text)}>
          {classLabel(item.score!)}
        </span>
        <span className="text-muted-foreground text-[10px] tabular-nums">
          {item.total} {item.total === 1 ? 'paciente' : 'pacientes'}
        </span>
      </div>
    </>
  )
}

export function IndicatorRowCard({ item, index }: { item: IndicatorRowItem; index: number }) {
  const hasScore = item.score !== null && !item.isLoading && item.total > 0
  const colors = hasScore ? scoreColor(item.score!) : null

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={item.href} className="group block">
        <div className="hover:bg-accent/30 flex items-center gap-4 px-5 py-4 transition-colors duration-150">
          <div className="flex w-10 shrink-0 items-center justify-center">
            <span className="border-border bg-muted text-foreground inline-flex items-center rounded-lg border px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-wider">
              {item.shortLabel}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate text-sm font-semibold">{item.title}</p>
            <p className="text-muted-foreground mt-0.5 truncate text-xs">{item.subtitle}</p>
          </div>
          <div className="flex w-48 shrink-0 flex-col gap-1.5">
            {item.isLoading ? (
              <div className="bg-muted h-2 w-full animate-pulse rounded-full" />
            ) : !hasScore ? (
              <p className="text-muted-foreground/50 text-xs">sem dados</p>
            ) : (
              <ScoreBar item={item} index={index} colors={colors!} />
            )}
          </div>
          <ArrowUpRight className="text-muted-foreground/30 group-hover:text-foreground h-4 w-4 shrink-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </Link>
    </motion.div>
  )
}
