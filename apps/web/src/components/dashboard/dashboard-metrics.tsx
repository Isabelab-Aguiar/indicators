'use client'

import { Activity, AlertCircle, Heart, Home } from 'lucide-react'
import { motion } from 'framer-motion'

import { Card } from '@repo/ui'
import { useDashboardMetrics } from '@/hooks/use-dashboard'
import { MetricSkeleton } from './metric-skeleton'

interface MetricSpec {
  label: string
  value: number
  description: string
  icon: React.ElementType
  text: string
  bar: string
  ring: string
}

export function DashboardMetrics() {
  const { data, isLoading } = useDashboardMetrics()

  if (isLoading) return <MetricSkeleton />

  const metrics: MetricSpec[] = [
    {
      label: 'Total Gestantes',
      value: data?.total ?? 0,
      description: 'cadastradas nesta ESF',
      icon: Activity,
      text: 'text-blue-600 dark:text-blue-400',
      bar: 'bg-blue-500',
      ring: 'ring-blue-500/15',
    },
    {
      label: 'Pré-natal em Dia',
      value: data?.withPrenatalUpToDate ?? 0,
      description: '≥ 6 consultas realizadas',
      icon: Heart,
      text: 'text-emerald-600 dark:text-emerald-400',
      bar: 'bg-emerald-500',
      ring: 'ring-emerald-500/15',
    },
    {
      label: 'PA Alterada',
      value: data?.withHighBloodPressure ?? 0,
      description: 'requerem atenção',
      icon: AlertCircle,
      text: 'text-red-600 dark:text-red-400',
      bar: 'bg-red-500',
      ring: 'ring-red-500/15',
    },
    {
      label: 'Visitadas no Mês',
      value: data?.visitedThisMonth ?? 0,
      description: 'visita domiciliar recente',
      icon: Home,
      text: 'text-violet-600 dark:text-violet-400',
      bar: 'bg-violet-500',
      ring: 'ring-violet-500/15',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.label} metric={metric} index={index} />
      ))}
    </div>
  )
}

interface MetricCardProps {
  metric: MetricSpec
  index: number
}

function MetricCard({ metric, index }: MetricCardProps) {
  const Icon = metric.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card className="border-border/60 relative overflow-hidden p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]">
        <div className={`absolute inset-x-0 top-0 h-[2px] ${metric.bar}`} />
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
              {metric.label}
            </p>
            <p className="text-foreground text-3xl font-bold tabular-nums tracking-tight">
              {metric.value}
            </p>
            <p className="text-muted-foreground text-xs">{metric.description}</p>
          </div>
          <div
            className={`bg-card flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${metric.ring}`}
          >
            <Icon className={`h-4 w-4 ${metric.text}`} />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
