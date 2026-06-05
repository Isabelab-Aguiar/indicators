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
    <div className="border-border/50 hover:bg-accent/40 group border-b px-4 py-3 transition-colors last:border-0">
      <div className="flex items-start gap-3">
        <div className="bg-muted text-muted-foreground mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
          {patient.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <button
              onClick={onSelect}
              className="text-foreground hover:text-primary text-left text-sm font-medium leading-snug underline-offset-2 hover:underline"
            >
              {patient.name}
            </button>
            <div className="mt-0.5 flex shrink-0 items-center gap-1">
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
                className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md p-1 transition-colors"
                title="Abrir prontuário"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-muted-foreground text-xs">Microárea {patient.microarea}</p>
            <span className="text-muted-foreground text-xs font-semibold tabular-nums">
              {patient.pctScore}%
            </span>
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', cls.badge)}>
              {cls.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
