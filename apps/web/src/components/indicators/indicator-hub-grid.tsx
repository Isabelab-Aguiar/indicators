'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Lock } from 'lucide-react'
import { cn } from '@repo/ui'
import { INDICATOR_LIST } from '@/lib/indicators-aps'

const ENABLED_CODES = new Set(['c1', 'c3', 'c4', 'c5', 'c6', 'c7'])

const CODE_NUMBER: Record<string, string> = {
  c1: '01',
  c2: '02',
  c3: '03',
  c4: '04',
  c5: '05',
  c6: '06',
  c7: '07',
}

export function IndicatorHubGrid() {
  return (
    <div className="border-border bg-border grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 xl:grid-cols-3">
      {INDICATOR_LIST.map((indicator, index) => {
        const enabled = ENABLED_CODES.has(indicator.code)
        return (
          <IndicatorCard
            key={indicator.code}
            indicator={indicator}
            index={index}
            enabled={enabled}
          />
        )
      })}
    </div>
  )
}

interface CardProps {
  indicator: (typeof INDICATOR_LIST)[number]
  index: number
  enabled: boolean
}

function CardInner({
  indicator,
  enabled,
}: {
  indicator: CardProps['indicator']
  enabled: boolean
}) {
  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4">
        <span className="text-muted-foreground/40 font-mono text-[11px] font-medium tabular-nums tracking-widest">
          {CODE_NUMBER[indicator.code] ?? indicator.shortLabel}
        </span>
        {enabled ? (
          <ArrowUpRight
            className={cn(
              'text-muted-foreground/30 h-4 w-4 shrink-0 transition-all duration-200',
              'group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5',
            )}
          />
        ) : (
          <Lock className="text-muted-foreground/20 h-3.5 w-3.5 shrink-0" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <p
          className={cn(
            'text-[15px] font-semibold leading-snug tracking-tight',
            enabled ? 'text-foreground' : 'text-muted-foreground/50',
          )}
        >
          {indicator.title}
        </p>
        <p
          className={cn(
            'line-clamp-2 text-xs leading-relaxed',
            enabled ? 'text-muted-foreground' : 'text-muted-foreground/40',
          )}
        >
          {indicator.subtitle}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span
          className={cn(
            'font-mono text-[10px] font-semibold uppercase tracking-widest',
            enabled ? 'text-muted-foreground/60' : 'text-muted-foreground/30',
          )}
        >
          {indicator.shortLabel}
        </span>
        <span className="text-muted-foreground/20 text-[10px]">·</span>
        <span
          className={cn(
            'text-[10px] tabular-nums',
            enabled ? 'text-muted-foreground/60' : 'text-muted-foreground/30',
          )}
        >
          {indicator.criteria?.length ?? 0} critérios
        </span>
        <span className="text-muted-foreground/20 text-[10px]">·</span>
        <span
          className={cn(
            'text-[10px] tabular-nums',
            enabled ? 'text-muted-foreground/60' : 'text-muted-foreground/30',
          )}
        >
          {indicator.maxScore ?? 100} pts
        </span>
        {!enabled && (
          <>
            <span className="text-muted-foreground/20 text-[10px]">·</span>
            <span className="text-muted-foreground/40 text-[10px]">em breve</span>
          </>
        )}
      </div>
    </>
  )
}

function IndicatorCard({ indicator, index, enabled }: CardProps) {
  const baseClass = cn(
    'group relative flex h-full min-h-[200px] flex-col bg-card p-6 transition-colors duration-200',
    enabled ? 'cursor-pointer hover:bg-accent/40' : 'cursor-default',
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
    >
      {enabled ? (
        <Link href={`/indicadores/${indicator.code}`} className={baseClass}>
          <CardInner indicator={indicator} enabled={enabled} />
        </Link>
      ) : (
        <div className={baseClass}>
          <CardInner indicator={indicator} enabled={enabled} />
        </div>
      )}
    </motion.div>
  )
}
