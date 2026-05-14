'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

import { cn } from '@repo/ui'
import type { Criterion } from '@/lib/indicators-aps'

interface CriterionCardProps {
  criterion: Criterion
  achieved: boolean
  onToggle: () => void
}

export function CriterionCard({ criterion, achieved, onToggle }: CriterionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.985 }}
      className={cn(
        'group relative flex w-full flex-col items-start gap-3 overflow-hidden rounded-2xl border p-5 text-left transition-colors',
        'focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        achieved
          ? 'border-emerald-500/40 bg-emerald-500/[0.06]'
          : 'border-border bg-card hover:border-muted-foreground/40 hover:bg-muted/30',
      )}
      aria-pressed={achieved}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors',
              achieved
                ? 'bg-emerald-500 text-white shadow-[0_0_0_3px_rgba(16,185,129,0.18)]'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {achieved ? <Check className="h-4 w-4" /> : criterion.id}
          </div>
          <p
            className={cn(
              'text-foreground text-sm font-semibold leading-snug',
              achieved && 'text-emerald-700 dark:text-emerald-400',
            )}
          >
            {criterion.title}
          </p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tabular-nums',
            achieved
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {criterion.points} pts
        </span>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed">{criterion.description}</p>
    </motion.button>
  )
}
