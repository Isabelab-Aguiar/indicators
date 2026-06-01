'use client'

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { useAllIndicatorsData, type IndicatorBar } from './use-all-indicators-data'

function fillForScore(score: number): string {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#3b82f6'
  if (score >= 40) return '#f59e0b'
  return '#ef4444'
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ payload?: IndicatorBar }>
}

function ChartTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0]?.payload
  if (!item || item.score === null) return null
  return (
    <div className="border-border bg-card rounded-lg border p-3 shadow-lg">
      <p className="text-foreground text-xs font-semibold">{item.label}</p>
      <p className="text-muted-foreground mt-1 text-[11px] tabular-nums">
        Score médio: <span className="font-bold">{item.score.toFixed(1)}</span>
      </p>
      <p className="text-muted-foreground text-[11px] tabular-nums">
        {item.total} {item.total === 1 ? 'paciente' : 'pacientes'}
      </p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center">
      <p className="text-muted-foreground text-sm font-medium">Sem dados para exibir</p>
      <p className="text-muted-foreground mt-1 text-xs">
        Importe arquivos de cada indicador para ver os dados
      </p>
    </div>
  )
}

const SCORE_LEGEND = [
  { color: '#10b981', label: 'Ótimo: 80 ou mais' },
  { color: '#3b82f6', label: 'Bom: 60 ou mais' },
  { color: '#f59e0b', label: 'Suficiente: 40 ou mais' },
  { color: '#ef4444', label: 'Regular: abaixo de 40' },
]

export function AllIndicatorsChart() {
  const { isLoading, data } = useAllIndicatorsData()
  const hasAnyData = data.some((d) => d.score !== null)

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Visão geral: todos os indicadores</CardTitle>
        <CardDescription className="text-xs">
          Score médio por indicador Previne Brasil
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="bg-muted/40 h-[220px] animate-pulse rounded-lg" />
        ) : !hasAnyData ? (
          <EmptyState />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
                barCategoryGap={10}
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
                  dataKey="shortCode"
                  tick={{ fontSize: 11, fontWeight: 700, fill: 'hsl(var(--foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.35 }}
                />
                <Bar dataKey="scoreDisplay" radius={[0, 6, 6, 0]} barSize={20}>
                  {data.map((entry, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={
                        entry.score !== null
                          ? fillForScore(entry.score)
                          : 'hsl(var(--muted-foreground) / 0.2)'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {SCORE_LEGEND.map((item) => (
                <span key={item.label} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground text-[10px]">{item.label}</span>
                </span>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
