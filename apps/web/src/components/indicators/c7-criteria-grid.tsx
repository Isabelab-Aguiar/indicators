'use client'

import type { C7CriterionStat, C7PatientRow } from '@repo/types'
import { C7CriterionChart } from './c7-criterion-chart'

interface C7CriteriaGridProps {
  criteriaStats: C7CriterionStat[]
  patients: C7PatientRow[]
}

export function C7CriteriaGrid({ criteriaStats, patients }: C7CriteriaGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {criteriaStats.map((stat, i) => (
        <C7CriterionChart key={stat.id} stat={stat} patients={patients} animationDelay={i * 0.04} />
      ))}
    </div>
  )
}
