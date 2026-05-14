'use client'

import { motion } from 'framer-motion'
import { Users, TrendingUp, Award } from 'lucide-react'
import { cn } from '@repo/ui'
import type { C3Classification } from '@repo/types'
import { CLASSIFICATION_STYLES } from './c3-colors'

interface C3SummaryBarProps {
  total: number
  avgScore: number
  classification: C3Classification
}

const ITEMS = [
  { icon: Users, label: 'Gestantes avaliadas', key: 'total' as const },
  { icon: TrendingUp, label: 'Pontuação média', key: 'avgScore' as const },
  { icon: Award, label: 'Classificação', key: 'classification' as const },
]

export function C3SummaryBar({ total, avgScore, classification }: C3SummaryBarProps) {
  const cls = CLASSIFICATION_STYLES[classification]

  const values: Record<(typeof ITEMS)[number]['key'], React.ReactNode> = {
    total: <span className="text-foreground text-2xl font-bold tabular-nums">{total}</span>,
    avgScore: <span className="text-foreground text-2xl font-bold tabular-nums">{avgScore}</span>,
    classification: (
      <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', cls.badge)}>
        {cls.label}
      </span>
    ),
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {ITEMS.map(({ icon: Icon, label, key }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="border-border bg-card flex items-center gap-4 rounded-2xl border p-4"
        >
          <div className="bg-primary/8 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
          </div>
          <div>
            <p className="text-muted-foreground mb-0.5 text-[11px] font-medium uppercase tracking-wide">
              {label}
            </p>
            {values[key]}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
