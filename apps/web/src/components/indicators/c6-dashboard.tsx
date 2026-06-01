'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { INDICATORS } from '@/lib/indicators-aps'
import { computeC6Breakdown, useC6Analytics } from '@/hooks/use-c6-analytics'
import { useIndicatorFilters } from '@/providers/indicator-filters-provider'
import { C6SummaryBar } from './c6-summary-bar'
import { C6CriteriaGrid } from './c6-criteria-grid'
import { C6EmptyState, C6SkeletonGrid } from './c6-states'
import { PopulationCard } from './population-card'
import type { C6ElderlyRecord } from '@repo/types'

const indicator = INDICATORS.c6

function calcAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  const age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  return m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age
}

function filterElders(
  elders: C6ElderlyRecord[],
  periodo: string,
  microarea: string,
): C6ElderlyRecord[] {
  return elders.filter((e) => {
    if (e.periodo !== periodo) return false
    if (microarea && e.microarea !== microarea) return false
    return true
  })
}

function ErrorState() {
  return (
    <div className="border-border flex h-40 items-center justify-center rounded-2xl border border-dashed">
      <p className="text-muted-foreground text-sm">Erro ao carregar dados do indicador C6.</p>
    </div>
  )
}

function CriteriaHeader() {
  return (
    <div>
      <p className="text-foreground mb-1 text-sm font-semibold">Cobertura por critério</p>
      <p className="text-muted-foreground mb-4 text-xs">
        Taxa calculada sobre o total de idosos no período. Clique em <strong>Atingiram</strong> ou{' '}
        <strong>Não atingiram</strong> para filtrar.
      </p>
    </div>
  )
}

export function C6Dashboard() {
  const { isLoading, isError, elders } = useC6Analytics()
  const { filters, setMicroareaOptions } = useIndicatorFilters()
  const { quad, year, microarea } = filters

  useMemo(() => {
    const set = new Set<string>()
    for (const e of elders) if (e.microarea) set.add(e.microarea)
    setMicroareaOptions(Array.from(set).sort())
  }, [elders, setMicroareaOptions])

  const filtered = useMemo(
    () => filterElders(elders, `${year}-${quad}`, microarea),
    [elders, year, quad, microarea],
  )

  const breakdown = useMemo(() => computeC6Breakdown(filtered), [filtered])

  if (isLoading) return <C6SkeletonGrid />
  if (isError) return <ErrorState />

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PopulationCard population={indicator.population} />

      {breakdown.total === 0 ? (
        <C6EmptyState />
      ) : (
        <>
          <C6SummaryBar
            total={breakdown.total}
            avgScore={breakdown.avgScore}
            classification={breakdown.classification}
            criteriaStats={breakdown.criteriaStats}
            patients={breakdown.patients}
          />
          <div>
            <CriteriaHeader />
            <C6CriteriaGrid criteriaStats={breakdown.criteriaStats} patients={breakdown.patients} />
          </div>
        </>
      )}
    </motion.div>
  )
}
