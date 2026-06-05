'use client'

import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Users, Search } from 'lucide-react'
import { cn } from '@repo/ui'
import type { C2CriterionStat, C2PatientRow } from '@repo/types'
import type { CriterionColor } from './c3-colors'
import { CLASSIFICATION_STYLES } from './c3-colors'
import { PatientDetailModal } from './patient-detail-modal'
import { buildC2Criteria, buildC2Sections } from './c2-drawer-data'

interface C2PatientDrawerProps {
  stat: C2CriterionStat
  patients: C2PatientRow[]
  achieved: boolean
  color: CriterionColor
  onClose: () => void
}

function filterPatients(patients: C2PatientRow[], id: C2CriterionStat['id'], achieved: boolean) {
  return patients.filter((p) => {
    if (p.notApplicableCriteria.includes(id)) return false
    return achieved ? p.criteria[id] : !p.criteria[id]
  })
}

function C2PatientItem({ patient, onSelect }: { patient: C2PatientRow; onSelect: () => void }) {
  const cls = CLASSIFICATION_STYLES[patient.classification]
  const age =
    patient.ageInDays !== null
      ? patient.ageInDays < 30
        ? `${patient.ageInDays}d`
        : patient.ageInDays < 365
          ? `${Math.floor(patient.ageInDays / 30)}m`
          : `${Math.floor(patient.ageInDays / 365)}a`
      : null

  return (
    <div className="border-border/50 hover:bg-accent/40 flex items-start gap-3 border-b px-5 py-3 transition-colors last:border-0">
      <div className="bg-muted text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
        {patient.name.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <button
          onClick={onSelect}
          className="text-foreground hover:text-primary text-left text-sm font-medium underline-offset-2 hover:underline"
        >
          {patient.name}
        </button>
        <div className="text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
          <span>Microárea {patient.microarea}</span>
          {age && <span>{age}</span>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="text-muted-foreground text-xs font-semibold tabular-nums">
          {patient.score}%
        </span>
        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', cls.badge)}>
          {cls.label}
        </span>
      </div>
    </div>
  )
}

export function C2PatientDrawer({
  stat,
  patients,
  achieved,
  color,
  onClose,
}: C2PatientDrawerProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<C2PatientRow | null>(null)

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
                  {filtered.length} criança{filtered.length !== 1 ? 's' : ''}
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
                  placeholder="Buscar criança..."
                  className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-xs outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground text-sm">Nenhuma criança encontrada</p>
                </div>
              ) : (
                filtered.map((p) => (
                  <C2PatientItem key={p.id} patient={p} onSelect={() => setSelected(p)} />
                ))
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {selected && (
        <PatientDetailModal
          patient={selected}
          subtitle={[`Microárea ${selected.microarea}`, selected.acs].filter(Boolean).join(' · ')}
          score={selected.score}
          scoreLabel="pts"
          classification={selected.classification}
          criteria={buildC2Criteria(selected)}
          sections={buildC2Sections(selected)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
