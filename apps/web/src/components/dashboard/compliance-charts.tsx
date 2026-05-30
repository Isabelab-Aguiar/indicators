'use client'

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { useC5Analytics } from '@/hooks/use-c5-analytics'
import { useC6Analytics } from '@/hooks/use-c6-analytics'
import { useC7Analytics } from '@/hooks/use-c7-analytics'

function fillForRate(pct: number): string {
  if (pct >= 80) return '#10b981'
  if (pct >= 60) return '#3b82f6'
  if (pct >= 40) return '#f59e0b'
  return '#ef4444'
}

interface StatRow {
  id: string
  label: string
  pctAchieved: number
  achieved: number
  total: number
}

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ payload?: StatRow }>
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
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

function CriteriaBarChart({ data }: { data: StatRow[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
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
        <Bar dataKey="pctAchieved" radius={[0, 6, 6, 0]} barSize={16}>
          {data.map((stat, i) => (
            <Cell key={`cell-${i}`} fill={fillForRate(stat.pctAchieved)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function EmptyState() {
  return (
    <div className="flex h-[220px] flex-col items-center justify-center">
      <p className="text-muted-foreground text-sm font-medium">Sem dados para exibir</p>
      <p className="text-muted-foreground mt-1 text-xs">Importe um arquivo para ver os dados</p>
    </div>
  )
}

export function C5ComplianceChart() {
  const { isLoading, breakdown } = useC5Analytics()
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Adesão por critério (C5)</CardTitle>
        <CardDescription className="text-xs">
          Hipertensos — cumprimento por critério de cuidado
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="bg-muted/40 h-[220px] animate-pulse rounded-lg" />
        ) : breakdown.total === 0 ? (
          <EmptyState />
        ) : (
          <CriteriaBarChart data={breakdown.criteriaStats} />
        )}
      </CardContent>
    </Card>
  )
}

export function C6ComplianceChart() {
  const { isLoading, breakdown } = useC6Analytics()
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Adesão por critério (C6)</CardTitle>
        <CardDescription className="text-xs">
          Idosos — cumprimento por critério de cuidado
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="bg-muted/40 h-[220px] animate-pulse rounded-lg" />
        ) : breakdown.total === 0 ? (
          <EmptyState />
        ) : (
          <CriteriaBarChart data={breakdown.criteriaStats} />
        )}
      </CardContent>
    </Card>
  )
}

export function C7ComplianceChart() {
  const { isLoading, breakdown } = useC7Analytics()
  const data: StatRow[] = breakdown.criteriaStats.map((s) => ({
    id: s.id,
    label: s.label,
    pctAchieved: s.pctAchieved,
    achieved: s.achieved,
    total: s.eligible ?? s.total,
  }))
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Adesão por critério (C7)</CardTitle>
        <CardDescription className="text-xs">
          Saúde da mulher — cumprimento por critério de cuidado
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="bg-muted/40 h-[220px] animate-pulse rounded-lg" />
        ) : breakdown.total === 0 ? (
          <EmptyState />
        ) : (
          <CriteriaBarChart data={data} />
        )}
      </CardContent>
    </Card>
  )
}
