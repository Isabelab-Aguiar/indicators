'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { cn } from '@repo/ui'
import type { C3CriterionStat, C3PatientRow } from '@repo/types'
import type { CriterionColor } from './c3-colors'
import { DANGER_COLORS } from './c3-colors'
import { PatientDrawer } from './patient-drawer'

type DrawerFilter = 'achieved' | 'not-achieved' | null

interface CriterionChartProps {
  stat: C3CriterionStat
  patients: C3PatientRow[]
  color: CriterionColor
  animationDelay?: number
}

function CriterionDonut({ pct, hex, hexMuted }: { pct: number; hex: string; hexMuted: string }) {
  const data = [{ value: pct }, { value: Math.max(0, 100 - pct) }]
  return (
    <div className="relative h-[68px] w-[68px] shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={24}
            outerRadius={32}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
            isAnimationActive
            animationDuration={800}
          >
            <Cell fill={hex} />
            <Cell fill={hexMuted} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-foreground text-[13px] font-bold tabular-nums">{pct}%</span>
      </div>
    </div>
  )
}

interface ActionButtonProps {
  label: string
  count: number
  achieved: boolean
  color: CriterionColor
  onClick: () => void
}

function ActionButton({ label, count, achieved, color, onClick }: ActionButtonProps) {
  if (achieved) {
    return (
      <button
        onClick={onClick}
        className={cn(
          'group flex flex-col items-start gap-1.5 rounded-xl border border-transparent p-3.5 text-left transition-all active:scale-[0.98]',
          color.barLight,
          color.border,
        )}
      >
        <div className="flex w-full items-center justify-between">
          <TrendingUp className={cn('h-3.5 w-3.5', color.text)} />
          <ChevronRight
            className={cn('h-3 w-3 transition-transform group-hover:translate-x-0.5', color.text)}
          />
        </div>
        <span className={cn('text-2xl font-bold tabular-nums leading-none', color.text)}>
          {count}
        </span>
        <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex flex-col items-start gap-1.5 rounded-xl border border-transparent p-3.5 text-left transition-all active:scale-[0.98]',
        DANGER_COLORS.bg,
        DANGER_COLORS.border,
      )}
    >
      <div className="flex w-full items-center justify-between">
        <TrendingDown className={cn('h-3.5 w-3.5', DANGER_COLORS.text)} />
        <ChevronRight
          className={cn(
            'h-3 w-3 transition-transform group-hover:translate-x-0.5',
            DANGER_COLORS.text,
          )}
        />
      </div>
      <span className={cn('text-2xl font-bold tabular-nums leading-none', DANGER_COLORS.text)}>
        {count}
      </span>
      <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
        {label}
      </span>
    </button>
  )
}

export function CriterionChart({ stat, patients, color, animationDelay = 0 }: CriterionChartProps) {
  const [drawer, setDrawer] = useState<DrawerFilter>(null)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut', delay: animationDelay }}
        className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 transition-shadow hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
                color.badge,
              )}
            >
              {stat.id}
            </div>
            <div>
              <p className="text-foreground text-sm font-semibold leading-snug">{stat.label}</p>
              <p className="text-muted-foreground text-xs">
                {stat.total} gestante{stat.total !== 1 ? 's' : ''} avaliada
                {stat.total !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <CriterionDonut pct={stat.pctAchieved} hex={color.hex} hexMuted={color.hexMuted} />
        </div>

        <div className="space-y-1.5">
          <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
            <motion.div
              className={cn('h-full rounded-full', color.bar)}
              initial={{ width: 0 }}
              animate={{ width: `${stat.pctAchieved}%` }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: animationDelay + 0.1 }}
            />
          </div>
          <div className="text-muted-foreground flex items-center justify-between text-[10px] font-medium tabular-nums">
            <span className={cn('font-semibold', color.text)}>{stat.pctAchieved}% atingiram</span>
            <span>{stat.pctNotAchieved}% não atingiram</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <ActionButton
            label="Atingiram"
            count={stat.achieved}
            achieved
            color={color}
            onClick={() => setDrawer('achieved')}
          />
          <ActionButton
            label="Não atingiram"
            count={stat.notAchieved}
            achieved={false}
            color={color}
            onClick={() => setDrawer('not-achieved')}
          />
        </div>
      </motion.div>

      {drawer !== null && (
        <PatientDrawer
          stat={stat}
          patients={patients}
          achieved={drawer === 'achieved'}
          color={color}
          onClose={() => setDrawer(null)}
        />
      )}
    </>
  )
}
