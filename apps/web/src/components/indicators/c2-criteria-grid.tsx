'use client'

import type { C2CriterionStat, C2PatientRow } from '@repo/types'
import { C2CriterionChart } from './c2-criterion-chart'

interface C2CriteriaGridProps {
  criteriaStats: C2CriterionStat[]
  patients: C2PatientRow[]
}

export function C2CriteriaGrid({ criteriaStats, patients }: C2CriteriaGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {criteriaStats.map((stat, i) => (
        <C2CriterionChart key={stat.id} stat={stat} patients={patients} animationDelay={i * 0.04} />
      ))}
    </div>
  )
}
