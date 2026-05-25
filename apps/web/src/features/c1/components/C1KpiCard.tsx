'use client'

import { Card, CardContent } from '@repo/ui'
import { cn } from '@repo/ui'

interface C1KpiCardProps {
  label: string
  value: React.ReactNode
  sub?: string
  icon: React.ElementType
  accent?: string
}

export function C1KpiCard({ label, value, sub, icon: Icon, accent }: C1KpiCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
            accent ?? 'bg-primary/10 text-primary',
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground truncate text-[11px] font-medium uppercase tracking-wide">
            {label}
          </p>
          <p className="text-foreground mt-0.5 text-xl font-bold tabular-nums">{value}</p>
          {sub && <p className="text-muted-foreground mt-0.5 text-[11px]">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
