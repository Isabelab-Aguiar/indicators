'use client'

import type { C4CriterionStat, C4PatientRow } from '@repo/types'
import { C4CriterionChart } from './c4-criterion-chart'

interface C4CriteriaGridProps {
  criteriaStats: C4CriterionStat[]
  patients: C4PatientRow[]
}

export function C4CriteriaGrid({ criteriaStats, patients }: C4CriteriaGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {criteriaStats.map((stat, i) => (
        <C4CriterionChart key={stat.id} stat={stat} patients={patients} animationDelay={i * 0.04} />
      ))}
    </div>
  )
}
