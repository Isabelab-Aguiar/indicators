'use client'

import { cn } from '@repo/ui'
import { C1_BANDS, classifyC1 } from '@/lib/indicators-aps/c1-data'

interface C1BandsLegendProps {
  percent: number
}

export function C1BandsLegend({ percent }: C1BandsLegendProps) {
  const active = classifyC1(percent).band
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {C1_BANDS.map((band, i) => {
        const isActive = band.min === active.min && band.max === active.max
        return (
          <div
            key={`${band.key}-${i}`}
            className={cn(
              'rounded-xl border p-3 transition-all',
              isActive
                ? 'bg-card border-transparent shadow-sm ring-2 ring-offset-1'
                : 'border-border bg-muted/30',
            )}
            style={isActive ? { boxShadow: `0 0 0 2px ${band.hex}40` } : undefined}
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: band.hex }} />
              <p className="text-foreground text-xs font-semibold">{band.label}</p>
            </div>
            <p className="text-muted-foreground mt-1 text-[11px] font-medium tabular-nums">
              {band.min}% a {band.max}%
            </p>
          </div>
        )
      })}
    </div>
  )
}
