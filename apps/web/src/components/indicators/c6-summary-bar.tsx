'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Users, TrendingUp, Award, AlertTriangle, Syringe, Activity } from 'lucide-react'
import { cn } from '@repo/ui'
import type { C6Classification, C6CriterionStat, C6PatientRow } from '@repo/types'
import { CLASSIFICATION_STYLES } from './c3-colors'

interface C6SummaryBarProps {
  total: number
  avgScore: number
  classification: C6Classification
  criteriaStats: C6CriterionStat[]
  patients: C6PatientRow[]
}

interface KpiCardProps {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  sub?: string
  delay: number
  accent?: string
}

function KpiCard({ icon: Icon, label, value, sub, delay, accent }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="border-border bg-card flex items-center gap-4 rounded-2xl border p-4"
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          accent ?? 'bg-primary/8 text-primary',
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground mb-0.5 truncate text-[11px] font-medium uppercase tracking-wide">
          {label}
        </p>
        <div className="text-foreground">{value}</div>
        {sub && <p className="text-muted-foreground mt-0.5 text-[10px]">{sub}</p>}
      </div>
    </motion.div>
  )
}

function MiniProgressBar({ pct, hex }: { pct: number; hex: string }) {
  return (
    <div className="bg-muted mt-1 h-1 w-full overflow-hidden rounded-full">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: hex }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      />
    </div>
  )
}

export function C6SummaryBar({
  total,
  avgScore,
  classification,
  criteriaStats,
  patients,
}: C6SummaryBarProps) {
  const cls = CLASSIFICATION_STYLES[classification]

  const derived = useMemo(() => {
    const pending = patients.filter((p) => p.pendingCriteria.length > 0).length
    const statC = criteriaStats.find((s) => s.id === 'C')
    const statD = criteriaStats.find((s) => s.id === 'D')
    const semVisitaAcs = statC ? 100 - statC.pctAchieved : 0
    const semVacinaInfluenza = statD ? 100 - statD.pctAchieved : 0
    return { pending, semVisitaAcs, semVacinaInfluenza }
  }, [patients, criteriaStats])

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <KpiCard
        icon={Users}
        label="Idosos avaliados"
        value={<span className="text-foreground text-2xl font-bold tabular-nums">{total}</span>}
        sub="total na ESF"
        delay={0}
      />

      <KpiCard
        icon={TrendingUp}
        label="Score médio"
        value={
          <div>
            <span className="text-foreground text-2xl font-bold tabular-nums">{avgScore}</span>
            <span className="text-muted-foreground ml-1 text-xs">%</span>
            <MiniProgressBar pct={avgScore} hex={cls.hex} />
          </div>
        }
        delay={0.05}
      />

      <KpiCard
        icon={Award}
        label="Classificação"
        value={
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', cls.badge)}>
            {cls.label}
          </span>
        }
        sub="resultado geral"
        delay={0.1}
      />

      <KpiCard
        icon={AlertTriangle}
        label="Com pendências"
        value={
          <span className="text-foreground text-2xl font-bold tabular-nums">{derived.pending}</span>
        }
        sub="critérios incompletos"
        delay={0.15}
        accent="bg-amber-500/10 text-amber-600 dark:text-amber-400"
      />

      <KpiCard
        icon={Activity}
        label="Sem visita ACS (C)"
        value={
          <div>
            <span className="text-foreground text-2xl font-bold tabular-nums">
              {derived.semVisitaAcs.toFixed(1)}
            </span>
            <span className="text-muted-foreground ml-1 text-xs">%</span>
            <MiniProgressBar pct={derived.semVisitaAcs} hex="#f59e0b" />
          </div>
        }
        delay={0.2}
        accent="bg-amber-500/10 text-amber-600 dark:text-amber-400"
      />

      <KpiCard
        icon={Syringe}
        label="Sem vacina Influenza (D)"
        value={
          <div>
            <span className="text-foreground text-2xl font-bold tabular-nums">
              {derived.semVacinaInfluenza.toFixed(1)}
            </span>
            <span className="text-muted-foreground ml-1 text-xs">%</span>
            <MiniProgressBar pct={derived.semVacinaInfluenza} hex="#ef4444" />
          </div>
        }
        delay={0.25}
        accent="bg-red-500/10 text-red-600 dark:text-red-400"
      />
    </div>
  )
}
