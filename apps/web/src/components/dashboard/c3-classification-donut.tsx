'use client'

import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { useC3Analytics } from '@/hooks/use-c3-analytics'

type ClassificationKey = 'otimo' | 'bom' | 'suficiente' | 'regular'

interface SliceConfig {
  key: ClassificationKey
  label: string
  fill: string
  text: string
}

const SLICES: SliceConfig[] = [
  { key: 'otimo', label: 'Ótimo', fill: '#10b981', text: 'text-emerald-600 dark:text-emerald-400' },
  { key: 'bom', label: 'Bom', fill: '#3b82f6', text: 'text-blue-600 dark:text-blue-400' },
  {
    key: 'suficiente',
    label: 'Suficiente',
    fill: '#f59e0b',
    text: 'text-amber-600 dark:text-amber-400',
  },
  { key: 'regular', label: 'Regular', fill: '#ef4444', text: 'text-red-600 dark:text-red-400' },
]

interface SliceData {
  key: ClassificationKey
  label: string
  value: number
  fill: string
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ payload?: SliceData }>
}

function ChartTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0]?.payload
  if (!item) return null
  return (
    <div className="border-border bg-card rounded-lg border p-2.5 shadow-lg">
      <p className="text-foreground text-xs font-semibold">{item.label}</p>
      <p className="text-muted-foreground mt-0.5 text-[11px] tabular-nums">
        {item.value} gestante{item.value === 1 ? '' : 's'}
      </p>
    </div>
  )
}

export function C3ClassificationDonut() {
  const { isLoading, breakdown } = useC3Analytics()

  const slices = useMemo<SliceData[]>(() => {
    return SLICES.map((s) => ({
      key: s.key,
      label: s.label,
      fill: s.fill,
      value: breakdown.patients.filter((p) => p.classification === s.key).length,
    }))
  }, [breakdown.patients])

  const total = slices.reduce((sum, s) => sum + s.value, 0)

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Distribuição por classificação</CardTitle>
        <CardDescription className="text-xs">
          Quantas gestantes em cada faixa de pontuação
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="bg-muted/40 h-[280px] animate-pulse rounded-lg" />
        ) : total === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="relative" style={{ width: 180, height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={slices}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={56}
                    outerRadius={82}
                    strokeWidth={0}
                    paddingAngle={2}
                  >
                    {slices.map((slice) => (
                      <Cell key={slice.key} fill={slice.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-foreground text-2xl font-bold tabular-nums leading-none">
                  {total}
                </span>
                <span className="text-muted-foreground mt-1 text-[10px] uppercase tracking-wider">
                  total
                </span>
              </div>
            </div>
            <Legend slices={slices} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Legend({ slices }: { slices: SliceData[] }) {
  return (
    <ul className="flex-1 space-y-2">
      {slices.map((slice) => (
        <li key={slice.key} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: slice.fill }} />
            <span className="text-foreground text-xs font-medium">{slice.label}</span>
          </span>
          <span className="text-muted-foreground text-xs font-semibold tabular-nums">
            {slice.value}
          </span>
        </li>
      ))}
    </ul>
  )
}

function EmptyState() {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center">
      <p className="text-muted-foreground text-sm font-medium">Sem gestantes para classificar</p>
      <p className="text-muted-foreground mt-1 text-xs">Importe um CSV para ver os dados</p>
    </div>
  )
}
