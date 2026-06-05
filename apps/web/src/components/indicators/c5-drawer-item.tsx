'use client'

import { motion } from 'framer-motion'
import { cn } from '@repo/ui'
import type { C5PatientRow } from '@repo/types'
import { CLASSIFICATION_STYLES } from './c3-colors'
import type { CriterionColor } from './c3-colors'

export function C5DrawerProgress({ pct, color }: { pct: number; color: CriterionColor }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium">
        <span className="text-muted-foreground">Cobertura do critério</span>
        <span className={cn('font-bold tabular-nums', color.text)}>{pct}%</span>
      </div>
      <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
        <motion.div
          className={cn('h-full rounded-full', color.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export function C5PatientItem({
  patient,
  achieved,
  onSelect,
}: {
  patient: C5PatientRow
  achieved: boolean
  onSelect: () => void
}) {
  const cls = CLASSIFICATION_STYLES[patient.classification]
  return (
    <div className="border-border/50 hover:bg-accent/40 group border-b px-4 py-3 transition-colors last:border-0">
      <div className="flex items-start gap-3">
        <div className="bg-muted text-muted-foreground mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
          {patient.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <button
              onClick={onSelect}
              className="text-foreground hover:text-primary text-left text-sm font-medium leading-snug underline-offset-2 hover:underline"
            >
              {patient.name}
            </button>
            <span
              className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                achieved ? 'bg-emerald-500/15 text-emerald-600' : 'bg-red-500/15 text-red-600',
              )}
            >
              {achieved ? '✓' : '✗'}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-muted-foreground text-xs">
              {patient.age !== null ? `${patient.age} anos · ` : ''}Microárea {patient.microarea}
            </p>
            <span className="text-muted-foreground text-xs font-semibold tabular-nums">
              {patient.score}%
            </span>
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', cls.badge)}>
              {cls.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
