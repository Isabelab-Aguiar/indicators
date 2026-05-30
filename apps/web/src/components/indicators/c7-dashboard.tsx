'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@repo/ui'
import { INDICATORS } from '@/lib/indicators-aps'
import { getQuadrimestre, type Quadrimestre } from '@/lib/quadrimestre'
import { computeC7Breakdown, useC7Analytics } from '@/hooks/use-c7-analytics'
import { calcAge } from '@/lib/c7-eligibility'
import { C7SummaryBar } from './c7-summary-bar'
import { C7CriteriaGrid } from './c7-criteria-grid'
import { C7EmptyState, C7SkeletonGrid } from './c7-states'
import { C7Filters, type AgeRange } from './c7-filters'
import { PopulationCard } from './population-card'
import type { C7WomanRecord } from '@repo/types'

const indicator = INDICATORS.c7

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

function buildPeriodo(year: number, quad: Quadrimestre): string {
  return `${year}-${quad}`
}

const AGE_RANGE_BOUNDS: Record<AgeRange, { min: number; max: number } | null> = {
  '': null,
  '9-14': { min: 9, max: 14 },
  '14-24': { min: 14, max: 24 },
  '25-49': { min: 25, max: 49 },
  '50-64': { min: 50, max: 64 },
  '65-69': { min: 65, max: 69 },
}

function filterWomen(
  women: C7WomanRecord[],
  periodo: string,
  microarea: string,
  ageRange: AgeRange,
): C7WomanRecord[] {
  return women.filter((w) => {
    if (w.periodo !== periodo) return false
    if (microarea && w.microarea !== microarea) return false
    if (ageRange) {
      const bounds = AGE_RANGE_BOUNDS[ageRange]
      if (bounds) {
        const age = calcAge(w.birthDate)
        if (age < bounds.min || age > bounds.max) return false
      }
    }
    return true
  })
}

export function C7Dashboard() {
  const { isLoading, isError, women } = useC7Analytics()

  const now = useMemo(() => new Date(), [])
  const [quad, setQuad] = useState<Quadrimestre>(() => getQuadrimestre(now))
  const [year, setYear] = useState<number>(() => now.getFullYear())
  const [microarea, setMicroarea] = useState<string>('')
  const [ageRange, setAgeRange] = useState<AgeRange>('')

  const microareaOptions = useMemo(() => {
    const set = new Set<string>()
    for (const w of women) if (w.microarea) set.add(w.microarea)
    return Array.from(set).sort()
  }, [women])

  const filtered = useMemo(
    () => filterWomen(women, buildPeriodo(year, quad), microarea, ageRange),
    [women, year, quad, microarea, ageRange],
  )

  const breakdown = useMemo(() => computeC7Breakdown(filtered), [filtered])

  if (isLoading) return <C7SkeletonGrid />
  if (isError) return <ErrorState />

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-wrap items-start gap-2">
        <Badge variant="secondary" className="rounded-md font-mono">
          C7
        </Badge>
        <Badge variant="outline" className="rounded-md text-[11px]">
          Prevenção do Câncer
        </Badge>
      </div>

      <PopulationCard population={indicator.population} />

      <C7Filters
        quad={quad}
        year={year}
        microarea={microarea}
        ageRange={ageRange}
        microareaOptions={microareaOptions}
        onQuadChange={setQuad}
        onYearChange={setYear}
        onMicroareaChange={setMicroarea}
        onAgeRangeChange={setAgeRange}
      />

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
