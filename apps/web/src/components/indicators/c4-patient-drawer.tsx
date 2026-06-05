'use client'

import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Users, Search } from 'lucide-react'
import { cn } from '@repo/ui'
import type { C4CriterionStat, C4PatientRow } from '@repo/types'
import type { CriterionColor } from './c3-colors'
import { CLASSIFICATION_STYLES } from './c3-colors'
import { PatientDetailModal } from './patient-detail-modal'
import { buildC4Criteria, buildC4Sections } from './c4-drawer-data'

interface C4PatientDrawerProps {
  stat: C4CriterionStat
  patients: C4PatientRow[]
  achieved: boolean
  color: CriterionColor
  onClose: () => void
}

function filterPatients(patients: C4PatientRow[], id: C4CriterionStat['id'], achieved: boolean) {
  return patients.filter((p) => (achieved ? p.criteria[id] : !p.criteria[id]))
}

function PatientItem({ patient, onSelect }: { patient: C4PatientRow; onSelect: () => void }) {
  const cls = CLASSIFICATION_STYLES[patient.classification]
  return (
    <div className="border-border/50 hover:bg-accent/40 border-b px-4 py-3 transition-colors last:border-0">
      <div className="flex items-start gap-3">
        <div className="bg-muted text-muted-foreground mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
          {patient.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <button
            onClick={onSelect}
            className="text-foreground hover:text-primary text-left text-sm font-medium leading-snug underline-offset-2 hover:underline"
          >
            {patient.name}
          </button>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-muted-foreground text-xs">Microárea {patient.microarea}</p>
            <span className="text-muted-foreground text-xs font-semibold tabular-nums">
              {patient.score}%
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

export function C4PatientDrawer({
  stat,
  patients,
  achieved,
  color,
  onClose,
}: C4PatientDrawerProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<C4PatientRow | null>(null)
  const filtered = useMemo(() => {
    const base = filterPatients(patients, stat.id, achieved)
    if (!search) return base
    return base.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  }, [patients, stat.id, achieved, search])

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex" onClick={onClose}>
          <motion.div
            className="bg-background/60 absolute inset-0 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="border-border bg-card relative ml-auto flex h-full w-full max-w-md flex-col overflow-hidden border-l shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-border flex items-center justify-between border-b px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ring-1',
                      color.badge,
                      color.ring,
                    )}
                  >
                    {stat.id}
                  </div>
                  <p className="text-foreground text-sm font-semibold">
                    {achieved ? 'Atingiram' : 'Não atingiram'}
                  </p>
                </div>
                <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
                  <Users className="h-3 w-3" />
                  {filtered.length} paciente{filtered.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={onClose}
                className="hover:bg-muted rounded-lg p-1.5 transition-colors"
              >
                <X className="text-muted-foreground h-4 w-4" />
              </button>
            </div>
            <div className="border-border border-b px-5 py-3">
              <div className="border-border bg-muted/40 flex items-center gap-2 rounded-lg border px-3 py-2">
                <Search className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar paciente..."
                  className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-xs outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground text-sm">Nenhum paciente encontrado</p>
                </div>
              ) : (
                filtered.map((p) => (
                  <PatientItem key={p.id} patient={p} onSelect={() => setSelected(p)} />
                ))
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {selected && (
        <PatientDetailModal
          patient={selected}
          subtitle={`Microárea ${selected.microarea} · ACS ${selected.acs}`}
          score={selected.score}
          scoreLabel="%"
          classification={selected.classification}
          criteria={buildC4Criteria(selected)}
          sections={buildC4Sections(selected)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
