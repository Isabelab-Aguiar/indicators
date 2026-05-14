'use client'

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts'

import type { Criterion } from '@/lib/indicators-aps'

interface CriteriaRadarProps {
  criteria: Criterion[]
  achieved: ReadonlySet<string>
}

export function CriteriaRadar({ criteria, achieved }: CriteriaRadarProps) {
  const data = criteria.map((c) => ({
    label: c.id,
    achievedValue: achieved.has(c.id) ? c.points : 0,
    maxValue: c.points,
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadarChart data={data} outerRadius="78%">
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="label"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 600 }}
        />
        <Radar
          dataKey="maxValue"
          stroke="hsl(var(--muted-foreground))"
          fill="hsl(var(--muted-foreground))"
          fillOpacity={0.08}
          isAnimationActive={false}
        />
        <Radar
          dataKey="achievedValue"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.35}
          animationDuration={400}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
