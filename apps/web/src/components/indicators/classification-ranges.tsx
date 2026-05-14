'use client'

import { CLASSIFICATIONS, type Classification } from '@/lib/indicators-aps'
import { cn } from '@repo/ui'

interface ClassificationRangesProps {
  active: Classification
}

const STYLES: Record<(typeof CLASSIFICATIONS)[number]['badge'], { dot: string; ring: string }> = {
  success: { dot: 'bg-emerald-500', ring: 'ring-emerald-500/40' },
  info: { dot: 'bg-blue-500', ring: 'ring-blue-500/40' },
  warning: { dot: 'bg-amber-500', ring: 'ring-amber-500/40' },
  destructive: { dot: 'bg-red-500', ring: 'ring-red-500/40' },
}

export function ClassificationRanges({ active }: ClassificationRangesProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {CLASSIFICATIONS.map((c) => {
        const isActive = c.key === active
        const style = STYLES[c.badge]
        return (
          <div
            key={c.key}
            className={cn(
              'rounded-xl border p-3 transition-all',
              isActive
                ? `bg-card border-transparent shadow-sm ring-2 ${style.ring}`
                : 'border-border bg-muted/30',
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn('h-2 w-2 rounded-full', style.dot)} />
              <p className="text-foreground text-xs font-semibold">{c.label}</p>
            </div>
            <p className="text-muted-foreground mt-1 text-[11px] font-medium tabular-nums">
              {c.range}
            </p>
          </div>
        )
      })}
    </div>
  )
}
