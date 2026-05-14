'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { useMicroareaStats } from '@/hooks/use-dashboard'

const BAR_FILL = 'hsl(var(--primary))'

interface TooltipProps {
  active?: boolean
  payload?: Array<{ payload?: { microarea: string; total: number } }>
}

function ChartTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0]?.payload
  if (!item) return null
  return (
    <div className="border-border bg-card rounded-lg border p-2.5 shadow-lg">
      <p className="text-foreground text-xs font-semibold">Microárea {item.microarea}</p>
      <p className="text-muted-foreground mt-0.5 text-[11px] tabular-nums">
        {item.total} gestante{item.total === 1 ? '' : 's'}
      </p>
    </div>
  )
}

export function MicroareaChart() {
  const { data, isLoading } = useMicroareaStats()

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Gestantes por microárea</CardTitle>
        <CardDescription className="text-xs">Distribuição por área de cobertura</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="bg-muted/40 h-[240px] animate-pulse rounded-lg" />
        ) : !data?.length ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 8, right: 0, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="microarea"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.4 }}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={56}>
                {data.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={BAR_FILL} fillOpacity={0.85} />
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
    <div className="flex h-[240px] flex-col items-center justify-center">
      <p className="text-muted-foreground text-sm font-medium">Sem dados ainda</p>
      <p className="text-muted-foreground mt-1 text-xs">
        Importe gestantes para visualizar a distribuição
      </p>
    </div>
  )
}
