'use client'

import { TrendingUp } from 'lucide-react'
import { cn } from '@repo/ui'
import { scoreColor, classLabel, type IndicatorRowItem } from './indicator-row-card'

interface GlobalScoreHeroProps {
  avg: number | null
  withData: IndicatorRowItem[]
}

export function GlobalScoreHero({ avg, withData }: GlobalScoreHeroProps) {
  const colors = avg !== null ? scoreColor(avg) : null
  const loaded = withData.filter((r) => r.score !== null).length

  return (
    <div className="from-card to-card/60 border-border/50 overflow-hidden rounded-2xl border bg-gradient-to-br p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
            Média geral Previne Brasil
          </p>
          {avg !== null && colors ? (
            <>
              <p className={cn('mt-1 text-4xl font-bold tabular-nums tracking-tight', colors.text)}>
                {avg.toFixed(1)}
                <span className="text-muted-foreground ml-1 text-base font-normal">pts</span>
              </p>
              <span
                className={cn(
                  'mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  colors.bg,
                  colors.text,
                )}
              >
                <TrendingUp className="h-3 w-3" />
                {classLabel(avg)}
              </span>
            </>
          ) : (
            <p className="text-muted-foreground mt-2 text-sm">Sem dados ainda</p>
          )}
        </div>

        <div className="text-right">
          <p className="text-muted-foreground text-xs">Indicadores</p>
          <p className="text-foreground text-2xl font-bold tabular-nums">
            {loaded}
            <span className="text-muted-foreground text-sm font-normal">/7</span>
          </p>
          <p className="text-muted-foreground text-[10px]">com dados</p>
        </div>
      </div>

      {withData.length > 0 && (
        <div className="mt-4 grid grid-cols-7 gap-1">
          {withData.map((item) => {
            const c = item.score !== null ? scoreColor(item.score) : null
            return (
              <div key={item.code} className="flex flex-col items-center gap-1">
                <div className="bg-muted h-8 w-full overflow-hidden rounded-md">
                  {item.score !== null && c ? (
                    <div
                      className={cn('w-full rounded-md transition-all', c.bar)}
                      style={{
                        height: `${Math.max(10, item.score)}%`,
                        marginTop: `${100 - Math.max(10, item.score)}%`,
                      }}
                    />
                  ) : (
                    <div className="h-full w-full animate-pulse" />
                  )}
                </div>
                <span className="text-muted-foreground font-mono text-[9px] font-bold uppercase">
                  {item.shortLabel}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
