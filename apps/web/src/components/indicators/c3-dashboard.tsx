'use client'

import { motion } from 'framer-motion'
import { Badge } from '@repo/ui'
import { INDICATORS } from '@/lib/indicators-aps'
import { useC3Analytics } from '@/hooks/use-c3-analytics'
import { C3SummaryBar } from './c3-summary-bar'
import { C3CriteriaGrid } from './c3-criteria-grid'
import { C3EmptyState, C3SkeletonGrid } from './c3-states'
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

export function C3Dashboard() {
  const { isLoading, isError, breakdown } = useC3Analytics()

  if (isLoading) return <C3SkeletonGrid />
  if (isError) return <ErrorState />
  if (breakdown.total === 0) return <C3EmptyState />

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
    </motion.div>
  )
}
