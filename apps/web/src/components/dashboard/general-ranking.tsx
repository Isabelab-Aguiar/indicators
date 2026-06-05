'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { Trophy } from 'lucide-react'
import { useAllIndicatorsData, type IndicatorBar } from './use-all-indicators-data'

const RANK_CONFIG = [
  {
    circleClass: 'bg-emerald-500 text-white',
    statusLabel: 'Ótimo',
    statusClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  {
    circleClass: 'bg-blue-500 text-white',
    statusLabel: 'Bom',
    statusClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    circleClass: 'bg-red-500 text-white',
    statusLabel: 'Regular',
    statusClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
] as const

const RANK_NUMBER_CLASS = 'bg-muted text-muted-foreground'

interface RankRowProps {
  item: IndicatorBar
  position: number
}

function RankRow({ item, position }: RankRowProps) {
  const rank = RANK_CONFIG[position]
  const isTop3 = position < 3

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="flex w-6 shrink-0 justify-center">
        <span
          className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${isTop3 ? rank.circleClass : RANK_NUMBER_CLASS}`}
        >
          {position + 1}
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-foreground text-xs font-bold uppercase tracking-wider">
            {item.shortCode}
          </span>
          <span className="text-muted-foreground truncate text-xs">
            {item.label.split('—')[1]?.trim() ?? item.label}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="text-foreground text-sm font-semibold tabular-nums">
          {item.score !== null ? item.score.toFixed(1) : '—'}
        </span>
        {isTop3 && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${rank.statusClass}`}
          >
            {rank.statusLabel}
          </span>
        )}
      </div>
    </div>
  )
}

function SkeletonRows() {
  return (
    <div className="divide-border/40 divide-y">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="bg-muted h-5 w-5 animate-pulse rounded-full" />
          <div className="flex-1 space-y-1.5">
            <div className="bg-muted h-3 w-24 animate-pulse rounded" />
          </div>
          <div className="bg-muted h-4 w-12 animate-pulse rounded" />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Trophy className="text-muted-foreground/40 mb-2 h-8 w-8" />
      <p className="text-muted-foreground text-sm font-medium">Sem dados suficientes</p>
      <p className="text-muted-foreground mt-1 text-xs">Importe indicadores para ver o ranking</p>
    </div>
  )
}

export function GeneralRanking() {
  const { isLoading, data } = useAllIndicatorsData()

  const ranked = [...data]
    .filter((d) => d.score !== null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  const unranked = data.filter((d) => d.score === null)
  const all = [...ranked, ...unranked]

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Ranking geral</CardTitle>
        <CardDescription className="text-xs">
          Indicadores ordenados por desempenho — mesma unidade
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <SkeletonRows />
        ) : ranked.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-border/40 divide-y">
            {all.map((item, i) => (
              <RankRow key={item.code} item={item} position={i} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
