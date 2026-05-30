'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@repo/ui'
import { INDICATORS } from '@/lib/indicators-aps'
import { getQuadrimestre, type Quadrimestre } from '@/lib/quadrimestre'
import { computeC6Breakdown, useC6Analytics } from '@/hooks/use-c6-analytics'
import { C6SummaryBar } from './c6-summary-bar'
import { C6CriteriaGrid } from './c6-criteria-grid'
import { C6EmptyState, C6SkeletonGrid } from './c6-states'
import { C6Filters, type AgeRangeC6 } from './c6-filters'
import { PopulationCard } from './population-card'
import type { C6ElderlyRecord } from '@repo/types'

const indicator = INDICATORS.c6

const AGE_RANGE_BOUNDS: Record<AgeRangeC6, { min: number; max: number } | null> = {
  '': null,
  '60-69': { min: 60, max: 69 },
  '70-79': { min: 70, max: 79 },
  '80+': { min: 80, max: 150 },
}

function calcAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  const age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  return m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age
}

function buildPeriodo(year: number, quad: Quadrimestre): string {
  return `${year}-${quad}`
}

function filterElders(
  elders: C6ElderlyRecord[],
  periodo: string,
  microarea: string,
  ageRange: AgeRangeC6,
): C6ElderlyRecord[] {
  return elders.filter((e) => {
    if (e.periodo !== periodo) return false
    if (microarea && e.microarea !== microarea) return false
    if (ageRange && e.birthDate) {
      const bounds = AGE_RANGE_BOUNDS[ageRange]
      if (bounds) {
        const age = calcAge(e.birthDate)
        if (age < bounds.min || age > bounds.max) return false
      }
    }
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

  const now = useMemo(() => new Date(), [])
  const [quad, setQuad] = useState<Quadrimestre>(() => getQuadrimestre(now))
  const [year, setYear] = useState<number>(() => now.getFullYear())
  const [microarea, setMicroarea] = useState<string>('')
  const [ageRange, setAgeRange] = useState<AgeRangeC6>('')

  const microareaOptions = useMemo(() => {
    const set = new Set<string>()
    for (const e of elders) if (e.microarea) set.add(e.microarea)
    return Array.from(set).sort()
  }, [elders])

  const filtered = useMemo(
    () => filterElders(elders, buildPeriodo(year, quad), microarea, ageRange),
    [elders, year, quad, microarea, ageRange],
  )

  const breakdown = useMemo(() => computeC6Breakdown(filtered), [filtered])

  if (isLoading) return <C6SkeletonGrid />
  if (isError) return <ErrorState />

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-wrap items-start gap-2">
        <Badge variant="secondary" className="rounded-md font-mono">
          C6
        </Badge>
        <Badge variant="outline" className="rounded-md text-[11px]">
          Cuidado da Pessoa Idosa
        </Badge>
      </div>

      <PopulationCard population={indicator.population} />

      <C6Filters
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
