'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@repo/ui'
import { INDICATORS } from '@/lib/indicators-aps'
import { getQuadrimestre, type Quadrimestre } from '@/lib/quadrimestre'
import { buildBreakdownFromPatients, useC2Analytics } from '@/hooks/use-c2-analytics'
import { useIndicatorFilters } from '@/providers/indicator-filters-provider'
import { C2SummaryBar } from './c2-summary-bar'
import { C2CriteriaGrid } from './c2-criteria-grid'
import { C2EmptyState, C2SkeletonGrid } from './c2-states'
import { C2Filters } from './c2-filters'
import { PopulationCard } from './population-card'

const indicator = INDICATORS.c2

function ErrorState() {
  return (
    <div className="border-border flex h-40 items-center justify-center rounded-2xl border border-dashed">
      <p className="text-muted-foreground text-sm">Erro ao carregar dados do indicador C2.</p>
    </div>
  )
}

function CriteriaHeader() {
  return (
    <div>
      <p className="text-foreground mb-1 text-sm font-semibold">Cobertura por critério</p>
      <p className="text-muted-foreground mb-4 text-xs">
        Taxa calculada sobre o total de crianças no período. Clique em <strong>Atingiram</strong> ou{' '}
        <strong>Não atingiram</strong> para filtrar.
      </p>
    </div>
  )
}

export function C2Dashboard() {
  const { isLoading, isError, breakdown } = useC2Analytics()
  const { filters, setMicroareaOptions } = useIndicatorFilters()
  const { microarea } = filters

  const microareaOptions = useMemo(() => {
    const set = new Set<string>()
    for (const p of breakdown.patients) if (p.microarea) set.add(p.microarea)
    const opts = Array.from(set).sort()
    setMicroareaOptions(opts)
    return opts
  }, [breakdown.patients, setMicroareaOptions])

  const filteredBreakdown = useMemo(() => {
    const patients = breakdown.patients.filter((p) => !microarea || p.microarea === microarea)
    return buildBreakdownFromPatients(patients)
  }, [breakdown.patients, microarea])

  if (isLoading) return <C2SkeletonGrid />
  if (isError) return <ErrorState />

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PopulationCard population={indicator.population} />

      {filteredBreakdown.total === 0 ? (
        <C2EmptyState />
      ) : (
        <>
          <C2SummaryBar
            total={filteredBreakdown.total}
            avgScore={filteredBreakdown.avgScore}
            classification={filteredBreakdown.classification}
            criteriaStats={filteredBreakdown.criteriaStats}
            patients={filteredBreakdown.patients}
          />
          <div>
            <CriteriaHeader />
            <C2CriteriaGrid
              criteriaStats={filteredBreakdown.criteriaStats}
              patients={filteredBreakdown.patients}
            />
          </div>
        </>
      )}
    </motion.div>
  )
}
