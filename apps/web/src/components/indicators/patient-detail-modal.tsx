'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Pencil } from 'lucide-react'
import { cn } from '@repo/ui'
import { useAuthStore } from '@/store/auth.store'
import { CLASSIFICATION_STYLES } from './c3-colors'
import type { C3PatientRow } from '@repo/types'
import { C3PatientEditModal } from './c3-patient-edit-modal'
import { PatientCriteriaGrid } from './patient-criteria-grid'

export interface PatientBase {
  id: string
  name: string
}

export interface CriterionResult {
  id: string
  label: string
  achieved: boolean
  notApplicable?: boolean
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
  patient: PatientBase
  subtitle: string
  score: number
  scoreLabel: string
  classification: 'otimo' | 'bom' | 'suficiente' | 'regular'
  criteria: CriterionResult[]
  sections: PatientDetailSection[]
  c3EditData?: C3PatientRow
  onClose: () => void
}

function formatValue(field: DetailField): string {
  if (field.value === null || field.value === undefined) return '—'
  if (field.format === 'boolean' || typeof field.value === 'boolean')
    return field.value ? 'Sim' : 'Não'
  return String(field.value)
}

const EDITABLE_ROLES = new Set(['admin', 'manager', 'nurse', 'doctor'])

export function PatientDetailModal({
  patient,
  subtitle,
  score,
  scoreLabel,
  classification,
  criteria,
  sections,
  c3EditData,
  onClose,
}: PatientDetailModalProps) {
  const role = useAuthStore((s) => s.user?.role)
  const canEdit = role ? EDITABLE_ROLES.has(role) : false
  const [editing, setEditing] = useState(false)

  const cls = CLASSIFICATION_STYLES[classification]

  return (
    <>
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
            <div className="border-border border-b px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold">
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-foreground truncate text-base font-bold leading-tight">
                      {patient.name}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">{subtitle}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                          cls.badge,
                        )}
                      >
                        {cls.label}
                      </span>
                      <span className="text-foreground text-sm font-bold tabular-nums">
                        {score}
                        <span className="text-muted-foreground text-[10px] font-normal">
                          {' '}
                          {scoreLabel}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {canEdit && c3EditData && (
                    <button
                      onClick={() => setEditing(true)}
                      title="Editar dados"
                      className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg p-1.5 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg p-1.5 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-5 p-5">
                <PatientCriteriaGrid criteria={criteria} />

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

      {editing && c3EditData && (
        <C3PatientEditModal
          patient={c3EditData}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false)
            onClose()
          }}
        />
      )}
    </>
  )
}
