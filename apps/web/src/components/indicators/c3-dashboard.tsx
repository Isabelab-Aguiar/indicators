'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@repo/ui'
import type { PregnantWoman } from '@repo/types'
import { INDICATORS } from '@/lib/indicators-aps'
import { getQuadrimestre, isoInQuadrimestre, type Quadrimestre } from '@/lib/quadrimestre'
import { computeC3Breakdown, useC3Analytics } from '@/hooks/use-c3-analytics'
import { C3SummaryBar } from './c3-summary-bar'
import { C3CriteriaGrid } from './c3-criteria-grid'
import { C3EmptyState, C3SkeletonGrid } from './c3-states'
import { C3Filters } from './c3-filters'
import { PopulationCard } from './population-card'

const indicator = INDICATORS.c3

function ErrorState() {
  return (
    <div className="border-border flex h-40 items-center justify-center rounded-2xl border border-dashed">
      <p className="text-muted-foreground text-sm">Erro ao carregar dados do indicador C3.</p>
    </div>
  )
}

function CriteriaHeader() {
  return (
    <div>
      <p className="text-foreground mb-1 text-sm font-semibold">Adesão por critério</p>
      <p className="text-muted-foreground mb-4 text-xs">
        Clique em <strong>Atingiram</strong> ou <strong>Não atingiram</strong> para ver a lista de
        gestantes filtrada por critério.
      </p>
    </div>
  )
}

function filterElegiveis(
  women: PregnantWoman[],
  quad: Quadrimestre,
  year: number,
  microarea: string,
): PregnantWoman[] {
  return women.filter((g) => {
    if (microarea && g.microarea !== microarea) return false
    const candidates = [g.expectedDeliveryDate, g.interruptionDate].filter(
      (v): v is string => typeof v === 'string' && v.length > 0,
    )
    return candidates.some((iso) => isoInQuadrimestre(iso, year, quad))
  })
}

export function C3Dashboard() {
  const { isLoading, isError, women } = useC3Analytics()

  const now = useMemo(() => new Date(), [])
  const [quad, setQuad] = useState<Quadrimestre>(() => getQuadrimestre(now))
  const [year, setYear] = useState<number>(() => now.getFullYear())
  const [microarea, setMicroarea] = useState<string>('')

  const microareaOptions = useMemo(() => {
    const set = new Set<string>()
    for (const g of women) if (g.microarea) set.add(g.microarea)
    return Array.from(set).sort()
  }, [women])

  const elegiveis = useMemo(
    () => filterElegiveis(women, quad, year, microarea),
    [women, quad, year, microarea],
  )

  const breakdown = useMemo(() => computeC3Breakdown(elegiveis), [elegiveis])

  if (isLoading) return <C3SkeletonGrid />
  if (isError) return <ErrorState />

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-wrap items-start gap-2">
        <Badge variant="secondary" className="rounded-md font-mono">
          C3
        </Badge>
        <Badge variant="outline" className="rounded-md text-[11px]">
          Pré-Natal
        </Badge>
      </div>

      <PopulationCard population={indicator.population} />

      <C3Filters
        quad={quad}
        year={year}
        microarea={microarea}
        microareaOptions={microareaOptions}
        onQuadChange={setQuad}
        onYearChange={setYear}
        onMicroareaChange={setMicroarea}
      />

      {breakdown.total === 0 ? (
        <C3EmptyState />
      ) : (
        <>
          <C3SummaryBar
            total={breakdown.total}
            avgScore={breakdown.avgScore}
            classification={breakdown.classification}
            criteriaStats={breakdown.criteriaStats}
            patients={breakdown.patients}
          />

          <div>
            <CriteriaHeader />
            <C3CriteriaGrid criteriaStats={breakdown.criteriaStats} patients={breakdown.patients} />
          </div>
        </>
      )}
    </motion.div>
  )
}
