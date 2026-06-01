'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { INDICATORS } from '@/lib/indicators-aps'
import { computeC7Breakdown, useC7Analytics } from '@/hooks/use-c7-analytics'
import { useIndicatorFilters } from '@/providers/indicator-filters-provider'
import { C7SummaryBar } from './c7-summary-bar'
import { C7CriteriaGrid } from './c7-criteria-grid'
import { C7EmptyState, C7SkeletonGrid } from './c7-states'
import { PopulationCard } from './population-card'
import type { C7WomanRecord } from '@repo/types'

const indicator = INDICATORS.c7

function filterWomen(women: C7WomanRecord[], periodo: string, microarea: string): C7WomanRecord[] {
  return women.filter((w) => {
    if (w.periodo !== periodo) return false
    if (microarea && w.microarea !== microarea) return false
    return true
  })
}

function ErrorState() {
  return (
    <div className="border-border flex h-40 items-center justify-center rounded-2xl border border-dashed">
      <p className="text-muted-foreground text-sm">Erro ao carregar dados do indicador C7.</p>
    </div>
  )
}

function CriteriaHeader() {
  return (
    <div>
      <p className="text-foreground mb-1 text-sm font-semibold">Cobertura por critério</p>
      <p className="text-muted-foreground mb-4 text-xs">
        Taxa calculada sobre mulheres elegíveis para cada critério. Clique em{' '}
        <strong>Atingiram</strong> ou <strong>Não atingiram</strong> para filtrar.
      </p>
    </div>
  )
}

export function C7Dashboard() {
  const { isLoading, isError, women } = useC7Analytics()
  const { filters, setMicroareaOptions } = useIndicatorFilters()
  const { quad, year, microarea } = filters

  useMemo(() => {
    const set = new Set<string>()
    for (const w of women) if (w.microarea) set.add(w.microarea)
    setMicroareaOptions(Array.from(set).sort())
  }, [women, setMicroareaOptions])

  const filtered = useMemo(
    () => filterWomen(women, `${year}-${quad}`, microarea),
    [women, year, quad, microarea],
  )

  const breakdown = useMemo(() => computeC7Breakdown(filtered), [filtered])

  if (isLoading) return <C7SkeletonGrid />
  if (isError) return <ErrorState />

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PopulationCard population={indicator.population} />

      {breakdown.total === 0 ? (
        <C7EmptyState />
      ) : (
        <>
          <C7SummaryBar
            total={breakdown.total}
            avgScore={breakdown.avgScore}
            classification={breakdown.classification}
            criteriaStats={breakdown.criteriaStats}
            patients={breakdown.patients}
          />
          <div>
            <CriteriaHeader />
            <C7CriteriaGrid criteriaStats={breakdown.criteriaStats} patients={breakdown.patients} />
          </div>
        </>
      )}
    </motion.div>
  )
}
