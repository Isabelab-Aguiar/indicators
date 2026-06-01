'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { INDICATORS } from '@/lib/indicators-aps'
import { computeC5Breakdown, useC5Analytics } from '@/hooks/use-c5-analytics'
import { useIndicatorFilters } from '@/providers/indicator-filters-provider'
import { C5SummaryBar } from './c5-summary-bar'
import { C5CriteriaGrid } from './c5-criteria-grid'
import { C5EmptyState, C5SkeletonGrid } from './c5-states'
import { PopulationCard } from './population-card'
import type { C5HypertensiveRecord } from '@repo/types'

const indicator = INDICATORS.c5

function filterRecords(
  records: C5HypertensiveRecord[],
  periodo: string,
  microarea: string,
): C5HypertensiveRecord[] {
  return records.filter((r) => {
    if (r.periodo !== periodo) return false
    if (microarea && r.microarea !== microarea) return false
    return true
  })
}

function ErrorState() {
  return (
    <div className="border-border flex h-40 items-center justify-center rounded-2xl border border-dashed">
      <p className="text-muted-foreground text-sm">Erro ao carregar dados do indicador C5.</p>
    </div>
  )
}

function CriteriaHeader() {
  return (
    <div>
      <p className="text-foreground mb-1 text-sm font-semibold">Cobertura por critério</p>
      <p className="text-muted-foreground mb-4 text-xs">
        Taxa calculada sobre o total de hipertensos no período. Clique em <strong>Atingiram</strong>{' '}
        ou <strong>Não atingiram</strong> para filtrar.
      </p>
    </div>
  )
}

export function C5Dashboard() {
  const { isLoading, isError, records } = useC5Analytics()
  const { filters, setMicroareaOptions } = useIndicatorFilters()
  const { quad, year, microarea } = filters

  useMemo(() => {
    const set = new Set<string>()
    for (const r of records) if (r.microarea) set.add(r.microarea)
    setMicroareaOptions(Array.from(set).sort())
  }, [records, setMicroareaOptions])

  const filtered = useMemo(
    () => filterRecords(records, `${year}-${quad}`, microarea),
    [records, year, quad, microarea],
  )

  const breakdown = useMemo(() => computeC5Breakdown(filtered), [filtered])

  if (isLoading) return <C5SkeletonGrid />
  if (isError) return <ErrorState />

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PopulationCard population={indicator.population} />

      {breakdown.total === 0 ? (
        <C5EmptyState />
      ) : (
        <>
          <C5SummaryBar
            total={breakdown.total}
            avgScore={breakdown.avgScore}
            classification={breakdown.classification}
            criteriaStats={breakdown.criteriaStats}
            patients={breakdown.patients}
          />
          <div>
            <CriteriaHeader />
            <C5CriteriaGrid criteriaStats={breakdown.criteriaStats} patients={breakdown.patients} />
          </div>
        </>
      )}
    </motion.div>
  )
}
