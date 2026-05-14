'use client'

import type { C3CriterionStat, C3PatientRow } from '@repo/types'
import { CriterionChart } from './criterion-chart'

interface C3CriteriaGridProps {
  criteriaStats: C3CriterionStat[]
  patients: C3PatientRow[]
}

export function C3CriteriaGrid({ criteriaStats, patients }: C3CriteriaGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {criteriaStats.map((stat, i) => (
        <CriterionChart key={stat.id} stat={stat} patients={patients} animationDelay={i * 0.04} />
      ))}
    </div>
  )
}
