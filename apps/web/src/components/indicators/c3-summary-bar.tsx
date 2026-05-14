'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Users, TrendingUp, Award, AlertTriangle, Activity, CheckCircle2 } from 'lucide-react'
import { cn } from '@repo/ui'
import type { C3Classification, C3CriterionStat, C3PatientRow } from '@repo/types'
import { CLASSIFICATION_STYLES } from './c3-colors'

interface C3SummaryBarProps {
  total: number
  avgScore: number
  classification: C3Classification
  criteriaStats: C3CriterionStat[]
  patients: C3PatientRow[]
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

export function C3SummaryBar({
  total,
  avgScore,
  classification,
  criteriaStats,
  patients,
}: C3SummaryBarProps) {
  const cls = CLASSIFICATION_STYLES[classification]

  const derived = useMemo(() => {
    const pending = patients.filter((p) => p.score < 100).length
    const coverageA = criteriaStats.find((s) => s.id === 'A')?.pctAchieved ?? 0
    const avgConsultations =
      total > 0
        ? Math.round(patients.reduce((acc, p) => acc + p.prenatalConsultations, 0) / total)
        : 0
    return { pending, coverageA, avgConsultations }
  }, [patients, criteriaStats, total])

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <KpiCard
        icon={Users}
        label="Gestantes avaliadas"
        value={<span className="text-foreground text-2xl font-bold tabular-nums">{total}</span>}
        sub="total na ESF"
        delay={0}
      />

      <KpiCard
        icon={TrendingUp}
        label="Adesão média"
        value={
          <div>
            <span className="text-foreground text-2xl font-bold tabular-nums">{avgScore}</span>
            <span className="text-muted-foreground ml-1 text-xs">pts</span>
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
        label="Pendências"
        value={
          <span className="text-foreground text-2xl font-bold tabular-nums">{derived.pending}</span>
        }
        sub="critérios incompletos"
        delay={0.15}
        accent="bg-amber-500/10 text-amber-600 dark:text-amber-400"
      />

      <KpiCard
        icon={Activity}
        label="Cobertura consultas"
        value={
          <div>
            <span className="text-foreground text-2xl font-bold tabular-nums">
              {derived.avgConsultations}
            </span>
            <span className="text-muted-foreground ml-1 text-xs">consultas/gestante</span>
          </div>
        }
        delay={0.2}
      />

      <KpiCard
        icon={CheckCircle2}
        label="Critério A — consultas ≥6"
        value={
          <div>
            <span className="text-foreground text-2xl font-bold tabular-nums">
              {derived.coverageA}%
            </span>
            <MiniProgressBar pct={derived.coverageA} hex="#10b981" />
          </div>
        }
        delay={0.25}
        accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      />
    </div>
  )
}
