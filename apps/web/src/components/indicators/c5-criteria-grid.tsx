'use client'

import type { C5CriterionStat, C5PatientRow } from '@repo/types'
import { C5CriterionChart } from './c5-criterion-chart'

interface C5CriteriaGridProps {
  criteriaStats: C5CriterionStat[]
  patients: C5PatientRow[]
}

export function C5CriteriaGrid({ criteriaStats, patients }: C5CriteriaGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {criteriaStats.map((stat, i) => (
        <C5CriterionChart key={stat.id} stat={stat} patients={patients} animationDelay={i * 0.04} />
      ))}
    </div>
  )
}
