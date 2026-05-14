'use client'

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { useC3Analytics } from '@/hooks/use-c3-analytics'
import type { C3CriterionStat } from '@repo/types'

function fillForRate(pct: number): string {
  if (pct >= 80) return '#10b981'
  if (pct >= 60) return '#3b82f6'
  if (pct >= 40) return '#f59e0b'
  return '#ef4444'
}

interface TooltipPayloadEntry {
  payload?: C3CriterionStat
}

interface TooltipProps {
  active?: boolean
  payload?: TooltipPayloadEntry[]
}

function ChartTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  const stat = payload[0]?.payload
  if (!stat) return null
  return (
    <div className="border-border bg-card rounded-lg border p-3 shadow-lg">
      <p className="text-foreground text-xs font-semibold">{stat.label}</p>
      <p className="text-muted-foreground mt-1 text-[11px] tabular-nums">
        {stat.achieved} de {stat.total} ({stat.pctAchieved}%)
      </p>
    </div>
  )
}

export function C3ComplianceChart() {
  const { isLoading, breakdown } = useC3Analytics()

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Adesão por critério (C3)</CardTitle>
        <CardDescription className="text-xs">
          Percentual de gestantes que cumprem cada boa prática do pré-natal
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="bg-muted/40 h-[280px] animate-pulse rounded-lg" />
        ) : breakdown.total === 0 ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={breakdown.criteriaStats}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
              barCategoryGap={6}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(v: number) => `${v}%`}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="id"
                tick={{ fontSize: 11, fontWeight: 600, fill: 'hsl(var(--foreground))' }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.35 }}
              />
              <Bar dataKey="pctAchieved" radius={[0, 6, 6, 0]} barSize={18}>
                {breakdown.criteriaStats.map((stat, i) => (
                  <Cell key={`cell-${i}`} fill={fillForRate(stat.pctAchieved)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center">
      <p className="text-muted-foreground text-sm font-medium">Sem gestantes para avaliar</p>
      <p className="text-muted-foreground mt-1 text-xs">Importe um CSV para ver os dados</p>
    </div>
  )
}
