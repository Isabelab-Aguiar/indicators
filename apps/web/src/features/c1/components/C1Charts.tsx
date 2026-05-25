'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { C1AnalyticsData } from '../types/c1.types'
import { C1_TIPO_LABELS, C1_CHART_COLORS, C1_THRESHOLDS } from '../constants/c1.constants'

export function C1DistribuicaoChart({ analytics }: { analytics: C1AnalyticsData }) {
  const data = [
    {
      name: 'Programada',
      value: analytics.distribuicao.programada,
      color: C1_CHART_COLORS.programada,
    },
    {
      name: 'Espontânea',
      value: analytics.distribuicao.espontanea,
      color: C1_CHART_COLORS.espontanea,
    },
  ]
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={110} dataKey="value">
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function C1EvolucaoChart({ analytics }: { analytics: C1AnalyticsData }) {
  const data = [...analytics.evolucaoMensal].reverse()
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="periodo" tick={{ fontSize: 10 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
        <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
        <ReferenceLine
          y={C1_THRESHOLDS.OTIMO_MIN}
          strokeDasharray="4 4"
          stroke={C1_CHART_COLORS.referencia_otimo_min}
          strokeOpacity={0.7}
        />
        <ReferenceLine
          y={C1_THRESHOLDS.OTIMO_MAX}
          strokeDasharray="4 4"
          stroke={C1_CHART_COLORS.referencia_otimo_max}
          strokeOpacity={0.7}
        />
        <Area
          type="monotone"
          dataKey="percentual"
          stroke={C1_CHART_COLORS.evolucao}
          fill={C1_CHART_COLORS.evolucao}
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function C1ProgramadaChart({ analytics }: { analytics: C1AnalyticsData }) {
  const data = Object.entries(analytics.composicaoProgramada).map(([key, value]) => ({
    name: C1_TIPO_LABELS[key] ?? key,
    value,
  }))
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis type="number" tick={{ fontSize: 10 }} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={160} />
        <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={C1_CHART_COLORS.programada} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function C1EspontaneaChart({ analytics }: { analytics: C1AnalyticsData }) {
  const espontaneaColors = [
    C1_CHART_COLORS.espontanea_escuta,
    C1_CHART_COLORS.espontanea_dia,
    C1_CHART_COLORS.espontanea_urgencia,
  ]
  const data = Object.entries(analytics.composicaoEspontanea).map(([key, value]) => ({
    name: C1_TIPO_LABELS[key] ?? key,
    value,
  }))
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis type="number" tick={{ fontSize: 10 }} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={160} />
        <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={espontaneaColors[i % espontaneaColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
