'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@repo/ui'
import { CLASSIFICATION_STYLES } from './c3-colors'

export interface CriterionResult {
  id: string
  label: string
  achieved: boolean
}

export interface DetailField {
  label: string
  value: string | number | boolean | null | undefined
  format?: 'boolean' | 'number' | 'text'
}

export interface PatientDetailSection {
  title: string
  fields: DetailField[]
}

interface PatientDetailModalProps {
  name: string
  subtitle: string
  score: number
  scoreLabel: string
  classification: 'otimo' | 'bom' | 'suficiente' | 'regular'
  criteria: CriterionResult[]
  sections: PatientDetailSection[]
  onClose: () => void
}

function formatValue(field: DetailField): string {
  if (field.value === null || field.value === undefined) return '—'
  if (field.format === 'boolean' || typeof field.value === 'boolean')
    return field.value ? 'Sim' : 'Não'
  return String(field.value)
}

export function PatientDetailModal({
  name,
  subtitle,
  score,
  scoreLabel,
  classification,
  criteria,
  sections,
  onClose,
}: PatientDetailModalProps) {
  const cls = CLASSIFICATION_STYLES[classification]
  const achieved = criteria.filter((c) => c.achieved)
  const pending = criteria.filter((c) => !c.achieved)

  return (
    <AnimatePresence>
      <motion.div
        key="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal-content"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border-border relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border shadow-2xl sm:max-w-lg sm:rounded-2xl"
        >
          <div className="border-border flex items-start justify-between gap-4 border-b px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-muted text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-foreground text-sm font-semibold leading-tight">{name}</p>
                <p className="text-muted-foreground text-xs">{subtitle}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="text-right">
                <p className="text-foreground text-lg font-bold tabular-nums leading-none">
                  {score}
                  <span className="text-muted-foreground text-xs font-normal"> {scoreLabel}</span>
                </p>
                <span
                  className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', cls.badge)}
                >
                  {cls.label}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg p-1.5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-5 p-5">
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
                        <div
                          key={c.id}
                          className="bg-red-500/8 flex items-start gap-2 rounded-lg px-3 py-2"
                        >
                          <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                          <span className="text-foreground text-xs leading-snug">{c.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {sections.map((section) => (
                <div key={section.title}>
                  <p className="text-muted-foreground mb-2 text-[11px] font-semibold uppercase tracking-wide">
                    {section.title}
                  </p>
                  <div className="border-border divide-border divide-y rounded-lg border">
                    {section.fields.map((field) => (
                      <div
                        key={field.label}
                        className="flex items-center justify-between px-3 py-2"
                      >
                        <span className="text-muted-foreground text-xs">{field.label}</span>
                        <span className="text-foreground text-xs font-medium tabular-nums">
                          {formatValue(field)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
