'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { useC1Execucoes } from '@/features/c1/hooks/useC1Execucoes'

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value?: number }>
  label?: string
}

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  const val = payload[0]?.value
  return (
    <div className="border-border bg-card rounded-lg border p-3 shadow-lg">
      <p className="text-foreground text-xs font-semibold">{label}</p>
      <p className="text-muted-foreground mt-1 text-[11px] tabular-nums">
        {val?.toFixed(1)}% consultas programadas
      </p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-[220px] flex-col items-center justify-center">
      <p className="text-muted-foreground text-sm font-medium">Sem dados para exibir</p>
      <p className="text-muted-foreground mt-1 text-xs">Importe um arquivo PDF ou CSV do C1</p>
    </div>
  )
}

export function C1EvolutionChart() {
  const { isLoading, data } = useC1Execucoes()

  const chartData = (data ?? [])
    .slice()
    .sort((a, b) => a.periodo.localeCompare(b.periodo))
    .map((e) => ({
      periodo: e.periodo,
      percentual: Number(e.percentual),
    }))

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Evolução mensal (C1)</CardTitle>
        <CardDescription className="text-xs">
          Percentual de consultas programadas por período
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="bg-muted/40 h-[220px] animate-pulse rounded-lg" />
        ) : chartData.length === 0 ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
                strokeOpacity={0.5}
              />
              <XAxis
                dataKey="periodo"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v: number) => `${v}%`}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip content={<ChartTooltip />} />
              {/* Faixa ideal 50–70% */}
              <Line
                type="monotone"
                dataKey="percentual"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
