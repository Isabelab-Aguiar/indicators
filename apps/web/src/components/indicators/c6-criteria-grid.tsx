'use client'

import type { C6CriterionStat, C6PatientRow } from '@repo/types'
import { C6CriterionChart } from './c6-criterion-chart'

interface C6CriteriaGridProps {
  criteriaStats: C6CriterionStat[]
  patients: C6PatientRow[]
}

export function C6CriteriaGrid({ criteriaStats, patients }: C6CriteriaGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {criteriaStats.map((stat, i) => (
        <C6CriterionChart key={stat.id} stat={stat} patients={patients} animationDelay={i * 0.04} />
      ))}
    </div>
  )
}
