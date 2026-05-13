'use client'

import { Building2 } from 'lucide-react'
import { Badge } from '@repo/ui'

interface TenantBadgeProps {
  esfName: string
  esfCode: string
  className?: string
}

export function TenantBadge({ esfName, esfCode, className }: TenantBadgeProps) {
  if (!esfName) return null

  return (
    <div
      className={`border-border bg-muted/50 flex items-center gap-2 rounded-lg border px-3 py-2 ${className ?? ''}`}
    >
      <Building2 className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-xs font-medium">{esfName}</p>
        <p className="text-muted-foreground text-[10px]">{esfCode}</p>
      </div>
      <Badge variant="secondary" className="shrink-0 px-1.5 py-0 text-[10px]">
        ESF
      </Badge>
    </div>
  )
}
