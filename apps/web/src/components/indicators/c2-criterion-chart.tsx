'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, ChevronRight } from 'lucide-react'
import { cn } from '@repo/ui'
import type { C2CriterionStat, C2PatientRow } from '@repo/types'
import { colorForRate, type CriterionColor } from './c3-colors'
import { C2PatientDrawer } from './c2-patient-drawer'

type DrawerFilter = 'achieved' | 'not-achieved' | null

interface C2CriterionChartProps {
  stat: C2CriterionStat
  patients: C2PatientRow[]
  animationDelay?: number
}

function DetailRow({
  label,
  count,
  tone,
  direction,
  onClick,
}: {
  label: string
  count: number
  tone: CriterionColor
  direction: 'up' | 'down'
  onClick: () => void
}) {
  const Icon = direction === 'up' ? ArrowUpRight : ArrowDownRight
  return (
    <button
      onClick={onClick}
      className="hover:bg-muted/40 group flex items-center justify-between px-5 py-3 text-left transition-colors"
    >
      <span className="flex items-center gap-2.5">
        <Icon
          className={cn(
            'h-3.5 w-3.5 shrink-0',
            direction === 'up' ? tone.text : 'text-muted-foreground',
          )}
        />
        <span className="text-foreground text-xs font-medium">{label}</span>
      </span>
      <span className="flex items-center gap-2.5">
        <span
          className={cn(
            'text-sm font-bold tabular-nums leading-none',
            direction === 'up' ? tone.text : 'text-foreground',
          )}
        >
          {count}
        </span>
        <ChevronRight className="text-muted-foreground/40 group-hover:text-muted-foreground h-3.5 w-3.5 transition-all group-hover:translate-x-0.5" />
      </span>
    </button>
  )
}

export function C2CriterionChart({ stat, patients, animationDelay = 0 }: C2CriterionChartProps) {
  const [drawer, setDrawer] = useState<DrawerFilter>(null)
  const tone = colorForRate(stat.pctAchieved)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut', delay: animationDelay }}
        whileHover={{ y: -2 }}
        className="border-border bg-card relative flex flex-col overflow-hidden rounded-2xl border shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]"
      >
        <div className={cn('absolute inset-x-0 top-0 h-[2px]', tone.bar)} />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 right-0 h-32 w-32 rounded-full opacity-50 blur-3xl"
          style={{ backgroundColor: tone.hexMuted }}
        />
        <div className="relative flex flex-col">
          <div className="flex items-start justify-between gap-3 p-5 pb-4">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ring-1',
                  tone.badge,
                  tone.ring,
                )}
              >
                {stat.id}
              </div>
              <div className="min-w-0">
                <p className="text-foreground line-clamp-2 text-[13px] font-semibold leading-snug tracking-tight">
                  {stat.label}
                </p>
                <p className="text-muted-foreground mt-1 text-[11px] font-medium tabular-nums">
                  {stat.total} criança{stat.total !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  'text-3xl font-bold tabular-nums leading-none tracking-tight',
                  tone.text,
                )}
              >
                {stat.pctAchieved}
                <span className="text-base font-semibold">%</span>
              </p>
              <p className="text-muted-foreground mt-1 text-[10px] font-semibold uppercase tracking-[0.08em]">
                cobertura
              </p>
            </div>
          </div>
          <div className="px-5 pb-5">
            <div className="bg-muted/60 relative h-2 w-full overflow-hidden rounded-full">
              <motion.div
                className={cn('h-full rounded-full', tone.bar)}
                initial={{ width: 0 }}
                animate={{ width: `${stat.pctAchieved}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: animationDelay + 0.1 }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-medium tabular-nums">
              <span className={cn('font-semibold uppercase tracking-wider', tone.text)}>
                {stat.pctAchieved}% atingiram
              </span>
              <span className="text-muted-foreground uppercase tracking-wider">
                {stat.pctNotAchieved}% não atingiram
              </span>
            </div>
          </div>
          <div className="border-border/80 border-t" />
          <DetailRow
            label="Atingiram"
            count={stat.achieved}
            tone={tone}
            direction="up"
            onClick={() => setDrawer('achieved')}
          />
          <div className="border-border/40 border-t" />
          <DetailRow
            label="Não atingiram"
            count={stat.notAchieved}
            tone={tone}
            direction="down"
            onClick={() => setDrawer('not-achieved')}
          />
        </div>
      </motion.div>
      {drawer !== null && (
        <C2PatientDrawer
          stat={stat}
          patients={patients}
          achieved={drawer === 'achieved'}
          color={tone}
          onClose={() => setDrawer(null)}
        />
      )}
    </>
  )
}
