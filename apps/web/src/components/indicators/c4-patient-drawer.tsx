'use client'

import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Users, Search } from 'lucide-react'
import { cn } from '@repo/ui'
import type { C4CriterionStat, C4PatientRow } from '@repo/types'
import type { CriterionColor } from './c3-colors'
import { CLASSIFICATION_STYLES } from './c3-colors'

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

function PatientItem({ patient }: { patient: C4PatientRow }) {
  const cls = CLASSIFICATION_STYLES[patient.classification]
  return (
    <div className="border-border/50 hover:bg-accent/40 flex items-center gap-3 border-b px-5 py-3 transition-colors last:border-0">
      <div className="bg-muted text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold">
        {patient.name.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-medium">{patient.name}</p>
        <p className="text-muted-foreground text-xs">Microarea {patient.microarea}</p>
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

export function C4PatientDrawer({
  stat,
  patients,
  achieved,
  color,
  onClose,
}: C4PatientDrawerProps) {
  const [search, setSearch] = useState('')
  const filtered = useMemo(() => {
    const base = filterPatients(patients, stat.id, achieved)
    if (!search) return base
    return base.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  }, [patients, stat.id, achieved, search])

  return (
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
            <button onClick={onClose} className="hover:bg-muted rounded-lg p-1.5 transition-colors">
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
              filtered.map((p) => <PatientItem key={p.id} patient={p} />)
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
