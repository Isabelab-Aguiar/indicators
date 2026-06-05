'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, Search } from 'lucide-react'
import { cn } from '@repo/ui'
import type { C3CriterionStat, C3PatientRow, C3CriterionId } from '@repo/types'
import { filterByCriterion } from '@/hooks/use-c3-analytics'
import type { CriterionColor } from './c3-colors'
import { PatientDetailModal } from './patient-detail-modal'
import { buildC3Criteria, buildC3Sections } from './c3-drawer-data'
import { C3DrawerItem } from './c3-drawer-item'

interface PatientDrawerProps {
  stat: C3CriterionStat
  patients: C3PatientRow[]
  achieved: boolean
  color: CriterionColor
  onClose: () => void
}

function DrawerProgress({ pct, color }: { pct: number; color: CriterionColor }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium">
        <span className="text-muted-foreground">Cobertura do critério</span>
        <span className={cn('font-bold tabular-nums', color.text)}>{pct}%</span>
      </div>
      <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
        <motion.div
          className={cn('h-full rounded-full', color.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export function PatientDrawer({ stat, patients, achieved, color, onClose }: PatientDrawerProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<C3PatientRow | null>(null)

  const filtered = useMemo(() => {
    const base = filterByCriterion(patients, stat.id as C3CriterionId, achieved)
    if (!search.trim()) return base
    const q = search.toLowerCase()
    return base.filter(
      (p) => p.name.toLowerCase().includes(q) || p.microarea.toLowerCase().includes(q),
    )
  }, [patients, stat.id, achieved, search])

  const count = achieved ? stat.achieved : stat.notAchieved

  return (
    <>
      <AnimatePresence>
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.aside
          key="drawer"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 36 }}
          className="bg-card fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col shadow-2xl sm:max-w-lg"
        >
          <div className="border-border flex items-start justify-between gap-4 border-b p-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', color.badge)}>
                  {stat.id}
                </span>
                <span
                  className={cn(
                    'text-xs font-semibold',
                    achieved ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500',
                  )}
                >
                  {achieved ? 'Atingiram' : 'Não atingiram'}
                </span>
              </div>
              <p className="text-foreground text-sm font-semibold">{stat.label}</p>
              <p className="text-muted-foreground text-xs">
                <span className="text-foreground font-bold tabular-nums">{count}</span> gestante
                {count !== 1 ? 's' : ''} ({achieved ? stat.pctAchieved : stat.pctNotAchieved}%)
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-accent mt-0.5 rounded-lg p-1.5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="border-border space-y-3 border-b px-5 py-3">
            <DrawerProgress pct={stat.pctAchieved} color={color} />
            <div className="relative">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome ou microárea…"
                className="border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none focus:ring-1"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center gap-2">
                <Users className="text-muted-foreground h-7 w-7" />
                <p className="text-muted-foreground text-sm">
                  {search ? 'Nenhum resultado encontrado' : 'Nenhuma gestante nesta categoria'}
                </p>
              </div>
            ) : (
              filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <C3DrawerItem patient={p} achieved={achieved} onSelect={() => setSelected(p)} />
                </motion.div>
              ))
            )}
          </div>

          <div className="border-border border-t px-5 py-3">
            <p className="text-muted-foreground text-center text-xs">
              {filtered.length} gestante{filtered.length !== 1 ? 's' : ''} exibida
              {filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        </motion.aside>
      </AnimatePresence>

      {selected && (
        <PatientDetailModal
          patient={selected}
          subtitle={[
            selected.gestationalAgeWeeks !== null
              ? `${selected.gestationalAgeWeeks} semanas`
              : null,
            `Microárea ${selected.microarea}`,
            `CPF ${selected.cpf}`,
          ]
            .filter(Boolean)
            .join(' · ')}
          score={selected.pctScore}
          scoreLabel="pts%"
          classification={selected.classification}
          criteria={buildC3Criteria(selected)}
          sections={buildC3Sections(selected)}
          c3EditData={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
