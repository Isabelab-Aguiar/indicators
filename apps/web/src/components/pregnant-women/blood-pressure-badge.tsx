'use client'

import { Badge, type BadgeProps } from '@repo/ui'
import type { BloodPressureStatus } from '@repo/types'

interface BloodPressureBadgeProps {
  value: string | null
  status: BloodPressureStatus | null
}

const VARIANT_MAP: Record<BloodPressureStatus, BadgeProps['variant']> = {
  normal: 'success',
  elevated: 'warning',
  high: 'destructive',
  critical: 'critical',
}

const LABEL_MAP: Record<BloodPressureStatus, string> = {
  normal: 'Normal',
  elevated: 'Elevada',
  high: 'Alta',
  critical: 'Crítica',
}

export function BloodPressureBadge({ value, status }: BloodPressureBadgeProps) {
  if (!value) return <span className="text-muted-foreground">-</span>

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-foreground font-mono text-xs">{value}</span>
      {status && (
        <Badge variant={VARIANT_MAP[status]} className="px-1.5 py-0 text-[10px]">
          {LABEL_MAP[status]}
        </Badge>
      )}
    </div>
  )
}
