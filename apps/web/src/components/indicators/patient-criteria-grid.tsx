'use client'

import { CheckCircle2, XCircle } from 'lucide-react'
import type { CriterionResult } from './patient-detail-modal'

interface PatientCriteriaGridProps {
  criteria: CriterionResult[]
}

export function PatientCriteriaGrid({ criteria }: PatientCriteriaGridProps) {
  const achieved = criteria.filter((c) => c.achieved)
  const pending = criteria.filter((c) => !c.achieved)

  if (achieved.length === 0 && pending.length === 0) return null

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {achieved.length > 0 && (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Atingidos ({achieved.length})
          </p>
          <div className="space-y-1.5">
            {achieved.map((c) => (
              <div
                key={c.id}
                className="bg-emerald-500/8 flex items-start gap-2 rounded-lg px-3 py-2"
              >
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span className="text-foreground text-xs leading-snug">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {pending.length > 0 && (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-red-500">
            <XCircle className="h-3.5 w-3.5" />
            Pendentes ({pending.length})
          </p>
          <div className="space-y-1.5">
            {pending.map((c) => (
              <div key={c.id} className="bg-red-500/8 flex items-start gap-2 rounded-lg px-3 py-2">
                <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                <span className="text-foreground text-xs leading-snug">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
