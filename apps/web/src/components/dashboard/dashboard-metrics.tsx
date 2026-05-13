'use client'

import { Activity, AlertCircle, Heart, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { useDashboardMetrics } from '@/hooks/use-dashboard'
import { MetricSkeleton } from './metric-skeleton'

export function DashboardMetrics() {
  const { data, isLoading } = useDashboardMetrics()

  if (isLoading) return <MetricSkeleton />

  const metrics = [
    {
      label: 'Total Gestantes',
      value: data?.total ?? 0,
      description: 'cadastradas nesta ESF',
      icon: Activity,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: 'Pré-natal em Dia',
      value: data?.withPrenatalUpToDate ?? 0,
      description: '≥ 6 consultas realizadas',
      icon: Heart,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      label: 'PA Alterada',
      value: data?.withHighBloodPressure ?? 0,
      description: 'requerem atenção',
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-950/30',
    },
    {
      label: 'Visitadas no Mês',
      value: data?.visitedThisMonth ?? 0,
      description: 'visita domiciliar recente',
      icon: Home,
      color: 'text-violet-500',
      bg: 'bg-violet-50 dark:bg-violet-950/30',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {metric.label}
              </CardTitle>
              <div className={`rounded-lg p-2 ${metric.bg}`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-foreground text-2xl font-bold">{metric.value}</div>
              <p className="text-muted-foreground mt-1 text-xs">{metric.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
