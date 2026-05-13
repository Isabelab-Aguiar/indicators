'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { useMicroareaStats } from '@/hooks/use-dashboard'

export function MicroareaChart() {
  const { data, isLoading } = useMicroareaStats()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Gestantes por Microárea</CardTitle>
        <CardDescription className="text-xs">Distribuição por área de cobertura</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="bg-muted h-48 animate-pulse rounded-lg" />
        ) : !data?.length ? (
          <div className="flex h-48 items-center justify-center">
            <p className="text-muted-foreground text-sm">Nenhum dado disponível</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={192}>
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                cursor={{ fill: 'hsl(var(--accent))' }}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
