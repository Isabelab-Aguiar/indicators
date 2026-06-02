'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { cn } from '@repo/ui'
import type { C3PatientRow } from '@repo/types'
import { CLASSIFICATION_STYLES } from './c3-colors'

interface C3DrawerItemProps {
  patient: C3PatientRow
  achieved: boolean
  onSelect: () => void
}

export function C3DrawerItem({ patient, achieved, onSelect }: C3DrawerItemProps) {
  const cls = CLASSIFICATION_STYLES[patient.classification]
  return (
    <div className="border-border/50 hover:bg-accent/40 group flex items-center gap-3 border-b px-5 py-3 transition-colors last:border-0">
      <div className="bg-muted text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold">
        {patient.name.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <button
          onClick={onSelect}
          className="text-foreground hover:text-primary truncate text-left text-sm font-medium underline-offset-2 hover:underline"
        >
          {patient.name}
        </button>
        <p className="text-muted-foreground text-xs">Microárea {patient.microarea}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="text-muted-foreground hidden text-xs font-semibold tabular-nums sm:block">
          {patient.pctScore}%
        </span>
        <span
          className={cn(
            'hidden rounded-full px-2 py-0.5 text-[10px] font-semibold sm:block',
            cls.badge,
          )}
        >
          {cls.label}
        </span>
        <span
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
            achieved ? 'bg-emerald-500/15 text-emerald-600' : 'bg-red-500/15 text-red-600',
          )}
        >
          {achieved ? '✓' : '✗'}
        </span>
        <Link
          href={`/gestantes/${patient.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md p-1.5 transition-colors"
          title="Abrir prontuário"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
